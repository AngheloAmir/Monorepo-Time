import { Request, Response, Router } from "express";
import { exec } from "child_process";
import path from "path";
import killPort from "kill-port";
import { loadInstances, saveInstances, isPortInUse, findAvailablePort, clean } from "./_tui";

// Dynamic import for ESM-only package in CommonJS/ts-node environment
const opencodeSdkPromise = (new Function('specifier', 'return import(specifier)'))("@opencode-ai/sdk");

const router = Router();

export interface OpencodeInstance {
    server?: { close: () => void; url: string };
    url: string;
    port: number;
    id: string;
    name: string;
    pid?: number;
    createdAt: number;
    lastSessionId?: string;
}

export let opencodeInstances = new Map<string, OpencodeInstance>();
loadInstances();
router.get("/checkinstalled", async (req: Request, res: Response) => {
    const checkCommand = (cmd: string): Promise<boolean> => {
        return new Promise((resolve) => {
            exec(cmd, (error) => {
                resolve(!error);
            });
        });
    };

    try {
        const [isOpencodeInPath, isNpmPackageInstalled] = await Promise.all([
            checkCommand("command -v opencode"),
            checkCommand("npm list -g opencode-ai --depth=0")
        ]);

        res.json({
            installed: isOpencodeInPath || isNpmPackageInstalled,
            isInPath: isOpencodeInPath,
            isNpmGlobal: isNpmPackageInstalled
        });
    } catch (err) {
        console.error("Error checking opencode usage:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


router.get("/list", (req: Request, res: Response) => {
    const instances = Array.from(opencodeInstances.values()).map(instance => ({
        id: instance.id,
        url: instance.url,
        port: instance.port,
        name: instance.name,
        
        // 'detached' means we lost the handle but it might still be running
        status: instance.server ? "active" : "detached", 
        createdAt: instance.createdAt,
        lastSessionId: instance.lastSessionId
    }));
    res.json({ instances });
});

router.post("/identify", async (req: Request, res: Response) => {
    await loadInstances();
    await clean(); // Handles port collisions and dead ports for all instances

    // After clean(), opencodeInstances only contains valid, unique-per-port entries
    const instances = Array.from(opencodeInstances.values()).map(instance => ({
        id: instance.id,
        name: instance.name,
        port: instance.port,
        status: instance.server ? "active" : "detached"
    }));

    res.json({
        message: "Identification and cleanup complete",
        instances,
        count: instances.length
    });
});

router.post("/clean", async (req: Request, res: Response) => {
    await loadInstances();
    await clean();
    res.json({ success: true, message: "Cleanup completed", currentCount: opencodeInstances.size });
});

// Route to start a new Opencode instance
router.post("/add", async (req: Request, res: Response) => {
    const id = (req.body.id as string) || Math.random().toString(36).substring(7);
    const name = (req.body.name as string) || `Instance ${id}`;
    const reset = req.body.reset === true;

    // If instance already exists, return its info
    if (opencodeInstances.has(id)) {
        const instance = opencodeInstances.get(id)!;

        if (reset) {
            instance.lastSessionId = undefined;
            await saveInstances();
        }

        return res.json({
            status: "running",
            url: instance.url,
            id: instance.id,
            port: instance.port,
            name: instance.name,
            lastSessionId: instance.lastSessionId,
            message: reset ? "Instance already running, session reset" : "Instance already running"
        });
    }

    try {
        // Find a free port starting from 4096
        const port = await findAvailablePort(4096);

        // Use the memoized SDK import
        const { createOpencode } = await opencodeSdkPromise;

        // Change directory to the workspace root temporarily to ensure Opencode starts there
        // This allows it to pick up local config (opencode.json) and tools correctly
        const projectRoot = path.resolve(process.cwd(), "../../");
        const originalCwd = process.cwd();

        console.log(`Starting Opencode in root: ${projectRoot}`);
        process.chdir(projectRoot);

        try {
            const opencode = await createOpencode({
                hostname: "127.0.0.1",
                port: port,
                config: {
                    model: "anthropic/claude-3-5-sonnet-20241022",
                },
            });

            const instance: OpencodeInstance = {
                server: opencode.server,
                url: opencode.server.url,
                port,
                id,
                name,
                createdAt: Date.now(),
                pid: process.pid,
                lastSessionId: undefined // Fresh start
            };

            opencodeInstances.set(id, instance);
            await saveInstances();

            res.json({
                status: "started",
                url: opencode.server.url,
                id,
                name,
                port
            });
        } finally {
            // Restore original CWD
            process.chdir(originalCwd);
        }

    } catch (error: any) {
        console.error("Failed to start opencode instance:", error);
        if (error.code === 'ENOENT') {
            console.error("Executable 'opencode' not found in PATH. Please ensure the Opencode CLI is installed.");
            return res.status(500).json({ error: "Opencode CLI not found. Please install it." });
        }
        res.status(500).json({ error: error.message });
    }
});

// Route to stop an instance
router.post("/stop", async (req: Request, res: Response) => {
    const { id } = req.body;

    if (!id) {
        return res.status(400).json({ error: "Instance ID is required" });
    }

    if (opencodeInstances.has(id)) {
        const instance = opencodeInstances.get(id)!;

        try {
            if (instance.server) {
                instance.server.close();
                await killPort(instance.port);
                console.log(`Force killed port ${instance.port} for detached instance ${id}`);
            }
        } catch (e) {
            console.error(`Error closing instance ${id}:`, e);
            // Fallback: try to kill port anyway if close fails
            try {
                await killPort(instance.port);
            } catch (kpe) {
                console.error("Failed to force kill port:", kpe);
            }
        }

        opencodeInstances.delete(id);
        await saveInstances();

        console.log(`Opencode instance ${id} stopped`);
        res.json({ success: true, message: "Instance stopped" });
    } else {
        res.status(404).json({ error: "Instance not found" });
    }
});

// Route to change instance name
router.post("/change-name", async (req: Request, res: Response) => {
    const { id, name } = req.body;

    if (!id || !name) {
        return res.status(400).json({ error: "Instance ID and new Name are required" });
    }

    if (opencodeInstances.has(id)) {
        const instance = opencodeInstances.get(id)!;
        instance.name = name;
        opencodeInstances.set(id, instance); // Update map
        await saveInstances(); // Update disk
        res.json({ success: true, message: "Instance updated", instance: { id, name } });
    } else {
        res.status(404).json({ error: "Instance not found" });
    }
});


router.post("/chat", async (req: Request, res: Response) => {
    const {
        instanceId,
        message,
        sessionId: reqSessionId
    } = req.body;

    if (!instanceId || !message) {
        return res.status(400).json({ error: "instanceId and message are required" });
    }

    const instance = opencodeInstances.get(instanceId);

    if (!instance) {
        return res.status(404).json({ error: "Instance not found" });
    }

    // 1. Set headers for Server-Sent Events (SSE)
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    try {
        const { createOpencode } = await opencodeSdkPromise;

        const client = createOpencode({
            baseUrl: instance.url,
        });

        // 3. Handle session: reuse existing, use provided, or create new
        let sessionId = reqSessionId || instance.lastSessionId;

        if (!sessionId) {
            console.log(`Creating new session for instance ${instanceId}`);
            const session = await client.session.create();
            sessionId = session.data.id;
            instance.lastSessionId = sessionId;
            await saveInstances(); // Persist the new session ID
        }

        // 4. Send the prompt and stream the result
        const stream = await client.session.prompt({
            path: { id: sessionId },
            body: {
                parts: [{ type: "text", text: message }],
                stream: true
            }
        });

        // 5. Pipe the OpenCode stream to the Express response
        for await (const chunk of stream) {
            // Some SDKs return an object with a 'data' or 'choices' property
            // We'll pass the whole chunk as JSON
            res.write(`data: ${JSON.stringify(chunk)}\n\n`);

            // @ts-ignore - flush exists in some express setups (with compression)
            if (res.flush) res.flush();
        }

        res.write('data: [DONE]\n\n');
        res.end();

    } catch (error: any) {
        console.error("Streaming error:", error);
        res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
        res.end();
    }
});

router.post("/chat/reset", async (req: Request, res: Response) => {
    const { instanceId } = req.body;

    if (!instanceId) {
        return res.status(400).json({ error: "Instance ID is required" });
    }

    if (opencodeInstances.has(instanceId)) {
        const instance = opencodeInstances.get(instanceId)!;
        instance.lastSessionId = undefined;
        await saveInstances();
        res.json({ success: true, message: "Session reset for instance " + instanceId });
    } else {
        res.status(404).json({ error: "Instance not found" });
    }
});

export default router;

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
    try {
        const { id } = req.body;
        if (!id) 
            return res.status(400).json({ error: "Instance ID is required" });
        
        if (opencodeInstances.has(id)) {
            const instance = opencodeInstances.get(id)!;
            if (instance.server) {
                instance.server.close();
                await killPort(instance.port);
                console.log(`Force killed port ${instance.port} for detached instance ${id}`);
            }

            opencodeInstances.delete(id);
            await saveInstances();
            console.log(`Opencode instance ${id} stopped`);
            res.json({ success: true, message: "Instance stopped" });
        } else {
            res.status(404).json({ error: "Instance not found" });
        }
    } catch (e) {
        res.status(500).json({ error: e });
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
});


export default router;

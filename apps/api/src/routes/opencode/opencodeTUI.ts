import { Request, Response, Router } from "express";
import { exec } from "child_process";
import killPort from "kill-port";
import { loadInstances, saveInstances, isPortInUse, findAvailablePort } from "./_tui";


const router = Router();

export interface OpencodeInstance {
    server?: { close: () => void; url: string };
    url: string;
    port: number;
    id: string;
    name: string;
    pid?: number;
    createdAt: number;
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
            installed:   isOpencodeInPath || isNpmPackageInstalled,
            isInPath:    isOpencodeInPath,
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
        status: instance.server ? "active" : "detached", // 'detached' means we lost the handle but it might still be running
        createdAt: instance.createdAt
    }));
    res.json({ instances });
});

router.post("/identify", async (req: Request, res: Response) => {
    await loadInstances(); // Reload from disk to be sure

    const activeList: OpencodeInstance[] = [];
    const deadList: string[] = [];

    for (const [id, instance] of opencodeInstances.entries()) {
        const inUse = await isPortInUse(instance.port);
        if (inUse) {
            activeList.push(instance);
        } else {
            deadList.push(id);
            opencodeInstances.delete(id);
        }
    }

    if (deadList.length > 0) {
        await saveInstances(); // Update disk
    }

    res.json({
        message: "Identification complete",
        active: activeList.length,
        removed: deadList.length,
        removedIds: deadList
    });
});

// Route to start a new Opencode instance
router.post("/add", async (req: Request, res: Response) => {
    const id = (req.body.id as string) || Math.random().toString(36).substring(7);
    const name = (req.body.name as string) || `Instance ${id}`;

    // If instance already exists, return its info
    if (opencodeInstances.has(id)) {
        const instance = opencodeInstances.get(id)!;
        return res.json({
            status: "running",
            url: instance.url,
            id: instance.id,
            port: instance.port,
            name: instance.name,
            message: "Instance already running"
        });
    }

    try {
        // Find a free port starting from 4096
        const port = await findAvailablePort(4096);


        // Workaround to import ESM-only package in CommonJS/ts-node environment
        const dynamicImport = new Function('specifier', 'return import(specifier)');
        const { createOpencode } = await dynamicImport("@opencode-ai/sdk");

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
            pid: process.pid // The SDK runs in the current process
        };

        opencodeInstances.set(id, instance);
        await saveInstances();

        console.log(`Opencode instance ${id} (${name}) started at ${opencode.server.url}`);

        res.json({
            status: "started",
            url: opencode.server.url,
            id,
            name,
            port
        });

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
                // We have the server handle, close it gracefully
                instance.server.close();
            } else {
                // We don't have the handle (restored from JSON), but the port might still be in use.
                // Since it's likely a zombie process or the same process ID, we can't easily "close" it 
                // without killing the process on that port.
                // For now, we'll just remove it from our records. 
                // A more aggressive approach would be to use 'tree-kill' or 'kill-port' here.
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

export default router;

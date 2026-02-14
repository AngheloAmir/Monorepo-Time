import { Request, Response, Router } from "express";
import path from "path";
import { findAvailablePort } from "./_helper";
import { OpencodeInstance, opencodeInstances } from "./_core";

const opencodeSdkPromise = (new Function('specifier', 'return import(specifier)'))("@opencode-ai/sdk");
const router             = Router();

router.post("/", async (req: Request, res: Response) => {
    const { createOpencode } = await opencodeSdkPromise;
    const id    = (req.body.id   as string) || Math.random().toString(36).substring(6);
    const name  = (req.body.name as string) || `Instance ${id}`;
    const model = req.body.model as string; // Optional model from body
    const reset = req.body.reset === true;

    // If instance already exists, check if it's actually alive
    if (opencodeInstances.has(id)) {
        const instance = opencodeInstances.get(id)!;
        const { isPortInUse } = await import("./_helper");
        const alive = await isPortInUse(instance.port);

        if (alive) {
            if (reset) {
                instance.lastSessionId = undefined;
            }

            return res.json({
                status:        "running",
                url:           instance.url,
                id:            instance.id,
                port:          instance.port,
                name:          instance.name,
                lastSessionId: instance.lastSessionId,
                message:       reset ? "Instance already running, session reset" : "Instance already running"
            });
        } else {
            // Port is dead, remove stale record and continue to create a new one
            console.log(`Instance ${id} found in map but port ${instance.port} is dead. Restarting...`);
            opencodeInstances.delete(id);
        }
    }

    try {
        const port          = await findAvailablePort(4096);
        const projectRoot   = path.resolve(process.cwd(), "../../");
        const originalCwd   = process.cwd();

        console.log(`Starting Opencode in root: ${projectRoot}`);
        process.chdir(projectRoot);

        try {
            const opencode = await createOpencode({
                hostname: "127.0.0.1",
                port: port,
                config: {
                    ...(model ? { model } : {}),
                },
            });

            const instance: OpencodeInstance = {
                server:         opencode.server,
                url:            opencode.server.url,
                port:           port,
                id:             id,
                name:           name,
                createdAt:      Date.now(),
                pid:            process.pid,
                lastSessionId:  undefined
            };

            opencodeInstances.set(id, instance);
            const { server, ...responseInstance } = instance;
            res.json(responseInstance);
        } finally {
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

export default router;

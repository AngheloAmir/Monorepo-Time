import { Request, Response, Router } from "express";
import killPort from "kill-port";
import { opencodeInstances } from "./core";
import { exec } from "child_process";

const router = Router();

router.get("/check", async (req: Request, res: Response) => {
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
            console.log(`Opencode instance ${id} stopped`);
            res.json({ success: true, message: "Instance stopped" });
        } else {
            res.status(404).json({ error: "Instance not found" });
        }
    } catch (e) {
        res.status(500).json({ error: e });
    }
});

router.post("/setname", async (req: Request, res: Response) => {
    const { id, name } = req.body;

    if (!id || !name) {
        return res.status(400).json({ error: "Instance ID and new Name are required" });
    }

    if (opencodeInstances.has(id)) {
        const instance = opencodeInstances.get(id)!;
        instance.name = name;
        opencodeInstances.set(id, instance); // Update map
        res.json({ success: true, message: "Instance updated", instance: { id, name } });
    } else {
        res.status(404).json({ error: "Instance not found" });
    }
});


export default router;

import { Request, Response, Router } from "express";
import { activeProcesses, sockets } from "./runcmddev";
import { WorkspaceInfo } from "types";
import chalk from "chalk";
import { exec } from "child_process";

const router = Router();

interface RequestBody {
    workspace: WorkspaceInfo;
}

router.post("/", async (req: Request, res: Response) => {
    res.header("Access-Control-Allow-Origin", "*");

    try {
        const body = req.body as RequestBody;
        const workspace = body.workspace;

        if (!workspace || !workspace.name) {
            return res.status(400).json({ error: "No workspace provided" });
        }

        const currentProcess = activeProcesses.get(workspace.name);
        const currentSocket  = sockets.get(workspace.name);

        if (currentProcess) {
            currentSocket?.emit('log', chalk.yellow("Stopping process tree..."));
            
            if (currentProcess.pid) {
                if (process.platform === 'win32') {
                    // Windows: taskkill /T kills tree, /F forces
                    exec(`taskkill /pid ${currentProcess.pid} /T /F`, (err) => {
                         if(err) {
                             // If taskkill fails, try standard kill as fallback
                             currentProcess.kill();
                         }
                    });
                } else {
                    // Linux/Mac: Kill process group (requires detached=true in spawn)
                    try {
                        // Use SIGKILL to ensure it stops immediately
                        process.kill(-currentProcess.pid, 'SIGKILL');
                    } catch (e: any) {
                        // Fallback if not detached or other error
                        currentProcess.kill('SIGKILL');
                    }
                }
            } else {
                currentProcess.kill();
            }
            
            activeProcesses.delete(workspace.name);
            currentSocket?.emit('exit', 'Process stopped by user');
            
            res.json({ success: true, message: `Process for ${workspace.name} stopped` });
        } else {
            res.json({ success: true, message: "No active process to stop" });
        }

    } catch (e: any) {
        console.error("Error in stopcmd:", e);
        res.status(500).json({ error: e.message });
    }
});

export default router;




import express from 'express';
import MonorepoTemplates from 'template';
import { WorkspaceInfo } from 'types';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import util from 'util';

const execPromise = util.promisify(exec);
const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { workspace, templatename } = req.body as { workspace: WorkspaceInfo, templatename: string };

        if (!workspace || !workspace.path || !templatename) {
            return res.status(400).json({ error: "Missing workspace info or template name" });
        }

        const workspacePath = workspace.path; 

        // Find the template
        let foundTemplate = null;
        
        const categories = ['project', 'database', 'services'] as const;
        for (const cat of categories) {
            const list = MonorepoTemplates[cat];
            if (Array.isArray(list)) {
                const match = list.find(t => t.name === templatename);
                if (match) {
                    foundTemplate = match;
                    break;
                }
            }
        }

        if (!foundTemplate) {
            return res.status(404).json({ error: `Template '${templatename}' not found` });
        }

        console.log(`Applying template '${templatename}' to ${workspacePath}...`);

        // Process templating actions
        for (const step of foundTemplate.templating) {
            if (step.action === 'command' && step.command) {
                console.log(`Executing command: ${step.command}`);
                const isWin = process.platform === "win32";
                let shell: string | undefined = isWin ? undefined : "/bin/sh";
                if (!isWin && fs.existsSync("/bin/bash")) {
                    shell = "/bin/bash";
                }

                try {
                    await execPromise(step.command, { cwd: workspacePath, shell, env: process.env });
                } catch (cmdErr: any) {
                    console.error(`Command failed: ${step.command}`, cmdErr);
                     // Decide if we want to stop or continue. Usually stopping is safer.
                    return res.status(500).json({ error: `Command failed: ${step.command}\n${cmdErr.message}` });
                }
            } else if (step.action === 'file' && step.file && step.filecontent !== undefined) {
                 console.log(`Creating file: ${step.file}`);
                 const filePath = path.join(workspacePath, step.file);
                 const dirName = path.dirname(filePath);

                 // Ensure directory exists
                 if (!fs.existsSync(dirName)) {
                     fs.mkdirSync(dirName, { recursive: true });
                 }

                 fs.writeFileSync(filePath, step.filecontent);
            }
        }

        res.json({ success: true, message: "Template applied successfully" });

    } catch (error: any) {
        console.error("Error setting workspace template:", error);
        res.status(500).json({ error: "Failed to apply template: " + error.message });
    }
});

export default router;

import { Router, Request, Response } from 'express';
import { exec } from 'child_process';
import { promisify } from 'util';
import { ROOT } from './rootPath';

const execAsync = promisify(exec);
const router = Router();

// Helper to run git command in ROOT
async function runGit(command: string) {
    const { stdout, stderr } = await execAsync(command, { cwd: ROOT });
    // git push and other commands might write to stderr for progress, not necessarily errors.
    // We log it but don't throw unless the command failed (which execAsync does).
    if (stderr) {
        console.log('Git Output (stderr):', stderr);
    }
    return stdout.trim();
}

router.get('/history', async (req: Request, res: Response) => {
    try {
        // Format: Hash | Message | Relative Date
        const output = await runGit('git log -n 10 --pretty=format:"%h|%s|%ar"');
        const history = output.split('\n').filter(Boolean).map(line => {
            const parts = line.split('|');
            return { 
                hash: parts[0], 
                message: parts[1], 
                date: parts[2] 
            };
        });
        res.json({ history });
    } catch (error: any) {
        if (!error.message?.includes('not a git repository')) {
            console.error("Git History Error:", error);
        }
        res.status(500).json({ error: error.message });
    }
});

router.get('/branch', async (req: Request, res: Response) => {
    try {
        const branch = await runGit('git branch --show-current');
        res.json({ branch });
    } catch (error: any) {
        if (!error.message?.includes('not a git repository')) {
            console.error("Git Branch Error:", error);
        }
        res.status(500).json({ error: error.message });
    }
});

router.post('/revert', async (req: Request, res: Response) => {
    try {
        const { hash } = req.body;
        if (!hash) {
             res.status(400).json({ error: "Hash is required" });
             return;
        }

        // Non-destructive revert:
        // 1. Get current HEAD to use as parent
        const currentHead = await runGit('git rev-parse HEAD');
        
        // 2. Create a new commit object that has:
        //    - The TREE of the target hash (effectively restoring that state)
        //    - The PARENT of the current HEAD (maintaining history)
        //    - A message indicating the revert
        const newCommitHash = await runGit(`git commit-tree ${hash}^{tree} -p ${currentHead} -m "Reverted to ${hash}"`);
        
        // 3. Move HEAD to this new commit and update the working directory
        await runGit(`git reset --hard ${newCommitHash}`);

        res.json({ success: true, message: `Reverted to ${hash}` });
    } catch (error: any) {
        console.error("Git Revert Error:", error);
        res.status(500).json({ error: error.message });
    }
});

router.post('/push', async (req: Request, res: Response) => {
    try {
        const { message } = req.body;
        if (!message) {
            res.status(400).json({ error: "Message is required" });
            return;
        }
        
        try {
            await runGit('git add .');
            // Escape quotes in message
            const safeMessage = message.replace(/"/g, '\\"');
            await runGit(`git commit -m "${safeMessage}"`);
        } catch (e: any) {
           // Ignore "nothing to commit" errors
           if (e.stdout && e.stdout.includes('nothing to commit')) {
               // proceed to push
           } else if (e.message && e.message.includes('nothing to commit')) {
                // proceed
           } else {
               throw e;
           }
        }
        
        await runGit('git push');
        res.json({ success: true });
    } catch (error: any) {
        console.error("Git Push Error:", error);
        res.status(500).json({ error: error.message });
    }
});

export default router;

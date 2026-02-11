import { Router, Request, Response } from 'express';
import { exec } from 'child_process';
import { promisify } from 'util';
import { ROOT } from './rootPath';
import fs from 'fs';
import path from 'path';

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

// Remove stale git lock files that can block git operations (e.g. from interrupted stash).
async function cleanStaleLocks() {
    const lockFiles = [
        path.join(ROOT, '.git', 'index.lock'),
        path.join(ROOT, '.git', 'refs', 'stash.lock'),
    ];
    for (const lockFile of lockFiles) {
        if (fs.existsSync(lockFile)) {
            try {
                await execAsync('pgrep -x git');
                // git is still running — don't remove
            } catch {
                // no git process running — safe to remove stale lock
                try {
                    fs.unlinkSync(lockFile);
                    console.log(`Removed stale git lock: ${lockFile}`);
                } catch (e) {
                    console.error(`Failed to remove lock ${lockFile}:`, e);
                }
            }
        }
    }
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

        const status = await runGit('git status --porcelain');
        if (status) {
            return res.status(400).json({ 
                error: "Cannot revert with pending changes. Please commit your changes first." 
            });
        }
        const currentHead   = await runGit('git rev-parse HEAD');
        const newCommitHash = await runGit(`git commit-tree ${hash}^{tree} -p ${currentHead} -m "Reverted to ${hash}"`);
        await runGit(`git reset --hard ${newCommitHash}`);

        res.json({ success: true, message: `Reverted to ${hash}` });
    } catch (error: any) {
        console.error("Git Revert Error:", error);
        res.status(500).json({ error: error.message });
    }
});
 
router.get('/branches', async (req: Request, res: Response) => {
    try {
        // List local branches, marking current with *
        const output = await runGit('git branch --list');
        const branches = output.split('\n').filter(Boolean).map(line => {
             const isCurrent = line.startsWith('*');
             const name = line.replace('*', '').trim();
             return { name, isCurrent };
        });
        res.json({ branches });
    } catch (error: any) {
        console.error("Git Branches Error:", error);
        res.status(500).json({ error: error.message });
    }
});

router.post('/branch/checkout', async (req: Request, res: Response) => {
    try {
        const { branch } = req.body;
        if (!branch) return res.status(400).json({ error: "Branch name is required" });

        const status = await runGit('git status --porcelain');
        if (status) {
            return res.status(400).json({
                error: "Cannot checkout with pending changes. Please commit your changes first."
            });
        }

        await runGit(`git checkout ${branch}`);
        res.json({ success: true, message: `Switched to branch ${branch}` });
    } catch (error: any) {
        console.error("Git Checkout Error:", error);
        res.status(500).json({ error: error.message });
    }
});

router.post('/branch/create', async (req: Request, res: Response) => {
    try {
        const { branch } = req.body;
        if (!branch) return res.status(400).json({ error: "Branch name is required" });
        await runGit(`git checkout -b ${branch}`);
        res.json({ success: true, message: `Created and switched to branch ${branch}` });
    } catch (error: any) {
        console.error("Git Create Branch Error:", error);
        res.status(500).json({ error: error.message });
    }
});

router.post('/branch/delete', async (req: Request, res: Response) => {
    try {
        const { branch } = req.body;
        if (!branch) return res.status(400).json({ error: "Branch name is required" });
        // -D force delete
        await runGit(`git branch -D ${branch}`);
        res.json({ success: true, message: `Deleted branch ${branch}` });
    } catch (error: any) {
        console.error("Git Delete Branch Error:", error);
        res.status(500).json({ error: error.message });
    }
});

router.post('/branch/merge', async (req: Request, res: Response) => {
    try {
        const { branch } = req.body;
        if (!branch) return res.status(400).json({ error: "Branch name is required" });
        await runGit(`git merge ${branch}`);
        res.json({ success: true, message: `Merged branch ${branch}` });
    } catch (error: any) {
        console.error("Git Merge Error:", error);
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
        
        // Clean stale locks that may have been left by interrupted stash operations
        await cleanStaleLocks();

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

        // Clear all stashes after successful push — committed state is now the source of truth
        try {
            await runGit('git stash clear');
        } catch {
            // Non-critical: don't fail the push if stash clear fails
        }

        res.json({ success: true });
    } catch (error: any) {
        console.error("Git Push Error:", error);
        res.status(500).json({ error: error.message });
    }
});

export default router;

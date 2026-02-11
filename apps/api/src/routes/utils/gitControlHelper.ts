import { Router, Request, Response } from 'express';
import { execa } from 'execa';
import { ROOT } from './rootPath';
import fs from 'fs';
import path from 'path';

const router = Router();

// Helper to run git command in ROOT
async function runGit(args: string[]) {
    // execa handles escaping automatically when using the array syntax
    const { stdout, stderr } = await execa('git', args, { cwd: ROOT });
    // git push and other commands might write to stderr for progress, not necessarily errors.
    // We log it but don't throw unless the command failed (which execa does automatically).
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
                // pgrep returns 0 if process found, 1 if not (which throws)
                // We use reject: false to handle exit code manually if needed, 
                // but actually if it throws on 1 (not found), that's what we want.
                // Wait, if 1 (not found), it throws.
                await execa('pgrep', ['-x', 'git']);
                // If we are here, git IS running (exit code 0).
                // So we do NOT remove locks.
            } catch {
                // pgrep failed (likely exit code 1 -> not running).
                // Safe to remove stale lock.
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
        // Note: git log format string with execa array: pass as single argument without extra quotes unless part of the format string itself.
        // bash: git log ... --pretty=format:"..."
        // execa: ['log', ..., '--pretty=format:%h|%s|%ar']
        const output = await runGit(['log', '-n', '10', '--pretty=format:%h|%s|%ar']);
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
        const branch = await runGit(['branch', '--show-current']);
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

        const status = await runGit(['status', '--porcelain']);
        if (status) {
            return res.status(400).json({ 
                error: "Cannot revert with pending changes. Please commit your changes first." 
            });
        }
        const currentHead   = await runGit(['rev-parse', 'HEAD']);
        const newCommitHash = await runGit(['commit-tree', `${hash}^{tree}`, '-p', currentHead, '-m', `Reverted to ${hash}`]);
        await runGit(['reset', '--hard', newCommitHash]);

        res.json({ success: true, message: `Reverted to ${hash}` });
    } catch (error: any) {
        console.error("Git Revert Error:", error);
        res.status(500).json({ error: error.message });
    }
});
 
router.get('/branches', async (req: Request, res: Response) => {
    try {
        // List local branches, marking current with *
        const output = await runGit(['branch', '--list']);
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

        const status = await runGit(['status', '--porcelain']);
        if (status) {
            return res.status(400).json({
                error: "Cannot checkout with pending changes. Please commit your changes first."
            });
        }

        await runGit(['checkout', branch]);
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
        await runGit(['checkout', '-b', branch]);
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
        await runGit(['branch', '-D', branch]);
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
        await runGit(['merge', branch]);
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
            await runGit(['add', '.']);
            // message is passed directly; execa handles escaping
            await runGit(['commit', '-m', message]);
        } catch (e: any) {
           // Ignore "nothing to commit" errors
           // e.stdout might exist if it was a failed execa call
           if (e.stdout && e.stdout.includes('nothing to commit')) {
               // proceed to push
           } else if (e.message && e.message.includes('nothing to commit')) {
                // proceed
           } else {
               throw e;
           }
        }
        
        await runGit(['push']);

        // Clear all stashes after successful push — committed state is now the source of truth
        try {
            await runGit(['stash', 'clear']);
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

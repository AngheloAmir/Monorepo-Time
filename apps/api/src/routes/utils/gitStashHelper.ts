import { Router, Request, Response } from 'express';
import { execa } from 'execa';
import { ROOT } from './rootPath';
import fs from 'fs';
import path from 'path';

const router = Router();

// Helper to run git command in ROOT
async function runGit(args: string[]) {
    const { stdout } = await execa('git', args, { cwd: ROOT });
    return stdout.trim();
}
 
// Remove stale git lock files that can block git operations.
// Only removes locks if no other git process is actively running.
async function cleanStaleLocks() {
    const lockFiles = [
        path.join(ROOT, '.git', 'index.lock'),
        path.join(ROOT, '.git', 'refs', 'stash.lock'),
    ];

    for (const lockFile of lockFiles) {
        if (fs.existsSync(lockFile)) {
            try {
                // pgrep returns 0 if match found, 1 if not. execa throws on non-zero.
                // So if this succeeds, git is running.
                await execa('pgrep', ['-x', 'git']);
            } catch {
                // git not running
                try {
                    fs.unlinkSync(lockFile);
                } catch (e) { }
            }
        }
    }
}

// Helper to get the current stash list as an array of stash names
async function getStashList(): Promise<string[]> {
    try {
        const output = await runGit(['stash', 'list', '--format=%gs']);
        if (!output) return [];
        return output
            .split('\n')
            .filter(Boolean)
            .map(line => line.replace(/^On [^:]+: /, ''));
    } catch {
        return [];
    }
}

// ─── GET /list ──────────────────────────────────────────────
// Returns an array of stash entry names, e.g. ["my-checkpoint", "wip-feature"]
router.get('/list', async (req: Request, res: Response) => {
    try {
        await cleanStaleLocks();
        const list = await getStashList();
        res.json(list);
    } catch (error: any) {
        console.error('Git Stash List Error:', error);
        res.status(500).json({ error: error.message });
    }
});


// ─── POST /add ──────────────────────────────────────────────
// Body: { stashName: string }
// Stages everything, creates a stash with the given name,
// then returns the updated stash list.
router.post('/add', async (req: Request, res: Response) => {
    try {
        const { stashName } = req.body;
        if (!stashName) {
            res.status(400).json({ error: 'stashName is required' });
            return;
        }

        await cleanStaleLocks();
        await runGit(['add', '-A']);

        // execa handles escaping, so we pass stashName directly.
        try {
            const stashHash = await runGit(['stash', 'create']);
            if (!stashHash) {
                const list = await getStashList();
                res.json(list);
                return;
            }
            await runGit(['stash', 'store', '-m', stashName, stashHash]);
        } catch (e: any) {
            if (
                e.message?.includes('No local changes to save') ||
                e.stdout?.includes('No local changes to save')
            ) {
                const list = await getStashList();
                res.json(list);
                return;
            }
            throw e;
        }

        const list = await getStashList();
        res.json(list);
    } catch (error: any) {
        console.error('Git Stash Add Error:', error);
        res.status(500).json({ error: error.message });
    }
});

// ─── POST /revert ───────────────────────────────────────────
// Body: { stashName: string }
// Finds the stash whose message matches stashName, stages current
// changes first (to avoid conflicts with dirty working tree),
// then applies that stash.  Returns the updated stash list.
router.post('/revert', async (req: Request, res: Response) => {
    try {
        const { stashName } = req.body;
        if (!stashName) {
            res.status(400).json({ error: 'stashName is required' });
            return;
        }

        await cleanStaleLocks();

        const rawList = await runGit(['stash', 'list']);
        if (!rawList) {
            res.status(404).json({ error: 'No stashes found' });
            return;
        }

        let stashIndex: number | null = null;
        const lines = rawList.split('\n').filter(Boolean);
        for (let i = 0; i < lines.length; i++) {
            // Lines look like: stash@{0}: On main: my-checkpoint
            if (lines[i].includes(stashName)) {
                stashIndex = i;
                break;
            }
        }

        if (stashIndex === null) {
            res.status(404).json({ error: `Stash "${stashName}" not found` });
            return;
        }

        // Stage current changes first so `git stash apply` won't refuse
        // due to a dirty working tree.
        try {
            await runGit(['add', '-A']);
        } catch {
            // Ignore — staging might fail if repo is empty, etc.
        }

        // Create a safety stash of current state before reverting
        try {
            const timestamp = new Date().toLocaleTimeString();
            await runGit(['stash', 'push', '-m', `__backup_${timestamp}__`]);
        } catch {
            // Nothing to stash is fine
        }

        // Now apply the target stash (after the safety push, index may have shifted +1)
        // Re-read stash list to find the correct index
        const updatedRawList = await runGit(['stash', 'list']);
        let newStashIndex: number | null = null;
        const updatedLines = updatedRawList.split('\n').filter(Boolean);
        for (let i = 0; i < updatedLines.length; i++) {
            if (updatedLines[i].includes(stashName) && !updatedLines[i].includes('__backup_')) {
                newStashIndex = i;
                break;
            }
        }

        if (newStashIndex === null) {
            res.status(404).json({ error: `Stash "${stashName}" not found after safety backup` });
            return;
        }

        // Apply the stash (does not remove it from the list)
        await runGit(['stash', 'apply', `stash@{${newStashIndex}}`]);

        const list = await getStashList();
        res.json(list);
    } catch (error: any) {
        console.error('Git Stash Revert Error:', error);
        res.status(500).json({ error: error.message });
    }
});


// ─── GET /clear ─────────────────────────────────────────────
// Drops all stashes. Returns an empty array.
router.get('/clear', async (req: Request, res: Response) => {
    try {
        await cleanStaleLocks();
        await runGit(['stash', 'clear']);
        res.json([]);
    } catch (error: any) {
        console.error('Git Stash Clear Error:', error);
        res.status(500).json({ error: error.message });
    }
});

export default router;

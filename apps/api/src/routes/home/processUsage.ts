import { Request, Response, Router } from "express";
import fs from "fs";
import { exec } from "child_process";
import os from "os";
import pidusage from "pidusage";
import { activeProcesses } from "../terminal/runcmddev";
import { activeTerminals } from "../terminal/interactiveTerminal";
import { ChildProcess } from "child_process";

const router = Router();

// Stubs for missing modules
const workSpaceData: any = {}; 
const getActiveJobs = () => new Map<string, any>(); 
const getDockerContainers = async () => ({ containers: [], totalMem: 0 }); 

let peakMemory = 0;

function getPSS(pid: number): number {
    try {
        const data = fs.readFileSync(`/proc/${pid}/smaps_rollup`, "utf8");
        const match = data.match(/^Pss:\s+(\d+)\s+kB/m);
        if (!match) return 0;
        return parseInt(match[1], 10) * 1024; // bytes
    } catch {
        return 0;
    }
}

/* ============================================================
   Process Tree Builder
   ============================================================ */

function getProcessTree(): Promise<Map<number, number[]>> {
    return new Promise((resolve) => {
        exec('ps -A -o pid,ppid', (err, stdout) => {
            if (err) return resolve(new Map());

            const parentMap = new Map<number, number[]>();
            const lines = stdout.trim().split('\n');

            for (let i = 1; i < lines.length; i++) {
                const parts = lines[i].trim().split(/\s+/).map(Number);
                const pid = parts[0];
                const ppid = parts[1];
                if (!isNaN(pid) && !isNaN(ppid)) {
                    if (!parentMap.has(ppid)) parentMap.set(ppid, []);
                    parentMap.get(ppid)?.push(pid);
                }
            }
            resolve(parentMap);
        });
    });
}

function getAllDescendants(rootPid: number, parentMap: Map<number, number[]>) {
    const results = [rootPid];
    const queue = [rootPid];

    while (queue.length) {
        const current = queue.shift();
        if (current === undefined) continue;
        const children = parentMap.get(current);
        if (children) {
            for (const child of children) {
                results.push(child);
                queue.push(child);
            }
        }
    }
    return results;
}

/* ============================================================
   Main Stats Collector
   ============================================================ */

async function getStats() {
    // Count repos
    let totalRepos = 0;
    Object.values(workSpaceData).forEach((list: any) => {
        if (Array.isArray(list)) totalRepos += list.length;
    });

    const activeJobMap = getActiveJobs();

    const parentMap = await getProcessTree();
    const dockerData = await getDockerContainers();

    const distinctPids: number[] = [];
    const serviceGroups: any[] = [];

    // Helper to add group
    function addGroup(pid: number | undefined, name: string, type: string) {
        if (!pid) return;
        const children = getAllDescendants(pid, parentMap);
        children.forEach(p => distinctPids.push(p));

        serviceGroups.push({
            name: name,
            type,
            rootPid: pid,
            pids: children
        });
    }

    // activeProcesses is Map<string, ChildProcess>
    activeProcesses.forEach((child, name) => {
        addGroup(child.pid, name, 'Service');
    });

    // activeTerminals is Map<string, { child: ChildProcess, workspaceName?: string }>
    activeTerminals.forEach((session, socketId) => {
        const name = session.workspaceName ? `Terminal (${session.workspaceName})` : `Terminal (${socketId})`;
        addGroup(session.child.pid, name, 'Terminal');
    });

    activeJobMap.forEach((e: any) => {
        const pid = e.pid || (e.child ? e.child.pid : undefined);
        addGroup(pid, "Job", 'Job');
    });

    const mainPid = process.pid;
    const mainChildren = getAllDescendants(mainPid, parentMap);
    mainChildren.forEach(p => distinctPids.push(p));

    const processList: any[] = [];
    let mainToolMem = 0;

    if (distinctPids.length) {
        try {
            const uniquePids = [...new Set(distinctPids)];
            // validate pids with pidusage
            await pidusage(uniquePids).catch(() => {}); 

            // --- Aggregate services using PSS ---
            for (const group of serviceGroups) {
                let total = 0;
                for (const pid of group.pids) {
                    total += getPSS(pid);
                }

                processList.push({
                    pid: group.rootPid,
                    name: group.name,
                    type: group.type,
                    memory: total
                });
            }

            // --- Main Tool ---
            // Calculate memory for the tool itself and its direct children that are NOT services
            const knownServicePids = new Set<number>();
            serviceGroups.forEach(g => g.pids.forEach((p: number) => knownServicePids.add(p)));

            const toolCorePids = mainChildren.filter(pid => !knownServicePids.has(pid));
            
            for (const pid of toolCorePids) {
                mainToolMem += getPSS(pid);
            }

        } catch (e: any) {
            console.error('Pid scan error:', e.message);
        }
    }

    processList.push({
        pid: mainPid,
        name: 'Tool Server (Core)',
        type: 'System',
        memory: mainToolMem || process.memoryUsage().rss
    });

    const totalServerMem = processList.reduce((a, b) => a + b.memory, 0);
    if (totalServerMem > peakMemory) peakMemory = totalServerMem;

    return {
        systemTotalMem: os.totalmem(),
        serverUsedMem: totalServerMem,
        peakMem: peakMemory,
        cpus: os.cpus().length,
        uptime: os.uptime(),
        repoCount: totalRepos,
        activeCount: activeProcesses.size + activeJobMap.size,
        processes: processList,
        dockerContainers: dockerData.containers,
        dockerTotalMem: dockerData.totalMem
    };
}


/* ============================================================
   Kill Port
   ============================================================ */

function killPortFunc(port: number): Promise<boolean> {
    return new Promise((resolve) => {
        exec(`lsof -t -i:${port}`, (err, stdout) => {
            if (err || !stdout.trim()) return resolve(false);

            exec(`kill -9 ${stdout.trim().split('\n').join(' ')}`, () => {
                resolve(true);
            });
        });
    });
}

// Routes

router.post("/kill-port", async (req: Request, res: Response) => {
    try {
        const { port } = req.body;
        if (!port) {
             res.status(400).json({ error: "Port is required" });
             return;
        }
        const killed = await killPortFunc(port);
        res.json({ success: true, killed });
    } catch (e: any) {
        res.status(500).json({ error: e.message });
    }
});

router.get("/stream", (req: Request, res: Response) => {
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*'
    });

    const send = async () => {
        try {
            const stats = await getStats();
            res.write(`data: ${JSON.stringify(stats)}\n\n`);
        } catch (e) {
            console.error('Stream error', e);
        }
    };

    send();
    const interval = setInterval(send, 10000);

    req.on('close', () => {
        clearInterval(interval);
        res.end();
    });
});

router.get("/", async (req: Request, res: Response) => {
    try {
        const stats = await getStats();
        res.json(stats);
    } catch (error) {
         console.error(error);
         res.status(500).json({ error: "Failed to get stats" });
    }
});

export default router;

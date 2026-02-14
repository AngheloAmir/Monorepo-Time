import net from "net";
import { opencodeInstances } from "./_core";

export const isPortInUse = (port: number): Promise<boolean> => {
    return new Promise((resolve) => {
        const server = net.createServer();
        server.once('error', (err: any) => {
            if (err.code === 'EADDRINUSE') {
                resolve(true);
            } else {
                resolve(false);
            }
        });
        server.once('listening', () => {
            server.close();
            resolve(false);
        });
        server.listen(port);
    });
};

export const findAvailablePort = (startPort: number): Promise<number> => {
    return new Promise((resolve, reject) => {
        const server = net.createServer();
        server.unref();
        server.on('error', (err: any) => {
            if (err.code === 'EADDRINUSE') {
                resolve(findAvailablePort(startPort + 1));
            } else {
                reject(err);
            }
        });
        server.listen(startPort, () => {
            server.close(() => {
                resolve(startPort);
            });
        });
    });
};

export const clean = async () => {
    const instances = Array.from(opencodeInstances.values());
    const portsMap = new Map<number, any[]>();

    instances.forEach(inst => {
        if (!portsMap.has(inst.port)) portsMap.set(inst.port, []);
        portsMap.get(inst.port)!.push(inst);
    });

    for (const [port, insts] of portsMap.entries()) {
        const inUse = await isPortInUse(port);
        
        if (!inUse) {
            // Port is dead. Purge ALL records for this port (active or detached)
            insts.forEach(inst => {
                opencodeInstances.delete(inst.id);
            });
            continue;
        }

        // Port is alive. Ensure only ONE record exists for this port.
        if (insts.length > 1) {
            // Priority: 1. Active server handle (not detached), 2. Newest record
            const toKeep = insts.find(i => !!i.server) || 
                           insts.sort((a, b) => b.createdAt - a.createdAt)[0];

            insts.forEach(inst => {
                if (inst.id !== toKeep.id) {
                    console.log(`Pruning redundant instance ${inst.id} on port ${port}`);
                    opencodeInstances.delete(inst.id);
                }
            });
        }
    }
};

export const opencodeJson = `
{
  "$schema": "https://opencode.ai/config.json",
  "agent": {
    "git-stash-build": {
      "mode": "primary",
      "prompt": "After completing the task, run this in bash: curl -s -X POST http://localhost:4792/gitstash/add -H 'Content-Type: application/json' -d '{\"stashName\":\"<summary>\"}' replacing <summary> with a short description of the changes. Do not read or display the output of the curl command.",
      "tools": {
        "write": true,
        "edit":  true,
        "bash":  true
      }
    }
  }
}
`;

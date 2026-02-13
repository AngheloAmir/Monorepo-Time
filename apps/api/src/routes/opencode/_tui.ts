import fs from "fs-extra";
import path from "path";
import net from "net";
import { opencodeInstances } from "./opencodeTUI";

const OPENCODE_DATA_FILE = path.join(__dirname, ".opencode.json");

export const saveInstances = async () => {
    try {
        const data = Array.from(opencodeInstances.values()).map(instance => ({
            id: instance.id,
            url: instance.url,
            port: instance.port,
            name: instance.name,
            pid: instance.pid,
            createdAt: instance.createdAt,
            lastSessionId: instance.lastSessionId
        }));
        await fs.writeJson(OPENCODE_DATA_FILE, data, { spaces: 2 });
    } catch (err) {
        console.error("Failed to save opencode instances:", err);
    }
};

export const loadInstances = async () => {
    try {
        if (await fs.pathExists(OPENCODE_DATA_FILE)) {
            const content = await fs.readFile(OPENCODE_DATA_FILE, 'utf-8');
            if (!content.trim()) {
                opencodeInstances.clear();
                return;
            }
            const data = JSON.parse(content);
            opencodeInstances.clear();
            if (Array.isArray(data)) {
                data.forEach((item: any) => {
                    opencodeInstances.set(item.id, { ...item, server: undefined });
                });
                console.log(`Loaded ${opencodeInstances.size} opencode instances from disk.`);
            }
        } else {
            // Initialize empty file if it doesn't exist
            await fs.writeJson(OPENCODE_DATA_FILE, [], { spaces: 2 });
        }
    } catch (err) {
        console.error("Failed to load opencode instances:", err);
        // Fallback to empty if initialization fails
        opencodeInstances.clear();
    }
};

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

    let modified = false;

    for (const [port, insts] of portsMap.entries()) {
        const inUse = await isPortInUse(port);
        
        if (!inUse) {
            // Port is dead. Purge ALL records for this port (active or detached)
            insts.forEach(inst => {
                opencodeInstances.delete(inst.id);
                modified = true;
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
                    modified = true;
                }
            });
        }
    }

    if (modified) {
        await saveInstances();
    }
};
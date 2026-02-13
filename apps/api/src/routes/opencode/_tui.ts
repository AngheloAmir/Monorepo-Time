import fs from "fs-extra";
import path from "path";
import net from "net";
import { opencodeInstances } from "./opencodeTUI";

const OPENCODE_DATA_FILE = path.join(process.cwd(), ".opencode.json");

export const saveInstances = async () => {
    try {
        const data = Array.from(opencodeInstances.values()).map(instance => ({
            id: instance.id,
            url: instance.url,
            port: instance.port,
            name: instance.name,
            pid: instance.pid,
            createdAt: instance.createdAt
        }));
        await fs.writeJson(OPENCODE_DATA_FILE, data, { spaces: 2 });
    } catch (err) {
        console.error("Failed to save opencode instances:", err);
    }
};

export const loadInstances = async () => {
    try {
        if (await fs.pathExists(OPENCODE_DATA_FILE)) {
            const data = await fs.readJson(OPENCODE_DATA_FILE);
            opencodeInstances.clear();
            data.forEach((item: any) => {
                opencodeInstances.set(item.id, { ...item, server: undefined });
            });
            console.log(`Loaded ${opencodeInstances.size} opencode instances from disk.`);
        }
    } catch (err) {
        console.error("Failed to load opencode instances:", err);
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
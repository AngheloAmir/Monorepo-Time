
import type { ProjectTemplate } from "../../types";

export const Milvus: ProjectTemplate = {
    name: "Milvus",
    description: "Milvus Vector Database (Standalone with MinIO & Etcd)",
    notes: "Requires Docker installed. Data stored in ./milvus-data folder.",
    type: "database",
    category: "Database",
    icon: "fas fa-layer-group text-blue-500", // Using layer-group since it represents vectors/stack
    templating: [
        {
            action: 'file',
            file: 'docker-compose.yml',
            filecontent: `
services:
  etcd:
    image: quay.io/coreos/etcd:v3.5.5
    restart: unless-stopped
    environment:
      - ETCD_AUTO_COMPACTION_MODE=revision
      - ETCD_AUTO_COMPACTION_RETENTION=1000
      - ETCD_QUOTA_BACKEND_BYTES=4294967296
      - ETCD_SNAPSHOT_COUNT=50000
    volumes:
      - ./milvus-data/etcd:/etcd
    command: etcd -advertise-client-urls=http://etcd:2379 -listen-client-urls http://0.0.0.0:2379 --data-dir /etcd

  minio:
    image: minio/minio:RELEASE.2023-03-20T20-16-18Z
    restart: unless-stopped
    environment:
      MINIO_ACCESS_KEY: minioadmin
      MINIO_SECRET_KEY: minioadmin
    ports:
      - "9001:9001"
      - "9000:9000"
    volumes:
      - ./milvus-data/minio:/minio_data
    command: minio server /minio_data --console-address ":9001"
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:9000/minio/health/live"]
      interval: 30s
      timeout: 20s
      retries: 3

  milvus:
    image: milvusdb/milvus:v2.3.13
    command: ["milvus", "run", "standalone"]
    restart: unless-stopped
    environment:
      ETCD_ENDPOINTS: etcd:2379
      MINIO_ADDRESS: minio:9000
      MINIO_ACCESS_KEY: minioadmin
      MINIO_SECRET_KEY: minioadmin
    volumes:
      - ./milvus-data/milvus:/var/lib/milvus
    ports:
      - "19530:19530"
      - "9091:9091"
    depends_on:
      - "etcd"
      - "minio"
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:9091/healthz"]
      interval: 30s
      timeout: 20s
      retries: 3`
        },
        {
            action: 'file',
            file: '.gitignore',
            filecontent: `# Database data folder
milvus-data/

# Dependencies
node_modules/

# Runtime file
.runtime.json
`
        },
        {
            action: 'file',
            file: 'index.js',
            filecontent: `const http = require('http');
const os = require('os');
const { spawn, exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const RUNTIME_FILE = path.join(__dirname, '.runtime.json');
const DATA_DIR = path.join(__dirname, 'milvus-data');

console.log('Starting Milvus Vector Database...');

// Pre-create data directory to ensure correct permissions
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    console.log('Created milvus-data directory');
}

// Start Docker Compose
const child = spawn('docker', ['compose', 'up', '-d', '--remove-orphans'], { stdio: 'inherit' });

child.on('close', (code) => {
    if (code !== 0) process.exit(code);
    // Follow logs with filtering
    const logs = spawn('docker', ['compose', 'logs', '-f', '--tail=0'], { stdio: ['ignore', 'pipe', 'pipe'] });
    
    const printImportant = (data) => {
        const lines = data.toString().split('\\n');
        lines.forEach(line => {
            let cleanLine = line.replace(/^[^|]+\\|\\s+/, '');
            const lower = cleanLine.toLowerCase();
            if ((lower.includes('error') || lower.includes('fatal') || lower.includes('panic')) && !lower.includes('database system is starting up')) {
                process.stdout.write('\\x1b[31mError:\\x1b[0m ' + cleanLine + '\\n');
            }
        });
    };

    logs.stdout.on('data', printImportant);
    logs.stderr.on('data', printImportant);
    logs.on('close', (c) => process.exit(c || 0));
});

// Setup Control Server
const server = http.createServer((req, res) => {
    if (req.url === '/stop') {
        res.writeHead(200);
        res.end('Stopping...');
        cleanup();
    } else {
        res.writeHead(404);
        res.end();
    }
});

server.listen(0, () => {
    // We update runtime file later when we get the container ID
});

// Check status loop
const checkStatus = () => {
    exec('docker compose port milvus 19530', (err, stdout, stderr) => {
        if (err || stderr || !stdout) {
            setTimeout(checkStatus, 2000);
            return;
        }
        const portInfo = stdout.trim(); // e.g. 0.0.0.0:19530
        const port = portInfo.split(':')[1];
        if (!port) {
            setTimeout(checkStatus, 2000);
            return;
        }

        // Check if actually healthy
        exec('curl -s http://localhost:9091/healthz', (hErr, hStdout) => {
            if (hErr || hStdout !== 'OK') {
                setTimeout(checkStatus, 2000);
                return;
            }

            // Capture Container IDs
            exec('docker compose ps -q', (err2, stdout2) => {
                 const containerIds = stdout2 ? stdout2.trim().split('\\n') : [];
                 
                 try {
                    fs.writeFileSync(RUNTIME_FILE, JSON.stringify({ 
                        port: server.address().port, 
                        pid: process.pid,
                        containerIds: containerIds
                    }));
                 } catch(e) {
                    console.error('Failed to write runtime file:', e);
                 }

                 process.stdout.write('\\x1Bc');
                 console.log('\\n==================================================');
                 console.log('Milvus Vector Database is running!');
                 console.log('Official Site:     https://milvus.io');
                 console.log('Docker Image:      https://hub.docker.com/r/milvusdb/milvus');
                 console.log('--------------------------------------------------');
                 console.log(\`gRPC Endpoint:     localhost:\${port}\`);
                 console.log('HTTP Endpoint:     localhost:9091');
                 console.log('MinIO Console:     http://localhost:9001 (User/Pass: minioadmin)');
                 console.log('--------------------------------------------------');

                 // Detect IP for external usage
                let hostIp = "localhost";
                if (process.platform === "win32" || process.platform === "darwin") {
                    hostIp = "host.docker.internal";
                } else {
                    try {
                        const nets = os.networkInterfaces();
                        for (const name of Object.keys(nets)) {
                            for (const net of nets[name]) {
                                // Find IPv4 that is not internal 
                                if (net.family === "IPv4" && !net.internal) {
                                    hostIp = net.address;
                                    break; 
                                }
                            }
                            if (hostIp !== "localhost") break;
                        }
                    } catch(e) {}
                }

                 console.log('External Connection Info:');
                 console.log(\`  Host:            \${hostIp}\`);
                 console.log(\`  Port (gRPC):     \${port}\`);
                 console.log('--------------------------------------------------');
                 console.log('Attu (GUI Client): https://github.com/zilliztech/attu');
                 console.log('==================================================\\n');
            });
        });
    });
};

setTimeout(checkStatus, 3000);

const cleanup = () => {
    console.log('Stopping Milvus Stack...');
    exec('docker compose down', (err, stdout, stderr) => {
        try { fs.unlinkSync(RUNTIME_FILE); } catch(e) {}
        process.exit(0);
    });
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);`
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['install']
        },

        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'scripts.start=node index.js']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'scripts.stop=node -e \'const fs=require("fs"); try{const p=JSON.parse(fs.readFileSync(".runtime.json")).port; fetch("http://localhost:"+p+"/stop").catch(e=>{})}catch(e){}\'']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'description=Milvus Vector DB (Docker)']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'appType=database']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'fontawesomeIcon=fas fa-layer-group text-blue-500']
        }
    ]
};

import type { ProjectTemplate } from "..";

export const MinIO: ProjectTemplate = {
    name: "MinIO",
    description: "MinIO Object Storage (S3 Compatible)",
    notes: "Requires Docker installed. Data stored in ./minio-data folder.",
    templating: [
        {
            action: 'file',
            file: 'docker-compose.yml',
            filecontent: `services:
  minio:
    image: minio/minio
    command: server /data --console-address ":9001"
    restart: unless-stopped
    environment:
      - MINIO_ROOT_USER=minioadmin
      - MINIO_ROOT_PASSWORD=minioadmin
    ports:
      - "0:9000"
      - "0:9001"
    volumes:
      - ./minio-data:/data
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:9000/minio/health/live"]
      interval: 30s
      timeout: 20s
      retries: 3`
        },
        {
            action: 'file',
            file: '.gitignore',
            filecontent: `# Object storage data folder
minio-data/

# Runtime file
.runtime.json
`
        },
        {
            action: 'file',
            file: 'index.js',
            filecontent: `const http = require('http');
const { spawn, exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const RUNTIME_FILE = path.join(__dirname, '.runtime.json');
let containerId = null;

console.log('Starting MinIO...');

// Spawn Docker Compose
const child = spawn('docker', ['compose', 'up'], { stdio: 'inherit' });

child.on('close', (code) => {
    process.exit(code || 0);
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
    // We update runtime file later
});

// Check status loop
const checkStatus = () => {
    // Check API Port
    exec('docker compose port minio 9000', (err, stdout, stderr) => {
        if (err || stderr || !stdout) {
            setTimeout(checkStatus, 2000);
            return;
        }
        const apiPort = stdout.trim().split(':')[1];
        if (!apiPort) {
            setTimeout(checkStatus, 2000);
            return;
        }

        // Check Console Port
        exec('docker compose port minio 9001', (err2, stdout2, stderr2) => {
            if (err2 || stderr2 || !stdout2) {
                setTimeout(checkStatus, 2000);
                return;
            }
            const consolePort = stdout2.trim().split(':')[1];
             if (!consolePort) {
                setTimeout(checkStatus, 2000);
                return;
            }

            // Get Container ID
            exec('docker compose ps -q minio', (err3, stdout3) => {
                let containerIds = [];
                if (stdout3) containerIds = [stdout3.trim()];

                try {
                    fs.writeFileSync(RUNTIME_FILE, JSON.stringify({ 
                        port: server.address().port, 
                        pid: process.pid,
                        containerIds: containerIds 
                    }));
                } catch(e) {}

                console.clear();
                console.log('\\n==================================================');
                console.log('🪣  MinIO Object Storage is running!');
                console.log('--------------------------------------------------');
                console.log(\`🌐 Console URL:       http://localhost:\${consolePort}\`);
                console.log(\`🔌 API URL:           http://localhost:\${apiPort}\`);
                console.log('👤 Username:          minioadmin');
                console.log('🔑 Password:          minioadmin');
                console.log('--------------------------------------------------');
                console.log('📚 Docs: https://min.io/docs/minio/linux/index.html');
                console.log('==================================================\\n');
            });
        });
    });
};

setTimeout(checkStatus, 3000);

const cleanup = () => {
    console.log('Stopping MinIO...');
    try { 
        const runtime = JSON.parse(fs.readFileSync(RUNTIME_FILE));
        if (runtime.containerIds) {
             console.log(\`Stopping \${runtime.containerIds.length} containers...\`);
             runtime.containerIds.forEach(id => {
                exec(\`docker stop \${id}\`, () => {
                   exec(\`docker rm -f \${id}\`);
                });
             });
        }
    } catch(e) {}
    try { fs.unlinkSync(RUNTIME_FILE); } catch(e) {}
    
    exec('docker compose stop', () => {
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
            args: ['pkg', 'set', 'fontawesomeIcon=fab fa-amazon text-blue-500']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'description=MinIO (Docker)']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'name=$(basename $PWD)']
        }
    ]
};

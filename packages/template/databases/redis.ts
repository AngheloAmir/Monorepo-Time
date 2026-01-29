import type { ProjectTemplate } from "..";

export const Redis: ProjectTemplate = {
    name: "Redis",
    description: "Redis (Docker Compose)",
    notes: "Requires Docker installed. Data stored in ./redis-data folder.",
    templating: [
        {
            action: 'file',
            file: 'docker-compose.yml',
            filecontent: `

services:
  redis:
    image: redis:7.2-alpine
    pull_policy: if_not_present
    restart: unless-stopped
    user: "1000:1000"
    ports:
      - "0:6379"
    volumes:
      - ./redis-data:/data
    command: >
      redis-server
      --appendonly yes
      --save 60 1
      --loglevel warning
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      timeout: 3s
      retries: 5`
        },
        {
            action: 'file',
            file: '.gitignore',
            filecontent: `# Database data folder
redis-data/

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
const DATA_DIR = path.join(__dirname, 'redis-data');
let containerId = null;

console.log('Starting Redis...');

// Pre-create data directory to ensure correct permissions
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    console.log('Created redis-data directory');
}

// Start Docker Compose
const child = spawn('docker', ['compose', 'up', '-d', '--remove-orphans'], { stdio: 'inherit' });

child.on('close', (code) => {
    if (code !== 0) process.exit(code);
    // Follow logs
    const logs = spawn('docker', ['compose', 'logs', '-f'], { stdio: 'inherit' });
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
    const port = server.address().port;
    // We update runtime file later
});

// Give it time to start
// Check status loop
const checkStatus = () => {
    exec('docker compose port redis 6379', (err, stdout, stderr) => {
        if (err || stderr || !stdout) {
            setTimeout(checkStatus, 2000);
            return;
        }
        const port = stdout.trim().split(':')[1];
        if (!port) {
            setTimeout(checkStatus, 2000);
            return;
        }

        exec('docker compose ps -q redis', (err2, stdout2) => {
            let containerIds = [];
            if (stdout2) containerIds = [stdout2.trim()];

            try {
                fs.writeFileSync(RUNTIME_FILE, JSON.stringify({ 
                    port: server.address().port, 
                    pid: process.pid,
                    containerIds: containerIds 
                }));
            } catch(e) {}

            process.stdout.write('\\\\x1Bc');
            console.log('\\n==================================================');
            console.log('Redis is running!');
            console.log('--------------------------------------------------');
            console.log(\`Connection String: redis://localhost:\${port}\`);
            console.log(\`Port:              \${port}\`);
            console.log('--------------------------------------------------');
            console.log('Docs: https://redis.io/docs');
            console.log('To update to the latest version:');
            console.log('  docker pull redis:latest');
            console.log('==================================================\\n');
        });
    });
};

setTimeout(checkStatus, 3000);

const cleanup = () => {
    console.log('Stopping Redis...');
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
            args: ['pkg', 'set', 'description=Redis (Docker)']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'appType=tool']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'fontawesomeIcon=fas fa-server text-red-500']
        }
    ]
};

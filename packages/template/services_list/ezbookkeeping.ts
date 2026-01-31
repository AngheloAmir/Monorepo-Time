import type { ProjectTemplate } from "../../types";

export const EzBookkeepingLocal: ProjectTemplate = {
    name: "EzBookkeeping",
    description: "Personal finance manager (Docker)",
    notes: "Requires Docker installed. Data stored in ./ezbookkeeping-data folder.",
    type: "app",
    icon: "fas fa-wallet text-green-500",
    templating: [
        {
            action: 'file',
            file: 'docker-compose.yml',
            filecontent: `
services:
  ezbookkeeping:
    image: mayswind/ezbookkeeping:latest
    pull_policy: missing
    restart: unless-stopped
    ports:
      - "0:8080"
    volumes:
      - ./ezbookkeeping-data:/data
    environment:
      - EBK_DB_TYPE=sqlite3
      - EBK_DB_PATH=/data/ezbookkeeping.db
    healthcheck:
      test: ["CMD", "wget", "--spider", "http://localhost:8080"]
      interval: 10s
      timeout: 5s
      retries: 5`
        },
        {
            action: 'file',
            file: '.gitignore',
            filecontent: `# Data folder
ezbookkeeping-data/

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
const DATA_DIR = path.join(__dirname, 'ezbookkeeping-data');

console.log('Starting EzBookkeeping...');

// Pre-create data directory
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    console.log('Created ezbookkeeping-data directory');
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
            if (lower.includes('error') || lower.includes('fatal') || lower.includes('panic')) {
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
    // We update runtime file later
});

// Check status loop
const checkStatus = () => {
    exec('docker compose port ezbookkeeping 8080', (err, stdout, stderr) => {
        if (err || stderr || !stdout) {
            setTimeout(checkStatus, 2000);
            return;
        }
        const port = stdout.trim().split(':')[1];
        if (!port) {
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

             process.stdout.write('\\\\x1Bc');
             console.log('\\n==================================================');
             console.log('EzBookkeeping is running!');
             console.log('--------------------------------------------------');
             console.log(\`URL:               http://localhost:\${port}\`);
             console.log('--------------------------------------------------');
             console.log('To update to the latest version:');
             console.log('  docker pull mayswind/ezbookkeeping:latest');
             console.log('==================================================\\n');
        });
    });
};

setTimeout(checkStatus, 3000);

const cleanup = () => {
    console.log('Stopping EzBookkeeping...');
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
            args: ['pkg', 'set', 'description=EzBookkeeping (Docker)']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'appType=app']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'fontawesomeIcon=fas fa-wallet text-green-500']
        }
    ]
};

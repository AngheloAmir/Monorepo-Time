import type { ProjectTemplate } from "..";

export const PostgreSQL: ProjectTemplate = {
    name: "PostgreSQL",
    description: "PostgreSQL Database (Docker Compose)",
    notes: "Requires Docker installed. Data stored in ./postgres-data folder.",
    templating: [
        {
            action: 'file',
            file: 'docker-compose.yml',
            filecontent: `

services:
  postgres:
    image: postgres:latest
    pull_policy: if_not_present
    restart: unless-stopped
    user: "1000:1000"
    environment:
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: admin
      POSTGRES_DB: db
    ports:
      - "0:5432"
    volumes:
      - ./postgres-data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U admin -d db"]
      interval: 5s
      timeout: 5s
      retries: 5`
        },
        {
            action: 'file',
            file: '.gitignore',
            filecontent: `# Database data folder
postgres-data/

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
const DATA_DIR = path.join(__dirname, 'postgres-data');

console.log('Starting PostgreSQL...');

// Pre-create data directory to ensure correct permissions
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    console.log('Created postgres-data directory');
}

// Start Docker Compose
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
    // We update runtime file later when we get the container ID
});

// Check status loop
const checkStatus = () => {
    exec('docker compose port postgres 5432', (err, stdout, stderr) => {
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
             console.log('PostgreSQL is running!');
             console.log('--------------------------------------------------');
             console.log(\`Connection String: postgres://admin:admin@localhost:\${port}/db\`);
             console.log('Username:          admin');
             console.log('Password:          admin');
             console.log('Database:          db');
             console.log(\`Port:              \${port}\`);
             console.log('--------------------------------------------------');
             console.log('To update to the latest version:');
             console.log('  docker pull postgres:latest');
             console.log('==================================================\\n');
        });
    });
};

setTimeout(checkStatus, 3000);

const cleanup = () => {
    console.log('Stopping PostgreSQL...');
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
            args: ['pkg', 'set', 'description=PostgreSQL (Docker)']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'appType=tool']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'fontawesomeIcon=fas fa-database text-blue-500']
        }
    ]
};

import type { ProjectTemplate } from "../../types";

export const MongoDB: ProjectTemplate = {
    name: "MongoDB",
    description: "MongoDB (Docker Compose)",
    notes: "Data stored in ./mongo-data folder.",
    type: "database",
    icon: "fas fa-leaf text-green-500",
    templating: [
        {
            action: 'file',
            file: 'docker-compose.yml',
            filecontent: `services:
  mongodb:
    image: mongo:latest
    pull_policy: if_not_present
    restart: unless-stopped
    user: "1000:1000"
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: admin
    ports:
      - "0:27017"
    volumes:
      - ./mongo-data:/data/db
    command: ["mongod", "--quiet", "--logpath", "/dev/null"]
    healthcheck:
      test: echo "db.runCommand('ping').ok" | mongosh localhost:27017/test --quiet
      interval: 10s
      timeout: 10s
      retries: 5`
        },
        {
            action: 'file',
            file: '.gitignore',
            filecontent: `# Database data folder
mongo-data/

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
const DATA_DIR = path.join(__dirname, 'mongo-data');
let containerId = null;

console.log('Starting MongoDB...');

// Pre-create data directory to ensure correct permissions
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    console.log('Created mongo-data directory');
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
            let cleanLine = line.replace(/^[^|]+\|\s+/, '');
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
    const port = server.address().port;
    // We update runtime file later
});

// Give it time to start, then print info
// Check status loop
const checkStatus = () => {
    exec('docker compose port mongodb 27017', (err, stdout, stderr) => {
        if (err || stderr || !stdout) {
            setTimeout(checkStatus, 2000);
            return;
        }
        const port = stdout.trim().split(':')[1];
        if (!port) {
            setTimeout(checkStatus, 2000);
            return;
        }

        exec('docker compose ps -q mongodb', (err2, stdout2) => {
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
            console.log('MongoDB is running!');
            console.log('--------------------------------------------------');
            console.log(\`Connection String: mongodb://admin:admin@localhost:\${port}/db\`);
            console.log('Username:          admin');
            console.log('Password:          admin');
            console.log(\`Port:              \${port}\`);
            console.log('--------------------------------------------------');
            console.log('To update to the latest version:');
            console.log('  docker pull mongo:latest');
            console.log('==================================================\\n');
        });
    });
};

setTimeout(checkStatus, 3000);

const cleanup = () => {
    console.log('Stopping MongoDB...');
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
            args: ['pkg', 'set', 'description=MongoDB (Docker)']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'appType=database']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'fontawesomeIcon=fas fa-leaf text-green-500']
        }
    ]
};

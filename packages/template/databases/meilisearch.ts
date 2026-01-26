import type { ProjectTemplate } from "..";

export const Meilisearch: ProjectTemplate = {
    name: "Meilisearch",
    description: "Meilisearch (Docker Compose)",
    notes: "Requires Docker installed. Data stored in ./meili-data folder.",
    templating: [
        {
            action: 'file',
            file: 'docker-compose.yml',
            filecontent: `services:
  meilisearch:
    image: getmeili/meilisearch:v1.10
    restart: unless-stopped
    user: "1000:1000"
    environment:
      - MEILI_MASTER_KEY=masterKey
      - MEILI_ENV=development
    ports:
      - "0:7700"
    volumes:
      - ./meili-data:/meili_data
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:7700/health"]
      interval: 10s
      timeout: 5s
      retries: 5`
        },
        {
            action: 'file',
            file: '.gitignore',
            filecontent: `# Search engine data folder
meili-data/

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
const DATA_DIR = path.join(__dirname, 'meili-data');
let containerId = null;

console.log('Starting Meilisearch...');

// Pre-create data directory to ensure correct permissions
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    console.log('Created meili-data directory');
}

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
    exec('docker compose port meilisearch 7700', (err, stdout, stderr) => {
        if (err || stderr || !stdout) {
            setTimeout(checkStatus, 2000);
            return;
        }
        const port = stdout.trim().split(':')[1];
        if (!port) {
            setTimeout(checkStatus, 2000);
            return;
        }

        exec('docker compose ps -q meilisearch', (err2, stdout2) => {
            let containerIds = [];
            if (stdout2) containerIds = [stdout2.trim()];

            try {
                fs.writeFileSync(RUNTIME_FILE, JSON.stringify({ 
                    port: server.address().port, 
                    pid: process.pid,
                    containerIds: containerIds 
                }));
            } catch(e) {}

            console.clear();
            console.log('\\n==================================================');
            console.log('🔍 Meilisearch is running!');
            console.log('--------------------------------------------------');
            console.log(\`🌐 URL:               http://localhost:\${port}\`);
            console.log('🔑 Master Key:        masterKey');
            console.log(\`🔌 API Port:          \${port}\`);
            console.log('--------------------------------------------------');
            console.log('📚 Docs: https://www.meilisearch.com/docs');
            console.log('==================================================\\n');
        });
    });
};

setTimeout(checkStatus, 3000);

const cleanup = () => {
    console.log('Stopping Meilisearch...');
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
            args: ['pkg', 'set', 'fontawesomeIcon=fab fa-meetup text-green-500']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'description=Meilisearch (Docker)']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'name=$(basename $PWD)']
        }
    ]
};

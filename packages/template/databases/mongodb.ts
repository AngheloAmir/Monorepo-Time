import { ProjectTemplate } from "..";

export const MongoDB: ProjectTemplate = {
    name: "MongoDB",
    description: "MongoDB (Docker Compose)",
    notes: "Requires Docker installed.",
    templating: [
        {
            action: 'file',
            file: 'docker-compose.yml',
            filecontent: `services:
  mongodb:
    image: mongo:7.0
    restart: unless-stopped
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password
    ports:
      - "0:27017"
    volumes:
      - mongo-data:/data/db
    command: ["mongod", "--quiet"]
    logging:
      driver: "none"
    healthcheck:
      test: echo "db.runCommand('ping').ok" | mongosh localhost:27017/test --quiet
      interval: 10s
      timeout: 10s
      retries: 5

volumes:
  mongo-data:`
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

console.log('Starting MongoDB...');

const child = spawn('docker', ['compose', 'up'], { stdio: 'pipe' });

child.on('close', (code) => {
    process.exit(code || 0);
});

child.stderr.on('data', (data) => {
    const output = data.toString();
    if (!output.includes('The attribute \`version\` is obsolete')) {
        // console.error(output);
    }
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
setTimeout(() => {
    exec('docker compose port mongodb 27017', (err, stdout, stderr) => {
        if (stderr) return;
        const port = stdout.trim().split(':')[1];
        if (!port) return;

        exec('docker compose ps -q mongodb', (err2, stdout2) => {
            if (stdout2) containerId = stdout2.trim();

            try {
                fs.writeFileSync(RUNTIME_FILE, JSON.stringify({ 
                    port: server.address().port, 
                    pid: process.pid,
                    containerId: containerId 
                }));
            } catch(e) {}

            console.clear();
            console.log('\\n==================================================');
            console.log('🚀 MongoDB is running!');
            console.log('--------------------------------------------------');
            console.log(\`🔌 Connection String: mongodb://admin:password@localhost:\${port}\`);
            console.log('👤 Username:          admin');
            console.log('🔑 Password:          password');
            console.log(\`🌐 Port:              \${port}\`);
            if (containerId) console.log(\`📦 Container ID:      \${containerId}\`);
            console.log('==================================================\\n');
        });
    });
}, 5000);

const cleanup = () => {
    console.log('Stopping MongoDB...');
    try { fs.unlinkSync(RUNTIME_FILE); } catch(e) {}
    
    if (containerId) {
        console.log(\`Stopping container \${containerId}...\`);
        exec(\`docker stop \${containerId}\`, () => {
             process.exit(0);
        });
    } else {
        exec('docker compose stop', () => {
            process.exit(0);
        });
    }
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);`
        },
        {
            action: 'command',
            command: 'npm install'
        },

        {
            action: 'command',
            command: 'npm pkg set scripts.start="node index.js"'
        },
        {
            action: 'command',
            command: "npm pkg set scripts.stop=\"node -e 'const fs=require(\\\"fs\\\"); try{const p=JSON.parse(fs.readFileSync(\\\".runtime.json\\\")).port; fetch(\\\"http://localhost:\\\"+p+\\\"/stop\\\").catch(e=>{})}catch(e){}'\""
        }
    ]
};

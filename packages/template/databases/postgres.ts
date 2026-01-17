import { ProjectTemplate } from "..";

export const PostgreSQL: ProjectTemplate = {
    name: "PostgreSQL",
    description: "PostgreSQL Database (Docker Compose)",
    notes: "Requires Docker installed.",
    templating: [
        {
            action: 'file',
            file: 'docker-compose.yml',
            filecontent: `

services:
  postgres:
    image: postgres:16-alpine
    restart: unless-stopped
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
      POSTGRES_DB: mydatabase
    ports:
      - "0:5432"
    volumes:
      - postgres-data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U user -d mydatabase"]
      interval: 5s
      timeout: 5s
      retries: 5

volumes:
  postgres-data:`
        },
        {
            action: 'file',
            file: 'index.js',
            filecontent: `const http = require('http');
const { spawn, exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const RUNTIME_FILE = path.join(__dirname, '.runtime.json');

console.log('Starting PostgreSQL...');

// Start Docker Compose
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
    try {
        fs.writeFileSync(RUNTIME_FILE, JSON.stringify({ port, pid: process.pid }));
    } catch(e) {
        console.error('Failed to write runtime file:', e);
    }
});

// Info Loop
setTimeout(() => {
    exec('docker compose port postgres 5432', (err, stdout, stderr) => {
        if (stderr) return;
        const port = stdout.trim().split(':')[1];
        if (!port) return;
        
        console.clear();
        console.log('\\n==================================================');
        console.log('🚀 PostgreSQL is running!');
        console.log('--------------------------------------------------');
        console.log(\`🔌 Connection String: postgres://user:password@localhost:\${port}/mydatabase\`);
        console.log('👤 Username:          user');
        console.log('🔑 Password:          password');
        console.log('🗄️  Database:          mydatabase');
        console.log(\`🌐 Port:              \${port}\`);
        console.log('==================================================\\n');
    });
}, 5000);

const cleanup = () => {
    console.log('Stopping PostgreSQL...');
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

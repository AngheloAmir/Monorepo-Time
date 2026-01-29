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
    image: postgres:16-alpine
    restart: unless-stopped
    user: "1000:1000"
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
      POSTGRES_DB: mydatabase
    ports:
      - "0:5432"
    volumes:
      - ./postgres-data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U user -d mydatabase"]
      interval: 5s
      timeout: 5s
      retries: 5

  pgadmin:
    image: dpage/pgadmin4
    environment:
      PGADMIN_DEFAULT_EMAIL: admin@admin.com
      PGADMIN_DEFAULT_PASSWORD: root
    ports:
      - "0:80"
    depends_on:
      - postgres`
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
let containerId = null;

console.log('Starting PostgreSQL...');

// Pre-create data directory to ensure correct permissions
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    console.log('Created postgres-data directory');
}

// Start Docker Compose
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
    const port = server.address().port;
    // We update runtime file later when we get the container ID
});

// Info Loop
// Check status loop
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

        // Check pgAdmin port
        exec('docker compose port pgadmin 80', (err2, stdout2, stderr2) => {
            const pgAdminPort = (stdout2 && stdout2.trim()) ? stdout2.trim().split(':')[1] : null;
            if (!pgAdminPort) {
                setTimeout(checkStatus, 2000);
                return;
            }

            // Verify pgAdmin is actually responding to HTTP
            http.get(\`http://localhost:\${pgAdminPort}\`, (res) => {
                // Capture Container IDs
                exec('docker compose ps -q', (err3, stdout3) => {
                     const containerIds = stdout3 ? stdout3.trim().split('\\n') : [];
                     
                     try {
                        fs.writeFileSync(RUNTIME_FILE, JSON.stringify({ 
                            port: server.address().port, 
                            pid: process.pid,
                            containerIds: containerIds
                        }));
                     } catch(e) {
                        console.error('Failed to write runtime file:', e);
                     }

                     console.clear();
                     console.log('\\n==================================================');
                     console.log('PostgreSQL is running!');
                     console.log('--------------------------------------------------');
                     console.log(\`Connection String: postgres://user:password@localhost:\${port}/mydatabase\`);
                     console.log('Username:          user');
                     console.log('Password:          password');
                     console.log('Database:          mydatabase');
                     console.log(\`Port:              \${port}\`);
                     console.log('--------------------------------------------------');
                     console.log('pgAdmin 4 is running!');
                     console.log(\`URL:               http://localhost:\${pgAdminPort}\`);
                     console.log('Email:             admin@admin.com');
                     console.log('Password:          root');
                     console.log('==================================================\\n');
                });
            }).on('error', (e) => {
                // Connection failed (ECONNREFUSED usually), retry
                setTimeout(checkStatus, 2000);
            });
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
            args: ['pkg', 'set', 'fontawesomeIcon=fas fa-database text-blue-500']
        }
    ]
};

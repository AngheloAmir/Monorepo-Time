import type { ProjectTemplate } from "../../types";

export const PeppermintLocal: ProjectTemplate = {
    name: "Peppermint",
    description: "Lightweight ticketing system (Docker)",
    notes: "Requires Docker. Default login: admin@admin.com / 1234. Great for testing n8n integrations!",
    type: "opensource-app",
    category: "Open Source",
    icon: "fas fa-ticket-alt text-green-400",
    templating: [
        {
            action: 'file',
            file: 'docker-compose.yml',
            filecontent: `services:
  peppermint:
    image: pepperlabs/peppermint:latest
    pull_policy: if_not_present
    restart: unless-stopped
    ports:
      - "3003:3000"
      - "5003:5003"
    environment:
      - DB_USERNAME=peppermint
      - DB_PASSWORD=peppermint123
      - DB_HOST=peppermint-db
      - SECRET=supersecretkey123changeme
      - API_URL=http://localhost:5003
    depends_on:
      peppermint-db:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "wget", "--spider", "-q", "http://localhost:3000"]
      interval: 10s
      timeout: 5s
      retries: 10

  peppermint-db:
    image: postgres:15-alpine
    pull_policy: if_not_present
    restart: unless-stopped
    environment:
      - POSTGRES_USER=peppermint
      - POSTGRES_PASSWORD=peppermint123
      - POSTGRES_DB=peppermint
    volumes:
      - ./peppermint-data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U peppermint"]
      interval: 5s
      timeout: 5s
      retries: 10`
        },
        {
            action: 'file',
            file: '.gitignore',
            filecontent: `# Data folder
peppermint-data/

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
const DATA_DIR = path.join(__dirname, 'peppermint-data');

console.log('Starting Peppermint Ticketing...');

// Pre-create data directory
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    console.log('Created peppermint-data directory');
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
    exec('docker compose port peppermint 3000', (err, stdout, stderr) => {
        if (err || stderr || !stdout) {
            setTimeout(checkStatus, 2000);
            return;
        }
        const port = stdout.trim().split(':')[1];
        if (!port) {
            setTimeout(checkStatus, 2000);
            return;
        }

        // Verify peppermint is responding
        http.get(\`http://localhost:\${port}\`, (res) => {
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
                console.log('🌿 Peppermint Ticketing System');
                console.log('==================================================');
                console.log(\`Web UI:            http://localhost:\${port}\`);
                console.log('API:               http://localhost:5003');
                console.log('--------------------------------------------------');
                console.log('📧 Default Login:');
                console.log('   Email:    admin@admin.com');
                console.log('   Password: 1234');
                console.log('--------------------------------------------------');
                console.log('🔗 n8n Integration:');
                console.log('   Use the API at http://localhost:5003');
                console.log('   Docs: https://docs.peppermint.sh');
                console.log('==================================================\\n');
            });
        }).on('error', () => {
            setTimeout(checkStatus, 2000);
        });
    });
};

setTimeout(checkStatus, 5000);

const cleanup = () => {
    console.log('Stopping Peppermint...');
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
            args: ['pkg', 'set', 'description=Peppermint Ticketing (Docker)']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'appType=tool']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'fontawesomeIcon=fas fa-ticket-alt text-green-400']
        }
    ]
};

import type { ProjectTemplate } from "../../types";

export const PgwebTool: ProjectTemplate = {
    name: "Pgweb",
    description: "PostgreSQL Web GUI (Lightweight)",
    notes: "Requires Docker. Connects to any PostgreSQL database.",
    type: "tool",
    category: "Tool",
    icon: "fas fa-database text-blue-500",
    templating: [
        {
            action: 'file',
            file: 'docker-compose.yml',
            filecontent: `services:
  pgweb:
    image: sosedoff/pgweb
    pull_policy: if_not_present
    restart: unless-stopped
    ports:
      - "4250:8081"
    environment:
      - PGWEB_AUTH_USER=admin
      - PGWEB_AUTH_PASS=admin
    extra_hosts:
      - "host.docker.internal:host-gateway"
    healthcheck:
      test: ["CMD", "wget", "--spider", "-q", "http://localhost:8081"]
      interval: 10s
      timeout: 5s
      retries: 5`
        },
        {
            action: 'file',
            file: '.gitignore',
            filecontent: `# Runtime file
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

console.log('Starting Pgweb...');

// Start Docker Compose
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
    // We update runtime file later when we get the container ID
});

// Check status loop
const checkStatus = () => {
    exec('docker compose port pgweb 8081', (err, stdout, stderr) => {
        if (err || stderr || !stdout) {
            setTimeout(checkStatus, 2000);
            return;
        }
        const port = stdout.trim().split(':')[1];
        if (!port) {
            setTimeout(checkStatus, 2000);
            return;
        }

        // Verify pgweb is responding
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
                console.log('🐘 Pgweb - PostgreSQL Web GUI');
                console.log('==================================================');
                console.log(\`URL:               http://localhost:\${port}\`);
                console.log('Auth User:         admin');
                console.log('Auth Password:     admin');
                console.log('--------------------------------------------------');
                console.log('📌 CONNECTION SETTINGS (in Pgweb UI):');
                console.log('   Host:           host.docker.internal');
                console.log('   Port:           <PostgreSQL mapped port>');
                console.log('   SSL Mode:       disable');
                console.log('--------------------------------------------------');
                console.log('🔐 IF USING BUILT-IN POSTGRESQL TEMPLATE:');
                console.log('   Username:       admin');
                console.log('   Password:       admin');
                console.log('   Database:       db');
                console.log('--------------------------------------------------');
                console.log('💡 TIP: Check PostgreSQL terminal for its port!');
                console.log('==================================================\\n');
            });
        }).on('error', () => {
            setTimeout(checkStatus, 2000);
        });
    });
};

setTimeout(checkStatus, 3000);

const cleanup = () => {
    console.log('Stopping Pgweb...');
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
            args: ['pkg', 'set', 'description=Pgweb - PostgreSQL Web GUI']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'fontawesomeIcon=fas fa-elephant text-blue-500']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'appType=tool']
        }
    ]
};

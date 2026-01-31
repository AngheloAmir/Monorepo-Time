import type { ProjectTemplate } from "../../types";

export const HeadlampTool: ProjectTemplate = {
    name: "Headlamp",
    description: "Kubernetes Web UI",
    notes: "Requires Docker. Connects to local or remote Kubernetes clusters.",
    type: "tool",
    category: "Tool",
    icon: "fas fa-cubes text-blue-500",
    templating: [
        {
            action: 'file',
            file: 'docker-compose.yml',
            filecontent: `services:
  headlamp:
    image: ghcr.io/headlamp-k8s/headlamp:latest
    pull_policy: if_not_present
    restart: unless-stopped
    ports:
      - "4466:4466"
    volumes:
      # Mount kubeconfig so Headlamp can find your clusters
      # Typically ~/.kube/config on your host
      - \${HOME}/.kube/config:/root/.kube/config:ro
    healthcheck:
      test: ["CMD", "wget", "--spider", "-q", "http://localhost:4466"]
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
const os = require('os');

const RUNTIME_FILE = path.join(__dirname, '.runtime.json');

console.log('Starting Headlamp...');

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
    // We update runtime file later when we get the container ID
});

// Check status loop
const checkStatus = () => {
    exec('docker compose port headlamp 4466', (err, stdout, stderr) => {
        if (err || stderr || !stdout) {
            setTimeout(checkStatus, 2000);
            return;
        }
        const port = stdout.trim().split(':')[1];
        if (!port) {
            setTimeout(checkStatus, 2000);
            return;
        }

        // Verify headlamp is responding
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
                console.log('☸️  Headlamp - Kubernetes Web UI');
                console.log('==================================================');
                console.log(\`URL:               http://localhost:\${port}\`);
                console.log('--------------------------------------------------');
                console.log('💡 Note: Automatically tries to load ~/.kube/config');
                console.log('   Ensure your Docker Desktop / Engines share');
                console.log('   has access to your home directory.');
                console.log('==================================================\\n');
            });
        }).on('error', () => {
            setTimeout(checkStatus, 2000);
        });
    });
};

setTimeout(checkStatus, 3000);

const cleanup = () => {
    console.log('Stopping Headlamp...');
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
            args: ['pkg', 'set', 'description=Headlamp - Kubernetes Web UI']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'fontawesomeIcon=fas fa-cubes text-blue-500']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'appType=tool']
        }
    ]
};

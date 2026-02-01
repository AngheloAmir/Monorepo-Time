import type { ProjectTemplate } from "../../types";

export const LocalKubernetesTool: ProjectTemplate = {
    name: "Local Kubernetes",
    description: "K3s Cluster",
    notes: "Runs a K3s cluster in Docker. Generates a kubeconfig for external tools.",
    type: "tool",
    category: "Service",
    icon: "fas fa-cubes text-blue-600",
    templating: [
        {
            action: 'file',
            file: 'docker-compose.yml',
            filecontent: `services:
  k3s:
    image: rancher/k3s:v1.29.1-k3s1
    command: server --disable=traefik
    privileged: true
    pull_policy: if_not_present
    restart: unless-stopped
    tmpfs:
      - /run
      - /var/run
    environment:
      - K3S_KUBECONFIG_MODE=644
      - K3S_TOKEN=secret
    ports:
      - "6443:6443"
    volumes:
      - ./k3s-config:/etc/rancher/k3s
      - k3s-data:/var/lib/rancher/k3s
    healthcheck:
      test: ["CMD", "sh", "-c", "test -f /etc/rancher/k3s/k3s.yaml"]
      interval: 5s
      timeout: 5s
      retries: 10

volumes:
  k3s-data:`
        },
        {
            action: 'file',
            file: '.gitignore',
            filecontent: `# Local data
k3s-config/
k3s-data/

# Runtime file
.runtime.json
kubeconfig_host.yaml
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
const K3S_CONFIG_DIR = path.join(__dirname, 'k3s-config');
const K3S_FILE = path.join(K3S_CONFIG_DIR, 'k3s.yaml');

console.log('Starting Local Kubernetes (K3s)...');

// Ensure directories exist
if (!fs.existsSync(K3S_CONFIG_DIR)) fs.mkdirSync(K3S_CONFIG_DIR, { recursive: true });

// Start Docker Compose
const child = spawn('docker', ['compose', 'up', '-d', '--remove-orphans'], { stdio: 'inherit' });

child.on('close', (code) => {
    if (code !== 0) process.exit(code);
    
    // Follow logs for K3s
    const logs = spawn('docker', ['compose', 'logs', '-f', 'k3s', '--tail=0'], { stdio: ['ignore', 'pipe', 'pipe'] });
    
    const printImportant = (data) => {
        // Optional: Filter logs if needed
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

server.listen(0, () => { /* Update runtime later */ });

// Check status loop
const checkStatus = () => {
    exec('docker compose port k3s 6443', (err, stdout, stderr) => {
        if (err || stderr || !stdout) {
            setTimeout(checkStatus, 2000);
            return;
        }

        const k3sHostPort = stdout.trim().split(':')[1];
        if (!k3sHostPort) {
             setTimeout(checkStatus, 2000);
             return;
        }

        // Generate Host Usable Kubeconfig
        if (fs.existsSync(K3S_FILE)) {
             try {
                 let content = fs.readFileSync(K3S_FILE, 'utf8');
                 // Replace 127.0.0.1 with 127.0.0.1 (redundant but safe) + correct port
                 const hostConfig = content.replace('server: https://127.0.0.1:6443', \`server: https://127.0.0.1:\${k3sHostPort}\`);
                 fs.writeFileSync(path.join(__dirname, 'kubeconfig_host.yaml'), hostConfig);
             } catch(e) {
                 console.error("Error writing kubeconfig_host.yaml", e);
             }
        } else {
             // Config not ready yet
             setTimeout(checkStatus, 1000);
             return;
        }

        exec('docker compose ps -q', (err2, stdout2) => {
            const containerIds = stdout2 ? stdout2.trim().split('\\n') : [];
            
            try {
                fs.writeFileSync(RUNTIME_FILE, JSON.stringify({ 
                    port: server.address().port, 
                    pid: process.pid,
                    containerIds: containerIds
                }));
            } catch(e) {}

            process.stdout.write('\\x1Bc');
            console.log('\\n==================================================');
            console.log('☸️  Local Kubernetes (K3s)');
            console.log('==================================================');
            console.log(\`K8s API:           https://127.0.0.1:\${k3sHostPort}\`);
            console.log(\`Host Kubeconfig:   \${path.join(__dirname, 'kubeconfig_host.yaml')}\`);
            console.log('--------------------------------------------------');
            console.log('To use with Headlamp or kubectl:');
            console.log(\`  export KUBECONFIG=\${path.join(__dirname, 'kubeconfig_host.yaml')}\`);
            console.log('  OR load this file into Headlamp');
            console.log('==================================================\\n');
        });
    });
};

setTimeout(checkStatus, 3000);

const cleanup = () => {
    console.log('Stopping Cluster...');
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
            args: ['pkg', 'set', 'description=K3s Kubernetes Cluster']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'fontawesomeIcon=fas fa-cubes text-blue-600']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'appType=tool']
        }
    ]
};

export const serverJs = `const http = require('http');
const { spawn, exec, execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const RUNTIME_FILE = path.join(__dirname, '.runtime.json');
const CLUSTER_NAME = 'learning-cluster';
const HEADLAMP_PORT = 7000;

// Helper to run commands with promise
const runCommand = (cmd, args = [], options = {}) => {
    return new Promise((resolve, reject) => {
        const child = spawn(cmd, args, { stdio: 'inherit', ...options });
        child.on('close', (code) => {
            if (code === 0) resolve();
            else reject(new Error(\`Command \${cmd} exited with code \${code}\`));
        });
        child.on('error', reject);
    });
};

// Check if k3d is installed
const checkK3d = () => {
    try {
        execSync('k3d --version', { stdio: 'pipe' });
        return true;
    } catch (e) {
        return false;
    }
};

// Check if cluster exists
const clusterExists = () => {
    try {
        const output = execSync(\`k3d cluster list -o json\`, { encoding: 'utf8' });
        const clusters = JSON.parse(output);
        return clusters.some(c => c.name === CLUSTER_NAME);
    } catch (e) {
        return false;
    }
};

// Check if cluster is running
const clusterRunning = () => {
    try {
        const output = execSync(\`k3d cluster list -o json\`, { encoding: 'utf8' });
        const clusters = JSON.parse(output);
        const cluster = clusters.find(c => c.name === CLUSTER_NAME);
        return cluster && cluster.serversRunning > 0;
    } catch (e) {
        return false;
    }
};

async function main() {
    console.log('╔══════════════════════════════════════════════════════════════╗');
    console.log('║       🚀 K3d + Headlamp Learning Environment               ║');
    console.log('╚══════════════════════════════════════════════════════════════╝');
    console.log('');
    console.log('Note: if you having errors, try to run: ');
    console.log('k3d cluster delete learning-cluster');
    console.log('');

    // Check all prerequisites
    console.log('Checking dependencies...');
    console.log('');
    let hasErrors = false;

    // Check Docker (required)
    try {
        execSync('docker --version', { stdio: 'pipe' });
        console.log('✓ Docker is installed');
    } catch (e) {
        console.log('✗ ERROR: Docker is not installed!');
        console.log('  K3d and Headlamp require Docker to run.');
        console.log('  Install Docker: https://docs.docker.com/get-docker/');
        hasErrors = true;
    }

    // Check Docker Compose (required for Headlamp)
    try {
        execSync('docker compose version', { stdio: 'pipe' });
        console.log('✓ Docker Compose is installed');
    } catch (e) {
        console.log('✗ ERROR: Docker Compose is not installed!');
        console.log('  Headlamp requires Docker Compose to run.');
        console.log('  Install Docker Compose: https://docs.docker.com/compose/install/');
        hasErrors = true;
    }

    // Check k3d (required)
    if (!checkK3d()) {
        console.log('✗ ERROR: k3d is not installed!');
        console.log('  Install k3d using one of these methods:');
        console.log('  • curl -s https://raw.githubusercontent.com/k3d-io/k3d/main/install.sh | bash');
        console.log('  • wget -q -O - https://raw.githubusercontent.com/k3d-io/k3d/main/install.sh | bash');
        console.log('  • brew install k3d (on macOS)');
        hasErrors = true;
    } else {
        console.log('✓ k3d is installed');
    }

    // Check kubectl (optional but recommended)
    try {
        execSync('kubectl version --client', { stdio: 'pipe' });
        console.log('✓ kubectl is installed');
    } catch (e) {
        console.log('⚠ WARNING: kubectl is not installed');
        console.log('  The kubectl commands in this guide will not work without it.');
        console.log('  Install kubectl: https://kubernetes.io/docs/tasks/tools/');
        console.log('  (You can still use Headlamp UI without kubectl)');
    }

    console.log('');

    if (hasErrors) {
        console.log('══════════════════════════════════════════════════════════════');
        console.log('❌ Missing required dependencies. Please install them first.');
        console.log('══════════════════════════════════════════════════════════════');
        process.exit(1);
    }

    console.log('✓ All required dependencies are installed');
    console.log('');

    // Create or start cluster
    if (!clusterExists()) {
        console.log(\`\\\\nCreating k3d cluster "\${CLUSTER_NAME}"...\`);
        try {
            await runCommand('k3d', [
                'cluster', 'create', CLUSTER_NAME,
                '--api-port', '6443',
                '--servers', '1',
                '--agents', '2',
                '--port', '8080:80@loadbalancer',
                '--port', '8443:443@loadbalancer',
                '--k3s-arg', '--tls-san=host.k3d.internal@server:*',
                '--wait'
            ]);
            console.log(\`✓ Cluster "\${CLUSTER_NAME}" created successfully\`);
        } catch (e) {
            console.error('❌ Failed to create cluster');
            process.exit(1);
        }
    } else if (!clusterRunning()) {
        console.log(\`\\\\nStarting existing cluster "\${CLUSTER_NAME}"...\`);
        try {
            await runCommand('k3d', ['cluster', 'start', CLUSTER_NAME]);
            console.log(\`✓ Cluster "\${CLUSTER_NAME}" started\`);
        } catch (e) {
            console.error('❌ Failed to start cluster');
            console.log('This often happens if the cluster network was deleted or Docker was restarted.');
            console.log('Try deleting and recreating the cluster:');
            console.log(\`  k3d cluster delete \${CLUSTER_NAME}\`);
            console.log('  npm run start');
            process.exit(1);
        }
    } else {
        console.log(\`✓ Cluster "\${CLUSTER_NAME}" is already running\`);
    }

    // Update kubeconfig
    console.log('\\\\nUpdating kubeconfig...');
    
    // 1. Try to export config to local file (REQUIRED for Headlamp)
    try {
        let kubeconfig = execSync(\`k3d kubeconfig get \${CLUSTER_NAME}\`, { encoding: 'utf8' });
        
        // Fix connectivity: replace loopback IPs with host.k3d.internal for container access
        kubeconfig = kubeconfig.replace(/0\\.0\\.0\\.0/g, 'host.k3d.internal');
        kubeconfig = kubeconfig.replace(/127\\.0\\.0\\.1/g, 'host.k3d.internal');

        // Fix TLS: Skip verification since host.k3d.internal is not in the default cert
        // Replace certificate-authority-data line with insecure-skip-tls-verify (preserve indentation)
        kubeconfig = kubeconfig.replace(/(\\s+)certificate-authority-data:.*\\n/g, '$1insecure-skip-tls-verify: true\\n');

        const kubeDir = path.join(__dirname, '.kube');
        if (!fs.existsSync(kubeDir)) {
            fs.mkdirSync(kubeDir, { recursive: true, mode: 0o755 });
        }
        const kubePath = path.join(kubeDir, 'config');
        fs.writeFileSync(kubePath, kubeconfig);
        fs.chmodSync(kubePath, 0o644);
        console.log('✓ Local kubeconfig updated (for container access)');
    } catch (e) {
        console.error('❌ Failed to create local kubeconfig!');
        console.error(e.message);
        process.exit(1);
    }

    // 2. Try to merge into global config for user convenience (kubectl)
    try {
        execSync(\`k3d kubeconfig merge \${CLUSTER_NAME} --kubeconfig-merge-default\`, { stdio: 'pipe' });
        console.log('✓ Global kubeconfig updated');
    } catch (e) {
        console.warn('⚠ Could not update global kubeconfig automatically');
        console.log('Hint: This is usually because /home/anghelo/.kube/config is a root-owned directory.');
        console.log('Fix it with: sudo rm -rf /home/anghelo/.kube/config');
    }

    // Start Headlamp via Docker Compose
    console.log('\\\\nStarting Headlamp UI...');
    const child = spawn('docker', ['compose', 'up', '-d', '--remove-orphans'], { stdio: 'inherit', cwd: __dirname });

    child.on('close', (code) => {
        if (code !== 0) process.exit(code);

        // Follow logs with filtering
        const logs = spawn('docker', ['compose', 'logs', '-f', '--tail=0'], { stdio: ['ignore', 'pipe', 'pipe'], cwd: __dirname });

        const printImportant = (data) => {
            const lines = data.toString().split('\\\\n');
            lines.forEach(line => {
                let cleanLine = line.replace(/^[^|]+\\|\\s+/, '');
                const lower = cleanLine.toLowerCase();
                if (lower.includes('error') || lower.includes('fatal') || lower.includes('panic')) {
                    process.stdout.write('Error: ' + cleanLine + '\\\\n');
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
    });

    // Check status loop
    const checkStatus = () => {
        exec(\`docker compose port headlamp 4466\`, { cwd: __dirname }, (err, stdout, stderr) => {
            if (err || stderr || !stdout) {
                setTimeout(checkStatus, 2000);
                return;
            }
            const headlampPort = stdout.trim().split(':')[1];
            if (!headlampPort) {
                setTimeout(checkStatus, 2000);
                return;
            }

            // Verify Headlamp is actually responding
            http.get(\`http://localhost:\${headlampPort}/\`, (res) => {
                // Capture Container IDs
                exec('docker compose ps -q', { cwd: __dirname }, (err2, stdout2) => {
                    const containerIds = stdout2 ? stdout2.trim().split('\\\\n') : [];

                    try {
                        fs.writeFileSync(RUNTIME_FILE, JSON.stringify({
                            port: server.address().port,
                            pid: process.pid,
                            containerIds: containerIds,
                            clusterName: CLUSTER_NAME
                        }));
                    } catch (e) {
                        console.error('Failed to write runtime file:', e);
                    }

                    process.stdout.write('\\x1Bc');
                    console.log('╔══════════════════════════════════════════════════════════════╗');
                    console.log('║                    🎉 Setup Complete!                       ║');
                    console.log('╠══════════════════════════════════════════════════════════════╣');
                    console.log(\`║  📊 Headlamp UI:   http://localhost:\${headlampPort}                    ║\`);
                    console.log('║  🔧 Cluster:       k3d-' + CLUSTER_NAME + '                       ║');
                    console.log('╠══════════════════════════════════════════════════════════════╣');
                    console.log('║                                                              ║');
                    console.log('║  📚 Quick Commands:                                         ║');
                    console.log('║    kubectl get nodes                                        ║');
                    console.log('║    kubectl get pods --all-namespaces                        ║');
                    console.log('║    kubectl create deployment nginx --image=nginx            ║');
                    console.log('║    kubectl expose deployment nginx --port=80 --type=NodePort║');
                    console.log('║                                                              ║');
                    console.log('║  🔗 Documentation:                                          ║');
                    console.log('║    K3d:      https://k3d.io/                                 ║');
                    console.log('║    Headlamp: https://headlamp.dev/                          ║');
                    console.log('║    K8s:      https://kubernetes.io/docs/                    ║');
                    console.log('║                                                              ║');
                    console.log('╚══════════════════════════════════════════════════════════════╝');
                    console.log('');
                    console.log('Press Ctrl+C to stop the services');
                });
            }).on('error', (e) => {
                setTimeout(checkStatus, 2000);
            });
        });
    };

    setTimeout(checkStatus, 3000);
}

const cleanup = () => {
    console.log('\\\\nStopping services...');
    
    // Read runtime file to get tracked container IDs
    let runtimeData = { containerIds: [] };
    try {
        const content = fs.readFileSync(RUNTIME_FILE, 'utf8');
        runtimeData = JSON.parse(content);
    } catch (e) {
        // Runtime file might not exist
    }
    
    // Stop docker compose containers
    exec('docker compose down --remove-orphans', { cwd: __dirname }, (err, stdout, stderr) => {
        if (err) {
            console.log('⚠ docker compose down failed, trying to stop containers directly...');
            
            // Fallback: stop containers by ID if we have them
            if (runtimeData.containerIds && runtimeData.containerIds.length > 0) {
                const ids = runtimeData.containerIds.join(' ');
                exec(\`docker stop \${ids} 2>/dev/null; docker rm \${ids} 2>/dev/null\`, () => {
                    console.log('✓ Containers stopped');
                });
            }
        } else {
            console.log('✓ Headlamp stopped');
        }

        // Ask if user wants to stop the cluster too
        const readline = require('readline');
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        rl.question('Do you want to stop the k3d cluster as well? (y/N): ', (answer) => {
            if (answer.toLowerCase() === 'y') {
                console.log(\`Stopping cluster "\${CLUSTER_NAME}"...\`);
                exec(\`k3d cluster stop \${CLUSTER_NAME}\`, () => {
                    console.log('✓ Cluster stopped');
                    console.log('(Run "npm run cluster:delete" to permanently delete the cluster)');
                    try { fs.unlinkSync(RUNTIME_FILE); } catch (e) { }
                    rl.close();
                    process.exit(0);
                });
            } else {
                console.log('(Cluster is still running. Run "npm run cluster:stop" to stop it later)');
                try { fs.unlinkSync(RUNTIME_FILE); } catch (e) { }
                rl.close();
                process.exit(0);
            }
        });
    });
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

main().catch(console.error);`;

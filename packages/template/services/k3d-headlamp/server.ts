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
    console.log('\\\\x1b[36m╔══════════════════════════════════════════════════════════════╗\\\\x1b[0m');
    console.log('\\\\x1b[36m║\\\\x1b[0m       🚀 K3d + Headlamp Learning Environment               \\\\x1b[36m║\\\\x1b[0m');
    console.log('\\\\x1b[36m╚══════════════════════════════════════════════════════════════╝\\\\x1b[0m');
    console.log('');

    // Check prerequisites
    if (!checkK3d()) {
        console.log('\\\\x1b[31m❌ k3d is not installed!\\\\x1b[0m');
        console.log('');
        console.log('\\\\x1b[33mInstall k3d using one of these methods:\\\\x1b[0m');
        console.log('  • curl -s https://raw.githubusercontent.com/k3d-io/k3d/main/install.sh | bash');
        console.log('  • wget -q -O - https://raw.githubusercontent.com/k3d-io/k3d/main/install.sh | bash');
        console.log('  • brew install k3d (on macOS)');
        console.log('');
        process.exit(1);
    }
    console.log('\\\\x1b[32m✓ k3d is installed\\\\x1b[0m');

    // Create or start cluster
    if (!clusterExists()) {
        console.log(\`\\\\n\\\\x1b[33mCreating k3d cluster "\${CLUSTER_NAME}"...\\\\x1b[0m\`);
        try {
            await runCommand('k3d', [
                'cluster', 'create', CLUSTER_NAME,
                '--api-port', '6443',
                '--servers', '1',
                '--agents', '2',
                '--port', '8080:80@loadbalancer',
                '--port', '8443:443@loadbalancer',
                '--tls-san', 'host.k3d.internal',
                '--wait'
            ]);
            console.log(\`\\\\x1b[32m✓ Cluster "\${CLUSTER_NAME}" created successfully\\\\x1b[0m\`);
        } catch (e) {
            console.error('\\\\x1b[31m❌ Failed to create cluster\\\\x1b[0m');
            process.exit(1);
        }
    } else if (!clusterRunning()) {
        console.log(\`\\\\n\\\\x1b[33mStarting existing cluster "\${CLUSTER_NAME}"...\\\\x1b[0m\`);
        try {
            await runCommand('k3d', ['cluster', 'start', CLUSTER_NAME]);
            console.log(\`\\\\x1b[32m✓ Cluster "\${CLUSTER_NAME}" started\\\\x1b[0m\`);
        } catch (e) {
            console.error('\\\\x1b[31m❌ Failed to start cluster\\\\x1b[0m');
            console.log('\\\\x1b[33mThis often happens if the cluster network was deleted or Docker was restarted.\\\\x1b[0m');
            console.log('\\\\x1b[33mTry deleting and recreating the cluster:\\\\x1b[0m');
            console.log(\`  k3d cluster delete \${CLUSTER_NAME}\`);
            console.log('  npm run start');
            process.exit(1);
        }
    } else {
        console.log(\`\\\\x1b[32m✓ Cluster "\${CLUSTER_NAME}" is already running\\\\x1b[0m\`);
    }

    // Update kubeconfig
    console.log('\\\\n\\\\x1b[33mUpdating kubeconfig...\\\\x1b[0m');
    
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
        console.log('\\\\x1b[32m✓ Local kubeconfig updated (for container access)\\\\x1b[0m');
    } catch (e) {
        console.error('\\\\x1b[31m❌ Failed to create local kubeconfig!\\\\x1b[0m');
        console.error(e.message);
        process.exit(1);
    }

    // 2. Try to merge into global config for user convenience (kubectl)
    try {
        execSync(\`k3d kubeconfig merge \${CLUSTER_NAME} --kubeconfig-merge-default\`, { stdio: 'pipe' });
        console.log('\\\\x1b[32m✓ Global kubeconfig updated\\\\x1b[0m');
    } catch (e) {
        console.warn('\\\\x1b[33m⚠ Could not update global kubeconfig automatically\\\\x1b[0m');
        console.log('\\\\x1b[90mHint: This is usually because /home/anghelo/.kube/config is a root-owned directory.\\\\x1b[0m');
        console.log('\\\\x1b[90mFix it with: sudo rm -rf /home/anghelo/.kube/config\\\\x1b[0m');
    }

    // Start Headlamp via Docker Compose
    console.log('\\\\n\\\\x1b[33mStarting Headlamp UI...\\\\x1b[0m');
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
                    process.stdout.write('\\\\x1b[31mError:\\\\x1b[0m ' + cleanLine + '\\\\n');
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

                    console.log('');
                    console.log('\\\\x1b[36m╔══════════════════════════════════════════════════════════════╗\\\\x1b[0m');
                    console.log('\\\\x1b[36m║\\\\x1b[0m                    🎉 Setup Complete!                       \\\\x1b[36m║\\\\x1b[0m');
                    console.log('\\\\x1b[36m╠══════════════════════════════════════════════════════════════╣\\\\x1b[0m');
                    console.log(\`\\\\x1b[36m║\\\\x1b[0m  📊 Headlamp UI:   http://localhost:\${headlampPort}                    \\\\x1b[36m║\\\\x1b[0m\`);
                    console.log('\\\\x1b[36m║\\\\x1b[0m  🔧 Cluster:       k3d-' + CLUSTER_NAME + '                       \\\\x1b[36m║\\\\x1b[0m');
                    console.log('\\\\x1b[36m╠══════════════════════════════════════════════════════════════╣\\\\x1b[0m');
                    console.log('\\\\x1b[36m║\\\\x1b[0m                                                              \\\\x1b[36m║\\\\x1b[0m');
                    console.log('\\\\x1b[36m║\\\\x1b[0m  📚 Quick Commands:                                         \\\\x1b[36m║\\\\x1b[0m');
                    console.log('\\\\x1b[36m║\\\\x1b[0m    kubectl get nodes                                        \\\\x1b[36m║\\\\x1b[0m');
                    console.log('\\\\x1b[36m║\\\\x1b[0m    kubectl get pods --all-namespaces                        \\\\x1b[36m║\\\\x1b[0m');
                    console.log('\\\\x1b[36m║\\\\x1b[0m    kubectl create deployment nginx --image=nginx            \\\\x1b[36m║\\\\x1b[0m');
                    console.log('\\\\x1b[36m║\\\\x1b[0m    kubectl expose deployment nginx --port=80 --type=NodePort\\\\x1b[36m║\\\\x1b[0m');
                    console.log('\\\\x1b[36m║\\\\x1b[0m                                                              \\\\x1b[36m║\\\\x1b[0m');
                    console.log('\\\\x1b[36m║\\\\x1b[0m  🔗 Documentation:                                          \\\\x1b[36m║\\\\x1b[0m');
                    console.log('\\\\x1b[36m║\\\\x1b[0m    K3d:      https://k3d.io/                                 \\\\x1b[36m║\\\\x1b[0m');
                    console.log('\\\\x1b[36m║\\\\x1b[0m    Headlamp: https://headlamp.dev/                          \\\\x1b[36m║\\\\x1b[0m');
                    console.log('\\\\x1b[36m║\\\\x1b[0m    K8s:      https://kubernetes.io/docs/                    \\\\x1b[36m║\\\\x1b[0m');
                    console.log('\\\\x1b[36m║\\\\x1b[0m                                                              \\\\x1b[36m║\\\\x1b[0m');
                    console.log('\\\\x1b[36m╚══════════════════════════════════════════════════════════════╝\\\\x1b[0m');
                    console.log('');
                    console.log('\\\\x1b[33mPress Ctrl+C to stop the services\\\\x1b[0m');
                });
            }).on('error', (e) => {
                setTimeout(checkStatus, 2000);
            });
        });
    };

    setTimeout(checkStatus, 3000);
}

const cleanup = () => {
    console.log('\\\\n\\\\x1b[33mStopping services...\\\\x1b[0m');
    exec('docker compose down', { cwd: __dirname }, (err, stdout, stderr) => {
        console.log('\\\\x1b[32m✓ Headlamp stopped\\\\x1b[0m');

        // Ask if user wants to stop the cluster too
        const readline = require('readline');
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        rl.question('\\\\x1b[33mDo you want to stop the k3d cluster as well? (y/N): \\\\x1b[0m', (answer) => {
            if (answer.toLowerCase() === 'y') {
                console.log(\`\\\\x1b[33mStopping cluster "\${CLUSTER_NAME}"...\\\\x1b[0m\`);
                exec(\`k3d cluster stop \${CLUSTER_NAME}\`, () => {
                    console.log('\\\\x1b[32m✓ Cluster stopped\\\\x1b[0m');
                    console.log('\\\\x1b[90m(Run "npm run cluster:delete" to permanently delete the cluster)\\\\x1b[0m');
                    try { fs.unlinkSync(RUNTIME_FILE); } catch (e) { }
                    rl.close();
                    process.exit(0);
                });
            } else {
                console.log('\\\\x1b[90m(Cluster is still running. Run "npm run cluster:stop" to stop it later)\\\\x1b[0m');
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

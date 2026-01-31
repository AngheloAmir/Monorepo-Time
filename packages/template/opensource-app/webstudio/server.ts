export const serverJs = `const http = require('http');
const { spawn, exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const RUNTIME_FILE = path.join(__dirname, '.runtime.json');
const PORT = 5173;

console.log('\\n==================================================');
console.log('Starting Webstudio Development Environment...');
console.log('==================================================\\n');

// Start Docker Compose
const child = spawn('docker', ['compose', 'up', '--build', '-d', '--remove-orphans'], { stdio: 'inherit' });

child.on('close', (code) => {
    if (code !== 0) process.exit(code);
    
    console.log('\\nBuilding and starting containers...');
    console.log('This may take 5-10 minutes on first run...\\n');
    
    // Follow logs - show everything during setup
    const logs = spawn('docker', ['compose', 'logs', '-f', '--tail=100'], { stdio: ['ignore', 'pipe', 'pipe'] });
    
    let serverReady = false;
    
    const processLine = (data) => {
        const lines = data.toString().split('\\n');
        lines.forEach(line => {
            if (!line.trim()) return;
            
            let cleanLine = line.replace(/^[^|]+\\|\\s+/, '');
            const lower = cleanLine.toLowerCase();
            
            // Check if server is ready
            if (lower.includes('local:') || lower.includes('ready in') || lower.includes('listening on')) {
                if (!serverReady) {
                    serverReady = true;
                    showReadyMessage();
                }
            }
            
            // Show all output during setup, filter only after ready
            if (!serverReady) {
                // During setup - show everything
                if (lower.includes('error') || lower.includes('fatal') || lower.includes('warn')) {
                    process.stdout.write('\\x1b[31m' + cleanLine + '\\x1b[0m\\n');
                } else if (lower.includes('progress') || lower.includes('packages') || lower.includes('added') || lower.includes('done')) {
                    process.stdout.write('\\x1b[32m' + cleanLine + '\\x1b[0m\\n');
                } else {
                    process.stdout.write(cleanLine + '\\n');
                }
            } else {
                // After ready - only show errors
                if (lower.includes('error') || lower.includes('fatal') || lower.includes('panic')) {
                    process.stdout.write('\\x1b[31mError:\\x1b[0m ' + cleanLine + '\\n');
                }
            }
        });
    };

    logs.stdout.on('data', processLine);
    logs.stderr.on('data', processLine);
    logs.on('close', (c) => process.exit(c || 0));
});

const showReadyMessage = () => {
    // Capture Container IDs
    exec('docker compose ps -q', (err, stdout) => {
        const containerIds = stdout ? stdout.trim().split('\\n') : [];
        
        try {
            fs.writeFileSync(RUNTIME_FILE, JSON.stringify({ 
                port: server.address().port, 
                pid: process.pid,
                containerIds: containerIds
            }));
        } catch(e) {
            console.error('Failed to write runtime file:', e);
        }
        
        console.log('\\n==================================================');
        console.log('\\x1b[32mWebstudio is running!\\x1b[0m');
        console.log('--------------------------------------------------');
        console.log('URL:          http://localhost:' + PORT);
        console.log('--------------------------------------------------');
        console.log('\\x1b[33mDev Login Instructions:\\x1b[0m');
        console.log('  1. Click "Login with Secret" button');
        console.log('  2. Enter: webstudio-dev-secret-key-12345');
        console.log('--------------------------------------------------');
        console.log('To login as a different user:');
        console.log('  Use: webstudio-dev-secret-key-12345:email@example.com');
        console.log('==================================================\\n');
    });
};

// Setup Control Server for stop command
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
    exec('docker compose ps --format json', (err, stdout) => {
        if (err || !stdout) {
            setTimeout(checkStatus, 5000);
            return;
        }
        
        try {
            // Check if webstudio container is running
            const containers = stdout.trim().split('\\n').filter(l => l).map(l => JSON.parse(l));
            const webstudio = containers.find(c => c.Service === 'webstudio');
            
            if (webstudio && webstudio.State === 'running') {
                // Verify HTTP response
                http.get('http://localhost:' + PORT, (res) => {
                    if (!fs.existsSync(RUNTIME_FILE)) {
                        showReadyMessage();
                    }
                }).on('error', () => {
                    setTimeout(checkStatus, 5000);
                });
            } else {
                setTimeout(checkStatus, 5000);
            }
        } catch (e) {
            setTimeout(checkStatus, 5000);
        }
    });
};

setTimeout(checkStatus, 10000);

const cleanup = () => {
    console.log('\\nStopping Webstudio...');
    exec('docker compose down', (err, stdout, stderr) => {
        try { fs.unlinkSync(RUNTIME_FILE); } catch(e) {}
        process.exit(0);
    });
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);`;

export const serverJs = `const http = require('http');
const { spawn, exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const RUNTIME_FILE = path.join(__dirname, '.runtime.json');
const DATA_DIR = path.join(__dirname, 'n8n-data');

console.log('Starting N8N...');

// Pre-create data directory to ensure correct permissions
// Docker creates mount directories as root, causing permission issues
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    console.log('Created n8n-data directory');
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

// Check status loop
const checkStatus = () => {
    exec('docker compose port n8n 5678', (err, stdout, stderr) => {
        if (err || stderr || !stdout) {
            setTimeout(checkStatus, 2000);
            return;
        }
        const n8nPort = stdout.trim().split(':')[1];
        if (!n8nPort) {
            setTimeout(checkStatus, 2000);
            return;
        }

        // Verify N8N is actually responding to HTTP
        http.get(\`http://localhost:\${n8nPort}/healthz\`, (res) => {
            // Capture Container IDs
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
                console.clear();
            });
        }).on('error', (e) => {
            // Connection failed (ECONNREFUSED usually), retry
            setTimeout(checkStatus, 2000);
        });
    });
};

setTimeout(checkStatus, 3000);

const cleanup = () => {
    console.log('Stopping N8N...');
    exec('docker compose down', (err, stdout, stderr) => {
        try { fs.unlinkSync(RUNTIME_FILE); } catch(e) {}
        process.exit(0);
    });
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);`;

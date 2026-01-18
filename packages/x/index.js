const http = require('http');
const { spawn, exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const RUNTIME_FILE = path.join(__dirname, '.runtime.json');
let containerId = null;

console.log('Starting Meilisearch...');

// Spawn Docker Compose
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
    // We update runtime file later
});

// Check status loop
const checkStatus = () => {
    exec('docker compose port meilisearch 7700', (err, stdout, stderr) => {
        if (err || stderr || !stdout) {
            setTimeout(checkStatus, 2000);
            return;
        }
        const port = stdout.trim().split(':')[1];
        if (!port) {
            setTimeout(checkStatus, 2000);
            return;
        }

        exec('docker compose ps -q meilisearch', (err2, stdout2) => {
            let containerIds = [];
            if (stdout2) containerIds = [stdout2.trim()];

            try {
                fs.writeFileSync(RUNTIME_FILE, JSON.stringify({ 
                    port: server.address().port, 
                    pid: process.pid,
                    containerIds: containerIds 
                }));
            } catch(e) {}

            console.clear();
            console.log('\n==================================================');
            console.log('🔍 Meilisearch is running!');
            console.log('--------------------------------------------------');
            console.log(`🌐 URL:               http://localhost:${port}`);
            console.log('🔑 Master Key:        masterKey');
            console.log(`🔌 API Port:          ${port}`);
            console.log('--------------------------------------------------');
            console.log('📚 Docs: https://www.meilisearch.com/docs');
            console.log('==================================================\n');
        });
    });
};

setTimeout(checkStatus, 3000);

const cleanup = () => {
    console.log('Stopping Meilisearch...');
    try { 
        const runtime = JSON.parse(fs.readFileSync(RUNTIME_FILE));
        if (runtime.containerIds) {
             console.log(`Stopping ${runtime.containerIds.length} containers...`);
             runtime.containerIds.forEach(id => {
                exec(`docker stop ${id}`);
             });
        }
    } catch(e) {}
    try { fs.unlinkSync(RUNTIME_FILE); } catch(e) {}
    
    exec('docker compose stop', () => {
        process.exit(0);
    });
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
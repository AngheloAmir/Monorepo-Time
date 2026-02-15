export const serverJs = `const http = require('http');
const { spawn, exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const RUNTIME_FILE = path.join(__dirname, '.runtime.json');

console.log('Starting Nextcloud...');

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
    const port = server.address().port;
    // We update runtime file later when we get the container ID
});

// Check status loop
const checkStatus = () => {
    exec('docker compose port nextcloud 80', (err, stdout, stderr) => {
        if (err || stderr || !stdout) {
            setTimeout(checkStatus, 2000);
            return;
        }
        const ncPort = stdout.trim().split(':')[1];
        if (!ncPort) {
            setTimeout(checkStatus, 2000);
            return;
        }

        // Verify Nextcloud is actually responding to HTTP
        http.get(\`http://localhost:\${ncPort}/status.php\`, (res) => {
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
                
                process.stdout.write('\\x1Bc');
                console.log('\\n==================================================');
                console.log('Nextcloud - A Safe Home for All Your Data');
                console.log('Official Site:   https://nextcloud.com');
                console.log('References:      https://github.com/docker-library/docs/blob/master/nextcloud/README.md');
                console.log('==================================================');
                console.log(\`Web UI:            http://localhost:\${ncPort}\`);
                console.log(\`WebDAV:            http://localhost:\${ncPort}/remote.php/dav\`);
                console.log('--------------------------------------------------');
                console.log('First Time Setup:');
                console.log('   Create admin account on first visit');
                console.log('   If it takes too much time to load, refresh the page');
                console.log('--------------------------------------------------');
                console.log('n8n Integration:');
                console.log('   n8n has a native Nextcloud node!');
                console.log(\`   Host: http://localhost:\${ncPort}\`);
                console.log('   Docs: https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.nextcloud/');
                console.log('==================================================\\n');
            }); 
        }).on('error', (e) => {
            // Connection failed (ECONNREFUSED usually), retry
            setTimeout(checkStatus, 2000);
        });
    });
};

setTimeout(checkStatus, 3000);

const cleanup = () => {
    console.log('Stopping Nextcloud...');
    exec('docker compose down', (err, stdout, stderr) => {
        try { fs.unlinkSync(RUNTIME_FILE); } catch(e) {}
        process.exit(0);
    });
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);`;

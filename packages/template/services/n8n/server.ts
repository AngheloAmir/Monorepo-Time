export const serverJs = `const http = require('http');
const { spawn, exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const RUNTIME_FILE = path.join(__dirname, '.runtime.json');


console.log('Starting N8N...');

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
            if ((lower.includes('error') || lower.includes('fatal') || lower.includes('panic')) && !lower.includes('starting migration') && !lower.includes('finished migration')) {
                process.stdout.write('\\x1b[31mError:\\x1b[0m ' + cleanLine + '\\n');
                
                if (lower.includes('sqlite_error') || lower.includes('queryfailederror')) {
                     process.stdout.write('\\x1b[33mSuggestion: Your database might be corrupted.\\x1b[0m\\n');
                     process.stdout.write('\\x1b[33mTry running: docker compose down -v\\x1b[0m\\n');
                }
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

                process.stdout.write('\\x1Bc');
                console.log('\n==================================================');
                console.log('Official Site:     https://n8n.io');
                console.log('Docker Image:      https://hub.docker.com/r/n8nio/n8n');
                console.log('Note: N8N is fair-code licensed. Free for internal use, but commercial redistribution has restrictions.')
                console.log('==================================================\n');
                console.log('N8N is running at http://localhost:' + n8nPort);
               
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

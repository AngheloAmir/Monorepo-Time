export const serverJs = `const http = require('http');
const { spawn, exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const RUNTIME_FILE = path.join(__dirname, '.runtime.json');

console.log('Starting Penpot Design Tool...');

// Start Docker Compose
const child = spawn('docker', ['compose', 'up', '-d', '--remove-orphans'], { stdio: 'inherit' });

child.on('close', (code) => {
    if (code !== 0) process.exit(code);
    
    // Follow logs with filtering
    const logs = spawn('docker', ['compose', 'logs', '-f', '--tail=0'], { stdio: ['ignore', 'pipe', 'pipe'] });
    
    const printImportant = (data) => {
        const lines = data.toString().split('\\n');
        lines.forEach(line => {
            let cleanLine = line.replace(/^[^|]+\||\s+/, '');
            const lower = cleanLine.toLowerCase();

            // Filter out specific "expected" errors during startup
            if (lower.includes('connect() failed') || lower.includes('connection refused')) {
                return;
            }

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
});

// Check status loop
const checkStatus = () => {
    exec('docker compose port penpot-frontend 8080', (err, stdout, stderr) => {
        if (err || stderr || !stdout) {
            setTimeout(checkStatus, 2000);
            return;
        }
        const penpotPort = stdout.trim().split(':')[1];
        if (!penpotPort) {
            setTimeout(checkStatus, 2000);
            return;
        }

        // Verify Penpot Backend is actually responding
        // We check an API endpoint because the frontend might be up while backend is initializing (returning 502)
        http.get(\`http://localhost:\${penpotPort}/api/main/methods/get-profile\`, (res) => {
            if (res.statusCode >= 500) {
                // Backend likely down (502 Bad Gateway)
                setTimeout(checkStatus, 2000);
                return;
            }

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
                console.log('Penpot - Open Source Design & Prototyping');
                console.log('Official Site:   https://penpot.app');
                console.log('Docker Image:    https://hub.docker.com/r/penpotapp/frontend');
                console.log('References:      https://github.com/penpot/penpot');
                console.log('==================================================');
                console.log(\`Web UI:         http://localhost:\${penpotPort}\`);
                console.log(\`MailCatcher:    http://localhost:9002\`);
                console.log('--------------------------------------------------');
                console.log('Setup Account:');
                console.log('   Open the Web UI and create a new account.');
                console.log('   Verify email using MailCatcher (port 9002).');
                console.log('--------------------------------------------------');
                console.log('Resources:');
                console.log('   Docs: https://help.penpot.app/');
                console.log('   GitHub: https://github.com/penpot/penpot');
                console.log('==================================================\\n');
            });
        }).on('error', (e) => {
            // Connection failed (ECONNREFUSED usually), retry
            setTimeout(checkStatus, 2000);
        });
    });
};

setTimeout(checkStatus, 5000);

const cleanup = () => {
    console.log('Stopping Penpot...');
    exec('docker compose down', (err, stdout, stderr) => {
        try { fs.unlinkSync(RUNTIME_FILE); } catch(e) {}
        process.exit(0);
    });
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);`;

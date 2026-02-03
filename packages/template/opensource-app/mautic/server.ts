export const serverJs = `const http = require('http');
const { spawn, exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const RUNTIME_FILE = path.join(__dirname, '.runtime.json');

console.log('Starting Mautic...');

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
});

// Check status loop
const checkStatus = () => {
    exec('docker compose port mautic 80', (err, stdout, stderr) => {
        if (err || stderr || !stdout) {
            setTimeout(checkStatus, 2000);
            return;
        }
        const mauticPort = stdout.trim().split(':')[1];
        if (!mauticPort) {
            setTimeout(checkStatus, 2000);
            return;
        }

        // Verify Mautic is actually responding to HTTP
        http.get(\`http://localhost:\${mauticPort}/\`, (res) => {
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
                console.log('📢 Mautic - Open Source Marketing Automation');
                console.log('==================================================');
                console.log(\`Web UI:            http://localhost:\${mauticPort}\`);
                console.log(\`API:               http://localhost:\${mauticPort}/api\`);
                console.log('--------------------------------------------------');
                console.log('📧 Default Credentials:');
                console.log('   User: admin');
                console.log('   Pass: mautic');
                console.log('--------------------------------------------------');
                console.log('🔗 n8n Integration:');
                console.log('   n8n has a native Mautic node!');
                console.log(\`   API URL: http://localhost:\${mauticPort}/api\`);
                console.log('   Docs: https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.mautic/');
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
    console.log('Stopping Mautic...');
    exec('docker compose down', (err, stdout, stderr) => {
        try { fs.unlinkSync(RUNTIME_FILE); } catch(e) {}
        process.exit(0);
    });
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);`;

const http = require('http');
const { spawn, exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const RUNTIME_FILE = path.join(__dirname, '.runtime.json');

console.log('Starting CloudBeaver...');

// Start Docker Compose
// Start Docker Compose
const child = spawn('docker', ['compose', 'up', '-d', '--remove-orphans'], { stdio: 'inherit' });

child.on('close', (code) => {
    if (code !== 0) process.exit(code);
    // Follow logs with filtering
    const logs = spawn('docker', ['compose', 'logs', '-f', '--tail=0'], { stdio: ['ignore', 'pipe', 'pipe'] });
    
    const printImportant = (data) => {
        const lines = data.toString().split('\n');
        lines.forEach(line => {
            let cleanLine = line.replace(/^[^|]+|s+/, '');
            const lower = cleanLine.toLowerCase();
            if (lower.includes('error') || lower.includes('fatal') || lower.includes('panic')) {
                process.stdout.write('\x1b[31mError:\x1b[0m ' + cleanLine + '\n');
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
    // We update runtime file later when we get the container ID
});

// Check status loop
const checkStatus = () => {
    exec('docker compose port cloudbeaver 8978', (err, stdout, stderr) => {
        if (err || stderr || !stdout) {
            setTimeout(checkStatus, 2000);
            return;
        }
        const port = stdout.trim().split(':')[1];
        if (!port) {
            setTimeout(checkStatus, 2000);
            return;
        }

        // Verify cloudbeaver is responding
        http.get(`http://localhost:${port}`, (res) => {
            exec('docker compose ps -q', (err2, stdout2) => {
                const containerIds = stdout2 ? stdout2.trim().split('\n') : [];
                
                try {
                    fs.writeFileSync(RUNTIME_FILE, JSON.stringify({ 
                        port: server.address().port, 
                        pid: process.pid,
                        containerIds: containerIds
                    }));
                } catch(e) {
                    console.error('Failed to write runtime file:', e);
                }

                process.stdout.write('\x1Bc');
                console.log('\n==================================================');
                console.log('CloudBeaver is running!');
                console.log('--------------------------------------------------');
                console.log(`URL:               http://localhost:${port}`);
                console.log(`Note: After opening the URL, please RELOAD THE PAGE to ensure proper functionality.`);
                console.log('--------------------------------------------------');
                console.log('Universal database management tool');
                console.log('Supports: PostgreSQL, MySQL, MongoDB, and more');
                console.log('--------------------------------------------------');
                console.log('First time setup:');
                console.log('  1. Create admin account on first visit (or Log In via Gear icon ⚙️)');
                console.log('  2. Add database connections via UI');
                console.log('     (If "Plug" icon is missing, you MUST Log In first)');
                console.log('     (Click the plug+ icon in the top header, next to the SQL button)');
                console.log('  3. Use host.docker.internal for local DBs');
                console.log('--------------------------------------------------');
                console.log('Example connecting to PostgreSQL (if using Docker based template):');
                console.log('  Host: host.docker.internal');
                console.log('  Port: 5432');
                console.log('  User: admin');
                console.log('  Password: admin');
                console.log('  Database: db');
                console.log('--------------------------------------------------');
                console.log('Example connecting to MariaDB (if using Docker based template):');
                console.log('  Host: host.docker.internal');
                console.log('  Port: 3306');
                console.log('  User: admin');
                console.log('  Password: admin');
                console.log('  Database: db');
                console.log('==================================================\n');
            });
        }).on('error', () => {
            setTimeout(checkStatus, 2000);
        });
    });
};

setTimeout(checkStatus, 3000);

const cleanup = () => {
    console.log('Stopping CloudBeaver...');
    exec('docker compose down', (err, stdout, stderr) => {
        try { fs.unlinkSync(RUNTIME_FILE); } catch(e) {}
        process.exit(0);
    });
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
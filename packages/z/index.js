const http = require('http');
const { spawn, exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const RUNTIME_FILE = path.join(__dirname, '.runtime.json');
let containerId = null;

console.log('Starting PostgreSQL...');

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

// Info Loop
// Check status loop
// Check status loop
const checkStatus = () => {
    exec('docker compose port postgres 5432', (err, stdout, stderr) => {
        if (err || stderr || !stdout) {
            setTimeout(checkStatus, 2000);
            return;
        }
        const port = stdout.trim().split(':')[1];
        if (!port) {
            setTimeout(checkStatus, 2000);
            return;
        }

        // Check pgAdmin port
        exec('docker compose port pgadmin 80', (err2, stdout2, stderr2) => {
            const pgAdminPort = (stdout2 && stdout2.trim()) ? stdout2.trim().split(':')[1] : null;
            if (!pgAdminPort) {
                setTimeout(checkStatus, 2000);
                return;
            }

            // Verify pgAdmin is actually responding to HTTP
            http.get(`http://localhost:${pgAdminPort}`, (res) => {
                // Capture Container ID and Print
                exec('docker compose ps -q postgres', (err3, stdout3) => {
                     if (stdout3) containerId = stdout3.trim();
                     
                     try {
                        fs.writeFileSync(RUNTIME_FILE, JSON.stringify({ 
                            port: server.address().port, 
                            pid: process.pid,
                            containerId: containerId
                        }));
                     } catch(e) {
                        console.error('Failed to write runtime file:', e);
                     }

                     console.clear();
                     console.log('\n==================================================');
                     console.log('🚀 PostgreSQL is running!');
                     console.log('--------------------------------------------------');
                     console.log(`🔌 Connection String: postgres://user:password@localhost:${port}/mydatabase`);
                     console.log('👤 Username:          user');
                     console.log('🔑 Password:          password');
                     console.log('🗄️  Database:          mydatabase');
                     console.log(`🌐 Port:              ${port}`);
                     console.log('--------------------------------------------------');
                     console.log('🐘 pgAdmin 4 is running!');
                     console.log(`🌍 URL:               http://localhost:${pgAdminPort}`);
                     console.log('📧 Email:             admin@admin.com');
                     console.log('🔑 Password:          root');
                     console.log('==================================================\n');
                });
            }).on('error', (e) => {
                // Connection failed (ECONNREFUSED usually), retry
                setTimeout(checkStatus, 2000);
            });
        });
    });
};

setTimeout(checkStatus, 3000);

const cleanup = () => {
    console.log('Stopping PostgreSQL...');
    try { fs.unlinkSync(RUNTIME_FILE); } catch(e) {}
    
    if (containerId) {
        console.log(`Stopping container ${containerId}...`);
        exec(`docker stop ${containerId}`, () => {
             process.exit(0);
        });
    } else {
        exec('docker compose stop', () => {
            process.exit(0);
        });
    }
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
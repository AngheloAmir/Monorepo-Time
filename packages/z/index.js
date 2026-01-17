const http = require('http');
const { spawn, exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const RUNTIME_FILE = path.join(__dirname, '.runtime.json');
let containerId = null;

console.log('Starting PostgreSQL...');

// Start Docker Compose
const child = spawn('docker', ['compose', 'up'], { stdio: 'pipe' });

child.on('close', (code) => {
    process.exit(code || 0);
});

child.stderr.on('data', (data) => {
   const output = data.toString();
   if (!output.includes('The attribute `version` is obsolete')) {
       // console.error(output); 
   }
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
setTimeout(() => {
    exec('docker compose port postgres 5432', (err, stdout, stderr) => {
        if (stderr) return;
        const port = stdout.trim().split(':')[1];
        if (!port) return;
        
        // Capture Container ID
        exec('docker compose ps -q postgres', (err2, stdout2) => {
             if (stdout2) containerId = stdout2.trim();
             
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
             if (containerId) console.log(`📦 Container ID:      ${containerId}`);
             console.log('==================================================\n');
        });
    });
}, 5000);

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
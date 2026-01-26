export const serverJs = `const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn, exec } = require('child_process');
const deploy = require('./deploy');

const RUNTIME_FILE = path.join(__dirname, '.runtime.json');
const DATA_DIR = path.join(__dirname, 'localstack-data');
let currentPort = 3748;

console.log("Starting AWS Local environment...");

// Pre-create data directory to ensure correct permissions
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    console.log('Created localstack-data directory');
}

// Spawn Docker Compose
const docker = spawn('docker', ['compose', 'up', '-d'], { stdio: 'inherit' });

docker.on('close', (code) => {
    if (code !== 0) {
        console.error('Failed to start Docker containers');
        process.exit(code);
    }
    // Give containers a moment to initialize
    setTimeout(displayCredentials, 3000);
});

function displayCredentials() {
    // Get container IDs for runtime file
    exec('docker compose ps -q', (err, stdout) => {
        let containerIds = [];
        if (stdout) {
            containerIds = stdout.trim().split('\\n').filter(id => id);
        }

        // Write runtime file
        try {
            fs.writeFileSync(RUNTIME_FILE, JSON.stringify({
                port: server.address().port,
                pid: process.pid,
                containerIds: containerIds
            }));
        } catch(e) {}

        console.log('\\n==================================================');
        console.log('🚀 AWS LocalStack is running!');
        console.log('--------------------------------------------------');
        console.log('📌 AWS Credentials:');
        console.log('   Access Key ID:     test');
        console.log('   Secret Access Key: test');
        console.log('   Region:            us-east-1');
        console.log('--------------------------------------------------');
        console.log('🌐 Service URLs:');
        console.log('   LocalStack:        http://localhost:4566');
        console.log('   DynamoDB Admin:    http://localhost:8001');
        console.log('   S3 Manager:        http://localhost:8002');
        console.log(\`   Manager UI:        http://localhost:\${server.address().port}\`);
        console.log('--------------------------------------------------');
        console.log('📦 Available Services:');
        console.log('   S3, Lambda, DynamoDB, API Gateway, SQS, SNS, CloudWatch');
        console.log('==================================================\\n');
    });
}

const requestListener = function (req, res) {
    if (req.url === "/") {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(fs.readFileSync(path.join(__dirname, 'index.html')));
    } else if (req.url === "/deploy") {
        deploy.runDeploy(req, res);
    } else if (req.url === "/stop") {
        res.writeHead(200);
        res.end('Stopping...');
        cleanup();
    } else {
        res.writeHead(404);
        res.end("Not found");
    }
}

const server = http.createServer(requestListener);

function startServer(port) {
    server.listen(port);
}

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.log(\`Port \${currentPort} is in use, trying \${currentPort + 1}...\`);
        currentPort++;
        startServer(currentPort);
    } else {
        console.error('Server error:', err);
        process.exit(1);
    }
});

server.on('listening', () => {
    console.log(\`AWS Local Manager running at http://localhost:\${server.address().port}\`);
});

startServer(currentPort);

const cleanup = () => {
    console.log("Stopping AWS Local environment...");
    try {
        const runtime = JSON.parse(fs.readFileSync(RUNTIME_FILE));
        if (runtime.containerIds) {
            console.log(\`Stopping \${runtime.containerIds.length} containers...\`);
            runtime.containerIds.forEach(id => {
                exec(\`docker stop \${id}\`);
            });
        }
    } catch(e) {}
    try { fs.unlinkSync(RUNTIME_FILE); } catch(e) {}
    
    spawn('docker', ['compose', 'down'], { stdio: 'inherit' });
    setTimeout(() => process.exit(0), 2000);
};

// Handle cleanup
process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);`;

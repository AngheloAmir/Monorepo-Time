export const serverJs = `const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn, exec } = require('child_process');

const RUNTIME_FILE = path.join(__dirname, '.runtime.json');

console.log('Starting Stripe Mock Server...');

// Spawn Docker Compose
const docker = spawn('docker', ['compose', 'up', '-d'], { stdio: 'inherit' });

docker.on('close', (code) => {
    if (code !== 0) {
        console.error('Failed to start Docker containers');
        process.exit(code);
    }
    // Give container a moment to initialize
    setTimeout(displayCredentials, 3000);
});

function displayCredentials() {
    // Get container ID for runtime file
    exec('docker compose ps -q stripe-mock', (err, stdout) => {
        let containerIds = [];
        if (stdout) {
            containerIds = [stdout.trim()];
        }

        // Write runtime file
        try {
            fs.writeFileSync(RUNTIME_FILE, JSON.stringify({
                port: server.address().port,
                pid: process.pid,
                containerIds: containerIds
            }));
        } catch(e) {}

        process.stdout.write('\\x1Bc');
        console.log('\\n==================================================');
        console.log('💳 Stripe Mock Server is running!');
        console.log('GitHub:            https://github.com/stripe/stripe-mock');
        console.log('Docker Image:      https://hub.docker.com/r/stripe/stripe-mock');
        console.log('License:           MIT');
        console.log('--------------------------------------------------');
        console.log('📌 Connection Details:');
        console.log('   API Key:           sk_test_mock_123 (any key works)');
        console.log('   HTTP Endpoint:     http://localhost:12111');
        console.log('   HTTPS Endpoint:    https://localhost:12112');
        console.log('--------------------------------------------------');
        console.log('📝 Quick Start (Node.js):');
        console.log("   const stripe = new Stripe('sk_test_mock_123', {");
        console.log("       host: 'localhost',");
        console.log("       port: 12111,");
        console.log("       protocol: 'http'");
        console.log('   });');
        console.log('--------------------------------------------------');
        console.log('🧪 Test Command:');
        console.log('   npm run test');
        console.log('==================================================\\n');
    });
}

const requestListener = function (req, res) {
    if (req.url === '/stop') {
        res.writeHead(200);
        res.end('Stopping...');
        cleanup();
    } else {
        res.writeHead(200);
        res.end('Stripe Mock running. Use /stop to stop.');
    }
}

const server = http.createServer(requestListener);
server.listen(0, () => {
    console.log('Control server running on port', server.address().port);
});

const cleanup = () => {
    console.log('Stopping Stripe Mock Server...');
    const child = spawn('docker', ['compose', 'down'], { stdio: 'inherit' });
    child.on('close', () => {
        try { fs.unlinkSync(RUNTIME_FILE); } catch(e) {}
        process.exit(0);
    });
};

// Handle cleanup
process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);`;

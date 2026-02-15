export const serverJs = `const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn, exec, execSync } = require('child_process');
const deploy = require('./deploy');

const RUNTIME_FILE = path.join(__dirname, '.runtime.json');
const DATA_DIR = path.join(__dirname, 'localstack-data');
let currentPort = 3748;

console.log("Starting AWS Local environment...");
console.log("");

// Check for required dependencies
function checkDependencies() {
    let hasErrors = false;
    
    // Check Docker
    try {
        execSync('docker --version', { stdio: 'pipe' });
        console.log('✓ Docker is installed');
    } catch (e) {
        console.error('✗ ERROR: Docker is not installed!');
        console.error('  LocalStack requires Docker to run.');
        console.error('  Install Docker: https://docs.docker.com/get-docker/');
        hasErrors = true;
    }
    
    // Check Docker Compose
    try {
        execSync('docker compose version', { stdio: 'pipe' });
        console.log('✓ Docker Compose is installed');
    } catch (e) {
        console.error('✗ ERROR: Docker Compose is not installed!');
        console.error('  LocalStack requires Docker Compose to run.');
        console.error('  Install Docker Compose: https://docs.docker.com/compose/install/');
        hasErrors = true;
    }
    
    // Check AWS CLI (optional but recommended)
    try {
        execSync('aws --version', { stdio: 'pipe' });
        console.log('✓ AWS CLI is installed');
    } catch (e) {
        console.warn('⚠ WARNING: AWS CLI is not installed');
        console.warn('  The CLI commands in this guide will not work without it.');
        console.warn('  Install AWS CLI: https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html');
        console.warn('  (You can still use the web UIs without AWS CLI)');
    }
    
    console.log("");
    
    if (hasErrors) {
        console.error('==================================================');
        console.error('❌ Missing required dependencies. Please install them first.');
        console.error('==================================================');
        process.exit(1);
    }
}

checkDependencies();

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

        process.stdout.write('\\x1Bc');
        console.log('\\n==================================================');
        console.log('🚀 AWS LocalStack is running!');
        console.log('Official Site:     https://localstack.cloud');
        console.log('Docker Image:      https://hub.docker.com/r/localstack/localstack');
        console.log('License:           Apache-2.0');
        console.log('==================================================');
        console.log('📌 AWS Credentials (use these everywhere):');
        console.log('   Access Key ID:     test');
        console.log('   Secret Access Key: test');
        console.log('   Region:            us-east-1');
        console.log('   Endpoint:          http://localhost:4566');
        console.log('');
        console.log('--------------------------------------------------');
        console.log('🌐 Service URLs:');
        console.log('--------------------------------------------------');
        console.log('   LocalStack API:    http://localhost:4566 (API only)');
        console.log('   DynamoDB Admin:    http://localhost:4330');
        console.log('   S3 Browser:        http://localhost:4340');
        console.log(\`   Manager UI:        http://localhost:\${server.address().port}\`);
        console.log('');
        console.log('--------------------------------------------------');
        console.log('📁 S3 Browser Setup (Filestash):');
        console.log('--------------------------------------------------');
        console.log('   1. Go to http://localhost:4340');
        console.log('   2. Set admin password (first time only)');
        console.log('   3. Select "S3" tab and check "Advanced"');
        console.log('   4. Fill in:');
        console.log('      • Access Key ID:     test');
        console.log('      • Secret Access Key: test');
        console.log('      • Region:            us-east-1');
        console.log('      • Endpoint:          http://localstack:4566');
        console.log('   5. Click CONNECT');
        console.log('');
        console.log('--------------------------------------------------');
        console.log('📦 Quick Start - S3 Commands:');
        console.log('--------------------------------------------------');
        console.log('   # Create bucket:');
        console.log('   aws --endpoint-url=http://localhost:4566 s3 mb s3://my-bucket');
        console.log('');
        console.log('   # List buckets:');
        console.log('   aws --endpoint-url=http://localhost:4566 s3 ls');
        console.log('');
        console.log('   # Upload file:');
        console.log('   aws --endpoint-url=http://localhost:4566 s3 cp file.txt s3://my-bucket/');
        console.log('');
        console.log('   # Sync folder:');
        console.log('   aws --endpoint-url=http://localhost:4566 s3 sync ./folder s3://my-bucket/');
        console.log('');
        console.log('--------------------------------------------------');
        console.log('⚡ Lambda Deployment:');
        console.log('--------------------------------------------------');
        console.log('   # 1. Create index.js with:');
        console.log('   exports.handler = async (event) => {');
        console.log('     return { statusCode: 200, body: "Hello from Lambda!" };');
        console.log('   };');
        console.log('');
        console.log('   # 2. Zip and deploy:');
        console.log('   zip function.zip index.js');
        console.log('   aws --endpoint-url=http://localhost:4566 lambda create-function \\\\');
        console.log('     --function-name myFunc --runtime nodejs18.x \\\\');
        console.log('     --handler index.handler --zip-file fileb://function.zip \\\\');
        console.log('     --role arn:aws:iam::000000000000:role/lambda-role');
        console.log('');
        console.log('   # 3. Invoke Lambda:');
        console.log('   aws --endpoint-url=http://localhost:4566 lambda invoke \\\\');
        console.log('     --function-name myFunc out.json && cat out.json');
        console.log('');
        console.log('--------------------------------------------------');
        console.log('🗄️  DynamoDB Commands:');
        console.log('--------------------------------------------------');
        console.log('   # Create table:');
        console.log('   aws --endpoint-url=http://localhost:4566 dynamodb create-table \\\\');
        console.log('     --table-name Users --billing-mode PAY_PER_REQUEST \\\\');
        console.log('     --attribute-definitions AttributeName=id,AttributeType=S \\\\');
        console.log('     --key-schema AttributeName=id,KeyType=HASH');
        console.log('');
        console.log('   Or use the DynamoDB Admin UI: http://localhost:4330');
        console.log('');
        console.log('--------------------------------------------------');
        console.log('� Available Services:');
        console.log('   S3, Lambda, DynamoDB, API Gateway, SQS, SNS, CloudWatch');
        console.log('');
        console.log('💡 Tip: Add --endpoint-url=http://localhost:4566 to all AWS CLI commands');
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
    const child = spawn('docker', ['compose', 'down'], { stdio: 'inherit' });
    child.on('close', () => {
        try { fs.unlinkSync(RUNTIME_FILE); } catch(e) {}
        process.exit(0);
    });
};

// Handle cleanup
process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);`;

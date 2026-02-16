export const serverJs = `const http = require('http');
const { spawn, exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const RUNTIME_FILE = path.join(__dirname, '.runtime.json');
const OLLAMA_PORT = 11434;

console.log('Starting Ollama Service...');

// Start Docker Compose
const child = spawn('docker', ['compose', 'up', '-d', '--remove-orphans'], { stdio: 'inherit' });

child.on('close', (code) => {
    if (code !== 0) {
        console.error('Failed to start Docker Compose');
        process.exit(code);
    }
    startMonitoring();
});

// Setup Control Server (for clean programmatic stop and UI)
const server = http.createServer((req, res) => {
    if (req.url === '/stop') {
        res.writeHead(200);
        res.end('Stopping...');
        cleanup();
    } else if (req.url === '/info') {
        // Endpoint for frontend to get container name
        res.writeHead(200, { 'Content-Type': 'application/json' });
        // Retrieve cached container name from runtime file if possible, or re-fetch
        try {
            const runtime = JSON.parse(fs.readFileSync(RUNTIME_FILE, 'utf8'));
            res.end(JSON.stringify({ containerName: runtime.containerName || 'monorepo-ollama' }));
        } catch(e) {
            res.end(JSON.stringify({ containerName: 'unknown' }));
        }
    } else if (req.url === '/') {
        // Serve the UI
        fs.readFile(path.join(__dirname, 'index.html'), (err, content) => {
            if (err) {
                res.writeHead(500);
                res.end('Error loading UI');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(content);
            }
        });
    } else {
        res.writeHead(404);
        res.end();
    }
});

server.listen(0, '0.0.0.0', () => {
    // We update runtime file later when we verify the service is up
});

const startMonitoring = () => {
    // 1. Wait for Ollama to be responsive
    checkOllamaStatus();
};

const checkOllamaStatus = () => {
    const check = spawn('curl', ['-s', '-f', \`http://localhost:\${OLLAMA_PORT}/api/tags\`]);
    
    check.on('close', (code) => {
        if (code === 0) {
            console.log('Ollama is ready!');
            ensureModelExists();
        } else {
            // Retry
            setTimeout(checkOllamaStatus, 2000);
        }
    });
};

const ensureModelExists = () => {
    // Check if llama3 is present
    // First get the container name to be robust
    exec('docker ps --filter "ancestor=ollama/ollama" --format "{{.Names}}"', (err, stdout, stderr) => {
        const lines = stdout ? stdout.trim().split('\\n') : [];
        const containerName = lines.length > 0 ? lines[0].trim() : 'ollama-container'; // Fallback
        
        exec(\`docker exec \${containerName} ollama list\`, (err, stdout, stderr) => {
            if (stdout && stdout.includes('qwen2.5:7b')) {
                console.log('Default model "qwen2.5:7b" is ready.');
                finalizeStartup(containerName);
            } else {
                console.log('Default model "qwen2.5:7b" not found locally. Pulling from registry (this may take a while)...');
                
                const pull = spawn('docker', ['exec', '-it', containerName, 'ollama', 'pull', 'qwen2.5:7b'], { stdio: 'inherit' });
                pull.on('close', (code) => {
                    if (code === 0) {
                        console.log('Model pulled successfully.');
                        finalizeStartup(containerName);
                    } else {
                        console.error('Failed to pull model.');
                        // Still startup, but warn
                        finalizeStartup(containerName);
                    }
                });
            }
        });
    });
};

const finalizeStartup = (containerName) => {
    // Write runtime file
    try {
        const address = server.address();
        fs.writeFileSync(RUNTIME_FILE, JSON.stringify({ 
            port: address.port, 
            pid: process.pid,
            servicePort: OLLAMA_PORT,
            containerName: containerName
        }));
        
        process.stdout.write('\\x1Bc');
        console.log('\\n==================================================');
        console.log('Service:           Ollama (Artificial Intelligence)');
        console.log('Default Model:     qwen2.5:7b (7B) - Optimized for n8n & general tasks');
        console.log('Docker Image:      ollama/ollama:latest');
        console.log('==================================================');
        console.log(\`Ollama API is running at http://localhost:\${OLLAMA_PORT}\`);
        console.log('Web Interface:            http://localhost:' + address.port);
        console.log('==== Quick Usage =================================');
        console.log(\`CLI:          docker exec -it \${containerName} ollama run qwen2.5:7b "Hello!"\`);
        console.log('n8n Config:    Base URL: http://host.docker.internal:11434 (Windows/Mac)');
        console.log('                         http://172.17.0.1:11434 (Linux default)');
        console.log('               Model Name: qwen2.5:7b');
        console.log('==== Models ======================================');
        console.log('Default (Active):  qwen2.5:7b (Great for logic, reasoning, and JSON output)');
        
    } catch(e) {
        console.error('Failed to write runtime file:', e);
    }
};

const cleanup = () => {
    console.log('Stopping Ollama...');
    exec('docker compose down', (err, stdout, stderr) => {
        try { fs.unlinkSync(RUNTIME_FILE); } catch(e) {}
        server.close();
        process.exit(0);
    });
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
`;

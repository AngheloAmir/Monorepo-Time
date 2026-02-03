export const stopJs = `const fs = require('fs');
const { exec, execSync } = require('child_process');
const path = require('path');

const RUNTIME_FILE = path.join(__dirname, '.runtime.json');

// Read runtime file
let runtimeData = null;
try {
    const content = fs.readFileSync(RUNTIME_FILE, 'utf8');
    runtimeData = JSON.parse(content);
} catch (e) {
    console.log('No runtime file found. Trying to clean up any remaining containers...');
}

// Try to call the running server's stop endpoint first
if (runtimeData && runtimeData.port) {
    console.log('Sending stop signal to running server...');
    fetch(\`http://localhost:\${runtimeData.port}/stop\`)
        .then(() => {
            console.log('✓ Stop signal sent');
            process.exit(0);
        })
        .catch(() => {
            console.log('Server not responding. Cleaning up containers directly...');
            cleanupContainers();
        });
} else {
    cleanupContainers();
}

function cleanupContainers() {
    // Stop docker compose containers
    console.log('Stopping docker compose containers...');
    exec('docker compose down --remove-orphans', { cwd: __dirname }, (err, stdout, stderr) => {
        if (err) {
            console.log('docker compose down failed. Trying to stop containers by ID...');
            
            // Try stopping by container IDs from runtime file
            if (runtimeData && runtimeData.containerIds && runtimeData.containerIds.length > 0) {
                const ids = runtimeData.containerIds.join(' ');
                execSync(\`docker stop \${ids} 2>/dev/null || true\`, { stdio: 'inherit' });
                execSync(\`docker rm \${ids} 2>/dev/null || true\`, { stdio: 'inherit' });
            }
        }
        
        console.log('✓ Headlamp containers stopped');
        
        // Clean up runtime file
        try { fs.unlinkSync(RUNTIME_FILE); } catch (e) { }
        
        console.log('');
        console.log('Note: The k3d cluster is still running.');
        console.log('To stop it: npm run cluster:stop');
        console.log('To delete it: npm run cluster:delete');
    });
}`;

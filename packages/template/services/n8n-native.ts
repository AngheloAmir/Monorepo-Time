import type { ProjectTemplate } from "../../types";
import { N8NAgent } from "./n8n/n8nAgent";

export const N8NNative: ProjectTemplate = {
    name: "N8N Native (Node 20)",
    description: "N8N (Native Node.js)",
    notes: "Runs n8n locally using NVM",
    type: "app",
    category: "Service",
    icon: "fas fa-project-diagram text-green-500",
    templating: [
        {
            action: 'file',
            file: 'setup.sh',
            filecontent: `#!/bin/bash
set -e

# Define NVM directory
export NVM_DIR="$HOME/.nvm"

# 1. Try to load NVM if it exists
if [ -s "$NVM_DIR/nvm.sh" ]; then
    . "$NVM_DIR/nvm.sh"
elif [ -s "/usr/local/opt/nvm/nvm.sh" ]; then
    . "/usr/local/opt/nvm/nvm.sh"
fi

# 2. Install NVM if not found
if ! command -v nvm &> /dev/null; then
    echo "Installing NVM..."
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
    # Reload nvm
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
fi

# 3. Verify NVM
if ! command -v nvm &> /dev/null; then
    echo "Error: Failed to install/load NVM."
    exit 1
fi

# 4. Install Node 20 (ensure it exists)
echo "Installing/Verifying Node 20..."
nvm install 20

# 5. Install n8n locally (using Node 20 in this shell only)
echo "Installing n8n..."
nvm use 20
npm install n8n

echo "Setup complete!"
`
        },
        {
            action: 'file',
            file: 'setup.ps1',
            filecontent: `$ErrorActionPreference = "Stop"

# 1. Check for nvm
if (Get-Command "nvm" -ErrorAction SilentlyContinue) {
    Write-Host "NVM detected."
    
    # 2. Install Node 20
    Write-Host "Installing Node 20..."
    nvm install 20
    # We don't force 'nvm use' globally here, just ensure it's installed
} else {
    Write-Host "NVM not found. Checking for Node.js..."
    if (Get-Command "node" -ErrorAction SilentlyContinue) {
        $version = node -v
        Write-Host "Node version $version detected."
    } else {
        Write-Host "Please install Node.js v20+ or nvm-windows manually."
        exit 1
    }
}

# 3. Install n8n locally
# Note: In PowerShell with nvm-windows, switching usually persists.
# We will just proceed with npm install.
Write-Host "Installing n8n..."
npm install n8n

Write-Host "Setup complete!"
`
        },
        {
            action: 'file',
            file: 'start.sh',
            filecontent: `#!/bin/bash
# Ensure NVM is loaded
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"

# Force use of Node 20 for this session
nvm use 20 || { echo "Failed to use Node 20, installing..."; nvm install 20 && nvm use 20; }

# Verify Node version
echo "Using Node version: $(node -v)"

# Run n8n using the locally installed module
echo "Starting n8n..."
./node_modules/.bin/n8n start
`
        },
        {
            action: 'file',
            file: 'start.ps1',
            filecontent: `
# Try to switch to Node 20 if nvm exists
if (Get-Command "nvm" -ErrorAction SilentlyContinue) {
    nvm use 20
}

# Verify Node version
Write-Host "Using Node version: $(node -v)"

Write-Host "Starting n8n..."
node ./node_modules/n8n/bin/n8n start
`
        },
        {
            action: 'file',
            file: 'runner.js',
            filecontent: `const { spawn } = require('child_process');
const os = require('os');

const isWindows = os.platform() === 'win32';
const script = isWindows ? process.argv[2] + '.ps1' : process.argv[2] + '.sh';
const cmd = isWindows ? 'powershell' : 'bash';
const args = isWindows ? ['-ExecutionPolicy', 'Bypass', '-File', script] : [script];

const child = spawn(cmd, args, { stdio: 'inherit' });

child.on('close', (code) => {
    process.exit(code);
});
`
        },
        {
            action: 'command',
            cmd: 'node',
            args: ['runner.js', 'setup']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'scripts.start=node runner.js start']
        },
        {
            action: 'root-command',
            cmd: 'node',
            args: ['-e', `require('fs').writeFileSync('n8nAgent.ts', 'export const N8NAgent = ' + JSON.stringify(${JSON.stringify(N8NAgent)}) + ';')`]
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'description=N8N (Node 20)']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'fontawesomeIcon=fas fa-project-diagram text-green-500']
        }
    ]
};

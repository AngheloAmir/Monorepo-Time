import type { ProjectTemplate } from "../../types";

export const N8nMcpTool: ProjectTemplate = {
    name: "n8n MCP Server",
    description: "Model Context Protocol server for n8n. Allows AI agents to understand and build n8n workflows.",
    notes: "Requires Docker. Use this with an MCP client (like Claude Desktop or Cursor).",
    type: "tool",
    category: "Tool",
    icon: "fas fa-robot text-orange-500",
    templating: [
        {
            action: 'file',
            file: 'docker-compose.yml',
            filecontent: `services:
  n8n-mcp:
    image: ghcr.io/czlonkowski/n8n-mcp:latest
    restart: unless-stopped
    environment:
      - MCP_MODE=stdio
      - LOG_LEVEL=error
      - DISABLE_CONSOLE_OUTPUT=true
`
        },
        {
            action: 'file',
            file: '.gitignore',
            filecontent: `# Runtime file
.runtime.json
`
        },
        {
            action: 'file',
            file: 'index.js',
            filecontent: `const http = require('http');
const { spawn, exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const RUNTIME_FILE = path.join(__dirname, '.runtime.json');

console.log('Starting n8n MCP Server (Stdio Mode)...');

// Start Docker Compose (to pull image and verify)
const child = spawn('docker', ['compose', 'up', '-d', '--remove-orphans'], { stdio: 'inherit' });

child.on('close', (code) => {
    if (code !== 0) process.exit(code);
    
    // We don't tail logs in stdio mode because they are just the application listening
    // Instead we check status
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
});

// Check status loop
const checkStatus = () => {
    exec('docker compose ps --format json', (err, stdout, stderr) => {
        // Simple check if running
        if (err || !stdout || stdout.includes('"State":"exited"')) {
             // Try strict check
             exec('docker compose ps -q', (e, s) => {
                 if (!s || s.trim().length === 0) {
                     setTimeout(checkStatus, 2000);
                     return;
                 }
                 onRunning(s.trim());
             });
             return;
        }
        onRunning(stdout);
    });
};

const onRunning = (containerInfo) => {
    // Write runtime file
     try {
        fs.writeFileSync(RUNTIME_FILE, JSON.stringify({ 
            port: server.address().port, 
            pid: process.pid,
            status: "running-stdio"
        }));
    } catch(e) {}

    console.log('\\n==================================================');
    console.log('n8n MCP Server Image is Ready!');
    console.log('--------------------------------------------------');
    console.log('This MCP server runs in STDIO mode (not HTTP).');
    console.log('To use it, add this to your MCP Client config (e.g., Claude Desktop, Cursor):');
    console.log('');
    console.log(JSON.stringify({
      "mcpServers": {
        "n8n-mcp": {
          "command": "docker",
          "args": [
            "run",
            "-i",
            "--rm",
            "--init",
            "-e", "MCP_MODE=stdio",
            "ghcr.io/czlonkowski/n8n-mcp:latest"
          ]
        }
      }
    }, null, 2));
    console.log('');
    console.log('Config paths:');
    console.log('  macOS: ~/Library/Application Support/Claude/claude_desktop_config.json');
    console.log('  Linux: ~/.config/Claude/claude_desktop_config.json');
    console.log('\n==================================================');
    console.log('Usage Instructions:');
    console.log('1. Ask Claude to "Help me build an n8n workflow for..."');
    console.log('2. Claude can search nodes, get documentation, and generate workflow JSON.');
    console.log('3. You can paste the generated JSON directly into n8n.');
    console.log('4. Claude can also help debug workflows if you provide error logs.');
    console.log('');
    console.log('Note: This server provides knowledge about n8n nodes and templates.');
    console.log('\n==================================================');
    console.log('GitHub: https://github.com/czlonkowski/n8n-mcp');
    console.log('==================================================\n');
};

setTimeout(checkStatus, 3000);

const cleanup = () => {
    console.log('Stopping...');
    exec('docker compose down', (err, stdout, stderr) => {
        try { fs.unlinkSync(RUNTIME_FILE); } catch(e) {}
        process.exit(0);
    });
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);`
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'scripts.start=node index.js']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'scripts.stop=node -e \'const fs=require("fs"); try{const p=JSON.parse(fs.readFileSync(".runtime.json")).port; fetch("http://localhost:"+p+"/stop").catch(e=>{})}catch(e){}\'']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'description=n8n MCP Server']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'fontawesomeIcon=fas fa-robot text-orange-500']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'appType=tool']
        }
    ]
};

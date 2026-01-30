import type { ProjectTemplate } from "../../types";

export const MongoExpressTool: ProjectTemplate = {
    name: "Mongo Express",
    description: "MongoDB Web GUI",
    notes: "Requires Docker. Connects to any MongoDB database.",
    type: "tool",
    templating: [
        {
            action: 'file',
            file: 'docker-compose.yml',
            filecontent: `services:
  mongo-express:
    image: mongo-express
    pull_policy: if_not_present
    restart: "no"
    ports:
      - "0:8081"
    environment:
      - ME_CONFIG_BASICAUTH_USERNAME=admin
      - ME_CONFIG_BASICAUTH_PASSWORD=admin
      # ⚠️ IMPORTANT: Update the port below to match your MongoDB mapped port!
      # Example: If MongoDB shows "0.0.0.0:32825->27017/tcp", use 32825
      - ME_CONFIG_MONGODB_URL=mongodb://admin:admin@host.docker.internal:CHANGE_ME/
    extra_hosts:
      - "host.docker.internal:host-gateway"
    healthcheck:
      test: ["CMD", "wget", "--spider", "-q", "http://localhost:8081"]
      interval: 10s
      timeout: 5s
      retries: 5`
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

console.log('Starting Mongo Express...');

// Check if port is configured
const dockerCompose = fs.readFileSync(path.join(__dirname, 'docker-compose.yml'), 'utf-8');
if (dockerCompose.includes('CHANGE_ME')) {
    console.log('');
    console.log('==================================================');
    console.log('⚠️  CONFIGURATION REQUIRED!');
    console.log('==================================================');
    console.log('');
    console.log('1. First, start your MongoDB template and note its port');
    console.log('   (Look for "0.0.0.0:XXXXX->27017/tcp" in docker ps)');
    console.log('');
    console.log('2. Edit docker-compose.yml in this folder');
    console.log('   Replace CHANGE_ME with your MongoDB port');
    console.log('');
    console.log('3. Run npm run start again');
    console.log('');
    console.log('==================================================');
    process.exit(1);
}

// Start Docker Compose
// Start Docker Compose
const child = spawn('docker', ['compose', 'up', '-d', '--remove-orphans'], { stdio: 'inherit' });

child.on('close', (code) => {
    if (code !== 0) process.exit(code);
    // Follow logs
    const logs = spawn('docker', ['compose', 'logs', '-f'], { stdio: 'inherit' });
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
    exec('docker compose port mongo-express 8081', (err, stdout, stderr) => {
        if (err || stderr || !stdout) {
            setTimeout(checkStatus, 2000);
            return;
        }
        const port = stdout.trim().split(':')[1];
        if (!port) {
            setTimeout(checkStatus, 2000);
            return;
        }

        // Verify mongo-express is responding
        http.get(\`http://localhost:\${port}\`, (res) => {
            exec('docker compose ps -q', (err2, stdout2) => {
                const containerIds = stdout2 ? stdout2.trim().split('\\n') : [];
                
                try {
                    fs.writeFileSync(RUNTIME_FILE, JSON.stringify({ 
                        port: server.address().port, 
                        pid: process.pid,
                        containerIds: containerIds
                    }));
                } catch(e) {
                    console.error('Failed to write runtime file:', e);
                }

                process.stdout.write('\\\\x1Bc');
                console.log('\\n==================================================');
                console.log('🍃 Mongo Express - MongoDB Web GUI');
                console.log('==================================================');
                console.log(\`URL:               http://localhost:\${port}\`);
                console.log('Auth User:         admin');
                console.log('Auth Password:     admin');
                console.log('==================================================\\n');
            });
        }).on('error', () => {
            setTimeout(checkStatus, 2000);
        });
    });
};

setTimeout(checkStatus, 3000);

const cleanup = () => {
    console.log('Stopping Mongo Express...');
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
            args: ['pkg', 'set', 'description=Mongo Express - MongoDB Web GUI']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'fontawesomeIcon=fas fa-leaf text-green-500']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'appType=tool']
        }
    ]
};

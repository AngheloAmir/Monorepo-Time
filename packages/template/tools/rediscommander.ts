import type { ProjectTemplate } from "..";

export const RedisCommanderTool: ProjectTemplate = {
    name: "Redis Commander",
    description: "Redis Web GUI",
    notes: "Requires Docker. Connects to any Redis instance.",
    templating: [
        {
            action: 'file',
            file: 'docker-compose.yml',
            filecontent: `services:
  redis-commander:
    image: rediscommander/redis-commander
    pull_policy: if_not_present
    restart: unless-stopped
    ports:
      - "0:8081"
    environment:
      - HTTP_USER=admin
      - HTTP_PASSWORD=admin
      # ⚠️ UPDATE THE PORT BELOW TO MATCH YOUR REDIS PORT
      - REDIS_HOSTS=local:host.docker.internal:6379
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

console.log('Starting Redis Commander...');

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
    // We update runtime file later when we get the container ID
});

// Check status loop
const checkStatus = () => {
    exec('docker compose port redis-commander 8081', (err, stdout, stderr) => {
        if (err || stderr || !stdout) {
            setTimeout(checkStatus, 2000);
            return;
        }
        const port = stdout.trim().split(':')[1];
        if (!port) {
            setTimeout(checkStatus, 2000);
            return;
        }

        // Verify redis-commander is responding
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

                console.clear();
                console.log('\\n==================================================');
                console.log('🔴 Redis Commander - Redis Web GUI');
                console.log('==================================================');
                console.log(\`URL:               http://localhost:\${port}\`);
                console.log('Auth User:         admin');
                console.log('Auth Password:     admin');
                console.log('--------------------------------------------------');
                console.log('⚠️  IMPORTANT: CONFIGURE CONNECTION FIRST!');
                console.log('--------------------------------------------------');
                console.log('Edit docker-compose.yml and update:');
                console.log('  REDIS_HOSTS=local:host.docker.internal:<PORT>');
                console.log('');
                console.log('Replace <PORT> with your Redis mapped port.');
                console.log('--------------------------------------------------');
                console.log('🔐 IF USING BUILT-IN REDIS TEMPLATE:');
                console.log('   No password required (default)');
                console.log('   Check Redis terminal for its port!');
                console.log('--------------------------------------------------');
                console.log('After editing, restart with: npm run stop && npm run start');
                console.log('==================================================\\n');
            });
        }).on('error', () => {
            setTimeout(checkStatus, 2000);
        });
    });
};

setTimeout(checkStatus, 3000);

const cleanup = () => {
    console.log('Stopping Redis Commander...');
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
            args: ['pkg', 'set', 'description=Redis Commander - Redis Web GUI']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'fontawesomeIcon=fas fa-server text-red-500']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'appType=tool']
        }
    ]
};

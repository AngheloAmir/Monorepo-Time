import type { ProjectTemplate } from "../../types";

export const MailpitTool: ProjectTemplate = {
    name: "Mailpit",
    description: "Email Testing Tool",
    notes: "Requires Docker. Catches all outgoing emails for testing.",
    type: "tool",
    templating: [
        {
            action: 'file',
            file: 'docker-compose.yml',
            filecontent: `services:
  mailpit:
    image: axllent/mailpit
    pull_policy: if_not_present
    restart: unless-stopped
    ports:
      - "0:8025"
      - "0:1025"
    environment:
      - MP_SMTP_AUTH_ACCEPT_ANY=true
      - MP_SMTP_AUTH_ALLOW_INSECURE=true
    healthcheck:
      test: ["CMD", "wget", "--spider", "-q", "http://localhost:8025"]
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

console.log('Starting Mailpit...');

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
    exec('docker compose port mailpit 8025', (err, stdout, stderr) => {
        if (err || stderr || !stdout) {
            setTimeout(checkStatus, 2000);
            return;
        }
        const webPort = stdout.trim().split(':')[1];
        if (!webPort) {
            setTimeout(checkStatus, 2000);
            return;
        }

        // Get SMTP port
        exec('docker compose port mailpit 1025', (err2, stdout2, stderr2) => {
            const smtpPort = stdout2 ? stdout2.trim().split(':')[1] : null;
            if (!smtpPort) {
                setTimeout(checkStatus, 2000);
                return;
            }

            // Verify mailpit is responding
            http.get(\`http://localhost:\${webPort}\`, (res) => {
                exec('docker compose ps -q', (err3, stdout3) => {
                    const containerIds = stdout3 ? stdout3.trim().split('\\n') : [];
                    
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
                    console.log('📧 Mailpit - Local Email Testing Server');
                    console.log('==================================================');
                    console.log(\`Web UI:            http://localhost:\${webPort}\`);
                    console.log(\`SMTP Server:       localhost:\${smtpPort}\`);
                    console.log('--------------------------------------------------');
                    console.log('📌 GENERAL SMTP CONFIG:');
                    console.log('   SMTP_HOST=localhost');
                    console.log(\`   SMTP_PORT=\${smtpPort}\`);
                    console.log('   SMTP_USER=        (leave empty)');
                    console.log('   SMTP_PASS=        (leave empty)');
                    console.log('--------------------------------------------------');
                    console.log('🔐 SUPABASE AUTH (.env):');
                    console.log('   SMTP_HOST=localhost');
                    console.log(\`   SMTP_PORT=\${smtpPort}\`);
                    console.log('   SMTP_USER=');
                    console.log('   SMTP_PASS=');
                    console.log('   SMTP_ADMIN_EMAIL=admin@localhost');
                    console.log('   SMTP_SENDER_NAME=Supabase');
                    console.log('--------------------------------------------------');
                    console.log('⚡ N8N AUTOMATION:');
                    console.log('   Email Node -> SMTP Settings:');
                    console.log(\`   Host: localhost | Port: \${smtpPort}\`);
                    console.log('   SSL: Off | Auth: None');
                    console.log('==================================================');
                    console.log('All emails are caught locally - view them in Web UI');
                    console.log('==================================================\\n');
                });
            }).on('error', () => {
                setTimeout(checkStatus, 2000);
            });
        });
    });
};

setTimeout(checkStatus, 3000);

const cleanup = () => {
    console.log('Stopping Mailpit...');
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
            args: ['pkg', 'set', 'description=Mailpit - Email Testing Tool']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'fontawesomeIcon=fas fa-envelope text-purple-500']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'appType=tool']
        }
    ]
};

export const serverContent = `const http = require('http');
const { spawn, exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const RUNTIME_FILE = path.join(__dirname, '.runtime.json');
const ANSI = {
  RESET: '\\x1b[0m',
  BRIGHT: '\\x1b[1m',
  RED: '\\x1b[31m',
  GREEN: '\\x1b[32m',
  YELLOW: '\\x1b[33m',
  BLUE: '\\x1b[34m',
  MAGENTA: '\\x1b[35m',
  CYAN: '\\x1b[36m',
  WHITE: '\\x1b[37m'
};

const log = (msg) => console.log(msg);
const logHeader = (msg) => console.log(\`\${ANSI.BRIGHT}\${ANSI.CYAN}\${msg}\${ANSI.RESET}\`);
const logTitle = (msg) => console.log(\`\${ANSI.BRIGHT}\${ANSI.YELLOW}\${msg}\${ANSI.RESET}\`);
const logSub = (msg) => console.log(\`  \${ANSI.WHITE}- \${msg}\${ANSI.RESET}\`);

logHeader('\\nStarting Metabase Stack... Data Analytics Learning Environment');

// Start Docker Compose
const child = spawn('docker', ['compose', 'up', '-d', '--remove-orphans'], { stdio: 'inherit' });

child.on('close', (code) => {
    if (code !== 0) process.exit(code);
    
    // Follow logs with minimal noise
    const logs = spawn('docker', ['compose', 'logs', '-f', '--tail=0'], { stdio: ['ignore', 'pipe', 'pipe'] });
    
    const printImportant = (data) => {
        const lines = data.toString().split('\\n');
        lines.forEach(line => {
            let cleanLine = line.replace(/^[^|]+\\|\\s+/, '');
            const lower = cleanLine.toLowerCase();
            if (lower.includes('metabase initialization complete') || lower.includes('started on port')) {
                 log(\`\${ANSI.GREEN}[Metabase] \${cleanLine}\${ANSI.RESET}\`);
            }
        });
    };

    logs.stdout.on('data', printImportant);
    logs.stderr.on('data', printImportant);
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
    // Port assigned dynamically
});

// Check status loop
const checkStatus = () => {
    exec('docker compose port metabase 3000', (err, stdout, stderr) => {
        if (err || stderr || !stdout) {
            setTimeout(checkStatus, 2000);
            return;
        }
        const publicPort = stdout.trim().split(':')[1];
        if (!publicPort) {
            setTimeout(checkStatus, 2000);
            return;
        }

        // Verify HTTP response
        http.get(\`http://localhost:\${publicPort}/api/health\`, (res) => {
            if (res.statusCode === 200) {
                // Determine container IDs
                exec('docker compose ps -q', (err2, stdout2) => {
                    const containerIds = stdout2 ? stdout2.trim().split('\\n') : [];
                    try {
                        fs.writeFileSync(RUNTIME_FILE, JSON.stringify({ 
                            port: server.address().port, 
                            pid: process.pid,
                            containerIds: containerIds
                        }));
                    } catch(e) {}
                    
                    process.stdout.write('\\x1Bc'); // Clear screen
                    
                    logHeader('==================================================');
                    logTitle('Metabase - Business Intelligence for Everyone');
                    log(\`\${ANSI.GREEN}Official Site:\${ANSI.RESET}     https://www.metabase.com\`);
                    log(\`\${ANSI.GREEN}Docker Image:\${ANSI.RESET}      https://hub.docker.com/r/metabase/metabase\`);
                    logHeader('==================================================');
                    log(\`\${ANSI.GREEN}Web UI:\${ANSI.RESET}            http://localhost:\${publicPort}\`);
                    log('--------------------------------------------------');
                    
                    logTitle('LEARNING PATH: Data Analyst');
                    logSub('Key Skills: SQL, Data Visualization, Business Logic, Dashboards');
                    logSub('Typical Role: Analyze company data to provide insights for decision making.');
                    logSub('Career Goal: Senior Data Analyst / BI Developer ($80k - $130k+)');
                    log('--------------------------------------------------');
                    
                    logTitle('EDUCATIONAL TASKS:');
                    logSub('1. Login and connect to the Sample Dataset provided by Metabase.');
                    logSub('2. Create a "Question" to find: "Total Revenue by Month".');
                    logSub('3. Turn that answer into a Line Chart.');
                    logSub('4. Create a Dashboard and add 3 different visualizations to it.');
                    logSub('5. (Advanced) Connect to an external Postgres/MySQL database.');
                    
                    log('--------------------------------------------------');
                    log(\`\${ANSI.BLUE}Documentation:\${ANSI.RESET}      https://www.metabase.com/docs/latest/\`);
                    logHeader('==================================================\\n');
                });
            } else {
                setTimeout(checkStatus, 2000);
            }
        }).on('error', () => setTimeout(checkStatus, 2000));
    });
};

setTimeout(checkStatus, 5000);

const cleanup = () => {
    log('\\nStopping Metabase Environment...');
    exec('docker compose down', (err) => {
        try { fs.unlinkSync(RUNTIME_FILE); } catch(e) {}
        process.exit(0);
    });
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);`;

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

logHeader('\\nStarting Observability Stack... DevOps & SRE Learning Environment');

// Start Docker Compose
exec('docker compose down --remove-orphans', () => {
    const child = spawn('docker', ['compose', 'up', '-d', '--remove-orphans', '--force-recreate'], { stdio: 'inherit' });

child.on('close', (code) => {
    if (code !== 0) process.exit(code);
    
    const logs = spawn('docker', ['compose', 'logs', '-f', '--tail=0'], { stdio: ['ignore', 'pipe', 'pipe'] });
    
    // Minimal log output
    const printImportant = (data) => {
        // ... filtering could go here
    };

    logs.stdout.on('data', printImportant);
    logs.stderr.on('data', printImportant);
    logs.on('close', (c) => process.exit(c || 0));
    });
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

const checkStatus = () => {
    exec('docker compose port grafana 3000', (err, stdout, stderr) => {
        if (err || stderr || !stdout) {
            setTimeout(checkStatus, 2000);
            return;
        }
        const grafanaPort = stdout.trim().split(':')[1];
        
        exec('docker compose port prometheus 9090', (err2, stdout2) => {
             const promPort = stdout2 ? stdout2.trim().split(':')[1] : null;

             if (!grafanaPort || !promPort) {
                setTimeout(checkStatus, 2000);
                 return;
             }

             http.get(\`http://localhost:\${grafanaPort}/api/health\`, (res) => {
                if (res.statusCode === 200) {
                     exec('docker compose ps -q', (err3, stdout3) => {
                        const containerIds = stdout3 ? stdout3.trim().split('\\n') : [];
                        try {
                            fs.writeFileSync(RUNTIME_FILE, JSON.stringify({ 
                                port: server.address().port, 
                                pid: process.pid,
                                containerIds: containerIds
                            }));
                        } catch(e) {}
                        
                        process.stdout.write('\\x1Bc');
                        
                        logHeader('==================================================');
                        logTitle('Monitoring Stack - Prometheus & Grafana');
                        log(\`\${ANSI.GREEN}Official Sites:\${ANSI.RESET}   https://grafana.com & https://prometheus.io\`);
                        logHeader('==================================================');
                        log(\`\${ANSI.GREEN}Grafana UI:\${ANSI.RESET}      http://localhost:\${grafanaPort} (admin/admin)\`);
                        log(\`\${ANSI.MAGENTA}Prometheus UI:\${ANSI.RESET}   http://localhost:\${promPort}\`);
                        log('--------------------------------------------------');
                        
                        logTitle('🎓 LEARNING PATH: Site Reliability Engineer (SRE)');
                        logSub('Key Skills: Metrics, Alerting, System Performance, Dashboards');
                        logSub('Typical Role: Ensure production systems are healthy and reliable.');
                        logSub('Career Goal: Senior DevOps Engineer / SRE');
                        log('--------------------------------------------------');
                        
                        logTitle('EDUCATIONAL TASKS:');
                        logSub('1. Login to Grafana (admin/admin).');
                        logSub('2. Add Prometheus as a "Data Source" (URL: http://prometheus:9090).');
                        logSub('3. Create a Dashboard and visualize "node_memory_MemFree_bytes".');
                        logSub('4. Import a pre-made Grafana Dashboard for "Node Exporter" (ID: 1860).');
                        logSub('5. (Advanced) Set up an Alert Rule for high CPU usage.');
                        
                        log('--------------------------------------------------');
                        log(\`\${ANSI.BLUE}Grafana Docs:\${ANSI.RESET}     https://grafana.com/docs/\`);
                        log(\`\${ANSI.BLUE}Prometheus Docs:\${ANSI.RESET}  https://prometheus.io/docs/\`);
                        logHeader('==================================================\\n');
                     });
                } else {
                    setTimeout(checkStatus, 2000);
                }
             }).on('error', () => setTimeout(checkStatus, 2000));
        });
    });
};

setTimeout(checkStatus, 5000);

const cleanup = () => {
    log('\\nStopping Monitoring Stack...');
    exec('docker compose down', (err) => {
        try { fs.unlinkSync(RUNTIME_FILE); } catch(e) {}
        process.exit(0);
    });
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);`;

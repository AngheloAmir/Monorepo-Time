import type { ProjectTemplate } from "../../types";

export const StrapiLocal: ProjectTemplate = {
    name: "Strapi CMS",
    description: "Open source Headless CMS",
    notes: "Requires Docker. Default user configured in environment.",
    type: "app",
    category: "Service",
    icon: "fas fa-pencil-ruler text-purple-600",
    templating: [
        {
            action: 'file',
            file: 'docker-compose.yml',
            filecontent: `services:
  strapi:
    container_name: strapi
    image: strapi/strapi:latest
    pull_policy: missing
    restart: unless-stopped
    env_file: .env
    environment:
      DATABASE_CLIENT: postgres
      DATABASE_HOST: strapiDB
      DATABASE_PORT: 5432
      DATABASE_NAME: strapi
      DATABASE_USERNAME: strapi
      DATABASE_PASSWORD: strapiPassword
      JWT_SECRET: superSecretKey
      ADMIN_JWT_SECRET: superAdminSecretKey
      APP_KEYS: key1,key2,key3,key4
      API_TOKEN_SALT: salt123
      NODE_ENV: development
    volumes:
      - ./strapi-app:/srv/app
    ports:
      - "1337:1337"
    depends_on:
      strapiDB:
        condition: service_healthy
    healthcheck:
      test: ["CMD-SHELL", "wget --spider http://localhost:1337/admin || exit 1"]
      interval: 10s
      timeout: 5s
      retries: 5

  strapiDB:
    image: postgres:15-alpine
    pull_policy: missing
    restart: unless-stopped
    environment:
      POSTGRES_USER: strapi
      POSTGRES_PASSWORD: strapiPassword
      POSTGRES_DB: strapi
    volumes:
      - strapi-data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U strapi"]
      interval: 5s
      timeout: 5s
      retries: 5

volumes:
  strapi-data:
`
        },
        {
             action: 'file',
             file: '.env',
             filecontent: `HOST=0.0.0.0
PORT=1337
APP_KEYS=BE/72m/sT3f7L/u/v/d/0A==,kP7/sT3f7L/u/v/d/0A==,BE/72m/sT3f7L/u/v/d/0B==,BE/72m/sT3f7L/u/v/d/0C==
API_TOKEN_SALT=salt123
ADMIN_JWT_SECRET=superAdminSecretKey
JWT_SECRET=superSecretKey
`
        },
        {
            action: 'file',
            file: '.gitignore',
            filecontent: `# Local data
strapi-app/
strapi-data/

# Runtime file
.runtime.json
.env
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
const APP_DIR = path.join(__dirname, 'strapi-app');

console.log('Starting Strapi CMS...');

// Pre-create app directory
if (!fs.existsSync(APP_DIR)) {
    fs.mkdirSync(APP_DIR, { recursive: true });
}

// Start Docker Compose
const child = spawn('docker', ['compose', 'up', '-d', '--remove-orphans'], { stdio: 'inherit' });

child.on('close', (code) => {
    if (code !== 0) process.exit(code);
    
    // Follow logs
    const logs = spawn('docker', ['compose', 'logs', '-f', 'strapi', '--tail=0'], { stdio: ['ignore', 'pipe', 'pipe'] });
    
    const printImportant = (data) => {
        const lines = data.toString().split('\\n');
        lines.forEach(line => {
            // Strapi logs are usually readable, pass them through or filter
            console.log(line);
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
    // runtime update later
});

// Check status loop
const checkStatus = () => {
    exec('docker compose port strapi 1337', (err, stdout, stderr) => {
        if (err || stderr || !stdout) {
            setTimeout(checkStatus, 2000);
            return;
        }
        const port = stdout.trim().split(':')[1];
        if (!port) {
            setTimeout(checkStatus, 2000);
            return;
        }

        exec('docker compose ps -q', (err2, stdout2) => {
             const containerIds = stdout2 ? stdout2.trim().split('\\n') : [];
             
             try {
                fs.writeFileSync(RUNTIME_FILE, JSON.stringify({ 
                    port: server.address().port, 
                    pid: process.pid,
                    containerIds: containerIds
                }));
             } catch(e) {}

             process.stdout.write('\\x1Bc');
             console.log('\\n==================================================');
             console.log('🚀 Strapi CMS is running!');
             console.log('==================================================');
             console.log(\`Admin Panel:       http://localhost:\${port}/admin\`);
             console.log(\`API:               http://localhost:\${port}/api\`);
             console.log('--------------------------------------------------');
             console.log('Note: First launch may take a minute to initialize.');
             console.log('      If directories are empty, Strapi will generate a new project.');
             console.log('==================================================\\n');
        });
    });
};

setTimeout(checkStatus, 3000);

const cleanup = () => {
    console.log('Stopping Strapi...');
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
            args: ['install']
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
            args: ['pkg', 'set', 'description=Strapi Headless CMS (Docker)']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'appType=app']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'fontawesomeIcon=fas fa-pencil-ruler text-purple-600']
        }
    ]
};

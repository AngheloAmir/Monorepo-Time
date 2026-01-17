import { ProjectTemplate } from ".";

const templates: ProjectTemplate[] = [
    {
        name: "MySQL",
        description: "MySQL Database (Local)",
        notes: "Requires MySQL installed in your system.",
        templating: [
            {
                action: 'command',
                command: 'npm install open'
            },
            {
                action: 'file',
                file: 'server.js',
                filecontent: `const path = require('path');

// Configuration
const EDITOR_URL = 'http://localhost/phpmyadmin'; // Change this to your preferred editor URL

(async () => {
    console.log(\`Opening MySQL Editor at \${EDITOR_URL}...\`);
    try {
        const open = (await import('open')).default;
        await open(EDITOR_URL);
        console.log('Opened successfully.');
    } catch (err) {
        console.error('Failed to open browser:', err);
    }
})();`
            },
            {
                action: 'command',
                command: 'npm pkg set scripts.dev="node server.js"'
            },
            {
                action: 'command',
                command: 'npm pkg set scripts.start="node server.js"'
            },
            {
                action: 'command',
                command: 'npm pkg set scripts.stop="echo \'Note: MySQL is running as a system service. Please stop it manually.\'"'
            }
        ]
    },
    {
        name: "PostgreSQL",
        description: "PostgreSQL Database (Docker Compose)",
        notes: "Requires Docker installed.",
        templating: [
            {
                action: 'file',
                file: 'docker-compose.yml',
                filecontent: `

services:
  postgres:
    image: postgres:16-alpine
    container_name: postgres
    restart: unless-stopped
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
      POSTGRES_DB: mydatabase
    ports:
      - "0:5432"
    volumes:
      - postgres-data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U user -d mydatabase"]
      interval: 5s
      timeout: 5s
      retries: 5

volumes:
  postgres-data:`
            },
            {
                action: 'command',
                command: 'npm pkg set scripts.dev="docker compose up"'
            },
            {
                action: 'command',
                command: 'npm pkg set scripts.start="docker compose up"'
            },
            {
                action: 'command',
                command: 'npm pkg set scripts.stop="docker compose down"'
            }
        ]
    },
    {
        name: "Supabase",
        description: "Supabase (Docker)",
        notes: "Requires Docker installed.",
        templating: [
            {
                action: 'command',
                command: 'npm install supabase --save-dev'
            },
            {
                action: 'command',
                command: 'npx supabase init'
            },
            {
                action: 'command',
                command: 'npm pkg set scripts.dev="npx supabase start"'
            },
            {
                action: 'command',
                command: 'npm pkg set scripts.start="npx supabase start"'
            },
            {
                action: 'command',
                command: 'npm pkg set scripts.stop="npx supabase stop"'
            }
        ]
    },
    {
        name: "Redis",
        description: "Redis (Docker Compose)",
        notes: "Requires Docker installed.",
        templating: [
            {
                action: 'file',
                file: 'docker-compose.yml',
                filecontent: `

services:
  redis:
    image: redis:7.2-alpine
    container_name: redis
    restart: unless-stopped
    ports:
      - "0:6379"
    volumes:
      - redis-data:/data
    command: >
      redis-server
      --appendonly yes
      --save 60 1
      --loglevel warning
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      timeout: 3s
      retries: 5

volumes:
  redis-data:`
            },
            {
                action: 'command',
                command: 'npm pkg set scripts.dev="docker compose up"'
            },
            {
                action: 'command',
                command: 'npm pkg set scripts.start="docker compose up"'
            },
            {
                action: 'command',
                command: 'npm pkg set scripts.stop="docker compose down"'
            }
        ]
    },
    {
        name: "MongoDB",
        description: "MongoDB (Docker Compose)",
        notes: "Requires Docker installed.",
        templating: [
            {
                action: 'file',
                file: 'docker-compose.yml',
                filecontent: `services:
  mongodb:
    image: mongo:7.0
    container_name: mongodb
    restart: unless-stopped
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password
    ports:
      - "0:27017"
    volumes:
      - mongo-data:/data/db
    command: ["mongod", "--quiet"]
    logging:
      driver: "none"
    healthcheck:
      test: echo "db.runCommand('ping').ok" | mongosh localhost:27017/test --quiet
      interval: 10s
      timeout: 10s
      retries: 5

volumes:
  mongo-data:`
            },
            {
                action: 'file',
                file: 'start.js',
                filecontent: `const { exec } = require('child_process');

console.log('Starting MongoDB...');

const process = exec('docker compose up');

// Filter output
process.stdout.on('data', (data) => {
    // Only show critical info or nothing
});

process.stderr.on('data', (data) => {
    // Docker compose often writes to stderr
    if (!data.includes('The attribute \`version\` is obsolete')) {
        // console.error(data); // Uncomment if real errors needed
    }
});

// Give it time to start, then print info
setTimeout(() => {
    exec('docker compose port mongodb 27017', (err, stdout, stderr) => {
        if (stderr) {
            console.error(stderr);
            return;
        }
        const port = stdout.trim().split(':')[1];
        console.clear();
        console.log('\\n==================================================');
        console.log('🚀 MongoDB is running!');
        console.log('--------------------------------------------------');
        console.log(\`🔌 Connection String: mongodb://admin:password@localhost:\${port}\`);
        console.log('👤 Username:          admin');
        console.log('🔑 Password:          password');
        console.log(\`🌐 Port:              \${port}\`);
        console.log('==================================================\\n');
    });
}, 3000);`
            },
            {
                action: 'command',
                command: 'npm install'
            },
            {
                action: 'command',
                command: 'npm pkg set scripts.dev="node start.js"'
            },
            {
                action: 'command',
                command: 'npm pkg set scripts.start="node start.js"'
            },
            {
                action: 'command',
                command: 'npm pkg set scripts.stop="docker compose down"'
            }
        ]
    }
];
export default templates;
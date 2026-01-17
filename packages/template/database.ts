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
                filecontent: `version: "3.9"

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
      - "5432:5432"
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
                filecontent: `version: "3.9"

services:
  redis:
    image: redis:7.2-alpine
    container_name: redis
    restart: unless-stopped
    ports:
      - "6379:6379"
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
                filecontent: `version: "3.9"

services:
  mongodb:
    image: mongo:7.0
    container_name: mongodb
    restart: unless-stopped
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db
    healthcheck:
      test: echo "db.runCommand('ping').ok" | mongosh localhost:27017/test --quiet
      interval: 10s
      timeout: 10s
      retries: 5

volumes:
  mongo-data:`
            },
            {
                action: 'command',
                command: 'npm pkg set scripts.dev="docker compose up"'
            },
            {
                action: 'command',
                command: 'npm pkg set scripts.start="docker compose up"'
            }
        ]
    }
];
export default templates;
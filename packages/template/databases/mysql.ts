import type { ProjectTemplate } from "../../types";

export const MySQL: ProjectTemplate = {
  name: "MariaDB",
  description: "MariaDB (MySQL compatible)",
  notes: "Uses MariaDB (MySQL compatible).",
  type: "database",
  category: "Database",
  icon: "fas fa-database text-blue-500",
  templating: [
    {
      action: "file",
      file: "docker-compose.yml",
      filecontent: `
services:
  db:
    image: mariadb:12.1.2
    restart: always
    user: "\${UID:-1000}:\${GID:-1000}"
    environment:
      - MARIADB_ROOT_PASSWORD=admin
      - MARIADB_DATABASE=db
      - MARIADB_USER=admin
      - MARIADB_PASSWORD=admin

    ports:
      - "\${DB_PORT:-3306}:3306"

    volumes:
      - ./mysql-data:/var/lib/mysql

    healthcheck:
      test: ["CMD", "mariadb-admin", "ping", "-h", "127.0.0.1", "-u", "root", "--password=admin"]
      interval: 10s
      timeout: 5s
      retries: 60
      start_period: 40s
`
    },
    {
      action: "file",
      file: ".gitignore",
      filecontent: `
mysql-data/
.runtime.json
node_modules/
`
    },
    {
      action: "file",
      file: "index.js",
      filecontent: `
const http = require("http");
const os = require("os");
const { spawn, exec, execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const RUNTIME_FILE = path.join(__dirname, ".runtime.json");
const DATA_DIR = path.join(__dirname, "mysql-data");

// Helper to find available port
const getPort = (startPort) => new Promise((resolve, reject) => {
    const s = http.createServer();
    s.listen(startPort, () => {
        const p = s.address().port;
        s.close(() => resolve(p));
    });
    s.on('error', () => resolve(getPort(startPort + 1)));
});

async function main() {
    console.log("Starting MySQL (MariaDB)...");

    // 0. Clean up any stale containers/networks from previous runs
    try {
        execSync("docker compose down", { stdio: "ignore", cwd: __dirname });
    } catch (e) {
        // Ignore errors (e.g. if already down or docker not running)
    }

    // 1. Ensure data directory exists so it's owned by you
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    // Check permissions
    try {
      fs.accessSync(DATA_DIR, fs.constants.W_OK);
    } catch (e) {
      console.error("\\x1b[31mError: Cannot write to ./mysql-data directory.\\x1b[0m");
      console.error("This is likely because it is owned by root from a previous run.");
      console.error("Please run the following command to fix it:");
      console.error("  sudo rm -rf " + DATA_DIR);
      process.exit(1);
    }

    // Find Open Ports
    const DB_PORT = await getPort(3306);

    // 2. Start Docker Compose passing dynamic ports
    const child = spawn("docker", ["compose", "up", "-d", "--remove-orphans"], {
      stdio: "inherit",
      env: { 
        ...process.env,
        DB_PORT,
        UID: process.getuid ? process.getuid() : 1000, 
        GID: process.getgid ? process.getgid() : 1000 
      }
    });

    child.on("close", (code) => {
      if (code !== 0) {
        console.error("Failed to start Docker containers.");
        console.error("If you see a network error, try running:");
        console.error("  docker compose down");
        process.exit(code);
      }

      // Follow logs to catch startup errors
      const logs = spawn("docker", ["compose", "logs", "-f", "--tail=0"], {
        stdio: ["ignore", "pipe", "pipe"]
      });

      const printImportant = (data) => {
        const lines = data.toString().split("\\n");
        lines.forEach((line) => {
          const clean = line.replace(/^[^|]+\\|\\s+/, "");
          if (clean.toLowerCase().includes("error") || clean.toLowerCase().includes("fatal")) {
            process.stdout.write("\\x1b[31mError:\\x1b[0m " + clean + "\\n");
          }
        });
      };

      logs.stdout.on("data", printImportant);
      logs.stderr.on("data", printImportant);
    });

    // 3. Control server
    const server = http.createServer((req, res) => {
      if (req.url === "/stop") {
        res.writeHead(200);
        res.end("Stopping...");
        cleanup();
      } else {
        res.writeHead(404);
        res.end();
      }
    });

    server.listen(0);

    // 4. Check status
    const checkStatus = () => {
      // Use the actual port we assigned (DB_PORT) not what docker compose reports (it should match)
      exec("docker compose ps -q db", (err2, stdout2) => {
          const containerId = stdout2 ? stdout2.trim() : "";
          if (!containerId) {
            setTimeout(checkStatus, 2000);
            return;
          }

          // Check if the container is reportedly "healthy" (database is actually ready)
          exec(\`docker inspect --format='{{.State.Health.Status}}' \${containerId}\`, (err3, stdout3) => {
            const status = stdout3 ? stdout3.trim() : "unknown";

            if (status !== "healthy") {
               // Database is still initializing... wait and retry
               process.stdout.write("."); 
               setTimeout(checkStatus, 2000);
               return;
            }

            // It is healthy! Write runtime file and show success message
            fs.writeFileSync(
              RUNTIME_FILE,
              JSON.stringify({
                port: server.address().port,
                pid: process.pid,
                containerId
              })
            );

            process.stdout.write("\\x1Bc"); 
            console.log("\\n==================================================");
            console.log("MySQL is running!");
            console.log("--------------------------------------------------");
            console.log(\`Local Connection URI: mysql://admin:admin@localhost:\${DB_PORT}/db\`);
            console.log("--------------------------------------------------");
            console.log("CloudBeaver Setup Instructions:");
            console.log("1. Open CloudBeaver");
            console.log("2. Create a new connection -> MariaDB");

            // Detect IP for Docker/CloudBeaver usage
            let cloudBeaverHost = "localhost";
            if (process.platform === "win32" || process.platform === "darwin") {
                cloudBeaverHost = "host.docker.internal";
            } else {
                try {
                    const nets = os.networkInterfaces();
                    for (const name of Object.keys(nets)) {
                        for (const net of nets[name]) {
                            // Find IPv4 that is not internal 
                            if (net.family === "IPv4" && !net.internal) {
                                cloudBeaverHost = net.address;
                                break; // Take the first valid one (LAN or Docker Bridge)
                            }
                        }
                        if (cloudBeaverHost !== "localhost") break;
                    }
                } catch(e) {}
            }

            process.stdout.write("\\x1Bc"); 
            console.log("\\n==================================================");
            console.log("MySQL is running!");
            console.log("--------------------------------------------------");
            console.log(\`Local Application URI: mysql://admin:admin@localhost:\${DB_PORT}/db\`);
            console.log("--------------------------------------------------");
            console.log("CloudBeaver (Docker) Setup Instructions:");
            console.log("1. Open CloudBeaver");
            console.log("2. Create a new connection -> MariaDB");
            console.log(\`3. Host: \${cloudBeaverHost}\`);
            console.log(\`4. Port: \${DB_PORT}\`);
            console.log("5. Database: db");
            console.log("6. Username: admin");
            console.log("7. Password: admin");
            console.log("==================================================\\n");
            console.log("Note: Database instantiation may take up to a minute.");
          });
        });
    };

    setTimeout(checkStatus, 3000);

    const cleanup = () => {
      console.log("Stopping containers...");
      exec("docker compose down", () => {
        try { fs.unlinkSync(RUNTIME_FILE); } catch {}
        process.exit(0);
      });
    };

    process.on("SIGINT", cleanup);
    process.on("SIGTERM", cleanup);
}

main();
`
    },
    {
      action: "command",
      cmd: "npm",
      args: ["init", "-y"]
    },
    {
      action: "command",
      cmd: "npm",
      args: ["pkg", "set", "scripts.start=node index.js"]
    },
    {
      action: "command",
      cmd: "npm",
      args: ["pkg", "set", "description=MySQL (Percona 8)"]
    },
    {
      action: "command",
      cmd: "npm",
      args: [
        "pkg",
        "set",
        "scripts.stop=node -e 'const fs=require(\"fs\"); try{const p=JSON.parse(fs.readFileSync(\".runtime.json\")).port; fetch(\"http://localhost:\"+p+\"/stop\").catch(()=>{})}catch(e){}'"
      ]
    }
  ]
};
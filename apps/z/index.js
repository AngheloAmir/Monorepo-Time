
const http = require("http");
const { spawn, exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const RUNTIME_FILE = path.join(__dirname, ".runtime.json");
const DATA_DIR = path.join(__dirname, "mysql-data");

console.log("Starting MySQL (Percona 8 + Adminer)...");

// 1. Ensure data directory exists so it's owned by you
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// 2. Start Docker Compose passing your current UID/GID
const child = spawn("docker", ["compose", "up", "-d", "--remove-orphans"], {
  stdio: "inherit",
  env: { 
    ...process.env, 
    UID: process.getuid ? process.getuid() : 1000, 
    GID: process.getgid ? process.getgid() : 1000 
  }
});

child.on("close", (code) => {
  if (code !== 0) {
    console.error("Failed to start Docker containers.");
    process.exit(code);
  }

  // Follow logs to catch startup errors
  const logs = spawn("docker", ["compose", "logs", "-f", "--tail=0"], {
    stdio: ["ignore", "pipe", "pipe"]
  });

  const printImportant = (data) => {
    const lines = data.toString().split("\n");
    lines.forEach((line) => {
      const clean = line.replace(/^[^|]+\|\s+/, "");
      if (clean.toLowerCase().includes("error") || clean.toLowerCase().includes("fatal")) {
        process.stdout.write("\x1b[31mError:\x1b[0m " + clean + "\n");
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
  exec("docker compose port db 3306", (err, stdout) => {
    if (err || !stdout) {
      setTimeout(checkStatus, 2000);
      return;
    }

    const port = stdout.trim().split(":")[1] || "3306";

    exec("docker compose ps -q db", (err2, stdout2) => {
      const containerId = stdout2 ? stdout2.trim() : "";

      fs.writeFileSync(
        RUNTIME_FILE,
        JSON.stringify({
          port: server.address().port,
          pid: process.pid,
          containerId
        })
      );

      process.stdout.write("\x1Bc"); 
      console.log("\n==================================================");
      console.log("MySQL is running!");
      console.log("--------------------------------------------------");
      console.log(`Connection: mysql://admin:admin@localhost:${port}/db`);
      console.log("Admin UI:   http://localhost:8081");
      console.log("Username:   admin");
      console.log("Password:   admin");
      console.log("==================================================\n");
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

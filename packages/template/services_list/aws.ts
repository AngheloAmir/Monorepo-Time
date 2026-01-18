import type { ProjectTemplate } from "..";

const dockerCompose = `services:
  localstack:
    image: localstack/localstack
    ports:
      - "127.0.0.1:4566:4566"            # LocalStack Gateway
      - "127.0.0.1:4510-4559:4510-4559"  # External services port range
    environment:
      - DEBUG=\${DEBUG-}
      - SERVICES=s3,lambda,dynamodb,apigateway,sqs,sns,logs,cloudwatch
      - DOCKER_HOST=unix:///var/run/docker.sock
      - AWS_DEFAULT_REGION=us-east-1
    volumes:
      - localstack-data:/var/lib/localstack
      - /var/run/docker.sock:/var/run/docker.sock
    networks:
      - cloud-net

  dynamodb-admin:
    image: aaronshaf/dynamodb-admin
    ports:
      - "8001:8001"
    environment:
      - DYNAMO_ENDPOINT=http://localstack:4566
      - AWS_REGION=us-east-1
      - AWS_ACCESS_KEY_ID=test
      - AWS_SECRET_ACCESS_KEY=test
    depends_on:
      - localstack
    networks:
      - cloud-net

  s3-manager:
    image: cloudlena/s3manager
    ports:
      - "8002:8080"
    environment:
      - ACCESS_KEY_ID=test
      - SECRET_ACCESS_KEY=test
      - REGION=us-east-1
      - ENDPOINT=localstack:4566
      - USE_SSL=false
    depends_on:
      - localstack
    networks:
      - cloud-net

volumes:
  localstack-data: {}

networks:
  cloud-net:
    driver: bridge`;

const deployJs = `const path = require("path");
const { spawn } = require("child_process");

/* ======================================================
   CONFIG — YOU EDIT ONLY THIS
====================================================== */

const aws = {
  provider: "localstack",        // "localstack" | "aws"
  region: "us-east-1",
  accessKey: "test",
  secretKey: "test",
  endpoint: "http://localhost:4566"
};

const services = [
  {
    name: "foodmaker",
    type: "frontend",
    dir: "examples/frontend" 
  },
  {
    name: "nodeserver",
    type: "backend",
    dir: "examples/nodeserver",
    runtime: "nodejs18.x",
    handler: "index.handler",
    apiPath: "/api/{proxy+}"
  }
];

const dynamoTables = [
  { name: "Users", hashKey: "id" },
  { name: "Orders", hashKey: "orderId" }
];

/* ======================================================
   INTERNAL SETUP
====================================================== */

const colors = {
  reset: "\\x1b[0m",
  green: "\\x1b[32m",
  yellow: "\\x1b[33m",
  cyan: "\\x1b[36m",
  orange: "\\x1b[38;5;208m",
  red: "\\x1b[31m"
};

const ENDPOINT =
  aws.provider === "localstack" ? \`--endpoint-url=\${aws.endpoint}\` : "";

process.env.AWS_ACCESS_KEY_ID = aws.accessKey;
process.env.AWS_SECRET_ACCESS_KEY = aws.secretKey;
process.env.AWS_DEFAULT_REGION = aws.region;

module.exports = {
  runDeploy: async (req, res) => {
    res.writeHead(200, {
      "Content-Type": "text/plain",
      "Transfer-Encoding": "chunked"
    });

    const log = (msg, c = colors.reset) =>
      res.write(\`\${c}\${msg}\${colors.reset}\\n\`);

    const run = (cmd, args, cwd) =>
      new Promise((resolve, reject) => {
        const p = spawn(cmd, args, { cwd, shell: true });
        let out = "";
        p.stdout.on("data", d => { out += d; res.write(d); });
        p.stderr.on("data", d => res.write(colors.yellow + d + colors.reset));
        p.on("close", c => c === 0 ? resolve(out) : reject(new Error(cmd + " failed")));
      });

    try {
      log("\\n🚀 Deploying Polyglot Cloud", colors.orange);

      /* IAM */
      await run("aws", [ENDPOINT, "iam", "create-role", "--role-name", "lambda-role",
        "--assume-role-policy-document",
        \`'{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Principal":{"Service":"lambda.amazonaws.com"},"Action":"sts:AssumeRole"}]}'\`
      ]).catch(()=>{});

      /* DynamoDB */
      for (const t of dynamoTables) {
        await run("aws", [ENDPOINT, "dynamodb", "create-table",
          "--table-name", t.name,
          "--attribute-definitions", \`AttributeName=\${t.hashKey},AttributeType=S\`,
          "--key-schema", \`AttributeName=\${t.hashKey},KeyType=HASH\`,
          "--billing-mode", "PAY_PER_REQUEST"
        ]).catch(()=>{});
      }

      /* Services */
      for (const svc of services) {

        /* Frontend */
        if (svc.type === "frontend") {
          const bucket = \`\${svc.name}-frontend\`;
          await run("aws", [ENDPOINT, "s3", "mb", \`s3://\${bucket}\`]).catch(()=>{});
          // Ensure dir exists or just skip if missing to prevent error in demo
          try {
             await run("aws", [ENDPOINT, "s3", "sync", path.resolve(__dirname, svc.dir), \`s3://\${bucket}\`, "--acl", "public-read"]);
             svc.url = \`http://localhost:4566/\${bucket}/index.html\`;
          } catch (e) { log("Skipping upload: " + e.message); }
        }

        /* Backend (ZIP) */
        if (svc.type === "backend" && svc.runtime !== "docker") {
          const zip = \`/tmp/\${svc.name}.zip\`;
          const bucket = \`\${svc.name}-code\`;

          // Simple zip of the dir
          await run("zip", ["-r", zip, ".", "-x", "*/.git/*"], path.resolve(__dirname, svc.dir)).catch(e => log("Zip failed (is zip installed?): " + e.message));
          
          await run("aws", [ENDPOINT, "s3", "mb", \`s3://\${bucket}\`]).catch(()=>{});
          await run("aws", [ENDPOINT, "s3", "cp", zip, \`s3://\${bucket}/code.zip\`]);

          await run("aws", [ENDPOINT, "lambda", "delete-function", "--function-name", svc.name]).catch(()=>{});
          await run("aws", [ENDPOINT, "lambda", "create-function",
            "--function-name", svc.name,
            "--runtime", svc.runtime,
            "--handler", svc.handler,
            "--code", \`S3Bucket=\${bucket},S3Key=code.zip\`,
            "--role", "arn:aws:iam::000000000000:role/lambda-role"
          ]);
        }
        
        // ... (Skipped other types for brevity in template, can be added if needed based on original request)

        /* API Gateway */
        if (svc.type === "backend") {
          const api = await run("aws", [ENDPOINT, "apigatewayv2", "create-api", "--name", svc.name, "--protocol-type", "HTTP"]);
          const apiId = JSON.parse(api).ApiId;

          const integ = await run("aws", [ENDPOINT, "apigatewayv2", "create-integration",
            "--api-id", apiId,
            "--integration-type", "AWS_PROXY",
            "--integration-uri", \`arn:aws:lambda:us-east-1:000000000000:function:\${svc.name}\`,
            "--payload-format-version", "2.0"
          ]);

          const integId = JSON.parse(integ).IntegrationId;

          await run("aws", [ENDPOINT, "apigatewayv2", "create-route",
            "--api-id", apiId,
            "--route-key", \`ANY \${svc.apiPath}\`,
            "--target", \`integrations/\${integId}\`
          ]);

          await run("aws", [ENDPOINT, "apigatewayv2", "create-stage",
            "--api-id", apiId,
            "--stage-name", "prod",
            "--auto-deploy"
          ]);

          svc.url = \`http://localhost:4566/restapis/\${apiId}/prod/_user_request_\`;
        }
      }

      log("\\n🌍 URLs", colors.orange);
      services.forEach(s => log(\`• \${s.name}: \${s.url}\`, colors.cyan));
      
      log("\\nAdditional Tools:", colors.cyan);
      log("• DynamoDB Admin: http://localhost:8001", colors.cyan);
      log("• S3 Managed: http://localhost:8002", colors.cyan);

      log("\\n✅ Cloud Ready", colors.green);
    } catch (e) {
      log("\\n❌ " + e.message, colors.red);
    }

    res.end();
  }
};`;

const serverJs = `const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn, exec } = require('child_process');
const deploy = require('./deploy');

const RUNTIME_FILE = path.join(__dirname, '.runtime.json');
let currentPort = 3748;

console.log("Starting AWS Local environment...");

// Spawn Docker Compose
const docker = spawn('docker', ['compose', 'up', '-d'], { stdio: 'inherit' });

docker.on('close', (code) => {
    if (code !== 0) {
        console.error('Failed to start Docker containers');
        process.exit(code);
    }
    // Give containers a moment to initialize
    setTimeout(displayCredentials, 3000);
});

function displayCredentials() {
    // Get container IDs for runtime file
    exec('docker compose ps -q', (err, stdout) => {
        let containerIds = [];
        if (stdout) {
            containerIds = stdout.trim().split('\\n').filter(id => id);
        }

        // Write runtime file
        try {
            fs.writeFileSync(RUNTIME_FILE, JSON.stringify({
                port: server.address().port,
                pid: process.pid,
                containerIds: containerIds
            }));
        } catch(e) {}

        console.log('\\n==================================================');
        console.log('🚀 AWS LocalStack is running!');
        console.log('--------------------------------------------------');
        console.log('📌 AWS Credentials:');
        console.log('   Access Key ID:     test');
        console.log('   Secret Access Key: test');
        console.log('   Region:            us-east-1');
        console.log('--------------------------------------------------');
        console.log('🌐 Service URLs:');
        console.log('   LocalStack:        http://localhost:4566');
        console.log('   DynamoDB Admin:    http://localhost:8001');
        console.log('   S3 Manager:        http://localhost:8002');
        console.log(\`   Manager UI:        http://localhost:\${server.address().port}\`);
        console.log('--------------------------------------------------');
        console.log('📦 Available Services:');
        console.log('   S3, Lambda, DynamoDB, API Gateway, SQS, SNS, CloudWatch');
        console.log('==================================================\\n');
    });
}

const requestListener = function (req, res) {
    if (req.url === "/") {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(fs.readFileSync(path.join(__dirname, 'index.html')));
    } else if (req.url === "/deploy") {
        deploy.runDeploy(req, res);
    } else if (req.url === "/stop") {
        res.writeHead(200);
        res.end('Stopping...');
        cleanup();
    } else {
        res.writeHead(404);
        res.end("Not found");
    }
}

const server = http.createServer(requestListener);

function startServer(port) {
    server.listen(port);
}

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.log(\`Port \${currentPort} is in use, trying \${currentPort + 1}...\`);
        currentPort++;
        startServer(currentPort);
    } else {
        console.error('Server error:', err);
        process.exit(1);
    }
});

server.on('listening', () => {
    console.log(\`AWS Local Manager running at http://localhost:\${server.address().port}\`);
});

startServer(currentPort);

const cleanup = () => {
    console.log("Stopping AWS Local environment...");
    try {
        const runtime = JSON.parse(fs.readFileSync(RUNTIME_FILE));
        if (runtime.containerIds) {
            console.log(\`Stopping \${runtime.containerIds.length} containers...\`);
            runtime.containerIds.forEach(id => {
                exec(\`docker stop \${id}\`);
            });
        }
    } catch(e) {}
    try { fs.unlinkSync(RUNTIME_FILE); } catch(e) {}
    
    spawn('docker', ['compose', 'down'], { stdio: 'inherit' });
    setTimeout(() => process.exit(0), 2000);
};

// Handle cleanup
process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);`;

const stopJs = `const { spawn } = require('child_process');
console.log("Stopping AWS Local environment...");
spawn('docker', ['compose', 'down'], { stdio: 'inherit' });`;

const indexHtml = `<!DOCTYPE html>
<html lang="en" class="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AWS Local Manager</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            darkMode: 'class',
            theme: {
                extend: {
                    colors: {
                        dark: {
                            900: '#1a1a1a',
                            800: '#2d2d2d',
                            700: '#404040',
                        }
                    }
                }
            }
        }
    </script>
    <style>
        .ansi-green { color: #4ade80; }
        .ansi-yellow { color: #facc15; }
        .ansi-red { color: #f87171; }
        .ansi-cyan { color: #22d3ee; }
        .ansi-orange { color: #fb923c; }
    </style>
</head>
<body class="bg-dark-900 text-white h-screen flex flex-col font-sans">
    <div class="container mx-auto p-8 flex-1 flex flex-col">
        <header class="mb-8">
            <h1 class="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">AWS Local Manager</h1>
            <p class="text-gray-400 mt-2">Manage your LocalStack environment and deployments</p>
        </header>

        <!-- Tabs -->
        <div class="flex border-b border-dark-700 mb-6">
            <button onclick="switchTab('deploy')" id="tab-deploy" class="tab-btn px-6 py-3 text-blue-400 border-b-2 border-blue-400 font-medium">Deploy</button>
            <button onclick="switchTab('upload')" id="tab-upload" class="tab-btn px-6 py-3 text-gray-400 hover:text-white font-medium">Upload Example</button>
            <button onclick="switchTab('node')" id="tab-node" class="tab-btn px-6 py-3 text-gray-400 hover:text-white font-medium">Node App App</button>
        </div>

        <!-- Tab Content: Deploy -->
        <div id="content-deploy" class="tab-content flex-1 flex flex-col gap-6">
            <div class="grid grid-cols-2 gap-6">
                <div class="bg-dark-800 p-6 rounded-lg border border-dark-700">
                    <h2 class="text-xl font-semibold mb-4">Credentials</h2>
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm text-gray-400 mb-1">Access Key ID</label>
                            <input type="text" value="test" class="w-full bg-dark-900 border border-dark-700 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500" readonly>
                        </div>
                        <div>
                            <label class="block text-sm text-gray-400 mb-1">Secret Access Key</label>
                            <input type="password" value="test" class="w-full bg-dark-900 border border-dark-700 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500" readonly>
                        </div>
                         <div>
                            <label class="block text-sm text-gray-400 mb-1">Region</label>
                            <input type="text" value="us-east-1" class="w-full bg-dark-900 border border-dark-700 rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500" readonly>
                        </div>
                    </div>
                </div>
                
                <div class="bg-dark-800 p-6 rounded-lg border border-dark-700 flex flex-col justify-center items-center">
                    <button onclick="startDeploy()" class="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-bold text-lg transition-colors shadow-lg shadow-blue-500/20 flex items-center gap-2">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                        Deploy to LocalStack
                    </button>
                </div>
            </div>

            <div class="flex-1 bg-black rounded-lg border border-dark-700 p-4 font-mono text-sm overflow-auto" id="console-output">
                <div class="text-gray-500">// Console output will appear here...</div>
            </div>
        </div>

        <!-- Tab Content: Upload -->
        <div id="content-upload" class="hidden tab-content">
            <div class="bg-dark-800 p-6 rounded-lg border border-dark-700">
                <h2 class="text-xl font-semibold mb-4">Upload to S3 Example</h2>
                <p class="text-gray-400 mb-4">Code example for uploading files to LocalStack S3.</p>
                <div class="bg-black p-4 rounded overflow-x-auto text-green-400 font-mono text-sm">
const AWS = require('aws-sdk');
const fs = require('fs');

const s3 = new AWS.S3({
    endpoint: 'http://localhost:4566',
    s3ForcePathStyle: true,
    region: 'us-east-1',
    accessKeyId: 'test',
    secretAccessKey: 'test'
});

const uploadFile = (fileName) => {
    const fileContent = fs.readFileSync(fileName);
    const params = {
        Bucket: 'my-bucket',
        Key: fileName,
        Body: fileContent
    };

    s3.upload(params, function(err, data) {
        if (err) { throw err; }
        console.log(\`File uploaded successfully. \${data.Location}\`);
    });
};
                </div>
            </div>
        </div>

        <!-- Tab Content: Node App -->
        <div id="content-node" class="hidden tab-content">
            <div class="bg-dark-800 p-6 rounded-lg border border-dark-700">
                <h2 class="text-xl font-semibold mb-4">Node.js AWS App Example</h2>
                <div class="bg-black p-4 rounded overflow-x-auto text-blue-400 font-mono text-sm">
const AWS = require('aws-sdk');

AWS.config.update({
    region: "us-east-1",
    endpoint: "http://localhost:4566"
});

const dynamodb = new AWS.DynamoDB();

const params = {
    TableName : "Movies",
    KeySchema: [       
        { AttributeName: "year", KeyType: "HASH"},  //Partition key
        { AttributeName: "title", KeyType: "RANGE" }  //Sort key
    ],
    AttributeDefinitions: [       
        { AttributeName: "year", AttributeType: "N" },
        { AttributeName: "title", AttributeType: "S" }
    ],
    ProvisionedThroughput: {       
        ReadCapacityUnits: 10, 
        WriteCapacityUnits: 10
    }
};

dynamodb.createTable(params, function(err, data) {
    if (err) {
        console.error("Unable to create table. Error:", JSON.stringify(err, null, 2));
    } else {
        console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
    }
});
                </div>
            </div>
        </div>
    </div>

    <script>
        function switchTab(tab) {
            // Hide all content
            document.querySelectorAll('.tab-content').forEach(el => el.classList.add('hidden'));
            // Remove active style from buttons
            document.querySelectorAll('.tab-btn').forEach(el => {
                el.classList.remove('text-blue-400', 'border-b-2', 'border-blue-400');
                el.classList.add('text-gray-400');
            });

            // Show selected content
            document.getElementById('content-' + tab).classList.remove('hidden');
            // Add active style to button
            const btn = document.getElementById('tab-' + tab);
            btn.classList.remove('text-gray-400');
            btn.classList.add('text-blue-400', 'border-b-2', 'border-blue-400');
        }

        async function startDeploy() {
            const consoleEl = document.getElementById('console-output');
            consoleEl.innerHTML = ''; // Clear previous output
            
            try {
                const response = await fetch('/deploy');
                const reader = response.body.getReader();
                const decoder = new TextDecoder();

                while (true) {
                    const { value, done } = await reader.read();
                    if (done) break;
                    
                    const text = decoder.decode(value);
                    // Simple color replacement for ANSI codes roughly matched to style logic
                    // In a real app we'd use a proper ANSI parser library
                    const formatted = text
                        .replace(/\\x1b\\[32m/g, '<span class="ansi-green">')
                        .replace(/\\x1b\\[33m/g, '<span class="ansi-yellow">')
                        .replace(/\\x1b\\[31m/g, '<span class="ansi-red">')
                        .replace(/\\x1b\\[36m/g, '<span class="ansi-cyan">')
                        .replace(/\\x1b\\[38;5;208m/g, '<span class="ansi-orange">')
                        .replace(/\\x1b\\[0m/g, '</span>');

                    consoleEl.innerHTML += formatted;
                    consoleEl.scrollTop = consoleEl.scrollHeight;
                }
            } catch (error) {
                consoleEl.innerHTML += \`<span class="ansi-red">Error connecting to deploy server: \${error.message}</span>\`;
            }
        }
    </script>
</body>
</html>`;

export const AWSTemplate: ProjectTemplate = {
    name: "AWS Local",
    description: "AWS LocalStack Environment with Manager",
    notes: "Requires Docker, Node.js, and AWS CLI installed.",
    templating: [
        {
            action: 'file',
            file: 'docker-compose.yml',
            filecontent: dockerCompose
        },
        {
            action: 'file',
            file: 'deploy.js',
            filecontent: deployJs
        },
        {
            action: 'file',
            file: 'server.js',
            filecontent: serverJs
        },
        {
            action: 'file',
            file: 'stop.js',
            filecontent: stopJs
        },
        {
            action: 'file',
            file: 'index.html',
            filecontent: indexHtml
        },
        {
            action: 'command',
            command: 'mkdir -p examples/frontend examples/nodeserver'
        },
         {
            action: 'file',
            file: 'examples/frontend/index.html',
            filecontent: '<html><body><h1>Hello from S3!</h1></body></html>'
        },
        {
            action: 'file',
            file: 'examples/nodeserver/index.js',
            filecontent: 'exports.handler = async (event) => { return { statusCode: 200, body: JSON.stringify("Hello from Lambda!") }; };'
        },
        {
            action: 'command',
            command: 'npm pkg set scripts.dev="node server.js"'
        },
        {
            action: 'command',
            command: 'npm pkg set scripts.stop="node stop.js"'
        },
        {
            action: 'command',
            command: 'npm pkg set fontawesomeIcon="fa-solid fa-cloud"'
        }
    ]
};

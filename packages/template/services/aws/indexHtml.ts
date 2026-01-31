export const indexHtml = `<!DOCTYPE html>
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

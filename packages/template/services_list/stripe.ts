
import type { ProjectTemplate } from "..";

const dockerCompose = `services:
  stripe-mock:
    image: stripe/stripe-mock:latest
    container_name: stripe-mock
    ports:
      - "12111:12111"
      - "12112:12112"
    healthcheck:
      test: ["CMD", "/usr/bin/curl", "-f", "http://localhost:12111/"]
      interval: 5s
      timeout: 5s
      retries: 5
`;

const serverJs = `const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn, exec } = require('child_process');

const RUNTIME_FILE = path.join(__dirname, '.runtime.json');

console.log('Starting Stripe Mock Server...');

// Spawn Docker Compose
const docker = spawn('docker', ['compose', 'up', '-d'], { stdio: 'inherit' });

docker.on('close', (code) => {
    if (code !== 0) {
        console.error('Failed to start Docker containers');
        process.exit(code);
    }
    // Give container a moment to initialize
    setTimeout(displayCredentials, 3000);
});

function displayCredentials() {
    // Get container ID for runtime file
    exec('docker compose ps -q stripe-mock', (err, stdout) => {
        let containerIds = [];
        if (stdout) {
            containerIds = [stdout.trim()];
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
        console.log('💳 Stripe Mock Server is running!');
        console.log('--------------------------------------------------');
        console.log('📌 Connection Details:');
        console.log('   API Key:           sk_test_mock_123 (any key works)');
        console.log('   HTTP Endpoint:     http://localhost:12111');
        console.log('   HTTPS Endpoint:    https://localhost:12112');
        console.log('--------------------------------------------------');
        console.log('📝 Quick Start (Node.js):');
        console.log("   const stripe = new Stripe('sk_test_mock_123', {");
        console.log("       host: 'localhost',");
        console.log("       port: 12111,");
        console.log("       protocol: 'http'");
        console.log('   });');
        console.log('--------------------------------------------------');
        console.log('🧪 Test Command:');
        console.log('   npm run test');
        console.log('==================================================\\n');
    });
}

const requestListener = function (req, res) {
    if (req.url === '/stop') {
        res.writeHead(200);
        res.end('Stopping...');
        cleanup();
    } else {
        res.writeHead(200);
        res.end('Stripe Mock running. Use /stop to stop.');
    }
}

const server = http.createServer(requestListener);
server.listen(0, () => {
    console.log('Control server running on port', server.address().port);
});

const cleanup = () => {
    console.log('Stopping Stripe Mock Server...');
    try {
        const runtime = JSON.parse(fs.readFileSync(RUNTIME_FILE));
        if (runtime.containerIds) {
            console.log(\\\`Stopping \\\${runtime.containerIds.length} containers...\\\`);
            runtime.containerIds.forEach(id => {
                exec(\\\`docker stop \\\${id}\\\`);
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

const testJs = `const Stripe = require('stripe');

// Initialize with a fake key and point to the mock server
// The mock server accepts any API key
const stripe = new Stripe('sk_test_mock_123', {
  host: 'localhost',
  port: 12111,
  protocol: 'http',
});

(async () => {
    console.log('Connecting to Local Stripe Mock at http://localhost:12111...');

    try {
        // 1. Create a Customer
        console.log('\\n1. Creating a mock customer...');
        const customer = await stripe.customers.create({
            email: 'jane.doe@example.com',
            name: 'Jane Doe',
            description: 'My First Mock Customer'
        });
        console.log('✅ Customer created:', customer.id);
        console.log('   Email:', customer.email);

        // 2. Create a Product
        console.log('\\n2. Creating a mock product...');
        const product = await stripe.products.create({
            name: 'Gold Special',
            description: 'One-time gold plan',
        });
        console.log('✅ Product created:', product.id);

        // 3. Create a Price
        console.log('\\n3. Creating a price for the product...');
        const price = await stripe.prices.create({
            unit_amount: 2000,
            currency: 'usd',
            product: product.id,
        });
        console.log('✅ Price created:', price.id);

        // 4. Create a Payment Intent
        console.log('\\n4. Creating a payment intent...');
        const paymentIntent = await stripe.paymentIntents.create({
            amount: 2000,
            currency: 'usd',
            payment_method_types: ['card'],
            customer: customer.id,
        });
        console.log('✅ Payment Intent created:', paymentIntent.id);
        console.log('   Status:', paymentIntent.status); // likely 'requires_payment_method' in mock

        console.log('\\n🎉 Success! You are successfully talking to the local Stripe Mock.');
        console.log('For more examples, try running other Stripe API commands.');

    } catch (err) {
        console.error('❌ Error interacting with Stripe Mock:', err.message);
        console.error('Make sure the docker container is running with: npm run start');
    }
})();
`;

export const StripeTemplate: ProjectTemplate = {
    name: "Stripe Mock (Experimental)",
    description: "Stripe API Mock Server",
    notes: "Runs the official stripe-mock image. Requires Docker.",
    templating: [
        {
            action: 'file',
            file: 'docker-compose.yml',
            filecontent: dockerCompose
        },
        {
            action: 'file',
            file: 'server.js',
            filecontent: serverJs
        },
        {
            action: 'file',
            file: 'test.js',
            filecontent: testJs
        },
        {
            action: 'root-command',
            cmd: 'npm',
            args: ['install', '--workspace', '{{RELATIVE_PATH}}', 'stripe']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'scripts.dev=node server.js']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'scripts.start=node server.js']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'scripts.test=node test.js']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'scripts.stop=node -e \'const fs=require("fs"); try{const p=JSON.parse(fs.readFileSync(".runtime.json")).port; fetch("http://localhost:"+p+"/stop").catch(e=>{})}catch(e){}\'']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'fontawesomeIcon=fas fa-credit-card text-green-500']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'description=Stripe Mock']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'name=$(basename $PWD)']
        },
    ]
};

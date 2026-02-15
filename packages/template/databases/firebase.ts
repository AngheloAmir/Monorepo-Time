import type { ProjectTemplate } from "../../types";

export const Firebase: ProjectTemplate = {
    name: "Firebase",
    description: "Firebase Emulator Suite (Local)",
    notes: "Requires Java (JRE) installed for most emulators.",
    type: "tool",
    category: "Database",
    icon: "fas fa-fire text-orange-500",
    templating: [
        {
            action: 'file',
            file: 'firebase.json',
            filecontent: `{
  "emulators": {
    "auth": {
      "port": 3800
    },
    "firestore": {
      "port": 3801
    },
    "database": {
      "port": 3803
    },
    "storage": {
      "port": 3802
    },
    "ui": {
      "enabled": true,
      "port": 3804
    },
    "single_project_mode": true
  }
}`
        },
        {
            action: 'file',
            file: '.firebaserc',
            filecontent: `{
  "projects": {
    "default": "demo-local"
  }
}`
        },
        {
            action: 'file',
            file: '.env',
            filecontent: `API_KEY="demo-key-for-local-development"
AUTH_DOMAIN="demo-local.firebaseapp.com"
FIREBASE_DATABASE_URL="https://demo-local.firebaseio.com"
PROJECT_ID="demo-local"
STORAGE_BUCKET_ID="demo-local.appspot.com"
MESSAGING_SENDER_ID="1234567890"
APP_ID="1:1234567890:web:local-demo-id"
MEASUREMENT_ID="G-XXXXXXX"
JWT_SECRET="local-secret-key-12345"
JWT_ACCESS_EXPIRATION_MINUTES=1440
JWT_REFRESH_EXPIRATION_DAYS=30

# Configuration for the Firebase Emulator
FIREBASE_AUTH_EMULATOR_HOST="127.0.0.1:3800"
FIRESTORE_EMULATOR_HOST="127.0.0.1:3801"
FIREBASE_STORAGE_EMULATOR_HOST="127.0.0.1:3802"
FIREBASE_DATABASE_EMULATOR_HOST="127.0.0.1:3803"`
        },
        {
            action: 'file',
            file: 'index.js',
            filecontent: `const { spawn, execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const RUNTIME_FILE = path.join(__dirname, '.runtime.json');

// Check if Java is installed
try {
    execSync('java -version', { stdio: 'ignore' });
} catch (e) {
    console.error('\\n\\x1b[31m%s\\x1b[0m', 'Error: Java (JRE) is not installed.');
    console.error('\\x1b[31m%s\\x1b[0m', 'The Firebase Emulator Suite requires Java to run.');
    console.error('Please install Java (JRE 11+) and try again.\\n');
    process.exit(1);
}

console.log('\\x1b[33m%s\\x1b[0m', 'Starting Firebase Emulator Suite...');

const child = spawn('npx', ['firebase', 'emulators:start'], { 
    stdio: 'inherit',
    shell: true 
});

child.on('spawn', () => {
    fs.writeFileSync(RUNTIME_FILE, JSON.stringify({ 
        pid: process.pid,
        childPid: child.pid
    }));
});

child.on('close', (code) => {
    try { fs.unlinkSync(RUNTIME_FILE); } catch(e) {}
    process.exit(code || 0);
});

// Print Environment Variables for the user
setTimeout(() => {
    console.log('\\n\\x1b[32m%s\\x1b[0m', '==================================================');
    console.log('🔥 Firebase Emulator Suite');
    console.log('Official Site: https://firebase.google.com/docs/emulator-suite');
    console.log('License:       Apache-2.0');
    console.log('\\x1b[32m%s\\x1b[0m', '--------------------------------------------------');
    console.log('\\x1b[32m%s\\x1b[0m', 'COPY THESE TO YOUR SERVER APP .env FILE:');
    console.log('\\x1b[32m%s\\x1b[0m', '--------------------------------------------------');
    console.log('API_KEY="demo-key-for-local-development"');
    console.log('AUTH_DOMAIN="demo-local.firebaseapp.com"');
    console.log('FIREBASE_DATABASE_URL="https://demo-local.firebaseio.com"');
    console.log('PROJECT_ID="demo-local"');
    console.log('STORAGE_BUCKET_ID="demo-local.appspot.com"');
    console.log('MESSAGING_SENDER_ID="1234567890"');
    console.log('APP_ID="1:1234567890:web:local-demo-id"');
    console.log('MEASUREMENT_ID="G-XXXXXXX"');
    console.log('JWT_SECRET="local-secret-key-12345"');
    console.log('JWT_ACCESS_EXPIRATION_MINUTES=1440');
    console.log('JWT_REFRESH_EXPIRATION_DAYS=30');
    console.log('\\n# Configuration for the Firebase Emulator');
    console.log('FIREBASE_AUTH_EMULATOR_HOST="127.0.0.1:3800"');
    console.log('FIRESTORE_EMULATOR_HOST="127.0.0.1:3801"');
    console.log('FIREBASE_STORAGE_EMULATOR_HOST="127.0.0.1:3802"');
    console.log('FIREBASE_DATABASE_EMULATOR_HOST="127.0.0.1:3803"');
    console.log('\\n');
    console.log('\\x1b[32m%s\\x1b[0m', '--------------------------------------------------');
    console.log('\\x1b[33m%s\\x1b[0m', 'IMPORTANT: To connect your Client App (Web), use this:');
    console.log('// Standard Connection Snippet =============================================');
    console.log('if (window.location.hostname === "localhost") {');
    console.log('    const host = "127.0.0.1";');
    console.log('    connectAuthEmulator(getAuth(), "http://" + host + ":3800");');
    console.log('    connectFirestoreEmulator(getFirestore(), host, 3801);');
    console.log('    console.log("Using Local Firebase Emulators");');
    console.log('} else {');
    console.log('    console.log("Using Production Firebase Services");');
    console.log('}');
    console.log('// =========================================================================');
    console.log('View sample Admin SDK code in: demo.js');
    console.log('\\x1b[32m%s\\x1b[0m', '==================================================\\n');
}, 5000);

const cleanup = () => {
    console.log('\\n\\x1b[33m%s\\x1b[0m', 'Stopping Firebase Emulators...');
    child.kill('SIGINT');
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);`
        },
        {   
            action: 'file',
            file: 'demo.js',
            filecontent: `// demo.js
const admin = require('firebase-admin');

// 1. Initialize the Admin SDK
// If the environment variables (FIRESTORE_EMULATOR_HOST, FIREBASE_AUTH_EMULATOR_HOST, etc.) are set,
// the Admin SDK will automatically connect to the local emulators.
admin.initializeApp({ projectId: "demo-local" });

const db = admin.firestore();
const auth = admin.auth();

async function runDemo() {
    console.log('\\x1b[36m%s\\x1b[0m', '--- Firebase Emulator Node.js Demo ---');

    try {
        console.log('\\n[AUTH DEMO]');
        const testEmail = 'user@example.com';
        
        // Cleanup existing user if any (common for repeated local tests)
        try {
            const oldUser = await auth.getUserByEmail(testEmail);
            await auth.deleteUser(oldUser.uid);
            console.log('Cleanup: Deleted existing test user');
        } catch (e) {}

        // 2. Create a user in Auth Emulator
        const userRecord = await auth.createUser({
            email: testEmail,
            password: 'secretPassword',
            displayName: 'Test User',
        });
        console.log('✅ Successfully created user in Auth Emulator:', userRecord.email);

        console.log('\\n[FIRESTORE DEMO]');
        // 3. Write data to Firestore Emulator associated with that user
        const docRef = db.collection('users').doc(userRecord.uid);
        await docRef.set({
            first: 'Test',
            last: 'User',
            email: testEmail,
            createdAt: new Date().toISOString()
        });
        console.log('✅ Successfully wrote to Firestore Emulator');

        // 4. Read data back
        const doc = await docRef.get();
        if (doc.exists) {
            console.log('✅ Successfully read from Firestore Emulator:', doc.data());
        }

        console.log('\\n\\x1b[32m%s\\x1b[0m', 'All tests passed against local emulators!');

    } catch (error) {
        console.error('\\n❌ Error connecting to emulator:', error.message);
        console.log('\\x1b[33m%s\\x1b[0m', 'Make sure your emulator is running (npm start)!');
    }
}

runDemo();`
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['install', 'firebase-tools', 'firebase-admin', '--save-dev']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'scripts.start=node index.js']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'scripts.demo=node demo.js']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'description=Firebase Emulator Suite']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'appType=tool']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'fontawesomeIcon=fas fa-fire text-orange-500']
        }
    ]
};

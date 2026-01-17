const { exec } = require('child_process');

console.log('Starting PostgreSQL...');

const process = exec('docker compose up');

// Filter output
process.stdout.on('data', (data) => {
   // Only show critical info or nothing
});

process.stderr.on('data', (data) => {
   // Docker compose often writes to stderr
   if (!data.includes('The attribute `version` is obsolete')) {
       // console.error(data); // Uncomment if real errors needed
   }
});

// Give it time to start, then print info
setTimeout(() => {
   exec('docker compose port postgres 5432', (err, stdout, stderr) => {
       if (stderr) {
           console.error(stderr);
           return;
       }
       const port = stdout.trim().split(':')[1];
       console.clear();
       console.log('\n==================================================');
       console.log('🚀 PostgreSQL is running!');
       console.log('--------------------------------------------------');
       console.log(`🔌 Connection String: postgres://user:password@localhost:${port}/mydatabase`);
       console.log('👤 Username:          user');
       console.log('🔑 Password:          password');
       console.log('🗄️  Database:          mydatabase');
       console.log(`🌐 Port:              ${port}`);
       console.log('==================================================\n');
   });
}, 5000);

// Handle process exit to clean up containers
const cleanup = () => {
    console.log('Stopping PostgreSQL...');
    exec('docker compose stop', () => {
        process.exit();
    });
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
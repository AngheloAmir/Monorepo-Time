export const stopJs = `const { spawn } = require('child_process');
console.log("Stopping AWS Local environment...");
spawn('docker', ['compose', 'down'], { stdio: 'inherit' });`;

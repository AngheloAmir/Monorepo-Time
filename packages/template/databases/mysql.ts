import type { ProjectTemplate } from "../../types";

export const MySQL: ProjectTemplate = {
    name: "MySQL",
    description: "MySQL Database (Local)",
    notes: "Requires MySQL installed in your system.",
    type: "database",
    icon: "fas fa-database text-blue-500",
    templating: [
        {
            action: 'command',
            cmd: 'npm',
            args: ['install', 'open']
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
            cmd: 'npm',
            args: ['pkg', 'set', 'scripts.start=node server.js']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'scripts.stop=echo \'Note: MySQL is running as a system service. Please stop it manually.\'']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'description=MySQL (Local)']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'appType=database']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'fontawesomeIcon=fas fa-database text-blue-500']
        }
    ]
};

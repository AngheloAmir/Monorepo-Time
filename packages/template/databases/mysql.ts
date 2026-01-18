import type { ProjectTemplate } from "..";

export const MySQL: ProjectTemplate = {
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
            command: 'npm pkg set scripts.start="node server.js"'
        },
        {
            action: 'command',
            command: 'npm pkg set scripts.stop="echo \'Note: MySQL is running as a system service. Please stop it manually.\'"'
        },
        {
            action: 'command',
            command: "npm pkg set scripts.fontawesomeIcon=\"fa-solid fa-database\""
        }
    ]
};

import awsTemplate from "./aws";
import { ProjectTemplate } from ".";

const templates: ProjectTemplate[] = [
   {
        name: "N8N Local",
        description: "N8N (Local)",
        notes: "Requires Node.js installed in your system.",
        templating: [
            {
                action: 'command',
                command: 'npm install n8n'
            },
            {
                action: 'command',
                command: 'npm pkg set scripts.dev="npx n8n"'
            },
            {
                action: 'command',
                command: 'npm pkg set scripts.start="npx n8n"'
            },
            {
                action: 'command',
                command: 'npm pkg set scripts.stop="npx kill-port 5678"'
            }
        ]
    },
    awsTemplate
];
export default templates;
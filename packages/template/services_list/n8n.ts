import type { ProjectTemplate } from "../../types";
import { dockerCompose } from "./n8n/dockerCompose";
import { gitignoreContent } from "./n8n/gitignore";
import { serverJs } from "./n8n/server";

export const N8NLocal: ProjectTemplate = {
    name: "N8N Local Dockerized",
    description: "N8N Workflow Automation",
    notes: "Requires Docker installed. Data is stored in ./n8n-data folder.",
    type: "app",
    templating: [
        {
            action: 'file',
            file: 'docker-compose.yml',
            filecontent: dockerCompose
        },
        {
            action: 'file',
            file: '.gitignore',
            filecontent: gitignoreContent
        },
        {
            action: 'file',
            file: 'index.js',
            filecontent: serverJs
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'scripts.start=node index.js']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'scripts.stop=node -e \'const fs=require("fs"); try{const p=JSON.parse(fs.readFileSync(".runtime.json")).port; fetch("http://localhost:"+p+"/stop").catch(e=>{})}catch(e){}\'']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'description=N8N Workflow Automation (Docker)']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'fontawesomeIcon=fas fa-project-diagram text-red-500']
        }
    ]
};

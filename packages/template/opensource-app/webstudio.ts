import type { ProjectTemplate } from "../../types";
import { dockerCompose } from "./webstudio/dockerCompose";
import { dockerfile } from "./webstudio/adockerfile";
import { entrypoint } from "./webstudio/entrypoint";
import { gitignoreContent } from "./webstudio/gitignore";
import { serverJs } from "./webstudio/server";

export const WebstudioLocal: ProjectTemplate = {
    name: "Webstudio Local",
    description: "Webstudio Builder",
    notes: "Open source visual builder (Docker Dev Mode with Node 20)",
    type: "opensource-app",
    category: "Open Source",
    icon: "fas fa-palette text-blue-500", 
    templating: [
        {
            action: 'file',
            file: 'docker-compose.yml',
            filecontent: dockerCompose
        },
        {
            action: 'file',
            file: 'Dockerfile',
            filecontent: dockerfile
        },
        {
            action: 'file',
            file: 'entrypoint.sh',
            filecontent: entrypoint
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
            args: ['pkg', 'set', 'description=Webstudio Visual Builder (Docker Dev)']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'appType=tool']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'fontawesomeIcon=fas fa-palette text-blue-500']
        }
    ]
};

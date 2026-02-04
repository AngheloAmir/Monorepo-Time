import type { ProjectTemplate } from "../../types";
import { dockerCompose } from "./penpot/dockerCompose";
import { gitignoreContent } from "./penpot/gitignore";
import { serverJs } from "./penpot/server";

export const PenpotLocal: ProjectTemplate = {
    name: "Penpot",
    description: "Open Source Design & Prototyping Platform",
    notes: "Self-hosted alternative to Figma. Requires Docker.",
    type: "opensource-app",
    category: "Open Source",
    icon: "fas fa-pen-nib text-green-500",
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
            args: ['pkg', 'set', 'description=Penpot Design Tool (Docker)']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'appType=tool']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'fontawesomeIcon=fas fa-pen-nib text-purple-500']
        }
    ]
};

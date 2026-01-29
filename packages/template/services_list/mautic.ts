import type { ProjectTemplate } from "..";
import { dockerCompose } from "./mautic/dockerCompose";
import { gitignoreContent } from "./mautic/gitignore";
import { serverJs } from "./mautic/server";

export const MauticLocal: ProjectTemplate = {
    name: "Mautic Local",
    description: "Marketing Automation Platform",
    notes: "Requires Docker installed. Data is stored in Docker volumes (mautic_data, mautic_db_data).",
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
            args: ['pkg', 'set', 'description=Mautic Marketing Automation (Docker)']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'appType=tool']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'fontawesomeIcon=fas fa-bullhorn text-purple-500']
        }
    ]
};

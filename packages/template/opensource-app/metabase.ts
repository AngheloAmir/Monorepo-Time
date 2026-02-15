import type { ProjectTemplate } from "../../types";
import { dockerCompose } from "./metabase/dockerCompose";
import { gitignoreContent } from "./metabase/gitignore";
import { serverContent } from "./metabase/server";

export const MetabaseLocal: ProjectTemplate = {
    name: "Metabase",
    description: "Business Intelligence & Analytics",
    notes: "Simplest way to let everyone in your company ask questions and learn from data.",
    type: "opensource-app",
    category: "Open Source",
    icon: "fas fa-chart-line text-blue-500",
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
            filecontent: serverContent
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
            args: ['pkg', 'set', 'description=Metabase Analytics Stack']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'appType=tool']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'fontawesomeIcon=fas fa-chart-line text-blue-500']
        }
    ]
};

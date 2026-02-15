import type { ProjectTemplate } from "../../types";
import { dockerCompose } from "./gns3/dockerCompose";
import { gitignoreContent } from "./gns3/gitignore";
import { serverJs } from "./gns3/server";

export const GNS3Local: ProjectTemplate = {
    name: "GNS3",
    description: "Graphical Network Simulator-3",
    notes: "Ideal for learning networking, certifications (CCNA, CCNP), and testing network topologies.",
    type: "opensource-app",
    category: "Open Source",
    icon: "fas fa-network-wired text-blue-500",
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
            args: ['pkg', 'set', 'description=GNS3 Network Simulator (Docker)']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'appType=tool']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'fontawesomeIcon=fas fa-network-wired text-blue-500']
        }
    ]
};

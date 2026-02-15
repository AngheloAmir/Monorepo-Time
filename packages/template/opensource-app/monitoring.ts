import type { ProjectTemplate } from "../../types";
import { dockerCompose } from "./monitoring/dockerCompose";
import { gitignoreContent } from "./monitoring/gitignore";
import { serverContent } from "./monitoring/server";
import { prometheusConfig } from "./monitoring/prometheusConfig";

export const MonitoringStack: ProjectTemplate = {
    name: "Monitoring Stack",
    description: "Prometheus, Grafana, Node Exporter",
    notes: "The industry standard for server monitoring and observability.",
    type: "opensource-app",
    category: "Open Source",
    icon: "fas fa-tachometer-alt text-orange-500",
    templating: [
        {
            action: 'file',
            file: 'docker-compose.yml',
            filecontent: dockerCompose
        },
        {
            action: 'file',
            file: 'prometheus.yml',
            filecontent: prometheusConfig
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
            args: ['pkg', 'set', 'description=Prometheus & Grafana (Docker)']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'appType=tool']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'fontawesomeIcon=fas fa-tachometer-alt text-orange-500']
        }
    ]
};

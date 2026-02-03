import type { ProjectTemplate } from "../../types";
import { dockerCompose } from "./k3d-headlamp/dockerCompose";
import { gitignoreContent } from "./k3d-headlamp/gitignore";
import { serverJs } from "./k3d-headlamp/server";
import { stopJs } from "./k3d-headlamp/stop";
import { readmeContent } from "./k3d-headlamp/readme";

export const K3dHeadlampTemplate: ProjectTemplate = {
    name: "K3d Headlamp",
    description: "Local Kubernetes learning environment",
    notes: "Requires k3d CLI installed",
    type: "tool",
    category: "Service",
    icon: "fas fa-dharmachakra text-blue-500",
    templating: [
        {
            action: 'command',
            cmd: 'mkdir',
            args: ['.kube', '.headlamp_data']
        },
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
            action: 'file',
            file: 'README.md',
            filecontent: readmeContent
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'scripts.start=node index.js']
        },
        {
            action: 'file',
            file: 'stop.js',
            filecontent: stopJs
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'scripts.stop=node stop.js']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'scripts.cluster:start=k3d cluster start learning-cluster']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'scripts.cluster:stop=k3d cluster stop learning-cluster']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'scripts.cluster:delete=k3d cluster delete learning-cluster']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'scripts.cluster:info=kubectl cluster-info && kubectl get nodes']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'description=K3d + Headlamp Kubernetes Learning Environment']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'fontawesomeIcon=fas fa-dharmachakra text-blue-500']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'appType=tool']
        }
    ]
};

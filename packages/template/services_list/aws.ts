import type { ProjectTemplate } from "..";
import { deployJs } from "./aws/deploy";
import { dockerCompose } from "./aws/dockerCompose";
import { indexHtml } from "./aws/indexHtml";
import { serverJs } from "./aws/server";
import { stopJs } from "./aws/stop";

export const AWSTemplate: ProjectTemplate = {
    name: "AWS Local",
    description: "AWS LocalStack Environment with Manager",
    notes: "Requires Docker, Node.js, and AWS CLI installed.",
    templating: [
        {
            action: 'file',
            file: 'docker-compose.yml',
            filecontent: dockerCompose
        },
        {
            action: 'file',
            file: 'deploy.js',
            filecontent: deployJs
        },
        {
            action: 'file',
            file: 'server.js',
            filecontent: serverJs
        },
        {
            action: 'file',
            file: 'stop.js',
            filecontent: stopJs
        },
        {
            action: 'file',
            file: 'index.html',
            filecontent: indexHtml
        },
        {
            action: 'command',
            cmd: 'mkdir',
            args: ['-p', 'examples/frontend', 'examples/nodeserver']
        },
         {
            action: 'file',
            file: 'examples/frontend/index.html',
            filecontent: '<html><body><h1>Hello from S3!</h1></body></html>'
        },
        {
            action: 'file',
            file: 'examples/nodeserver/index.js',
            filecontent: 'exports.handler = async (event) => { return { statusCode: 200, body: JSON.stringify("Hello from Lambda!") }; };'
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'scripts.dev=node server.js']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'scripts.stop=node stop.js']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'fontawesomeIcon=fa-solid fa-cloud']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'name=$(basename $PWD)']
        },
    ]
};


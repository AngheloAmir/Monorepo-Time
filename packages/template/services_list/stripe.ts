import type { ProjectTemplate } from "../../types";
import { dockerCompose } from "./stripe/dockerCompose";
import { gitignoreContent } from "./stripe/gitignore";
import { serverJs } from "./stripe/server";
import { testJs } from "./stripe/test";

export const StripeTemplate: ProjectTemplate = {
    name: "Stripe Mock (Experimental)",
    description: "Stripe API Mock Server",
    notes: "Runs the official stripe-mock image.",
    type: "tool",
    icon: "fab fa-stripe text-orange-500",
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
            file: 'server.js',
            filecontent: serverJs
        },
        {
            action: 'file',
            file: 'test.js',
            filecontent: testJs
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['install', 'stripe']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'scripts.dev=node server.js']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'scripts.start=node server.js']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'scripts.test=node test.js']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'scripts.stop=node -e \'const fs=require("fs"); try{const p=JSON.parse(fs.readFileSync(".runtime.json")).port; fetch("http://localhost:"+p+"/stop").catch(e=>{})}catch(e){}\'']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'fontawesomeIcon=fab fa-stripe text-orange-500']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'description=Stripe Mock']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'name=$(basename $PWD)']
        },
    ]
};

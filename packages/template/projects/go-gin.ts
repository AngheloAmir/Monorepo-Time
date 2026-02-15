import type { ProjectTemplate } from "../../types";
import files from "./files/_go_gin";

export const GoGinApp: ProjectTemplate = {
    name: "Go (Gin) Application",
    description: "High-performance Go Backend with Gin Framework",
    notes: "Go must be installed in your system.",
    type: "app",
    category: "Project",
    icon: "fas fa-cocktail text-cyan-500",
    templating: [
        {
            action: 'command',
            cmd: 'go',
            args: ['mod', 'init', 'app']
        },
        {
            action: 'command',
            cmd: 'go',
            args: ['get', '-u', 'github.com/gin-gonic/gin']
        },
        {
            action: 'command',
            cmd: 'go',
            args: ['get', '-u', 'github.com/gin-contrib/cors']
        },
        {
            action: 'file',
            file: 'main.go',
            filecontent: files.mainGoFile
        },
        {
            action: 'file',
            file: 'index.html',
            filecontent: files.indexHtmlFile
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['install', '-D', 'nodemon']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'scripts.dev=nodemon --watch . --ext go,html --exec "go run main.go"']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'scripts.start=go run main.go']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'scripts.build=go build -o app main.go']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'description=Go (Gin) Backend Application']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'scripts.stop=npx kill-port 4200']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'fontawesomeIcon=fas fa-cocktail text-cyan-500']
        }
    ]
};

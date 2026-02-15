import type { ProjectTemplate } from "../../types";
import files from "./files/_go";

export const GoApp: ProjectTemplate = {
    name: "Go Application",
    description: "Simple Go Backend Application",
    notes: "Go must be installed in your system.",
    type: "app",
    category: "Project",
    icon: "fab fa-golang text-blue-500",
    templating: [
        {
            action: 'command',
            cmd: 'go',
            args: ['mod', 'init', 'app']
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
            args: ['pkg', 'set', 'description=Go Backend Application']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'scripts.stop=npx kill-port 8080']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'fontawesomeIcon=fab fa-golang text-blue-500']
        }
    ]
};

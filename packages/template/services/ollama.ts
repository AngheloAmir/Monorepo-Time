import type { ProjectTemplate } from "../../types";
import { scriptContentQwen, scriptContentPhi3 } from "./ollama/scripts";
import { serverJs } from "./ollama/server";
import { gitignoreContent } from "./ollama/gitignore";
import { indexHtmlContent } from "./ollama/index_html";

const dockerComposeContent = `
services:
  ollama:
    image: ollama/ollama:latest
    container_name: \${PROJECT_NAME:-monotime}-ollama
    ports:
      - "11434:11434"
    volumes:
      - ollama_data:/root/.ollama
    environment:
      - OLLAMA_KEEP_ALIVE=1h
    # GPU Support - uncomment below if you have an NVIDIA GPU
    # deploy:
    #   resources:
    #     reservations:
    #       devices:
    #         - driver: nvidia
    #           count: 1
    #           capabilities: [gpu]
    restart: always

volumes:
  ollama_data:
`;

export const OllamaTemplate: ProjectTemplate = {
    name: "Ollama-Qwen2.5",
    description: "Run AI Models",
    notes: "Required 8GB Ram. GPU is optional",
    type: "tool",
    category: "AI",
    icon: "fab fa-docker text-blue-500",
    templating: [
        {
            action: 'file',
            file: 'docker-compose.yml',
            filecontent: dockerComposeContent
        },
        {
            action: 'file',
            file: 'server.js',
            filecontent: serverJs
        },
        {
            action: 'file',
            file: 'index.html',
            filecontent: indexHtmlContent
        },
        {
            action: 'file',
            file: '.gitignore',
            filecontent: gitignoreContent
        },
        {
            action: 'file',
            file: 'scripts/pull-qwen.sh',
            filecontent: scriptContentQwen
        },
        {
            action: 'file',
            file: 'scripts/pull-phi3.sh',
            filecontent: scriptContentPhi3
        },
        {
            action: 'command',
            cmd: 'chmod',
            args: ['+x', 'scripts/pull-qwen.sh', 'scripts/pull-phi3.sh']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'scripts.start=node server.js']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'scripts.stop=node -e \'const fs=require("fs"); try{const p=JSON.parse(fs.readFileSync(".runtime.json")).port; fetch("http://localhost:"+p+"/stop").catch(e=>{})}catch(e){}\'']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'scripts.pull:qwen=./scripts/pull-qwen.sh']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'scripts.pull:phi3=./scripts/pull-phi3.sh']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'name=ollama-qwen2.5']
        }
    ]
};

import type { ProjectTemplate } from "../../types";
import { scriptContentLlama3, scriptContentPhi3 } from "./ollama/scripts";
import { serverJs } from "./ollama/server";
import { gitignoreContent } from "./ollama/gitignore";
import fs from 'fs';
import path from 'path';

// Read the index.html content directly - we assume the file exists relative to this source file
// Note: In a built environment, we'd need to ensure this asset is copied or inline it.
// For this dev environment, reading it is fine. 
const indexHtmlContent = fs.readFileSync(path.join(__dirname, 'ollama', 'index.html'), 'utf-8');

const dockerComposeContent = `version: '3.8'

services:
  ollama:
    image: ollama/ollama:latest
    container_name: \${PROJECT_NAME:-monotime}-ollama
    ports:
      - "11434:11434"
    volumes:
      - ollama_data:/root/.ollama
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
    name: "Ollama Service",
    description: "Run AI Models Locally",
    notes: "AI Service for n8n. Includes Web UI & Auto-Model Management.",
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
            file: 'scripts/pull-llama3.sh',
            filecontent: scriptContentLlama3
        },
        {
            action: 'file',
            file: 'scripts/pull-phi3.sh',
            filecontent: scriptContentPhi3
        },
        {
            action: 'command',
            cmd: 'chmod',
            args: ['+x', 'scripts/pull-llama3.sh', 'scripts/pull-phi3.sh']
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
            args: ['pkg', 'set', 'scripts.pull:llama3=./scripts/pull-llama3.sh']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'scripts.pull:phi3=./scripts/pull-phi3.sh']
        },
        {
            action: 'command',
            cmd: 'npm',
            args: ['pkg', 'set', 'name=ollama-service']
        }
    ]
};

import type { ProjectTemplate } from "..";
import file from "./files/_viteapp";

export const ViteReact: ProjectTemplate = {
  name: 'Vite React TS',
  description: 'Vite React TS template',
  notes: "Node.js and NPM must be installed.",
  templating: [
    {
      action: 'command',
      cmd: 'rm -rf ./* ./.[!.]*',
      args: []
    },
    {
      action: 'command',
      cmd: 'npx',
      args: ['-y', 'create-vite@latest', '.', '--template', 'react-ts']
    },
    {
      action: 'command',
      cmd: 'npm',
      args: ['install']
    },
    {
      action: 'command',
      cmd: 'npm',
      args: ['install', '-D', 'tailwindcss', '@tailwindcss/postcss', 'postcss', 'autoprefixer']
    },
    {
      action: 'file',
      file: 'postcss.config.js',
      filecontent: 'export default {\n  plugins: {\n    "@tailwindcss/postcss": {},\n    autoprefixer: {},\n  },\n}'
    },
    {
      action: 'command',
      cmd: 'rm',
      args: ['src/App.css']
    },
    {
      action: 'file',
      file: 'src/index.css',
      filecontent: '@import "tailwindcss";'
    },
    {
      action: 'file',
      file: 'src/main.tsx',
      filecontent: `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)`
    },

    {
      action: 'file',
      file: 'src/App.tsx',
      filecontent: file
    },
    {
      action: 'file',
      file: 'vercel.json',
      filecontent: `{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}`
    },
    {
      action: 'command',
      cmd: 'npm',
      args: ['pkg', 'set', 'name=$(basename $PWD)']
    },
    {
      action: 'command',
      cmd: 'npm',
      args: ['pkg', 'set', 'scripts.stop=npx -y kill-port 5173']
    },
    {
      action: 'file',
      file: 'netlify.toml',
      filecontent: `[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200`
    },
    {
      action: 'file',
      file: 'render.yaml',
      filecontent: `services:
  - type: web
    name: vite-react-app
    env: static
    buildCommand: npm install && npm run build
    staticPublishPath: ./dist`
    },
    {
      action: 'command',
      cmd: 'npm',
      args: ['pkg', 'set', 'description=Vite React TS']
    },
    {
      action: 'command',
      cmd: 'npm',
      args: ['pkg', 'set', 'fontawesomeIcon=fab fa-react text-blue-500']
    }
  ]
};

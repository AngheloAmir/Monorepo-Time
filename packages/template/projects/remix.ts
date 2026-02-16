import type { ProjectTemplate } from "../../types";

export const Remix: ProjectTemplate = {
  name: 'Remix',
  description: 'Full stack web framework that lets you focus on the user interface',
  notes: "Node.js and NPM must be installed.",
  type: "app",
  category: "Project",
  icon: "fas fa-record-vinyl text-blue-500", // Generic icon, adjust if needed
  templating: [
    {
      action: 'command',
      cmd: 'rm -rf ./* ./.[!.]*', // Clean directory
      args: []
    },
    {
      action: 'command',
      cmd: 'npx',
      args: ['-y', 'create-react-router@latest', '.', '--yes', '--install', '--no-git-init', '--no-motion']
    },
    {
      action: 'command',
      cmd: 'npm',
      args: ['pkg', 'set', 'name=$(basename $PWD)']
    },
    {
        action: 'command',
        cmd: 'npm',
        args: ['pkg', 'set', 'description=Remix App']
    },
    {
        action: 'command',
        cmd: 'npm',
        args: ['pkg', 'set', 'fontawesomeIcon=fas fa-record-vinyl text-blue-500']
    }
  ]
};

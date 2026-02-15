import type { ProjectTemplate } from "../../types";

export const TanStackStart: ProjectTemplate = {
  name: 'TanStack Start',
  description: 'Pro-grade full-stack React framework',
  notes: "Node.js and NPM must be installed.",
  type: "app",
  category: "Project",
  icon: "fas fa-rocket text-red-500",
  templating: [
    {
      action: 'command',
      cmd: 'rm -rf ./* ./.[!.]*', // Clean directory
      args: []
    },
    {
      action: 'command',
      cmd: 'npx',
      args: ['-y', '@tanstack/cli', 'create', '.', '--package-manager', 'npm', '--toolchain', 'eslint', '--no-git']
    },
    {
      action: 'command',
      cmd: 'npm',
      args: ['install']
    },
    // The create command often installs dependencies, but let's be sure.
    // If it doesn't, we can add a step.
    // But usually 'npm create ...' runs npm install if package manager is specified.
    // Let's add standard pkg set commands.
    {
      action: 'command',
      cmd: 'npm',
      args: ['pkg', 'set', 'name=$(basename $PWD)']
    },
    {
        action: 'command',
        cmd: 'npm',
        args: ['pkg', 'set', 'description=TanStack Start App']
    },
    {
        action: 'command',
        cmd: 'npm',
        args: ['pkg', 'set', 'fontawesomeIcon=fas fa-rocket text-red-500']
    }
  ]
};

# MonoTime

[![npm version](https://badge.fury.io/js/monorepotime.svg)](https://badge.fury.io/js/monorepotime)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

**MonoTime** is a powerful monorepo management GUI tool that provides a modern, interactive web interface to manage, visualize, and control your monorepo workspaces. Stop wrestling with endless terminal tabs and get a clear overview of your project structure, scripts, and build tasks.

## Features

- **Visual Monorepo Management**: Intuitive GUI for managing multiple applications and packages
- **Template System**: Pre-built templates for common project types (React, Express, databases, tools)
- **Real-time Monitoring**: Simple live process monitoring and build status tracking
- **Docker Integration**: Simple container management and resource monitoring
- **Network Tools**: Simple tunnel management and network utilities
- **Built-in Code Editor**: Syntax highlighting and file editing capabilities
- **Terminal Integration**: Interactive terminal sessions with command history
- **API Testing**: Built-in CRUD tester for endpoint validation
- **Resource Monitoring**: CPU, memory, and process tracking
- **Modern UI**: Dark theme with responsive design using Tailwind CSS

## Quick Start

### Global Installation
If you have already using Turborepo, you can install Monorepotime globally:
```bash
npm install -g monorepotime
```

OR 

### Initialize in Your Project as Dev Dependency

```bash
npx monorepotime init
```

This will automatically:
1. Add Monorepotime to your `package.json` dependencies
2. Configure the necessary scripts

Your `package.json` will be updated with:

```json
{
  "packageManager": "npm@<your-package-manager-version>",
  "scripts": {
    "dev": "monorepotime"
  },
  "devDependencies": {
    "monorepotime": "^<latest-version>"
  }
}
```

### Running Monorepotime

```bash
npm run dev
```

Or if installed globally:

```bash
monorepotime
```

This will:
1. Start a local server on port 4793 (or next available port)
2. Open the dashboard in your default browser
3. Allow you to interact with your workspaces immediately

## Use Cases

### For Development Teams
- **Project Overview**: Get a bird's-eye view of all projects in your monorepo
- **Build Management**: Monitor build processes and dependencies
- **Resource Tracking**: Keep an eye on CPU and memory usage
- **Team Collaboration**: Shared workspace for project management

### For Solo Developers
- **Simplified Workflow**: Manage multiple projects from one interface
- **Quick Access**: Launch terminals and editors without switching contexts
- **Template Library**: Quickly scaffold new projects with best practices
- **Process Monitoring**: Track development processes without terminal clutter

### For DevOps Engineers
- **Container Management**: Monitor Docker containers and resource usage
- **Network Tools**: Manage Cloudflare tunnels and network configurations
- **API Testing**: Validate endpoints with built-in CRUD tester
- **Automation**: Script and automate common development tasks

## Configuration

MonoTime automatically detects your monorepo structure and works with:
- **Turborepo**: Native support for Turborepo configurations
- **npm workspaces**: Standard npm workspace configuration
- **Custom structures**: Flexible adaptation to various monorepo setups

## Web Interface

The MonoTime GUI provides:

- **Dashboard**: Overview of all projects and their status
- **Workspace Management**: Individual project configuration and control
- **Terminal Access**: Integrated terminal with command history
- **File Explorer**: Navigate and edit project files
- **Process Monitor**: Real-time resource usage tracking
- **Network Tools**: Docker and network utility management
- **Template Gallery**: Browse and apply project templates

## Distribution

MonoTime is distributed as an npm package and includes:
- Self-contained web interface
- No external dependencies for the GUI
- Cross-platform compatibility (Windows, macOS, Linux)
- Automatic port detection and configuration

## License

ISC © [Anghelo Amir](https://github.com/AngheloAmir/Monorepo-Time)

# Building Your Own Version of Opencode / Monorepo Time

Based on the analysis of the existing `MonoTime` architecture, here is a breakdown of the core components you need to understand to build your own version.

## Core Architecture

### 1. Backend (`apps/api`)
- **Role**: Core logic and orchestration.
- **Tech Stack**: Express, Socket.io.
- **Key Responsibilities**:
    - **Workspace Scanning**: `routes/workspace/scanworkspace.ts` - Locates projects within the monorepo.
    - **Terminal Management**: `routes/terminal/runcmddev.ts` - Executes shell commands.
    - **Opencode Management**: Manages instances of the AI coding assistant.
    - **Communication**: Serves the API and real-time updates via WebSockets.

### 2. Frontend (`apps/web`)
- **Role**: The Graphical User Interface (GUI).
- **Tech Stack**: React, Vite.
- **Key Responsibilities**:
    - Connects to the backend API (`http://localhost:4792`).
    - Visualizes the workspace structure.
    - Provides terminals and controls for running tasks.

### 3. Shared Definitions (`packages/api`)
- **Role**: Contract between Frontend and Backend.
- **Actual Name**: `apiroute` (in `package.json`).
- **Key Responsibilities**:
    - Defines route paths (e.g., `/workspace/list`) as constants.
    - Ensures the frontend and backend use the exact same endpoints, preventing typos and sync issues.

### 4. SDK (`packages/sdk`)
- **Role**: Client library for Opencode AI.
- **Key Responsibilities**:
    - Generated from an OpenAPI specification.
    - types and methods to communicate with the Opencode AI service.

## Implementation Guide

To replicate this tool, you should follow this pattern:

1.  **Scaffold a Monorepo**: Use TurboRepo or simple npm workspaces.
2.  **Create a Shared Package**: Define your API routes and shared types early to keep your Backend and Frontend consistent.
3.  **Build the Backend**: Start with a simple Express server that can execute shell commands (`execa` or `node-pty`) and serve them over WebSockets.
4.  **Build the Frontend**: Create a React app that connects to your backend and displays the output.

---
*Created based on analysis of the active `MonoTime` repository.*

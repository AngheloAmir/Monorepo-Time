# Agent Orchestration Recommendation

## Executive Summary
This document outlines a simplified architecture for implementing "Agent Orchestration" within the OpenCode environment. The goal is to allow users to spawn, manage, and interact with specialized AI agents (e.g., Code Reviewer, Security Auditor, Refactorer) alongside the standard OpenCode assistant.

## Core Concepts

### 1. The Agent Definition
An "Agent" is defined as a specialized configuration of the OpenCode CLI (or a separate CLI tool) designed for a specific task.

**Proposed Configuration Schema:**
```typescript
interface AgentConfig {
  id: string;
  name: string;          // e.g., "Security Auditor"
  description: string;   // e.g., "Scans dependencies and code for vulnerabilities"
  command: string;       // e.g., "opencode --mode=security" or "npm run security-check"
  icon: string;          // e.g., "fas fa-shield-alt"
  color: string;         // e.g., "text-red-500"
  env?: Record<string, string>; // Specialized environment variables
}
```

### 2. Orchestration UI (Frontend)
The "ReadyMessage" screen should evolve into an **Agent Launchpad**.

- **Selection Grid**: Instead of a single "Launch" button, present a grid of available agents.
- **Multi-instancing**: Allow users to launch multiple agents in separate tabs (already supported by the Tab system).
- **Context Injection**: Allow users to drag-and-drop folders/files onto an agent card to launch the agent *with that specific context*.

### 3. Session Management (Backend)
The backend (`opencodeTerminal.ts`) is currently generic. To support orchestration:
- **Session Tagging**: When starting a terminal, pass an `agentId` to track which agent is running.
- **Lifecycle Hooks**: Allow agents to emit custom events (e.g., `agent:status`, `agent:result`) that the UI can parse and display (e.g., showing a progress bar or a "Vulnerabilities Found" badge on the tab).

## Implementation Plan

### Phase 1: Visual Orchestration (Frontend Only)
*Objective: Update the UI to support selecting different agents.*

1.  **Modify `ReadyMessage.tsx`**:
    -   Add a state for `selectedAgent`.
    -   Render a list of "Built-in Agents" (Standard, Review, Debug).
    -   Update the "Launch" button to execute the command associated with the selected agent.

### Phase 2: Configuration & Extensibility
*Objective: Allow defining agents via config.*

1.  Create `opencode-agents.json` in the workspace root.
2.  Read this config in the backend and serve it to `ReadyMessage`.

### Phase 3: Inter-Agent Communication (Advanced)
*Objective: Allow agents to talk to each other.*

1.  Implement a local message bus (via Socket.io) where Agent A can emit processing results, and Agent B (or the UI) can react.

## Proposed "Built-in" Agents

| Agent Name | Command | Description |
| :--- | :--- | :--- |
| **OpenCode Standard** | `opencode` | The general-purpose coding assistant. |
| **Code Reviewer** | `opencode review` | Analyzes generic code style and logic issues. |
| **Test Generator** | `opencode test` | Generates unit tests for the current context. |
| **Manual Terminal** | `bash` / `zsh` | Standard system shell. |

---

## Immediate Next Steps (Proof of Concept)
I will implement **Phase 1** immediately:
1.  Refactor `ReadyMessage.tsx` to include an "Agent Selector".
2.  Mock existing agents to demonstrate the flow.

# OpenCode Server API Documentation

A comprehensive guide to the OpenCode Server HTTP API.

## Overview

The OpenCode Server provides a RESTful HTTP API that allows you to interact with OpenCode programmatically. The server follows the OpenAPI 3.1.1 specification.

**Base URL:** `http://localhost:4096`  
**WebSocket for PTY:** `ws://localhost:4096`  
**API Version:** 0.0.3

---

## Quick Start

### Starting the Server

```bash
# Start the server with default settings
opencode serve

# Specify custom port
opencode serve --port 4096

# Allow external access
opencode serve --hostname 0.0.0.0

# Enable mDNS for local network discovery
opencode serve --mdns
```

### Authentication

Protect your server with basic auth:

```bash
OPENCODE_SERVER_PASSWORD=your-password opencode serve
```

---

## Endpoints Reference

### Global Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/global/health` | Server health & version |
| GET | `/global/event` | Server-sent events stream |
| GET | `/global/config` | Get global configuration |
| PATCH | `/global/config` | Update global configuration |
| POST | `/global/dispose` | Dispose all instances |

#### GET /global/health

Returns server health status.

**Response:**
```json
{
  "healthy": true,
  "version": "1.2.3"
}
```

---

### Project Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/project` | List all projects |
| GET | `/project/current` | Get current project |
| PATCH | `/project/{projectID}` | Update project |

#### GET /project

Query parameters:
- `directory` (optional) - Filter by project directory

**Response:** `Project[]`

---

### Configuration Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/config` | Get project config |
| PATCH | `/config` | Update project config |
| GET | `/config/providers` | Get providers & defaults |

#### GET /config

Query parameters:
- `directory` (optional) - Project directory

Returns the full OpenCode configuration including model, agents, tools, and MCP settings.

#### GET /config/providers

Returns available providers and their default models.

**Response:**
```json
{
  "providers": [
    {
      "id": "anthropic",
      "name": "Anthropic",
      "models": [
        { "id": "claude-sonnet-4-5", "name": "Claude Sonnet 4.5" }
      ]
    }
  ],
  "default": {
    "anthropic": "claude-sonnet-4-5"
  }
}
```

---

### Provider Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/provider` | List all providers |
| GET | `/provider/auth` | Get auth methods |
| POST | `/provider/{id}/oauth/authorize` | Start OAuth |
| POST | `/provider/{id}/oauth/callback` | OAuth callback |
| PUT | `/auth/{providerID}` | Set API key |
| DELETE | `/auth/{providerID}` | Remove API key |

#### GET /provider

Returns all available providers with connection status.

**Response:**
```json
{
  "all": [
    {
      "id": "anthropic",
      "name": "Anthropic",
      "connected": true
    }
  ],
  "default": { "providerID": "modelID" },
  "connected": ["anthropic"]
}
```

#### PUT /auth/{providerID}

Set API key for a provider.

**Request body:**
```json
{
  "apiKey": "sk-ant-..."
}
```

---

### Agent Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/agent` | List all agents |

#### GET /agent

Returns all available agents (build, plan, and custom).

**Response:**
```json
[
  {
    "id": "build",
    "name": "Build",
    "description": "Full development agent"
  },
  {
    "id": "plan", 
    "name": "Plan",
    "description": "Planning and analysis agent"
  }
]
```

---

### Session Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/session` | List all sessions |
| POST | `/session` | Create new session |
| GET | `/session/status` | Get all session statuses |
| GET | `/session/{id}` | Get session details |
| DELETE | `/session/{id}` | Delete session |
| PATCH | `/session/{id}` | Update session |
| GET | `/session/{id}/children` | Get child sessions |
| GET | `/session/{id}/todo` | Get todo list |
| POST | `/session/{id}/init` | Create AGENTS.md |
| POST | `/session/{id}/fork` | Fork session |
| POST | `/session/{id}/abort` | Abort running session |
| POST | `/session/{id}/share` | Share session |
| DELETE | `/session/{id}/share` | Unshare session |
| GET | `/session/{id}/diff` | Get file changes |
| POST | `/session/{id}/summarize` | Summarize session |

#### POST /session

Create a new session.

**Request body:**
```json
{
  "parentID": "ses_abc123",
  "title": "My Session"
}
```

**Response:** `Session` object

#### POST /session/{id}/message

Send a message to a session and get AI response.

**Request body:**
```json
{
  "parts": [
    { "type": "text", "text": "Hello, help me with this code" }
  ],
  "agent": "build",
  "model": "anthropic/claude-sonnet-4-5",
  "reasoningEffort": "medium"
}
```

**Response:**
```json
{
  "info": {
    "id": "msg_xyz789",
    "role": "assistant",
    "model": "anthropic/claude-sonnet-4-5"
  },
  "parts": [
    { "type": "text", "text": "I'd be happy to help!" }
  ]
}
```

#### GET /session/{id}/message

Get all messages in a session.

Query parameters:
- `limit` (optional) - Max messages to return

#### POST /session/{id}/abort

Abort an active session that is currently processing.

---

### Message Part Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/session/{id}/message/{msgID}` | Get specific message |
| DELETE | `/session/{id}/message/{msgID}/part/{partID}` | Delete message part |
| PATCH | `/session/{id}/message/{msgID}/part/{partID}` | Update message part |
| POST | `/session/{id}/revert` | Revert a message |
| POST | `/session/{id}/unrevert` | Restore reverted messages |

---

### Shell & Command Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/session/{id}/command` | Execute slash command |
| POST | `/session/{id}/shell` | Run shell command |

#### POST /session/{id}/shell

Execute a shell command and get AI response.

**Request body:**
```json
{
  "command": "ls -la",
  "agent": "build",
  "model": "anthropic/claude-sonnet-4-5"
}
```

---

### PTY (Terminal) Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/pty` | List all PTY sessions |
| POST | `/pty` | Create new PTY |
| GET | `/pty/{id}` | Get PTY details |
| PUT | `/pty/{id}` | Update PTY |
| DELETE | `/pty/{id}` | Delete PTY |
| GET | `/pty/{id}/connect` | WebSocket connect |

#### POST /pty

Create a new pseudo-terminal session.

**Request body:**
```json
{
  "command": "bash",
  "args": ["-l"],
  "cwd": "/home/user/project",
  "title": "Main Terminal",
  "env": { "TERM": "xterm-256color" }
}
```

**Response:** `Pty` object

#### WebSocket Connection

Connect to a PTY via WebSocket:
```
ws://localhost:4096/pty/{ptyID}/connect?directory=/path/to/project
```

---

### File Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/file` | List files in directory |
| GET | `/file/content` | Read file content |
| GET | `/file/status` | Git file status |

#### GET /file

Query parameters:
- `path` (required) - Directory path

**Response:** `FileNode[]`

#### GET /file/content

Query parameters:
- `path` (required) - File path

**Response:**
```json
{
  "content": "file contents...",
  "encoding": "utf-8",
  "size": 1234
}
```

---

### Search Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/find` | Search text in files |
| GET | `/find/file` | Find files by name |
| GET | `/find/symbol` | Find LSP symbols |

#### GET /find

Query parameters:
- `pattern` (required) - Search regex pattern
- `directory` (optional) - Project directory

#### GET /find/file

Query parameters:
- `query` (required) - Search query
- `type` (optional) - "file" or "directory"
- `limit` (optional) - Max results

---

### MCP (Model Context Protocol) Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/mcp` | Get MCP server status |
| POST | `/mcp` | Add MCP server |
| POST | `/mcp/{name}/connect` | Connect MCP server |
| POST | `/mcp/{name}/disconnect` | Disconnect MCP server |
| DELETE | `/mcp/{name}/oauth` | Remove OAuth |

---

### Permission Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/permission` | List pending permissions |
| POST | `/session/{id}/permissions/{permID}` | Respond to permission |
| POST | `/permission/{reqID}/reply` | Reply to permission |

#### POST /session/{id}/permissions/{permID}

**Request body:**
```json
{
  "response": "once"  // or "always" or "reject"
}
```

---

### TUI Endpoints

Control the Terminal User Interface programmatically.

| Method | Path | Description |
|--------|------|-------------|
| POST | `/tui/append-prompt` | Append text to prompt |
| POST | `/tui/open-help` | Open help dialog |
| POST | `/tui/open-sessions` | Open session selector |
| POST | `/tui/open-themes` | Open theme selector |
| POST | `/tui/open-models` | Open model selector |
| POST | `/tui/submit-prompt` | Submit current prompt |
| POST | `/tui/clear-prompt` | Clear the prompt |
| POST | `/tui/execute-command` | Execute TUI command |
| POST | `/tui/show-toast` | Show toast notification |

---

### Event Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/event` | SSE event stream |

Subscribe to server events including permission requests, questions, and session updates.

---

### Experimental Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/experimental/tool/ids` | List tool IDs |
| GET | `/experimental/tool` | Get tool schemas |
| POST | `/experimental/worktree` | Create worktree |
| GET | `/experimental/worktree` | List worktrees |
| DELETE | `/experimental/worktree` | Remove worktree |
| GET | `/experimental/resource` | Get MCP resources |

---

## Common Use Cases

### Getting the Current Model

```bash
# From config
curl "http://localhost:4096/config?directory=$PWD" | jq '.model'

# From provider config
curl "http://localhost:4096/config/providers?directory=$PWD"
```

### Sending a Chat Message

```bash
# Create session and send message
SESSION=$(curl -s -X POST "http://localhost:4096/session?directory=$PWD" \
  -H "Content-Type: application/json" \
  -d '{}' | jq -r '.id')

curl -X POST "http://localhost:4096/session/$SESSION/message?directory=$PWD" \
  -H "Content-Type: application/json" \
  -d '{
    "parts": [{"type": "text", "text": "Hello!"}],
    "agent": "build"
  }'
```

### Connecting a Provider

```bash
curl -X PUT "http://localhost:4096/auth/anthropic" \
  -H "Content-Type: application/json" \
  -d '{"apiKey": "sk-ant-your-key-here"}'
```

### Listing Available Models

```bash
curl "http://localhost:4096/config/providers?directory=$PWD" | jq '.providers[].models[]'
```

### Reading a File

```bash
curl "http://localhost:4096/file/content?path=/path/to/file.ts&directory=$PWD"
```

---

## OpenAPI Specification

View the full OpenAPI spec at:

```
http://localhost:4096/doc
```

This provides an interactive Swagger UI to explore all endpoints and try them out.

---

## Error Responses

All endpoints may return:

| Status | Description |
|--------|-------------|
| 200 | Success |
| 400 | Bad Request |
| 404 | Not Found |
| 500 | Server Error |

**Error response format:**
```json
{
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

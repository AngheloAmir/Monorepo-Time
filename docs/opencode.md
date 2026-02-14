# 🚀 OpenCode Mastery: CLI & SDK Tutorial

OpenCode is a powerful, open-source AI coding assistant designed to live where you work. Whether you're in the terminal, your IDE, or building custom AI-powered tools, OpenCode provides the infrastructure to automate development workflows seamlessly.

This tutorial covers everything from basic CLI usage to advanced programmatic integration using the OpenCode SDK.

---

## 🛠 1. Installation

Getting started with OpenCode is simple. You can install the CLI globally or the SDK as a project dependency.

### Install CLI (Global)
Choose your preferred package manager:

```bash
# via npm
npm install -g opencode-ai

# via bun
bun add -g opencode-ai

# via script (Linux/macOS)
curl -fsSL https://opencode.ai/install.sh | sh
```

### Install SDK (Library)
Add the SDK to your project:

```bash
npm install @opencode-ai/sdk
# or
yarn add @opencode-ai/sdk
```

---

## 💻 2. OpenCode CLI Deep Dive

The CLI is the quickest way to interact with OpenCode. It offers both a Terminal User Interface (TUI) and a Web interface.

### The Terminal Interface
To start the interactive TUI:
```bash
opencode
```
- **Plan Mode**: Analyze code and plan changes without modifying files.
- **Build Mode**: Let the AI write and apply code directly to your files.

### The Web Interface (`opencode web`)
If you prefer a graphical interface or want to host OpenCode for a local network:
```bash
opencode web
```
By default, this starts a server on a random port and opens it in your browser.

**Customizing the Web Server:**
```bash
# Specify a port
opencode web --port 4096

# Access from other devices on the LAN
opencode web --hostname 0.0.0.0

# Enable mDNS (Access via opencode.local)
opencode web --mdns
```

### Quick Commands
- `opencode "how do I fix this bug?"`: Quick one-off query.
- `opencode run "refactor this file"`: Programmatic execution.
- `/init`: Run this inside a project to let OpenCode index your codebase.

---

## 🧩 3. Programmatic Power: The SDK

The `@opencode-ai/sdk` allows you to embed OpenCode's intelligence directly into your own applications.

### Starting an OpenCode Server
You can start a headless OpenCode instance programmatically:

```typescript
import { createOpencode } from "@opencode-ai/sdk";

const opencode = await createOpencode({
  hostname: "127.0.0.1",
  port: 4096,
  config: {
    model: "claude-3-5-sonnet-latest", // Set preferred model
  },
});

console.log(`OpenCode server running at: ${opencode.server.url}`);
```

### Connecting with the Client
Once a server is running (either via CLI or SDK), you can connect to it:

```typescript
import { createOpencodeClient } from "@opencode-ai/sdk";

const client = createOpencodeClient({
  baseUrl: "http://127.0.0.1:4096",
});

// Create a new chat session
const session = await client.session.create();
const sessionId = session.data.id;

// Send a message
const response = await client.chat.send({
  sessionId,
  message: "Explain the current project structure.",
});

console.log("AI Response:", response.data.content);
```

---

## ⚙️ 4. Configuration (`opencode.json`)

OpenCode looks for configuration in two primary locations:
1. **Global Configuration**: `~/.config/opencode/opencode.json` (Used for API keys and default models).
2. **Project Configuration**: `./opencode.json` in your project root (Used for project-specific agents and rules).

> **Note**: If the global directory or file does not exist, you can create it manually:
> ```bash
> mkdir -p ~/.config/opencode
> touch ~/.config/opencode/opencode.json
> ```

**Example `opencode.json`:**
```json
{
  "model": "gpt-4o",
  "temperature": 0.7,
  "server": {
    "port": 4096,
    "hostname": "127.0.0.1"
  },
  "providers": {
    "openai": {
      "apiKey": "sk-..."
    }
  }
}
```

---

## 🚀 5. Mastering Agents & Skills

OpenCode isn't just a chatbot; it's an **Agent**. You can extend its capabilities using **Skills**.

- **Workflow Skills**: Define multi-step processes in `.agent/workflows/`.
- **Command Skills**: Add custom commands to the CLI.

Run `/init` to see how OpenCode generates `AGENTS.md` and `SKILLS.md` to map out your project's architecture for the AI.

---

## � 6. Authentication & Environment Variables

When hosting `opencode web` on a network, you should protect it with a password.

| Variable | Description |
| :--- | :--- |
| `OPENCODE_SERVER_PASSWORD` | Password for the web interface (Username is `opencode`). |
| `OPENCODE_SERVER_USERNAME` | Custom username for the web interface. |
| `ANTHROPIC_API_KEY` | Your Anthropic API key. |
| `OPENAI_API_KEY` | Your OpenAI API key. |
| `GOOGLE_API_KEY` | Your Google (Gemini) API key. |

**Example starting with password:**
```bash
OPENCODE_SERVER_PASSWORD=mypassword opencode web --hostname 0.0.0.0
```

---

## 🗄️ 7. Multi-Platform Compatibility (Config & State)

To make your tool multi-platform, you need to account for how OpenCode handles paths differently across OSs.

### Configuration Path (`opencode.json`)
By default, the CLI and SDK look for the **global** config in:
- **Linux**: `~/.config/opencode/opencode.json`
- **macOS**: `~/Library/Application Support/opencode/opencode.json`
- **Windows**: `%APPDATA%\opencode\opencode.json`

### Data & Persistence Path
OpenCode persists session history and authentication tokens in:
- **Linux**: `~/.local/share/opencode/`
- **macOS**: `~/Library/Application Support/opencode/`
- **Windows**: `%LOCALAPPDATA%\opencode\`

### Cross-Platform Path Handling (Node.js)
When building your tool, you can resolve these paths dynamically:

```typescript
import os from 'os';
import path from 'path';

function getOpenCodeDataDir() {
  const platform = os.platform();
  const home = os.homedir();

  if (platform === 'win32') {
    return path.join(process.env.LOCALAPPDATA || path.join(home, 'AppData', 'Local'), 'opencode');
  } else if (platform === 'darwin') {
    return path.join(home, 'Library', 'Application Support', 'opencode');
  } else {
    // Linux and others
    return process.env.XDG_DATA_HOME ? 
           path.join(process.env.XDG_DATA_HOME, 'opencode') : 
           path.join(home, '.local', 'share', 'opencode');
  }
}
```


---

## �💡 Pro Tips
- **Force Kill**: If a port is stuck, use `npx kill-port 4096`.
- **Context is King**: Always use `/init` in large projects to improve answer accuracy.
- **Auto-Discovery**: Use `--mdns` so you can access your server at `http://opencode.local` without remembering IP addresses.

---

*For more messy (but official) details, visit [docs.opencode.ai](https://docs.opencode.ai).*

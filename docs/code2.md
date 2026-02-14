http://localhost:4096/doc

Here's the complete list of all `/4096` API endpoints:

## Quick Answer: Get Last Used Model

Use these endpoints:
- **`GET /config`** - Returns full config including `model` field
- **`GET /config/providers`** - Returns `{ providers, default: { ... } }` with default model per provider

---

## All Endpoints

### Global
| Method | Path | Description |
|--------|------|-------------|
| GET | `/global/health` | Server health & version |
| GET | `/global/event` | SSE event stream |

### Config
| Method | Path | Description |
|--------|------|-------------|
| GET | `/config` | Full config (includes `model`) |
| PATCH | `/config` | Update config |
| GET | `/config/providers` | Providers + default models |

### Provider
| Method | Path | Description |
|--------|------|-------------|
| GET | `/provider` | All providers, default, connected |
| GET | `/provider/auth` | Auth methods per provider |

### Sessions
| Method | Path | Description |
|--------|------|-------------|
| GET | `/session` | List all sessions |
| POST | `/session` | Create new session |
| GET | `/session/:id` | Get session details |

### Messages
| Method | Path | Description |
|--------|------|-------------|
| GET | `/session/:id/message` | List messages |
| POST | `/session/:id/message` | Send message (use `model` param) |

### Files
| Method | Path | Description |
|--------|------|-------------|
| GET | `/file?path=<path>` | List files |
| GET | `/file/content?path=<p>` | Read file |

### Agents
| Method | Path | Description |
|--------|------|-------------|
| GET | `/agent` | List all agents |

---

To see the full OpenAPI spec with all types, visit: `http://localhost:4096/doc`




curl -s "http://localhost:4096/config?directory=$PWD" | jq '.model'

Note: The token usage percentage is simulated (random). To get real token usage, you would need to fetch session stats from the API after each message.
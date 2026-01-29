export const dockerCompose = `services:
  n8n:
    image: n8nio/n8n:latest
    pull_policy: if_not_present
    restart: unless-stopped
    user: "1000:1000"
    environment:
      - N8N_BASIC_AUTH_ACTIVE=true
      - N8N_BASIC_AUTH_USER=admin
      - N8N_BASIC_AUTH_PASSWORD=admin
      - N8N_HOST=localhost
      - N8N_PORT=5678
      - N8N_PROTOCOL=http
      - WEBHOOK_URL=http://localhost:5678/
    ports:
      - "5678:5678"
    volumes:
      - ./n8n-data:/home/node/.n8n
    healthcheck:
      test: ["CMD-SHELL", "wget --spider -q http://localhost:5678/healthz || exit 1"]
      interval: 10s
      timeout: 5s
      retries: 5`;

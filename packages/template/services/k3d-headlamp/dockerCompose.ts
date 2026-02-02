export const dockerCompose = `# K3d + Headlamp Docker Compose Configuration
# This file sets up Headlamp to connect to a k3d cluster
# Note: k3d cluster is managed separately via k3d CLI

services:
  headlamp:
    image: ghcr.io/headlamp-k8s/headlamp:latest
    pull_policy: if_not_present
    restart: unless-stopped
    user: "\${UID:-1000}:\${GID:-1000}"
    ports:
      - "7000:4466"
    extra_hosts:
      - "host.k3d.internal:host-gateway"
    volumes:
      - ./.kube/config:/home/headlamp/.kube/config:ro      
      - ./.headlamp_data:/home/headlamp/data
    environment:
      - HEADLAMP_CONFIG_CONF_MAX_CONNECTIONS=1000
      - HEADLAMP_CONFIG_ENABLE_DYNAMIC_CLUSTERS=true
      - HOME=/home/headlamp
    command:
      - "-in-cluster=false"
      - "-kubeconfig=/home/headlamp/.kube/config"
      - "-enable-dynamic-clusters"
    healthcheck:
      test: ["CMD-SHELL", "wget --spider -q http://localhost:4466/ || exit 1"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  headlamp_data:`;

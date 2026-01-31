export const dockerfile = `FROM node:20-slim

# Install required tools
RUN apt-get update && apt-get install -y \\
    git \\
    curl \\
    && rm -rf /var/lib/apt/lists/*

# Install pnpm globally - download it NOW during build, not at runtime
RUN corepack enable && corepack prepare pnpm@9.14.4 --activate
# Verify pnpm is installed
RUN pnpm --version

WORKDIR /app

# Copy entrypoint script
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 5173

ENTRYPOINT ["/entrypoint.sh"]`;


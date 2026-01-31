export const entrypoint = `#!/bin/bash

cd /app

echo "==================================================="
echo "Webstudio Development Environment"
echo "==================================================="

# Check if webstudio directory has a valid git repo
if [ -d "/app/webstudio/.git" ]; then
    echo "Webstudio repository found. Using existing code..."
    cd /app/webstudio
else
    # Remove any partial/corrupted directory and clone fresh
    echo "Cloning Webstudio repository..."
    echo "This may take a few minutes..."
    rm -rf /app/webstudio 2>/dev/null || true
    
    if ! git clone --depth 1 https://github.com/webstudio-is/webstudio.git /app/webstudio; then
        echo "ERROR: Failed to clone repository!"
        echo "Sleeping to prevent restart loop..."
        sleep 3600
        exit 1
    fi
    cd /app/webstudio
fi

# Create .env.development for dev login
echo "Setting up dev environment..."
mkdir -p apps/builder
cat > apps/builder/.env.development << 'ENVEOF'
DEV_LOGIN=true
AUTH_SECRET=webstudio-dev-secret-key-12345
ENVEOF

# Patch vite.config.ts to disable HTTPS and use localhost
echo "Patching Vite config for HTTP mode..."
cat > apps/builder/vite.config.ts << 'VITEEOF'
import path, { resolve } from "node:path";
import { defineConfig } from "vite";
import { vitePlugin as remix } from "@remix-run/dev";
import { existsSync } from "node:fs";
import fg from "fast-glob";

const rootDir = ["..", "../..", "../../.."]
  .map((dir) => path.join(__dirname, dir))
  .find((dir) => existsSync(path.join(dir, ".git")));

const hasPrivateFolders =
  fg.sync([path.join(rootDir ?? "", "packages/*/private-src/*")], {
    ignore: ["**/node_modules/**"],
  }).length > 0;

const conditions = hasPrivateFolders
  ? ["webstudio-private", "webstudio"]
  : ["webstudio"];

export default defineConfig(({ mode }) => {
  return {
    plugins: [
      remix({
        future: {
          v3_lazyRouteDiscovery: false,
          v3_relativeSplatPath: false,
          v3_singleFetch: false,
          v3_fetcherPersist: false,
          v3_throwAbortReason: false,
        },
      }),
    ],
    resolve: {
      conditions: [...conditions, "browser", "development|production"],
      alias: [
        {
          find: "~",
          replacement: resolve("app"),
        },
        {
          find: "@supabase/node-fetch",
          replacement: resolve("./app/shared/empty.ts"),
        },
      ],
    },
    ssr: {
      resolve: {
        conditions: [...conditions, "node", "development|production"],
      },
    },
    define: {
      "process.env.NODE_ENV": JSON.stringify(mode),
    },
    server: {
      host: "0.0.0.0",
      port: 5173,
      // No HTTPS - plain HTTP for local development
    },
    envPrefix: "GITHUB_",
  };
});
VITEEOF

# Install dependencies with verbose output
echo "==================================================="
echo "Installing dependencies with pnpm..."
echo "This will take a few minutes..."
echo "==================================================="
echo ""

# Use append-only reporter for better progress visibility in Docker
export TERM=xterm-256color
export FORCE_COLOR=1

if ! pnpm install --reporter=append-only; then
    echo "ERROR: Failed to install dependencies!"
    echo "Sleeping to prevent restart loop..."
    sleep 3600
    exit 1
fi

echo ""
echo "==================================================="
echo "Starting Webstudio development server..."
echo "==================================================="
echo ""
echo "URL: http://localhost:5173"
echo ""
echo "Dev Login Instructions:"
echo "  1. Click 'Login with Secret' button"
echo "  2. Enter: webstudio-dev-secret-key-12345"
echo ""
echo "To login as different user:"
echo "  Use: webstudio-dev-secret-key-12345:email@example.com"
echo "==================================================="
echo ""

# Run dev server - this should keep running
exec pnpm dev
`;

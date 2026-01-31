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

# Install dependencies
echo "==================================================="
echo "Installing dependencies with pnpm..."
echo "This may take several minutes on first run..."
echo "==================================================="

if ! pnpm install; then
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


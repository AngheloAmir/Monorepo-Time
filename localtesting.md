# Local Testing Guide for monorepotime

This guide explains how to test the `monorepotime` npm package locally before publishing to npmjs. This helps avoid multiple publishes just to fix small mistakes.

---

## Prerequisites

Make sure you have built both the frontend and API:

```bash
# Build the frontend first
cd apps/web
npm run build

# Copy frontend to API public folder and build API
cd ../api
npm run predep
npm run build
```

---

## Method 1: npm link (Recommended for Development)

This creates a global symlink to your local package, so `npx monorepotime` uses your local version.

### Setup (one-time)

```bash
cd apps/api
npm link
```

### Test

```bash
# Go to any test directory
mkdir -p .test-local/my-test && cd .test-local/my-test
npm init -y

# Run your local package
npx monorepotime
```

### After making changes

```bash
# Rebuild the API
cd apps/api
npm run build

# Test again - no need to re-link
npx monorepotime
```

### Cleanup

```bash
npm unlink -g monorepotime
```

---

## Method 2: npm pack (Best for Final Validation)

This creates a tarball exactly like `npm publish` would, so you can test the exact package that would be uploaded.

### Create the tarball

```bash
cd apps/api
npm run predep
npm run build
npm pack

# This creates: monorepotime-X.X.X.tgz
```

### Inspect the tarball contents

```bash
# See what files will be published
tar -tzf monorepotime-*.tgz

# Expected output:
# package/dist/index.js
# package/package.json
# package/public/...
# package/README.md
```

### Install and test from tarball

```bash
# In a test project
cd .test-local/my-test
npm install ../../apps/api/monorepotime-*.tgz
npx monorepotime
```

---

## Method 3: Direct Node Execution (Quick Testing)

Run the built file directly without npm:

```bash
cd apps/api
npm run build

# Run directly
node dist/index.js
```

---

## Testing Templates

To test if templates work correctly:

### Via curl (API call)

```bash
# Start the server
npx monorepotime &

# Wait for server to start, then apply a template
curl -X POST http://localhost:4793/setworkspacetemplate \
  -H "Content-Type: application/json" \
  -d '{
    "workspace": {"path": "/absolute/path/to/test-folder"},
    "templatename": "Express.js TS"
  }'

# Stop the server
pkill -f "node.*monorepotime"
```

### Via the Web UI

1. Run `npx monorepotime`
2. Open http://localhost:4793
3. Create a new workspace
4. Apply a template through the UI

---

## Quick Test Script

Create this script in the project root as `test-local.sh`:

```bash
#!/bin/bash
set -e

echo "🔨 Building web..."
cd apps/web && npm run build

echo "📦 Building API..."
cd ../api
npm run predep
npm run build

echo "🔗 Linking package..."
npm link

echo "✅ Ready! Run 'npx monorepotime' from any directory"
```

Make it executable:
```bash
chmod +x test-local.sh
```

---

## Checklist Before Publishing

- [ ] `npm run build` succeeds in `apps/web`
- [ ] `npm run predep` succeeds in `apps/api`
- [ ] `npm run build` succeeds in `apps/api`
- [ ] `npm pack` creates tarball without errors
- [ ] `tar -tzf monorepotime-*.tgz` shows expected files
- [ ] `npx monorepotime` starts the server
- [ ] Templates can be applied without errors
- [ ] Web UI loads correctly at http://localhost:4793

---

## Common Issues

### "Command not found" after npm link

```bash
# Ensure the link was created
npm list -g monorepotime

# If not found, re-link
cd apps/api && npm link
```

### Old version still running

```bash
# Kill any running instances
npx kill-port 4793
```

### Changes not reflected

```bash
# Make sure you rebuilt after changes
cd apps/api && npm run build
```

### Package.json missing files

Check the `files` array in `apps/api/package.json`:
```json
{
  "files": ["dist", "public"]
}
```

---

## Publish Commands

When you're confident the package works:

```bash
cd apps/api

# For stable release
npm publish --access public

# For beta testing
npm publish --access public --tag beta
```

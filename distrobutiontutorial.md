# Distribution Tutorial: Publishing Your GUI Tool

This guide explains how to bundle your React frontend and Express backend into a single executable CLI tool that can be distributed via npm.

## 1. Prepare the Build Process

We need to ensure that when we publish the package, it contains both the compiled backend code and the static frontend assets.

### Step 1.1: Modify `apps/api/package.json`
We need to tell the API package (which will be our main distribution package) how to behave.

Update `apps/api/package.json`:
1.  Add a `bin` entry to make it a CLI executable.
2.  Add a `files` array to specify what gets uploaded to npm.
3.  Add a `prepublishOnly` script to ensure everything is built before publishing.

Example `apps/api/package.json` updates:
```json
{
  "name": "your-tool-name", // Unique name on npm
  "version": "1.0.0",
  "bin": {
    "your-tool-name": "./dist/index.js"
  },
  "files": [
    "dist",
    "public"
  ],
  "scripts": {
    "build": "tsc",
    "prepublishOnly": "npm run build && npm run copy-frontend"
  }
}
```

### Step 1.2: Serve Frontend from Backend
Modify `apps/api/src/index.ts` to serve the static frontend files when running in production.

```typescript
import express from 'express';
import cors from 'cors';
import path from 'path';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

// Serve API routes normally
app.get('/api/status', (req, res) => {
  res.json({ status: 'running' });
});

// Serve frontend static files
const frontendPath = path.join(__dirname, '../public');
app.use(express.static(frontendPath));

// Fallback for SPA routing (React Router, etc.)
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

app.listen(port, () => {
  console.log(`Tool running at http://localhost:${port}`);
});
```

### Step 1.3: Automate Moving Frontend Files
We need a way to move the built frontend (`apps/web/dist`) into the backend folder (`apps/api/public`) so it can be served.

In `turbo.json`, update the build pipeline to ensure `web` builds before `api` or simply rely on a script.

A better way is to add a script in `apps/api/package.json`:
```json
"scripts": {
  "copy-frontend": "rm -rf public && mkdir -p public && cp -r ../web/dist/* public/"
}
```

## 2. Build the Project

From the root specificially, you can run the full build pipeline:

```bash
# 1. Build the frontend (web)
npm run build -w apps/web

# 2. Build the backend (api)
npm run build -w apps/api

# 3. Copy frontend assets to backend
# (Assuming you added the script from Step 1.3)
npm run copy-frontend -w apps/api
```

Or if you configured `turbo` correctly, simply:
```bash
npx turbo build
```

## 1.5 Critical Extras

### A. The "Shebang" (Required)
For your tool to actually run as a script in the terminal, the entry file (`apps/api/src/index.ts`) **MUST** start with a "shebang" line. This tells the system to use Node.js to execute the file.

Add this as the very first line of `apps/api/src/index.ts`:
```typescript
#!/usr/bin/env node
import express from 'express';
// ... rest of your code
```

### B. Auto-Open Browser (Recommended for UX)
Since this is a GUI tool, you should automatically open the browser when the user runs the command.
1. Install the `open` package in `apps/api`:
   ```bash
   npm install open
   ```
2. Update `apps/api/src/index.ts`:
   ```typescript
   import open from 'open';
   // ... after app.listen
   app.listen(port, async () => {
     console.log(`Tool running at http://localhost:${port}`);
     await open(`http://localhost:${port}`);
   });
   ```

### C. Cross-Platform Scripts (Windows Support)
The `rm -rf` and `cp` commands used in Step 1.3 won't work on Windows. For a shared project, use `shx`:
1. Install `shx` as a dev dependency:
   ```bash
   npm install -D shx -w apps/api
   ```
2. Update the script:
   ```json
   "copy-frontend": "shx rm -rf public && shx mkdir -p public && shx cp -r ../web/dist/* public/"
   ```

## 3. Testing Locally

Before publishing, test if the global installation works on your machine.

```bash
cd apps/api
npm link
```
Now you can run `your-tool-name` in any terminal to see if it starts effectively.

## 4. Publishing to NPM

### Step 4.1: Login to NPM
If you haven't already:
```bash
npm login
```

### Step 4.2: Publish
Navigate to the package meant for distribution (the API package):

```bash
cd apps/api
npm publish --access public
```

(Note: If this is a scoped package like `@username/tool`, you must use `--access public`).

## 5. Usage

Once published, users can run your tool directly without installing it globally using `npx`:

```bash
npx your-tool-name
```
Or install it globally:
```bash
npm install -g your-tool-name
your-tool-name
```

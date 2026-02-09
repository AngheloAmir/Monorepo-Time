# Monorepo Time 

test1

This is a monorepo workspace for a GUI tool distributed via npm.

## Structure

- **apps/web**: Frontend (Vite + React + Tailwind + Radix UI + TypeScript).
- **apps/api**: Backend/CLI (Express + TypeScript + Nodemon).

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start development server:
   ```bash
   npx turbo dev
   ```
   This will start both the frontend and backend in watch mode.
   - Frontend: http://localhost:5173
   - Backend: http://localhost:3000

3. Build for distribution:
   ```bash
   npx turbo build
   ```

## Distribution

To prepare this for distribution as an npm package:
1. Ensure the `build` task copies the `apps/web/dist` folder to `apps/api/public` (or similar).
2. Configure `apps/api` to serve static files from that folder in production mode.
3. Publish `apps/api` (or a dedicated `packages/cli`) as your npm package.

## Demo
![Architecture](./docs/preview1.jpg)
![Architecture](./docs/preview2.jpg)
![Architecture](./docs/preview3.jpg)
# AGENTS.md

This file contains guidelines and commands for agentic coding agents working in the MonoTime repository.

## Project Overview

MonoTime is a monorepo management GUI tool built with:
- **Frontend**: Vite + React + TypeScript + Tailwind CSS + Radix UI
- **Backend**: Express + TypeScript + Socket.IO
- **Build System**: Turborepo for monorepo orchestration
- **Package Manager**: npm with workspaces

## Repository Structure

```
MonoTime/
├── apps/
│   ├── web/          # Frontend React application
│   ├── api/          # Backend Express server (CLI tool)
│   └── */            # Other applications
├── packages/
│   ├── types/        # Shared TypeScript interfaces
│   ├── config/       # Configuration constants
│   ├── template/     # Project templates
│   ├── api/          # API route definitions
│   └── */            # Other packages
└── docs/             # Documentation and images
```

## Build & Development Commands

### Root Level Commands
```bash
# Install dependencies across all packages
npm install

# Start development servers (both web and api)
npx turbo dev
# Alternative: npm run dev

# Build all packages
npx turbo build
# Alternative: npm run build

# Run linting across all packages
npx turbo lint

# Run tests across all packages
npx turbo test

# Clean build artifacts
npx turbo clean
```

### Frontend (apps/web) Commands
```bash
cd apps/web

# Start development server
npm run dev
# Runs on http://localhost:5173

# Build for production
npm run build

# Run linter
npm run lint

# Preview production build
npm run preview
```

### Backend (apps/api) Commands
```bash
cd apps/api

# Start development server with hot reload
npm run dev
# Runs on http://localhost:4793

# Build for distribution
npm run build

# Start production server
npm start

# Stop running server
npm run stop

# Build and install globally for testing
npm run localtest
```

### Single Test Commands

Currently, the project uses `echo "Error: no test specified" && exit 1` as the test command. To run tests for a specific package:

```bash
# Navigate to specific package
cd apps/web  # or cd apps/api, cd packages/types, etc.

# Run tests (when implemented)
npm test

# Run tests with watch mode (when implemented)
npm run test:watch

# Run tests for specific file (when implemented)
npm test -- --grep "specific-test-name"
```

## Code Style Guidelines

### TypeScript Configuration
- **Frontend**: ES2022 target, ESNext modules, strict mode enabled
- **Backend**: ES2020 target, CommonJS modules, strict mode enabled
- **All packages**: `strict: true`, `forceConsistentCasingInFileNames: true`

### Import Organization
```typescript
// 1. Node.js built-in modules
import path from 'path';
import fs from 'fs';

// 2. External dependencies (npm packages)
import express from 'express';
import React from 'react';

// 3. Internal workspace packages (use * imports for workspace packages)
import types from 'types';
import config from 'config';
import apiRoute from 'apiroute';

// 4. Local imports (relative)
import { Component } from './components/Component';
import { helper } from '../utils/helper';
```

### Naming Conventions
- **Files**: kebab-case for most files, PascalCase for React components
- **Components**: PascalCase (e.g., `Header.tsx`, `Navigation.tsx`)
- **Functions/Variables**: camelCase
- **Constants**: UPPER_SNAKE_CASE for exported constants
- **Interfaces**: PascalCase with `I` prefix optional (prefer descriptive names)
- **Types**: PascalCase, use `type` for unions/intersections, `interface` for object shapes

### React Component Guidelines
```typescript
// Use functional components with hooks
export default function ComponentName({ prop1, prop2 }: Props) {
    // Hooks at the top
    const [state, setState] = useState<Type>();
    const data = useCustomHook();
    
    // Event handlers
    const handleClick = () => {
        // handler logic
    };
    
    // Effects
    useEffect(() => {
        // effect logic
    }, [dependencies]);
    
    // Render JSX
    return (
        <div className="tailwind-classes">
            {/* content */}
        </div>
    );
}
```

### API Route Structure
```typescript
// File: apps/api/src/routes/routeName.ts
import { Router } from 'express';
import apiRoute from 'apiroute';

const router = Router();

router.post('/endpoint', async (req, res) => {
    try {
        // route logic
        res.json({ success: true, data });
    } catch (error) {
        console.error('Route error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

export default router;
```

### Error Handling
- **Frontend**: Use error boundaries and try-catch for async operations
- **Backend**: Consistent error responses with `{ success: false, error: string }`
- **Logging**: Use `console.error()` for errors, avoid `console.log()` in production

### Styling Guidelines
- **CSS Framework**: Tailwind CSS v4
- **UI Components**: Radix UI for accessible components
- **Color Scheme**: Dark theme with blue accents (`#090909` background, blue gradients)
- **Responsive**: Mobile-first approach with responsive utilities

### State Management
- **Frontend**: Zustand for global state
- **Forms**: Controlled components with React state
- **API State**: Local component state or Zustand stores

### File Organization
```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Basic UI components
│   └── app_contents/   # Page-specific components
├── appstates/          # Zustand stores
├── routes/             # API routes (backend)
├── utils/              # Utility functions
├── types/              # Type definitions
└── styles/             # Global styles
```

## Development Workflow

1. **Before making changes**:
   - Run `npx turbo dev` to start development servers
   - Check existing code patterns in similar files

2. **After making changes**:
   - Run `npx turbo lint` to check for linting errors
   - Test the changes manually in the browser
   - Build with `npx turbo build` to ensure production build works

3. **Package dependencies**:
   - Add workspace dependencies with `npm install package-name --workspace=package-name`
   - Use `*` for workspace package versions in package.json

## Special Notes

- The API server serves the frontend static files from `/public` in production
- Socket.IO is used for real-time communication between frontend and backend
- The application supports both development and production modes
- Port 4793 is the default API port, with automatic port selection if occupied
- Workspace packages use TypeScript files directly as entry points (no build step needed)
#!/usr/bin/env node

import { initCommand } from './commands/init';
import { versionCommand } from './commands/version';
import { helpCommand } from './commands/help';

const args = process.argv.slice(2);
const command = args[0];

// Handle -v or --version command
if (command === '-v' || command === '--version') {
  versionCommand();
  process.exit(0);
}

// Handle -help or --help command
if (command === '-help' || command === '--help') {
  helpCommand();
  process.exit(0);
}

// Handle init command
if (command === 'init') {
  initCommand().then(() => {
    process.exit(0);
  }).catch((error) => {
    console.error('Error:', error);
    process.exit(1);
  });
}

import express from 'express';
import path from 'path';
import cors from 'cors';
import config from 'config';
import open from 'open';
import { createServer } from 'http';
import { Server } from 'socket.io';
import net from 'net';

// Route and Socket Imports
import SETROUTES from './routes';
import runCmdDevSocket from './routes/terminal/runcmddev';
import { interactiveTerminalSocket } from './routes/terminal/interactiveTerminal';
import { setWorkspaceTemplateSocket } from './routes/workspace/setworkspace';

//routers
const app  = express();
const port = config.apiPort;
const isDevelopment = process.env.NODE_ENV === 'development'
let actualPort      = port;

//Handle Cors on production and in development mode
const getCorsOrigin = () => {
  if (isDevelopment) {
    return true;
  }
  return [`http://localhost:${actualPort}`, `http://127.0.0.1:${actualPort}`];
};

app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = getCorsOrigin();
    if (!origin) {
      return callback(null, true);
    }
    if (allowedOrigins === true) {
      return callback(null, true);
    }
    if (Array.isArray(allowedOrigins) && allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    callback(new Error('CORS policy: Origin not allowed'));
  },
  credentials: true,
}));
app.use(express.json());


//routes=======================================================================
const frontendPath = path.join(__dirname, '../public');
SETROUTES(app, frontendPath);


const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: (origin, callback) => {
      // In development, allow all origins
      if (isDevelopment) {
        return callback(null, true);
      }
      // Allow requests with no origin (same-origin requests)
      if (!origin) {
        return callback(null, true);
      }
      // In production, only allow requests from the API server itself
      const allowedOrigins = [`http://localhost:${actualPort}`, `http://127.0.0.1:${actualPort}`];
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      callback(new Error('CORS policy: Origin not allowed'));
    },
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ['websocket', 'polling']
});

runCmdDevSocket(io);
interactiveTerminalSocket(io);
setWorkspaceTemplateSocket(io);

//=============================================================================
// Helper to find an available port
const findAvailablePort = (startPort: number): Promise<number> => {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.unref();
    server.on('error', (err: any) => {
      if (err.code === 'EADDRINUSE') {
        console.log(`Port ${startPort} is in use, trying ${startPort + 1}...`);
        resolve(findAvailablePort(startPort + 1));
      } else {
        reject(err);
      }
    });
    server.listen(startPort, () => {
      server.close(() => {
        resolve(startPort);
      });
    });
  });
};

// Start the server with a free port (only when no command is provided)
if (!command) {
  findAvailablePort(port).then((availablePort) => {
    // Update actualPort for CORS origin validation
    actualPort = availablePort;
    
    httpServer.listen(availablePort, () => {
      console.log(`Monorepo Time is running at http://localhost:${availablePort}`);

      if (!isDevelopment) {
        open(`http://localhost:${availablePort}`);
      }

    });
  }).catch((err) => {
    console.error("Failed to find an available port:", err);
    process.exit(1);
  });
}

export { app, io, httpServer };
export default app;

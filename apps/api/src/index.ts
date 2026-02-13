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
import cors from 'cors';
import path from 'path';
import apiRoute from 'apiroute';
import config from 'config';
import open from 'open';
import { createServer } from 'http';
import { Server } from 'socket.io';
import net from 'net';

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
app.use(express.static('public'));
app.use(express.json());

//routes=======================================================================
import tester from './routes/utils/_tester';
import apiScanWorkspace from './routes/workspace/scanworkspace';
import runCmdDevSocket from './routes/terminal/runcmddev';
import stopProcess from './routes/terminal/stopcmd';
import listWorkspacesDir from './routes/workspace/listworkspacedirs';
import newWorkspace from './routes/workspace/newworkspace';
import interactiveTerminal, { interactiveTerminalSocket } from './routes/terminal/interactiveTerminal';
import stopInteractiveTerm from './routes/terminal/stopInteractiveTerminal';
import updateWorkspace from './routes/workspace/updateworkspace';
import vscodeHideShow from './routes/utils/vscodeHideShow';
import rootPath from './routes/utils/rootPath';
import scaffoldRepo from './routes/utils/scafoldrepo';
import turborepoExist from './routes/home/turborepoexist';
import firstRunRoute from './routes/utils/firstrun';
import notesRoute from './routes/home/notes';
import crudTestRoute from './routes/crud/crudtest';
import gitControlHelper from './routes/utils/gitControlHelper';
import initMonorepoTime from './routes/utils/initmonorepotime';
import processTree from './routes/home/processUsage';
import apiDocker from './routes/home/apidocker';
import availableTemplates from './routes/workspace/availabletemplates';
import setWorkspaceTemplate, { setWorkspaceTemplateSocket } from './routes/workspace/setworkspace';
import stopTerminalWorkspace from './routes/terminal/stopTerminalWorkspace';
import deleteWorkspace from './routes/workspace/deleteWorkspace';
import opencodeHelper from './routes/opencode/opencodeHelper';
import scanProject from './routes/textEditor/projectBrowser';
import textEditor from './routes/textEditor/textEditor';
import gitStashHelper from './routes/utils/gitStashHelper';

import opencodeTUI from './routes/opencode/opencodeTUI';
import createInstance from './routes/opencode/createInstance';
import chats from './routes/opencode/chats';

app.use("/", tester);

//inits
app.use("/" + apiRoute.getRootPath, rootPath);
app.use("/" + apiRoute.scaffoldRepo, scaffoldRepo);
app.use("/" + apiRoute.turborepoExist, turborepoExist);
app.use("/" + apiRoute.firstRun, firstRunRoute);
app.use("/" + apiRoute.initMonorepoTime, initMonorepoTime);

//dashboard / home endpoints
app.use("/" + apiRoute.notes, notesRoute);
app.use("/" + apiRoute.crudTest, crudTestRoute);
app.use("/" + apiRoute.processTree, processTree);
app.use("/" + apiRoute.docker, apiDocker);

//gits
app.use("/" + apiRoute.gitControl, gitControlHelper);
app.use("/" + apiRoute.gitStash, gitStashHelper);

//terminal endpoints
app.use("/" + apiRoute.interactvTerminal, interactiveTerminal);
app.use("/" + apiRoute.stopInteractiveTerminal, stopInteractiveTerm);
app.use("/" + apiRoute.stopTerminalWorkspace, stopTerminalWorkspace);
app.use("/" + apiRoute.stopProcess, stopProcess);
app.use("/" + apiRoute.updateWorkspace, updateWorkspace);
app.use("/" + apiRoute.hideShowFileFolder, vscodeHideShow);

//workspace endpoints
app.use("/" + apiRoute.scanWorkspace, apiScanWorkspace);
app.use("/" + apiRoute.listWorkspacesDir, listWorkspacesDir);
app.use("/" + apiRoute.newWorkspace, newWorkspace);
app.use("/" + apiRoute.availabletemplates, availableTemplates);
app.use("/" + apiRoute.setWorkspaceTemplate, setWorkspaceTemplate);
app.use("/" + apiRoute.deleteWorkspace, deleteWorkspace);

//opencode
app.use("/" + apiRoute.opencodeHelper, opencodeHelper);
app.use("/" + apiRoute.opencodeTUI,    opencodeTUI);
app.use("/" + apiRoute.opencodeTUI,    createInstance);
app.use("/" + apiRoute.opencodeTUI,    chats);

//project browser and editor endpoints
app.use("/" + apiRoute.scanProject, scanProject);
app.use("/" + apiRoute.textEditor, textEditor);


// Serve frontend static files==================================================
const frontendPath = path.join(__dirname, '../public');
app.use(express.static(frontendPath));
app.get(/(.*)/, (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// Socket.IO Setup ============================================================
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

#!/usr/bin/env node

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
import tester            from './routes/_tester';
import apiScanWorkspace  from './routes/scanworkspace';
import runCmdDevSocket   from './routes/runcmddev';
import stopProcess       from './routes/stopcmd';
import listWorkspacesDir from './routes/listworkspacedirs';
import newWorkspace      from './routes/newworkspace';
import interactiveTerminal, { interactiveTerminalSocket } from './routes/interactiveTerminal';
import stopInteractiveTerm from './routes/stopInteractiveTerminal';
import updateWorkspace   from './routes/updateworkspace';
import vscodeHideShow    from './routes/vscodeHideShow';
import rootPath          from './routes/rootPath';
import scaffoldRepo      from './routes/scafoldrepo';
import turborepoExist    from './routes/turborepoexist';
import firstRunRoute     from './routes/firstrun';
import notesRoute        from './routes/notes';
import crudTestRoute     from './routes/crudtest';
import gitControlHelper  from './routes/gitControlHelper';
import initMonorepoTime  from './routes/initmonorepotime';
import processTree       from './routes/processUsage';
import apiDocker         from './routes/apidocker';
import availableTemplates from './routes/availabletemplates';
import setWorkspaceTemplate, { setWorkspaceTemplateSocket } from './routes/setworkspacetemplate';
import stopTerminalWorkspace from './routes/stopTerminalWorkspace';

const app  = express();
const port = config.apiPort;

app.use(cors({
    origin: true,
    credentials: true,
}));
app.use(express.static('public'));
app.use(express.json());

//routes=======================================================================
app.use("/", tester);
app.use("/" + apiRoute.scanWorkspace,      apiScanWorkspace);
app.use("/" + apiRoute.stopProcess,        stopProcess);
app.use("/" + apiRoute.listWorkspacesDir,  listWorkspacesDir);
app.use("/" + apiRoute.newWorkspace,       newWorkspace);
app.use("/" + apiRoute.interactvTerminal,  interactiveTerminal);
app.use("/" + apiRoute.stopInteractiveTerminal, stopInteractiveTerm);
app.use("/" + apiRoute.stopTerminalWorkspace, stopTerminalWorkspace);
app.use("/" + apiRoute.updateWorkspace,    updateWorkspace); 
app.use("/" + apiRoute.hideShowFileFolder, vscodeHideShow);
app.use("/" + apiRoute.getRootPath,        rootPath);
app.use("/" + apiRoute.scaffoldRepo,       scaffoldRepo);
app.use("/" + apiRoute.turborepoExist,     turborepoExist);
app.use("/" + apiRoute.firstRun,           firstRunRoute);
app.use("/" + apiRoute.notes,              notesRoute);
app.use("/" + apiRoute.crudTest,           crudTestRoute);
app.use("/" + apiRoute.gitControl,         gitControlHelper);
app.use("/" + apiRoute.initMonorepoTime,   initMonorepoTime);
app.use("/" + apiRoute.processTree,        processTree);
app.use("/" + apiRoute.docker,             apiDocker);
app.use("/" + apiRoute.availabletemplates, availableTemplates);
app.use("/" + apiRoute.setWorkspaceTemplate, setWorkspaceTemplate);

// Serve frontend static files==================================================
const frontendPath = path.join(__dirname, '../public');
app.use(express.static(frontendPath));
app.get('*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// Socket.IO Setup ============================================================
const httpServer = createServer(app);
const io         = new Server(httpServer, {
  cors: {
    origin:  "*",
    methods: ["GET", "POST"],
  },
  transports: ['websocket', 'polling']
});
runCmdDevSocket( io );
interactiveTerminalSocket( io );
setWorkspaceTemplateSocket( io );

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

// Start the server with a free port
findAvailablePort(port).then((availablePort) => {
  httpServer.listen(availablePort, () => {
    console.log(`Monorepo Time is running at http://localhost:${availablePort}`);
    
    if(process.env.NODE_ENV != 'development') {
      open(`http://localhost:${availablePort}`);
    }

  });
}).catch((err) => {
  console.error("Failed to find an available port:", err);
  process.exit(1);
});

export { app, io, httpServer };
export default app;
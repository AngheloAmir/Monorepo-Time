#!/usr/bin/env node

import express from 'express';
import cors from 'cors';
import path from 'path';
import apiRoute from 'apiroute';
import config from 'config';
import open from 'open';
import { createServer } from 'http';
import { Server } from 'socket.io';

//routers
import apiScanWorkspace  from './routes/scanworkspace';
import runCmdDevSocket   from './routes/runcmddev';
import stopProcess       from './routes/stopcmd';
import listWorkspacesDir from './routes/listworkspacedirs';
import newWorkspace      from './routes/newworkspace';
import interactiveTerminal, { interactiveTerminalSocket } from './routes/interactiveTerminal';
import updateWorkspace   from './routes/updateworkspace';
import vscodeHideShow    from './routes/vscodeHideShow';
import rootPath          from './routes/rootPath';
import scaffoldRepo      from './routes/scafoldrepo';
import turborepoExist    from './routes/turborepoexist';
import firstRunRoute     from './routes/firstrun';

const app = express();
const port = config.apiPort;

app.use(cors({
    origin: true,
    credentials: true,
}));
app.use(express.static('public'));
app.use(express.json());

// Serve frontend static files

//routes=======================================================================
app.use("/" + apiRoute.scanWorkspace,      apiScanWorkspace);
app.use("/" + apiRoute.stopProcess,        stopProcess);
app.use("/" + apiRoute.listWorkspacesDir,  listWorkspacesDir);
app.use("/" + apiRoute.newWorkspace,       newWorkspace);
app.use("/" + apiRoute.interactvTerminal,  interactiveTerminal);
app.use("/" + apiRoute.updateWorkspace,    updateWorkspace); 
app.use("/" + apiRoute.hideShowFileFolder, vscodeHideShow);
app.use("/" + apiRoute.getRootPath,        rootPath);
app.use("/" + apiRoute.scaffoldRepo,       scaffoldRepo);
app.use("/" + apiRoute.turborepoExist,     turborepoExist);
app.use("/" + apiRoute.firstRun,           firstRunRoute);

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

//=============================================================================
httpServer.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  open(`http://localhost:${port}`);
});

export { app, io, httpServer };
export default app;
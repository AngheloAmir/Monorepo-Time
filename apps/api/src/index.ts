import express from 'express';
import cors from 'cors';
import apiRoute from 'apiroute';
import config from 'config';
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

const app = express();
const port = config.apiPort;

app.use(cors({
    origin: true,
    credentials: true,
}));
app.use(express.static('public'));
app.use(express.json());

//routes=======================================================================
app.use("/" + apiRoute.scanWorkspace,      apiScanWorkspace);
app.use("/" + apiRoute.stopProcess,        stopProcess);
app.use("/" + apiRoute.listWorkspacesDir,  listWorkspacesDir);
app.use("/" + apiRoute.newWorkspace,       newWorkspace);
app.use("/" + apiRoute.interactvTerminal,  interactiveTerminal);
app.use("/" + apiRoute.updateWorkspace,    updateWorkspace); 
app.use("/" + apiRoute.hideShowFileFolder, vscodeHideShow);
app.use("/" + apiRoute.getRootPath,        rootPath);


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
});

export { app, io, httpServer };
export default app;
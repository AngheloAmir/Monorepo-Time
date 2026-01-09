import express from 'express';
import cors from 'cors';
import apiRoute from 'apiroute';
import config from 'config';
import { createServer } from 'http';
import { Server } from 'socket.io';

//routers
import apiScanWorkspace from './routes/scanworkspace';
import runCmdDevSocket  from './routes/runcmddev';
import stopProcess      from './routes/stopcmd';

const app = express();
const port = config.apiPort;

app.use(cors({
    origin: true,
    credentials: true,
}));
app.use(express.static('public'));
app.use(express.json());

//routes=======================================================================
app.use("/" + apiRoute.scanWorkspace, apiScanWorkspace);
app.use("/" + apiRoute.stopProcess, stopProcess);

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

//=============================================================================
httpServer.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

export { app, io, httpServer };
export default app;
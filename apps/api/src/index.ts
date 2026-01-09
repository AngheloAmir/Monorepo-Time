import express from 'express';
import cors from 'cors';
import apiRoute from 'apiroute';
import config from 'config';
import { createServer } from 'http';
import { Server } from 'socket.io';

//routers
import apiScanWorkspace from './routes/scanworkspace';
import runCmdDevSocket from './routes/runcmddev';

const app = express();
const port = config.apiPort;

app.use(cors());
app.use(express.static('public'));
app.use(express.json());

//routes=======================================================================
app.use("/" + apiRoute.scanWorkspace, apiScanWorkspace);

// Socket.IO Setup ============================================================
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*", // Adjust this to match your frontend URL in production
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  runCmdDevSocket(io, socket);
  //socket.on('disconnect', () => {});
});

//=============================================================================
httpServer.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

export { app, io, httpServer };
export default app;
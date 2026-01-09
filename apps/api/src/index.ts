import express from 'express';
import cors from 'cors';
import apiScanWorkspace from './routes/scanworkspace';
import apiRoute from 'apiroute';
import config from 'config';

const app  = express();
const port = config.apiPort;
app.use(cors());
app.use(express.static('public'));

//routes=======================================================================
app.use('/api' + apiRoute.scanWorkspace, apiScanWorkspace);

//=============================================================================
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
export default app;
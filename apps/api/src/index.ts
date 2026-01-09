import express from 'express';
import cors from 'cors';
import apiScanWorkspace from './routes/scanworkspace';


const app = express();
const port = 3000;

app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello from API!');
});

app.use('/api/scan-projects', apiScanWorkspace);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

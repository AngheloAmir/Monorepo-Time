import express from 'express';
import cors from 'cors';

const app = express();
const port = 3000;

app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello from API!');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

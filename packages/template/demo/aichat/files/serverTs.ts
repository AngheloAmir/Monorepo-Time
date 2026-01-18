// Main Express.js Server file content

export const serverTs = `import express, { Request, Response } from 'express';
import path from 'path';
import chatRouter from './routes/chat';
import embedRouter from './routes/embed';
import configRouter from './routes/config';
import { loadEmbeddings } from './vectorStore';
import { loadConfig } from './aiClient';

const app = express();
const port = 3500;

// Middleware
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json());

// Load persisted data
loadEmbeddings();
loadConfig();

// API Routes
app.use('/api/chat', chatRouter);
app.use('/api/embed', embedRouter);
app.use('/api/config', configRouter);

// Serve main page
app.get('/', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Start server
app.listen(port, () => {
    console.log('');
    console.log('🍊 ====================================');
    console.log('   FreshFruit AI Chat Demo');
    console.log('====================================');
    console.log('');
    console.log('📍 Store:       http://localhost:' + port);
    console.log('🔧 Admin Panel: http://localhost:' + port + '/admin.html');
    console.log('');
    console.log('📝 Quick Start:');
    console.log('   1. Open the Admin Panel');
    console.log('   2. Configure your OpenAI API key');
    console.log('   3. Add FAQ content and click "Embed"');
    console.log('   4. Open the Store and chat with the AI!');
    console.log('');
});
`;

export const tsconfigJson = `{
  "compilerOptions": {
    "target": "es2016",
    "module": "commonjs",
    "outDir": "./dist",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true
  }
}`;

export const tsupConfig = `import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  splitting: false,
  sourcemap: true,
  clean: true,
  format: ['cjs'],
});`;

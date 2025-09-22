import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();
const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/config.js', (req, res) => {
  const key = process.env.OPENROUTER_API_KEY;
  res.setHeader('Content-Type', 'application/javascript');
  res.send(`const OPENROUTER_API_KEY = "${key}";`);
});

app.listen(3000, () => {
  console.log('Eve Console running at http://localhost:3000');
});

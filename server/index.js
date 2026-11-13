import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { generateInteriorImage } from './visualizerApi.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

app.get('/api/visualize/health', (req, res) => {
  const hasKey = Boolean(process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY);
  res.json({ status: 'ok', hasApiKey: hasKey });
});

app.post('/api/visualize', async (req, res) => {
  try {
    if (!req.body.image) {
      return res.status(400).json({ error: 'Missing room image data' });
    }
    const result = await generateInteriorImage(req.body);
    res.json({ success: true, ...result });
  } catch (error) {
    console.error('Visualizer error:', error);
    res.status(500).json({
      success: false,
      error: error?.message || 'Failed to generate room visualization',
      missingKey: error?.message?.includes('GEMINI_API_KEY')
    });
  }
});

app.listen(port, () => {
  console.log(`Visualizer API server running on port ${port}`);
});

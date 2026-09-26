import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { env } from './config/env.js';
import fileRoutes from './routes/fileRoutes.js';
import textRoutes from './routes/textRoutes.js';
import transferRoutes from './routes/transferRoutes.js';
import { notFound, errorHandler } from './middleware/errors.js';

dotenv.config();

const app = express();

app.use(cors({
  origin: env.origins,
  credentials: true,
}));
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));

app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
  res.json({ ok: true, service: 'rimcloud-backend', time: new Date().toISOString() });
});

app.use('/api/files', fileRoutes);
app.use('/api/text', textRoutes);
app.use('/api/transfers', transferRoutes);
app.use(notFound);
app.use(errorHandler);

export default app;

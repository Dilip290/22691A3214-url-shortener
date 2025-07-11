import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { connectDatabase } from './config/database';
import urlRoutes from './routes/urlRoutes';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';
import Log from '../../Logging Middleware/logger';

const app = express();
const PORT = process.env.PORT || 3000;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    error: 'Too many requests',
    message: 'Please try again later'
  }
});

app.use(helmet());
app.use(cors());
app.use(limiter);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

app.use('/', urlRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

const startServer = async (): Promise<void> => {
  try {
    await connectDatabase();
    
    app.listen(PORT, () => {
      Log('Server', 'INFO', 'url-shortener', `Server running on port ${PORT}`);
    });
  } catch (error) {
    await Log('Server', 'ERROR', 'url-shortener', `Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

process.on('SIGINT', async () => {
  await Log('Server', 'INFO', 'url-shortener', 'Received SIGINT, shutting down gracefully');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await Log('Server', 'INFO', 'url-shortener', 'Received SIGTERM, shutting down gracefully');
  process.exit(0);
});

startServer();

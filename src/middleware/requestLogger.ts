import { Request, Response, NextFunction } from 'express';
import Log from '../../../Logging Middleware/logger';

export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const startTime = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const logMessage = `${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`;
    Log('RequestLogger', 'INFO', 'url-shortener', logMessage);
  });

  next();
};

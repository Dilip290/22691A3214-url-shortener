import { Request, Response, NextFunction } from 'express';
import Log from '../../../Logging Middleware/logger';

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  Log('ErrorHandler', 'ERROR', 'url-shortener', `Unhandled error: ${error.message}`);

  if (res.headersSent) {
    return next(error);
  }

  res.status(500).json({
    error: 'Internal server error',
    message: 'Something went wrong on our end'
  });
};

export const notFoundHandler = (req: Request, res: Response): void => {
  Log('NotFoundHandler', 'WARN', 'url-shortener', `Route not found: ${req.method} ${req.path}`);
  
  res.status(404).json({
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.path}`
  });
};

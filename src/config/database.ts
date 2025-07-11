import mongoose from 'mongoose';
import Log from '../../../Logging Middleware/logger';

export const connectDatabase = async (): Promise<void> => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/url-shortener';
    
    await mongoose.connect(mongoUri);
    
    await Log('Database', 'INFO', 'url-shortener', 'Connected to MongoDB successfully');
  } catch (error: unknown) {
    await Log('Database', 'ERROR', 'url-shortener', `Failed to connect to MongoDB: ${(error as any).message}`);
    process.exit(1);
  }
};

export const disconnectDatabase = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    await Log('Database', 'INFO', 'url-shortener', 'Disconnected from MongoDB');
  } catch (error: unknown) {
    await Log('Database', 'ERROR', 'url-shortener', `Error disconnecting from MongoDB: ${(error as any).message}`);
  }
};


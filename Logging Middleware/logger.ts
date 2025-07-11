import axios from 'axios';

interface LogData {
  stack: string;
  level: string;
  package: string;
  message: string;
  timestamp: string;
}

export async function Log(stack: string, level: string, packageName: string, message: string): Promise<void> {
  try {
    const logData: LogData = {
      stack,
      level,
      package: packageName,
      message,
      timestamp: new Date().toISOString()
    };

    await axios.post('http://20.244.56.144/evaluation-service/logs', logData, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 5000
    });
  } catch (error) {
    // Silently fail to avoid infinite loops
  }
}

export default Log;


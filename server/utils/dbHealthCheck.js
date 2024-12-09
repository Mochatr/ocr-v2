import { checkDBConnection } from '../config/database.js';
import { logger } from './logger.js';

export const performHealthCheck = async () => {
  try {
    const status = await checkDBConnection();
    
    if (status.status === 'connected') {
      logger.info('Database health check passed:', status);
      return {
        healthy: true,
        details: status
      };
    } else {
      logger.warn('Database health check failed:', status);
      return {
        healthy: false,
        details: status
      };
    }
  } catch (error) {
    logger.error('Database health check error:', error);
    return {
      healthy: false,
      error: error.message
    };
  }
};
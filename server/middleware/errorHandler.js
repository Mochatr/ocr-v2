import { logger } from '../utils/logger.js';
import { ApiError } from '../utils/apiError.js';

export default (err, req, res, next) => {
  logger.error(err);

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message
    });
  }

  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
};
import jwt from 'jsonwebtoken';
import { ApiError } from '../../utils/apiError.js';
import { logger } from '../../utils/logger.js';

export const validateToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new ApiError('Token has expired', 401);
    }
    throw new ApiError('Invalid token', 401);
  }
};

export const extractToken = (authHeader) => {
  if (!authHeader?.startsWith('Bearer ')) {
    throw new ApiError('No token provided', 401);
  }
  return authHeader.split(' ')[1];
};
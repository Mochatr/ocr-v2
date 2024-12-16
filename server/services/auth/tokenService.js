import jwt from 'jsonwebtoken';
import { logger } from '../../utils/logger.js';

export const generateToken = (userId) => {
  try {
    return jwt.sign(
      { id: userId },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
  } catch (error) {
    logger.error('Token generation error:', error);
    throw error;
  }
};
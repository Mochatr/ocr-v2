import { AuthService } from '../services/auth.service.js';
import { logger } from '../utils/logger.js';

export const register = async (req, res, next) => {
  try {
    const result = await AuthService.registerUser(req.body);
    res.status(201).json({
      success: true,
      data: result
    });
  } catch (error) {
    logger.error('Registration error:', error);
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const result = await AuthService.loginUser(req.body);
    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    logger.error('Login error:', error);
    next(error);
  }
};
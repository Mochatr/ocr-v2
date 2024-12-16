import { LoginService } from '../../services/auth/loginService.js';
import { logger } from '../../utils/logger.js';

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await LoginService.handleLogin(email, password);

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    logger.error('Login controller error:', {
      error: error.message,
      email: req.body.email
    });
    next(error);
  }
};
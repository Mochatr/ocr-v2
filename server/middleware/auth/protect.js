import { User } from '../../models/user.model.js';
import { validateToken, extractToken } from './tokenValidator.js';
import { ApiError } from '../../utils/apiError.js';
import { logger } from '../../utils/logger.js';

export const protect = async (req, res, next) => {
  try {
    const token = extractToken(req.headers.authorization);
    const decoded = validateToken(token);

    const user = await User.findById(decoded.id);
    if (!user) {
      throw new ApiError('User not found', 404);
    }

    if (user.status !== 'active') {
      throw new ApiError('Account is not active', 403);
    }

    if (user.passwordChangedAt && decoded.iat < user.passwordChangedAt.getTime() / 1000) {
      throw new ApiError('Password was changed, please login again', 401);
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    logger.error('Authentication error:', {
      error: error.message,
      stack: error.stack,
      path: req.path
    });
    next(error);
  }
};
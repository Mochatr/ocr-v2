import bcrypt from 'bcryptjs';
import { User } from '../../models/user.model.js';
import { ApiError } from '../../utils/apiError.js';
import { logger } from '../../utils/logger.js';
import { generateToken } from './tokenService.js';
import { AuditService } from '../audit.service.js';

export class LoginService {
  static async handleLogin(email, password) {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new ApiError('Invalid credentials', 401);
    }

    await this.validateLoginAttempt(user, password);
    await this.updateLoginSuccess(user);

    const token = generateToken(user._id);
    return { user: this.sanitizeUser(user), token };
  }

  static async validateLoginAttempt(user, password) {
    if (user.accountLocked && user.lockUntil > new Date()) {
      const remainingTime = Math.ceil((user.lockUntil - new Date()) / 1000 / 60);
      throw new ApiError(
        `Account is locked. Please try again in ${remainingTime} minutes`,
        423
      );
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      await this.handleFailedLogin(user);
      throw new ApiError('Invalid credentials', 401);
    }
  }

  static async handleFailedLogin(user) {
    user.loginAttempts += 1;
    
    if (user.loginAttempts >= 5) {
      user.accountLocked = true;
      user.lockUntil = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes
      await user.save();
      
      await AuditService.logActivity({
        userId: user._id,
        action: 'account_locked',
        status: 'warning',
        details: {
          reason: 'excessive_failed_attempts',
          attempts: user.loginAttempts
        }
      });
      
      throw new ApiError('Account locked due to too many failed attempts', 423);
    }

    await user.save();
    
    await AuditService.logActivity({
      userId: user._id,
      action: 'login_failed',
      status: 'failure',
      details: {
        attempts: user.loginAttempts
      }
    });
  }

  static async updateLoginSuccess(user) {
    user.loginAttempts = 0;
    user.accountLocked = false;
    user.lockUntil = null;
    user.lastLogin = new Date();
    await user.save();

    await AuditService.logActivity({
      userId: user._id,
      action: 'login_success',
      status: 'success'
    });
  }

  static sanitizeUser(user) {
    return {
      id: user._id,
      name: user.name,
      email: user.email,
      status: user.status
    };
  }
}
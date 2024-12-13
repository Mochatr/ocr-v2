import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';
import { ApiError } from '../utils/apiError.js';
import { logger } from '../utils/logger.js';
import { AuditService } from './audit.service.js';

export class AuthService {
  static async registerUser(userData) {
    try {
      const { name, email, password } = userData;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new ApiError('Email already registered', 400);
      }

      // Create new user
      const user = await User.create({
        name,
        email,
        password
      });

      // Log the registration
      await AuditService.logActivity({
        userId: user._id,
        action: 'user_registration',
        status: 'success',
        details: {
          email: user.email,
          name: user.name
        }
      });

      logger.info(`New user registered: ${email}`);
      
      // Generate JWT token
      const token = this.generateToken(user._id);

      return {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        }
      };
    } catch (error) {
      logger.error('User registration error:', error);
      throw error;
    }
  }

  static async loginUser(credentials) {
    try {
      const { email, password } = credentials;

      // Find user and include password for verification
      const user = await User.findOne({ email }).select('+password');
      if (!user) {
        throw new ApiError('Invalid credentials', 401);
      }

      // Check if account is locked
      if (user.accountLocked && user.lockUntil > new Date()) {
        throw new ApiError('Account is temporarily locked. Please try again later', 423);
      }

      // Verify password
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        await this.handleFailedLogin(user);
        throw new ApiError('Invalid credentials', 401);
      }

      // Reset login attempts on successful login
      await user.resetLoginAttempts();

      // Update last login timestamp
      user.lastLogin = new Date();
      await user.save();

      // Log successful login
      await AuditService.logActivity({
        userId: user._id,
        action: 'user_login',
        status: 'success'
      });

      logger.info(`User logged in: ${email}`);

      // Generate new token
      const token = this.generateToken(user._id);

      return {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        }
      };
    } catch (error) {
      logger.error('Login error:', error);
      throw error;
    }
  }

  static async handleFailedLogin(user) {
    await user.handleFailedLogin();
    
    await AuditService.logActivity({
      userId: user._id,
      action: 'user_login',
      status: 'failure',
      details: {
        reason: 'invalid_password',
        attempts: user.loginAttempts + 1
      }
    });
  }

  static generateToken(userId) {
    return jwt.sign(
      { id: userId },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
  }
}
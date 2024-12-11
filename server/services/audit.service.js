import { AuditLog } from '../models/auditLog.model.js';
import { logger } from '../utils/logger.js';

export class AuditService {
  static async logActivity(data) {
    try {
      const auditLog = await AuditLog.create({
        userId: data.userId,
        action: data.action,
        status: data.status,
        details: data.details,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
        performedAt: new Date()
      });

      logger.info(`Audit log created: ${auditLog._id} for action: ${data.action}`);
      return auditLog;
    } catch (error) {
      logger.error('Error creating audit log:', error);
      throw error;
    }
  }

  static async getUserActivity(userId, options = {}) {
    try {
      const query = { userId };
      
      if (options.action) {
        query.action = options.action;
      }
      
      if (options.startDate && options.endDate) {
        query.performedAt = {
          $gte: new Date(options.startDate),
          $lte: new Date(options.endDate)
        };
      }

      const logs = await AuditLog.find(query)
        .sort({ performedAt: -1 })
        .limit(options.limit || 50)
        .skip(options.skip || 0);

      return logs;
    } catch (error) {
      logger.error('Error fetching user activity:', error);
      throw error;
    }
  }

  static async getSystemActivity(options = {}) {
    try {
      const query = {};
      
      if (options.action) {
        query.action = options.action;
      }
      
      if (options.status) {
        query.status = options.status;
      }

      const logs = await AuditLog.find(query)
        .sort({ performedAt: -1 })
        .limit(options.limit || 100)
        .populate('userId', 'name email')
        .skip(options.skip || 0);

      return logs;
    } catch (error) {
      logger.error('Error fetching system activity:', error);
      throw error;
    }
  }
}
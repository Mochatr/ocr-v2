import { AuditService } from '../services/audit.service.js';

export const auditMiddleware = (action) => async (req, res, next) => {
  const originalSend = res.send;
  
  res.send = function (data) {
    res.locals.responseBody = data;
    originalSend.apply(res, arguments);
  };

  res.on('finish', async () => {
    try {
      await AuditService.logActivity({
        userId: req.user?._id,
        action,
        status: res.statusCode < 400 ? 'success' : 'failure',
        details: {
          method: req.method,
          path: req.path,
          statusCode: res.statusCode,
          responseBody: res.locals.responseBody
        },
        ipAddress: req.ip,
        userAgent: req.get('user-agent')
      });
    } catch (error) {
      console.error('Audit logging error:', error);
    }
  });

  next();
};
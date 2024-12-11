import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  action: {
    type: String,
    required: true,
    enum: [
      'user_registration',
      'user_login',
      'user_logout',
      'password_change',
      'account_update',
      'ocr_submission',
      'ocr_completion'
    ]
  },
  status: {
    type: String,
    required: true,
    enum: ['success', 'failure']
  },
  details: {
    type: mongoose.Schema.Types.Mixed
  },
  ipAddress: String,
  userAgent: String,
  performedAt: {
    type: Date,
    default: Date.now,
    required: true
  }
}, {
  timestamps: true
});

// Indexes for efficient querying
auditLogSchema.index({ performedAt: -1 });
auditLogSchema.index({ userId: 1, performedAt: -1 });
auditLogSchema.index({ action: 1, performedAt: -1 });

export const AuditLog = mongoose.model('AuditLog', auditLogSchema);
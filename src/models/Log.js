// src/models/Log.js
import mongoose from 'mongoose';

const logSchema = new mongoose.Schema(
  {
    action: {
      type: String,
      required: true,
      enum: [
        // Auth
        'user_registered',
        'user_login',
        'user_login_failed',
        'profile_updated',

        // Applications
        'application_created',
        'application_invited',
        'application_rejected',
        'application_hired',
        'application_attended',
        'application_no_show',

        // Payments
        'payment_order_created',
        'payment_verified',
        'payment_failed',

        // Refunds
        'refund_processed',
        'fee_forfeited',

        // Cron
        'cron_refund_engine',

        // Other
        'job_created',
        'job_updated',
        'job_deleted',
      ],
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true,
    },
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
    targetModel: {
      type: String,
      enum: ['User', 'Job', 'Application', 'ChallengeFee', null],
      default: null,
    },
    description: {
      type: String,
      required: true,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    ip: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['success', 'failed', 'warning'],
      default: 'success',
    },
  },
  {
    timestamps: true,
  }
);

// Auto-delete logs older than 90 days
logSchema.index({ createdAt: 1 }, { expireAfterSeconds: 90 * 24 * 60 * 60 });

// Compound index for faster queries
logSchema.index({ action: 1, createdAt: -1 });
logSchema.index({ userId: 1, createdAt: -1 });

const Log = mongoose.models.Log || mongoose.model('Log', logSchema);

export default Log;
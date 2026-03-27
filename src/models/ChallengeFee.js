import mongoose from 'mongoose';

const challengeFeeSchema = new mongoose.Schema(
  {
    applicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Application',
      required: true,
    },
    applicantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },

    // Razorpay fields
    razorpayOrderId: {
      type: String,
      required: true,
    },
    razorpayPaymentId: {
      type: String,
      default: null,
    },
    razorpaySignature: {
      type: String,
      default: null,
    },
    razorpayRefundId: {
      type: String,
      default: null,
    },

    // Status tracking
    status: {
      type: String,
      enum: ['created', 'held', 'refunded', 'forfeited'],
      default: 'created',
      // created   → order created, payment not done yet
      // held      → payment successful, waiting for outcome
      // refunded  → money returned to applicant
      // forfeited → applicant no-showed, money kept
    },
    reason: {
      type: String,
      default: '',
    },
    processedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// One fee per application
challengeFeeSchema.index({ applicationId: 1 }, { unique: true });

const ChallengeFee =
  mongoose.models.ChallengeFee ||
  mongoose.model('ChallengeFee', challengeFeeSchema);

export default ChallengeFee;
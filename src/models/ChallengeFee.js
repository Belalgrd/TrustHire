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
      min: [1, 'Amount must be at least ₹1'],
      max: [50000, 'Amount cannot exceed ₹50,000'],
    },
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
    status: {
      type: String,
      enum: ['created', 'held', 'refunded', 'forfeited'],
      default: 'created',
    },
    reason: {
      type: String,
      default: '',
    },
    processedAt: {
      type: Date,
      default: null,
    },
    // ✅ Track verification timestamp
    verifiedAt: {
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

// ✅ Index for stale order cleanup
challengeFeeSchema.index({ status: 1, createdAt: 1 });

// ✅ Track when payment is verified
challengeFeeSchema.pre('save', function () {
  if (this.isModified('status') && this.status === 'held') {
    this.verifiedAt = new Date();
  }
});

const ChallengeFee =
  mongoose.models.ChallengeFee ||
  mongoose.model('ChallengeFee', challengeFeeSchema);

export default ChallengeFee;
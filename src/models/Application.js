import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
    },
    applicantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    coverLetter: {
      type: String,
      default: '',
      maxlength: [2000, 'Cover letter cannot exceed 2000 characters'],
    },
    status: {
      type: String,
      enum: [
        'pending',
        'reviewing',
        'interview_invited',
        'interview_attended',
        'interview_no_show',
        'rejected',
        'hired',
        'expired',
      ],
      default: 'pending',
    },
    isPriority: {
      type: Boolean,
      default: false,
    },
    interviewDate: {
      type: Date,
      default: null,
    },
    recruiterNotes: {
      type: String,
      default: '',
    },
    // ✅ Track when priority was activated
    priorityActivatedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate applications
applicationSchema.index({ jobId: 1, applicantId: 1 }, { unique: true });

// ✅ Fast priority sorting
applicationSchema.index({ jobId: 1, isPriority: -1, createdAt: -1 });

// ✅ Track priority activation
applicationSchema.pre('save', function () {
  if (this.isModified('isPriority') && this.isPriority === true) {
    this.priorityActivatedAt = new Date();
  }
});

const Application =
  mongoose.models.Application ||
  mongoose.model('Application', applicationSchema);

export default Application;
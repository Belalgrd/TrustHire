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
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate applications
applicationSchema.index({ jobId: 1, applicantId: 1 }, { unique: true });

const Application =
  mongoose.models.Application ||
  mongoose.model('Application', applicationSchema);

export default Application;
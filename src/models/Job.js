import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
  {
    recruiterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
      maxlength: [80, 'Company name cannot exceed 80 characters'],
    },
    description: {
      type: String,
      required: [true, 'Job description is required'],
      maxlength: [5000, 'Description cannot exceed 5000 characters'],
    },
    requirements: {
      type: String,
      default: '',
      maxlength: [3000, 'Requirements cannot exceed 3000 characters'],
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
    },
    locationType: {
      type: String,
      enum: ['remote', 'onsite', 'hybrid'],
      default: 'remote',
    },
    jobType: {
      type: String,
      enum: ['full-time', 'part-time', 'contract', 'internship', 'freelance'],
      default: 'full-time',
    },
    experienceLevel: {
      type: String,
      enum: ['entry', 'mid', 'senior', 'lead', 'any'],
      default: 'any',
    },
    skills: {
      type: [String],
      default: [],
    },
    salary: {
      min: { type: Number, default: 0 },
      max: { type: Number, default: 0 },
      currency: { type: String, default: 'INR' },
      period: {
        type: String,
        enum: ['yearly', 'monthly', 'hourly'],
        default: 'yearly',
      },
    },
    challengeFeeAmount: {
      type: Number,
      default: 500,
      min: [100, 'Minimum challenge fee is ₹100'],
      max: [5000, 'Maximum challenge fee is ₹5000'],
    },
    reviewWindowDays: {
      type: Number,
      default: 14,
      min: [7, 'Minimum review window is 7 days'],
      max: [30, 'Maximum review window is 30 days'],
    },
    status: {
      type: String,
      enum: ['active', 'paused', 'closed'],
      default: 'active',
    },
    applicationsCount: {
      type: Number,
      default: 0,
    },
    priorityApplicantsCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Text index for search
jobSchema.index({ title: 'text', company: 'text', description: 'text' });

const Job = mongoose.models.Job || mongoose.model('Job', jobSchema);

export default Job;
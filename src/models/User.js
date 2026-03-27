import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    role: {
      type: String,
      enum: ['applicant', 'recruiter'],
      required: [true, 'Role is required'],
    },
    profile: {
      bio: { type: String, default: '', maxlength: 500 },
      phone: { type: String, default: '' },
      location: { type: String, default: '' },
      skills: [{ type: String }],
      resumeUrl: { type: String, default: '' },
      company: { type: String, default: '' },
      website: { type: String, default: '' },
      avatar: { type: String, default: '' },
    },
  },
  {
    timestamps: true,
  }
);

// ✅ FIXED: Remove 'next' — async mongoose middleware doesn't need it
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
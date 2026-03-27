"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import RoleSelector from './RoleSelector';
import OtpVerification from './OtpVerification';
import { HiEye, HiEyeOff } from 'react-icons/hi';

export default function RegisterForm() {
  const { sendOtp } = useAuth();

  const [step, setStep] = useState(1); // 1 = form, 2 = OTP

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (formData.name.trim().length < 2)
      newErrors.name = 'Name must be at least 2 characters';

    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!/^\S+@\S+\.\S+$/.test(formData.email))
      newErrors.email = 'Enter a valid email';

    // Block obviously fake emails
    const blockedDomains = ['test.com', 'fake.com', 'example.com', 'abc.com', 'xyz.com'];
    const emailDomain = formData.email.split('@')[1]?.toLowerCase();
    if (blockedDomains.includes(emailDomain))
      newErrors.email = 'Please use a real email address';

    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password.length < 6)
      newErrors.password = 'Password must be at least 6 characters';

    // Stronger password check
    if (!/(?=.*[a-z])(?=.*[A-Z0-9])/.test(formData.password))
      newErrors.password = 'Password needs at least 1 uppercase letter or number';

    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match';
    if (!formData.role) newErrors.role = 'Please select a role';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);
    const result = await sendOtp(
      formData.name,
      formData.email,
      formData.password,
      formData.role
    );

    if (result.success) {
      setStep(2); // Move to OTP step
    }
    setLoading(false);
  };

  const handleResend = async () => {
    await sendOtp(
      formData.name,
      formData.email,
      formData.password,
      formData.role
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  // ── Step 2: OTP Verification ──
  if (step === 2) {
    return (
      <OtpVerification
        formData={formData}
        onBack={() => setStep(1)}
        onResend={handleResend}
      />
    );
  }

  // ── Step 1: Registration Form ──
  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Step Indicator */}
      <div className="flex items-center justify-center gap-3 mb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
            1
          </div>
          <span className="text-sm font-medium text-indigo-600">Details</span>
        </div>
        <div className="w-8 h-0.5 bg-gray-300"></div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-200 text-gray-400 rounded-full flex items-center justify-center text-sm font-bold">
            2
          </div>
          <span className="text-sm font-medium text-gray-400">Verify</span>
        </div>
      </div>

      {/* Role Selector */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          I am a... *
        </label>
        <RoleSelector
          selected={formData.role}
          onSelect={(role) => {
            setFormData({ ...formData, role });
            if (errors.role) setErrors({ ...errors, role: '' });
          }}
        />
        {errors.role && (
          <p className="text-red-500 text-sm mt-1">{errors.role}</p>
        )}
      </div>

      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Full Name *
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="John Doe"
          className={`w-full px-4 py-3 rounded-xl border ${
            errors.name ? 'border-red-500' : 'border-gray-300'
          } focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all`}
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email Address *
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="john@gmail.com"
          className={`w-full px-4 py-3 rounded-xl border ${
            errors.email ? 'border-red-500' : 'border-gray-300'
          } focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all`}
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email}</p>
        )}
        <p className="text-xs text-gray-400 mt-1">
          We&apos;ll send a verification code to this email
        </p>
      </div>

      {/* Password */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Password *
        </label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Min 6 characters, 1 uppercase or number"
            className={`w-full px-4 py-3 rounded-xl border ${
              errors.password ? 'border-red-500' : 'border-gray-300'
            } focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all pr-12`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {showPassword ? (
              <HiEyeOff className="w-5 h-5" />
            ) : (
              <HiEye className="w-5 h-5" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="text-red-500 text-sm mt-1">{errors.password}</p>
        )}
      </div>

      {/* Confirm Password */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Confirm Password *
        </label>
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Re-enter your password"
          className={`w-full px-4 py-3 rounded-xl border ${
            errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
          } focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all`}
        />
        {errors.confirmPassword && (
          <p className="text-red-500 text-sm mt-1">
            {errors.confirmPassword}
          </p>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Sending verification code...
          </>
        ) : (
          'Continue → Verify Email'
        )}
      </button>

      {/* Login Link */}
      <p className="text-center text-gray-600 text-sm">
        Already have an account?{' '}
        <Link
          href="/login"
          className="text-indigo-600 hover:text-indigo-700 font-medium"
        >
          Login here
        </Link>
      </p>
    </form>
  );
}
"use client";

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

export default function OtpVerification({ formData, onBack, onResend }) {
  const { verifyOtpAndRegister } = useAuth();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(30);
  const inputRefs = useRef([]);

  // Countdown timer for resend
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // Auto-focus first input
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index, value) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all 6 digits entered
    if (value && index === 5) {
      const fullOtp = newOtp.join('');
      if (fullOtp.length === 6) {
        handleVerify(fullOtp);
      }
    }
  };

  const handleKeyDown = (index, e) => {
    // Backspace: go to previous input
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);

    if (pastedData.length === 6) {
      const newOtp = pastedData.split('');
      setOtp(newOtp);
      inputRefs.current[5]?.focus();
      handleVerify(pastedData);
    }
  };

  const handleVerify = async (otpString) => {
    const code = otpString || otp.join('');

    if (code.length !== 6) return;

    setLoading(true);
    await verifyOtpAndRegister(
      formData.name,
      formData.email,
      formData.password,
      formData.role,
      code
    );
    setLoading(false);
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;

    setResendCooldown(30);
    setOtp(['', '', '', '', '', '']);
    inputRefs.current[0]?.focus();
    await onResend();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="text-5xl mb-4">📧</div>
        <h2 className="text-xl font-bold text-gray-900">Check your email</h2>
        <p className="text-gray-500 mt-2">
          We sent a 6-digit code to
        </p>
        <p className="text-indigo-600 font-semibold">{formData.email}</p>
      </div>

      {/* OTP Inputs */}
      <div className="flex justify-center gap-3" onPaste={handlePaste}>
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className={`w-12 h-14 text-center text-xl font-bold rounded-xl border-2 
              ${digit ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'} 
              focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200 
              outline-none transition-all`}
            disabled={loading}
          />
        ))}
      </div>

      {/* Verify Button */}
      <button
        onClick={() => handleVerify()}
        disabled={loading || otp.join('').length !== 6}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold 
                   py-3 px-6 rounded-xl transition-all disabled:opacity-50 
                   disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Verifying...
          </>
        ) : (
          'Verify & Create Account'
        )}
      </button>

      {/* Resend */}
      <div className="text-center">
        {resendCooldown > 0 ? (
          <p className="text-gray-400 text-sm">
            Resend code in <span className="font-semibold text-gray-600">{resendCooldown}s</span>
          </p>
        ) : (
          <button
            onClick={handleResend}
            className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
          >
            Didn&apos;t receive the code? Resend
          </button>
        )}
      </div>

      {/* Back Button */}
      <button
        onClick={onBack}
        disabled={loading}
        className="w-full text-gray-500 hover:text-gray-700 text-sm font-medium 
                   py-2 transition-all disabled:opacity-50"
      >
        ← Back to signup form
      </button>
    </div>
  );
}
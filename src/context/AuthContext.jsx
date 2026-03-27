"use client";

import { createContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Load user from token on app start
  const loadUser = useCallback(async () => {
    try {
      const savedToken = localStorage.getItem('trusthire_token');

      if (!savedToken) {
        setLoading(false);
        return;
      }

      setToken(savedToken);

      const res = await fetch('/api/auth/me', {
        headers: {
          Authorization: `Bearer ${savedToken}`,
        },
      });

      const data = await res.json();

      if (data.success) {
        setUser(data.user);
      } else {
        localStorage.removeItem('trusthire_token');
        setToken(null);
      }
    } catch (error) {
      console.error('Load user error:', error);
      localStorage.removeItem('trusthire_token');
      setToken(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  // ── Step 1: Send OTP ──
  const sendOtp = async (name, email, password, role) => {
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success('Verification code sent to your email! 📧');
        return { success: true };
      } else {
        toast.error(data.error);
        return { success: false, error: data.error };
      }
    } catch (error) {
      toast.error('Something went wrong. Try again.');
      return { success: false, error: 'Network error' };
    }
  };

  // ── Step 2: Verify OTP & Register ──
  const verifyOtpAndRegister = async (name, email, password, role, otp) => {
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role, otp }),
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem('trusthire_token', data.token);
        setToken(data.token);
        setUser(data.user);
        toast.success('Welcome to TrustHire! 🎉');

        if (data.user.role === 'recruiter') {
          router.push('/recruiter/dashboard');
        } else {
          router.push('/jobs');
        }

        return { success: true };
      } else {
        toast.error(data.error);
        return { success: false, error: data.error };
      }
    } catch (error) {
      toast.error('Something went wrong. Try again.');
      return { success: false, error: 'Network error' };
    }
  };

  // ── Login (unchanged) ──
  const login = async (email, password) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.success) {
        localStorage.setItem('trusthire_token', data.token);
        setToken(data.token);
        setUser(data.user);
        toast.success(`Welcome back, ${data.user.name}! 👋`);

        if (data.user.role === 'recruiter') {
          router.push('/recruiter/dashboard');
        } else {
          router.push('/jobs');
        }

        return { success: true };
      } else {
        toast.error(data.error);
        return { success: false, error: data.error };
      }
    } catch (error) {
      toast.error('Something went wrong. Try again.');
      return { success: false, error: 'Network error' };
    }
  };

  // ── Logout ──
  const logout = () => {
    localStorage.removeItem('trusthire_token');
    setToken(null);
    setUser(null);
    toast.success('Logged out successfully');
    router.push('/');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        sendOtp,
        verifyOtpAndRegister,
        login,
        logout,
        isAuthenticated: !!user,
        isRecruiter: user?.role === 'recruiter',
        isApplicant: user?.role === 'applicant',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
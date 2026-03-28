"use client";

import { useState, useCallback } from 'react';
import useAuth from './useAuth';
import toast from 'react-hot-toast';

export default function useDeposits() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [deposits, setDeposits] = useState([]);

  // ── Fetch my deposits (applicant) ──
  const fetchMyDeposits = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/payments/my-deposits', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (data.success) {
        setDeposits(data.deposits);
        return { success: true, deposits: data.deposits };
      } else {
        toast.error(data.error || 'Failed to fetch deposits');
        return { success: false };
      }
    } catch (error) {
      console.error('Fetch deposits error:', error);
      toast.error('Something went wrong');
      return { success: false };
    } finally {
      setLoading(false);
    }
  }, [token]);

  // ── Create Razorpay order ──
  const createOrder = async (applicationId, amount) => {
    try {
      setLoading(true);
      const res = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ applicationId, amount }),
      });
      const data = await res.json();

      if (data.success) {
        return { success: true, order: data.order };
      } else {
        toast.error(data.error || 'Failed to create payment order');
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('Create order error:', error);
      toast.error('Something went wrong');
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  // ── Verify payment ──
  const verifyPayment = async (paymentData) => {
    try {
      setLoading(true);
      const res = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(paymentData),
      });
      const data = await res.json();

      if (data.success) {
        toast.success('Payment verified! ✅');
        return { success: true };
      } else {
        toast.error(data.error || 'Payment verification failed');
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('Verify payment error:', error);
      toast.error('Something went wrong');
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  return {
    deposits,
    loading,
    fetchMyDeposits,
    createOrder,
    verifyPayment,
  };
}
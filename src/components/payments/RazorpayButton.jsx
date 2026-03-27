"use client";

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';
import { HiStar } from 'react-icons/hi';

export default function RazorpayButton({
  applicationId,
  amount = 500,
  jobTitle = '',
  onSuccess,
  onFailure,
}) {
  const { token, user } = useAuth();
  const [loading, setLoading] = useState(false);

  // Load Razorpay script dynamically
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (document.getElementById('razorpay-script')) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.id = 'razorpay-script';
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setLoading(true);

    // ── Load Razorpay script ──
    const loaded = await loadRazorpayScript();
    if (!loaded) {
      toast.error('Failed to load payment gateway. Check your connection.');
      setLoading(false);
      return;
    }

    try {
      // ── STEP 1: Create order on backend ──
      const orderRes = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ applicationId }),
      });

      const orderData = await orderRes.json();

      if (!orderData.success) {
        toast.error(orderData.error);
        setLoading(false);
        return;
      }

      console.log('✅ Order created:', orderData.orderId);

      // ── STEP 2: Open Razorpay checkout ──
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'TrustHire',
        description: `Challenge Fee — ${jobTitle}`,
        order_id: orderData.orderId,

        // ✅ On successful payment
        handler: async function (response) {
          console.log('💳 Payment successful, verifying...');

          try {
            // ── STEP 3: Verify on backend ──
            const verifyRes = await fetch('/api/payments/verify', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                applicationId,
              }),
            });

            const verifyData = await verifyRes.json();

            if (verifyData.success) {
              toast.success('⭐ Application boosted to priority!');
              onSuccess && onSuccess(verifyData);
            } else {
              toast.error(verifyData.error || 'Verification failed');
              onFailure && onFailure(verifyData.error);
            }
          } catch (err) {
            console.error('Verify error:', err);
            toast.error('Payment verification failed. Contact support.');
            onFailure && onFailure('Verification failed');
          }
        },

        // ❌ On payment modal close/cancel
        modal: {
          ondismiss: function () {
            console.log('Payment modal closed');
            setLoading(false);
          },
        },

        // Pre-fill user details
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
        },

        // Theme
        theme: {
          color: '#4f46e5', // Indigo
        },

        notes: {
          applicationId: applicationId,
        },
      };

      const paymentObject = new window.Razorpay(options);

      // Handle payment failure
      paymentObject.on('payment.failed', function (response) {
        console.error('Payment failed:', response.error);
        toast.error(
          response.error.description || 'Payment failed. Please try again.'
        );
        onFailure && onFailure(response.error.description);
      });

      paymentObject.open();
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Failed to initiate payment');
      onFailure && onFailure('Failed to initiate payment');
    }

    setLoading(false);
  };

  return (
    <button
      onClick={handlePayment}
      disabled={loading}
      className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold 
                 py-3 px-6 rounded-xl transition-all disabled:opacity-50 
                 disabled:cursor-not-allowed flex items-center justify-center 
                 gap-2 w-full sm:w-auto"
    >
      {loading ? (
        <>
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          Processing...
        </>
      ) : (
        <>
          <HiStar className="w-5 h-5" />
          Boost — ₹{amount}
        </>
      )}
    </button>
  );
}
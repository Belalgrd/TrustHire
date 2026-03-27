import { NextResponse } from 'next/server';
import crypto from 'crypto';
import connectDB from '@/lib/db';
import Application from '@/models/Application';
import Job from '@/models/Job';
import ChallengeFee from '@/models/ChallengeFee';
import { authenticate } from '@/lib/auth';

// ── VERIFY RAZORPAY PAYMENT ──
export async function POST(request) {
  try {
    const auth = await authenticate(request);
    if (auth.error) return auth.error;

    await connectDB();

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      applicationId,
    } = await request.json();

    console.log('🔍 Verifying payment:', {
      razorpay_order_id,
      razorpay_payment_id,
    });

    // ── Validate inputs ──
    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !applicationId
    ) {
      return NextResponse.json(
        { error: 'Missing payment details' },
        { status: 400 }
      );
    }

    // ── Verify Razorpay signature (CRITICAL for security) ──
    const body = razorpay_order_id + '|' + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      console.error('❌ Payment verification failed — signature mismatch');
      return NextResponse.json(
        { error: 'Payment verification failed. Signature mismatch.' },
        { status: 400 }
      );
    }

    console.log('✅ Signature verified');

    // ── Update ChallengeFee ──
    const fee = await ChallengeFee.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id },
      {
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        status: 'held',
      },
      { new: true }
    );

    if (!fee) {
      return NextResponse.json(
        { error: 'Payment record not found' },
        { status: 404 }
      );
    }

    // ── Mark application as priority ──
    await Application.findByIdAndUpdate(applicationId, {
      isPriority: true,
    });

    // ── Increment priority count on job ──
    await Job.findByIdAndUpdate(fee.jobId, {
      $inc: { priorityApplicantsCount: 1 },
    });

    console.log('✅ Payment verified & application boosted!');

    return NextResponse.json({
      success: true,
      message: 'Payment verified! Your application is now prioritized ⭐',
      fee,
    });
  } catch (error) {
    console.error('Verify payment error:', error);
    return NextResponse.json(
      { error: 'Payment verification failed' },
      { status: 500 }
    );
  }
}
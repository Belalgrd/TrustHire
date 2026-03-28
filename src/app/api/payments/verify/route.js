export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import connectDB from '@/lib/db';
import Application from '@/models/Application';
import Job from '@/models/Job';
import User from '@/models/User';
import ChallengeFee from '@/models/ChallengeFee';
import { authenticate } from '@/lib/auth';
import { sendEmail } from '@/lib/resend';
import { priorityConfirmationEmail } from '@/emails/priorityConfirmation';
import { createNotification } from '@/lib/notifications';
import { createLog, getIP } from '@/lib/logger';

export async function POST(request) {
  try {
    const auth = await authenticate(request);
    if (auth.error) return auth.error;

    await connectDB();
    const ip = getIP(request);

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      applicationId,
    } = await request.json();

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

    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      // ✅ LOG: PAYMENT FAILED
      await createLog({
        action: 'payment_failed',
        userId: auth.userId,
        description: 'Payment signature mismatch',
        metadata: { razorpay_order_id, razorpay_payment_id },
        ip,
        status: 'failed',
      });

      return NextResponse.json(
        { error: 'Payment verification failed. Signature mismatch.' },
        { status: 400 }
      );
    }

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

    const application = await Application.findByIdAndUpdate(
      applicationId,
      { isPriority: true },
      { new: true }
    ).populate('jobId');

    await Job.findByIdAndUpdate(fee.jobId, {
      $inc: { priorityApplicantsCount: 1 },
    });

    // ✅ SEND PRIORITY CONFIRMATION EMAIL
    try {
      const user = await User.findById(auth.userId);
      if (user && application) {
        const emailContent = priorityConfirmationEmail({
          applicantName: user.name,
          jobTitle: application.jobId.title,
          company: application.jobId.company,
          amount: fee.amount,
          paymentId: razorpay_payment_id,
        });
        await sendEmail({
          to: user.email,
          subject: emailContent.subject,
          html: emailContent.html,
        });
      }
    } catch (emailError) {
      console.error('📧 Priority email failed:', emailError);
    }

    // ✅ CREATE PRIORITY NOTIFICATION
    await createNotification({
      userId: auth.userId,
      type: 'priority_confirmed',
      title: 'Application Boosted! ⭐',
      message: `Your application for ${application.jobId.title} is now prioritized. ₹${fee.amount} Challenge Fee held.`,
      link: '/applicant/deposits',
    });

    // ✅ LOG: PAYMENT VERIFIED
    await createLog({
      action: 'payment_verified',
      userId: auth.userId,
      targetId: fee._id,
      targetModel: 'ChallengeFee',
      description: `Payment ₹${fee.amount} verified & application boosted`,
      metadata: {
        amount: fee.amount,
        razorpay_order_id,
        razorpay_payment_id,
        jobTitle: application.jobId.title,
      },
      ip,
    });

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
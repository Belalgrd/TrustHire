export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Application from '@/models/Application';
import User from '@/models/User';
import ChallengeFee from '@/models/ChallengeFee';
import razorpay from '@/lib/razorpay';
import { authenticate } from '@/lib/auth';
import { sendEmail } from '@/lib/resend';
import { refundProcessedEmail } from '@/emails/refundProcessed';

export async function PATCH(request, { params }) {
  try {
    const auth = await authenticate(request);
    if (auth.error) return auth.error;

    await connectDB();

    const { id } = params;

    const application = await Application.findById(id).populate('jobId');

    if (!application) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      );
    }

    if (application.jobId.recruiterId.toString() !== auth.userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    application.status = 'interview_attended';
    await application.save();

    // ── REFUND on attendance ──
    const fee = await ChallengeFee.findOne({
      applicationId: id,
      status: 'held',
    });

    if (fee) {
      try {
        const refund = await razorpay.payments.refund(
          fee.razorpayPaymentId,
          {
            amount: fee.amount * 100,
            notes: {
              reason: 'Attended interview — refund processed',
            },
          }
        );

        fee.status = 'refunded';
        fee.reason = 'Attended interview — refund processed';
        fee.razorpayRefundId = refund.id;
        fee.processedAt = new Date();
        await fee.save();

        console.log(`✅ Attended refund: ₹${fee.amount} → ${refund.id}`);
      } catch (refundError) {
        console.error('❌ Refund failed:', refundError.message);
      }
    }

    // ✅ SEND REFUND EMAIL
    try {
      if (fee && fee.status === 'refunded') {
        const applicant = await User.findById(application.applicantId);
        if (applicant) {
          const refundEmail = refundProcessedEmail({
            applicantName: applicant.name,
            jobTitle: application.jobId.title,
            company: application.jobId.company,
            amount: fee.amount,
            reason: 'attended',
          });
          await sendEmail({
            to: applicant.email,
            subject: refundEmail.subject,
            html: refundEmail.html,
          });
          console.log('📧 Refund email sent to:', applicant.email);
        }
      }
    } catch (emailError) {
      console.error('📧 Refund email failed:', emailError);
    }

    return NextResponse.json({
      success: true,
      message: fee
        ? 'Marked as attended. Challenge fee refunded! 💰'
        : 'Marked as attended',
      application,
    });
  } catch (error) {
    console.error('Attended error:', error);
    return NextResponse.json(
      { error: 'Failed to update' },
      { status: 500 }
    );
  }
}
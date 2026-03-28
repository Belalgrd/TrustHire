export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Application from '@/models/Application';
import User from '@/models/User';
import ChallengeFee from '@/models/ChallengeFee';
import razorpay from '@/lib/razorpay';
import { authenticate } from '@/lib/auth';
import { sendEmail } from '@/lib/resend';
import { applicationRejectedEmail } from '@/emails/applicationRejected';
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

    application.status = 'rejected';
    await application.save();

    // ── INSTANT REFUND if challenge fee exists ──
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
              reason: 'Application rejected by recruiter',
            },
          }
        );

        fee.status = 'refunded';
        fee.reason = 'Application rejected by recruiter';
        fee.razorpayRefundId = refund.id;
        fee.processedAt = new Date();
        await fee.save();

        console.log(`✅ Instant refund: ₹${fee.amount} → ${refund.id}`);
      } catch (refundError) {
        console.error('❌ Refund failed:', refundError.message);
      }
    }

    // ✅ SEND REJECTION + REFUND EMAILS
    try {
      const applicant = await User.findById(application.applicantId);
      if (applicant) {
        // Send rejection email
        const rejectEmail = applicationRejectedEmail({
          applicantName: applicant.name,
          jobTitle: application.jobId.title,
          company: application.jobId.company,
          hadChallengeFee: !!fee,
          amount: fee?.amount || 0,
        });
        await sendEmail({
          to: applicant.email,
          subject: rejectEmail.subject,
          html: rejectEmail.html,
        });
        console.log('📧 Rejection email sent to:', applicant.email);

        // Send refund email if fee was refunded
        if (fee && fee.status === 'refunded') {
          const refundEmail = refundProcessedEmail({
            applicantName: applicant.name,
            jobTitle: application.jobId.title,
            company: application.jobId.company,
            amount: fee.amount,
            reason: 'rejected',
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
      console.error('📧 Rejection email failed:', emailError);
    }

    return NextResponse.json({
      success: true,
      message: fee
        ? 'Application rejected & challenge fee refunded! 💰'
        : 'Application rejected',
      application,
    });
  } catch (error) {
    console.error('Reject error:', error);
    return NextResponse.json(
      { error: 'Failed to reject' },
      { status: 500 }
    );
  }
}
export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Application from '@/models/Application';
import User from '@/models/User';
import ChallengeFee from '@/models/ChallengeFee';
import razorpay from '@/lib/razorpay';
import { authenticate } from '@/lib/auth';
import { sendEmail } from '@/lib/resend';
import { hiredConfirmationEmail } from '@/emails/hiredConfirmation';
import { refundProcessedEmail } from '@/emails/refundProcessed';
import { createNotification } from '@/lib/notifications';
import { createLog, getIP } from '@/lib/logger';

export async function PATCH(request, { params }) {
  try {
    const auth = await authenticate(request);
    if (auth.error) return auth.error;

    await connectDB();
    const ip = getIP(request);

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

    application.status = 'hired';
    await application.save();

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
            notes: { reason: 'Successfully hired — congratulations!' },
          }
        );

        fee.status = 'refunded';
        fee.reason = 'Successfully hired — congratulations!';
        fee.razorpayRefundId = refund.id;
        fee.processedAt = new Date();
        await fee.save();

        // ✅ LOG: REFUND ON HIRE
        await createLog({
          action: 'refund_processed',
          userId: application.applicantId,
          targetId: fee._id,
          targetModel: 'ChallengeFee',
          description: `Refund ₹${fee.amount} processed — candidate hired`,
          metadata: { amount: fee.amount, refundId: refund.id, reason: 'hired' },
          ip,
        });
      } catch (refundError) {
        console.error('❌ Refund failed:', refundError.message);
      }
    }

    // ✅ SEND HIRED + REFUND EMAILS
    try {
      const applicant = await User.findById(application.applicantId);
      if (applicant) {
        const hiredEmail = hiredConfirmationEmail({
          applicantName: applicant.name,
          jobTitle: application.jobId.title,
          company: application.jobId.company,
          hadChallengeFee: !!fee,
          amount: fee?.amount || 0,
        });
        await sendEmail({
          to: applicant.email,
          subject: hiredEmail.subject,
          html: hiredEmail.html,
        });

        if (fee && fee.status === 'refunded') {
          const refundEmail = refundProcessedEmail({
            applicantName: applicant.name,
            jobTitle: application.jobId.title,
            company: application.jobId.company,
            amount: fee.amount,
            reason: 'hired',
          });
          await sendEmail({
            to: applicant.email,
            subject: refundEmail.subject,
            html: refundEmail.html,
          });
        }
      }
    } catch (emailError) {
      console.error('📧 Hired email failed:', emailError);
    }

    // ✅ CREATE HIRED NOTIFICATION
    await createNotification({
      userId: application.applicantId,
      type: 'hired',
      title: 'Congratulations, You\'re Hired! 🥳',
      message: `${application.jobId.company} has hired you for ${application.jobId.title}!${fee ? ` ₹${fee.amount} refund initiated.` : ''}`,
      link: '/applicant/applications',
    });

    // ✅ LOG: APPLICATION HIRED
    await createLog({
      action: 'application_hired',
      userId: auth.userId,
      targetId: application._id,
      targetModel: 'Application',
      description: `Candidate hired — ${application.jobId.title}`,
      metadata: {
        applicantId: application.applicantId.toString(),
        jobTitle: application.jobId.title,
        hadFee: !!fee,
        feeAmount: fee?.amount || 0,
      },
      ip,
    });

    return NextResponse.json({
      success: true,
      message: 'Candidate hired! 🎉 Challenge fee refunded.',
      application,
    });
  } catch (error) {
    console.error('Hire error:', error);
    return NextResponse.json(
      { error: 'Failed to update' },
      { status: 500 }
    );
  }
}
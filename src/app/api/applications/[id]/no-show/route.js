export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Application from '@/models/Application';
import User from '@/models/User';
import ChallengeFee from '@/models/ChallengeFee';
import { authenticate } from '@/lib/auth';
import { sendEmail } from '@/lib/resend';
import { feeForfeitedEmail } from '@/emails/feeForfeited';
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

    application.status = 'interview_no_show';
    await application.save();

    const fee = await ChallengeFee.findOne({
      applicationId: id,
      status: 'held',
    });

    if (fee) {
      fee.status = 'forfeited';
      fee.reason = 'Did not attend scheduled interview';
      fee.processedAt = new Date();
      await fee.save();

      // ✅ LOG: FEE FORFEITED
      await createLog({
        action: 'fee_forfeited',
        userId: application.applicantId,
        targetId: fee._id,
        targetModel: 'ChallengeFee',
        description: `Fee ₹${fee.amount} forfeited — no-show`,
        metadata: { amount: fee.amount, jobTitle: application.jobId.title },
        ip,
      });
    }

    // ✅ SEND FEE FORFEITED EMAIL
    try {
      if (fee) {
        const applicant = await User.findById(application.applicantId);
        if (applicant) {
          const forfeitEmail = feeForfeitedEmail({
            applicantName: applicant.name,
            jobTitle: application.jobId.title,
            company: application.jobId.company,
            amount: fee.amount,
          });
          await sendEmail({
            to: applicant.email,
            subject: forfeitEmail.subject,
            html: forfeitEmail.html,
          });
        }
      }
    } catch (emailError) {
      console.error('📧 Forfeit email failed:', emailError);
    }

    // ✅ CREATE NO-SHOW NOTIFICATION
    await createNotification({
      userId: application.applicantId,
      type: 'fee_forfeited',
      title: 'Interview No-Show ⚠️',
      message: `You missed your interview for ${application.jobId.title} at ${application.jobId.company}.${fee ? ` ₹${fee.amount} has been forfeited.` : ''}`,
      link: '/applicant/applications',
    });

    // ✅ LOG: APPLICATION NO-SHOW
    await createLog({
      action: 'application_no_show',
      userId: auth.userId,
      targetId: application._id,
      targetModel: 'Application',
      description: `No-show marked — ${application.jobId.title}`,
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
      message: fee
        ? 'Marked as no-show. Challenge fee forfeited.'
        : 'Marked as no-show',
      application,
    });
  } catch (error) {
    console.error('No-show error:', error);
    return NextResponse.json(
      { error: 'Failed to update' },
      { status: 500 }
    );
  }
}
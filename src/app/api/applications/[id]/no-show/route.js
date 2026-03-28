export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Application from '@/models/Application';
import User from '@/models/User';
import ChallengeFee from '@/models/ChallengeFee';
import { authenticate } from '@/lib/auth';
import { sendEmail } from '@/lib/resend';
import { feeForfeitedEmail } from '@/emails/feeForfeited';

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

    application.status = 'interview_no_show';
    await application.save();

    // ── INSTANT FORFEIT if challenge fee exists ──
    const fee = await ChallengeFee.findOne({
      applicationId: id,
      status: 'held',
    });

    if (fee) {
      fee.status = 'forfeited';
      fee.reason = 'Did not attend scheduled interview';
      fee.processedAt = new Date();
      await fee.save();
      console.log(`🚫 Fee forfeited: ₹${fee.amount}`);
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
          console.log('📧 Fee forfeited email sent to:', applicant.email);
        }
      }
    } catch (emailError) {
      console.error('📧 Forfeit email failed:', emailError);
    }

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
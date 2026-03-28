export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Application from '@/models/Application';
import User from '@/models/User';
import Job from '@/models/Job';
import { authenticate } from '@/lib/auth';
import { sendEmail } from '@/lib/resend';
import { interviewInviteEmail } from '@/emails/interviewInvite';

export async function PATCH(request, { params }) {
  try {
    const auth = await authenticate(request);
    if (auth.error) return auth.error;

    await connectDB();

    const { id } = params;
    const { interviewDate, message } = await request.json();

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

    application.status = 'interview_invited';
    application.interviewDate = interviewDate || null;
    await application.save();

    // ✅ SEND INTERVIEW INVITE EMAIL
    try {
      const applicant = await User.findById(application.applicantId);
      if (applicant) {
        const emailContent = interviewInviteEmail({
          applicantName: applicant.name,
          jobTitle: application.jobId.title,
          company: application.jobId.company,
          message: message || '',
        });
        await sendEmail({
          to: applicant.email,
          subject: emailContent.subject,
          html: emailContent.html,
        });
        console.log('📧 Interview invite email sent to:', applicant.email);
      }
    } catch (emailError) {
      console.error('📧 Interview invite email failed:', emailError);
    }

    return NextResponse.json({
      success: true,
      message: 'Interview invite sent!',
      application,
    });
  } catch (error) {
    console.error('Invite error:', error);
    return NextResponse.json(
      { error: 'Failed to send invite' },
      { status: 500 }
    );
  }
}
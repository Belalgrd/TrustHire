export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Application from '@/models/Application';
import Job from '@/models/Job';
import User from '@/models/User';
import { authenticate } from '@/lib/auth';
import { sendEmail } from '@/lib/resend';
import { applicationReceivedEmail } from '@/emails/applicationReceived';
import { createNotification } from '@/lib/notifications';
import { createLog, getIP } from '@/lib/logger';

export async function POST(request) {
  try {
    const auth = await authenticate(request);
    if (auth.error) return auth.error;

    await connectDB();
    const ip = getIP(request);

    const user = await User.findById(auth.userId);
    if (!user || user.role !== 'applicant') {
      return NextResponse.json(
        { error: 'Only job seekers can apply' },
        { status: 403 }
      );
    }

    const { jobId, coverLetter } = await request.json();

    if (!jobId) {
      return NextResponse.json(
        { error: 'Job ID is required' },
        { status: 400 }
      );
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }

    if (job.status !== 'active') {
      return NextResponse.json(
        { error: 'This job is no longer accepting applications' },
        { status: 400 }
      );
    }

    const existingApplication = await Application.findOne({
      jobId,
      applicantId: auth.userId,
    });

    if (existingApplication) {
      return NextResponse.json(
        { error: 'You have already applied for this job' },
        { status: 400 }
      );
    }

    const application = await Application.create({
      jobId,
      applicantId: auth.userId,
      coverLetter: coverLetter || '',
      isPriority: false,
    });

    await Job.findByIdAndUpdate(jobId, {
      $inc: { applicationsCount: 1 },
    });

    // ✅ SEND APPLICATION RECEIVED EMAIL
    try {
      const emailContent = applicationReceivedEmail({
        applicantName: user.name,
        jobTitle: job.title,
        company: job.company,
        isPriority: false,
        amount: 0,
      });
      await sendEmail({
        to: user.email,
        subject: emailContent.subject,
        html: emailContent.html,
      });
    } catch (emailError) {
      console.error('📧 Application email failed:', emailError);
    }

    // ✅ CREATE APPLICATION NOTIFICATION
    await createNotification({
      userId: auth.userId,
      type: 'application_received',
      title: 'Application Submitted! 📋',
      message: `Your application for ${job.title} at ${job.company} has been submitted.`,
      link: '/applicant/applications',
    });

    // ✅ LOG: APPLICATION CREATED
    await createLog({
      action: 'application_created',
      userId: auth.userId,
      targetId: application._id,
      targetModel: 'Application',
      description: `${user.name} applied for ${job.title} at ${job.company}`,
      metadata: { jobId, jobTitle: job.title, company: job.company },
      ip,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Application submitted successfully!',
        application,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create application error:', error);

    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'You have already applied for this job' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to submit application' },
      { status: 500 }
    );
  }
}
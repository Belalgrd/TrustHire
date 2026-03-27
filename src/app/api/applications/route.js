import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Application from '@/models/Application';
import Job from '@/models/Job';
import User from '@/models/User';
import { authenticate } from '@/lib/auth';

// ── CREATE APPLICATION (Applicant Only) ──
export async function POST(request) {
  try {
    const auth = await authenticate(request);
    if (auth.error) return auth.error;

    await connectDB();

    // Check if user is applicant
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

    // Check if job exists and is active
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

    // Check if already applied
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

    // Create application
    const application = await Application.create({
      jobId,
      applicantId: auth.userId,
      coverLetter: coverLetter || '',
      isPriority: false,
    });

    // Increment application count on job
    await Job.findByIdAndUpdate(jobId, {
      $inc: { applicationsCount: 1 },
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
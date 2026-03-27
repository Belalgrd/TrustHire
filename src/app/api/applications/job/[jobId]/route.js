import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Application from '@/models/Application';
import Job from '@/models/Job';
import { authenticate } from '@/lib/auth';

// ── GET ALL APPLICANTS FOR A JOB (Recruiter) ──
export async function GET(request, { params }) {
  try {
    const auth = await authenticate(request);
    if (auth.error) return auth.error;

    await connectDB();

    const { jobId } = params;

    // Verify recruiter owns this job
    const job = await Job.findById(jobId);
    if (!job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }

    if (job.recruiterId.toString() !== auth.userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const applications = await Application.find({ jobId })
      .populate('applicantId', 'name email profile createdAt')
      .sort({ isPriority: -1, createdAt: -1 })
      .lean();

    // Split into priority and normal
    const priorityApplicants = applications.filter((a) => a.isPriority);
    const normalApplicants = applications.filter((a) => !a.isPriority);

    return NextResponse.json({
      success: true,
      job,
      priorityApplicants,
      normalApplicants,
      totalCount: applications.length,
      priorityCount: priorityApplicants.length,
    });
  } catch (error) {
    console.error('Get applicants error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch applicants' },
      { status: 500 }
    );
  }
}
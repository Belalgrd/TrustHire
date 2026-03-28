export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Job from '@/models/Job';
import Application from '@/models/Application';
import { authenticate } from '@/lib/auth';

// ── GET RECRUITER DASHBOARD STATS ──
export async function GET(request) {
  try {
    const auth = await authenticate(request);
    if (auth.error) return auth.error;

    await connectDB();

    // ── Job Stats ──
    const jobs = await Job.find({ recruiterId: auth.userId }).lean();
    const jobIds = jobs.map((j) => j._id);

    const totalJobs = jobs.length;
    const activeJobs = jobs.filter((j) => j.status === 'active').length;
    const pausedJobs = jobs.filter((j) => j.status === 'paused').length;
    const closedJobs = jobs.filter((j) => j.status === 'closed').length;

    // ── Application Stats (across all recruiter's jobs) ──
    const applications = await Application.find({ jobId: { $in: jobIds } }).lean();

    const totalApplications = applications.length;
    const pendingApplications = applications.filter((a) => a.status === 'pending').length;
    const reviewingApplications = applications.filter((a) => a.status === 'reviewing').length;
    const interviewInvited = applications.filter((a) => a.status === 'interview_invited').length;
    const interviewAttended = applications.filter((a) => a.status === 'interview_attended').length;
    const interviewNoShow = applications.filter((a) => a.status === 'interview_no_show').length;
    const rejectedApplications = applications.filter((a) => a.status === 'rejected').length;
    const hiredApplications = applications.filter((a) => a.status === 'hired').length;
    const priorityApplications = applications.filter((a) => a.isPriority).length;

    // ── Recent Applications (latest 10) ──
    const recentApplications = await Application.find({ jobId: { $in: jobIds } })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('applicantId', 'name email profile')
      .populate('jobId', 'title company')
      .lean();

    return NextResponse.json({
      success: true,
      dashboard: {
        jobs: {
          total: totalJobs,
          active: activeJobs,
          paused: pausedJobs,
          closed: closedJobs,
        },
        applications: {
          total: totalApplications,
          pending: pendingApplications,
          reviewing: reviewingApplications,
          interviewInvited,
          interviewAttended,
          interviewNoShow,
          rejected: rejectedApplications,
          hired: hiredApplications,
          priority: priorityApplications,
        },
        recentApplications,
      },
    });
  } catch (error) {
    console.error('Recruiter dashboard error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}
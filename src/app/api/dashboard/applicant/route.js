export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Application from '@/models/Application';
import { authenticate } from '@/lib/auth';

// ── GET APPLICANT DASHBOARD STATS ──
export async function GET(request) {
  try {
    const auth = await authenticate(request);
    if (auth.error) return auth.error;

    await connectDB();

    // ── Application Stats ──
    const applications = await Application.find({ applicantId: auth.userId }).lean();

    const totalApplications = applications.length;
    const pendingApplications = applications.filter((a) => a.status === 'pending').length;
    const reviewingApplications = applications.filter((a) => a.status === 'reviewing').length;
    const interviewInvited = applications.filter((a) => a.status === 'interview_invited').length;
    const interviewAttended = applications.filter((a) => a.status === 'interview_attended').length;
    const interviewNoShow = applications.filter((a) => a.status === 'interview_no_show').length;
    const rejectedApplications = applications.filter((a) => a.status === 'rejected').length;
    const hiredApplications = applications.filter((a) => a.status === 'hired').length;
    const priorityApplications = applications.filter((a) => a.isPriority).length;

    // ── Recent Applications (latest 10 with job details) ──
    const recentApplications = await Application.find({ applicantId: auth.userId })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('jobId', 'title company location locationType jobType salary status')
      .lean();

    return NextResponse.json({
      success: true,
      dashboard: {
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
    console.error('Applicant dashboard error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Application from '@/models/Application';
import { authenticate } from '@/lib/auth';

// ── GET MY APPLICATIONS (Applicant) ──
export async function GET(request) {
  try {
    const auth = await authenticate(request);
    if (auth.error) return auth.error;

    await connectDB();

    const applications = await Application.find({
      applicantId: auth.userId,
    })
      .populate('jobId', 'title company location locationType jobType salary challengeFeeAmount status')
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      applications,
    });
  } catch (error) {
    console.error('Get my applications error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch applications' },
      { status: 500 }
    );
  }
}
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import ChallengeFee from '@/models/ChallengeFee';
import { authenticate } from '@/lib/auth';

// ── GET MY DEPOSITS (Applicant) ──
export async function GET(request) {
  try {
    const auth = await authenticate(request);
    if (auth.error) return auth.error;

    await connectDB();

    const deposits = await ChallengeFee.find({
      applicantId: auth.userId,
      status: { $ne: 'created' }, // Don't show incomplete orders
    })
      .populate({
        path: 'applicationId',
        select: 'status isPriority createdAt',
      })
      .populate({
        path: 'jobId',
        select: 'title company location',
      })
      .sort({ createdAt: -1 })
      .lean();

    // Calculate summary
    const summary = {
      totalHeld: deposits
        .filter((d) => d.status === 'held')
        .reduce((sum, d) => sum + d.amount, 0),
      totalRefunded: deposits
        .filter((d) => d.status === 'refunded')
        .reduce((sum, d) => sum + d.amount, 0),
      totalForfeited: deposits
        .filter((d) => d.status === 'forfeited')
        .reduce((sum, d) => sum + d.amount, 0),
      count: deposits.length,
    };

    return NextResponse.json({
      success: true,
      deposits,
      summary,
    });
  } catch (error) {
    console.error('Get deposits error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch deposits' },
      { status: 500 }
    );
  }
}
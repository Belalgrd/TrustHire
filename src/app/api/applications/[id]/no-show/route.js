import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Application from '@/models/Application';
import ChallengeFee from '@/models/ChallengeFee';
import { authenticate } from '@/lib/auth';

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
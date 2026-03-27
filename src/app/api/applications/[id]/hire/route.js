import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Application from '@/models/Application';
import ChallengeFee from '@/models/ChallengeFee';
import razorpay from '@/lib/razorpay';
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

    application.status = 'hired';
    await application.save();

    // ── INSTANT REFUND on hire ──
    const fee = await ChallengeFee.findOne({
      applicationId: id,
      status: 'held',
    });

    if (fee) {
      try {
        const refund = await razorpay.payments.refund(
          fee.razorpayPaymentId,
          {
            amount: fee.amount * 100,
            notes: {
              reason: 'Successfully hired — congratulations!',
            },
          }
        );

        fee.status = 'refunded';
        fee.reason = 'Successfully hired — congratulations!';
        fee.razorpayRefundId = refund.id;
        fee.processedAt = new Date();
        await fee.save();

        console.log(`✅ Hire refund: ₹${fee.amount} → ${refund.id}`);
      } catch (refundError) {
        console.error('❌ Refund failed:', refundError.message);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Candidate hired! 🎉 Challenge fee refunded.',
      application,
    });
  } catch (error) {
    console.error('Hire error:', error);
    return NextResponse.json(
      { error: 'Failed to update' },
      { status: 500 }
    );
  }
}
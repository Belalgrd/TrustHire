export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import razorpay from '@/lib/razorpay';
import Application from '@/models/Application';
import Job from '@/models/Job';
import ChallengeFee from '@/models/ChallengeFee';
import { authenticate } from '@/lib/auth';

// ── CREATE RAZORPAY ORDER ──
export async function POST(request) {
  try {
    const auth = await authenticate(request);
    if (auth.error) return auth.error;

    await connectDB();

    const { applicationId } = await request.json();

    if (!applicationId) {
      return NextResponse.json(
        { error: 'Application ID is required' },
        { status: 400 }
      );
    }

    // ── Verify application belongs to this user ──
    const application = await Application.findOne({
      _id: applicationId,
      applicantId: auth.userId,
    }).populate('jobId');

    if (!application) {
      return NextResponse.json(
        { error: 'Application not found' },
        { status: 404 }
      );
    }

    // ── Check if already priority ──
    if (application.isPriority) {
      return NextResponse.json(
        { error: 'This application is already boosted' },
        { status: 400 }
      );
    }

    // ── Check if fee already exists ──
    const existingFee = await ChallengeFee.findOne({
      applicationId,
      status: { $in: ['created', 'held'] },
    });

    if (existingFee) {
      // If order was created but not paid, return existing order
      if (existingFee.status === 'created') {
        return NextResponse.json({
          success: true,
          orderId: existingFee.razorpayOrderId,
          amount: existingFee.amount * 100,
          currency: 'INR',
          feeId: existingFee._id,
        });
      }

      return NextResponse.json(
        { error: 'Challenge fee already paid for this application' },
        { status: 400 }
      );
    }

    const amount = application.jobId.challengeFeeAmount || 500;

    // ── Create Razorpay Order ──
    const order = await razorpay.orders.create({
      amount: amount * 100, // Razorpay expects paise (₹500 = 50000 paise)
      currency: 'INR',
      receipt: `receipt_app_${applicationId}`,
      notes: {
        applicationId: applicationId.toString(),
        applicantId: auth.userId.toString(),
        jobId: application.jobId._id.toString(),
      },
    });

    console.log('✅ Razorpay order created:', order.id);

    // ── Save to DB ──
    const challengeFee = await ChallengeFee.create({
      applicationId,
      applicantId: auth.userId,
      jobId: application.jobId._id,
      amount,
      razorpayOrderId: order.id,
      status: 'created',
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      feeId: challengeFee._id,
    });
  } catch (error) {
    console.error('Create order error:', error);
    return NextResponse.json(
      { error: 'Failed to create payment order' },
      { status: 500 }
    );
  }
}
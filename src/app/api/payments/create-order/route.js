export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import razorpay from '@/lib/razorpay';
import Application from '@/models/Application';
import Job from '@/models/Job';
import User from '@/models/User';
import ChallengeFee from '@/models/ChallengeFee';
import { authenticate } from '@/lib/auth';
import { createLog, getIP } from '@/lib/logger';

export async function POST(request) {
  try {
    const auth = await authenticate(request);
    if (auth.error) return auth.error;

    await connectDB();
    const ip = getIP(request);

    // ✅ Verify user is an applicant
    const user = await User.findById(auth.userId);
    if (!user || user.role !== 'applicant') {
      await createLog({
        action: 'payment_failed',
        userId: auth.userId,
        description: 'Non-applicant tried to create payment order',
        metadata: { role: user?.role },
        ip,
        status: 'failed',
      });
      return NextResponse.json(
        { error: 'Only applicants can boost applications' },
        { status: 403 }
      );
    }

    const { applicationId } = await request.json();

    if (!applicationId) {
      return NextResponse.json(
        { error: 'Application ID is required' },
        { status: 400 }
      );
    }

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

    if (application.isPriority) {
      return NextResponse.json(
        { error: 'This application is already boosted' },
        { status: 400 }
      );
    }

    // ✅ Check job is still active
    if (application.jobId.status !== 'active') {
      return NextResponse.json(
        { error: 'This job is no longer accepting applications' },
        { status: 400 }
      );
    }

    // ✅ Only pending applications can be boosted
    if (application.status !== 'pending') {
      return NextResponse.json(
        { error: 'Can only boost pending applications' },
        { status: 400 }
      );
    }

    const existingFee = await ChallengeFee.findOne({
      applicationId,
      status: { $in: ['created', 'held'] },
    });

    if (existingFee) {
      if (existingFee.status === 'created') {
        // ✅ Clean stale orders (older than 30 min)
        const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
        if (existingFee.createdAt < thirtyMinutesAgo) {
          await ChallengeFee.deleteOne({ _id: existingFee._id });
          console.log('🧹 Stale order cleaned:', existingFee.razorpayOrderId);
        } else {
          return NextResponse.json({
            success: true,
            orderId: existingFee.razorpayOrderId,
            amount: existingFee.amount * 100,
            currency: 'INR',
            feeId: existingFee._id,
          });
        }
      } else {
        return NextResponse.json(
          { error: 'Challenge fee already paid for this application' },
          { status: 400 }
        );
      }
    }

    // ✅ Amount validation
    const amount = application.jobId.challengeFeeAmount || 500;
    if (amount < 1 || amount > 50000) {
      return NextResponse.json(
        { error: 'Invalid challenge fee amount' },
        { status: 400 }
      );
    }

    const order = await razorpay.orders.create({
      amount: amount * 100,
      currency: 'INR',
      receipt: `receipt_app_${applicationId}`,
      notes: {
        applicationId: applicationId.toString(),
        applicantId: auth.userId.toString(),
        jobId: application.jobId._id.toString(),
      },
    });

    const challengeFee = await ChallengeFee.create({
      applicationId,
      applicantId: auth.userId,
      jobId: application.jobId._id,
      amount,
      razorpayOrderId: order.id,
      status: 'created',
    });

    // ✅ Log payment order creation
    await createLog({
      action: 'payment_order_created',
      userId: auth.userId,
      targetId: challengeFee._id,
      targetModel: 'ChallengeFee',
      description: `Payment order ₹${amount} created for ${application.jobId.title}`,
      metadata: {
        amount,
        orderId: order.id,
        jobTitle: application.jobId.title,
        applicationId,
      },
      ip,
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
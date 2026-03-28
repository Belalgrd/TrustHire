// src/app/api/logs/route.js
export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Log from '@/models/Log';
import User from '@/models/User';
import { authenticate } from '@/lib/auth';

// ── GET Logs (Recruiter can see their own, or admin) ──
export async function GET(request) {
  try {
    const auth = await authenticate(request);
    if (auth.error) return auth.error;

    await connectDB();

    const user = await User.findById(auth.userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 30;
    const action = searchParams.get('action') || '';
    const status = searchParams.get('status') || '';
    const skip = (page - 1) * limit;

    // Users can only see their own logs
    const filter = { userId: auth.userId };

    if (action) {
      filter.action = action;
    }
    if (status) {
      filter.status = status;
    }

    const [logs, total] = await Promise.all([
      Log.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Log.countDocuments(filter),
    ]);

    return NextResponse.json({
      success: true,
      logs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get logs error:', error);
    return NextResponse.json(
      { error: 'Failed to get logs' },
      { status: 500 }
    );
  }
}
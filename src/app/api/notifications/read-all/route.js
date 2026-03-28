// src/app/api/notifications/read-all/route.js
export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Notification from '@/models/Notification';
import { authenticate } from '@/lib/auth';

// ── MARK ALL as read ──
export async function PATCH(request) {
  try {
    const auth = await authenticate(request);
    if (auth.error) return auth.error;

    await connectDB();

    await Notification.updateMany(
      { userId: auth.userId, read: false },
      { read: true }
    );

    return NextResponse.json({
      success: true,
      message: 'All notifications marked as read',
    });
  } catch (error) {
    console.error('Mark all read error:', error);
    return NextResponse.json(
      { error: 'Failed to update' },
      { status: 500 }
    );
  }
}
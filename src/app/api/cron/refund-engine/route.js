export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { processRefunds } from '@/lib/refundEngine';

// ── CRON: Process refunds (called by Vercel Cron or manually) ──
export async function GET(request) {
  try {
    // Verify cron secret (optional security)
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get('secret');

    if (
      process.env.CRON_SECRET &&
      secret !== process.env.CRON_SECRET
    ) {
      // Allow without secret in development
      if (process.env.NODE_ENV === 'production') {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        );
      }
    }

    console.log('⏰ Refund engine triggered');

    const result = await processRefunds();

    console.log('✅ Refund engine complete:', result);

    return NextResponse.json({
      success: true,
      message: 'Refund engine processed',
      result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('❌ Refund engine error:', error);
    return NextResponse.json(
      { error: 'Refund engine failed', details: error.message },
      { status: 500 }
    );
  }
}
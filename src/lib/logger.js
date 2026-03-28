// src/lib/logger.js
import Log from '@/models/Log';

export async function createLog({
  action,
  userId = null,
  targetId = null,
  targetModel = null,
  description,
  metadata = {},
  ip = '',
  status = 'success',
}) {
  try {
    const log = await Log.create({
      action,
      userId,
      targetId,
      targetModel,
      description,
      metadata,
      ip,
      status,
    });
    console.log(`📝 Log: [${status.toUpperCase()}] ${action} — ${description}`);
    return log;
  } catch (error) {
    console.error('📝 Log creation failed:', error.message);
    return null;
  }
}

// Helper to extract IP from request
export function getIP(request) {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}
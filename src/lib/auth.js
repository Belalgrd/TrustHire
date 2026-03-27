import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRE = process.env.JWT_EXPIRE || '7d';

// Generate JWT token
export function generateToken(userId) {
  return jwt.sign({ id: userId }, JWT_SECRET, {
    expiresIn: JWT_EXPIRE,
  });
}

// Verify JWT token and return user id
export function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return { id: decoded.id };
  } catch (error) {
    return null;
  }
}

// Extract token from request headers
export function getTokenFromHeaders(request) {
  const authHeader = request.headers.get('authorization');

  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.split(' ')[1];
  }

  return null;
}

// Auth middleware for API routes
export async function authenticate(request) {
  const token = getTokenFromHeaders(request);

  if (!token) {
    return {
      error: NextResponse.json(
        { error: 'Access denied. No token provided.' },
        { status: 401 }
      ),
    };
  }

  const decoded = verifyToken(token);

  if (!decoded) {
    return {
      error: NextResponse.json(
        { error: 'Invalid or expired token.' },
        { status: 401 }
      ),
    };
  }

  return { userId: decoded.id };
}
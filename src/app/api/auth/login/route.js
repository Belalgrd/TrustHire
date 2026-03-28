export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { generateToken } from '@/lib/auth';
import { createLog, getIP } from '@/lib/logger';

export async function POST(request) {
  try {
    await connectDB();
    const ip = getIP(request);

    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      // ✅ LOG: LOGIN FAILED — user not found
      await createLog({
        action: 'user_login_failed',
        description: `Failed login attempt — email not found: ${email}`,
        metadata: { email },
        ip,
        status: 'failed',
      });

      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      // ✅ LOG: LOGIN FAILED — wrong password
      await createLog({
        action: 'user_login_failed',
        userId: user._id,
        description: `Failed login attempt — wrong password: ${user.name} (${email})`,
        metadata: { email },
        ip,
        status: 'failed',
      });

      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const token = generateToken(user._id);

    // ✅ LOG: LOGIN SUCCESS
    await createLog({
      action: 'user_login',
      userId: user._id,
      description: `User logged in: ${user.name} (${email})`,
      metadata: { email, role: user.role },
      ip,
    });

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profile: user.profile,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Server error. Please try again.' },
      { status: 500 }
    );
  }
}
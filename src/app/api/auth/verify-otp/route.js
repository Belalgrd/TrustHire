import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import Otp from '@/models/Otp';
import { generateToken } from '@/lib/auth';

export async function POST(request) {
  try {
    await connectDB();

    const { name, email, password, role, otp } = await request.json();

    // ── Validation ──
    if (!name || !email || !password || !role || !otp) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // ── Find OTP record ──
    const otpRecord = await Otp.findOne({
      email: email.toLowerCase(),
      purpose: 'register',
    }).sort({ createdAt: -1 });

    if (!otpRecord) {
      return NextResponse.json(
        { error: 'No verification code found. Please request a new one.' },
        { status: 400 }
      );
    }

    // ── Check if expired ──
    if (new Date() > otpRecord.expiresAt) {
      await Otp.deleteOne({ _id: otpRecord._id });
      return NextResponse.json(
        { error: 'Verification code expired. Please request a new one.' },
        { status: 400 }
      );
    }

    // ── Check max attempts (5) ──
    if (otpRecord.attempts >= 5) {
      await Otp.deleteOne({ _id: otpRecord._id });
      return NextResponse.json(
        { error: 'Too many wrong attempts. Please request a new code.' },
        { status: 400 }
      );
    }

    // ── Verify OTP ──
    if (otpRecord.otp !== otp.trim()) {
      otpRecord.attempts += 1;
      await otpRecord.save();
      return NextResponse.json(
        {
          error: `Incorrect code. ${5 - otpRecord.attempts} attempts remaining.`,
        },
        { status: 400 }
      );
    }

    // ── OTP is correct — Check if user already exists (double check) ──
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      await Otp.deleteOne({ _id: otpRecord._id });
      return NextResponse.json(
        { error: 'Email already registered. Please login.' },
        { status: 400 }
      );
    }

    // ── Create user ──
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role,
    });

    // ── Clean up OTP ──
    await Otp.deleteMany({ email: email.toLowerCase(), purpose: 'register' });

    // ── Generate token ──
    const token = generateToken(user._id);

    return NextResponse.json(
      {
        success: true,
        message: 'Account created successfully!',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          profile: user.profile,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Verify OTP error:', error);

    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Server error. Please try again.' },
      { status: 500 }
    );
  }
}
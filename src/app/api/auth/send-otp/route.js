import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import Otp from '@/models/Otp';
import resend from '@/lib/resend';
import { generateOtpEmail } from '@/emails/otpEmail';

export async function POST(request) {
  try {
    await connectDB();

    const { name, email, password, role } = await request.json();

    // ── Validation ──
    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    if (!['applicant', 'recruiter'].includes(role)) {
      return NextResponse.json(
        { error: 'Role must be applicant or recruiter' },
        { status: 400 }
      );
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email' },
        { status: 400 }
      );
    }

    // ── Check if email already registered ──
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered. Please login.' },
        { status: 400 }
      );
    }

    // ── Rate limit: Max 3 OTPs per email in 10 minutes ──
    const recentOtps = await Otp.countDocuments({
      email: email.toLowerCase(),
      createdAt: { $gte: new Date(Date.now() - 10 * 60 * 1000) },
    });

    if (recentOtps >= 3) {
      return NextResponse.json(
        { error: 'Too many attempts. Please wait 10 minutes.' },
        { status: 429 }
      );
    }

    // ── Generate 6-digit OTP ──
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // ── Delete previous OTPs for this email ──
    await Otp.deleteMany({ email: email.toLowerCase(), purpose: 'register' });

    // ── Save OTP (expires in 10 minutes) ──
    await Otp.create({
      email: email.toLowerCase(),
      otp,
      purpose: 'register',
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });

    // ── Send email via Resend ──
    const emailContent = generateOtpEmail(name, otp);

    await resend.emails.send({
      from: 'TrustHire <onboarding@resend.dev>',
      to: email,
      subject: emailContent.subject,
      html: emailContent.html,
    });

    return NextResponse.json({
      success: true,
      message: 'Verification code sent to your email',
    });
  } catch (error) {
    console.error('Send OTP error:', error);
    return NextResponse.json(
      { error: 'Failed to send verification code. Please try again.' },
      { status: 500 }
    );
  }
}
export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import Otp from '@/models/Otp';
import { generateToken } from '@/lib/auth';
import { sendEmail } from '@/lib/resend';
import { welcomeEmail } from '@/emails/welcomeEmail';

export async function POST(request) {
  try {
    await connectDB();

    const { name, email, password, role, otp } = await request.json();

    if (!name || !email || !password || !role || !otp) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

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

    if (new Date() > otpRecord.expiresAt) {
      await Otp.deleteOne({ _id: otpRecord._id });
      return NextResponse.json(
        { error: 'Verification code expired. Please request a new one.' },
        { status: 400 }
      );
    }

    if (otpRecord.attempts >= 5) {
      await Otp.deleteOne({ _id: otpRecord._id });
      return NextResponse.json(
        { error: 'Too many wrong attempts. Please request a new code.' },
        { status: 400 }
      );
    }

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

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      await Otp.deleteOne({ _id: otpRecord._id });
      return NextResponse.json(
        { error: 'Email already registered. Please login.' },
        { status: 400 }
      );
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role,
    });

    await Otp.deleteMany({ email: email.toLowerCase(), purpose: 'register' });

    const token = generateToken(user._id);

    // ✅ SEND WELCOME EMAIL
    try {
      const emailContent = welcomeEmail({ name, role });
      await sendEmail({
        to: email.toLowerCase(),
        subject: emailContent.subject,
        html: emailContent.html,
      });
      console.log('📧 Welcome email sent to:', email);
    } catch (emailError) {
      console.error('📧 Welcome email failed:', emailError);
      // Don't fail registration if email fails
    }

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
// src/app/api/auth/profile/route.js
import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { authenticate } from '@/lib/auth';

// ── GET Profile ──
export async function GET(request) {
  try {
    const auth = await authenticate(request);
    if (auth.error) return auth.error;

    await connectDB();

    const user = await User.findById(auth.userId);

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: user.toJSON(),
    });
  } catch (error) {
    console.error('Get profile error:', error);
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    );
  }
}

// ── PUT Update Profile ──
export async function PUT(request) {
  try {
    const auth = await authenticate(request);
    if (auth.error) return auth.error;

    await connectDB();

    const body = await request.json();
    const { name, bio, phone, location, skills, resumeUrl, company, website } = body;

    const user = await User.findById(auth.userId);

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Update name (with validation)
    if (name !== undefined) {
      const trimmedName = name.trim();
      if (trimmedName.length === 0) {
        return NextResponse.json(
          { success: false, error: 'Name cannot be empty' },
          { status: 400 }
        );
      }
      if (trimmedName.length > 50) {
        return NextResponse.json(
          { success: false, error: 'Name cannot exceed 50 characters' },
          { status: 400 }
        );
      }
      user.name = trimmedName;
    }

    // Update profile fields
    if (bio !== undefined) {
      if (bio.length > 500) {
        return NextResponse.json(
          { success: false, error: 'Bio cannot exceed 500 characters' },
          { status: 400 }
        );
      }
      user.profile.bio = bio.trim();
    }

    if (phone !== undefined) {
      user.profile.phone = phone.trim();
    }

    if (location !== undefined) {
      user.profile.location = location.trim();
    }

    if (website !== undefined) {
      user.profile.website = website.trim();
    }

    // Applicant-only fields
    if (user.role === 'applicant') {
      if (skills !== undefined) {
        if (!Array.isArray(skills)) {
          return NextResponse.json(
            { success: false, error: 'Skills must be an array' },
            { status: 400 }
          );
        }
        if (skills.length > 20) {
          return NextResponse.json(
            { success: false, error: 'Maximum 20 skills allowed' },
            { status: 400 }
          );
        }
        user.profile.skills = skills.map((s) => s.trim()).filter(Boolean);
      }

      if (resumeUrl !== undefined) {
        user.profile.resumeUrl = resumeUrl.trim();
      }
    }

    // Recruiter-only fields
    if (user.role === 'recruiter') {
      if (company !== undefined) {
        user.profile.company = company.trim();
      }
    }

    await user.save();

    return NextResponse.json({
      success: true,
      user: user.toJSON(),
    });
  } catch (error) {
    console.error('Update profile error:', error);

    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return NextResponse.json(
        { success: false, error: messages[0] },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    );
  }
}
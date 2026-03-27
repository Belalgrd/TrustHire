import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Job from '@/models/Job';
import User from '@/models/User';
import { authenticate } from '@/lib/auth';

// ── GET SINGLE JOB (Public) ──
export async function GET(request, { params }) {
  try {
    await connectDB();

    const { id } = params;

    const job = await Job.findById(id)
      .populate('recruiterId', 'name email profile.company profile.avatar profile.website')
      .lean();

    if (!job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      job,
    });
  } catch (error) {
    console.error('Get job error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch job' },
      { status: 500 }
    );
  }
}

// ── UPDATE JOB (Recruiter Owner Only) ──
export async function PUT(request, { params }) {
  try {
    const auth = await authenticate(request);
    if (auth.error) return auth.error;

    await connectDB();

    const { id } = params;

    const job = await Job.findById(id);

    if (!job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }

    // Check ownership
    if (job.recruiterId.toString() !== auth.userId) {
      return NextResponse.json(
        { error: 'You can only edit your own jobs' },
        { status: 403 }
      );
    }

    const body = await request.json();

    const allowedUpdates = [
      'title',
      'company',
      'description',
      'requirements',
      'location',
      'locationType',
      'jobType',
      'experienceLevel',
      'skills',
      'salary',
      'challengeFeeAmount',
      'reviewWindowDays',
      'status',
    ];

    allowedUpdates.forEach((field) => {
      if (body[field] !== undefined) {
        job[field] = body[field];
      }
    });

    await job.save();

    return NextResponse.json({
      success: true,
      message: 'Job updated successfully!',
      job,
    });
  } catch (error) {
    console.error('Update job error:', error);
    return NextResponse.json(
      { error: 'Failed to update job' },
      { status: 500 }
    );
  }
}

// ── DELETE JOB (Recruiter Owner Only) ──
export async function DELETE(request, { params }) {
  try {
    const auth = await authenticate(request);
    if (auth.error) return auth.error;

    await connectDB();

    const { id } = params;

    const job = await Job.findById(id);

    if (!job) {
      return NextResponse.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }

    // Check ownership
    if (job.recruiterId.toString() !== auth.userId) {
      return NextResponse.json(
        { error: 'You can only delete your own jobs' },
        { status: 403 }
      );
    }

    await Job.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: 'Job deleted successfully!',
    });
  } catch (error) {
    console.error('Delete job error:', error);
    return NextResponse.json(
      { error: 'Failed to delete job' },
      { status: 500 }
    );
  }
}
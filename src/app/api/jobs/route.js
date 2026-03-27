import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Job from '@/models/Job';
import User from '@/models/User';
import { authenticate } from '@/lib/auth';

// ── GET ALL JOBS (Public) ──
export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);

    // Filters
    const search = searchParams.get('search') || '';
    const location = searchParams.get('location') || '';
    const locationType = searchParams.get('locationType') || '';
    const jobType = searchParams.get('jobType') || '';
    const experienceLevel = searchParams.get('experienceLevel') || '';
    const skills = searchParams.get('skills') || '';
    const minSalary = searchParams.get('minSalary') || '';
    const sortBy = searchParams.get('sortBy') || 'newest';
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 12;

    // Build query
    const query = { status: 'active' };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    if (locationType) {
      query.locationType = locationType;
    }

    if (jobType) {
      query.jobType = jobType;
    }

    if (experienceLevel) {
      query.experienceLevel = experienceLevel;
    }

    if (skills) {
      const skillsArray = skills.split(',').map((s) => s.trim());
      query.skills = { $in: skillsArray };
    }

    if (minSalary) {
      query['salary.max'] = { $gte: parseInt(minSalary) };
    }

    // Sort
    let sort = {};
    switch (sortBy) {
      case 'newest':
        sort = { createdAt: -1 };
        break;
      case 'oldest':
        sort = { createdAt: 1 };
        break;
      case 'salary-high':
        sort = { 'salary.max': -1 };
        break;
      case 'salary-low':
        sort = { 'salary.min': 1 };
        break;
      default:
        sort = { createdAt: -1 };
    }

    // Pagination
    const skip = (page - 1) * limit;

    const [jobs, total] = await Promise.all([
      Job.find(query)
        .populate('recruiterId', 'name email profile.company profile.avatar')
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Job.countDocuments(query),
    ]);

    return NextResponse.json({
      success: true,
      jobs,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasMore: page * limit < total,
      },
    });
  } catch (error) {
    console.error('Get jobs error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch jobs' },
      { status: 500 }
    );
  }
}

// ── CREATE JOB (Recruiter Only) ──
export async function POST(request) {
  try {
    const auth = await authenticate(request);
    if (auth.error) return auth.error;

    await connectDB();

    // Check if user is recruiter
    const user = await User.findById(auth.userId);
    if (!user || user.role !== 'recruiter') {
      return NextResponse.json(
        { error: 'Only recruiters can post jobs' },
        { status: 403 }
      );
    }

    const body = await request.json();

    const {
      title,
      company,
      description,
      requirements,
      location,
      locationType,
      jobType,
      experienceLevel,
      skills,
      salary,
      challengeFeeAmount,
      reviewWindowDays,
    } = body;

    // Validation
    if (!title || !company || !description || !location) {
      return NextResponse.json(
        { error: 'Title, company, description, and location are required' },
        { status: 400 }
      );
    }

    // Create job
    const job = await Job.create({
      recruiterId: auth.userId,
      title,
      company,
      description,
      requirements: requirements || '',
      location,
      locationType: locationType || 'remote',
      jobType: jobType || 'full-time',
      experienceLevel: experienceLevel || 'any',
      skills: skills || [],
      salary: salary || { min: 0, max: 0, currency: 'INR', period: 'yearly' },
      challengeFeeAmount: challengeFeeAmount || 500,
      reviewWindowDays: reviewWindowDays || 14,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Job posted successfully!',
        job,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create job error:', error);
    return NextResponse.json(
      { error: 'Failed to create job' },
      { status: 500 }
    );
  }
}
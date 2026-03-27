"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import Loader from '@/components/common/Loader';
import {
  HiBriefcase,
  HiUsers,
  HiStar,
  HiCheckCircle,
  HiXCircle,
  HiPlus,
} from 'react-icons/hi';

export default function RecruiterDashboard() {
  const { user, token } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentJobs, setRecentJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      // Fetch my jobs
      const res = await fetch('/api/jobs/my', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (data.success) {
        const jobs = data.jobs;
        setRecentJobs(jobs.slice(0, 5));

        // Calculate stats
        setStats({
          totalJobs: jobs.length,
          activeJobs: jobs.filter((j) => j.status === 'active').length,
          totalApplicants: jobs.reduce(
            (sum, j) => sum + (j.applicationsCount || 0),
            0
          ),
          priorityApplicants: jobs.reduce(
            (sum, j) => sum + (j.priorityApplicantsCount || 0),
            0
          ),
        });
      }
    } catch (error) {
      console.error('Dashboard error:', error);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader size="lg" text="Loading dashboard..." />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {user?.name} 👋
          </h1>
          <p className="text-gray-600 mt-1">
            Here&apos;s an overview of your recruitment activity
          </p>
        </div>
        <Link
          href="/recruiter/jobs/create"
          className="mt-4 md:mt-0 bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-all inline-flex items-center gap-2"
        >
          <HiPlus className="w-5 h-5" />
          Post New Job
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
              <HiBriefcase className="w-5 h-5 text-indigo-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {stats?.totalJobs || 0}
          </p>
          <p className="text-sm text-gray-500">Total Jobs</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <HiCheckCircle className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {stats?.activeJobs || 0}
          </p>
          <p className="text-sm text-gray-500">Active Jobs</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <HiUsers className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {stats?.totalApplicants || 0}
          </p>
          <p className="text-sm text-gray-500">Total Applicants</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
              <HiStar className="w-5 h-5 text-amber-600" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {stats?.priorityApplicants || 0}
          </p>
          <p className="text-sm text-gray-500">Priority Applicants</p>
        </div>
      </div>

      {/* Recent Jobs */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-900">Recent Jobs</h2>
          <Link
            href="/recruiter/jobs"
            className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
          >
            View all →
          </Link>
        </div>

        {recentJobs.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-3">📝</div>
            <p className="text-gray-500">No jobs posted yet</p>
            <Link
              href="/recruiter/jobs/create"
              className="inline-block mt-4 text-indigo-600 font-medium hover:text-indigo-700"
            >
              Post your first job →
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {recentJobs.map((job) => (
              <Link
                key={job._id}
                href={`/recruiter/jobs/${job._id}/applicants`}
                className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-all group"
              >
                <div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                    {job.title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {job.company} • {job.location}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {job.applicationsCount || 0} applicants
                  </p>
                  {(job.priorityApplicantsCount || 0) > 0 && (
                    <p className="text-xs text-amber-600">
                      ⭐ {job.priorityApplicantsCount} priority
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
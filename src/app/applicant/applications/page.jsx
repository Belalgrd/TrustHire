"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { timeAgo } from '@/utils/formatDate';
import { formatSalary } from '@/utils/formatCurrency';
import Loader from '@/components/common/Loader';
import { HiStar, HiBriefcase, HiLocationMarker } from 'react-icons/hi';

export default function MyApplicationsPage() {
  const { token } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await fetch('/api/applications/my', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setApplications(data.applications);
      }
    } catch (error) {
      console.error('Fetch applications error:', error);
    }
    setLoading(false);
  };

  const statusConfig = {
    pending: { label: 'Pending Review', color: 'bg-gray-100 text-gray-600', emoji: '⏳' },
    reviewing: { label: 'Being Reviewed', color: 'bg-blue-50 text-blue-600', emoji: '👀' },
    interview_invited: { label: 'Interview Invited!', color: 'bg-purple-50 text-purple-700', emoji: '📞' },
    interview_attended: { label: 'Interview Done', color: 'bg-green-50 text-green-600', emoji: '✅' },
    interview_no_show: { label: 'No Show', color: 'bg-red-50 text-red-600', emoji: '❌' },
    rejected: { label: 'Rejected', color: 'bg-red-50 text-red-500', emoji: '😔' },
    hired: { label: 'Hired! 🎉', color: 'bg-green-50 text-green-700', emoji: '🎉' },
    expired: { label: 'Expired', color: 'bg-gray-100 text-gray-400', emoji: '⏰' },
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader size="lg" text="Loading applications..." />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        My Applications
      </h1>
      <p className="text-gray-600 mb-8">
        {applications.length} application{applications.length !== 1 ? 's' : ''}{' '}
        submitted
      </p>

      {applications.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
          <div className="text-5xl mb-4">📋</div>
          <h3 className="text-lg font-semibold text-gray-900">
            No applications yet
          </h3>
          <p className="text-gray-500 mt-2">
            Start applying for jobs to track them here.
          </p>
          <Link
            href="/jobs"
            className="inline-block mt-6 bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-all"
          >
            Browse Jobs →
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => {
            const status = statusConfig[app.status] || statusConfig.pending;
            const job = app.jobId;

            return (
              <div
                key={app._id}
                className="bg-white rounded-2xl border border-gray-200 p-6 hover:border-indigo-200 transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <Link
                        href={`/jobs/${job?._id}`}
                        className="text-lg font-bold text-gray-900 hover:text-indigo-600 transition-colors"
                      >
                        {job?.title || 'Job Removed'}
                      </Link>
                      {app.isPriority && (
                        <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full text-xs font-medium">
                          <HiStar className="w-3 h-3" /> Priority
                        </span>
                      )}
                    </div>

                    <p className="text-indigo-600 font-medium text-sm">
                      {job?.company}
                    </p>

                    <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <HiLocationMarker className="w-3 h-3" />
                        {job?.location}
                      </span>
                      <span className="flex items-center gap-1 capitalize">
                        <HiBriefcase className="w-3 h-3" />
                        {job?.jobType}
                      </span>
                      <span>Applied {timeAgo(app.createdAt)}</span>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div className="flex-shrink-0">
                    <span
                      className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold ${status.color}`}
                    >
                      {status.emoji} {status.label}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
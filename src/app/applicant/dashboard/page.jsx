"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import Loader from '@/components/common/Loader';
import {
  HiBriefcase,
  HiStar,
  HiCurrencyRupee,
  HiCheckCircle,
  HiClock,
  HiSearch,
} from 'react-icons/hi';

export default function ApplicantDashboard() {
  const { user, token } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentApps, setRecentApps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      // Fetch applications
      const appRes = await fetch('/api/applications/my', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const appData = await appRes.json();

      // Fetch deposits
      const depRes = await fetch('/api/payments/my-deposits', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const depData = await depRes.json();

      if (appData.success) {
        const apps = appData.applications;
        setRecentApps(apps.slice(0, 5));

        setStats({
          totalApplications: apps.length,
          pendingReview: apps.filter((a) => a.status === 'pending').length,
          interviewInvites: apps.filter(
            (a) => a.status === 'interview_invited'
          ).length,
          priorityApps: apps.filter((a) => a.isPriority).length,
          totalDeposited: depData.success ? depData.summary.totalHeld : 0,
          totalRefunded: depData.success ? depData.summary.totalRefunded : 0,
        });
      }
    } catch (error) {
      console.error('Dashboard error:', error);
    }
    setLoading(false);
  };

  const statusConfig = {
    pending: { label: 'Pending', emoji: '⏳', color: 'text-gray-500' },
    reviewing: { label: 'Reviewing', emoji: '👀', color: 'text-blue-500' },
    interview_invited: { label: 'Invited!', emoji: '📞', color: 'text-purple-600' },
    interview_attended: { label: 'Attended', emoji: '✅', color: 'text-green-500' },
    rejected: { label: 'Rejected', emoji: '😔', color: 'text-red-500' },
    hired: { label: 'Hired!', emoji: '🎉', color: 'text-green-700' },
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
            Track your job search progress
          </p>
        </div>
        <Link
          href="/jobs"
          className="mt-4 md:mt-0 bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-all inline-flex items-center gap-2"
        >
          <HiSearch className="w-5 h-5" />
          Browse Jobs
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <HiBriefcase className="w-6 h-6 text-indigo-500 mb-2" />
          <p className="text-2xl font-bold text-gray-900">
            {stats?.totalApplications || 0}
          </p>
          <p className="text-xs text-gray-500">Applied</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <HiClock className="w-6 h-6 text-yellow-500 mb-2" />
          <p className="text-2xl font-bold text-gray-900">
            {stats?.pendingReview || 0}
          </p>
          <p className="text-xs text-gray-500">Pending</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <HiCheckCircle className="w-6 h-6 text-purple-500 mb-2" />
          <p className="text-2xl font-bold text-gray-900">
            {stats?.interviewInvites || 0}
          </p>
          <p className="text-xs text-gray-500">Interviews</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <HiStar className="w-6 h-6 text-amber-500 mb-2" />
          <p className="text-2xl font-bold text-gray-900">
            {stats?.priorityApps || 0}
          </p>
          <p className="text-xs text-gray-500">Boosted</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <HiCurrencyRupee className="w-6 h-6 text-yellow-600 mb-2" />
          <p className="text-2xl font-bold text-gray-900">
            ₹{stats?.totalDeposited || 0}
          </p>
          <p className="text-xs text-gray-500">Held</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-5">
          <HiCurrencyRupee className="w-6 h-6 text-green-500 mb-2" />
          <p className="text-2xl font-bold text-gray-900">
            ₹{stats?.totalRefunded || 0}
          </p>
          <p className="text-xs text-gray-500">Refunded</p>
        </div>
      </div>

      {/* Recent Applications */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-900">
            Recent Applications
          </h2>
          <Link
            href="/applicant/applications"
            className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
          >
            View all →
          </Link>
        </div>

        {recentApps.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-4xl mb-3">📋</div>
            <p className="text-gray-500">No applications yet</p>
            <Link
              href="/jobs"
              className="inline-block mt-4 text-indigo-600 font-medium hover:text-indigo-700"
            >
              Browse jobs →
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {recentApps.map((app) => {
              const status =
                statusConfig[app.status] || statusConfig.pending;
              return (
                <div
                  key={app._id}
                  className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-all"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900">
                        {app.jobId?.title || 'Job Removed'}
                      </h3>
                      {app.isPriority && (
                        <span className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full">
                          ⭐ Priority
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">
                      {app.jobId?.company}
                    </p>
                  </div>
                  <span className={`text-sm font-medium ${status.color}`}>
                    {status.emoji} {status.label}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
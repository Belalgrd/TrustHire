"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { timeAgo } from '@/utils/formatDate';
import { formatSalary } from '@/utils/formatCurrency';
import Loader from '@/components/common/Loader';
import toast from 'react-hot-toast';
import {
  HiPlus,
  HiPencil,
  HiTrash,
  HiEye,
  HiUsers,
  HiStar,
} from 'react-icons/hi';

export default function MyJobsPage() {
  const { token } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyJobs();
  }, []);

  const fetchMyJobs = async () => {
    try {
      const res = await fetch('/api/jobs/my', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setJobs(data.jobs);
      }
    } catch (error) {
      console.error('Fetch my jobs error:', error);
    }
    setLoading(false);
  };

  const handleDelete = async (jobId) => {
    if (!confirm('Are you sure you want to delete this job?')) return;

    try {
      const res = await fetch(`/api/jobs/${jobId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Job deleted');
        setJobs(jobs.filter((j) => j._id !== jobId));
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const statusBadge = {
    active: 'bg-green-50 text-green-700',
    paused: 'bg-yellow-50 text-yellow-700',
    closed: 'bg-gray-100 text-gray-500',
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader size="lg" text="Loading your jobs..." />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Jobs</h1>
          <p className="text-gray-600 mt-1">
            {jobs.length} job{jobs.length !== 1 ? 's' : ''} posted
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

      {/* Jobs List */}
      {jobs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
          <div className="text-5xl mb-4">📝</div>
          <h3 className="text-lg font-semibold text-gray-900">
            No jobs posted yet
          </h3>
          <p className="text-gray-500 mt-2">
            Post your first job to start finding committed candidates.
          </p>
          <Link
            href="/recruiter/jobs/create"
            className="inline-block mt-6 bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-all"
          >
            Post Your First Job →
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="bg-white rounded-2xl border border-gray-200 p-6 hover:border-indigo-200 transition-all"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                {/* Job Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-gray-900">
                      {job.title}
                    </h3>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                        statusBadge[job.status]
                      }`}
                    >
                      {job.status}
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm">
                    {job.company} • {job.location} • {job.jobType} •{' '}
                    {timeAgo(job.createdAt)}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center gap-4 mt-3">
                    <span className="flex items-center gap-1.5 text-sm text-gray-600">
                      <HiUsers className="w-4 h-4" />
                      {job.applicationsCount || 0} applicants
                    </span>
                    <span className="flex items-center gap-1.5 text-sm text-amber-600">
                      <HiStar className="w-4 h-4" />
                      {job.priorityApplicantsCount || 0} priority
                    </span>
                    <span className="text-sm text-gray-400">
                      ₹{job.challengeFeeAmount} fee
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Link
                    href={`/recruiter/jobs/${job._id}/applicants`}
                    className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-100 transition-all flex items-center gap-1.5"
                  >
                    <HiUsers className="w-4 h-4" />
                    Applicants
                  </Link>
                  <Link
                    href={`/jobs/${job._id}`}
                    className="bg-gray-50 text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition-all"
                    title="View"
                  >
                    <HiEye className="w-5 h-5" />
                  </Link>
                  <Link
                    href={`/recruiter/jobs/${job._id}/edit`}
                    className="bg-gray-50 text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition-all"
                    title="Edit"
                  >
                    <HiPencil className="w-5 h-5" />
                  </Link>
                  <button
                    onClick={() => handleDelete(job._id)}
                    className="bg-red-50 text-red-500 p-2 rounded-lg hover:bg-red-100 transition-all"
                    title="Delete"
                  >
                    <HiTrash className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
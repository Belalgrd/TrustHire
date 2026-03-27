"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { timeAgo } from '@/utils/formatDate';
import Loader from '@/components/common/Loader';
import toast from 'react-hot-toast';
import {
  HiStar,
  HiCheck,
  HiX,
  HiPhone,
  HiUserAdd,
  HiArrowLeft,
  HiMail,
} from 'react-icons/hi';

export default function JobApplicantsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { token } = useAuth();

  const [job, setJob] = useState(null);
  const [priorityApplicants, setPriorityApplicants] = useState([]);
  const [normalApplicants, setNormalApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('priority');

  useEffect(() => {
    fetchApplicants();
  }, [id]);

  const fetchApplicants = async () => {
    try {
      const res = await fetch(`/api/applications/job/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (data.success) {
        setJob(data.job);
        setPriorityApplicants(data.priorityApplicants);
        setNormalApplicants(data.normalApplicants);
      } else {
        toast.error(data.error);
        router.push('/recruiter/jobs');
      }
    } catch (error) {
      console.error('Fetch applicants error:', error);
    }
    setLoading(false);
  };

  const handleAction = async (applicationId, action) => {
    const confirmMessages = {
      invite: 'Send interview invite to this candidate?',
      reject: 'Reject this application?',
      attended: 'Mark as attended the interview?',
      'no-show': 'Mark as no-show? This will forfeit their challenge fee.',
      hire: 'Mark this candidate as hired? 🎉',
    };

    if (!confirm(confirmMessages[action])) return;

    try {
      const body = {};
      if (action === 'invite') {
        body.interviewDate = new Date(
          Date.now() + 7 * 24 * 60 * 60 * 1000
        ).toISOString();
      }

      const res = await fetch(`/api/applications/${applicationId}/${action}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (data.success) {
        toast.success(data.message);
        fetchApplicants();
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error('Action failed');
    }
  };

  const statusConfig = {
    pending: { label: 'Pending', color: 'bg-gray-100 text-gray-600' },
    reviewing: { label: 'Reviewing', color: 'bg-blue-50 text-blue-600' },
    interview_invited: { label: 'Invited', color: 'bg-purple-50 text-purple-600' },
    interview_attended: { label: 'Attended', color: 'bg-green-50 text-green-600' },
    interview_no_show: { label: 'No Show', color: 'bg-red-50 text-red-600' },
    rejected: { label: 'Rejected', color: 'bg-red-50 text-red-600' },
    hired: { label: 'Hired! 🎉', color: 'bg-green-50 text-green-700' },
  };

  const renderApplicant = (app) => {
    const status = statusConfig[app.status] || statusConfig.pending;

    return (
      <div
        key={app._id}
        className="bg-white rounded-xl border border-gray-200 p-5 hover:border-indigo-200 transition-all"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Applicant Info */}
          <div className="flex items-start gap-3 flex-1">
            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold flex-shrink-0">
              {app.applicantId?.name?.charAt(0)?.toUpperCase() || '?'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="font-semibold text-gray-900">
                  {app.applicantId?.name}
                </h4>
                {app.isPriority && (
                  <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full text-xs font-medium">
                    <HiStar className="w-3 h-3" /> Priority
                  </span>
                )}
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
                  {status.label}
                </span>
              </div>
              <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                <HiMail className="w-3 h-3" />
                {app.applicantId?.email}
              </p>
              {app.coverLetter && (
                <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                  &ldquo;{app.coverLetter}&rdquo;
                </p>
              )}
              <p className="text-xs text-gray-400 mt-2">
                Applied {timeAgo(app.createdAt)}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {app.status === 'pending' && (
              <>
                <button
                  onClick={() => handleAction(app._id, 'invite')}
                  className="bg-indigo-50 text-indigo-600 px-3 py-2 rounded-lg text-sm font-medium hover:bg-indigo-100 transition-all flex items-center gap-1"
                >
                  <HiPhone className="w-4 h-4" />
                  Invite
                </button>
                <button
                  onClick={() => handleAction(app._id, 'reject')}
                  className="bg-red-50 text-red-500 px-3 py-2 rounded-lg text-sm font-medium hover:bg-red-100 transition-all flex items-center gap-1"
                >
                  <HiX className="w-4 h-4" />
                  Reject
                </button>
              </>
            )}

            {app.status === 'interview_invited' && (
              <>
                <button
                  onClick={() => handleAction(app._id, 'attended')}
                  className="bg-green-50 text-green-600 px-3 py-2 rounded-lg text-sm font-medium hover:bg-green-100 transition-all flex items-center gap-1"
                >
                  <HiCheck className="w-4 h-4" />
                  Attended
                </button>
                <button
                  onClick={() => handleAction(app._id, 'no-show')}
                  className="bg-red-50 text-red-500 px-3 py-2 rounded-lg text-sm font-medium hover:bg-red-100 transition-all flex items-center gap-1"
                >
                  <HiX className="w-4 h-4" />
                  No Show
                </button>
              </>
            )}

            {app.status === 'interview_attended' && (
              <>
                <button
                  onClick={() => handleAction(app._id, 'hire')}
                  className="bg-green-50 text-green-600 px-3 py-2 rounded-lg text-sm font-medium hover:bg-green-100 transition-all flex items-center gap-1"
                >
                  <HiUserAdd className="w-4 h-4" />
                  Hire
                </button>
                <button
                  onClick={() => handleAction(app._id, 'reject')}
                  className="bg-red-50 text-red-500 px-3 py-2 rounded-lg text-sm font-medium hover:bg-red-100 transition-all flex items-center gap-1"
                >
                  <HiX className="w-4 h-4" />
                  Reject
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader size="lg" text="Loading applicants..." />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back */}
      <button
        onClick={() => router.push('/recruiter/jobs')}
        className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 mb-6 text-sm font-medium transition-colors"
      >
        <HiArrowLeft className="w-4 h-4" />
        Back to My Jobs
      </button>

      {/* Job Header */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
        <h1 className="text-xl font-bold text-gray-900">{job?.title}</h1>
        <p className="text-gray-500">
          {job?.company} • {priorityApplicants.length + normalApplicants.length}{' '}
          total applicants
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('priority')}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
            activeTab === 'priority'
              ? 'bg-amber-50 text-amber-700 border-2 border-amber-200'
              : 'bg-white text-gray-500 border-2 border-gray-200 hover:border-gray-300'
          }`}
        >
          <HiStar className="w-4 h-4" />
          Priority ({priorityApplicants.length})
        </button>
        <button
          onClick={() => setActiveTab('normal')}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
            activeTab === 'normal'
              ? 'bg-indigo-50 text-indigo-700 border-2 border-indigo-200'
              : 'bg-white text-gray-500 border-2 border-gray-200 hover:border-gray-300'
          }`}
        >
          All Applicants ({normalApplicants.length})
        </button>
      </div>

      {/* Applicants List */}
      <div className="space-y-3">
        {activeTab === 'priority' ? (
          priorityApplicants.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
              <div className="text-4xl mb-3">⭐</div>
              <p className="text-gray-500">No priority applicants yet</p>
              <p className="text-gray-400 text-sm mt-1">
                Candidates who pay the challenge fee will appear here first
              </p>
            </div>
          ) : (
            priorityApplicants.map(renderApplicant)
          )
        ) : normalApplicants.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
            <div className="text-4xl mb-3">📋</div>
            <p className="text-gray-500">No applicants yet</p>
          </div>
        ) : (
          normalApplicants.map(renderApplicant)
        )}
      </div>
    </div>
  );
}
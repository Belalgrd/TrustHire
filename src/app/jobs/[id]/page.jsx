"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { timeAgo, formatDate } from '@/utils/formatDate';
import { formatSalary } from '@/utils/formatCurrency';
import Loader from '@/components/common/Loader';
import RazorpayButton from '@/components/payments/RazorpayButton';
import toast from 'react-hot-toast';
import {
  HiLocationMarker,
  HiBriefcase,
  HiClock,
  HiStar,
  HiShieldCheck,
  HiArrowLeft,
  HiMail,
} from 'react-icons/hi';

export default function JobDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, token, isAuthenticated, isApplicant } = useAuth();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [showApplyForm, setShowApplyForm] = useState(false);

  // After applying
  const [applied, setApplied] = useState(false);
  const [applicationId, setApplicationId] = useState(null);
  const [isBoosted, setIsBoosted] = useState(false);

  useEffect(() => {
    fetchJob();
  }, [id]);

  const fetchJob = async () => {
    try {
      const res = await fetch(`/api/jobs/${id}`);
      const data = await res.json();

      if (data.success) {
        setJob(data.job);
      } else {
        toast.error('Job not found');
        router.push('/jobs');
      }
    } catch (error) {
      console.error('Fetch job error:', error);
    }
    setLoading(false);
  };

  // ── Free Apply ──
  const handleFreeApply = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to apply');
      router.push('/login');
      return;
    }

    if (!isApplicant) {
      toast.error('Only job seekers can apply');
      return;
    }

    setApplying(true);

    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          jobId: id,
          coverLetter: coverLetter.trim(),
        }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success('Application submitted! 🎉');
        setApplied(true);
        setApplicationId(data.application._id);
        setShowApplyForm(false);
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error('Failed to apply');
    }

    setApplying(false);
  };

  // ── Apply + Boost (Creates application first, then payment) ──
  const handleBoostApply = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to apply');
      router.push('/login');
      return;
    }

    if (!isApplicant) {
      toast.error('Only job seekers can apply');
      return;
    }

    setApplying(true);

    try {
      // First create the free application
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          jobId: id,
          coverLetter: coverLetter.trim(),
        }),
      });

      const data = await res.json();

      if (data.success) {
        setApplied(true);
        setApplicationId(data.application._id);
        setShowApplyForm(false);
        // Don't show success toast yet — payment will follow
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error('Failed to apply');
    }

    setApplying(false);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader size="lg" text="Loading job details..." />
      </div>
    );
  }

  if (!job) return null;

  const locationTypeEmoji = {
    remote: '🌍',
    onsite: '🏢',
    hybrid: '🔄',
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <button
        onClick={() => router.push('/jobs')}
        className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 mb-6 text-sm font-medium transition-colors"
      >
        <HiArrowLeft className="w-4 h-4" />
        Back to Jobs
      </button>

      {/* Job Header */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 mb-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              {job.title}
            </h1>
            <p className="text-indigo-600 text-lg font-semibold mt-1">
              {job.company}
            </p>

            <div className="flex flex-wrap gap-2 mt-4">
              <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg text-sm">
                <HiLocationMarker className="w-4 h-4" />
                {job.location}
              </span>
              <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg text-sm">
                {locationTypeEmoji[job.locationType]} {job.locationType}
              </span>
              <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg text-sm capitalize">
                <HiBriefcase className="w-4 h-4" />
                {job.jobType}
              </span>
              <span className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-lg text-sm capitalize">
                📊 {job.experienceLevel} level
              </span>
            </div>
          </div>

          <div className="md:text-right">
            <p className="text-xl font-bold text-gray-900">
              {formatSalary(
                job.salary?.min,
                job.salary?.max,
                job.salary?.currency,
                job.salary?.period
              )}
            </p>
            <p className="text-gray-400 text-sm mt-1 flex items-center gap-1 md:justify-end">
              <HiClock className="w-4 h-4" />
              Posted {timeAgo(job.createdAt)}
            </p>
          </div>
        </div>

        {/* Skills */}
        {job.skills && job.skills.length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-100">
            <h3 className="text-sm font-semibold text-gray-500 mb-3">
              REQUIRED SKILLS
            </h3>
            <div className="flex flex-wrap gap-2">
              {job.skills.map((skill) => (
                <span
                  key={skill}
                  className="bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg text-sm font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Description */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          Job Description
        </h2>
        <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
          {job.description}
        </div>

        {job.requirements && (
          <>
            <h2 className="text-lg font-bold text-gray-900 mt-8 mb-4">
              Requirements
            </h2>
            <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {job.requirements}
            </div>
          </>
        )}
      </div>

      {/* Challenge Fee Info */}
      <div className="bg-amber-50 rounded-2xl border border-amber-200 p-6 md:p-8 mb-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
            ⚡
          </div>
          <div>
            <h3 className="text-lg font-bold text-amber-900">
              Challenge Fee: ₹{job.challengeFeeAmount}
            </h3>
            <p className="text-amber-700 mt-1">
              Optionally pay a refundable fee to get priority review.
            </p>
            <div className="mt-4 space-y-2">
              <p className="text-sm text-amber-800 flex items-center gap-2">
                <HiShieldCheck className="w-4 h-4 text-green-600" />
                Refunded if rejected, not reviewed in {job.reviewWindowDays}{' '}
                days, or hired
              </p>
              <p className="text-sm text-amber-800 flex items-center gap-2">
                <HiStar className="w-4 h-4 text-amber-600" />
                Gets priority placement in recruiter&apos;s queue
              </p>
              <p className="text-sm text-amber-800 flex items-center gap-2">
                <HiClock className="w-4 h-4 text-blue-600" />
                Review window: {job.reviewWindowDays} days
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── APPLY SECTION ── */}

      {/* Already applied + Boosted */}
      {applied && isBoosted && (
        <div className="bg-green-50 rounded-2xl border border-green-200 p-6 md:p-8 text-center">
          <div className="text-5xl mb-3">🎉</div>
          <h2 className="text-xl font-bold text-green-800">
            Application Boosted!
          </h2>
          <p className="text-green-600 mt-2">
            Your application has been submitted with priority status ⭐
          </p>
          <div className="flex gap-4 justify-center mt-6">
            <button
              onClick={() => router.push('/applicant/applications')}
              className="bg-green-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-green-700 transition-all"
            >
              View My Applications
            </button>
            <button
              onClick={() => router.push('/applicant/deposits')}
              className="border-2 border-green-300 text-green-700 px-6 py-2.5 rounded-xl font-semibold hover:bg-green-100 transition-all"
            >
              View Deposits
            </button>
          </div>
        </div>
      )}

      {/* Already applied + NOT boosted (show boost option) */}
      {applied && !isBoosted && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8">
          <div className="text-center mb-6">
            <div className="text-4xl mb-2">✅</div>
            <h2 className="text-xl font-bold text-gray-900">
              Application Submitted!
            </h2>
            <p className="text-gray-500 mt-1">
              Want to boost it to priority?
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <RazorpayButton
              applicationId={applicationId}
              amount={job.challengeFeeAmount}
              jobTitle={job.title}
              onSuccess={() => {
                setIsBoosted(true);
              }}
              onFailure={(msg) => {
                console.error('Payment failed:', msg);
              }}
            />

            <button
              onClick={() => router.push('/applicant/applications')}
              className="text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors"
            >
              Skip — Keep Free Application
            </button>
          </div>

          <div className="mt-6 p-4 bg-amber-50 rounded-xl text-center">
            <p className="text-amber-700 text-sm">
              💡 Challenge fee is <strong>fully refundable</strong> — only forfeited if you skip an interview.
            </p>
          </div>
        </div>
      )}

      {/* Not yet applied — Show apply form or buttons */}
      {!applied && !showApplyForm && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Ready to Apply?
          </h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => {
                if (!isAuthenticated) {
                  toast.error('Please login to apply');
                  router.push('/login');
                  return;
                }
                if (!isApplicant) {
                  toast.error('Only job seekers can apply');
                  return;
                }
                setShowApplyForm(true);
              }}
              className="flex-1 border-2 border-indigo-600 text-indigo-600 font-semibold py-3 px-6 rounded-xl hover:bg-indigo-50 transition-all text-center"
            >
              📋 Apply Free
            </button>
            <button
              onClick={() => {
                if (!isAuthenticated) {
                  toast.error('Please login to apply');
                  router.push('/login');
                  return;
                }
                if (!isApplicant) {
                  toast.error('Only job seekers can apply');
                  return;
                }
                setShowApplyForm(true);
              }}
              className="flex-1 bg-indigo-600 text-white font-semibold py-3 px-6 rounded-xl hover:bg-indigo-700 transition-all text-center flex items-center justify-center gap-2"
            >
              <HiStar className="w-5 h-5" />
              Apply + ₹{job.challengeFeeAmount} Boost
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-4 text-center">
            Challenge fee is fully refundable — see policy above
          </p>
        </div>
      )}

      {/* Apply Form */}
      {!applied && showApplyForm && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Submit Your Application
          </h2>

          {/* Cover Letter */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cover Letter (Optional but recommended)
            </label>
            <textarea
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder="Tell the recruiter why you're a great fit for this role..."
              rows={5}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-y"
              maxLength={2000}
            />
            <p className="text-xs text-gray-400 mt-1 text-right">
              {coverLetter.length}/2000
            </p>
          </div>

          {/* Two Apply Options */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleFreeApply}
              disabled={applying}
              className="flex-1 border-2 border-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-xl hover:bg-gray-50 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {applying ? (
                <>
                  <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                  Submitting...
                </>
              ) : (
                '📋 Submit Free'
              )}
            </button>

            <button
              onClick={handleBoostApply}
              disabled={applying}
              className="flex-1 bg-indigo-600 text-white font-semibold py-3 px-6 rounded-xl hover:bg-indigo-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {applying ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <HiStar className="w-5 h-5" />
                  Submit + Pay ₹{job.challengeFeeAmount}
                </>
              )}
            </button>
          </div>

          {/* Cancel */}
          <button
            onClick={() => setShowApplyForm(false)}
            className="w-full mt-4 text-gray-400 hover:text-gray-600 text-sm font-medium py-2 transition-all"
          >
            ← Cancel
          </button>
        </div>
      )}

      {/* Posted By */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 mt-6">
        <h3 className="text-sm font-semibold text-gray-500 mb-3">POSTED BY</h3>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold">
            {job.recruiterId?.name?.charAt(0)?.toUpperCase() || 'R'}
          </div>
          <div>
            <p className="font-semibold text-gray-900">
              {job.recruiterId?.name || 'Recruiter'}
            </p>
            <p className="text-sm text-gray-500">
              {job.recruiterId?.profile?.company || job.company}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

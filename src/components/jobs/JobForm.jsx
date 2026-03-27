"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import SkillTags from './SkillTags';
import toast from 'react-hot-toast';
import {
  JOB_TYPES,
  LOCATION_TYPES,
  EXPERIENCE_LEVELS,
} from '@/utils/constants';

export default function JobForm({ initialData = null, isEditing = false }) {
  const { token } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    company: initialData?.company || '',
    description: initialData?.description || '',
    requirements: initialData?.requirements || '',
    location: initialData?.location || '',
    locationType: initialData?.locationType || 'remote',
    jobType: initialData?.jobType || 'full-time',
    experienceLevel: initialData?.experienceLevel || 'any',
    skills: initialData?.skills || [],
    salaryMin: initialData?.salary?.min || '',
    salaryMax: initialData?.salary?.max || '',
    salaryPeriod: initialData?.salary?.period || 'yearly',
    challengeFeeAmount: initialData?.challengeFeeAmount || 500,
    reviewWindowDays: initialData?.reviewWindowDays || 14,
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = 'Job title is required';
    if (!formData.company.trim()) newErrors.company = 'Company name is required';
    if (!formData.description.trim())
      newErrors.description = 'Description is required';
    if (formData.description.trim().length < 50)
      newErrors.description = 'Description must be at least 50 characters';
    if (!formData.location.trim()) newErrors.location = 'Location is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    try {
      const payload = {
        title: formData.title.trim(),
        company: formData.company.trim(),
        description: formData.description.trim(),
        requirements: formData.requirements.trim(),
        location: formData.location.trim(),
        locationType: formData.locationType,
        jobType: formData.jobType,
        experienceLevel: formData.experienceLevel,
        skills: formData.skills,
        salary: {
          min: parseInt(formData.salaryMin) || 0,
          max: parseInt(formData.salaryMax) || 0,
          currency: 'INR',
          period: formData.salaryPeriod,
        },
        challengeFeeAmount: parseInt(formData.challengeFeeAmount) || 500,
        reviewWindowDays: parseInt(formData.reviewWindowDays) || 14,
      };

      const url = isEditing
        ? `/api/jobs/${initialData._id}`
        : '/api/jobs';

      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        toast.success(
          isEditing ? 'Job updated!' : 'Job posted successfully! 🎉'
        );
        router.push('/recruiter/jobs');
      } else {
        toast.error(data.error);
      }
    } catch (error) {
      toast.error('Something went wrong');
    }

    setLoading(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Info */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8">
        <h2 className="text-lg font-bold text-gray-900 mb-6">
          📋 Basic Information
        </h2>

        <div className="space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Job Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Senior React Developer"
              className={`w-full px-4 py-3 rounded-xl border ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              } focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none`}
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title}</p>
            )}
          </div>

          {/* Company */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company Name *
            </label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              placeholder="e.g. Acme Technologies"
              className={`w-full px-4 py-3 rounded-xl border ${
                errors.company ? 'border-red-500' : 'border-gray-300'
              } focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none`}
            />
            {errors.company && (
              <p className="text-red-500 text-sm mt-1">{errors.company}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Job Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the role, responsibilities, and what a typical day looks like..."
              rows={6}
              className={`w-full px-4 py-3 rounded-xl border ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              } focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-y`}
            />
            <div className="flex justify-between mt-1">
              {errors.description ? (
                <p className="text-red-500 text-sm">{errors.description}</p>
              ) : (
                <span />
              )}
              <span className="text-xs text-gray-400">
                {formData.description.length}/5000
              </span>
            </div>
          </div>

          {/* Requirements */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Requirements (Optional)
            </label>
            <textarea
              name="requirements"
              value={formData.requirements}
              onChange={handleChange}
              placeholder="List qualifications, certifications, years of experience needed..."
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-y"
            />
          </div>
        </div>
      </div>

      {/* Location & Type */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8">
        <h2 className="text-lg font-bold text-gray-900 mb-6">
          📍 Location & Job Type
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location *
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. Mumbai, India"
              className={`w-full px-4 py-3 rounded-xl border ${
                errors.location ? 'border-red-500' : 'border-gray-300'
              } focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none`}
            />
            {errors.location && (
              <p className="text-red-500 text-sm mt-1">{errors.location}</p>
            )}
          </div>

          {/* Location Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Work Mode
            </label>
            <select
              name="locationType"
              value={formData.locationType}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-white"
            >
              {LOCATION_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Job Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Job Type
            </label>
            <select
              name="jobType"
              value={formData.jobType}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-white"
            >
              {JOB_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Experience Level */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Experience Level
            </label>
            <select
              name="experienceLevel"
              value={formData.experienceLevel}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-white"
            >
              {EXPERIENCE_LEVELS.map((level) => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Skills */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8">
        <h2 className="text-lg font-bold text-gray-900 mb-6">
          🛠️ Required Skills
        </h2>
        <SkillTags
          selected={formData.skills}
          onChange={(skills) => setFormData({ ...formData, skills })}
        />
      </div>

      {/* Salary */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8">
        <h2 className="text-lg font-bold text-gray-900 mb-6">💰 Salary</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Minimum (₹)
            </label>
            <input
              type="number"
              name="salaryMin"
              value={formData.salaryMin}
              onChange={handleChange}
              placeholder="e.g. 500000"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Maximum (₹)
            </label>
            <input
              type="number"
              name="salaryMax"
              value={formData.salaryMax}
              onChange={handleChange}
              placeholder="e.g. 1200000"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Period
            </label>
            <select
              name="salaryPeriod"
              value={formData.salaryPeriod}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-white"
            >
              <option value="yearly">Yearly</option>
              <option value="monthly">Monthly</option>
              <option value="hourly">Hourly</option>
            </select>
          </div>
        </div>
      </div>

      {/* Challenge Fee Settings */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8">
        <h2 className="text-lg font-bold text-gray-900 mb-2">
          ⚡ Challenge Fee Settings
        </h2>
        <p className="text-gray-500 text-sm mb-6">
          Set the optional refundable fee applicants can pay to get priority
          review.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Challenge Fee Amount (₹)
            </label>
            <input
              type="number"
              name="challengeFeeAmount"
              value={formData.challengeFeeAmount}
              onChange={handleChange}
              min="100"
              max="5000"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            />
            <p className="text-xs text-gray-400 mt-1">
              Min ₹100 — Max ₹5,000
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Review Window (Days)
            </label>
            <input
              type="number"
              name="reviewWindowDays"
              value={formData.reviewWindowDays}
              onChange={handleChange}
              min="7"
              max="30"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            />
            <p className="text-xs text-gray-400 mt-1">
              Auto-refund if not reviewed within this period (7-30 days)
            </p>
          </div>
        </div>
      </div>

      {/* Submit */}
      <div className="flex gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              {isEditing ? 'Updating...' : 'Posting...'}
            </>
          ) : isEditing ? (
            'Update Job'
          ) : (
            'Post Job 🚀'
          )}
        </button>
      </div>
    </form>
  );
}
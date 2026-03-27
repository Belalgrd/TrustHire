"use client";

import Link from 'next/link';
import { timeAgo } from '@/utils/formatDate';
import { formatSalary } from '@/utils/formatCurrency';
import { HiLocationMarker, HiClock, HiBriefcase, HiStar } from 'react-icons/hi';

export default function JobCard({ job }) {
  const locationTypeEmoji = {
    remote: '🌍',
    onsite: '🏢',
    hybrid: '🔄',
  };

  return (
    <Link href={`/jobs/${job._id}`}>
      <div className="bg-white rounded-2xl border border-gray-200 p-6 hover:border-indigo-300 hover:shadow-md transition-all group cursor-pointer h-full flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0 pr-3">
            <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors truncate">
              {job.title}
            </h3>
            <p className="text-indigo-600 font-medium mt-1 truncate">
              {job.company}
            </p>
          </div>

          <div className="flex-shrink-0">
            <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap">
              <HiStar className="w-3 h-3" />
              ₹{job.challengeFeeAmount} boost
            </span>
          </div>
        </div>

        {/* Tags — Fixed height area */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-600 px-2.5 py-1 rounded-lg text-xs">
            <HiLocationMarker className="w-3 h-3" />
            {job.location}
          </span>
          <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-600 px-2.5 py-1 rounded-lg text-xs">
            {locationTypeEmoji[job.locationType]} {job.locationType}
          </span>
          <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-600 px-2.5 py-1 rounded-lg text-xs">
            <HiBriefcase className="w-3 h-3" />
            {job.jobType}
          </span>
          <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-600 px-2.5 py-1 rounded-lg text-xs capitalize">
            {job.experienceLevel} Level
          </span>
        </div>

        {/* Skills — Fixed height with overflow hidden */}
        <div className="mb-4 min-h-[32px]">
          {job.skills && job.skills.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {job.skills.slice(0, 4).map((skill) => (
                <span
                  key={skill}
                  className="bg-indigo-50 text-indigo-600 px-2.5 py-1 rounded-md text-xs font-medium"
                >
                  {skill}
                </span>
              ))}
              {job.skills.length > 4 && (
                <span className="text-gray-400 text-xs py-1">
                  +{job.skills.length - 4} more
                </span>
              )}
            </div>
          ) : (
            <div className="h-[28px]"></div>
          )}
        </div>

        {/* Footer — Pushed to bottom */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
          <p className="text-sm font-semibold text-gray-900">
            {formatSalary(
              job.salary?.min,
              job.salary?.max,
              job.salary?.currency,
              job.salary?.period
            )}
          </p>
          <div className="flex items-center gap-1 text-gray-400 text-xs whitespace-nowrap">
            <HiClock className="w-3 h-3" />
            {timeAgo(job.createdAt)}
          </div>
        </div>
      </div>
    </Link>
  );
}
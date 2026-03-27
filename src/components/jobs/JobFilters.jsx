"use client";

import { HiSearch, HiX } from 'react-icons/hi';
import {
  JOB_TYPES,
  LOCATION_TYPES,
  EXPERIENCE_LEVELS,
  SORT_OPTIONS,
} from '@/utils/constants';

export default function JobFilters({ filters, setFilters, totalJobs }) {
  const handleChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      location: '',
      locationType: '',
      jobType: '',
      experienceLevel: '',
      sortBy: 'newest',
      page: 1,
    });
  };

  const hasActiveFilters =
    filters.search ||
    filters.location ||
    filters.locationType ||
    filters.jobType ||
    filters.experienceLevel;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
      {/* Search Bar */}
      <div className="relative mb-4">
        <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          value={filters.search}
          onChange={(e) => handleChange('search', e.target.value)}
          placeholder="Search jobs, companies, skills..."
          className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
        />
      </div>

      {/* Filter Row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {/* Location */}
        <input
          type="text"
          value={filters.location}
          onChange={(e) => handleChange('location', e.target.value)}
          placeholder="📍 Location"
          className="px-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
        />

        {/* Location Type */}
        <select
          value={filters.locationType}
          onChange={(e) => handleChange('locationType', e.target.value)}
          className="px-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
        >
          <option value="">Work Mode</option>
          {LOCATION_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>

        {/* Job Type */}
        <select
          value={filters.jobType}
          onChange={(e) => handleChange('jobType', e.target.value)}
          className="px-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
        >
          <option value="">Job Type</option>
          {JOB_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>

        {/* Experience */}
        <select
          value={filters.experienceLevel}
          onChange={(e) => handleChange('experienceLevel', e.target.value)}
          className="px-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
        >
          <option value="">Experience</option>
          {EXPERIENCE_LEVELS.map((l) => (
            <option key={l.value} value={l.value}>
              {l.label}
            </option>
          ))}
        </select>

        {/* Sort */}
        <select
          value={filters.sortBy}
          onChange={(e) => handleChange('sortBy', e.target.value)}
          className="px-3 py-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
        >
          {SORT_OPTIONS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      {/* Active Filters + Count */}
      <div className="flex items-center justify-between mt-4">
        <p className="text-sm text-gray-500">
          <span className="font-semibold text-gray-900">{totalJobs}</span> jobs
          found
        </p>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 text-sm text-red-500 hover:text-red-600 font-medium"
          >
            <HiX className="w-4 h-4" />
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
}
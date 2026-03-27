"use client";

import { useState, useEffect, useCallback } from 'react';
import JobCard from '@/components/jobs/JobCard';
import JobFilters from '@/components/jobs/JobFilters';
import Loader from '@/components/common/Loader';

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalJobs, setTotalJobs] = useState(0);

  const [filters, setFilters] = useState({
    search: '',
    location: '',
    locationType: '',
    jobType: '',
    experienceLevel: '',
    sortBy: 'newest',
    page: 1,
  });

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();

      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.set(key, value);
      });

      const res = await fetch(`/api/jobs?${params.toString()}`);
      const data = await res.json();

      if (data.success) {
        setJobs(data.jobs);
        setTotalJobs(data.pagination.total);
      }
    } catch (error) {
      console.error('Fetch jobs error:', error);
    }
    setLoading(false);
  }, [filters]);

  useEffect(() => {
    const debounce = setTimeout(() => {
      fetchJobs();
    }, 300);

    return () => clearTimeout(debounce);
  }, [fetchJobs]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Browse Jobs
        </h1>
        <p className="text-gray-600 mt-1">
          Find your next opportunity — apply free or boost with a challenge fee
        </p>
      </div>

      {/* Filters */}
      <JobFilters
        filters={filters}
        setFilters={setFilters}
        totalJobs={totalJobs}
      />

      {/* Jobs Grid */}
      {loading ? (
        <Loader size="lg" text="Loading jobs..." />
      ) : jobs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="text-lg font-semibold text-gray-900">
            No jobs found
          </h3>
          <p className="text-gray-500 mt-2">
            Try adjusting your filters or check back later.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobs.map((job) => (
            <JobCard key={job._id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
}
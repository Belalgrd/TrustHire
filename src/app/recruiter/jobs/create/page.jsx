"use client";

import JobForm from '@/components/jobs/JobForm';

export default function CreateJobPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Post a New Job
        </h1>
        <p className="text-gray-600 mt-1">
          Create a job listing and start receiving applications
        </p>
      </div>

      <JobForm />
    </div>
  );
}
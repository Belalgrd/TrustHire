"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import JobForm from '@/components/jobs/JobForm';
import Loader from '@/components/common/Loader';
import toast from 'react-hot-toast';
import { HiArrowLeft } from 'react-icons/hi';

export default function EditJobPage() {
  const { id } = useParams();
  const router = useRouter();
  const { token } = useAuth();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchJob();
  }, [id]);

  const fetchJob = async () => {
    try {
      const res = await fetch(`/api/jobs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (data.success) {
        setJob(data.job);
      } else {
        toast.error('Job not found');
        router.push('/recruiter/jobs');
      }
    } catch (error) {
      toast.error('Failed to load job');
      router.push('/recruiter/jobs');
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader size="lg" text="Loading job..." />
      </div>
    );
  }

  if (!job) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => router.push('/recruiter/jobs')}
        className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 mb-6 text-sm font-medium"
      >
        <HiArrowLeft className="w-4 h-4" />
        Back to My Jobs
      </button>

      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Edit Job
        </h1>
        <p className="text-gray-600 mt-1">Update your job listing</p>
      </div>

      <JobForm initialData={job} isEditing={true} />
    </div>
  );
}
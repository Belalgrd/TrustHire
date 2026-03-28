"use client";

import { useState, useCallback } from 'react';
import useAuth from './useAuth';
import toast from 'react-hot-toast';

export default function useJobs() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [job, setJob] = useState(null);
  const [myJobs, setMyJobs] = useState([]);

  const authHeaders = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };

  // ── Get all jobs (public) ──
  const fetchJobs = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      const query = new URLSearchParams(params).toString();
      const res = await fetch(`/api/jobs${query ? `?${query}` : ''}`);
      const data = await res.json();

      if (data.success) {
        setJobs(data.jobs);
        return { success: true, jobs: data.jobs };
      } else {
        toast.error(data.error || 'Failed to fetch jobs');
        return { success: false };
      }
    } catch (error) {
      console.error('Fetch jobs error:', error);
      toast.error('Something went wrong');
      return { success: false };
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Get single job by ID (public) ──
  const fetchJob = useCallback(async (id) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/jobs/${id}`);
      const data = await res.json();

      if (data.success) {
        setJob(data.job);
        return { success: true, job: data.job };
      } else {
        toast.error(data.error || 'Failed to fetch job');
        return { success: false };
      }
    } catch (error) {
      console.error('Fetch job error:', error);
      toast.error('Something went wrong');
      return { success: false };
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Get my jobs (recruiter) ──
  const fetchMyJobs = useCallback(async (status = '') => {
    try {
      setLoading(true);
      const query = status ? `?status=${status}` : '';
      const res = await fetch(`/api/jobs/my${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (data.success) {
        setMyJobs(data.jobs);
        return { success: true, jobs: data.jobs };
      } else {
        toast.error(data.error || 'Failed to fetch your jobs');
        return { success: false };
      }
    } catch (error) {
      console.error('Fetch my jobs error:', error);
      toast.error('Something went wrong');
      return { success: false };
    } finally {
      setLoading(false);
    }
  }, [token]);

  // ── Create job (recruiter) ──
  const createJob = async (jobData) => {
    try {
      setLoading(true);
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify(jobData),
      });
      const data = await res.json();

      if (data.success) {
        toast.success('Job posted successfully! 🎉');
        return { success: true, job: data.job };
      } else {
        toast.error(data.error || 'Failed to create job');
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('Create job error:', error);
      toast.error('Something went wrong');
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  // ── Update job (recruiter) ──
  const updateJob = async (id, jobData) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/jobs/${id}`, {
        method: 'PUT',
        headers: authHeaders,
        body: JSON.stringify(jobData),
      });
      const data = await res.json();

      if (data.success) {
        toast.success('Job updated successfully! ✅');
        return { success: true, job: data.job };
      } else {
        toast.error(data.error || 'Failed to update job');
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('Update job error:', error);
      toast.error('Something went wrong');
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  // ── Delete job (recruiter) ──
  const deleteJob = async (id) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/jobs/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (data.success) {
        toast.success('Job deleted successfully');
        setMyJobs((prev) => prev.filter((j) => j._id !== id));
        return { success: true };
      } else {
        toast.error(data.error || 'Failed to delete job');
        return { success: false };
      }
    } catch (error) {
      console.error('Delete job error:', error);
      toast.error('Something went wrong');
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  return {
    jobs,
    job,
    myJobs,
    loading,
    fetchJobs,
    fetchJob,
    fetchMyJobs,
    createJob,
    updateJob,
    deleteJob,
  };
}
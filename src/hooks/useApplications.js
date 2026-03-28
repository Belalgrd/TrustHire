"use client";

import { useState, useCallback } from 'react';
import useAuth from './useAuth';
import toast from 'react-hot-toast';

export default function useApplications() {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [applications, setApplications] = useState([]);
  const [myApplications, setMyApplications] = useState([]);

  const authHeaders = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };

  // ── Apply to a job (applicant) ──
  const applyToJob = async (jobId, coverLetter = '', isPriority = false) => {
    try {
      setLoading(true);
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({ jobId, coverLetter, isPriority }),
      });
      const data = await res.json();

      if (data.success) {
        toast.success(
          isPriority
            ? 'Priority application submitted! ⭐'
            : 'Application submitted! 🎉'
        );
        return { success: true, application: data.application };
      } else {
        toast.error(data.error || 'Failed to apply');
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('Apply error:', error);
      toast.error('Something went wrong');
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  // ── Get my applications (applicant) ──
  const fetchMyApplications = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/applications/my', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (data.success) {
        setMyApplications(data.applications);
        return { success: true, applications: data.applications };
      } else {
        toast.error(data.error || 'Failed to fetch applications');
        return { success: false };
      }
    } catch (error) {
      console.error('Fetch my applications error:', error);
      toast.error('Something went wrong');
      return { success: false };
    } finally {
      setLoading(false);
    }
  }, [token]);

  // ── Get applications for a job (recruiter) ──
  const fetchJobApplications = useCallback(async (jobId) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/applications/job/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (data.success) {
        setApplications(data.applications);
        return { success: true, applications: data.applications };
      } else {
        toast.error(data.error || 'Failed to fetch applicants');
        return { success: false };
      }
    } catch (error) {
      console.error('Fetch job applications error:', error);
      toast.error('Something went wrong');
      return { success: false };
    } finally {
      setLoading(false);
    }
  }, [token]);

  // ── Invite to interview (recruiter) ──
  const inviteToInterview = async (applicationId, interviewDate) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/applications/${applicationId}/invite`, {
        method: 'PATCH',
        headers: authHeaders,
        body: JSON.stringify({ interviewDate }),
      });
      const data = await res.json();

      if (data.success) {
        toast.success('Interview invite sent! 📩');
        setApplications((prev) =>
          prev.map((app) =>
            app._id === applicationId ? { ...app, ...data.application } : app
          )
        );
        return { success: true };
      } else {
        toast.error(data.error || 'Failed to send invite');
        return { success: false };
      }
    } catch (error) {
      console.error('Invite error:', error);
      toast.error('Something went wrong');
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  // ── Mark as attended (recruiter) ──
  const markAttended = async (applicationId) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/applications/${applicationId}/attended`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (data.success) {
        toast.success('Marked as attended ✅');
        setApplications((prev) =>
          prev.map((app) =>
            app._id === applicationId ? { ...app, ...data.application } : app
          )
        );
        return { success: true };
      } else {
        toast.error(data.error || 'Failed to update');
        return { success: false };
      }
    } catch (error) {
      console.error('Mark attended error:', error);
      toast.error('Something went wrong');
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  // ── Mark as no-show (recruiter) ──
  const markNoShow = async (applicationId) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/applications/${applicationId}/no-show`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (data.success) {
        toast.success('Marked as no-show');
        setApplications((prev) =>
          prev.map((app) =>
            app._id === applicationId ? { ...app, ...data.application } : app
          )
        );
        return { success: true };
      } else {
        toast.error(data.error || 'Failed to update');
        return { success: false };
      }
    } catch (error) {
      console.error('No-show error:', error);
      toast.error('Something went wrong');
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  // ── Reject application (recruiter) ──
  const rejectApplication = async (applicationId, reason = '') => {
    try {
      setLoading(true);
      const res = await fetch(`/api/applications/${applicationId}/reject`, {
        method: 'PATCH',
        headers: authHeaders,
        body: JSON.stringify({ reason }),
      });
      const data = await res.json();

      if (data.success) {
        toast.success('Application rejected');
        setApplications((prev) =>
          prev.map((app) =>
            app._id === applicationId ? { ...app, ...data.application } : app
          )
        );
        return { success: true };
      } else {
        toast.error(data.error || 'Failed to reject');
        return { success: false };
      }
    } catch (error) {
      console.error('Reject error:', error);
      toast.error('Something went wrong');
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  // ── Hire applicant (recruiter) ──
  const hireApplicant = async (applicationId) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/applications/${applicationId}/hire`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (data.success) {
        toast.success('Applicant hired! 🎉');
        setApplications((prev) =>
          prev.map((app) =>
            app._id === applicationId ? { ...app, ...data.application } : app
          )
        );
        return { success: true };
      } else {
        toast.error(data.error || 'Failed to hire');
        return { success: false };
      }
    } catch (error) {
      console.error('Hire error:', error);
      toast.error('Something went wrong');
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  return {
    applications,
    myApplications,
    loading,
    applyToJob,
    fetchMyApplications,
    fetchJobApplications,
    inviteToInterview,
    markAttended,
    markNoShow,
    rejectApplication,
    hireApplicant,
  };
}
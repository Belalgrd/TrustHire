"use client";

import ProtectedRoute from '@/components/common/ProtectedRoute';

export default function RecruiterLayout({ children }) {
  return (
    <ProtectedRoute allowedRoles={['recruiter']}>
      {children}
    </ProtectedRoute>
  );
}
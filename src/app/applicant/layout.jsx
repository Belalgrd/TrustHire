"use client";

import ProtectedRoute from '@/components/common/ProtectedRoute';

export default function ApplicantLayout({ children }) {
  return (
    <ProtectedRoute allowedRoles={['applicant']}>
      {children}
    </ProtectedRoute>
  );
}
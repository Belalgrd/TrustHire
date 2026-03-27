// src/components/common/SmartCTALink.jsx
"use client";

import { useContext } from 'react';
import Link from 'next/link';
import { AuthContext } from '@/context/AuthContext';

export default function SmartCTALink({ children, className, fallbackHref = '/register' }) {
  const { user, loading, isRecruiter } = useContext(AuthContext);

  const getHref = () => {
    if (!user) return fallbackHref;
    if (isRecruiter) return '/recruiter/dashboard';
    return '/applicant/dashboard';
  };

  const getLabel = () => {
    if (loading) return children;
    if (user) return 'Go to Dashboard →';
    return children;
  };

  return (
    <Link href={getHref()} className={className}>
      {getLabel()}
    </Link>
  );
}
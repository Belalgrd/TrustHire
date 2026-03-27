// src/components/common/Navbar.jsx
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { HiMenu, HiX } from 'react-icons/hi';
import {
  HiBriefcase,
  HiUser,
  HiLogout,
  HiViewGrid,
  HiCurrencyRupee,
} from 'react-icons/hi';

export default function Navbar() {
  const { user, isAuthenticated, isRecruiter, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const profileHref = isRecruiter ? '/recruiter/profile' : '/applicant/profile';

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">⚡</span>
            <span className="text-xl font-bold text-gray-900">
              Trust<span className="text-indigo-600">Hire</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/jobs"
              className="text-gray-600 hover:text-indigo-600 font-medium transition-colors"
            >
              Browse Jobs
            </Link>

            {isAuthenticated ? (
              <>
                {isRecruiter ? (
                  <>
                    <Link
                      href="/recruiter/dashboard"
                      className="text-gray-600 hover:text-indigo-600 font-medium transition-colors"
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/recruiter/jobs"
                      className="text-gray-600 hover:text-indigo-600 font-medium transition-colors"
                    >
                      My Jobs
                    </Link>
                    <Link
                      href="/recruiter/jobs/create"
                      className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 font-medium transition-colors"
                    >
                      + Post Job
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href="/applicant/dashboard"
                      className="text-gray-600 hover:text-indigo-600 font-medium transition-colors"
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/applicant/applications"
                      className="text-gray-600 hover:text-indigo-600 font-medium transition-colors"
                    >
                      My Applications
                    </Link>
                    <Link
                      href="/applicant/deposits"
                      className="text-gray-600 hover:text-indigo-600 font-medium transition-colors"
                    >
                      💰 Deposits
                    </Link>
                  </>
                )}

                {/* User Menu */}
                <div className="flex items-center gap-3 ml-4 pl-4 border-l border-gray-200">
                  <Link
                    href={profileHref}
                    className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                  >
                    <div className="w-9 h-9 bg-indigo-100 rounded-full flex items-center justify-center text-sm font-bold text-indigo-600">
                      {user?.name?.charAt(0)?.toUpperCase()}
                    </div>
                    <div className="text-right hidden lg:block">
                      <p className="text-sm font-medium text-gray-900">
                        {user?.name}
                      </p>
                      <p className="text-xs text-indigo-600 capitalize">
                        {user?.role}
                      </p>
                    </div>
                  </Link>
                  <button
                    onClick={logout}
                    className="text-gray-400 hover:text-red-500 transition-colors p-2"
                    title="Logout"
                  >
                    <HiLogout className="w-5 h-5" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="text-gray-600 hover:text-indigo-600 font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 font-medium transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-gray-600"
          >
            {mobileOpen ? (
              <HiX className="w-6 h-6" />
            ) : (
              <HiMenu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 pb-4">
          <div className="flex flex-col gap-2 pt-2">
            <Link
              href="/jobs"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
            >
              <HiBriefcase className="w-5 h-5" />
              Browse Jobs
            </Link>

            {isAuthenticated ? (
              <>
                {isRecruiter ? (
                  <>
                    <Link
                      href="/recruiter/dashboard"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                    >
                      <HiViewGrid className="w-5 h-5" />
                      Dashboard
                    </Link>
                    <Link
                      href="/recruiter/jobs"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                    >
                      <HiBriefcase className="w-5 h-5" />
                      My Jobs
                    </Link>
                    <Link
                      href="/recruiter/jobs/create"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg bg-indigo-600 text-white"
                    >
                      + Post Job
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      href="/applicant/dashboard"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                    >
                      <HiViewGrid className="w-5 h-5" />
                      Dashboard
                    </Link>
                    <Link
                      href="/applicant/applications"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                    >
                      <HiBriefcase className="w-5 h-5" />
                      My Applications
                    </Link>
                    <Link
                      href="/applicant/deposits"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                    >
                      <HiCurrencyRupee className="w-5 h-5" />
                      My Deposits
                    </Link>
                  </>
                )}

                {/* Mobile User Section */}
                <div className="border-t border-gray-100 pt-2 mt-2">
                  <Link
                    href={profileHref}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                  >
                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-sm font-bold text-indigo-600">
                      {user?.name?.charAt(0)?.toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{user?.name}</p>
                      <p className="text-sm text-indigo-600 capitalize">
                        {user?.role} · View Profile
                      </p>
                    </div>
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setMobileOpen(false);
                    }}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 w-full mt-1"
                  >
                    <HiLogout className="w-5 h-5" />
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                >
                  <HiUser className="w-5 h-5" />
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg bg-indigo-600 text-white text-center justify-center"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
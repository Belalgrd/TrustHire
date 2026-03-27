"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { timeAgo } from '@/utils/formatDate';
import Loader from '@/components/common/Loader';
import { HiStar } from 'react-icons/hi';

export default function MyDepositsPage() {
  const { token } = useAuth();
  const [deposits, setDeposits] = useState([]);
  const [summary, setSummary] = useState({
    totalHeld: 0,
    totalRefunded: 0,
    totalForfeited: 0,
    count: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDeposits();
  }, []);

  const fetchDeposits = async () => {
    try {
      const res = await fetch('/api/payments/my-deposits', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setDeposits(data.deposits);
        setSummary(data.summary);
      }
    } catch (error) {
      console.error('Fetch deposits error:', error);
    }
    setLoading(false);
  };

  const statusConfig = {
    held: {
      emoji: '🟡',
      label: 'Held',
      color: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      description: 'Waiting for recruiter action',
    },
    refunded: {
      emoji: '🟢',
      label: 'Refunded',
      color: 'bg-green-50 text-green-700 border-green-200',
      description: 'Money returned to your account',
    },
    forfeited: {
      emoji: '🔴',
      label: 'Forfeited',
      color: 'bg-red-50 text-red-700 border-red-200',
      description: 'Fee was forfeited due to no-show',
    },
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader size="lg" text="Loading deposits..." />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">
        💰 My Deposits
      </h1>
      <p className="text-gray-600 mb-8">
        Track your challenge fees and refund status
      </p>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-yellow-50 rounded-2xl border border-yellow-200 p-6 text-center">
          <p className="text-3xl font-bold text-yellow-600">
            ₹{summary.totalHeld}
          </p>
          <p className="text-sm text-yellow-700 mt-1 font-medium">
            Currently Held
          </p>
        </div>
        <div className="bg-green-50 rounded-2xl border border-green-200 p-6 text-center">
          <p className="text-3xl font-bold text-green-600">
            ₹{summary.totalRefunded}
          </p>
          <p className="text-sm text-green-700 mt-1 font-medium">
            Total Refunded
          </p>
        </div>
        <div className="bg-red-50 rounded-2xl border border-red-200 p-6 text-center">
          <p className="text-3xl font-bold text-red-600">
            ₹{summary.totalForfeited}
          </p>
          <p className="text-sm text-red-700 mt-1 font-medium">
            Total Forfeited
          </p>
        </div>
      </div>

      {/* Deposits List */}
      {deposits.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
          <div className="text-5xl mb-4">🔒</div>
          <h3 className="text-lg font-semibold text-gray-900">
            No deposits yet
          </h3>
          <p className="text-gray-500 mt-2">
            When you boost an application with a challenge fee, it will appear
            here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {deposits.map((dep) => {
            const config = statusConfig[dep.status] || statusConfig.held;

            return (
              <div
                key={dep._id}
                className={`bg-white rounded-2xl border p-6 ${
                  dep.status === 'held' ? 'border-yellow-200' : 'border-gray-200'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  {/* Job Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-900">
                        {dep.jobId?.title || 'Job Removed'}
                      </h3>
                      <HiStar className="w-4 h-4 text-amber-500" />
                    </div>
                    <p className="text-sm text-indigo-600">
                      {dep.jobId?.company}
                    </p>
                    {dep.reason && (
                      <p className="text-sm text-gray-500 mt-1">
                        Reason: {dep.reason}
                      </p>
                    )}
                    <p className="text-xs text-gray-400 mt-2">
                      Paid {timeAgo(dep.createdAt)}
                    </p>
                  </div>

                  {/* Amount + Status */}
                  <div className="text-right flex-shrink-0">
                    <p className="text-xl font-bold text-gray-900">
                      ₹{dep.amount}
                    </p>
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium mt-1 ${config.color}`}
                    >
                      {config.emoji} {config.label}
                    </span>
                    {dep.razorpayRefundId && (
                      <p className="text-xs text-gray-400 mt-1">
                        Refund: {dep.razorpayRefundId}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Refund Policy */}
      <div className="bg-gray-50 rounded-2xl p-6 mt-8">
        <h3 className="font-semibold text-gray-900 mb-3">
          📋 Refund Policy Reminder
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-medium text-green-700 mb-2">
              ✅ Fee is REFUNDED when:
            </p>
            <ul className="space-y-1 text-gray-600">
              <li>• Application is rejected</li>
              <li>• Not reviewed within review window</li>
              <li>• You are hired</li>
              <li>• You attend the interview</li>
            </ul>
          </div>
          <div>
            <p className="font-medium text-red-700 mb-2">
              ❌ Fee is FORFEITED when:
            </p>
            <ul className="space-y-1 text-gray-600">
              <li>• You skip a confirmed interview</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
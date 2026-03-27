"use client";

import { HiBriefcase, HiUser } from 'react-icons/hi';

export default function RoleSelector({ selected, onSelect }) {
  const roles = [
    {
      value: 'applicant',
      label: 'Job Seeker',
      description: 'Apply for jobs and boost your applications',
      icon: HiUser,
      emoji: '👤',
    },
    {
      value: 'recruiter',
      label: 'Recruiter',
      description: 'Post jobs and find committed candidates',
      icon: HiBriefcase,
      emoji: '🏢',
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      {roles.map((role) => (
        <button
          key={role.value}
          type="button"
          onClick={() => onSelect(role.value)}
          className={`p-4 rounded-xl border-2 text-left transition-all ${
            selected === role.value
              ? 'border-indigo-600 bg-indigo-50 ring-2 ring-indigo-200'
              : 'border-gray-200 hover:border-gray-300 bg-white'
          }`}
        >
          <div className="text-2xl mb-2">{role.emoji}</div>
          <p
            className={`font-semibold ${
              selected === role.value ? 'text-indigo-700' : 'text-gray-900'
            }`}
          >
            {role.label}
          </p>
          <p className="text-xs text-gray-500 mt-1">{role.description}</p>
        </button>
      ))}
    </div>
  );
}
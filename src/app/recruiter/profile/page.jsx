"use client";

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import {
  HiMail,
  HiPhone,
  HiLocationMarker,
  HiLink,
  HiOfficeBuilding,
  HiPencil,
  HiCheck,
} from 'react-icons/hi';

export default function RecruiterProfile() {
  const { user, updateProfile } = useAuth();

  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    bio: user?.profile?.bio || '',
    phone: user?.profile?.phone || '',
    location: user?.profile?.location || '',
    company: user?.profile?.company || '',
    website: user?.profile?.website || '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setLoading(true);
    const result = await updateProfile(formData);
    if (result.success) {
      setEditing(false);
    }
    setLoading(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      bio: user?.profile?.bio || '',
      phone: user?.profile?.phone || '',
      location: user?.profile?.location || '',
      company: user?.profile?.company || '',
      website: user?.profile?.website || '',
    });
    setEditing(false);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl font-medium hover:bg-indigo-700 transition-all text-sm"
          >
            <HiPencil className="w-4 h-4" />
            Edit Profile
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={handleCancel}
              className="px-4 py-2 rounded-xl border border-gray-300 text-gray-600 font-medium hover:bg-gray-50 transition-all text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-xl font-medium hover:bg-green-700 transition-all text-sm disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                <>
                  <HiCheck className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Avatar + Basic Info */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 md:p-8 mb-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center text-3xl font-bold text-indigo-600">
            {user?.name?.charAt(0)?.toUpperCase()}
          </div>
          <div>
            {editing ? (
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="text-xl font-bold text-gray-900 border-b-2 border-indigo-300 focus:border-indigo-600 outline-none pb-1"
              />
            ) : (
              <h2 className="text-xl font-bold text-gray-900">
                {user?.name}
              </h2>
            )}
            <p className="text-gray-500 flex items-center gap-1 mt-1">
              <HiMail className="w-4 h-4" />
              {user?.email}
            </p>
            <span className="inline-block mt-2 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-medium capitalize">
              {user?.role}
            </span>
          </div>
        </div>

        {/* Bio */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            📝 About / Company Description
          </label>
          {editing ? (
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell candidates about your company, culture, and what you're looking for..."
              rows={4}
              maxLength={500}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-y"
            />
          ) : (
            <p className="text-gray-600 leading-relaxed">
              {user?.profile?.bio || (
                <span className="text-gray-400 italic">
                  No description added yet.
                </span>
              )}
            </p>
          )}
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Company */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <HiOfficeBuilding className="w-4 h-4 inline mr-1" />
              Company Name
            </label>
            {editing ? (
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="e.g. Acme Technologies"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              />
            ) : (
              <p className="text-gray-600">
                {user?.profile?.company || (
                  <span className="text-gray-400">Not added</span>
                )}
              </p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <HiPhone className="w-4 h-4 inline mr-1" />
              Phone
            </label>
            {editing ? (
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              />
            ) : (
              <p className="text-gray-600">
                {user?.profile?.phone || (
                  <span className="text-gray-400">Not added</span>
                )}
              </p>
            )}
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <HiLocationMarker className="w-4 h-4 inline mr-1" />
              Location
            </label>
            {editing ? (
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Mumbai, India"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              />
            ) : (
              <p className="text-gray-600">
                {user?.profile?.location || (
                  <span className="text-gray-400">Not added</span>
                )}
              </p>
            )}
          </div>

          {/* Website */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <HiLink className="w-4 h-4 inline mr-1" />
              Company Website
            </label>
            {editing ? (
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                placeholder="https://yourcompany.com"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              />
            ) : (
              <p className="text-gray-600">
                {user?.profile?.website ? (
                  <a
                    href={user.profile.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:underline"
                  >
                    {user.profile.website} ↗
                  </a>
                ) : (
                  <span className="text-gray-400">Not added</span>
                )}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
"use client";

import { useState } from 'react';
import { HiX } from 'react-icons/hi';
import { POPULAR_SKILLS } from '@/utils/constants';

export default function SkillTags({ selected = [], onChange }) {
  const [input, setInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredSuggestions = POPULAR_SKILLS.filter(
    (skill) =>
      skill.toLowerCase().includes(input.toLowerCase()) &&
      !selected.includes(skill)
  ).slice(0, 8);

  const addSkill = (skill) => {
    if (!selected.includes(skill)) {
      onChange([...selected, skill]);
    }
    setInput('');
    setShowSuggestions(false);
  };

  const removeSkill = (skill) => {
    onChange(selected.filter((s) => s !== skill));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && input.trim()) {
      e.preventDefault();
      addSkill(input.trim());
    }
  };

  return (
    <div className="relative">
      {/* Selected Skills */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {selected.map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg text-sm font-medium"
            >
              {skill}
              <button
                type="button"
                onClick={() => removeSkill(skill)}
                className="text-indigo-400 hover:text-indigo-600"
              >
                <HiX className="w-4 h-4" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Input */}
      <input
        type="text"
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
          setShowSuggestions(true);
        }}
        onFocus={() => setShowSuggestions(true)}
        onKeyDown={handleKeyDown}
        placeholder="Type a skill and press Enter..."
        className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
      />

      {/* Suggestions Dropdown */}
      {showSuggestions && input && filteredSuggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
          {filteredSuggestions.map((skill) => (
            <button
              key={skill}
              type="button"
              onClick={() => addSkill(skill)}
              className="w-full text-left px-4 py-2.5 hover:bg-indigo-50 text-gray-700 text-sm transition-colors first:rounded-t-xl last:rounded-b-xl"
            >
              {skill}
            </button>
          ))}
        </div>
      )}

      {/* Click outside to close */}
      {showSuggestions && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowSuggestions(false)}
        />
      )}
    </div>
  );
}
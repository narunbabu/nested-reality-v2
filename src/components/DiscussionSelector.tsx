'use client';

import { useState, useEffect } from 'react';
import { Discussion } from '@/types';
import { useRouter } from 'next/navigation';

interface DiscussionSelectorProps {
  discussion: Discussion;
  isAuthenticated: boolean;
}

export default function DiscussionSelector({ discussion, isAuthenticated }: DiscussionSelectorProps) {
  const router = useRouter();
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchSelections();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const fetchSelections = async () => {
    try {
      const response = await fetch(`/api/discussion-selections?discussion_id=${discussion.id}`);
      if (response.ok) {
        const data = await response.json();
        setSelectedIndices(data.message_indices || []);
      }
    } catch (error) {
      console.error('Error fetching selections:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveSelections = async (indices: number[]) => {
    if (!isAuthenticated) {
      router.push('/auth/signin?redirect=/readers');
      return;
    }

    setSaving(true);
    try {
      const response = await fetch('/api/discussion-selections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          discussion_id: discussion.id,
          message_indices: indices
        })
      });

      if (response.ok) {
        const data = await response.json();
        setSelectedIndices(data.message_indices);
      } else if (response.status === 401) {
        router.push('/auth/signin?redirect=/readers');
      }
    } catch (error) {
      console.error('Error saving selections:', error);
      alert('Failed to save selections. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleToggle = (index: number) => {
    if (!isAuthenticated) {
      router.push('/auth/signin?redirect=/readers');
      return;
    }

    let newIndices: number[];

    if (selectedIndices.includes(index)) {
      // Deselecting - remove this and all higher indices
      newIndices = selectedIndices.filter(i => i < index);
    } else {
      // Selecting - add this and all lower indices (dependency logic)
      const lowerIndices = Array.from({ length: index + 1 }, (_, i) => i);
      newIndices = Array.from(new Set([...selectedIndices, ...lowerIndices])).sort((a, b) => a - b);
    }

    setSelectedIndices(newIndices);
    saveSelections(newIndices);
  };

  if (!expanded) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900">{discussion.title}</h3>
            <p className="text-gray-600 mt-1">{discussion.subtitle}</p>
          </div>
          {isAuthenticated && selectedIndices.length > 0 && (
            <div className="flex items-center gap-2 text-sm text-blue-600">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>{selectedIndices.length} selected</span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {discussion.tags.map((tag, idx) => (
            <span key={idx} className="px-3 py-1 bg-stone-100 text-stone-600 text-xs font-medium rounded-full">
              {tag}
            </span>
          ))}
        </div>

        <p className="text-gray-600 mb-4">{discussion.excerpt}</p>

        <button
          onClick={() => setExpanded(true)}
          className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
        >
          {isAuthenticated ? 'Read & Select Key Points' : 'Sign In to Access Discussion'}
          <span>→</span>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <button
        onClick={() => setExpanded(false)}
        className="text-sm font-bold text-stone-400 hover:text-stone-900 transition-colors flex items-center gap-2 mb-6"
      >
        ← Back to Overview
      </button>

      <header className="space-y-4 border-b border-stone-200 pb-6 mb-6">
        <h2 className="text-3xl font-serif text-stone-900">{discussion.title}</h2>
        <p className="text-lg text-stone-600 font-serif italic">{discussion.subtitle}</p>

        <div className="flex items-center gap-4">
          <span className="text-sm font-bold text-stone-700">Participants:</span>
          {discussion.participants.map((participant, idx) => (
            <span key={idx} className="text-sm text-stone-600 flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-stone-300 to-stone-400"></div>
              {participant}
            </span>
          ))}
        </div>

        {!isAuthenticated && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mt-4">
            <p className="text-amber-800 font-medium mb-2">🔒 Sign in to mark key points</p>
            <p className="text-amber-700 text-sm mb-3">
              Track your understanding by selecting the messages that resonate with you.
            </p>
            <a
              href="/auth/signin?redirect=/readers"
              className="inline-block px-4 py-2 bg-amber-600 text-white font-semibold rounded-lg hover:bg-amber-700 transition-colors"
            >
              Sign In
            </a>
          </div>
        )}
      </header>

      <div className="space-y-4">
        {discussion.messages.map((message, idx) => {
          const isArun = message.sender.toLowerCase().includes('arun');
          const isSelected = selectedIndices.includes(idx);

          return (
            <div
              key={idx}
              onClick={() => handleToggle(idx)}
              className={`
                flex gap-4 p-4 rounded-lg transition-all duration-200
                ${isAuthenticated ? 'cursor-pointer hover:bg-gray-50' : 'cursor-default'}
                ${isSelected ? 'bg-blue-50 border-2 border-blue-300' : 'border-2 border-transparent'}
                ${isArun ? 'flex-row-reverse' : 'flex-row'}
              `}
            >
              <div className={`w-10 h-10 rounded-full flex-shrink-0 ${isArun ? 'bg-gradient-to-br from-[#C5A059] to-amber-700' : 'bg-gradient-to-br from-stone-400 to-stone-600'}`}></div>

              <div className={`flex-1 ${isArun ? 'text-right' : 'text-left'}`}>
                <div className={`flex items-baseline gap-3 mb-1 ${isArun ? 'justify-end' : 'justify-start'}`}>
                  <span className={`text-sm font-bold ${isArun ? 'text-[#C5A059]' : 'text-stone-700'}`}>
                    {message.sender}
                  </span>
                  <span className="text-xs text-stone-400">
                    {message.timestamp}
                  </span>
                </div>

                <div className={`inline-block max-w-3xl p-4 rounded-lg ${
                  isArun
                    ? 'bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100'
                    : 'bg-stone-50 border border-stone-200'
                }`}>
                  <p className="text-stone-700 leading-relaxed whitespace-pre-wrap text-left">
                    {message.content}
                  </p>
                </div>
              </div>

              {isAuthenticated && (
                <div className="flex-shrink-0 flex items-center">
                  <div className={`
                    w-6 h-6 rounded border-2 flex items-center justify-center transition-colors
                    ${isSelected
                      ? 'bg-blue-600 border-blue-600'
                      : 'bg-white border-gray-300 hover:border-blue-400'
                    }
                  `}>
                    {isSelected && (
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {saving && (
        <div className="mt-4 flex items-center justify-center text-blue-600">
          <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Saving...
        </div>
      )}

      {isAuthenticated && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>💡 How selections work:</strong> When you click on a higher point in the discussion,
            all previous points are automatically selected (since understanding builds progressively).
            You can deselect any point to correct mistakes - this will also deselect all points after it.
          </p>
        </div>
      )}
    </div>
  );
}

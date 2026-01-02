'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface ReadingProgress {
  status: string | null;
  progress_percentage: number;
  current_chapter: number | null;
  notes: string | null;
}

const STATUS_OPTIONS = [
  { value: 'planning', label: 'Planning to Read', icon: '📖', percentage: 0 },
  { value: 'started', label: 'Started Reading', icon: '📚', percentage: 5 },
  { value: 'first_4_chapters', label: 'First 4 Chapters', icon: '📖', percentage: 20 },
  { value: 'first_10_chapters', label: 'First 10 Chapters', icon: '📕', percentage: 50 },
  { value: 'completed', label: 'Full Book Read', icon: '✅', percentage: 100 },
  { value: 'reviewed', label: 'Review Submitted', icon: '⭐', percentage: 100 }
];

interface ReadingProgressTrackerProps {
  className?: string;
}

export default function ReadingProgressTracker({ className = '' }: ReadingProgressTrackerProps) {
  const router = useRouter();
  const [progress, setProgress] = useState<ReadingProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notes, setNotes] = useState('');
  const [currentChapter, setCurrentChapter] = useState<number | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  useEffect(() => {
    fetchProgress();
  }, []);

  useEffect(() => {
    if (progress) {
      setSelectedStatus(progress.status);
      setNotes(progress.notes || '');
      setCurrentChapter(progress.current_chapter);
    }
  }, [progress]);

  const fetchProgress = async () => {
    try {
      const response = await fetch('/api/reading-progress');
      if (response.ok) {
        const data = await response.json();
        setProgress(data.progress);
      }
    } catch (error) {
      console.error('Error fetching reading progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProgress = async (newStatus: string) => {
    setSaving(true);

    try {
      const response = await fetch('/api/reading-progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          current_chapter: currentChapter,
          notes: notes
        })
      });

      if (response.ok) {
        const data = await response.json();
        setProgress(data.progress);
        setSelectedStatus(newStatus);
        router.refresh();
      } else {
        const error = await response.json();
        if (response.status === 401) {
          router.push('/auth/signin?redirect=' + encodeURIComponent(window.location.pathname));
        } else {
          alert('Error: ' + error.error);
        }
      }
    } catch (error) {
      console.error('Error updating progress:', error);
      alert('Failed to update progress. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const currentStatusOption = STATUS_OPTIONS.find(opt => opt.value === selectedStatus);

  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Track Your Reading Progress</h2>
        <p className="text-gray-600">Select your current reading status to track your journey through "Nested Reality"</p>
      </div>

      {currentStatusOption && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">{currentStatusOption.icon}</span>
            <div>
              <p className="font-semibold text-blue-900">Current Status</p>
              <p className="text-blue-700">{currentStatusOption.label}</p>
            </div>
          </div>
          <div className="mt-3">
            <div className="flex justify-between text-sm text-blue-700 mb-1">
              <span>Progress</span>
              <span>{progress?.progress_percentage || 0}%</span>
            </div>
            <div className="w-full bg-blue-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress?.progress_percentage || 0}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3 mb-6">
        <p className="text-sm font-medium text-gray-700 mb-3">Update your reading status:</p>
        {STATUS_OPTIONS.map((option) => (
          <button
            key={option.value}
            onClick={() => updateProgress(option.value)}
            disabled={saving}
            className={`
              w-full text-left p-4 rounded-lg border-2 transition-all duration-200
              ${selectedStatus === option.value
                ? 'border-blue-500 bg-blue-50 shadow-md'
                : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-gray-50'
              }
              ${saving ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            `}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{option.icon}</span>
                <div>
                  <p className="font-semibold text-gray-900">{option.label}</p>
                  <p className="text-sm text-gray-500">{option.percentage}% complete</p>
                </div>
              </div>
              {selectedStatus === option.value && (
                <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              )}
            </div>
          </button>
        ))}
      </div>

      <div className="border-t pt-4">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Current Chapter (optional)
          </label>
          <input
            type="number"
            min="1"
            max="50"
            value={currentChapter || ''}
            onChange={(e) => setCurrentChapter(e.target.value ? parseInt(e.target.value) : null)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter chapter number"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notes (optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            rows={3}
            placeholder="Share your thoughts, insights, or questions..."
            onBlur={() => selectedStatus && updateProgress(selectedStatus)}
          />
        </div>
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
    </div>
  );
}

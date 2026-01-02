'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { ReviewFormData } from '@/types';
import { trackEvent } from '@/components/GoogleAnalytics';

interface ReviewFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function ReviewForm({ onSuccess, onCancel }: ReviewFormProps) {
  const supabase = createClient();
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (rating < 1 || rating > 5) {
      setError('Please select a rating');
      setLoading(false);
      return;
    }

    if (!content.trim()) {
      setError('Please provide your review content');
      setLoading(false);
      return;
    }

    if (content.length < 50) {
      setError('Review content must be at least 50 characters');
      setLoading(false);
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setError('You must be logged in to submit a review');
        setLoading(false);
        return;
      }

      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating,
          title: title.trim() || null,
          content: content.trim(),
        } as ReviewFormData),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);

        // Track review submission event in GA4
        trackEvent('review_submitted', {
          rating: rating,
          has_title: !!title,
          content_length: content.length,
        });

        // Reset form
        setRating(0);
        setTitle('');
        setContent('');

        // Call success callback after a delay
        setTimeout(() => {
          if (onSuccess) onSuccess();
        }, 2000);
      } else {
        setError(data.error || 'Failed to submit review');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-stone-50 p-8 space-y-6 animate-in fade-in">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-serif text-stone-900 text-center">Review Submitted!</h3>
        <p className="text-stone-600 text-center">
          Your review has been submitted and is pending moderation. We&apos;ll review it shortly and notify you once it&apos;s approved.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Rating Selector */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-stone-700">
          Rating <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className={`text-3xl transition-all ${
                rating >= star
                  ? 'text-stone-900 hover:scale-110'
                  : 'text-stone-200 hover:text-stone-400'
              }`}
            >
              ★
            </button>
          ))}
        </div>
        {rating > 0 && (
          <p className="text-sm text-stone-500">
            {rating === 5 && 'Excellent'}
            {rating === 4 && 'Very Good'}
            {rating === 3 && 'Good'}
            {rating === 2 && 'Fair'}
            {rating === 1 && 'Poor'}
          </p>
        )}
      </div>

      {/* Title (Optional) */}
      <div className="space-y-2">
        <label htmlFor="title" className="block text-sm font-medium text-stone-700">
          Title <span className="text-stone-400">(Optional)</span>
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Summarize your review in a few words"
          maxLength={200}
          className="w-full p-3 bg-white border border-stone-200 text-stone-900 focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900"
        />
        <p className="text-xs text-stone-400 text-right">{title.length}/200</p>
      </div>

      {/* Content */}
      <div className="space-y-2">
        <label htmlFor="content" className="block text-sm font-medium text-stone-700">
          Your Review <span className="text-red-500">*</span>
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Share your thoughts about Nested Reality. What resonated with you? What questions do you have? (Minimum 50 characters)"
          rows={8}
          minLength={50}
          required
          className="w-full p-3 bg-white border border-stone-200 text-stone-900 focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 resize-none"
        />
        <p className="text-xs text-stone-400 text-right">{content.length} characters (min 50)</p>
      </div>

      {/* Guidelines */}
      <div className="bg-stone-50 p-4 space-y-2 text-sm text-stone-600">
        <p className="font-medium text-stone-900">Review Guidelines:</p>
        <ul className="list-disc list-inside space-y-1 text-xs">
          <li>Be respectful and constructive</li>
          <li>Focus on the ideas and concepts presented</li>
          <li>Share specific examples or quotes</li>
          <li>Avoid spoilers for future readers</li>
        </ul>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 py-3 bg-stone-900 text-white font-bold text-xs uppercase tracking-widest hover:bg-stone-800 transition-colors disabled:bg-stone-400"
        >
          {loading ? 'Submitting...' : 'Submit Review'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 border border-stone-200 text-stone-700 font-bold text-xs uppercase tracking-widest hover:border-stone-900 hover:text-stone-900 transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

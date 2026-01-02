'use client';

import { useState, useEffect } from 'react';
import { BOOK_METADATA } from '@/lib/constants';
import { Review } from '@/types';

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await fetch('/api/reviews?limit=10');
      const data = await response.json();
      if (data.success) {
        setReviews(data.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-24 space-y-16">
      <header className="text-center space-y-4">
        <h1 className="text-5xl font-serif text-stone-900">Reader Reflections</h1>
        <p className="text-stone-500">Good-faith dialogue and thoughtful critique from our community.</p>
      </header>

      {/* Official Amazon Review CTA */}
      <div className="bg-stone-900 text-stone-50 p-12 text-center space-y-6">
        <h2 className="text-3xl font-serif">Support the Discourse</h2>
        <p className="max-w-xl mx-auto opacity-70">
          Official reviews on Amazon help signal the theory&apos;s relevance to a wider scientific and philosophical audience.
          If the work has impacted your worldview, please consider leaving a reflection there.
        </p>
        <a
          href={BOOK_METADATA.formats.kindle.reviewUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-8 py-4 bg-white text-stone-900 font-bold text-xs uppercase tracking-widest hover:bg-stone-200 transition-all"
        >
          Leave Amazon Review
        </a>
      </div>

      <div className="grid md:grid-cols-[2fr_1fr] gap-12">
        {/* Review List */}
        <div className="space-y-12">
          {loading ? (
            <p className="text-stone-500 text-center">Loading reviews...</p>
          ) : reviews.length === 0 ? (
            <p className="text-stone-500 text-center">No reviews yet. Be the first to share your thoughts!</p>
          ) : (
            reviews.map((r) => (
              <div key={r.id} className="border-b border-stone-200 pb-12 last:border-0">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-stone-900">
                      {r.user?.full_name || r.user?.username || 'Anonymous Reader'}
                    </h3>
                    {r.is_verified && (
                      <p className="text-xs text-stone-500 uppercase tracking-widest flex items-center gap-1">
                        <span className="w-1 h-1 bg-stone-900 rounded-full"></span>
                        Verified Reader
                      </p>
                    )}
                  </div>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={`text-lg ${i < r.rating ? 'text-stone-900' : 'text-stone-200'}`}>★</span>
                    ))}
                  </div>
                </div>
                {r.title && <p className="font-semibold text-stone-800 mb-2">{r.title}</p>}
                <p className="text-stone-600 leading-relaxed text-lg italic">&quot;{r.content}&quot;</p>
                <div className="mt-4 flex items-center gap-4 text-xs text-stone-400">
                  <span>{new Date(r.created_at).toLocaleDateString()}</span>
                  {r.helpful_count > 0 && <span>{r.helpful_count} found this helpful</span>}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Submission Form */}
        <div className="bg-stone-50 p-8 space-y-6 h-fit sticky top-24">
          <h2 className="text-2xl font-serif text-stone-900">Share your thoughts</h2>
          <p className="text-xs text-stone-500 leading-relaxed">
            Sign in to submit a review to our internal archive.
          </p>
          <a
            href="/login"
            className="block w-full py-3 bg-stone-900 text-white font-bold text-xs uppercase tracking-widest hover:bg-stone-800 transition-colors text-center"
          >
            Sign In to Review
          </a>
        </div>
      </div>
    </div>
  );
}

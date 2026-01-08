'use client';

import { useState, useEffect } from 'react';
import { BOOK_METADATA, AI_REVIEWS } from '@/lib/constants';
import { Review } from '@/types';

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedAIReview, setExpandedAIReview] = useState<string | null>(null);

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

  const toggleAIReview = (id: string) => {
    setExpandedAIReview(expandedAIReview === id ? null : id);
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-24 space-y-16">
      <header className="text-center space-y-4">
        <h1 className="text-5xl font-serif text-stone-900">Reader Reflections</h1>
        <p className="text-stone-500">Thoughtful analysis and community dialogue exploring Nested Reality</p>
      </header>

      {/* Human Reviews Section - Start Immediately */}
      <section className="space-y-8">
        <div className="border-b border-stone-300 pb-4">
          <h2 className="text-3xl font-serif text-stone-900">Reader Reviews</h2>
          <p className="text-sm text-stone-500 mt-2">
            Authentic reflections from readers exploring Nested Reality
          </p>
        </div>

        <div className="grid md:grid-cols-[2fr_1fr] gap-12">
          {/* Review List */}
          <div className="space-y-12">
            {loading ? (
              <p className="text-stone-500 text-center">Loading reviews...</p>
            ) : reviews.length === 0 ? (
              <div className="text-center py-12 text-stone-500">
                <p className="text-lg mb-2">No reviews yet</p>
                <p className="text-sm">Be the first to share your thoughts!</p>
              </div>
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
      </section>

      {/* AI Reviews Section - Subtle tag */}
      <section className="space-y-8">
        <div className="border-b border-stone-300 pb-4">
          <div className="flex items-center gap-3">
            <h2 className="text-3xl font-serif text-stone-900">Additional Analysis</h2>
            <span className="text-xs px-2 py-1 bg-stone-100 text-stone-500 rounded">AI-Generated</span>
          </div>
          <p className="text-sm text-stone-500 mt-2">
            Comprehensive perspectives exploring Nested Reality from multiple analytical angles
          </p>
        </div>

        <div className="space-y-6">
          {AI_REVIEWS.map((review) => {
            const isExpanded = expandedAIReview === review.id;

            return (
              <div
                key={review.id}
                className="border border-stone-200 bg-white shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Review Header */}
                <div
                  className="p-6 cursor-pointer"
                  onClick={() => toggleAIReview(review.id)}
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs uppercase tracking-widest text-stone-500 font-bold">
                          {review.category}
                        </span>
                        <span className="text-stone-300">•</span>
                        <span className="text-xs text-stone-400">{review.date}</span>
                      </div>
                      <h3 className="text-2xl font-serif text-stone-900 mb-2">
                        {review.title}
                      </h3>
                      <p className="text-sm text-stone-600 italic mb-3">
                        {review.subtitle}
                      </p>
                      <div className="flex gap-1 mb-3">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className={`text-lg ${i < review.rating ? 'text-stone-900' : 'text-stone-200'}`}>★</span>
                        ))}
                      </div>
                      <p className="text-stone-700 leading-relaxed">
                        {review.excerpt}
                      </p>
                    </div>
                    <button
                      className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-stone-100 hover:bg-stone-200 transition-colors"
                      aria-label={isExpanded ? "Collapse" : "Expand"}
                    >
                      <span className={`text-stone-600 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                        ▼
                      </span>
                    </button>
                  </div>
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="px-6 pb-6 space-y-6 border-t border-stone-100">
                    {/* Sections */}
                    <div className="space-y-6 pt-6">
                      {review.sections.map((section, idx) => (
                        <div key={idx} className="space-y-3">
                          <h4 className="text-lg font-bold text-stone-900 flex items-center gap-2">
                            <span className="w-1 h-1 bg-stone-900 rounded-full"></span>
                            {section.title}
                          </h4>
                          <p className="text-stone-700 leading-relaxed pl-3">
                            {section.content}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Key Takeaways */}
                    {review.keyTakeaways && review.keyTakeaways.length > 0 && (
                      <div className="bg-stone-50 p-6 space-y-3">
                        <h4 className="text-lg font-bold text-stone-900">Key Takeaways</h4>
                        <ul className="space-y-2">
                          {review.keyTakeaways.map((takeaway, idx) => (
                            <li key={idx} className="flex items-start gap-3 text-stone-700">
                              <span className="text-stone-400 mt-1">→</span>
                              <span>{takeaway}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Support the Discourse - Moved to bottom */}
      <div className="bg-stone-900 text-stone-50 p-12 text-center space-y-6 mt-16">
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
    </div>
  );
}

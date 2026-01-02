'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Review } from '@/types';
import ReviewForm from '@/components/ReviewForm';
import Link from 'next/link';

export default function DashboardPage() {
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);
  const [userReviews, setUserReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    // Check authentication
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      setUser(user);
      await fetchUserReviews(user.id);
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.push('/login');
      }
    });

    return () => subscription.unsubscribe();
  }, [router, supabase]);

  const fetchUserReviews = async (userId: string) => {
    try {
      const response = await fetch(`/api/reviews?user_id=${userId}`);
      const data = await response.json();

      if (data.success) {
        setUserReviews(data.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = () => {
    setShowForm(false);
    // Refresh reviews
    if (user) {
      fetchUserReviews(user.id);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-24">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-stone-200 rounded w-1/3"></div>
          <div className="h-32 bg-stone-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-24 space-y-16">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <h1 className="text-4xl font-serif text-stone-900">Your Dashboard</h1>
          <p className="text-stone-600">
            Welcome back, {user?.user_metadata?.full_name || user?.user_metadata?.name || user?.email}
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="text-sm text-stone-500 hover:text-stone-900 border-b border-stone-300 hover:border-stone-900 transition-colors"
        >
          Sign Out
        </button>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6">
        <button
          onClick={() => setShowForm(!showForm)}
          className="p-6 bg-stone-50 border border-stone-200 hover:border-stone-900 hover:shadow-lg transition-all text-left group"
        >
          <h3 className="font-bold text-stone-900 mb-2 group-hover:text-stone-600">Write a Review</h3>
          <p className="text-sm text-stone-600">Share your thoughts on Nested Reality</p>
        </button>
        <Link
          href="/explorer"
          className="p-6 bg-stone-50 border border-stone-200 hover:border-stone-900 hover:shadow-lg transition-all text-left group"
        >
          <h3 className="font-bold text-stone-900 mb-2 group-hover:text-stone-600">Explore Concepts</h3>
          <p className="text-sm text-stone-600">Dive deeper with our AI guide</p>
        </Link>
        <Link
          href="/blog"
          className="p-6 bg-stone-50 border border-stone-200 hover:border-stone-900 hover:shadow-lg transition-all text-left group"
        >
          <h3 className="font-bold text-stone-900 mb-2 group-hover:text-stone-600">Read Blog</h3>
          <p className="text-sm text-stone-600">Latest articles and essays</p>
        </Link>
      </div>

      {/* Review Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 overflow-y-auto">
          <div className="min-h-screen px-4 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full p-8 my-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-serif text-stone-900">Submit Your Review</h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-stone-400 hover:text-stone-900 text-2xl"
                >
                  ×
                </button>
              </div>
              <ReviewForm onSuccess={handleReviewSubmit} onCancel={() => setShowForm(false)} />
            </div>
          </div>
        </div>
      )}

      {/* User's Reviews */}
      <section className="space-y-8">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-serif text-stone-900">My Reviews</h2>
          <button
            onClick={() => setShowForm(true)}
            className="px-6 py-2 bg-stone-900 text-white font-bold text-xs uppercase tracking-widest hover:bg-stone-800 transition-colors"
          >
            + New Review
          </button>
        </div>

        {loading ? (
          <p className="text-stone-500">Loading your reviews...</p>
        ) : userReviews.length === 0 ? (
          <div className="bg-stone-50 p-12 text-center space-y-6">
            <div className="w-16 h-16 bg-stone-200 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-8 h-8 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-serif text-stone-900 mb-2">No reviews yet</h3>
              <p className="text-stone-600 mb-6">Share your thoughts with the community</p>
              <button
                onClick={() => setShowForm(true)}
                className="px-8 py-3 bg-stone-900 text-white font-bold text-xs uppercase tracking-widest hover:bg-stone-800 transition-colors"
              >
                Write Your First Review
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {userReviews.map((review) => (
              <div key={review.id} className={`p-6 border ${
                review.moderation_status === 'approved'
                  ? 'border-stone-200 bg-white'
                  : review.moderation_status === 'pending'
                  ? 'border-yellow-200 bg-yellow-50'
                  : 'border-red-200 bg-red-50'
              }`}>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className={`text-lg ${i < review.rating ? 'text-stone-900' : 'text-stone-200'}`}>★</span>
                    ))}
                  </div>
                  <span className={`text-xs font-bold uppercase tracking-widest px-3 py-1 rounded ${
                    review.moderation_status === 'approved'
                      ? 'bg-green-100 text-green-800'
                      : review.moderation_status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {review.moderation_status}
                  </span>
                </div>
                {review.title && <h4 className="font-bold text-stone-900 mb-2">{review.title}</h4>}
                <p className="text-stone-600 leading-relaxed">{review.content}</p>
                <div className="mt-4 flex justify-between items-center text-xs text-stone-400">
                  <span>Submitted {new Date(review.created_at).toLocaleDateString()}</span>
                  {review.helpful_count > 0 && <span>{review.helpful_count} found this helpful</span>}
                </div>
                {review.moderation_notes && (
                  <div className="mt-4 pt-4 border-t border-stone-200">
                    <p className="text-xs text-stone-500"><strong>Moderation Notes:</strong> {review.moderation_notes}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

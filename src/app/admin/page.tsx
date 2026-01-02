'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Review, EssayWithUser } from '@/types';

type TabType = 'reviews' | 'essays';

export default function AdminPage() {
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('reviews');

  // Review state
  const [pendingReviews, setPendingReviews] = useState<Review[]>([]);
  const [allReviews, setAllReviews] = useState<Review[]>([]);

  // Essay state
  const [allEssays, setAllEssays] = useState<EssayWithUser[]>([]);
  const [pendingEssays, setPendingEssays] = useState<EssayWithUser[]>([]);

  const [stats, setStats] = useState({
    reviews: { total: 0, pending: 0, approved: 0, rejected: 0 },
    essays: { total: 0, published: 0, pending: 0, draft: 0 },
  });
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [filter, setFilter] = useState<'pending' | 'all'>('pending');

  useEffect(() => {
    // Check authentication and admin role
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      setUser(user);

      // Check if user is admin
      const { data: userData } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();

      if (!userData || userData.role !== 'admin') {
        router.push('/');
        return;
      }

      setUserRole(userData.role);
      await fetchData();
    };

    checkAuth();
  }, [router, supabase]);

  const fetchData = async () => {
    setLoading(true);
    await Promise.all([fetchReviews(), fetchEssays()]);
    setLoading(false);
  };

  const fetchReviews = async () => {
    try {
      const pendingResponse = await fetch('/api/reviews?limit=100');
      const pendingData = await pendingResponse.json();

      if (pendingData.success) {
        const pending = pendingData.data.data.filter((r: Review) => r.moderation_status === 'pending');
        setPendingReviews(pending);
      }

      const allResponse = await fetch('/api/reviews?limit=1000');
      const allData = await allResponse.json();

      if (allData.success) {
        const reviews = allData.data.data;
        setAllReviews(reviews);
        setStats(prev => ({
          ...prev,
          reviews: {
            total: reviews.length,
            pending: reviews.filter((r: Review) => r.moderation_status === 'pending').length,
            approved: reviews.filter((r: Review) => r.moderation_status === 'approved').length,
            rejected: reviews.filter((r: Review) => r.moderation_status === 'rejected').length,
          }
        }));
      }
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    }
  };

  const fetchEssays = async () => {
    try {
      const response = await fetch('/api/essays?limit=1000');
      const data = await response.json();

      if (data.success) {
        const essays = data.data.data;
        setAllEssays(essays);

        const pending = essays.filter((e: DatabaseEssay) => !e.is_approved && e.is_published);
        setPendingEssays(pending);

        setStats(prev => ({
          ...prev,
          essays: {
            total: essays.length,
            published: essays.filter((e: DatabaseEssay) => e.is_published && e.is_approved).length,
            pending: pending.length,
            draft: essays.filter((e: DatabaseEssay) => !e.is_published).length,
          }
        }));
      }
    } catch (error) {
      console.error('Failed to fetch essays:', error);
    }
  };

  const handleModerateReview = async (reviewId: string, action: 'approve' | 'reject', notes?: string) => {
    setActionLoading(reviewId);

    try {
      const response = await fetch(`/api/admin/reviews/${reviewId}/moderate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, moderation_notes: notes }),
      });

      const data = await response.json();

      if (data.success) {
        await fetchData();
      } else {
        alert(data.error || 'Action failed');
      }
    } catch (error) {
      alert('An error occurred');
    } finally {
      setActionLoading(null);
    }
  };

  const handleModerateEssay = async (essayId: string, action: 'approve' | 'reject' | 'unpublish') => {
    setActionLoading(essayId);

    try {
      const response = await fetch(`/api/admin/essays/${essayId}/moderate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });

      const data = await response.json();

      if (data.success) {
        await fetchData();
      } else {
        alert(data.error || 'Action failed');
      }
    } catch (error) {
      alert('An error occurred');
    } finally {
      setActionLoading(null);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-stone-200 rounded w-1/4"></div>
          <div className="grid grid-cols-4 gap-6">
            <div className="h-32 bg-stone-200 rounded"></div>
            <div className="h-32 bg-stone-200 rounded"></div>
            <div className="h-32 bg-stone-200 rounded"></div>
            <div className="h-32 bg-stone-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-24 space-y-12">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-serif text-stone-900 mb-2">Admin Dashboard</h1>
          <p className="text-stone-600">Moderate reviews and manage content</p>
        </div>
        <button
          onClick={handleLogout}
          className="text-sm text-stone-500 hover:text-stone-900 border-b border-stone-300 hover:border-stone-900 transition-colors"
        >
          Sign Out
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-stone-50 p-6 border border-stone-200">
          <p className="text-3xl font-serif font-bold text-stone-900">{stats.reviews.total}</p>
          <p className="text-sm text-stone-500 uppercase tracking-widest mt-1">Total Reviews</p>
        </div>
        <div className="bg-yellow-50 p-6 border border-yellow-200">
          <p className="text-3xl font-serif font-bold text-yellow-700">{stats.reviews.pending}</p>
          <p className="text-sm text-yellow-600 uppercase tracking-widest mt-1">Pending Reviews</p>
        </div>
        <div className="bg-green-50 p-6 border border-green-200">
          <p className="text-3xl font-serif font-bold text-green-700">{stats.essays.published}</p>
          <p className="text-sm text-green-600 uppercase tracking-widest mt-1">Published Essays</p>
        </div>
        <div className="bg-blue-50 p-6 border border-blue-200">
          <p className="text-3xl font-serif font-bold text-blue-700">{stats.essays.total}</p>
          <p className="text-sm text-blue-600 uppercase tracking-widest mt-1">Total Essays</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-stone-200">
        <nav className="flex gap-8">
          <button
            onClick={() => setActiveTab('reviews')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'reviews'
                ? 'border-stone-900 text-stone-900'
                : 'border-transparent text-stone-500 hover:text-stone-900'
            }`}
          >
            Reviews ({stats.reviews.pending} pending)
          </button>
          <button
            onClick={() => setActiveTab('essays')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'essays'
                ? 'border-stone-900 text-stone-900'
                : 'border-transparent text-stone-500 hover:text-stone-900'
            }`}
          >
            Essays ({stats.essays.pending} pending)
          </button>
        </nav>
      </div>

      {/* Content Area */}
      {activeTab === 'reviews' ? (
        <div className="space-y-6">
          {filter === 'pending' && pendingReviews.length === 0 ? (
            <div className="bg-stone-50 p-12 text-center">
              <p className="text-stone-600">No pending reviews to moderate</p>
            </div>
          ) : filter === 'pending' ? (
            pendingReviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                onModerate={handleModerateReview}
                loading={actionLoading === review.id}
              />
            ))
          ) : (
            allReviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                onModerate={handleModerateReview}
                loading={actionLoading === review.id}
              />
            ))
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {allEssays.length === 0 ? (
            <div className="bg-stone-50 p-12 text-center">
              <p className="text-stone-600">No essays yet</p>
            </div>
          ) : (
            allEssays.map((essay) => (
              <EssayCard
                key={essay.id}
                essay={essay}
                onModerate={handleModerateEssay}
                loading={actionLoading === essay.id}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}

function ReviewCard({
  review,
  onModerate,
  loading,
}: {
  review: Review;
  onModerate: (id: string, action: 'approve' | 'reject', notes?: string) => Promise<void>;
  loading: boolean;
}) {
  const [notes, setNotes] = useState('');
  const [showNotes, setShowNotes] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  return (
    <div className={`p-6 border ${
      review.moderation_status === 'pending'
        ? 'border-yellow-200 bg-yellow-50'
        : review.moderation_status === 'approved'
        ? 'border-stone-200 bg-white'
        : 'border-red-200 bg-red-50'
    }`}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-2">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={`text-lg ${i < review.rating ? 'text-stone-900' : 'text-stone-200'}`}>★</span>
              ))}
            </div>
            <span className={`text-xs font-bold uppercase tracking-widest px-3 py-1 rounded ${getStatusColor(review.moderation_status)}`}>
              {review.moderation_status}
            </span>
          </div>

          {review.title && <h4 className="font-bold text-stone-900 mb-2">{review.title}</h4>}

          <p className="text-stone-600 leading-relaxed mb-4">{review.content}</p>

          <div className="flex items-center gap-4 text-sm text-stone-400">
            <span>
              By: {review.user?.full_name || review.user?.username || 'Anonymous'}
            </span>
            <span>•</span>
            <span>{new Date(review.created_at).toLocaleDateString()}</span>
          </div>

          {review.moderation_notes && (
            <div className="mt-4 pt-4 border-t border-stone-200">
              <p className="text-xs text-stone-500">
                <strong>Notes:</strong> {review.moderation_notes}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Actions for pending reviews */}
      {review.moderation_status === 'pending' && (
        <div className="mt-6 pt-6 border-t border-stone-200">
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => setShowNotes(!showNotes)}
              className="text-xs text-stone-500 hover:text-stone-900 border-b border-stone-300 hover:border-stone-900"
            >
              {showNotes ? 'Hide' : 'Add'} Moderation Notes
            </button>
          </div>

          {showNotes && (
            <div className="mb-4">
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add moderation notes (optional)"
                rows={2}
                className="w-full p-3 border border-stone-200 text-stone-900 focus:outline-none focus:border-stone-900 text-sm"
              />
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => onModerate(review.id, 'approve', notes)}
              disabled={loading}
              className="px-6 py-2 bg-green-600 text-white font-bold text-xs uppercase tracking-widest hover:bg-green-700 disabled:bg-green-400 transition-colors"
            >
              {loading ? 'Processing...' : 'Approve'}
            </button>
            <button
              onClick={() => onModerate(review.id, 'reject', notes)}
              disabled={loading}
              className="px-6 py-2 bg-red-600 text-white font-bold text-xs uppercase tracking-widest hover:bg-red-700 disabled:bg-red-400 transition-colors"
            >
              {loading ? 'Processing...' : 'Reject'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function EssayCard({
  essay,
  onModerate,
  loading,
}: {
  essay: DatabaseEssay;
  onModerate: (id: string, action: 'approve' | 'reject' | 'unpublish') => Promise<void>;
  loading: boolean;
}) {
  const getStatusColor = (published: boolean, approved: boolean) => {
    if (!published && !approved) return 'bg-red-100 text-red-800 border-red-200';
    if (published && approved) return 'bg-green-100 text-green-800 border-green-200';
    return 'bg-yellow-100 text-yellow-800 border-yellow-200';
  };

  const getStatusText = (published: boolean, approved: boolean) => {
    if (!published && !approved) return 'REJECTED';
    if (published && approved) return 'PUBLISHED';
    return 'PENDING';
  };

  return (
    <div className={`p-6 border ${
      !essay.is_published && !essay.is_approved
        ? 'border-red-200 bg-red-50'
        : essay.is_published && essay.is_approved
        ? 'border-stone-200 bg-white'
        : 'border-yellow-200 bg-yellow-50'
    }`}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-4 mb-2">
            <h4 className="font-bold text-stone-900 text-lg">{essay.title}</h4>
            <span className={`text-xs font-bold uppercase tracking-widest px-3 py-1 rounded ${getStatusColor(essay.is_published, essay.is_approved)}`}>
              {getStatusText(essay.is_published, essay.is_approved)}
            </span>
          </div>

          {essay.excerpt && (
            <p className="text-stone-600 text-sm mb-2">{essay.excerpt}</p>
          )}

          <div className="flex items-center gap-4 text-xs text-stone-500 mb-2">
            <span>
              By: {essay.user?.full_name || essay.user?.username || 'Unknown'}
            </span>
            <span>•</span>
            <span>{essay.category || 'Uncategorized'}</span>
            <span>•</span>
            <span>{essay.word_count || 0} words</span>
            <span>•</span>
            <span>{essay.read_time_minutes || 0} min read</span>
          </div>

          <div className="flex items-center gap-2 text-xs text-stone-500">
            <span>{new Date(essay.created_at).toLocaleDateString()}</span>
            <span>•</span>
            <span>{essay.view_count || 0} views</span>
          </div>

          {essay.tags && essay.tags.length > 0 && (
            <div className="mt-3 flex gap-2 flex-wrap">
              {essay.tags.map((tag, i) => (
                <span key={i} className="text-xs bg-stone-100 text-stone-600 px-2 py-1 rounded">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {essay.is_published && essay.is_approved ? (
        <div className="mt-6 pt-6 border-t border-stone-200">
          <button
            onClick={() => onModerate(essay.id, 'unpublish')}
            disabled={loading}
            className="px-6 py-2 bg-stone-600 text-white font-bold text-xs uppercase tracking-widest hover:bg-stone-700 disabled:bg-stone-400 transition-colors"
          >
            {loading ? 'Processing...' : 'Unpublish'}
          </button>
        </div>
      ) : (
        <div className="mt-6 pt-6 border-t border-stone-200">
          <button
            onClick={() => onModerate(essay.id, 'approve')}
            disabled={loading}
            className="px-6 py-2 bg-green-600 text-white font-bold text-xs uppercase tracking-widest hover:bg-green-700 disabled:bg-green-400 transition-colors mr-3"
          >
            {loading ? 'Processing...' : 'Publish'}
          </button>
          <button
            onClick={() => onModerate(essay.id, 'reject')}
            disabled={loading}
            className="px-6 py-2 bg-red-600 text-white font-bold text-xs uppercase tracking-widest hover:bg-red-700 disabled:bg-red-400 transition-colors"
          >
            {loading ? 'Processing...' : 'Reject'}
          </button>
        </div>
      )}
    </div>
  );
}

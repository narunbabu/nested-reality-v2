'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Reply, X } from 'lucide-react';
import LikeButton from '@/components/LikeButton';

interface Comment {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  parent_type: string;
  parent_id: string;
  like_count?: number;
  user: {
    id: string;
    username: string | null;
    full_name: string | null;
    avatar_url: string | null;
  };
  replies?: Comment[];
  replyCount?: number;
}

interface CommentsProps {
  parentType: 'essay' | 'review';
  parentId: string;
  authorId?: string; // ID of the essay/review author
}

function CommentItem({
  comment,
  authorId,
  depth = 0,
  onReply,
  user,
}: {
  comment: Comment;
  authorId?: string;
  depth?: number;
  onReply: (parentId: string, content: string) => Promise<void>;
  user: any;
}) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [loadingReplies, setLoadingReplies] = useState(false);
  const [replies, setReplies] = useState<Comment[]>([]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim() || !user) return;

    setSubmitting(true);
    try {
      await onReply(comment.id, replyContent.trim());
      setReplyContent('');
      setShowReplyForm(false);

      // Reload replies
      await loadReplies();
    } catch (err) {
      console.error('Reply error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const loadReplies = async () => {
    if (comment.replies) {
      setShowReplies(!showReplies);
      return;
    }

    setLoadingReplies(true);
    try {
      const response = await fetch(
        `/api/comments?parent_type=comment&parent_id=${comment.id}`
      );
      const data = await response.json();

      if (data.success) {
        setReplies(data.data);
        setShowReplies(true);
      }
    } catch (err) {
      console.error('Load replies error:', err);
    } finally {
      setLoadingReplies(false);
    }
  };

  const maxDepth = 5;
  const canReply = depth < maxDepth;

  return (
    <div className={`${depth > 0 ? 'ml-8 mt-4' : ''}`}>
      <div className="border-l-2 border-stone-200 pl-6 py-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-stone-200 flex items-center justify-center">
              {comment.user.avatar_url ? (
                <img
                  src={comment.user.avatar_url}
                  alt={comment.user.username || 'User'}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <span className="text-stone-600 font-bold text-sm">
                  {(comment.user.full_name || comment.user.username || 'U')[0].toUpperCase()}
                </span>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="font-bold text-stone-900">
                  {comment.user.full_name || comment.user.username || 'Anonymous'}
                </p>
                {comment.user_id === authorId && (
                  <span className="px-2 py-0.5 bg-stone-900 text-white text-xs font-bold uppercase tracking-wider">
                    Author
                  </span>
                )}
              </div>
              <p className="text-xs text-stone-500">
                {formatDate(comment.created_at)}
              </p>
            </div>
          </div>
          {user && canReply && (
            <button
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="text-xs text-stone-500 hover:text-stone-900 flex items-center gap-1"
            >
              <Reply size={14} />
              Reply
            </button>
          )}
        </div>

        <p className="text-stone-700 leading-relaxed whitespace-pre-wrap mb-3">
          {comment.content}
        </p>

        {/* Like Button */}
        <div className="mb-3">
          <LikeButton
            id={comment.id}
            type="comment"
            initialLikeCount={comment.like_count || 0}
          />
        </div>

        {/* Reply Form */}
        {showReplyForm && (
          <form onSubmit={handleReplySubmit} className="mt-4 space-y-3">
            <textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Write your reply..."
              rows={3}
              className="w-full px-4 py-3 border border-stone-200 focus:outline-none focus:border-stone-900 text-sm"
              disabled={submitting}
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowReplyForm(false)}
                className="px-4 py-2 text-stone-600 hover:text-stone-900 text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting || !replyContent.trim()}
                className="px-4 py-2 bg-stone-900 text-white font-bold text-xs uppercase tracking-widest hover:bg-stone-800 transition-colors disabled:bg-stone-400"
              >
                {submitting ? 'Posting...' : 'Post Reply'}
              </button>
            </div>
          </form>
        )}

        {/* Replies Toggle */}
        {(comment.replyCount || comment.replies || replies.length > 0) && (
          <button
            onClick={loadReplies}
            disabled={loadingReplies}
            className="text-xs text-stone-500 hover:text-stone-900 mt-2 flex items-center gap-1"
          >
            {loadingReplies ? (
              'Loading...'
            ) : showReplies ? (
              <>Hide Replies</>
            ) : (
              <>
                {comment.replyCount || replies.length || comment.replies?.length || 0}{' '}
                Replies
              </>
            )}
          </button>
        )}
      </div>

      {/* Nested Replies */}
      {showReplies && (replies.length > 0 || comment.replies) && (
        <div className="space-y-4">
          {(comment.replies || replies).map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              authorId={authorId}
              depth={depth + 1}
              onReply={onReply}
              user={user}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function Comments({ parentType, parentId, authorId }: CommentsProps) {
  const supabase = createClient();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check auth status
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    // Load comments
    loadComments();
  }, [parentId]);

  const loadComments = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/comments?parent_type=${parentType}&parent_id=${parentId}`
      );
      const data = await response.json();

      if (data.success) {
        // Enrich comments with reply counts
        const enrichedComments = await Promise.all(
          data.data.map(async (comment: Comment) => {
            const replyResponse = await fetch(
              `/api/comments?parent_type=comment&parent_id=${comment.id}`
            );
            const replyData = await replyResponse.json();
            return {
              ...comment,
              replyCount: replyData.success ? replyData.data.length : 0,
            };
          })
        );
        setComments(enrichedComments);
      }
    } catch (err) {
      console.error('Load comments error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    setSubmitting(true);
    setError('');

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          parent_type: parentType,
          parent_id: parentId,
          content: newComment.trim(),
        }),
      });

      const data = await response.json();

      if (data.success) {
        await loadComments(); // Reload to get updated reply counts
        setNewComment('');
      } else {
        setError(data.error || 'Failed to post comment');
      }
    } catch (err) {
      setError('An error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReply = async (parentId: string, content: string) => {
    const response = await fetch('/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        parent_type: 'comment',
        parent_id: parentId,
        content,
      }),
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'Failed to post reply');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-t border-stone-200 pt-8">
        <h3 className="text-2xl font-serif text-stone-900 mb-6">
          Discussion ({comments.reduce((acc, c) => acc + (c.replyCount || 0) + 1, 0)})
        </h3>

        {/* Comment Form */}
        {user ? (
          <form onSubmit={handleSubmit} className="mb-8 space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
                {error}
              </div>
            )}
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your thoughts..."
              rows={4}
              className="w-full px-4 py-3 border border-stone-200 focus:outline-none focus:border-stone-900"
              disabled={submitting}
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submitting || !newComment.trim()}
                className="px-6 py-3 bg-stone-900 text-white font-bold text-xs uppercase tracking-widest hover:bg-stone-800 transition-colors disabled:bg-stone-400"
              >
                {submitting ? 'Posting...' : 'Post Comment'}
              </button>
            </div>
          </form>
        ) : (
          <div className="mb-8 p-6 bg-stone-50 border border-stone-200 text-center">
            <p className="text-stone-600 mb-4">
              Please sign in to join the discussion
            </p>
            <a
              href="/login"
              className="inline-block px-6 py-3 bg-stone-900 text-white font-bold text-xs uppercase tracking-widest hover:bg-stone-800 transition-colors"
            >
              Sign In
            </a>
          </div>
        )}

        {/* Comments List */}
        {loading ? (
          <div className="text-center py-8 text-stone-500">Loading comments...</div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8 text-stone-500">
            No comments yet. Be the first to share your thoughts!
          </div>
        ) : (
          <div className="space-y-6">
            {comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                authorId={authorId}
                onReply={handleReply}
                user={user}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

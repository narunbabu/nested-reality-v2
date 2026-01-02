'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface LikeButtonProps {
  id: string;
  type: 'essay' | 'comment';
  initialLikeCount?: number;
  className?: string;
  showLabel?: boolean;
}

export default function LikeButton({
  id,
  type,
  initialLikeCount = 0,
  className = '',
  showLabel = false
}: LikeButtonProps) {
  const router = useRouter();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [loading, setLoading] = useState(false);

  // Fetch like status on mount
  useEffect(() => {
    const fetchLikeStatus = async () => {
      try {
        const response = await fetch(`/api/${type}s/${id}/like`);
        if (response.ok) {
          const data = await response.json();
          setLiked(data.liked);
          setLikeCount(data.likeCount);
        }
      } catch (error) {
        console.error('Error fetching like status:', error);
      }
    };

    fetchLikeStatus();
  }, [id, type]);

  const handleLike = async () => {
    setLoading(true);

    try {
      const response = await fetch(`/api/${type}s/${id}/like`, {
        method: 'POST',
      });

      if (response.ok) {
        const data = await response.json();
        setLiked(data.liked);
        setLikeCount(prev => data.liked ? prev + 1 : prev - 1);

        // Refresh to update other components
        router.refresh();
      } else {
        const error = await response.json();
        if (response.status === 401) {
          // Redirect to login or show auth modal
          router.push('/auth/signin?redirect=' + encodeURIComponent(window.location.pathname));
        } else {
          console.error('Error toggling like:', error.error);
        }
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLike}
      disabled={loading}
      className={`
        inline-flex items-center gap-2 px-3 py-1.5 rounded-lg
        transition-all duration-200
        ${liked
          ? 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100'
          : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100'
        }
        ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      aria-label={liked ? `Unlike this ${type}` : `Like this ${type}`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={`h-5 w-5 transition-transform duration-200 ${liked ? 'scale-110' : 'scale-100'}`}
        fill={liked ? 'currentColor' : 'none'}
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>

      <span className="font-semibold">{likeCount}</span>

      {showLabel && (
        <span className="text-sm hidden sm:inline">
          {liked ? 'Liked' : 'Like'}
        </span>
      )}

      {loading && (
        <svg
          className="animate-spin h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
    </button>
  );
}

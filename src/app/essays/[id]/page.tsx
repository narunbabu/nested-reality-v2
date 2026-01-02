'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Image from 'next/image';
import Link from 'next/link';
import Comments from '@/components/Comments';
import SocialShare from '@/components/SocialShare';
import LikeButton from '@/components/LikeButton';

interface Essay {
  id: string;
  user_id: string;
  title: string;
  excerpt: string | null;
  content: string;
  category: string | null;
  tags: string[] | null;
  featured_image: string | null;
  word_count: number | null;
  read_time_minutes: number | null;
  view_count: number;
  like_count: number;
  created_at: string;
  updated_at: string;
  user: {
    id: string;
    username: string | null;
    full_name: string | null;
    avatar_url: string | null;
    bio: string | null;
  };
}

export default function EssayPage() {
  const params = useParams();
  const router = useRouter();
  const supabase = createClient();
  const [essay, setEssay] = useState<Essay | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState<any>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    // Check auth
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    // Load essay
    loadEssay();
  }, [params.id]);

  const loadEssay = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/essays/${params.id}`);
      const data = await response.json();

      if (data.success) {
        setEssay(data.data);
      } else {
        setError(data.error || 'Essay not found');
      }
    } catch (err) {
      setError('Failed to load essay');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this essay? This action cannot be undone.')) {
      return;
    }

    setDeleting(true);
    try {
      const response = await fetch(`/api/essays/${params.id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        router.push('/blog');
        router.refresh();
      } else {
        alert(data.error || 'Failed to delete essay');
      }
    } catch (err) {
      alert('An error occurred');
    } finally {
      setDeleting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-stone-500">Loading...</div>
      </div>
    );
  }

  if (error || !essay) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-serif text-stone-900 mb-4">Essay Not Found</h1>
          <p className="text-stone-600 mb-6">{error}</p>
          <Link
            href="/blog"
            className="inline-block px-6 py-3 bg-stone-900 text-white font-bold text-xs uppercase tracking-widest hover:bg-stone-800"
          >
            Back to Essays
          </Link>
        </div>
      </div>
    );
  }

  const essayUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/essays/${essay.id}`;
  const isAuthor = user && user.id === essay.user_id;

  return (
    <div className="min-h-screen bg-stone-50 py-12">
      <article className="max-w-4xl mx-auto px-6">
        {/* Back Button */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm font-bold text-stone-400 hover:text-stone-900 mb-8 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Essays
        </Link>

        {/* Header */}
        <header className="space-y-6 mb-12">
          {essay.category && (
            <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-stone-400">
              <span>{essay.category}</span>
              {essay.read_time_minutes && (
                <>
                  <span className="w-1 h-1 bg-stone-300 rounded-full"></span>
                  <span>{essay.read_time_minutes} min read</span>
                </>
              )}
              <span className="w-1 h-1 bg-stone-300 rounded-full"></span>
              <span>{formatDate(essay.created_at)}</span>
            </div>
          )}

          <h1 className="text-4xl md:text-5xl font-serif text-stone-900 leading-tight">
            {essay.title}
          </h1>

          {essay.excerpt && (
            <p className="text-xl text-stone-600 leading-relaxed italic">
              {essay.excerpt}
            </p>
          )}

          {/* Author Info */}
          <div className="flex items-center gap-4 pt-4">
            <div className="w-12 h-12 rounded-full bg-stone-200 flex items-center justify-center overflow-hidden">
              {essay.user.avatar_url ? (
                <Image
                  src={essay.user.avatar_url}
                  alt={essay.user.username || 'Author'}
                  width={48}
                  height={48}
                  className="object-cover"
                />
              ) : (
                <span className="text-stone-600 font-bold">
                  {(essay.user.full_name || essay.user.username || 'A')[0].toUpperCase()}
                </span>
              )}
            </div>
            <div>
              <p className="font-bold text-stone-900">
                {essay.user.full_name || essay.user.username || 'Anonymous'}
              </p>
              <p className="text-sm text-stone-500">Contributor</p>
            </div>
          </div>

          {/* Tags */}
          {essay.tags && essay.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-4">
              {essay.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-stone-100 text-stone-700 text-xs font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Featured Image */}
        {essay.featured_image && (
          <div className="aspect-video mb-12 bg-stone-100 overflow-hidden">
            <Image
              src={essay.featured_image}
              alt={essay.title}
              width={1200}
              height={675}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Content */}
        <div className="prose prose-stone lg:prose-xl max-w-none mb-12">
          <div
            className="text-stone-700 leading-relaxed font-serif text-lg essay-content"
            dangerouslySetInnerHTML={{ __html: essay.content }}
          />
        </div>

        {/* Author Actions (if owner) */}
        {isAuthor && (
          <div className="flex gap-4 mb-12 pb-12 border-b border-stone-200">
            <Link
              href={`/essays/${essay.id}/edit`}
              className="px-6 py-3 bg-stone-900 text-white font-bold text-xs uppercase tracking-widest hover:bg-stone-800 transition-colors"
            >
              Edit Essay
            </Link>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="px-6 py-3 bg-red-600 text-white font-bold text-xs uppercase tracking-widest hover:bg-red-700 transition-colors disabled:bg-red-400"
            >
              {deleting ? 'Deleting...' : 'Delete Essay'}
            </button>
          </div>
        )}

        {/* Social Share & Like */}
        <div className="flex justify-center items-center gap-6 mb-12 pb-12 border-b border-stone-200">
          <LikeButton
            id={essay.id}
            type="essay"
            initialLikeCount={essay.like_count || 0}
            showLabel={true}
          />
          <SocialShare
            url={essayUrl}
            title={essay.title}
            description={essay.excerpt || undefined}
          />
        </div>

        {/* Comments */}
        <Comments
          parentType="essay"
          parentId={essay.id}
          authorId={essay.user_id}
        />
      </article>
    </div>
  );
}

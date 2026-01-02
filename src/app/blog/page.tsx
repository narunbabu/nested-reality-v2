'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import Image from 'next/image';

interface Essay {
  id: string;
  title: string;
  excerpt: string | null;
  category: string | null;
  featured_image: string | null;
  read_time_minutes: number | null;
  created_at: string;
  user: {
    username: string | null;
    full_name: string | null;
  };
}

export default function BlogPage() {
  const supabase = createClient();
  const [essays, setEssays] = useState<Essay[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check auth status
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    // Load essays
    loadEssays();
  }, []);

  const loadEssays = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/essays');
      const data = await response.json();

      if (data.success) {
        setEssays(data.data.data);
      }
    } catch (err) {
      console.error('Load essays error:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-24 space-y-16">
      <header className="space-y-4">
        <h1 className="text-5xl font-serif text-stone-900">Community Essays</h1>
        <p className="text-stone-500 text-xl font-serif italic">
          Deep dives, reflections, and insights from the Nested Reality community.
        </p>
      </header>

      {/* Write Essay Button (if logged in) */}
      {user && (
        <div className="flex justify-end">
          <Link
            href="/essays/new"
            className="px-8 py-4 bg-stone-900 text-white font-bold text-xs uppercase tracking-widest hover:bg-stone-800 transition-colors"
          >
            Write an Essay
          </Link>
        </div>
      )}

      {/* Essays List */}
      {loading ? (
        <div className="text-center py-12 text-stone-500">Loading essays...</div>
      ) : essays.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-stone-600 mb-6">No essays published yet.</p>
          {user && (
            <Link
              href="/essays/new"
              className="inline-block px-8 py-4 bg-stone-900 text-white font-bold text-xs uppercase tracking-widest hover:bg-stone-800 transition-colors"
            >
              Be the First to Write
            </Link>
          )}
        </div>
      ) : (
        <div className="grid gap-16">
          {essays.map((essay) => (
            <article
              key={essay.id}
              className="group grid md:grid-cols-[1fr_2fr] gap-8 items-center border-b border-stone-100 pb-16 last:border-0"
            >
              {/* Featured Image */}
              <Link href={`/essays/${essay.id}`} className="aspect-[4/3] bg-stone-200 overflow-hidden block">
                {essay.featured_image ? (
                  <Image
                    src={essay.featured_image}
                    alt={essay.title}
                    width={600}
                    height={450}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-stone-100 to-stone-300 flex items-center justify-center">
                    <svg
                      className="w-16 h-16 text-stone-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                )}
              </Link>

              {/* Content */}
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-stone-400">
                  {essay.category && <span>{essay.category}</span>}
                  {essay.category && essay.read_time_minutes && (
                    <span className="w-1 h-1 bg-stone-300 rounded-full"></span>
                  )}
                  {essay.read_time_minutes && <span>{essay.read_time_minutes} min read</span>}
                  <span className="w-1 h-1 bg-stone-300 rounded-full"></span>
                  <span>{formatDate(essay.created_at)}</span>
                </div>

                <Link href={`/essays/${essay.id}`}>
                  <h2 className="text-3xl font-serif text-stone-900 group-hover:text-stone-600 transition-colors cursor-pointer">
                    {essay.title}
                  </h2>
                </Link>

                {essay.excerpt && (
                  <p className="text-stone-600 leading-relaxed line-clamp-3">{essay.excerpt}</p>
                )}

                <div className="flex items-center justify-between pt-2">
                  <p className="text-sm text-stone-500">
                    by {essay.user.full_name || essay.user.username || 'Anonymous'}
                  </p>

                  <Link
                    href={`/essays/${essay.id}`}
                    className="text-sm font-bold border-b border-stone-900 pb-0.5 hover:text-stone-500 hover:border-stone-500 transition-all"
                  >
                    Read Full Essay &rarr;
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Call to Action */}
      <div className="bg-stone-900 text-white p-12 text-center space-y-6">
        <h3 className="text-2xl font-serif">Contribute to the Archive</h3>
        <p className="max-w-xl mx-auto opacity-70">
          Are you an academic or reader with a unique reflection? We welcome guest essays that
          tackle the core themes of Nested Reality.
        </p>
        {user ? (
          <Link
            href="/essays/new"
            className="inline-block px-8 py-3 border border-white/20 hover:border-white transition-all text-sm font-bold uppercase tracking-widest"
          >
            Write an Essay
          </Link>
        ) : (
          <Link
            href="/login"
            className="inline-block px-8 py-3 border border-white/20 hover:border-white transition-all text-sm font-bold uppercase tracking-widest"
          >
            Sign In to Contribute
          </Link>
        )}
      </div>
    </div>
  );
}

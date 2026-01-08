'use client';

import { useState } from 'react';

export default function ChapterOneCapture() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      // TODO: Integrate with your email service (ConvertKit, Mailchimp, etc.)
      // For now, we'll simulate success
      await new Promise(resolve => setTimeout(resolve, 1000));

      setStatus('success');
      setEmail('');

      // You can add actual email service integration here
      console.log('Email submitted:', email);
    } catch (error) {
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className="max-w-2xl mx-auto px-6 py-16 text-center">
        <div className="space-y-6 p-8 bg-stone-900/50 border-2 border-[#C5A059]/40">
          <div className="w-16 h-16 mx-auto bg-[#C5A059]/20 border border-[#C5A059]/40 flex items-center justify-center rounded-full">
            <svg className="w-8 h-8 text-[#C5A059]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-2xl font-serif text-stone-100">Check Your Email!</h3>
          <p className="text-stone-400">
            We've sent you Chapter 1. Look for an email from Nested Reality in your inbox (check spam if you don't see it).
          </p>
        </div>
      </div>
    );
  }

  return (
    <section className="max-w-2xl mx-auto px-6 py-16">
      <div className="bg-gradient-to-br from-stone-900/80 to-stone-900/50 border-2 border-[#C5A059]/30 p-8 md:p-12 space-y-6">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#C5A059]/20 border border-[#C5A059]/40 rounded text-sm">
            <svg className="w-4 h-4 text-[#C5A059]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span className="text-[#C5A059] font-semibold">FREE CHAPTER</span>
          </div>

          <h3 className="text-3xl md:text-4xl font-serif text-stone-100">
            Not Ready to Buy?
          </h3>

          <p className="text-xl text-stone-300">
            Get <strong className="text-[#C5A059]">Chapter 1 Free</strong> — No Math, No Jargon
          </p>

          <p className="text-sm text-stone-400">
            Read how gravity works without forces. Decide if this perspective resonates with you.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="flex-1 px-6 py-4 bg-stone-900 border-2 border-stone-700 text-stone-100 placeholder-stone-500 focus:border-[#C5A059] focus:outline-none transition-colors"
              disabled={status === 'loading'}
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="px-8 py-4 bg-[#C5A059] text-black font-bold hover:bg-[#D4B069] transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {status === 'loading' ? 'Sending...' : 'Get Chapter 1'}
            </button>
          </div>

          {status === 'error' && (
            <p className="text-red-400 text-sm text-center">
              Something went wrong. Please try again.
            </p>
          )}

          <p className="text-xs text-stone-500 text-center">
            We respect your privacy. Unsubscribe anytime.
          </p>
        </form>
      </div>
    </section>
  );
}

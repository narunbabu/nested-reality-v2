'use client';

import React, { useState } from 'react';
import { trackEvent } from '@/components/GoogleAnalytics';

export default function NewsletterPage() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        setSubscribed(true);

        // Track newsletter subscription event in GA4
        trackEvent('newsletter_subscribed', {
          method: 'form',
        });
      } else {
        setError(data.error || 'Failed to subscribe. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-32 text-center space-y-12">
      <div className="space-y-4">
        <h1 className="text-6xl font-serif text-stone-900">The Gradient</h1>
        <p className="text-xl text-stone-600 italic">Stay informed on the latest updates to the substrate.</p>
      </div>

      {!subscribed ? (
        <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-6">
          <p className="text-sm text-stone-500 leading-relaxed">
            Join 5,000+ readers receiving monthly deep-dives, lecture notes, and pre-release chapters from Arun Nalamara.
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
              {error}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              disabled={loading}
              className="flex-grow p-4 bg-white border border-stone-200 text-stone-900 focus:outline-none focus:border-stone-900 transition-colors disabled:bg-stone-100 disabled:cursor-not-allowed"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-4 bg-stone-900 text-white font-bold text-xs uppercase tracking-widest hover:bg-stone-800 transition-all disabled:bg-stone-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Subscribing...' : 'Subscribe'}
            </button>
          </div>
          <p className="text-[10px] text-stone-400 uppercase tracking-widest">No spam. Only structural updates.</p>
        </form>
      ) : (
        <div className="bg-stone-100 p-12 space-y-6 animate-in fade-in zoom-in duration-500">
          <h2 className="text-2xl font-serif">Welcome to the Plenum</h2>
          <p className="text-stone-600">A confirmation email has been dispatched to {email}. We look forward to sharing new perspectives with you.</p>
          <button
            onClick={() => setSubscribed(false)}
            className="text-stone-900 font-bold text-xs uppercase tracking-widest border-b border-stone-900 pb-1"
          >
            Back
          </button>
        </div>
      )}

      <div className="pt-24 grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
        <div className="p-8 border border-stone-100 space-y-4">
          <h3 className="font-bold text-stone-900">Recent Archives</h3>
          <ul className="space-y-2 text-sm text-stone-500 italic">
            <li>&quot;The Fallacy of Discrete Motion&quot; - Dec 2024</li>
            <li>&quot;Visualizing the Aether-Gradient&quot; - Nov 2024</li>
            <li>&quot;Lecture Notes: Density vs. Velocity&quot; - Oct 2024</li>
          </ul>
        </div>
        <div className="p-8 border border-stone-100 space-y-4">
          <h3 className="font-bold text-stone-900">Subscriber Benefits</h3>
          <ul className="space-y-2 text-sm text-stone-500">
            <li>Early access to the D3 visualizations</li>
            <li>Invitations to private Zoom symposiums</li>
            <li>PDF supplements for all chapters</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

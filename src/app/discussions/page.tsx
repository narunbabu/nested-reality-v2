'use client';

import { useState } from 'react';
import { DISCUSSIONS } from '@/lib/constants';
import { Discussion } from '@/types';
import Link from 'next/link';

export default function DiscussionsPage() {
  const [selectedDiscussion, setSelectedDiscussion] = useState<Discussion | null>(null);

  if (selectedDiscussion) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-24 space-y-12 animate-in fade-in duration-500">
        <button
          onClick={() => setSelectedDiscussion(null)}
          className="text-sm font-bold text-stone-400 hover:text-stone-900 transition-colors flex items-center gap-2"
        >
          &larr; Back to Discussions
        </button>

        <header className="space-y-6 border-b border-stone-200 pb-8">
          <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-stone-400">
            <span>Scholarly Discussion</span>
            <span className="w-1 h-1 bg-stone-300 rounded-full"></span>
            <span>{selectedDiscussion.date}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif text-stone-900 leading-tight">{selectedDiscussion.title}</h1>
          <p className="text-xl text-stone-600 font-serif italic">{selectedDiscussion.subtitle}</p>

          <div className="flex items-center gap-4 pt-4">
            <span className="text-sm font-bold text-stone-700">Participants:</span>
            {selectedDiscussion.participants.map((participant, idx) => (
              <span key={idx} className="text-sm text-stone-600 flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-stone-300 to-stone-400"></div>
                {participant}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {selectedDiscussion.tags.map((tag, idx) => (
              <span key={idx} className="px-3 py-1 bg-stone-100 text-stone-600 text-xs font-medium rounded-full">
                {tag}
              </span>
            ))}
          </div>
        </header>

        {/* Chat-style message thread */}
        <div className="space-y-6">
          {selectedDiscussion.messages.map((message, idx) => {
            const isArun = message.sender.toLowerCase().includes('arun');
            return (
              <div
                key={idx}
                className={`flex gap-4 ${isArun ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div className={`w-10 h-10 rounded-full flex-shrink-0 ${isArun ? 'bg-gradient-to-br from-[#C5A059] to-amber-700' : 'bg-gradient-to-br from-stone-400 to-stone-600'}`}></div>
                <div className={`flex-1 ${isArun ? 'text-right' : 'text-left'}`}>
                  <div className="flex items-baseline gap-3 mb-1">
                    <span className={`text-sm font-bold ${isArun ? 'text-[#C5A059]' : 'text-stone-700'} ${isArun ? 'order-2' : 'order-1'}`}>
                      {message.sender}
                    </span>
                    <span className={`text-xs text-stone-400 ${isArun ? 'order-1' : 'order-2'}`}>
                      {message.timestamp}
                    </span>
                  </div>
                  <div
                    className={`inline-block max-w-3xl p-4 rounded-lg ${
                      isArun
                        ? 'bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100'
                        : 'bg-stone-50 border border-stone-200'
                    }`}
                  >
                    <p className="text-stone-700 leading-relaxed whitespace-pre-wrap text-left">
                      {message.content}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <footer className="pt-12 border-t border-stone-200 space-y-6">
          <div className="bg-stone-900 text-white p-8 rounded-lg text-center space-y-4">
            <h3 className="text-xl font-serif">Join the Discussion</h3>
            <p className="max-w-xl mx-auto opacity-80 text-sm">Have thoughts on this exchange? Connect with us to share your perspective on density, gradient, and the nature of motion.</p>
            <Link
              href="/contact"
              className="inline-block px-6 py-2 border border-white/30 hover:border-white transition-all text-xs font-bold uppercase tracking-widest"
            >
              Contact Us
            </Link>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-24 space-y-16">
      <header className="space-y-4">
        <h1 className="text-5xl font-serif text-stone-900">Reader Discussions</h1>
        <p className="text-stone-600 text-xl font-serif italic">
          Thoughtful exchanges with readers, critics, and scholars exploring the core ideas of Nested Reality.
        </p>
      </header>

      <div className="grid gap-12">
        {DISCUSSIONS.map((discussion) => (
          <article
            key={discussion.id}
            onClick={() => setSelectedDiscussion(discussion)}
            className="group border border-stone-200 hover:border-stone-400 hover:shadow-lg transition-all duration-300 p-8 rounded-lg bg-gradient-to-br from-white to-stone-50 cursor-pointer"
          >
            <div className="space-y-6">
              <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-stone-400">
                <span>Discussion</span>
                <span className="w-1 h-1 bg-stone-300 rounded-full"></span>
                <span>{discussion.date}</span>
              </div>

              <div>
                <h2 className="text-3xl font-serif text-stone-900 group-hover:text-[#C5A059] transition-colors mb-3">
                  {discussion.title}
                </h2>
                <p className="text-lg text-stone-600 font-serif italic">{discussion.subtitle}</p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-stone-700">With:</span>
                {discussion.participants.map((participant, idx) => (
                  <span key={idx} className="text-sm text-stone-600 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-stone-300 to-stone-500"></div>
                    {participant}
                  </span>
                ))}
              </div>

              <p className="text-stone-600 leading-relaxed">{discussion.excerpt}</p>

              <div className="flex flex-wrap gap-2">
                {discussion.tags.map((tag, idx) => (
                  <span key={idx} className="px-3 py-1 bg-stone-100 text-stone-600 text-xs font-medium rounded-full">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="pt-4 flex items-center gap-2 text-sm font-bold text-stone-900 group-hover:text-[#C5A059] transition-colors">
                <span>Click to read full discussion</span>
                <span className="transform group-hover:translate-x-1 transition-transform">&rarr;</span>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="bg-stone-900 text-white p-12 rounded-lg text-center space-y-6">
        <h3 className="text-2xl font-serif">Contribute Your Perspective</h3>
        <p className="max-w-xl mx-auto opacity-80">
          Are you engaging deeply with Nested Reality? We welcome scholarly discussions and critical exchanges that advance our understanding of density-based physics.
        </p>
        <Link
          href="/contact"
          className="inline-block px-8 py-3 border border-white/20 hover:border-white transition-all text-sm font-bold uppercase tracking-widest"
        >
          Start a Discussion
        </Link>
      </div>
    </div>
  );
}

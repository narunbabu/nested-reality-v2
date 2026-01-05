'use client';

import { useState } from 'react';
import { DISCUSSIONS } from '@/lib/constants';
import { Discussion } from '@/types';
import Link from 'next/link';

// Simple markdown parser for WhatsApp-style formatting with newline and bullet support
const parseMarkdown = (text: string): React.ReactNode => {
  const lines = text.split('\n');
  const result: React.ReactNode[] = [];
  let globalKeyCounter = 0;

  const processLineContent = (content: string): React.ReactNode[] => {
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;

    // Regex patterns for markdown (order matters - bold before italic to prevent overlap)
    const patterns = [
      { regex: /\*\*([^*]+)\*\*/g, Component: 'strong' }, // **bold**
      { regex: /`([^`]+)`/g, Component: 'code' },          // `code`
      { regex: /\*([^*]+)\*/g, Component: 'em' },         // *italic*
    ];

    // Find all matches
    const matches: Array<{ start: number; end: number; text: string; Component: string }> = [];

    patterns.forEach(({ regex, Component }) => {
      let match;
      const tempRegex = new RegExp(regex.source, regex.flags);
      while ((match = tempRegex.exec(content)) !== null) {
        matches.push({
          start: match.index,
          end: match.index + match[0].length,
          text: match[1],
          Component
        });
      }
    });

    // Sort matches by position
    matches.sort((a, b) => a.start - b.start);

    // Filter out overlapping matches (keep first match in case of overlap)
    const filteredMatches = matches.filter((match, index) => {
      if (index === 0) return true;
      const prevMatch = matches[index - 1];
      return match.start >= prevMatch.end; // No overlap
    });

    // Build the result for this line
    filteredMatches.forEach((match) => {
      // Add text before match
      if (match.start > lastIndex) {
        parts.push(content.substring(lastIndex, match.start));
      }

      // Add formatted match
      const Component = match.Component as keyof JSX.IntrinsicElements;
      parts.push(
        <Component key={`md-${globalKeyCounter++}`} className={Component === 'code' ? 'bg-stone-200 px-1 rounded text-sm' : ''}>
          {match.text}
        </Component>
      );

      lastIndex = match.end;
    });

    // Add remaining text
    if (lastIndex < content.length) {
      parts.push(content.substring(lastIndex));
    }

    return parts.length > 0 ? parts : [content];
  };

  lines.forEach((line, lineIndex) => {
    // Check if line starts with bullet point
    const isBullet = line.trim().startsWith('* ');

    if (isBullet) {
      // Remove bullet marker and process the rest
      const bulletContent = line.trim().substring(2); // Remove "* "
      const processedContent = processLineContent(bulletContent);

      result.push(
        <span key={`bullet-${globalKeyCounter++}`} className="flex gap-2">
          <span>•</span>
          <span>{processedContent}</span>
        </span>
      );
    } else {
      // Process line normally
      const processedContent = processLineContent(line);
      result.push(...processedContent);
    }

    // Add line break if not the last line
    if (lineIndex < lines.length - 1) {
      result.push(<br key={`br-${globalKeyCounter++}`} />);
    }
  });

  return result.length > 0 ? result : text;
};

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
        <div className="space-y-1">
          {selectedDiscussion.messages.map((message, idx) => {
            const isArun = message.sender.toLowerCase().includes('arun');
            const prevMessage = idx > 0 ? selectedDiscussion.messages[idx - 1] : null;
            const isConsecutive = prevMessage && prevMessage.sender === message.sender;

            return (
              <div
                key={idx}
                className={`flex gap-4 ${isArun ? 'flex-row-reverse' : 'flex-row'} ${isConsecutive ? 'mt-1' : 'mt-6'}`}
              >
                {/* Avatar - only show for first message in group */}
                {!isConsecutive ? (
                  <div className={`w-10 h-10 rounded-full flex-shrink-0 ${isArun ? 'bg-gradient-to-br from-[#C5A059] to-amber-700' : 'bg-gradient-to-br from-stone-400 to-stone-600'}`}></div>
                ) : (
                  <div className="w-10 flex-shrink-0"></div>
                )}

                <div className={`flex-1 ${isArun ? 'text-right' : 'text-left'}`}>
                  {/* Name and timestamp - only show name for first message */}
                  {!isConsecutive ? (
                    <div className="flex items-baseline gap-3 mb-1">
                      <span className={`text-sm font-bold ${isArun ? 'text-[#C5A059]' : 'text-stone-700'} ${isArun ? 'order-1' : 'order-2'}`}>
                        {message.sender}
                      </span>
                      <span className={`text-xs text-stone-400 ${isArun ? 'order-2' : 'order-1'}`}>
                        {message.timestamp}
                      </span>
                    </div>
                  ) : (
                    <div className={`text-xs text-stone-400 mb-1 ${isArun ? 'text-right' : 'text-left'}`}>
                      {message.timestamp}
                    </div>
                  )}

                  {/* Message bubble with parsed markdown */}
                  <div
                    className={`inline-block max-w-3xl p-4 rounded-lg shadow-sm ${
                      isArun
                        ? 'bg-[#DCF8C6] border border-green-200'
                        : 'bg-white border border-stone-300'
                    }`}
                  >
                    <p className="text-stone-700 leading-relaxed text-left">
                      {parseMarkdown(message.content)}
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
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
          <p className="text-sm text-blue-800">
            <strong>💡 Want to track your understanding?</strong> Visit the{' '}
            <Link href="/readers" className="font-bold underline hover:text-blue-600">
              Readers page
            </Link>{' '}
            to sign in and mark key discussion points that resonate with you.
          </p>
        </div>
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

'use client';

import React, { useState } from 'react';
import { CONCEPTS } from '@/lib/constants';
import { Concept } from '@/types';
import { askConceptAssistant } from '@/lib/geminiService';

export default function ConceptExplorerPage() {
  const [activeConcept, setActiveConcept] = useState<Concept>(CONCEPTS[0]);
  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAskAi = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuery.trim()) return;

    setIsLoading(true);
    setAiResponse(null);

    const response = await askConceptAssistant(aiQuery, activeConcept.title);
    setAiResponse(response || "No response received.");
    setIsLoading(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-24">
      <div className="mb-16">
        <h1 className="text-5xl font-serif text-stone-900 mb-4">Concept Explorer</h1>
        <p className="text-stone-500 max-w-2xl">Dive deep into the specific pillars of Nested Reality. Click a concept to learn more or ask our AI guide for clarification.</p>
      </div>

      <div className="grid lg:grid-cols-[1fr_2fr] gap-12">
        {/* Sidebar Nav */}
        <aside className="space-y-4">
          {CONCEPTS.map((c) => (
            <button
              key={c.id}
              onClick={() => {
                setActiveConcept(c);
                setAiResponse(null);
                setAiQuery('');
              }}
              className={`w-full text-left p-6 transition-all border ${
                activeConcept.id === c.id
                ? 'bg-stone-900 text-white border-stone-900 shadow-lg'
                : 'bg-white text-stone-600 border-stone-200 hover:border-stone-900'
              }`}
            >
              <h3 className="font-bold mb-1">{c.title}</h3>
              <p className="text-xs opacity-80">{c.summary}</p>
            </button>
          ))}

          {/* AI Quick Guide */}
          <div className="mt-12 bg-stone-100 p-6 rounded-lg space-y-4">
            <h4 className="font-bold text-sm uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Concept Assistant
            </h4>
            <p className="text-xs text-stone-500">Ask a question about {activeConcept.title}:</p>
            <form onSubmit={handleAskAi} className="space-y-2">
              <input
                type="text"
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
                placeholder="How does this apply to..."
                className="w-full text-sm p-3 border border-stone-200 focus:outline-none focus:border-stone-900"
              />
              <button
                disabled={isLoading}
                className="w-full py-2 bg-stone-200 text-stone-700 text-xs font-bold hover:bg-stone-300 transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Thinking...' : 'Consult Guide'}
              </button>
            </form>
          </div>
        </aside>

        {/* Detail View */}
        <div className="space-y-12">
          {aiResponse ? (
            <div className="bg-white border border-stone-200 p-8 space-y-6 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
              <button
                onClick={() => setAiResponse(null)}
                className="text-xs text-stone-400 hover:text-stone-900 flex items-center gap-1"
              >
                &larr; Back to Concept Overview
              </button>
              <h2 className="text-2xl font-serif">Assistant Insight: {activeConcept.title}</h2>
              <div className="prose prose-stone text-stone-600">
                {aiResponse.split('\n').map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-12 animate-in fade-in duration-500">
              <div className="space-y-6">
                <h2 className="text-4xl font-serif text-stone-900">{activeConcept.title}</h2>
                <p className="text-xl text-stone-600 leading-relaxed">{activeConcept.description}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-stone-400">Core Quotes</h4>
                  <div className="space-y-4">
                    {activeConcept.quotes.map((q, i) => (
                      <blockquote key={i} className="border-l-2 border-stone-300 pl-4 italic text-stone-700">
                        &quot;{q}&quot;
                      </blockquote>
                    ))}
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-stone-400">Common Questions</h4>
                  <div className="space-y-4">
                    {activeConcept.faqs.map((f, i) => (
                      <div key={i} className="space-y-1">
                        <p className="font-bold text-sm text-stone-900">Q: {f.q}</p>
                        <p className="text-sm text-stone-500">A: {f.a}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Visualization Placeholder */}
              <div className="bg-stone-50 aspect-video flex flex-col items-center justify-center border-2 border-dashed border-stone-200 p-12 text-center group">
                <div className="w-24 h-24 rounded-full bg-stone-200 group-hover:bg-stone-300 transition-colors flex items-center justify-center mb-4">
                  <svg className="w-10 h-10 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.642.316a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.823.362l-1.171.976m12.71 2.457l2.148-2.148m0 0a2 2 0 000-2.828l-9.9-9.9a2 2 0 00-2.828 0L3.343 8.243a2 2 0 000 2.828l9.9 9.9a2 2 0 002.828 0l2.147-2.147m0 0L18 19" />
                  </svg>
                </div>
                <h3 className="font-serif text-lg mb-2">Visualizing {activeConcept.title}</h3>
                <p className="text-sm text-stone-400 max-w-xs">An interactive D3 simulation for {activeConcept.id} scale-gradients will be available in Phase 2.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { BOOK_METADATA, TOC_DATA } from '@/lib/constants';
export default function AboutBookPage() {
  const [expandedChapter, setExpandedChapter] = useState<string | null>(null);

  const toggleChapter = (id: string) => {
    setExpandedChapter(expandedChapter === id ? null : id);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-24 space-y-24">
      
      {/* HEADER */}
      <header className="text-center space-y-8">
        <h1 className="text-5xl md:text-6xl font-serif text-stone-900 leading-tight">
          Nested Reality
        </h1>
        <p className="text-xl md:text-2xl font-light text-stone-600 max-w-2xl mx-auto font-serif italic">
          {BOOK_METADATA.title.split(': ')[1]}
        </p>
        <p className="text-sm tracking-[0.2em] uppercase text-stone-400">
          By {BOOK_METADATA.author}
        </p>
      </header>

      {/* SYNOPSIS */}
      <section className="space-y-8 border-t border-stone-200 pt-12">
        <div className="grid md:grid-cols-[1fr_2fr] gap-12">
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-stone-900 uppercase tracking-widest">The Premise</h2>
            <p className="text-stone-500 text-sm leading-relaxed italic">
              "This book does not ask the reader to reject what already works. Instead, it asks something gentler and more demanding: To look again."
            </p>
          </div>
          <div className="prose prose-stone prose-lg text-stone-600 leading-relaxed space-y-6">
            <p>
              We are taught early that things move because they are pushed (Force) and that they exist in a vast emptiness (Vacuum). <strong>Nested Reality</strong> challenges these foundational metaphors, arguing that they are not observed realities but inherited habits of thought.
            </p>
            <p>
              Through the <strong>LDS-NDD framework</strong> (Lateral Density System - Nested Density Difference), this book offers a new lens: a universe where space is a continuous medium of varying density, and motion is not a struggle against inertia but a natural adjustment to imbalance.
            </p>
            <p>
              From the formation of stars to the regulation of living cells, Nalamara demonstrates that matter and life are not separate domains, but a single, uninterrupted structural continuum.
            </p>
          </div>
        </div>
      </section>

      {/* INTERACTIVE TABLE OF CONTENTS */}
      <section className="space-y-16">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-serif text-stone-900">Table of Contents</h2>
          <p className="text-stone-500 text-sm max-w-xl mx-auto">
            Click on any chapter to explore its core argument and what you will gain from reading it.
          </p>
        </div>
        
        <div className="space-y-12">
          {TOC_DATA.map((part) => (
            <div key={part.part} className="space-y-6">
              <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest border-b border-stone-200 pb-2">
                {part.part}
              </h3>
              <ul className="space-y-2">
                {part.chapters.map((chapter) => (
                  <li key={chapter.id} className="group">
                    <button
                      onClick={() => toggleChapter(chapter.id)}
                      className={`w-full text-left p-4 rounded-sm transition-all duration-300 ${
                        expandedChapter === chapter.id 
                          ? 'bg-stone-50 shadow-sm' 
                          : 'hover:bg-stone-50'
                      }`}
                    >
                      <div className="flex justify-between items-baseline font-serif text-lg">
                        <span className={`${chapter.isConstellation ? 'text-stone-900 font-medium' : 'text-stone-800'}`}>
                          <span className={`text-stone-400 mr-4 text-sm font-sans tracking-widest ${chapter.isConstellation ? 'hidden' : 'inline-block'}`}>
                            {chapter.id}
                          </span>
                          {chapter.title}
                        </span>
                        <span className="text-stone-400 text-sm transform transition-transform duration-300">
                          {expandedChapter === chapter.id ? '−' : '+'}
                        </span>
                      </div>
                      
                      {/* Expandable Content */}
                      <div 
                        className={`overflow-hidden transition-all duration-500 ease-in-out ${
                          expandedChapter === chapter.id ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'
                        }`}
                      >
                        <div className={`pl-0 ${chapter.isConstellation ? '' : 'md:pl-10'} space-y-3 text-stone-600`}>
                          <p className="font-medium text-stone-900">{chapter.desc}</p>
                          <div className="text-sm leading-relaxed border-l-2 border-stone-200 pl-4 py-1">
                            <span className="uppercase text-[10px] tracking-widest text-stone-400 block mb-1">Key Takeaway</span>
                            {chapter.gain}
                          </div>
                          {/* Optional citation display */}
                          <p className="text-[10px] text-stone-400 uppercase tracking-widest pt-2">
                            Ref: {chapter.cite}
                          </p>
                        </div>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          
           {/* Appendices */}
           <div className="border-t border-stone-200 pt-8 mt-8">
             <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-6">Appendices</h3>
             <ul className="grid md:grid-cols-2 gap-6">
               <li className="bg-stone-50 p-4 rounded-sm">
                  <span className="block font-bold text-stone-900 mb-1">Appendix A: The LDS-NDD Gita</span>
                  <span className="text-xs text-stone-500">The axiomatic kernel of the theory. A formal list of the non-negotiable assumptions and laws.</span>
               </li>
               <li className="bg-stone-50 p-4 rounded-sm">
                  <span className="block font-bold text-stone-900 mb-1">Glossary of Key Terms</span>
                  <span className="text-xs text-stone-500">Definitions for Child-body, Crystallization, RGC, and the Plenum Principle.</span>
               </li>
             </ul>
           </div>
        </div>
      </section>

      {/* PURCHASE SECTION */}
      <section id="purchase" className="space-y-12 bg-stone-50 p-12 -mx-6 md:-mx-12 rounded-lg">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-serif text-stone-900">Begin the Inquiry</h2>
          <p className="text-stone-500">"No prior training in physics is required. Only attention."</p>
        </div>

        <div className="grid sm:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {/* Kindle Card */}
          <a
            href={BOOK_METADATA.formats.kindle.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group block bg-white border border-stone-200 p-8 hover:border-stone-900 hover:shadow-xl transition-all relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 bg-stone-100 px-3 py-1 text-[10px] uppercase tracking-wider text-stone-500">Instant Access</div>
            <div className="text-xs uppercase tracking-widest text-stone-400 mb-2">E-Book</div>
            <h3 className="text-2xl font-serif mb-2 group-hover:text-stone-900">Kindle Edition</h3>
            <p className="text-stone-500 text-xs mb-6">Compatible with all devices</p>
            <div className="flex items-baseline justify-between mt-auto">
              <span className="text-xl font-bold text-stone-900">{BOOK_METADATA.formats.kindle.price}</span>
              <span className="text-sm font-bold border-b border-stone-900">Buy Now &rarr;</span>
            </div>
          </a>

          {/* Paperback Card */}
          <a
            href={BOOK_METADATA.formats.paperback.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group block bg-stone-900 text-stone-50 p-8 hover:shadow-2xl transition-all transform hover:-translate-y-1"
          >
            <div className="text-xs uppercase tracking-widest text-stone-400 mb-2">Physical</div>
            <h3 className="text-2xl font-serif mb-2 text-white">Paperback</h3>
            <p className="text-stone-400 text-xs mb-6">Matte finish, cream paper</p>
            <div className="flex items-baseline justify-between mt-auto">
              <span className="text-xl font-bold text-white">{BOOK_METADATA.formats.paperback.price}</span>
              <span className="text-sm font-bold border-b border-white">Order &rarr;</span>
            </div>
          </a>

          {/* Hardcover Card */}
          <a
            href={BOOK_METADATA.formats.hardcover.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group block bg-white border border-stone-200 p-8 hover:border-stone-900 hover:shadow-xl transition-all"
          >
            <div className="text-xs uppercase tracking-widest text-stone-400 mb-2">Collector</div>
            <h3 className="text-2xl font-serif mb-2 group-hover:text-stone-900">Hardcover</h3>
            <p className="text-stone-500 text-xs mb-6">Case laminate, library quality</p>
            <div className="flex items-baseline justify-between mt-auto">
              <span className="text-xl font-bold text-stone-900">{BOOK_METADATA.formats.hardcover.price}</span>
              <span className="text-sm font-bold border-b border-stone-900">Order &rarr;</span>
            </div>
          </a>
        </div>
      </section>

    </div>
  );
}
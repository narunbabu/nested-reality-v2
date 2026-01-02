import { BOOK_METADATA } from '@/lib/constants';

export default function AboutBookPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-24 space-y-20">
      <header className="text-center space-y-6">
        <h1 className="text-5xl font-serif text-stone-900">About the Book</h1>
        <p className="text-xl text-stone-600 max-w-2xl mx-auto">Beyond particles and the void: A return to continuity.</p>
      </header>

      <section className="space-y-8">
        <h2 className="text-3xl font-serif text-stone-900">Synopsis</h2>
        <div className="prose prose-stone lg:prose-xl text-stone-600 leading-relaxed space-y-6">
          <p>
            For a century, physics has been locked in a struggle between the discrete (particles) and the continuous (fields). <em>Nested Reality</em> proposes that the struggle exists only because we have misunderstood the nature of space itself.
          </p>
          <p>
            By reinterpreting the universe as a <strong>nested medium of variable density</strong>, we can account for the phenomena of gravity, quantum behavior, and relativistic motion without the need for independent &quot;forces&quot; or the conceptual baggage of a vacuum.
          </p>
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-12">
        <div className="space-y-4">
          <h3 className="font-bold text-stone-900 uppercase tracking-widest text-sm">Density over Force</h3>
          <p className="text-stone-600 text-sm leading-relaxed">The fundamental mechanism of motion is gradient transition, not vectorial impact.</p>
        </div>
        <div className="space-y-4">
          <h3 className="font-bold text-stone-900 uppercase tracking-widest text-sm">Continuity</h3>
          <p className="text-stone-600 text-sm leading-relaxed">The universe is a plenum; there is no such thing as an empty space or a void.</p>
        </div>
        <div className="space-y-4">
          <h3 className="font-bold text-stone-900 uppercase tracking-widest text-sm">Structure</h3>
          <p className="text-stone-600 text-sm leading-relaxed">Matter is a localized structural configuration of the medium, not a separate entity.</p>
        </div>
      </section>

      <section className="bg-stone-100 p-8 md:p-12 space-y-8">
        <h2 className="text-2xl font-serif text-stone-900">Table of Contents</h2>
        <ol className="space-y-4 text-stone-700">
          <li className="flex justify-between border-b border-stone-200 pb-2">
            <span>Chapter 1: The Illusion of the Void</span>
            <span className="text-stone-400">001</span>
          </li>
          <li className="flex justify-between border-b border-stone-200 pb-2">
            <span>Chapter 2: The Medium and the Message</span>
            <span className="text-stone-400">045</span>
          </li>
          <li className="flex justify-between border-b border-stone-200 pb-2">
            <span>Chapter 3: Redefining Density</span>
            <span className="text-stone-400">089</span>
          </li>
          <li className="flex justify-between border-b border-stone-200 pb-2">
            <span>Chapter 4: The Nesting Hierarchy</span>
            <span className="text-stone-400">156</span>
          </li>
          <li className="flex justify-between border-b border-stone-200 pb-2">
            <span>Chapter 5: Recursive Gradient Continuity</span>
            <span className="text-stone-400">210</span>
          </li>
        </ol>
      </section>

      <section id="purchase" className="space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-serif text-stone-900">Order the Edition</h2>
          <p className="text-stone-500">Available in three distinct physical and digital formats.</p>
        </div>

        <div className="grid sm:grid-cols-3 gap-6">
          {/* Kindle Card */}
          <a
            href={BOOK_METADATA.formats.kindle.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group block bg-stone-50 border border-stone-200 p-8 hover:border-stone-900 hover:shadow-xl transition-all"
          >
            <div className="text-xs uppercase tracking-widest text-stone-400 mb-2">Digital</div>
            <h3 className="text-2xl font-serif mb-4 group-hover:text-stone-900">Kindle eBook</h3>
            <div className="text-xl font-bold text-stone-900 mb-6">{BOOK_METADATA.formats.kindle.price}</div>
            <div className="text-[10px] text-stone-400 uppercase tracking-widest">ASIN: {BOOK_METADATA.formats.kindle.asin}</div>
            <div className="mt-8 text-sm font-bold border-b border-stone-900 inline-block">Order &rarr;</div>
          </a>

          {/* Paperback Card */}
          <a
            href={BOOK_METADATA.formats.paperback.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group block bg-white border border-stone-200 p-8 hover:border-stone-900 hover:shadow-xl transition-all"
          >
            <div className="text-xs uppercase tracking-widest text-stone-400 mb-2">Essential</div>
            <h3 className="text-2xl font-serif mb-4 group-hover:text-stone-900">Paperback</h3>
            <div className="text-xl font-bold text-stone-900 mb-6">{BOOK_METADATA.formats.paperback.price}</div>
            <div className="text-[10px] text-stone-400 uppercase tracking-widest">ASIN: {BOOK_METADATA.formats.paperback.asin}</div>
            <div className="mt-8 text-sm font-bold border-b border-stone-900 inline-block">Order &rarr;</div>
          </a>

          {/* Hardcover Card */}
          <a
            href={BOOK_METADATA.formats.hardcover.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group block bg-stone-900 text-stone-50 p-8 hover:shadow-2xl transition-all"
          >
            <div className="text-xs uppercase tracking-widest text-stone-500 mb-2">Library</div>
            <h3 className="text-2xl font-serif mb-4 text-white">Hardcover</h3>
            <div className="text-xl font-bold text-white mb-6">{BOOK_METADATA.formats.hardcover.price}</div>
            <div className="text-[10px] text-stone-500 uppercase tracking-widest">ASIN: {BOOK_METADATA.formats.hardcover.asin}</div>
            <div className="mt-8 text-sm font-bold border-b border-white inline-block">Order &rarr;</div>
          </a>
        </div>

        <div className="text-center pt-8">
           <a href="#" className="text-xs text-stone-400 hover:text-stone-900 transition-colors uppercase tracking-[0.3em]">
            Request Institutional / Author Copies
           </a>
        </div>
      </section>
    </div>
  );
}

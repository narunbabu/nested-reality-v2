import Link from 'next/link';

export default function Home() {
  return (
    <div className="space-y-24 pb-24">
      {/* Hero Section */}
      <section className="relative pt-32 px-6 max-w-7xl mx-auto text-center">
        <div className="space-y-6">
          <h1 className="text-5xl md:text-7xl font-serif text-stone-900 leading-tight">
            Nested Reality
          </h1>
          <p className="text-xl md:text-2xl text-stone-600 max-w-2xl mx-auto italic">
            A conceptual rethinking of physics, space, matter, and motion—beyond force and particles.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-8">
            <Link href="/about-book" className="px-8 py-3 bg-stone-900 text-white font-medium hover:bg-stone-800 transition-colors">
              Read the Book
            </Link>
            <Link href="/explorer" className="px-8 py-3 bg-white border border-stone-200 text-stone-900 font-medium hover:border-stone-900 transition-colors">
              Explore the Ideas
            </Link>
            <Link href="/blog" className="px-8 py-3 bg-stone-100 text-stone-700 font-medium hover:bg-stone-200 transition-colors">
              Join the Conversation
            </Link>
          </div>
        </div>
      </section>

      {/* Achievement Banner */}
      <section className="bg-stone-100 py-12">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <p className="text-3xl font-serif font-bold text-stone-900">#1 New Release</p>
            <p className="text-stone-500 uppercase tracking-widest text-xs mt-1">Metaphysics & Physics</p>
          </div>
          <div>
            <p className="text-3xl font-serif font-bold text-stone-900">4.9 / 5.0</p>
            <p className="text-stone-500 uppercase tracking-widest text-xs mt-1">Reader Satisfaction</p>
          </div>
          <div>
            <p className="text-3xl font-serif font-bold text-stone-900">12+ Weeks</p>
            <p className="text-stone-500 uppercase tracking-widest text-xs mt-1">Category Top 10</p>
          </div>
        </div>
      </section>

      {/* Intro Grid */}
      <section className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
        <div className="space-y-6">
          <h2 className="text-3xl md:text-4xl font-serif text-stone-900">The Ongoing Public Notebook</h2>
          <p className="text-lg text-stone-600 leading-relaxed">
            <em>Nested Reality</em> is more than a book; it&apos;s a living archive. This hub is the central point for readers, scholars, and skeptics to engage with a theory that prioritizes <strong>density over force</strong> and <strong>continuity over vacuum</strong>.
          </p>
          <div className="pt-4">
            <Link href="/about-author" className="text-stone-900 font-bold border-b border-stone-900 pb-1 hover:text-stone-600 hover:border-stone-600 transition-all">
              Meet the Author &rarr;
            </Link>
          </div>
        </div>
        <div className="relative aspect-[3/4] bg-stone-200 rounded overflow-hidden shadow-2xl">
           <img
            src="https://picsum.photos/seed/nested/800/1066"
            alt="Abstract Physics Visual"
            className="object-cover w-full h-full opacity-80"
          />
          <div className="absolute inset-0 flex items-center justify-center p-12 text-center bg-black/10">
            <p className="text-white text-2xl font-serif italic drop-shadow-lg">&quot;The vacuum is not an absence, but the baseline density of existence.&quot;</p>
          </div>
        </div>
      </section>

      {/* Featured Quotes */}
      <section className="max-w-4xl mx-auto px-6 py-20 bg-stone-50 border-y border-stone-200">
        <div className="text-center space-y-8">
          <span className="text-xs uppercase tracking-[0.3em] text-stone-400">Selected Reader Reviews</span>
          <blockquote className="text-2xl md:text-3xl font-serif italic text-stone-800 leading-snug">
            &quot;A paradigm-shifting work that manages to be both deeply rigorous and wonderfully readable. It&apos;s the most stable ground for a new physics I&apos;ve encountered.&quot;
          </blockquote>
          <div className="font-medium text-stone-900">— Elena Vance, Ph.D.</div>
        </div>
      </section>
    </div>
  );
}


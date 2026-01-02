import Link from 'next/link';

export default function Home() {
  return (
    <div className="relative space-y-0 pb-0">

      {/* Achievement Ribbons - Responsive */}
      {/* Mobile: Horizontal below header */}
      <div className="md:hidden fixed left-0 right-0 top-16 z-40 bg-stone-900/95 border-b border-stone-800/50 py-2 px-4">
        <div className="flex items-center justify-center gap-3 text-xs">
          <a
            href="/images/top4.png"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 bg-[#C5A059] text-black px-3 py-1 rounded hover:bg-[#D4B069] transition-all"
          >
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="font-semibold">Top 4</span>
          </a>
          <a
            href="/images/top100general.png"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 bg-[#C5A059] text-black px-3 py-1 rounded hover:bg-[#D4B069] transition-all"
          >
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="font-semibold">Top 100</span>
          </a>
        </div>
      </div>

      {/* Desktop: Side ribbons */}
      <div className="hidden md:flex fixed right-0 top-32 z-50 flex-col gap-3">
        {/* Top 4 Ribbon */}
        <a
          href="/images/top4.png"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative"
        >
          <div className="bg-[#C5A059] text-black px-4 py-2 pr-6 shadow-lg hover:bg-[#D4B069] transition-all">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="font-semibold text-sm whitespace-nowrap">Top 4 First Week</span>
            </div>
          </div>
          {/* Ribbon fold */}
          <div className="absolute right-0 top-full w-0 h-0 border-l-[24px] border-l-transparent border-t-[8px] border-t-[#8B7043]"></div>
        </a>

        {/* Top 100 Ribbon */}
        <a
          href="/images/top100general.png"
          target="_blank"
          rel="noopener noreferrer"
          className="group relative"
        >
          <div className="bg-[#C5A059] text-black px-4 py-2 pr-6 shadow-lg hover:bg-[#D4B069] transition-all">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-semibold text-sm whitespace-nowrap">Top 100 India</span>
            </div>
          </div>
          {/* Ribbon fold */}
          <div className="absolute right-0 top-full w-0 h-0 border-l-[24px] border-l-transparent border-t-[8px] border-t-[#8B7043]"></div>
        </a>
      </div>

      {/* Hero Section - Split Screen */}
      <section className="relative min-h-[80vh] flex items-center justify-center px-6">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid md:grid-cols-2 gap-12 items-center py-12 ">
          {/* Left: Text Content */}
          <div className="space-y-8 ">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif text-stone-100 leading-tight">
              What If Nothing Is Actually Pulling?
            </h1>
            <p className="text-xl md:text-2xl text-stone-400 leading-relaxed">
              Gravity isn't a force. Space isn't empty. Discover the density-based framework that resolves the paradoxes of modern physics.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <a
                href="https://www.amazon.in/dp/B0GBSJPGKC"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-[#C5A059] text-black font-semibold text-lg hover:bg-[#D4B069] transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Read on Amazon Kindle
              </a>
              <Link
                href="/explorer"
                className="px-8 py-4 border-2 border-stone-600 text-stone-300 font-medium hover:border-[#C5A059] hover:text-[#C5A059] transition-all"
              >
                More about Idea
              </Link>
              <Link
                href="/reviews"
                className="px-8 py-4 border-2 border-stone-600 text-stone-300 font-medium hover:border-[#C5A059] hover:text-[#C5A059] transition-all"
              >
                Reviews
              </Link>
            </div>
            <p className="text-sm text-stone-500">
              Free on Kindle Unlimited for Limited Period
            </p>
          </div>

          {/* Right: 3D Book Image */}
          <div className="relative flex justify-center items-center">
            <div className="relative">
              <img
                src="/images/nested_reality_3d_transp.PNG"
                alt="Nested Reality Book Cover"
                className="w-full max-w-md drop-shadow-2xl hover:scale-105 transition-transform duration-300"
              />
              {/* Glow effect */}
              <div className="absolute inset-0 bg-[#C5A059]/10 blur-3xl -z-10"></div>
            </div>
          </div>
        </div>
        </div>
      </section>

      {/* Problem/Agitation Section */}
      <section className="max-w-3xl mx-auto px-6 py-2 text-center">
        <div className="space-y-2">
          <h2 className="text-4xl md:text-5xl font-serif text-stone-100 leading-tight">
            The Universe is Simpler Than We Are Told.
          </h2>
          <div className="text-lg md:text-xl text-stone-300 leading-relaxed space-y-12">
            <p>
              We are taught that things move because they are pushed or pulled. We are told space is empty. But if gravity is a force, why did Newton refuse to explain it? If space is empty, why does it bend?
            </p>
            <p>
              Modern physics has become a patchwork of invisible fixes—Dark Matter, Dark Energy, and Virtual Particles. <em className="text-[#C5A059]">Nested Reality</em> offers a different view: A universe not of forces, but of <strong>density</strong>. Not of emptiness, but of <strong>continuity</strong>.
            </p>
          </div>
        </div>
      </section>

      {/* Inside the Book - 3 Column Features */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-3 gap-12">
          {/* Feature 1 */}
          <div className="space-y-4 text-center md:text-left">
            <div className="w-16 h-16 mx-auto md:mx-0 bg-[#C5A059]/10 border border-[#C5A059]/30 flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-[#C5A059]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="text-2xl font-serif">The Myth of Empty Space</h3>
            <p className="text-stone-400 leading-relaxed">
              Space is not a void. It is the lowest-density limit of material continuity. See why "nothing" never actually exists.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="space-y-4 text-center md:text-left">
            <div className="w-16 h-16 mx-auto md:mx-0 bg-[#C5A059]/10 border border-[#C5A059]/30 flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-[#C5A059]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-2xl font-serif">Motion Without Force</h3>
            <p className="text-stone-400 leading-relaxed">
              Nothing pulls. Nothing pushes. Objects move to resolve density imbalances. Gravity is not an action; it is an adjustment.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="space-y-4 text-center md:text-left">
            <div className="w-16 h-16 mx-auto md:mx-0 bg-[#C5A059]/10 border border-[#C5A059]/30 flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-[#C5A059]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-2xl font-serif">Life as Structure</h3>
            <p className="text-stone-400 leading-relaxed">
              Life is not a miracle that defies physics. It is matter that has learned to regulate its own density gradients.
            </p>
          </div>
        </div>
      </section>

      {/* Reader Quote */}
      <section className="max-w-4xl mx-auto px-6 py-20 border-y border-stone-800">
        <div className="text-center space-y-6">
          <span className="text-xs uppercase tracking-[0.3em] text-stone-500">Reader Review</span>
          <blockquote className="text-2xl md:text-3xl font-serif italic text-stone-300 leading-snug">
            "For those who feel standard explanations work mathematically but fail intuitively—this is the book you've been waiting for."
          </blockquote>
          <div className="flex justify-center gap-1 text-[#C5A059]">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-gradient-to-b from-transparent to-stone-900/30 py-32">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-serif text-stone-100">
            Change Your Perspective.
          </h2>
          <p className="text-xl text-stone-400 max-w-2xl mx-auto">
            Available now on Amazon in Kindle, Paperback, and Hardcover editions.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <a
              href="https://www.amazon.com/dp/B0DHYT92TR"
              target="_blank"
              rel="noopener noreferrer"
              className="px-10 py-4 bg-[#C5A059] text-black font-semibold text-lg hover:bg-[#D4B069] transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Get the Book on Amazon
            </a>
            <Link
              href="/about-book"
              className="px-10 py-4 border-2 border-stone-600 text-stone-300 font-medium hover:border-[#C5A059] hover:text-[#C5A059] transition-all"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

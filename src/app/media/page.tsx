export default function MediaPage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-24 space-y-20">
      <header className="text-center space-y-4">
        <h1 className="text-5xl font-serif text-stone-900">Media & Talks</h1>
        <p className="text-stone-500">Documenting the public conversation around Nested Reality.</p>
      </header>

      <div className="grid md:grid-cols-2 gap-12">
        <div className="space-y-6">
          <div className="aspect-video bg-stone-900 flex items-center justify-center text-white">
            <span className="text-sm uppercase tracking-widest opacity-50 font-bold">Recent Keynote Video</span>
          </div>
          <h3 className="text-2xl font-serif">Redefining the Vacuum (2024 Symposium)</h3>
          <p className="text-stone-500 text-sm">Arun discusses the foundational shifts required to move from particle physics to a nesting density model.</p>
        </div>
        <div className="space-y-6">
           <div className="aspect-video bg-stone-900 flex items-center justify-center text-white">
            <span className="text-sm uppercase tracking-widest opacity-50 font-bold">Podcast Interview</span>
          </div>
          <h3 className="text-2xl font-serif">The Physics of Presence Podcast</h3>
          <p className="text-stone-500 text-sm">A two-hour deep dive into the metaphysics of &quot;Density over Force&quot;.</p>
        </div>
      </div>

      <section className="space-y-8">
        <h2 className="text-3xl font-serif border-b border-stone-200 pb-4">Press Mentions</h2>
        <div className="space-y-8">
          {[1,2,3].map(i => (
            <div key={i} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-stone-900">&quot;The boldest rethink of space in decades.&quot;</h4>
                <p className="text-stone-500 text-sm">Review in <span className="italic">The Theoretical Journal</span></p>
              </div>
              <a href="#" className="text-stone-400 hover:text-stone-900 text-xs font-bold uppercase tracking-widest">Read Article &rarr;</a>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

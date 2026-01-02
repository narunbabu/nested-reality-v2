export default function EthicsPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-24 space-y-12">
      <header className="space-y-4 border-b border-stone-200 pb-12">
        <h1 className="text-5xl font-serif text-stone-900">Academic Ethics</h1>
        <p className="text-xl text-stone-500 font-serif italic">The integrity of the continuous model.</p>
      </header>

      <div className="space-y-16">
        <section className="space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-stone-400">Open Inquiry</h2>
          <p className="text-lg text-stone-700 leading-relaxed font-light">
            We value the rigorous application of the scientific method. Any experimental data that challenges the Nested Reality framework will be highlighted and addressed with transparency.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-stone-400">Collaboration</h2>
          <p className="text-lg text-stone-700 leading-relaxed font-light">
            Authors citing this work are expected to represent the &apos;Density over Force&apos; model accurately, avoiding reductionist interpretations that strip the theory of its continuity.
          </p>
        </section>
      </div>

      <footer className="pt-24">
        <a href="/" className="text-stone-900 font-bold text-sm hover:underline">&larr; Return to Central Hub</a>
      </footer>
    </div>
  );
}

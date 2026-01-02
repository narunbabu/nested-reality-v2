export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-24 space-y-12">
      <header className="space-y-4 border-b border-stone-200 pb-12">
        <h1 className="text-5xl font-serif text-stone-900">Terms of Engagement</h1>
        <p className="text-xl text-stone-500 font-serif italic">Principles for high-fidelity dialogue.</p>
      </header>

      <div className="space-y-16">
        <section className="space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-stone-400">Good Faith Dialogue</h2>
          <p className="text-lg text-stone-700 leading-relaxed font-light">
            Engagement with Nested Reality concepts must be conducted in good faith. Critique is welcomed, provided it addresses the structural logic of the work rather than ad hominem dismissals.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-stone-400">Intellectual Property</h2>
          <p className="text-lg text-stone-700 leading-relaxed font-light">
            All original diagrams, text, and theoretical frameworks presented here are the property of Arun Nalamara and protected by copyright law.
          </p>
        </section>
      </div>

      <footer className="pt-24">
        <a href="/" className="text-stone-900 font-bold text-sm hover:underline">&larr; Return to Central Hub</a>
      </footer>
    </div>
  );
}

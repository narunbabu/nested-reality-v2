export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-24 space-y-12">
      <header className="space-y-4 border-b border-stone-200 pb-12">
        <h1 className="text-5xl font-serif text-stone-900">Privacy Policy</h1>
        <p className="text-xl text-stone-500 font-serif italic">Respecting the boundaries of the digital plenum.</p>
      </header>

      <div className="space-y-16">
        <section className="space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-stone-400">Data Collection</h2>
          <p className="text-lg text-stone-700 leading-relaxed font-light">
            We do not track individual users. The Nested Reality Hub collects only what is necessary for the AI assistant to function and for reviews to be moderated. Your density in our database is kept to a minimum.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-stone-400">Cookies</h2>
          <p className="text-lg text-stone-700 leading-relaxed font-light">
            Only functional cookies are used to maintain your session. No third-party marketing gradients are permitted on this substrate.
          </p>
        </section>
      </div>

      <footer className="pt-24">
        <a href="/" className="text-stone-900 font-bold text-sm hover:underline">&larr; Return to Central Hub</a>
      </footer>
    </div>
  );
}

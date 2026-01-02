'use client';

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-24 space-y-16">
      <header className="text-center space-y-4">
        <h1 className="text-5xl font-serif text-stone-900">Collaborate</h1>
        <p className="text-stone-500">For academic inquiries, media requests, or serious engagement.</p>
      </header>

      <div className="grid md:grid-cols-2 gap-16">
        <div className="space-y-8">
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-stone-400">Direct Inquiries</h3>
            <p className="text-stone-600">Please reach out via the form or through my publisher&apos;s academic liaison.</p>
            <div className="space-y-1 text-sm text-stone-900 font-medium">
              <p>contact@nestedreality.org</p>
              <p>press@nestedreality.org</p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-widest text-stone-400">Academic Responses</h3>
            <p className="text-sm text-stone-500 italic">&quot;We are committed to a high standard of peer engagement. If you are preparing a formal critique or response paper, please notify us to be included in our archive.&quot;</p>
          </div>
        </div>

        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-stone-400">Full Name</label>
            <input type="text" className="w-full p-3 border border-stone-200 focus:outline-none focus:border-stone-900" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-stone-400">Organization / Role</label>
            <input type="text" className="w-full p-3 border border-stone-200 focus:outline-none focus:border-stone-900" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-stone-400">Inquiry Type</label>
            <select className="w-full p-3 border border-stone-200 focus:outline-none focus:border-stone-900 bg-white">
              <option>General Interest</option>
              <option>Media/Interview</option>
              <option>Academic Critique</option>
              <option>Translation Rights</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-stone-400">Message</label>
            <textarea rows={6} className="w-full p-3 border border-stone-200 focus:outline-none focus:border-stone-900" />
          </div>
          <button className="px-10 py-4 bg-stone-900 text-white font-bold text-xs uppercase tracking-[0.2em] hover:bg-stone-800 transition-all">
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}

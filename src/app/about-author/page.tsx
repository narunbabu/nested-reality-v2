export default function AboutAuthorPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-16 items-start">
      <div className="space-y-8">
        <h1 className="text-5xl font-serif text-stone-900">Arun Nalamara</h1>
        <p className="text-xl text-stone-600 font-serif italic">Thinking through the medium.</p>

        <div className="prose prose-stone text-stone-600 leading-relaxed space-y-6">
          <p>
            Arun&apos;s intellectual journey began in the geosciences, where the concepts of pressure, flow, and density are visceral. Transitioning into the abstract worlds of theoretical physics and metaphysics, he noticed a recurring gap in how we describe the foundations of our reality.
          </p>
          <p>
            <em>Nested Reality</em> is the culmination of twenty years of private exploration, cross-disciplinary study, and a commitment to asking &quot;What if the void isn&apos;t empty?&quot;
          </p>
          <p>
            Based in the quiet intersections of philosophy and science, Arun writes and speaks on the necessity of returning to a continuous worldview.
          </p>
        </div>

        <div className="pt-8 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-widest text-stone-400">Academic & Professional Footprints</h3>
          <ul className="space-y-3">
            <li><a href="#" className="text-stone-900 hover:underline">Google Scholar Archive &rarr;</a></li>
            <li><a href="#" className="text-stone-900 hover:underline">LinkedIn Philosophy Network &rarr;</a></li>
            <li><a href="#" className="text-stone-900 hover:underline">Recent Talk at Physics Symposia &rarr;</a></li>
          </ul>
        </div>
      </div>

      <div className="space-y-12">
        <div className="aspect-square bg-stone-200 overflow-hidden">
          <img
            src="/images/arun-bg.png"
            alt="Author portrait"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="bg-stone-50 border border-stone-200 p-8 space-y-6">
          <h2 className="text-2xl font-serif text-stone-900">The Mission</h2>
          <p className="text-stone-600 italic">
            &quot;My goal is not to prove everyone wrong, but to offer a different lens. If we change the foundational metaphors of our physics, what new technologies and understandings might we unlock?&quot;
          </p>
        </div>
      </div>
    </div>
  );
}

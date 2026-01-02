import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-stone-50 border-t border-stone-200 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2 space-y-6">
            <h3 className="text-2xl font-serif font-bold text-stone-900 tracking-tighter">NESTED REALITY</h3>
            <p className="text-stone-500 max-w-sm leading-relaxed">
              Advancing the public discourse on the fundamental structure of space, continuity, and the nested hierarchy of existence.
            </p>
            <p className="text-xs text-stone-400 italic">© 2025 Arun Nalamara. All rights reserved.</p>
          </div>
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-stone-900">Explore</h4>
            <ul className="space-y-2 text-sm text-stone-500">
              <li><Link href="/about-book" className="hover:text-stone-900">The Book</Link></li>
              <li><Link href="/explorer" className="hover:text-stone-900">Concept Explorer</Link></li>
              <li><Link href="/blog" className="hover:text-stone-900">Community Blog</Link></li>
              <li><Link href="/media" className="hover:text-stone-900">Media & Talks</Link></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-stone-900">Connect</h4>
            <ul className="space-y-2 text-sm text-stone-500">
              <li><Link href="/contact" className="hover:text-stone-900">Contact Author</Link></li>
              <li><Link href="/newsletter" className="hover:text-stone-900">Newsletter</Link></li>
              <li><Link href="/contact" className="hover:text-stone-900">Publisher Portal</Link></li>
              <li><a href="#" className="hover:text-stone-900">Google Scholar</a></li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-8 border-t border-stone-100 text-[10px] uppercase tracking-[0.2em] text-stone-400">
          <div className="flex gap-8">
            <Link href="/privacy" className="hover:text-stone-900 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-stone-900 transition-colors">Terms of Engagement</Link>
            <Link href="/ethics" className="hover:text-stone-900 transition-colors">Academic Ethics</Link>
          </div>
          <div className="text-stone-300">nestedreality.org</div>
        </div>
      </div>
    </footer>
  );
}

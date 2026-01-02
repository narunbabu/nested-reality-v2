import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-stone-950 border-t border-stone-800 pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2 space-y-6">
            <h3 className="text-2xl font-serif font-bold text-stone-100 tracking-tighter">NESTED REALITY</h3>
            <p className="text-stone-400 max-w-sm leading-relaxed">
              Advancing the public discourse on the fundamental structure of space, continuity, and the nested hierarchy of existence.
            </p>
            <p className="text-xs text-stone-500 italic">© 2025 Arun Nalamara. All rights reserved.</p>
          </div>
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#C5A059]">Explore</h4>
            <ul className="space-y-2 text-sm text-stone-400">
              <li><Link href="/about-book" className="hover:text-[#C5A059]">The Book</Link></li>
              <li><Link href="/explorer" className="hover:text-[#C5A059]">Concept Explorer</Link></li>
              <li><Link href="/blog" className="hover:text-[#C5A059]">Community Blog</Link></li>
              <li><Link href="/media" className="hover:text-[#C5A059]">Media & Talks</Link></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#C5A059]">Connect</h4>
            <ul className="space-y-2 text-sm text-stone-400">
              <li><Link href="/contact" className="hover:text-[#C5A059]">Contact Author</Link></li>
              <li><Link href="/newsletter" className="hover:text-[#C5A059]">Newsletter</Link></li>
              <li><Link href="/contact" className="hover:text-[#C5A059]">Publisher Portal</Link></li>
              <li><a href="#" className="hover:text-[#C5A059]">Google Scholar</a></li>
            </ul>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-8 border-t border-stone-800 text-[10px] uppercase tracking-[0.2em] text-stone-500">
          <div className="flex gap-8">
            <Link href="/privacy" className="hover:text-[#C5A059] transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-[#C5A059] transition-colors">Terms of Engagement</Link>
            <Link href="/ethics" className="hover:text-[#C5A059] transition-colors">Academic Ethics</Link>
          </div>
          <div className="text-stone-600">nestedreality.org</div>
        </div>
      </div>
    </footer>
  );
}

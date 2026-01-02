'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);

  React.useEffect(() => {
    // Check for existing user session
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const navItems: { href: string; label: string }[] = [
    { href: '/', label: 'Home' },
    { href: '/about-book', label: 'The Book' },
    { href: '/about-author', label: 'Author' },
    { href: '/explorer', label: 'Explorer' },
    { href: '/reviews', label: 'Reviews' },
    { href: '/media', label: 'Media' },
    { href: '/blog', label: 'Blog' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-stone-50/90 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0">
            <Link href="/" className="text-xl font-bold tracking-tight text-stone-900 font-serif">
              NESTED REALITY
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex space-x-6 lg:space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? 'text-stone-900 border-b-2 border-stone-900'
                    : 'text-stone-500 hover:text-stone-900'
                } py-5 px-1`}
              >
                {item.label}
              </Link>
            ))}
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-sm font-medium text-stone-500 hover:text-stone-900 py-5 px-1"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-sm font-medium text-stone-500 hover:text-stone-900 py-5 px-1"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="text-sm font-medium text-stone-500 hover:text-stone-900 py-5 px-1"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-stone-500 p-2"
              aria-label="Toggle Menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-stone-50 border-b border-stone-200 py-4 px-4 space-y-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={`block text-lg font-medium ${
                pathname === item.href ? 'text-stone-900' : 'text-stone-700 hover:text-stone-900'
              }`}
            >
              {item.label}
            </Link>
          ))}
          {user ? (
            <>
              <Link
                href="/dashboard"
                onClick={() => setIsOpen(false)}
                className="block text-lg font-medium text-stone-700 hover:text-stone-900"
              >
                Dashboard
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="block text-lg font-medium text-stone-700 hover:text-stone-900 w-full text-left"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/login"
              onClick={() => setIsOpen(false)}
              className="block text-lg font-medium text-stone-700 hover:text-stone-900"
            >
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}

import { Metadata } from 'next';
import { ABOUT_BOOK_SEO } from '@/lib/seo';

export const metadata: Metadata = ABOUT_BOOK_SEO;

export default function AboutBookLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

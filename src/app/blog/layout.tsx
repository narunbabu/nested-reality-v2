import { Metadata } from 'next';
import { BLOG_SEO } from '@/lib/seo';

export const metadata: Metadata = BLOG_SEO;

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

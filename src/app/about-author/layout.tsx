import { Metadata } from 'next';
import { ABOUT_AUTHOR_SEO } from '@/lib/seo';

export const metadata: Metadata = ABOUT_AUTHOR_SEO;

export default function AboutAuthorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

import { Metadata } from 'next';
import { REVIEWS_SEO } from '@/lib/seo';

export const metadata: Metadata = REVIEWS_SEO;

export default function ReviewsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

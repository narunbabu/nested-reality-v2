import { Metadata } from 'next';
import { EXPLORER_SEO } from '@/lib/seo';

export const metadata: Metadata = EXPLORER_SEO;

export default function ExplorerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

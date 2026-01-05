import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reader Discussions - Nested Reality',
  description: 'Thoughtful scholarly exchanges with readers, critics, and scholars exploring density-based physics, quantum mechanics, and the nature of reality.',
  openGraph: {
    title: 'A Scholarly Discussion: Rethinking Density, Gradient, and Motion | Nested Reality',
    description: 'Explore in-depth exchanges on density-based physics: "A Scholarly Discussion: Rethinking Density, Gradient, and Motion" featuring debates on the ontological nature of density, Buddhist philosophy connections, and revolutionary physics concepts.',
    url: 'https://nestedreality.com/discussions',
    siteName: 'Nested Reality',
    type: 'website',
    images: [
      {
        url: 'https://nestedreality.com/images/nested_reality_3d_transp.PNG',
        width: 1200,
        height: 630,
        alt: 'Nested Reality - A Density-Based Rewriting of Physics, Matter, and Life',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Reader Discussions - Nested Reality: Density-Based Physics',
    description: 'Explore scholarly discussions on revolutionary physics concepts including density, gradient, and motion.',
    images: ['https://nestedreality.com/images/nested_reality_3d_transp.PNG'],
  },
};

export default function DiscussionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

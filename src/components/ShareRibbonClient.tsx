'use client';

import ShareRibbon from './ShareRibbon';

interface ShareRibbonClientProps {
  position?: 'top' | 'bottom' | 'floating';
  title?: string;
  description?: string;
  url?: string;
}

export default function ShareRibbonClient(props: ShareRibbonClientProps) {
  return <ShareRibbon {...props} />;
}

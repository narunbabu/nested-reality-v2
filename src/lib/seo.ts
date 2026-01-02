import { Metadata } from 'next';

export const DEFAULT_SEO: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: {
    default: 'Nested Reality - Revolutionary Physics Book | Density-Based Theory of Everything',
    template: '%s | Nested Reality - Arun Nalamara'
  },
  description: 'Discover Nested Reality: A groundbreaking density-based rewriting of physics, gravity, and quantum mechanics. Explore alternative physics theories challenging dark matter, spacetime curvature, and force-based models. By physicist Arun Nalamara.',
  keywords: [
    // Primary keywords
    'nested reality',
    'density-based physics',
    'alternative physics theory',
    'quantum mechanics explained',
    'gravity without force',

    // Physics concepts
    'theoretical physics',
    'quantum physics book',
    'cosmology',
    'astrophysics',
    'general relativity alternative',
    'dark matter alternative',
    'dark energy theory',
    'spacetime continuum',
    'particle physics alternative',
    'emergent gravity',

    // Philosophical
    'philosophy of science',
    'natural philosophy',
    'ontology of physics',
    'metaphysics',
    'philosophy of physics',

    // Alternative theories
    'MOND theory',
    'aether theory modern',
    'continuous medium physics',
    'field theory',
    'holographic principle',
    'entropic gravity',

    // Book-related
    'physics book 2024',
    'popular science book',
    'theoretical physics book',
    'science philosophy book',
    'understanding quantum physics',
    'physics explained simply',

    // Author
    'Arun Nalamara',
    'Arun Babu Nalamara',
    'Indian physicist',

    // Concepts
    'density gradient',
    'nested structure',
    'layered reality',
    'structural continuity',
    'non-force physics',
    'vacuum alternative',
    'simulation theory physics',
    'multiverse theory',
    'consciousness physics'
  ],
  authors: [
    { name: 'Arun Nalamara', url: 'https://nestedreality.com/about-author' },
    { name: 'Arun Babu Nalamara' }
  ],
  creator: 'Arun Nalamara',
  publisher: 'Independently Published',

  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'Nested Reality',
    title: 'Nested Reality - Revolutionary Physics Theory | Density-Based Framework',
    description: 'Groundbreaking density-based theory challenging dark matter, force-based physics, and spacetime curvature. Explore alternative physics that unifies quantum mechanics and gravity.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Nested Reality Book Cover - A Density-Based Rewriting of Physics'
      }
    ]
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Nested Reality - Revolutionary Physics Theory',
    description: 'Density-based alternative to dark matter, force physics, and spacetime curvature. New physics book by Arun Nalamara.',
    images: ['/og-image.jpg'],
    creator: '@nestedreality',
    site: '@nestedreality'
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  alternates: {
    canonical: '/',
  },

  category: 'Science & Physics',

  other: {
    'google-site-verification': 'your-google-verification-code',
  }
};

export const REVIEWS_SEO: Metadata = {
  title: 'Reviews - AI Analysis & Reader Testimonials | Nested Reality Physics Book',
  description: 'Read comprehensive AI-generated analysis and human reviews of Nested Reality. Discover how this density-based physics theory compares to General Relativity, Quantum Field Theory, Dark Matter models, and multiverse theories.',
  keywords: [
    'nested reality reviews',
    'physics book reviews',
    'alternative physics reviews',
    'density-based theory analysis',
    'quantum mechanics book review',
    'physics theory comparison',
    'general relativity alternative review',
    'dark matter alternative analysis',
    'Arun Nalamara book reviews',
    'theoretical physics book reviews'
  ],
  openGraph: {
    title: 'Reviews - Nested Reality Physics Book | AI Analysis & Reader Testimonials',
    description: 'Comprehensive reviews comparing Nested Reality to mainstream physics: General Relativity, QFT, Dark Matter, multiverse theories. AI analysis and reader testimonials.',
    url: '/reviews',
  },
  alternates: {
    canonical: '/reviews',
  },
};

export const EXPLORER_SEO: Metadata = {
  title: 'Concept Explorer - Interactive Physics Concepts | Nested Reality Theory',
  description: 'Explore core concepts of Nested Reality: density over force, nesting principle, recursive gradient continuity (RGC). Interactive AI-powered Q&A about alternative physics, gravity without force, and continuous medium theory.',
  keywords: [
    'physics concepts explained',
    'density over force',
    'gravity explained',
    'quantum mechanics concepts',
    'interactive physics learning',
    'physics AI assistant',
    'theoretical physics concepts',
    'nested structure physics',
    'continuous medium theory',
    'alternative gravity theory'
  ],
  openGraph: {
    title: 'Concept Explorer - Nested Reality Interactive Physics',
    description: 'Explore density-based physics concepts with AI assistant: gravity without force, nested structures, continuous medium, and recursive gradient continuity.',
    url: '/explorer',
  },
  alternates: {
    canonical: '/explorer',
  },
};

export const ABOUT_BOOK_SEO: Metadata = {
  title: 'About the Book - Nested Reality | Density-Based Physics Theory Explained',
  description: 'Nested Reality book synopsis: Revolutionary density-based framework unifying gravity, quantum mechanics, and relativity. No dark matter, no force fields - pure structural continuity. Available on Amazon Kindle, Paperback, Hardcover.',
  keywords: [
    'nested reality book',
    'physics book synopsis',
    'density-based physics book',
    'alternative physics book',
    'quantum physics book',
    'theoretical physics book 2024',
    'gravity book',
    'cosmology book',
    'buy physics book',
    'Amazon physics book',
    'Kindle physics book'
  ],
  openGraph: {
    title: 'About Nested Reality - Revolutionary Density-Based Physics Book',
    description: 'Complete book synopsis, table of contents, and purchase options. Density-based rewriting of physics, matter, and life. Unify gravity and quantum mechanics without dark matter.',
    url: '/about-book',
  },
  alternates: {
    canonical: '/about-book',
  },
};

export const ABOUT_AUTHOR_SEO: Metadata = {
  title: 'About Arun Nalamara - Physicist & Author | Nested Reality Theory',
  description: 'Meet Arun Babu Nalamara, physicist and author of Nested Reality. Discover his journey developing density-based physics theory as alternative to standard model, dark matter, and force-based frameworks.',
  keywords: [
    'Arun Nalamara',
    'Arun Babu Nalamara',
    'physicist author',
    'Indian physicist',
    'theoretical physicist',
    'alternative physics researcher',
    'density theory physicist',
    'independent physicist',
    'physics researcher India'
  ],
  openGraph: {
    title: 'About Arun Nalamara - Physicist & Author of Nested Reality',
    description: 'Physicist Arun Nalamara presents density-based alternative to standard physics. Author of Nested Reality theory.',
    url: '/about-author',
  },
  alternates: {
    canonical: '/about-author',
  },
};

export const BLOG_SEO: Metadata = {
  title: 'Physics Blog - Articles on Density Theory & Quantum Mechanics | Nested Reality',
  description: 'In-depth articles exploring density-based physics, gravity without force, continuous medium theory, quantum mechanics alternatives, and challenges to dark matter. By Arun Nalamara.',
  keywords: [
    'physics blog',
    'theoretical physics articles',
    'quantum mechanics explained',
    'gravity articles',
    'alternative physics blog',
    'density theory articles',
    'physics education',
    'cosmology blog',
    'physics insights'
  ],
  openGraph: {
    title: 'Nested Reality Physics Blog - Theoretical Physics Articles',
    description: 'Explore physics concepts: density over force, nested structures, quantum mechanics alternatives, and cosmology insights.',
    url: '/blog',
  },
  alternates: {
    canonical: '/blog',
  },
};

export function generateArticleSchema(article: {
  title: string;
  description: string;
  author: string;
  datePublished: string;
  dateModified?: string;
  url: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    author: {
      '@type': 'Person',
      name: article.author,
      url: 'https://nestedreality.com/about-author'
    },
    publisher: {
      '@type': 'Organization',
      name: 'Nested Reality',
      logo: {
        '@type': 'ImageObject',
        url: 'https://nestedreality.com/logo.png'
      }
    },
    datePublished: article.datePublished,
    dateModified: article.dateModified || article.datePublished,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': article.url
    }
  };
}

export function generateBookSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Book',
    name: 'Nested Reality: A Density-Based Rewriting of Physics, Matter, and Life',
    author: {
      '@type': 'Person',
      name: 'Arun Nalamara',
      url: 'https://nestedreality.com/about-author'
    },
    publisher: {
      '@type': 'Organization',
      name: 'Independently Published'
    },
    description: 'Revolutionary density-based framework challenging dark matter, force physics, and spacetime curvature. Unifies gravity and quantum mechanics through structural continuity.',
    genre: ['Science', 'Physics', 'Philosophy of Science', 'Theoretical Physics'],
    inLanguage: 'en',
    numberOfPages: 300,
    bookFormat: 'https://schema.org/EBook',
    isbn: 'B0GBSJPGKC',
    offers: [
      {
        '@type': 'Offer',
        price: '4.99',
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
        url: 'https://www.amazon.com/dp/B0GBSJPGKC'
      }
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.5',
      reviewCount: '4',
      bestRating: '5',
      worstRating: '1'
    },
    review: [
      {
        '@type': 'Review',
        reviewRating: {
          '@type': 'Rating',
          ratingValue: '5'
        },
        name: 'A Quiet Revolution: Rewriting the Language of Physics',
        author: {
          '@type': 'Thing',
          name: 'AI Analysis'
        },
        reviewBody: 'A work that is simultaneously gentle in tone and radical in ambition. Nested Reality doesn\'t merely explain physics—it undresses it.'
      }
    ]
  };
}

export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Nested Reality',
    url: 'https://nestedreality.com',
    logo: 'https://nestedreality.com/logo.png',
    description: 'Platform for exploring density-based physics theory and alternative approaches to understanding gravity, quantum mechanics, and the structure of reality.',
    sameAs: [
      'https://twitter.com/nestedreality',
      'https://www.amazon.com/author/arunnalamara'
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      url: 'https://nestedreality.com/contact'
    }
  };
}

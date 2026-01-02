import { Concept, BlogPost } from '@/types';

export const BOOK_METADATA = {
  title: "Nested Reality: A Density-Based Rewriting of Physics, Matter, and Life",
  author: "Arun Nalamara",
  formats: {
    kindle: {
      asin: "B0GBSJPGKC",
      price: "$4.99",
      url: "https://www.amazon.com/dp/B0GBSJPGKC",
      reviewUrl: "https://www.amazon.com/review/create-review/?asin=B0GBSJPGKC"
    },
    paperback: {
      asin: "B0GBDCLDNH",
      price: "$14.99",
      url: "https://www.amazon.com/dp/B0GBDCLDNH"
    },
    hardcover: {
      asin: "B0GBTQ46WD",
      price: "$29.99",
      url: "https://www.amazon.com/dp/B0GBTQ46WD"
    }
  }
};

export const CONCEPTS: Concept[] = [
  {
    id: 'density',
    title: 'Density Over Force',
    summary: 'Replacing external vectors with internal structural gradients.',
    description: `In the Nested Reality framework, what we traditionally call "force" is reinterpreted as a local response to density gradients. Matter doesn't "feel" a pull; it drifts toward higher structural stability defined by the nesting density of the medium.`,
    quotes: [
      "The vacuum is not an absence, but the baseline density of existence.",
      "Acceleration is the language of density transition."
    ],
    faqs: [
      { q: "Is this just another way to say Gravity?", a: "No. While it explains gravitational effects, it posits that 'force' as an independent ontological entity does not exist." }
    ]
  },
  {
    id: 'nesting',
    title: 'The Nesting Principle',
    summary: 'The recursive architecture of reality.',
    description: 'Reality is not built of building blocks (particles), but of nested scales of continuity. Each scale informs the one above it, not through collision, but through structural resonance.',
    quotes: [
      "Scale is the fundamental dimension often overlooked by modern physics.",
      "The interior of the atom is not a void, but a denser nesting of the same fabric."
    ],
    faqs: [
      { q: "Does this replace Quantum Mechanics?", a: "It provides a structural meta-theory that explains why quantum effects occur at specific nesting scales." }
    ]
  },
  {
    id: 'rgc',
    title: 'Recursive Gradient Continuity (RGC)',
    summary: 'The mathematical backbone of motion without force.',
    description: 'RGC is the formalization of how motion occurs in a continuous medium. Instead of particles moving through space, RGC describes the propagation of state-changes through a variable-density fabric.',
    quotes: [
      "Motion is not displacement; it is the translation of an pattern through a medium.",
    ],
    faqs: [
      { q: "What is the medium made of?", a: "The medium is the substrate of existence itself—pure relational density." }
    ]
  }
];

export const SITE_CONFIG = {
  name: "Nested Reality",
  description: "A Density-Based Rewriting of Physics, Matter, and Life by Arun Nalamara",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  ogImage: "/og-image.jpg",
  twitterHandle: "@nestedreality",
};

export const NAVIGATION_ITEMS = [
  { href: '/', label: 'Home' },
  { href: '/about-book', label: 'About the Book' },
  { href: '/about-author', label: 'About the Author' },
  { href: '/explorer', label: 'Concept Explorer' },
  { href: '/reviews', label: 'Reviews' },
  { href: '/blog', label: 'Blog' },
  { href: '/media', label: 'Media' },
  { href: '/contact', label: 'Contact' },
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'density-vs-force',
    user_id: null,
    title: 'The Fallacy of Discrete Motion',
    excerpt: 'Why our particle-based understanding of movement fails at quantum scales and how density gradients offer a more elegant solution.',
    content: 'In theNested Reality framework, what we traditionally call "force" is reinterpreted as a local response to density gradients. Matter doesn\'t "feel" a pull; it drifts toward higher structural stability defined by the nesting density of the medium.',
    category: 'Physics',
    tags: null,
    featured_image: null,
    images: null,
    author: 'Arun Nalamara',
    word_count: 1200,
    read_time_minutes: 5,
    view_count: 0,
    is_published: true,
    is_approved: true,
    created_at: '2024-12-01T00:00:00Z',
    updated_at: '2024-12-01T00:00:00Z',
  },
  {
    id: 'visualizing-aether',
    user_id: null,
    title: 'Visualizing the Aether-Gradient',
    excerpt: 'Modern physics abandoned the aether too soon. Learn how density-based modeling brings it back as a mathematical necessity, not a mystical substance.',
    content: 'Reality is not built of building blocks (particles), but of nested scales of continuity. Each scale informs the one above it, not through collision, but through structural resonance.',
    category: 'Cosmology',
    tags: null,
    featured_image: null,
    images: null,
    author: 'Arun Nalamara',
    word_count: 1500,
    read_time_minutes: 7,
    view_count: 0,
    is_published: true,
    is_approved: true,
    created_at: '2024-11-15T00:00:00Z',
    updated_at: '2024-11-15T00:00:00Z',
  },
  {
    id: 'density-velocity-lecture',
    user_id: null,
    title: 'Lecture Notes: Density vs. Velocity',
    excerpt: 'Transcribed notes from the recent symposium on rethinking kinetic energy through the lens of structural density.',
    content: 'Motion is not displacement; it is the translation of a pattern through a medium. The particle model serves as a scaffold, but the scaffolding is not the building.',
    category: 'Education',
    tags: null,
    featured_image: null,
    images: null,
    author: 'Arun Nalamara',
    word_count: 900,
    read_time_minutes: 4,
    view_count: 0,
    is_published: true,
    is_approved: true,
    created_at: '2024-10-20T00:00:00Z',
    updated_at: '2024-10-20T00:00:00Z',
  },
];

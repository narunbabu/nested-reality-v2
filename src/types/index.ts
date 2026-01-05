// ============================================
// DATABASE TYPES (Supabase)
// ============================================

export interface DatabaseUser {
  id: string;
  email: string;
  username: string | null;
  full_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  role: 'user' | 'moderator' | 'admin';
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface DatabaseReview {
  id: string;
  user_id: string | null;
  book_id: string;
  rating: number;
  title: string | null;
  content: string;
  helpful_count: number;
  is_featured: boolean;
  is_verified: boolean;
  is_approved: boolean;
  moderation_status: 'pending' | 'approved' | 'rejected';
  moderation_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface DatabaseEssay {
  id: string;
  user_id: string | null;
  title: string;
  excerpt: string | null;
  content: string;
  category: string | null;
  tags: string[] | null;
  featured_image: string | null;
  images: string[] | null;
  word_count: number | null;
  read_time_minutes: number | null;
  view_count: number;
  is_published: boolean;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
}

export interface EssayWithUser extends DatabaseEssay {
  user?: {
    username: string | null;
    full_name: string | null;
    avatar_url: string | null;
  };
}

export interface DatabaseComment {
  id: string;
  user_id: string | null;
  parent_type: 'review' | 'essay' | 'comment';
  parent_id: string;
  content: string;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
}

export interface DatabaseReviewVote {
  id: string;
  user_id: string;
  review_id: string;
  vote_type: 'helpful' | 'not_helpful';
  created_at: string;
}

export interface DatabaseNewsletterSubscriber {
  id: string;
  email: string;
  is_active: boolean;
  subscribed_at: string;
  unsubscribed_at: string | null;
}

// ============================================
// UI/FRONTEND TYPES
// ============================================

export interface Concept {
  id: string;
  title: string;
  summary: string;
  description: string;
  quotes: string[];
  faqs: { q: string; a: string }[];
}

export interface Review extends DatabaseReview {
  author?: string;
  user?: {
    username: string | null;
    full_name: string | null;
    avatar_url: string | null;
  };
}

export interface BlogPost extends DatabaseEssay {
  author?: string;
  user?: {
    username: string | null;
    full_name: string | null;
  };
}

export type Page =
  | 'home'
  | 'about-book'
  | 'about-author'
  | 'explorer'
  | 'reviews'
  | 'blog'
  | 'media'
  | 'contact'
  | 'privacy'
  | 'terms'
  | 'ethics'
  | 'newsletter'
  | 'login'
  | 'register'
  | 'dashboard'
  | 'admin';

// ============================================
// FORM TYPES
// ============================================

export interface ReviewFormData {
  rating: number;
  title?: string;
  content: string;
}

export interface EssayFormData {
  title: string;
  excerpt?: string;
  content: string;
  category?: string;
  tags?: string[];
  featured_image?: string;
}

export interface CommentFormData {
  content: string;
}

export interface AIReview {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  rating: number;
  date: string;
  excerpt: string;
  sections: {
    title: string;
    content: string;
  }[];
  keyTakeaways?: string[];
}

export interface Discussion {
  id: string;
  title: string;
  subtitle: string;
  participants: string[];
  date: string;
  excerpt: string;
  tags: string[];
  messages: {
    timestamp: string;
    sender: string;
    content: string;
  }[];
}

export interface RegisterFormData {
  email: string;
  password: string;
  username?: string;
  full_name?: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(100) UNIQUE,
  full_name VARCHAR(255),
  bio TEXT,
  avatar_url VARCHAR(500),
  role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('user', 'moderator', 'admin')),
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- REVIEWS TABLE
-- ============================================
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  book_id VARCHAR(100) DEFAULT 'nested-reality',
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(200),
  content TEXT NOT NULL,
  helpful_count INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  is_verified BOOLEAN DEFAULT FALSE,
  is_approved BOOLEAN DEFAULT FALSE,
  moderation_status VARCHAR(50) DEFAULT 'pending' CHECK (moderation_status IN ('pending', 'approved', 'rejected')),
  moderation_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- ESSAYS/BLOG POSTS TABLE
-- ============================================
CREATE TABLE essays (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  title VARCHAR(300) NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  category VARCHAR(100),
  tags TEXT[],
  featured_image VARCHAR(500),
  word_count INTEGER,
  read_time_minutes INTEGER,
  view_count INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT FALSE,
  is_approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- COMMENTS TABLE
-- ============================================
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  parent_type VARCHAR(50) CHECK (parent_type IN ('review', 'essay', 'comment')),
  parent_id UUID NOT NULL,
  content TEXT NOT NULL,
  is_approved BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- REVIEW VOTES TABLE
-- ============================================
CREATE TABLE review_votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  review_id UUID REFERENCES reviews(id) ON DELETE CASCADE,
  vote_type VARCHAR(20) CHECK (vote_type IN ('helpful', 'not_helpful')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, review_id)
);

-- ============================================
-- NEWSLETTER SUBSCRIBERS TABLE
-- ============================================
CREATE TABLE newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  unsubscribed_at TIMESTAMP WITH TIME ZONE
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

-- Reviews indexes
CREATE INDEX idx_reviews_user_id ON reviews(user_id);
CREATE INDEX idx_reviews_is_approved ON reviews(is_approved);
CREATE INDEX idx_reviews_created_at ON reviews(created_at DESC);
CREATE INDEX idx_reviews_rating ON reviews(rating);

-- Essays indexes
CREATE INDEX idx_essays_user_id ON essays(user_id);
CREATE INDEX idx_essays_is_published ON essays(is_published);
CREATE INDEX idx_essays_category ON essays(category);
CREATE INDEX idx_essays_created_at ON essays(created_at DESC);

-- Comments indexes
CREATE INDEX idx_comments_parent ON comments(parent_type, parent_id);
CREATE INDEX idx_comments_user_id ON comments(user_id);

-- Review votes indexes
CREATE INDEX idx_review_votes_review_id ON review_votes(review_id);
CREATE INDEX idx_review_votes_user_id ON review_votes(user_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE essays ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- USERS POLICIES
CREATE POLICY "Public read access for users" ON users FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

-- REVIEWS POLICIES
CREATE POLICY "Public read access for approved reviews" ON reviews FOR SELECT USING (is_approved = true);
CREATE POLICY "Authenticated users can insert reviews" ON reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own reviews" ON reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can do everything" ON reviews FOR ALL USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- ESSAYS POLICIES
CREATE POLICY "Public read access for published essays" ON essays FOR SELECT USING (is_published = true);
CREATE POLICY "Authenticated users can insert essays" ON essays FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own essays" ON essays FOR UPDATE USING (auth.uid() = user_id);

-- COMMENTS POLICIES
CREATE POLICY "Public read access for approved comments" ON comments FOR SELECT USING (is_approved = true);
CREATE POLICY "Authenticated users can insert comments" ON comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own comments" ON comments FOR UPDATE USING (auth.uid() = user_id);

-- REVIEW VOTES POLICIES
CREATE POLICY "Authenticated users can manage votes" ON review_votes FOR ALL USING (auth.uid() = user_id);

-- NEWSLETTER SUBSCRIBERS POLICIES
CREATE POLICY "Public insert for newsletter" ON newsletter_subscribers FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin read access for newsletter" ON newsletter_subscribers FOR SELECT USING (
  EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
);

-- ============================================
-- FUNCTIONS AND TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_essays_updated_at BEFORE UPDATE ON essays
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update helpful count on reviews
CREATE OR REPLACE FUNCTION update_review_helpful_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.vote_type = 'helpful' THEN
      UPDATE reviews SET helpful_count = helpful_count + 1 WHERE id = NEW.review_id;
    END IF;
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.vote_type != NEW.vote_type THEN
      IF OLD.vote_type = 'helpful' AND NEW.vote_type = 'not_helpful' THEN
        UPDATE reviews SET helpful_count = helpful_count - 1 WHERE id = NEW.review_id;
      ELSIF OLD.vote_type = 'not_helpful' AND NEW.vote_type = 'helpful' THEN
        UPDATE reviews SET helpful_count = helpful_count + 1 WHERE id = NEW.review_id;
      END IF;
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    IF OLD.vote_type = 'helpful' THEN
      UPDATE reviews SET helpful_count = helpful_count - 1 WHERE id = OLD.review_id;
    END IF;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_review_votes_count AFTER INSERT OR UPDATE OR DELETE ON review_votes
  FOR EACH ROW EXECUTE FUNCTION update_review_helpful_count();

-- ============================================
-- INSERT DEFAULT ADMIN USER (OPTIONAL)
-- ============================================
-- Note: You need to create the auth user first via Supabase Auth, then run:
-- INSERT INTO users (id, email, role, is_verified)
-- VALUES ('UUID_FROM_AUTH', 'admin@example.com', 'admin', true);

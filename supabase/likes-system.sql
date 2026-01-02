-- Likes System Migration
-- Enables users to like essays and comments

-- ============================================
-- 1. ADD LIKE COUNT COLUMNS TO EXISTING TABLES
-- ============================================

-- Add like_count to essays table
ALTER TABLE essays
ADD COLUMN IF NOT EXISTS like_count INTEGER DEFAULT 0;

-- Add like_count to comments table
ALTER TABLE comments
ADD COLUMN IF NOT EXISTS like_count INTEGER DEFAULT 0;

-- ============================================
-- 2. CREATE ESSAY LIKES TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS essay_likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  essay_id UUID NOT NULL REFERENCES essays(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, essay_id)
);

-- Indexes for essay_likes
CREATE INDEX IF NOT EXISTS idx_essay_likes_essay_id ON essay_likes(essay_id);
CREATE INDEX IF NOT EXISTS idx_essay_likes_user_id ON essay_likes(user_id);

-- ============================================
-- 3. CREATE COMMENT LIKES TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS comment_likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  comment_id UUID NOT NULL REFERENCES comments(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, comment_id)
);

-- Indexes for comment_likes
CREATE INDEX IF NOT EXISTS idx_comment_likes_comment_id ON comment_likes(comment_id);
CREATE INDEX IF NOT EXISTS idx_comment_likes_user_id ON comment_likes(user_id);

-- ============================================
-- 4. ROW LEVEL SECURITY POLICIES
-- ============================================

-- Enable RLS on essay_likes
ALTER TABLE essay_likes ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to manage their own essay likes
CREATE POLICY "Authenticated users can manage essay likes"
ON essay_likes FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Allow public read access for essay likes
CREATE POLICY "Public read access for essay likes"
ON essay_likes FOR SELECT
USING (true);

-- Enable RLS on comment_likes
ALTER TABLE comment_likes ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to manage their own comment likes
CREATE POLICY "Authenticated users can manage comment likes"
ON comment_likes FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Allow public read access for comment likes
CREATE POLICY "Public read access for comment likes"
ON comment_likes FOR SELECT
USING (true);

-- ============================================
-- 5. TRIGGERS TO UPDATE LIKE COUNTS
-- ============================================

-- Function to update essay like count
CREATE OR REPLACE FUNCTION update_essay_like_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE essays SET like_count = like_count + 1 WHERE id = NEW.essay_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE essays SET like_count = like_count - 1 WHERE id = OLD.essay_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger for essay likes
DROP TRIGGER IF EXISTS update_essay_likes_count ON essay_likes;
CREATE TRIGGER update_essay_likes_count
AFTER INSERT OR DELETE ON essay_likes
FOR EACH ROW EXECUTE FUNCTION update_essay_like_count();

-- Function to update comment like count
CREATE OR REPLACE FUNCTION update_comment_like_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE comments SET like_count = like_count + 1 WHERE id = NEW.comment_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE comments SET like_count = like_count - 1 WHERE id = OLD.comment_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger for comment likes
DROP TRIGGER IF EXISTS update_comment_likes_count ON comment_likes;
CREATE TRIGGER update_comment_likes_count
AFTER INSERT OR DELETE ON comment_likes
FOR EACH ROW EXECUTE FUNCTION update_comment_like_count();

-- ============================================
-- 6. INITIALIZE EXISTING ESSAYS AND COMMENTS
-- ============================================

-- Update existing essays with current like counts
UPDATE essays e
SET like_count = COALESCE(
  (SELECT COUNT(*) FROM essay_likes el WHERE el.essay_id = e.id),
  0
);

-- Update existing comments with current like counts
UPDATE comments c
SET like_count = COALESCE(
  (SELECT COUNT(*) FROM comment_likes cl WHERE cl.comment_id = c.id),
  0
);

-- ============================================
-- MIGRATION COMPLETE
-- ============================================

-- Verification queries (run these to check setup):
-- SELECT * FROM essay_likes LIMIT 5;
-- SELECT * FROM comment_likes LIMIT 5;
-- SELECT id, title, like_count FROM essays LIMIT 5;
-- SELECT id, content, like_count FROM comments LIMIT 5;

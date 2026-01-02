-- Reading Progress Tracker Migration
-- Enables users to track their reading progress through the book

-- ============================================
-- 1. CREATE READING PROGRESS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS reading_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(50) NOT NULL CHECK (status IN (
    'planning',           -- Planning to read
    'started',            -- Started reading
    'first_4_chapters',   -- First 4 Chapters completed
    'first_10_chapters',  -- First 10 Chapters
    'completed',          -- Full book read
    'reviewed'            -- Review submitted
  )),
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  current_chapter INTEGER,
  notes TEXT,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- ============================================
-- 2. CREATE INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_reading_progress_user_id ON reading_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_reading_progress_status ON reading_progress(status);
CREATE INDEX IF NOT EXISTS idx_reading_progress_progress_percentage ON reading_progress(progress_percentage);

-- ============================================
-- 3. ROW LEVEL SECURITY POLICIES
-- ============================================

ALTER TABLE reading_progress ENABLE ROW LEVEL SECURITY;

-- Users can manage their own reading progress
CREATE POLICY "Users can manage own reading progress"
ON reading_progress FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Public read access for reading progress stats (for aggregate queries)
CREATE POLICY "Public read access for reading progress stats"
ON reading_progress FOR SELECT
USING (true);

-- ============================================
-- 4. TRIGGERS
-- ============================================

-- Auto-update updated_at timestamp
CREATE TRIGGER update_reading_progress_updated_at
BEFORE UPDATE ON reading_progress
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 5. HELPER FUNCTIONS
-- ============================================

-- Function to get public reading progress statistics
CREATE OR REPLACE FUNCTION get_reading_progress_stats()
RETURNS TABLE (
  status TEXT,
  count BIGINT,
  percentage NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    rp.status,
    COUNT(*)::BIGINT,
    ROUND((COUNT(*)::NUMERIC / NULLIF((SELECT COUNT(*) FROM reading_progress), 0)) * 100, 2)
  FROM reading_progress rp
  GROUP BY rp.status
  ORDER BY
    CASE rp.status
      WHEN 'planning' THEN 1
      WHEN 'started' THEN 2
      WHEN 'first_4_chapters' THEN 3
      WHEN 'first_10_chapters' THEN 4
      WHEN 'completed' THEN 5
      WHEN 'reviewed' THEN 6
    END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_reading_progress_stats() TO authenticated;

-- ============================================
-- 6. STATUS VALIDATION TRIGGER
-- ============================================

-- Function to auto-set timestamps based on status
CREATE OR REPLACE FUNCTION update_reading_progress_timestamps()
RETURNS TRIGGER AS $$
BEGIN
  -- Set started_at when status changes to 'started' or beyond
  IF NEW.status IN ('started', 'first_4_chapters', 'first_10_chapters', 'completed', 'reviewed') THEN
    IF OLD.status IS NULL OR OLD.status = 'planning' THEN
      NEW.started_at = COALESCE(NEW.started_at, NOW());
    END IF;
  END IF;

  -- Set completed_at when status reaches 'completed' or 'reviewed'
  IF NEW.status IN ('completed', 'reviewed') THEN
    IF OLD.status IS NULL OR OLD.status NOT IN ('completed', 'reviewed') THEN
      NEW.completed_at = COALESCE(NEW.completed_at, NOW());
    END IF;
  END IF;

  -- Auto-calculate progress_percentage based on status
  IF TG_OP = 'INSERT' OR NEW.status != OLD.status THEN
    CASE NEW.status
      WHEN 'planning' THEN NEW.progress_percentage = 0;
      WHEN 'started' THEN NEW.progress_percentage = 5;
      WHEN 'first_4_chapters' THEN NEW.progress_percentage = 20;
      WHEN 'first_10_chapters' THEN NEW.progress_percentage = 50;
      WHEN 'completed' THEN NEW.progress_percentage = 100;
      WHEN 'reviewed' THEN NEW.progress_percentage = 100;
    END CASE;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update timestamps and progress
DROP TRIGGER IF EXISTS update_reading_progress_auto_fields ON reading_progress;
CREATE TRIGGER update_reading_progress_auto_fields
BEFORE INSERT OR UPDATE ON reading_progress
FOR EACH ROW
EXECUTE FUNCTION update_reading_progress_timestamps();

-- ============================================
-- 7. CREATE VIEWS FOR EASY ACCESS
-- ============================================

-- Public stats view (aggregated data only)
CREATE OR REPLACE VIEW reading_progress_public_stats AS
SELECT
  status,
  COUNT(*) as reader_count,
  ROUND((COUNT(*)::NUMERIC / NULLIF((SELECT COUNT(*) FROM reading_progress), 0)) * 100, 2) as percentage
FROM reading_progress
GROUP BY status
ORDER BY
  CASE status
    WHEN 'planning' THEN 1
    WHEN 'started' THEN 2
    WHEN 'first_4_chapters' THEN 3
    WHEN 'first_10_chapters' THEN 4
    WHEN 'completed' THEN 5
    WHEN 'reviewed' THEN 6
  END;

-- ============================================
-- 8. USEFUL QUERIES
-- ============================================

-- Get total readers count
-- SELECT COUNT(*) FROM reading_progress;

-- Get distribution by status
-- SELECT * FROM reading_progress_public_stats;

-- Get user's progress (from API)
-- SELECT * FROM reading_progress WHERE user_id = auth.uid();

-- Get top readers (completed + reviewed)
-- SELECT u.username, rp.status, rp.completed_at
-- FROM reading_progress rp
-- JOIN users u ON u.id = rp.user_id
-- WHERE rp.status IN ('completed', 'reviewed')
-- ORDER BY rp.completed_at DESC;

-- ============================================
-- MIGRATION COMPLETE
-- ============================================

-- Verification queries:
-- SELECT * FROM reading_progress_public_stats;
-- SELECT * FROM get_reading_progress_stats();

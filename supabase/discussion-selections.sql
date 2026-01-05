-- Discussion Selections Table
-- Stores user selections of discussion message points

-- Create the discussion_selections table
CREATE TABLE IF NOT EXISTS public.discussion_selections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  discussion_id TEXT NOT NULL,
  message_indices INTEGER[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Ensure one record per user per discussion
  UNIQUE(user_id, discussion_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_discussion_selections_user_id
  ON public.discussion_selections(user_id);

CREATE INDEX IF NOT EXISTS idx_discussion_selections_discussion_id
  ON public.discussion_selections(discussion_id);

CREATE INDEX IF NOT EXISTS idx_discussion_selections_user_discussion
  ON public.discussion_selections(user_id, discussion_id);

-- Enable Row Level Security
ALTER TABLE public.discussion_selections ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own selections
CREATE POLICY "Users can view own discussion selections"
  ON public.discussion_selections
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own selections
CREATE POLICY "Users can insert own discussion selections"
  ON public.discussion_selections
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own selections
CREATE POLICY "Users can update own discussion selections"
  ON public.discussion_selections
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own selections
CREATE POLICY "Users can delete own discussion selections"
  ON public.discussion_selections
  FOR DELETE
  USING (auth.uid() = user_id);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_discussion_selections_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at on row updates
DROP TRIGGER IF EXISTS trigger_update_discussion_selections_updated_at
  ON public.discussion_selections;

CREATE TRIGGER trigger_update_discussion_selections_updated_at
  BEFORE UPDATE ON public.discussion_selections
  FOR EACH ROW
  EXECUTE FUNCTION update_discussion_selections_updated_at();

-- Grant necessary permissions
GRANT ALL ON public.discussion_selections TO authenticated;
GRANT SELECT ON public.discussion_selections TO anon;

-- Comments for documentation
COMMENT ON TABLE public.discussion_selections IS 'Stores user selections of key discussion message points';
COMMENT ON COLUMN public.discussion_selections.discussion_id IS 'Reference to discussion ID from constants';
COMMENT ON COLUMN public.discussion_selections.message_indices IS 'Array of selected message indices (0-based)';

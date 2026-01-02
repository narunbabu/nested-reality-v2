-- ================================================================
-- AUTO-CREATE USER IN CUSTOM USERS TABLE
-- ================================================================
-- This trigger automatically creates a record in the custom 'users' table
-- whenever a new user signs up via Supabase Auth (OAuth, email, etc.)
-- Run this in your Supabase SQL Editor

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, avatar_url, created_at, updated_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', NULL),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NEW.raw_user_meta_data->>'picture', NULL),
    NOW(),
    NOW()
  )
  ON CONFLICT (id) DO NOTHING;  -- Prevent errors if user already exists

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger that fires when a new user signs up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Optional: Backfill existing auth users into custom users table
-- This will create records for any users who signed up before this trigger was created
INSERT INTO public.users (id, email, full_name, avatar_url, created_at, updated_at)
SELECT
  au.id,
  au.email,
  COALESCE(au.raw_user_meta_data->>'full_name', au.raw_user_meta_data->>'name', NULL) as full_name,
  COALESCE(au.raw_user_meta_data->>'avatar_url', au.raw_user_meta_data->>'picture', NULL) as avatar_url,
  au.created_at,
  au.updated_at
FROM auth.users au
WHERE NOT EXISTS (
  SELECT 1 FROM public.users u WHERE u.id = au.id
);

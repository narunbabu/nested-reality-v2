-- ================================================================
-- STORAGE BUCKET PERMISSIONS FIX
-- ================================================================
-- This grants the anon and authenticated roles permission to list storage buckets
-- Run this in your Supabase SQL Editor

-- Grant SELECT permission on storage.buckets to anon role
GRANT SELECT ON TABLE storage.buckets TO anon;

-- Grant SELECT permission on storage.buckets to authenticated role
GRANT SELECT ON TABLE storage.buckets TO authenticated;

-- Verify the grants worked (optional - run this to check)
-- SELECT * FROM storage.buckets;

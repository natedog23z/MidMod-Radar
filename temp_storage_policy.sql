-- Run this in your Supabase SQL Editor
-- This disables RLS for tables, allowing full access during development
-- IMPORTANT: Replace with proper authentication later!

-- Disable RLS for the tables (this part should work)
ALTER TABLE public.house_photos DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.houses DISABLE ROW LEVEL SECURITY;

-- For the storage bucket policies, use the Supabase UI instead of SQL:
-- 1. Go to Storage in the left sidebar
-- 2. Select the "house-photos" bucket
-- 3. Click on "Policies" tab
-- 4. Create these policies using the UI:
--    a. Policy for SELECT: Set to "Policy using custom check: true"
--    b. Policy for INSERT: Set to "Policy using custom check: true"
--    c. Policy for UPDATE: Set to "Policy using custom check: true"
--    d. Policy for DELETE: Set to "Policy using custom check: true"

-- When you're ready to secure your application:
-- 1. Re-enable RLS for the tables:
--    ALTER TABLE public.house_photos ENABLE ROW LEVEL SECURITY;
--    ALTER TABLE public.houses ENABLE ROW LEVEL SECURITY;
-- 2. Update the storage policies to only allow authenticated users 
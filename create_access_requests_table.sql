-- ==============================================================
-- ASMA COURSE & NOTES ACCESS REQUESTS TABLE & RLS
-- Run this in Supabase Dashboard -> SQL Editor
-- ==============================================================

-- 1. Create access_requests table
CREATE TABLE IF NOT EXISTS public.access_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  student_name text,
  student_email text,
  student_id text,
  item_id text NOT NULL,
  item_title text NOT NULL,
  item_type text DEFAULT 'note', -- 'note' or 'course'
  status text DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable Row Level Security
ALTER TABLE public.access_requests ENABLE ROW LEVEL SECURITY;

-- 3. Policy: Students can view their own requests, Admins can view ALL requests
DROP POLICY IF EXISTS "Allow select access_requests" ON public.access_requests;
CREATE POLICY "Allow select access_requests"
ON public.access_requests
FOR SELECT
TO authenticated
USING (
  auth.uid() = auth_user_id
  OR auth.jwt() ->> 'email' IN (SELECT email FROM public.admins)
  OR auth.jwt() ->> 'email' = 'admin@asmaonline.in'
);

-- 4. Policy: Authenticated students can submit access requests
DROP POLICY IF EXISTS "Allow insert access_requests" ON public.access_requests;
CREATE POLICY "Allow insert access_requests"
ON public.access_requests
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = auth_user_id
);

-- 5. Policy: Admins can update access requests (Approve / Reject)
DROP POLICY IF EXISTS "Allow admin update access_requests" ON public.access_requests;
CREATE POLICY "Allow admin update access_requests"
ON public.access_requests
FOR UPDATE
TO authenticated
USING (
  auth.jwt() ->> 'email' IN (SELECT email FROM public.admins)
  OR auth.jwt() ->> 'email' = 'admin@asmaonline.in'
)
WITH CHECK (
  auth.jwt() ->> 'email' IN (SELECT email FROM public.admins)
  OR auth.jwt() ->> 'email' = 'admin@asmaonline.in'
);

-- 6. Policy: Admins can delete access requests
DROP POLICY IF EXISTS "Allow admin delete access_requests" ON public.access_requests;
CREATE POLICY "Allow admin delete access_requests"
ON public.access_requests
FOR DELETE
TO authenticated
USING (
  auth.jwt() ->> 'email' IN (SELECT email FROM public.admins)
  OR auth.jwt() ->> 'email' = 'admin@asmaonline.in'
);

-- ==============================================================
-- ASMA ADMIN & ENROLLMENTS RLS SETUP SCRIPT (FINAL FIX)
-- Run this in Supabase Dashboard -> SQL Editor
-- ==============================================================

-- 1. Insert admin into admins table using auth.users id (Fixes admins_id_fkey)
INSERT INTO public.admins (id, email)
SELECT id, email
FROM auth.users
WHERE email = 'admin@asmaonline.in'
ON CONFLICT DO NOTHING;

-- 2. Make sure RLS is enabled on enrollments
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;

-- 3. Policy: Allow anyone (guests/students) to submit an enrollment/signup
DROP POLICY IF EXISTS "Allow student insert" ON public.enrollments;
CREATE POLICY "Allow student insert"
ON public.enrollments
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- 4. Policy: Allow students to view their own enrollments, and Admin to view ALL enrollments
DROP POLICY IF EXISTS "Allow select enrollments" ON public.enrollments;
CREATE POLICY "Allow select enrollments"
ON public.enrollments
FOR SELECT
TO authenticated
USING (
  auth.uid() = auth_user_id
  OR auth.jwt() ->> 'email' IN (SELECT email FROM public.admins)
  OR auth.jwt() ->> 'email' = 'admin@asmaonline.in'
);

-- 5. Policy: Allow Admins to update enrollments (Approve/Reject)
DROP POLICY IF EXISTS "Allow admin update enrollments" ON public.enrollments;
CREATE POLICY "Allow admin update enrollments"
ON public.enrollments
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

-- 6. Policy: Allow Admins to delete enrollments
DROP POLICY IF EXISTS "Allow admin delete enrollments" ON public.enrollments;
CREATE POLICY "Allow admin delete enrollments"
ON public.enrollments
FOR DELETE
TO authenticated
USING (
  auth.jwt() ->> 'email' IN (SELECT email FROM public.admins)
  OR auth.jwt() ->> 'email' = 'admin@asmaonline.in'
);

-- 7. Create approve_enrollment RPC function for generating Student ID
CREATE OR REPLACE FUNCTION public.approve_enrollment(enrollment_uuid uuid)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_student_id text;
  v_count int;
BEGIN
  -- Generate unique student ID: ADV-YYYY-XXXX
  SELECT count(*) + 1 INTO v_count FROM public.enrollments WHERE student_id IS NOT NULL;
  v_student_id := 'ADV-' || to_char(now(), 'YYYY') || '-' || lpad(v_count::text, 4, '0');

  -- Update enrollment status and assign student id
  UPDATE public.enrollments
  SET 
    status = 'approved',
    student_id = v_student_id,
    approved_at = now()
  WHERE id = enrollment_uuid;

  RETURN v_student_id;
END;
$$;

-- ==============================================================
-- ASMA MULTIPLE COURSE POSTERS & STORAGE RLS PRODUCTION MIGRATION
-- Safe, Idempotent, Non-Destructive Script for Supabase SQL Editor
-- ==============================================================

-- --------------------------------------------------------------
-- 1. TABLE CREATION (Preserves existing data if table exists)
-- --------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.course_posters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tab_label text DEFAULT '',
  title text DEFAULT '',
  description text DEFAULT '',
  image_url text NOT NULL DEFAULT '',
  cta_text text DEFAULT 'Enroll Now',
  cta_link text DEFAULT '',
  badge text DEFAULT 'Admissions Open Now',
  tag text DEFAULT 'NEW BATCH ANNOUNCEMENT',
  status text NOT NULL DEFAULT 'draft',
  is_active boolean NOT NULL DEFAULT true,
  display_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- --------------------------------------------------------------
-- 2. SAFE COLUMN ADDITIONS (Guarantees missing columns never fail)
-- --------------------------------------------------------------
ALTER TABLE public.course_posters ADD COLUMN IF NOT EXISTS tab_label text DEFAULT '';
ALTER TABLE public.course_posters ADD COLUMN IF NOT EXISTS title text DEFAULT '';
ALTER TABLE public.course_posters ADD COLUMN IF NOT EXISTS description text DEFAULT '';
ALTER TABLE public.course_posters ADD COLUMN IF NOT EXISTS image_url text DEFAULT '';
ALTER TABLE public.course_posters ADD COLUMN IF NOT EXISTS cta_text text DEFAULT 'Enroll Now';
ALTER TABLE public.course_posters ADD COLUMN IF NOT EXISTS cta_link text DEFAULT '';
ALTER TABLE public.course_posters ADD COLUMN IF NOT EXISTS badge text DEFAULT 'Admissions Open Now';
ALTER TABLE public.course_posters ADD COLUMN IF NOT EXISTS tag text DEFAULT 'NEW BATCH ANNOUNCEMENT';
ALTER TABLE public.course_posters ADD COLUMN IF NOT EXISTS status text DEFAULT 'draft';
ALTER TABLE public.course_posters ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true;
ALTER TABLE public.course_posters ADD COLUMN IF NOT EXISTS display_order integer DEFAULT 0;
ALTER TABLE public.course_posters ADD COLUMN IF NOT EXISTS created_at timestamp with time zone DEFAULT timezone('utc'::text, now());
ALTER TABLE public.course_posters ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT timezone('utc'::text, now());

-- Ensure default status for new records is 'draft'
ALTER TABLE public.course_posters ALTER COLUMN status SET DEFAULT 'draft';

-- Ensure status check constraint exists safely
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'course_posters_status_check' 
      AND conrelid = 'public.course_posters'::regclass
  ) THEN
    ALTER TABLE public.course_posters 
    ADD CONSTRAINT course_posters_status_check CHECK (status IN ('draft', 'published'));
  END IF;
END $$;

-- --------------------------------------------------------------
-- 3. INDEXING FOR PERFORMANCE
-- --------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_course_posters_public_order 
ON public.course_posters (status, is_active, display_order ASC, created_at DESC);

-- --------------------------------------------------------------
-- 4. ROW LEVEL SECURITY (RLS) FOR course_posters TABLE
-- --------------------------------------------------------------
ALTER TABLE public.course_posters ENABLE ROW LEVEL SECURITY;

-- 4a. Public Access: Visitors can ONLY SELECT published and active posters
DROP POLICY IF EXISTS "Allow public select published posters" ON public.course_posters;
CREATE POLICY "Allow public select published posters"
ON public.course_posters
FOR SELECT
TO anon, authenticated
USING (status = 'published' AND is_active = true);

-- 4b. Admin Full Access: Authorized Admins (verified via public.admins / auth email) have full CRUD
DROP POLICY IF EXISTS "Allow admin all course_posters" ON public.course_posters;
CREATE POLICY "Allow admin all course_posters"
ON public.course_posters
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.admins
    WHERE public.admins.id = auth.uid()
       OR public.admins.email = (auth.jwt() ->> 'email')
  )
  OR (auth.jwt() ->> 'email') = 'admin@asmaonline.in'
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.admins
    WHERE public.admins.id = auth.uid()
       OR public.admins.email = (auth.jwt() ->> 'email')
  )
  OR (auth.jwt() ->> 'email') = 'admin@asmaonline.in'
);

-- --------------------------------------------------------------
-- 5. TABLE GRANTS
-- --------------------------------------------------------------
GRANT SELECT ON public.course_posters TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.course_posters TO authenticated;

-- --------------------------------------------------------------
-- 6. SUPABASE STORAGE BUCKET: course-images (PUBLIC)
-- --------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'course-images',
  'course-images',
  true,
  5242880, -- 5 MB max per poster image
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']
)
ON CONFLICT (id) DO UPDATE SET 
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];

-- --------------------------------------------------------------
-- 7. STORAGE OBJECTS RLS POLICIES (Scoped strictly to course-images / posters/)
-- --------------------------------------------------------------

-- 7a. Public Read: Anyone can view images in course-images bucket
DROP POLICY IF EXISTS "Public can view course-images" ON storage.objects;
CREATE POLICY "Public can view course-images"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'course-images');

-- 7b. Admin Upload: Only authenticated admins can upload to posters/ folder in course-images
DROP POLICY IF EXISTS "Admins can upload course-images posters" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload course-images" ON storage.objects;
CREATE POLICY "Admins can upload course-images posters"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'course-images'
  AND name LIKE 'posters/%'
  AND (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE public.admins.id = auth.uid()
         OR public.admins.email = (auth.jwt() ->> 'email')
    )
    OR (auth.jwt() ->> 'email') = 'admin@asmaonline.in'
  )
);

-- 7c. Admin Update: Only authenticated admins can update posters in course-images
DROP POLICY IF EXISTS "Admins can update course-images posters" ON storage.objects;
DROP POLICY IF EXISTS "Admins can update course-images" ON storage.objects;
CREATE POLICY "Admins can update course-images posters"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'course-images'
  AND name LIKE 'posters/%'
  AND (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE public.admins.id = auth.uid()
         OR public.admins.email = (auth.jwt() ->> 'email')
    )
    OR (auth.jwt() ->> 'email') = 'admin@asmaonline.in'
  )
);

-- 7d. Admin Delete: Only authenticated admins can delete posters from course-images
DROP POLICY IF EXISTS "Admins can delete course-images posters" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete course-images" ON storage.objects;
CREATE POLICY "Admins can delete course-images posters"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'course-images'
  AND name LIKE 'posters/%'
  AND (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE public.admins.id = auth.uid()
         OR public.admins.email = (auth.jwt() ->> 'email')
    )
    OR (auth.jwt() ->> 'email') = 'admin@asmaonline.in'
  )
);

-- --------------------------------------------------------------
-- 8. NOTIFY PostgREST TO RELOAD SCHEMA CACHE IMMEDIATELY
-- --------------------------------------------------------------
NOTIFY pgrst, 'reload schema';

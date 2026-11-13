-- ==============================================================
-- ASMA GALLERY MANAGER & STORAGE RLS PRODUCTION MIGRATION
-- Safe, Idempotent, Non-Destructive Script for Supabase SQL Editor
-- ==============================================================

-- --------------------------------------------------------------
-- 1. TABLE CREATION (Preserves existing data if table exists)
-- --------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.gallery_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL DEFAULT '',
  description text DEFAULT '',
  alt_text text DEFAULT '',
  media_type text NOT NULL DEFAULT 'photo' CHECK (media_type IN ('photo', 'video')),
  url text NOT NULL,
  thumbnail_url text DEFAULT '',
  show_on_homepage boolean NOT NULL DEFAULT false,
  show_on_gallery boolean NOT NULL DEFAULT true,
  homepage_order integer DEFAULT 0,
  gallery_order integer DEFAULT 0,
  orientation text DEFAULT 'landscape' CHECK (orientation IN ('landscape', 'portrait', 'square')),
  status text NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published')),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- --------------------------------------------------------------
-- 2. SAFE COLUMN ADDITIONS (Guarantees missing columns never fail)
-- --------------------------------------------------------------
ALTER TABLE public.gallery_items ADD COLUMN IF NOT EXISTS title text DEFAULT '';
ALTER TABLE public.gallery_items ADD COLUMN IF NOT EXISTS description text DEFAULT '';
ALTER TABLE public.gallery_items ADD COLUMN IF NOT EXISTS alt_text text DEFAULT '';
ALTER TABLE public.gallery_items ADD COLUMN IF NOT EXISTS media_type text DEFAULT 'photo';
ALTER TABLE public.gallery_items ADD COLUMN IF NOT EXISTS url text DEFAULT '';
ALTER TABLE public.gallery_items ADD COLUMN IF NOT EXISTS thumbnail_url text DEFAULT '';
ALTER TABLE public.gallery_items ADD COLUMN IF NOT EXISTS show_on_homepage boolean DEFAULT false;
ALTER TABLE public.gallery_items ADD COLUMN IF NOT EXISTS show_on_gallery boolean DEFAULT true;
ALTER TABLE public.gallery_items ADD COLUMN IF NOT EXISTS homepage_order integer DEFAULT 0;
ALTER TABLE public.gallery_items ADD COLUMN IF NOT EXISTS gallery_order integer DEFAULT 0;
ALTER TABLE public.gallery_items ADD COLUMN IF NOT EXISTS orientation text DEFAULT 'landscape';
ALTER TABLE public.gallery_items ADD COLUMN IF NOT EXISTS status text DEFAULT 'published';
ALTER TABLE public.gallery_items ADD COLUMN IF NOT EXISTS created_at timestamp with time zone DEFAULT timezone('utc'::text, now());
ALTER TABLE public.gallery_items ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT timezone('utc'::text, now());

-- --------------------------------------------------------------
-- 3. INDEXING FOR HIGH-PERFORMANCE PUBLIC QUERIES
-- --------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_gallery_homepage 
ON public.gallery_items (status, show_on_homepage, homepage_order ASC, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_gallery_page 
ON public.gallery_items (status, show_on_gallery, media_type, gallery_order ASC, created_at DESC);

-- --------------------------------------------------------------
-- 4. ROW LEVEL SECURITY (RLS) FOR gallery_items TABLE
-- --------------------------------------------------------------
ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;

-- 4a. Public Access: Visitors can ONLY SELECT published media intended for public display
DROP POLICY IF EXISTS "Allow public select published gallery" ON public.gallery_items;
CREATE POLICY "Allow public select published gallery"
ON public.gallery_items
FOR SELECT
TO anon, authenticated
USING (
  status = 'published' 
  AND (show_on_homepage = true OR show_on_gallery = true)
);

-- 4b. Admin Full Access: Authorized Admins (verified via public.admins / auth email) have full CRUD
DROP POLICY IF EXISTS "Allow admin all gallery_items" ON public.gallery_items;
CREATE POLICY "Allow admin all gallery_items"
ON public.gallery_items
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
GRANT SELECT ON public.gallery_items TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.gallery_items TO authenticated;

-- --------------------------------------------------------------
-- 6. SUPABASE STORAGE BUCKET: course-images (PUBLIC)
-- --------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'course-images',
  'course-images',
  true,
  5242880, -- 5 MB max per upload
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']
)
ON CONFLICT (id) DO UPDATE SET 
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];

-- --------------------------------------------------------------
-- 7. STORAGE OBJECTS RLS POLICIES FOR gallery/ FOLDER
-- --------------------------------------------------------------

-- 7a. Public Read: Anyone can view gallery images in course-images bucket
DROP POLICY IF EXISTS "Public can view gallery images" ON storage.objects;
CREATE POLICY "Public can view gallery images"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'course-images');

-- 7b. Admin Upload: Only authenticated admins can upload to gallery/ in course-images
DROP POLICY IF EXISTS "Admins can upload gallery images" ON storage.objects;
CREATE POLICY "Admins can upload gallery images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'course-images'
  AND (name LIKE 'gallery/%' OR name LIKE 'posters/%' OR name NOT LIKE '%/%')
  AND (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE public.admins.id = auth.uid()
         OR public.admins.email = (auth.jwt() ->> 'email')
    )
    OR (auth.jwt() ->> 'email') = 'admin@asmaonline.in'
  )
);

-- 7c. Admin Update: Only authenticated admins can update gallery images in course-images
DROP POLICY IF EXISTS "Admins can update gallery images" ON storage.objects;
CREATE POLICY "Admins can update gallery images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'course-images'
  AND (name LIKE 'gallery/%' OR name LIKE 'posters/%' OR name NOT LIKE '%/%')
  AND (
    EXISTS (
      SELECT 1 FROM public.admins
      WHERE public.admins.id = auth.uid()
         OR public.admins.email = (auth.jwt() ->> 'email')
    )
    OR (auth.jwt() ->> 'email') = 'admin@asmaonline.in'
  )
);

-- 7d. Admin Delete: Only authenticated admins can delete gallery images from course-images
DROP POLICY IF EXISTS "Admins can delete gallery images" ON storage.objects;
CREATE POLICY "Admins can delete gallery images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'course-images'
  AND (name LIKE 'gallery/%' OR name LIKE 'posters/%' OR name NOT LIKE '%/%')
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
-- 8. INITIAL SEED (Authentic ASMA Media - Safe & Idempotent)
-- --------------------------------------------------------------

-- Seed Homepage Approved Photos (Slots 0 to 6)
INSERT INTO public.gallery_items (title, description, alt_text, url, media_type, orientation, show_on_homepage, show_on_gallery, homepage_order, gallery_order, status)
SELECT 'Student Classroom', 'Our dedicated students focusing during intense trading sessions.', 'Students attending practical market training in ASMA Nagpur classroom', '/Home/new2.webp', 'photo', 'landscape', true, true, 0, 4, 'published'
WHERE NOT EXISTS (SELECT 1 FROM public.gallery_items WHERE url = '/Home/new2.webp');

INSERT INTO public.gallery_items (title, description, alt_text, url, media_type, orientation, show_on_homepage, show_on_gallery, homepage_order, gallery_order, status)
SELECT 'Faculty Mentorship', 'Guidance from our lead mentor on the trading floor.', 'Expert mentor guiding students on live price action trading setups', '/Home/new3.webp', 'photo', 'landscape', true, true, 1, 5, 'published'
WHERE NOT EXISTS (SELECT 1 FROM public.gallery_items WHERE url = '/Home/new3.webp');

INSERT INTO public.gallery_items (title, description, alt_text, url, media_type, orientation, show_on_homepage, show_on_gallery, homepage_order, gallery_order, status)
SELECT 'Interactive Discussions', 'Group discussions and doubt clearing sessions with faculty.', 'Interactive trading doubt resolution session at Advait Academy', '/Home/new5.webp', 'photo', 'landscape', true, true, 2, 8, 'published'
WHERE NOT EXISTS (SELECT 1 FROM public.gallery_items WHERE url = '/Home/new5.webp');

INSERT INTO public.gallery_items (title, description, alt_text, url, media_type, orientation, show_on_homepage, show_on_gallery, homepage_order, gallery_order, status)
SELECT 'Live Trading Floor', 'Experience the pulse of the market in our state-of-the-art facility.', 'ASMA state of the art live trading floor and multi monitor setups', '/Home/1.webp', 'photo', 'landscape', true, true, 3, 9, 'published'
WHERE NOT EXISTS (SELECT 1 FROM public.gallery_items WHERE url = '/Home/1.webp');

INSERT INTO public.gallery_items (title, description, alt_text, url, media_type, orientation, show_on_homepage, show_on_gallery, homepage_order, gallery_order, status)
SELECT 'Mentorship Sessions', 'Get one-on-one guidance from experienced market professionals.', 'One on one personalized trade counseling session in Nagpur campus', '/Home/2.webp', 'photo', 'landscape', true, true, 4, 10, 'published'
WHERE NOT EXISTS (SELECT 1 FROM public.gallery_items WHERE url = '/Home/2.webp');

INSERT INTO public.gallery_items (title, description, alt_text, url, media_type, orientation, show_on_homepage, show_on_gallery, homepage_order, gallery_order, status)
SELECT 'Analysis Workshops', 'Deep dive with chart analysis and fundamental data.', 'Chart pattern and candlestick analysis workshop at ASMA', '/Home/3.webp', 'photo', 'landscape', true, true, 5, 11, 'published'
WHERE NOT EXISTS (SELECT 1 FROM public.gallery_items WHERE url = '/Home/3.webp');

INSERT INTO public.gallery_items (title, description, alt_text, url, media_type, orientation, show_on_homepage, show_on_gallery, homepage_order, gallery_order, status)
SELECT 'Student Community', 'Collaborate, learn, and grow your wealth together.', 'ASMA trader community collaborating and discussing market strategies', '/Home/4.webp', 'photo', 'landscape', true, true, 6, 12, 'published'
WHERE NOT EXISTS (SELECT 1 FROM public.gallery_items WHERE url = '/Home/4.webp');

-- Seed High Impact Studio & Portrait Photos
INSERT INTO public.gallery_items (title, description, alt_text, url, media_type, orientation, show_on_homepage, show_on_gallery, homepage_order, gallery_order, status)
SELECT 'Founder Podcast Session', 'Exclusive interview and trading mindset session with ASMA founder Prof. Satish A. Bobade.', 'ASMA founder Prof. Satish A. Bobade during a trading psychology podcast interview', '/new photos/podcast-founder-portrait.webp', 'photo', 'portrait', false, true, 7, 0, 'published'
WHERE NOT EXISTS (SELECT 1 FROM public.gallery_items WHERE url = '/new photos/podcast-founder-portrait.webp');

INSERT INTO public.gallery_items (title, description, alt_text, url, media_type, orientation, show_on_homepage, show_on_gallery, homepage_order, gallery_order, status)
SELECT 'Behind the Scenes Studio', 'Inside our media recording studio capturing in-depth market strategies and mentoring sessions.', 'ASMA recording studio behind the scenes for stock market education podcasts', '/new photos/podcast-studio-behind-scenes.webp', 'photo', 'portrait', false, true, 8, 1, 'published'
WHERE NOT EXISTS (SELECT 1 FROM public.gallery_items WHERE url = '/new photos/podcast-studio-behind-scenes.webp');

-- Seed Core Videos
INSERT INTO public.gallery_items (title, description, alt_text, url, media_type, orientation, show_on_homepage, show_on_gallery, homepage_order, gallery_order, status)
SELECT 'Market Insights Podcast', 'Behind the scenes of our exclusive market strategy and trader mindset podcast session.', 'Video of market insights podcast with mentor at ASMA studio', '/videos/podcast-session-compressed.mp4', 'video', 'portrait', false, true, 9, 2, 'published'
WHERE NOT EXISTS (SELECT 1 FROM public.gallery_items WHERE url = '/videos/podcast-session-compressed.mp4');

INSERT INTO public.gallery_items (title, description, alt_text, url, media_type, orientation, show_on_homepage, show_on_gallery, homepage_order, gallery_order, status)
SELECT 'Live Market Experience', 'Experience the pulse of live trading on our Nagpur trading floor.', 'Live trading floor video showing students executing orders in real time', '/videos/ANUJ9211.MP4', 'video', 'landscape', false, true, 10, 3, 'published'
WHERE NOT EXISTS (SELECT 1 FROM public.gallery_items WHERE url = '/videos/ANUJ9211.MP4');

-- --------------------------------------------------------------
-- 9. NOTIFY PostgREST TO RELOAD SCHEMA CACHE IMMEDIATELY
-- --------------------------------------------------------------
NOTIFY pgrst, 'reload schema';


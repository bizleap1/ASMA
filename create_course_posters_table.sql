-- ==============================================================
-- ASMA MULTIPLE COURSE POSTERS MANAGEMENT & RLS SETUP SCRIPT
-- Run this in Supabase Dashboard -> SQL Editor
-- ==============================================================

-- 1. Create course_posters table
CREATE TABLE IF NOT EXISTS public.course_posters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tab_label text DEFAULT '',
  title text DEFAULT '',
  description text DEFAULT '',
  image_url text NOT NULL,
  cta_text text DEFAULT 'Enroll Now',
  cta_link text DEFAULT '',
  badge text DEFAULT 'Admissions Open Now',
  tag text DEFAULT 'NEW BATCH ANNOUNCEMENT',
  start_date timestamp with time zone,
  expiry_date timestamp with time zone,
  status text NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published')),
  is_active boolean NOT NULL DEFAULT true,
  display_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Ensure tab_label exists if table was previously created
ALTER TABLE public.course_posters ADD COLUMN IF NOT EXISTS tab_label text DEFAULT '';
ALTER TABLE public.course_posters ADD COLUMN IF NOT EXISTS display_order integer DEFAULT 0;

-- 2. Create index for fast public queries sorted by display_order
CREATE INDEX IF NOT EXISTS idx_course_posters_status_order 
ON public.course_posters (status, is_active, display_order ASC, created_at DESC);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.course_posters ENABLE ROW LEVEL SECURITY;

-- 4. Policy: Allow public (anon & authenticated) to read published active posters
DROP POLICY IF EXISTS "Allow public select published posters" ON public.course_posters;
CREATE POLICY "Allow public select published posters"
ON public.course_posters
FOR SELECT
TO anon, authenticated
USING (status = 'published' AND is_active = true);

-- 5. Policy: Allow Admins full access (SELECT, INSERT, UPDATE, DELETE)
DROP POLICY IF EXISTS "Allow admin all course_posters" ON public.course_posters;
CREATE POLICY "Allow admin all course_posters"
ON public.course_posters
FOR ALL
TO authenticated
USING (
  auth.jwt() ->> 'email' IN (SELECT email FROM public.admins)
  OR auth.jwt() ->> 'email' = 'admin@asmaonline.in'
)
WITH CHECK (
  auth.jwt() ->> 'email' IN (SELECT email FROM public.admins)
  OR auth.jwt() ->> 'email' = 'admin@asmaonline.in'
);

-- 6. Insert initial academy posters if table is empty
INSERT INTO public.course_posters (
  tab_label,
  title,
  description,
  image_url,
  cta_text,
  cta_link,
  badge,
  tag,
  status,
  is_active,
  display_order
)
SELECT 
  'Batch 20 Nov',
  'New Stock Market Batch Starting 20th November',
  'Join our comprehensive stock market training batch starting 20th November. Master practical market learning, price action, options strategies, live market exposure, and disciplined risk management with guidance by experienced mentors.',
  '/poster_batch_20_nov.webp',
  'Enroll for 20 Nov Batch',
  'https://wa.me/919156953895?text=Hi%20Advait%20Academy!%20I%20want%20to%20inquire%20about%20the%2020%20Nov%20batch.',
  'Admissions Open Now',
  'NEW BATCH ANNOUNCEMENT',
  'published',
  true,
  0
WHERE NOT EXISTS (SELECT 1 FROM public.course_posters LIMIT 1);

INSERT INTO public.course_posters (
  tab_label,
  title,
  description,
  image_url,
  cta_text,
  cta_link,
  badge,
  tag,
  status,
  is_active,
  display_order
)
SELECT 
  'Demo 17 Nov',
  'Free Demo Class – 17th November (11 A.M. Onwards)',
  'Attend our complimentary live demo session on 17th November from 11 A.M. onwards. Experience live market dynamics, practical market analysis, and chart interpretation before enrolling.',
  '/poster_demo_17_nov.webp',
  'Book Free Demo (17 Nov)',
  'https://wa.me/919156953895?text=Hi%20Advait%20Academy!%20I%20want%20to%20book%20the%20free%20demo%20on%2017%20Nov.',
  'Admissions Open Now',
  'FREE DEMO CLASS',
  'published',
  true,
  1
WHERE NOT EXISTS (SELECT 1 FROM public.course_posters WHERE tab_label = 'Demo 17 Nov');

INSERT INTO public.course_posters (
  tab_label,
  title,
  description,
  image_url,
  cta_text,
  cta_link,
  badge,
  tag,
  status,
  is_active,
  display_order
)
SELECT 
  'Demo 18 Nov',
  'ASMA Presents Demo Class – 18th November (11 A.M. Onwards)',
  'Discover how professional mentors analyze price movements in real time. Join the 18th November demo session to understand our structured curriculum and live floor trading methodology.',
  '/poster_demo_18_nov.webp',
  'Book Free Demo (18 Nov)',
  'https://wa.me/919156953895?text=Hi%20Advait%20Academy!%20I%20want%20to%20book%20the%20free%20demo%20on%2018%20Nov.',
  'Admissions Open Now',
  'FREE DEMO CLASS',
  'published',
  true,
  2
WHERE NOT EXISTS (SELECT 1 FROM public.course_posters WHERE tab_label = 'Demo 18 Nov');

-- 7. Notify PostgREST to instantly reload schema cache
NOTIFY pgrst, 'reload schema';


import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Parse .env manually
const envContent = fs.readFileSync(path.resolve(process.cwd(), '.env'), 'utf-8');
const env = {};
envContent.split('\n').forEach(line => {
  if (line && line.includes('=')) {
    const [key, ...vals] = line.split('=');
    env[key.trim()] = vals.join('=').trim().replace(/['"\r]/g, '');
  }
});

const supabaseUrl = env['VITE_SUPABASE_URL'];
const supabaseKey = env['VITE_SUPABASE_ANON_KEY'];

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  console.log("=== QA CHECK START ===");
  
  // 1. Check Courses
  const { data: courses, error: courseErr } = await supabase.from('courses').select('slug, title, is_active');
  if (courseErr) {
    console.error("Course Error:", courseErr.message);
  } else {
    console.log("Total courses:", courses.length);
    courses.forEach(c => {
      console.log(`- Title: ${c.title} (slug: ${c.slug}, active: ${c.is_active})`);
    });
  }

  console.log("=== QA CHECK END ===");
}
run();

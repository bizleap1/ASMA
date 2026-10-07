import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.log("Missing Supabase credentials in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTable(tableName) {
  console.log(`Checking table: ${tableName}`);
  const { data, error } = await supabase.from(tableName).select('*').limit(1);
  if (error) {
    if (error.code === '42P01') {
      console.log(`- Table ${tableName} does not exist.`);
    } else {
      console.log(`- Error accessing ${tableName}: ${error.message} (Code: ${error.code})`);
    }
    return false;
  }
  console.log(`- Table ${tableName} exists. Row count returned: ${data.length}`);
  return true;
}

async function run() {
  await checkTable('courses');
  await checkTable('notes');
  await checkTable('enrollments');
  await checkTable('visitors');
  await checkTable('admins');
}

run();

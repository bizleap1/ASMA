import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
  const { data, error } = await supabase.from('admins').select('*').limit(1);
  if (error) {
    console.error("Error fetching admins:", error);
  } else {
    console.log("Admins query returned data:", data);
    if (data.length > 0) {
      console.log("Columns:", Object.keys(data[0]));
    } else {
      console.log("Table is empty.");
      // Force an error to get hints about schema
      const { error: insertError } = await supabase.from('admins').insert([{ this_column_does_not_exist: 'test' }]);
      console.log("Insert error (for schema info):", insertError);
    }
  }
}

checkSchema();

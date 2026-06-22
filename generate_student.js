import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read environment variables manually since we aren't using Vite here
const envPath = path.resolve(__dirname, '.env');
const envFile = fs.readFileSync(envPath, 'utf8');

let supabaseUrl = '';
let supabaseAnonKey = '';

envFile.split('\n').forEach(line => {
  const [key, ...values] = line.split('=');
  const value = values.join('=').replace(/^"/, '').replace(/"$/, '').trim();
  if (key === 'VITE_SUPABASE_URL') supabaseUrl = value;
  if (key === 'VITE_SUPABASE_ANON_KEY') supabaseAnonKey = value;
});

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Error: Could not find VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log("=========================================");
console.log("   Student Account Generator Tool");
console.log("=========================================\n");

rl.question('Enter student email: ', (email) => {
  rl.question('Enter student password: ', async (password) => {
    
    console.log('\nCreating account...');
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      console.error('\n❌ Failed to create account:');
      console.error(error.message);
    } else {
      console.log('\n✅ Account successfully created!');
      console.log('-----------------------------------------');
      console.log(`Email:    ${email}`);
      console.log(`Password: ${password}`);
      console.log('-----------------------------------------');
      console.log('Please securely share these credentials with the student.');
    }

    rl.close();
  });
});

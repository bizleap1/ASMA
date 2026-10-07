import { createClient } from '@supabase/supabase-js';

// We use an absolute proxy URL to bypass ISP blocking of supabase.co domains (common on some Indian ISPs like Jio)
const supabaseUrl = typeof window !== 'undefined' ? `${window.location.origin}/supabase-api` : 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder_anon_key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

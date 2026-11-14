import { createClient } from '@supabase/supabase-js';

// On localhost, connect directly to Supabase cloud URL to avoid proxy dropouts/reloads.
// On live production domain, use /supabase-api rewrite to bypass Indian ISP (Jio/Airtel) blocks.
const isLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
const envSupabaseUrl = import.meta.env.VITE_SUPABASE_URL;

const supabaseUrl = isLocal && envSupabaseUrl
  ? envSupabaseUrl
  : (typeof window !== 'undefined' ? `${window.location.origin}/supabase-api` : (envSupabaseUrl || 'https://placeholder.supabase.co'));

const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder_anon_key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

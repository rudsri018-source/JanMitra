import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL || '') as string;
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '') as string;

// Strictly check for valid HTTP/HTTPS URL and non-placeholder, non-undefined string inputs
export const isSupabaseConfigured = 
  typeof supabaseUrl === 'string' &&
  supabaseUrl.trim() !== '' &&
  supabaseUrl !== 'undefined' &&
  supabaseUrl !== 'null' &&
  (supabaseUrl.startsWith('http://') || supabaseUrl.startsWith('https://')) &&
  typeof supabaseAnonKey === 'string' &&
  supabaseAnonKey.trim() !== '' &&
  supabaseAnonKey !== 'undefined' &&
  supabaseAnonKey !== 'null';

// Use a valid HTTPS URL format and a correctly structured JWT format anon key for the placeholder fallback
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : createClient('https://placeholder-url-for-janmitra.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTc0MDk5OTk5OSwiZXhwIjoyMDQwOTk5OTk5fQ.placeholder', {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    });

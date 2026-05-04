import { createClient } from '@supabase/supabase-js';
 
// These come from your .env file (VITE_ prefix makes them available in browser)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
 
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

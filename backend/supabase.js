import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();
export const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // NOT service role
);
if (!supabase){
  console.warn('Supabase client failed to initialize. Check your .env file.');
}else {
  console.log('Supabase client initialized successfully.');
}



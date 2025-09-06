import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Validamos que las variables de entorno existan
if (!supabaseUrl || !supabaseAnonKey || !supabaseRoleKey) {
  throw new Error('No variables.');
}
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

// Cliente para operaciones del servidor (con service role key)
export const supabaseAdmin = createClient(supabaseUrl, supabaseRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

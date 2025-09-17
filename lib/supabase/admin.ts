import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Validamos que las variables de entorno existan
if (!supabaseUrl || !supabaseRoleKey) {
  throw new Error(
    'Supabase URL and Service Role Key are required for admin operations.'
  );
}

// Cliente para operaciones del servidor (con service role key)
export const supabaseAdmin = createClient(supabaseUrl, supabaseRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

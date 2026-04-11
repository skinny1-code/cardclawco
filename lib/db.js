import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const serviceKey  = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY
const anonKey     = process.env.SUPABASE_ANON_KEY

if (!supabaseUrl || !serviceKey) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_KEY')
}

// Server-side client — service key bypasses RLS (safe: server-only, never client-exposed)
// Falls back to anon key if service key not yet configured in environment
export const db = createClient(supabaseUrl, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
})

export const dbPublic = createClient(supabaseUrl, anonKey || serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
})

export async function rpc(fn, params = {}) {
  const { data, error } = await db.rpc(fn, params)
  if (error) throw new Error(error.message)
  if (data?.error) throw Object.assign(new Error(data.error), { status: 400 })
  return data
}

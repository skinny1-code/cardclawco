import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing SUPABASE_URL or SUPABASE_ANON_KEY')
}

// All auth is verified at the API layer via Clerk JWT middleware
// before any DB call is made — so anon key is safe here
export const db = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false, autoRefreshToken: false },
})

export async function rpc(fn, params = {}) {
  const { data, error } = await db.rpc(fn, params)
  if (error) throw new Error(error.message)
  if (data?.error) throw Object.assign(new Error(data.error), { status: 400 })
  return data
}

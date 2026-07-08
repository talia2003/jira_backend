import { getSupabase } from './supabaseAdmin'

export async function getUserId(request: Request): Promise<string> {
  // Legacy/dev support: allow explicitly passing a user id.
  const legacyUserId = request.headers.get('x-user-id')
  if (legacyUserId) return legacyUserId

  const auth = request.headers.get('authorization') ?? request.headers.get('Authorization')
  const token = auth?.startsWith('Bearer ') ? auth.slice('Bearer '.length).trim() : null
  if (!token) {
    throw new Error('User ID is required')
  }

  const supabase = getSupabase()
  const { data, error } = await supabase.auth.getUser(token)
  if (error || !data?.user?.id) {
    throw new Error('Invalid or expired session')
  }

  return data.user.id
}
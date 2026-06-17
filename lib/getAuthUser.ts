import { createClient } from "@supabase/supabase-js";

export async function getAuthUser(request: Request) {
    const authHeader = request.headers.get('Authorization');
    if(!authHeader?.startsWith('Bearer ')) {
        return { user: null, error: 'Missing or invalid Authorization header'}
    }

    const token  = authHeader?.slice('Bearer '.length)

    const url = process.env.SUPABASE_URL
    const anonKey = process.env.SUPABASE_ANON_KEY

    if (!url || !anonKey) {
        throw new Error('Missing SUPABASE_URL or SUPABASE_ANON_KEY')
    }

    // Use anon key + user's JWT
    const supabase = createClient(url, anonKey, {
        auth: { autoRefreshToken: false, persistSession: false }
    })
    const {data, error} = await supabase.auth.getUser(token)

    if(error || !data.user) {
        return { user: null, error: error?.message || 'Invalid token'}
    }
    return { user: data.user, error: null}
}
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { createProfile } from '@/lib/supabase/database'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const origin = requestUrl.origin

  if (code) {
    const supabase = await createClient()

    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.user) {
      // Check if profile exists, if not create one
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', data.user.id)
        .single()

      if (!profile) {
        // Create profile for new OAuth user
        try {
          await createProfile(data.user.email || '', data.user.user_metadata?.full_name)
        } catch (profileError) {
          console.error('Error creating profile:', profileError)
        }
      }
    }
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(`${origin}/`)
}

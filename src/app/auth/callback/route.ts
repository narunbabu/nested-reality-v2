import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { redirect } from 'next/navigation'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // Check if user exists in database, create if not
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        // Check if user record exists
        const { data: existingUser } = await supabase
          .from('users')
          .select('id')
          .eq('id', user.id)
          .single()

        // Create user record if it doesn't exist
        if (!existingUser) {
          const { error: insertError } = await supabase
            .from('users')
            .insert({
              id: user.id,
              email: user.email!,
              username: user.user_metadata?.full_name?.replace(/\s+/g, '').toLowerCase() || user.email?.split('@')[0],
              full_name: user.user_metadata?.full_name || user.user_metadata?.name || null,
              avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture || null,
              role: 'user',
              is_verified: true, // OAuth users are pre-verified
            })

          if (insertError) {
            console.error('Error creating user record:', insertError)
          }
        }
      }

      redirect(next)
    }
  }

  // Return the user to an error page with instructions
  redirect('/login?error=auth_callback_error')
}

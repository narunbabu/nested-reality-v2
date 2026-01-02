import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { ApiResponse } from '@/types';

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { email, password, username, full_name } = await request.json()

    // Validate input
    if (!email || !password) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Email and password are required'
      }, { status: 400 })
    }

    // Register user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          full_name,
        }
      }
    })

    if (authError) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: authError.message
      }, { status: 400 })
    }

    // Create user record in users table
    if (authData.user) {
      const { error: dbError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          email,
          username: username || null,
          full_name: full_name || null,
          role: 'user',
          is_verified: false,
        })

      if (dbError) {
        console.error('Error creating user record:', dbError)
      }
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        user: authData.user,
        message: 'Registration successful. Please check your email to verify your account.'
      }
    })

  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}

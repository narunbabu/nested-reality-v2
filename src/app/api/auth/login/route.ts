import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { ApiResponse } from '@/types';

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { email, password } = await request.json()

    // Validate input
    if (!email || !password) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Email and password are required'
      }, { status: 400 })
    }

    // Sign in user
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: error.message
      }, { status: 401 })
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        user: data.user,
        session: data.session
      },
      message: 'Login successful'
    })

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}

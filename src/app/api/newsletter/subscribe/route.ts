import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { ApiResponse } from '@/types';

interface ConvertKitResponse {
  subscription: {
    id: number;
    state: string;
    created_at: string;
    source: string | null;
    referrer: string | null;
    subscribable_id: number;
    subscribable_type: string;
    subscriber: {
      id: number;
      email_address: string;
      state: string;
      created_at: string;
    };
  };
}

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Email is required'
      }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Invalid email format'
      }, { status: 400 })
    }

    const supabase = await createClient()

    // Check if subscriber already exists in database
    const { data: existingSubscriber } = await supabase
      .from('newsletter_subscribers')
      .select('id, email, status')
      .eq('email', email.toLowerCase())
      .single()

    if (existingSubscriber && existingSubscriber.status === 'active') {
      return NextResponse.json<ApiResponse>({
        success: true,
        message: 'You are already subscribed to the newsletter'
      })
    }

    // ConvertKit API integration
    const CONVERTKIT_API_KEY = process.env.CONVERTKIT_API_KEY
    const CONVERTKIT_FORM_ID = process.env.CONVERTKIT_FORM_ID

    let convertKitData = null
    let convertKitError = null

    if (CONVERTKIT_API_KEY && CONVERTKIT_FORM_ID) {
      try {
        const ckResponse = await fetch(
          `https://api.convertkit.com/v3/forms/${CONVERTKIT_FORM_ID}/subscribe`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              api_key: CONVERTKIT_API_KEY,
              email: email,
            }),
          }
        )

        convertKitData = await ckResponse.json()

        if (!ckResponse.ok) {
          convertKitError = convertKitData?.error || 'ConvertKit API error'
          console.error('ConvertKit error:', convertKitError)
        }
      } catch (error) {
        convertKitError = 'Failed to connect to ConvertKit'
        console.error('ConvertKit fetch error:', error)
      }
    }

    // Store or update subscriber in database
    const { error: dbError } = await supabase
      .from('newsletter_subscribers')
      .upsert({
        email: email.toLowerCase(),
        status: convertKitError ? 'pending' : 'active',
        convertkit_subscriber_id: convertKitData?.subscription?.subscriber?.id || null,
        subscribed_at: new Date().toISOString(),
      })

    if (dbError) {
      console.error('Database error:', dbError)
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Failed to store subscription'
      }, { status: 500 })
    }

    // Return success response
    return NextResponse.json<ApiResponse>({
      success: true,
      message: convertKitError
        ? 'Subscription recorded. Please check your email to confirm.'
        : 'Successfully subscribed! Please check your email to confirm.',
      data: {
        email,
        convertKitStatus: convertKitError ? 'error' : 'success',
      }
    })

  } catch (error) {
    console.error('Newsletter subscription error:', error)
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}

import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { ApiResponse } from '@/types';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    const { id } = await params

    const { data: review, error } = await supabase
      .from('reviews')
      .select('*, user:users(username, full_name, avatar_url)')
      .eq('id', id)
      .single()

    if (error) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Review not found'
      }, { status: 404 })
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: review
    })

  } catch (error) {
    console.error('Get review error:', error)
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    const { id } = await params

    // Check authentication
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Authentication required'
      }, { status: 401 })
    }

    // Check ownership or admin
    const { data: existingReview } = await supabase
      .from('reviews')
      .select('user_id')
      .eq('id', id)
      .single()

    if (!existingReview) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Review not found'
      }, { status: 404 })
    }

    if (existingReview.user_id !== user.id) {
      // Check if user is admin
      const { data: userData } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single()

      if (userData?.role !== 'admin') {
        return NextResponse.json<ApiResponse>({
          success: false,
          error: 'Permission denied'
        }, { status: 403 })
      }
    }

    const { rating, title, content } = await request.json()

    // Update review
    const { data: review, error } = await supabase
      .from('reviews')
      .update({
        rating,
        title: title || null,
        content,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: error.message
      }, { status: 400 })
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: review,
      message: 'Review updated successfully'
    })

  } catch (error) {
    console.error('Update review error:', error)
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    const { id } = await params

    // Check authentication
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Authentication required'
      }, { status: 401 })
    }

    // Check ownership or admin
    const { data: existingReview } = await supabase
      .from('reviews')
      .select('user_id')
      .eq('id', id)
      .single()

    if (!existingReview) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Review not found'
      }, { status: 404 })
    }

    if (existingReview.user_id !== user.id) {
      // Check if user is admin
      const { data: userData } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single()

      if (userData?.role !== 'admin') {
        return NextResponse.json<ApiResponse>({
          success: false,
          error: 'Permission denied'
        }, { status: 403 })
      }
    }

    // Delete review
    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', id)

    if (error) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: error.message
      }, { status: 400 })
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      message: 'Review deleted successfully'
    })

  } catch (error) {
    console.error('Delete review error:', error)
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}

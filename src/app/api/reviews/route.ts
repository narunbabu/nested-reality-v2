import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { ApiResponse, PaginatedResponse, DatabaseReview } from '@/types';

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)

    // Parse query parameters
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const sortBy = searchParams.get('sort') || 'created_at'
    const order = searchParams.get('order') || 'desc'
    const rating = searchParams.get('rating')
    const featured = searchParams.get('featured')
    const userId = searchParams.get('user_id')

    // Build query
    let query = supabase
      .from('reviews')
      .select('*, user:users(username, full_name, avatar_url)')

    // If filtering by user_id, don't filter by is_approved (show all user's reviews)
    // Otherwise, only show approved reviews
    if (!userId) {
      query = query.eq('is_approved', true)
    }

    // Apply filters
    if (userId) {
      query = query.eq('user_id', userId)
    }
    if (rating) {
      query = query.eq('rating', parseInt(rating))
    }
    if (featured === 'true') {
      query = query.eq('is_featured', true)
    }

    // Calculate pagination
    const start = (page - 1) * limit
    const end = start + limit - 1

    // Get total count
    const { count } = await query
    .clone()
    .select('*', { count: 'exact', head: true })

    // Get paginated results
    const { data: reviews, error } = await query
      .order(sortBy as keyof DatabaseReview, { ascending: order === 'asc' })
      .range(start, end)

    if (error) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: error.message
      }, { status: 400 })
    }

    return NextResponse.json<ApiResponse<PaginatedResponse<DatabaseReview>>>({
      success: true,
      data: {
        data: reviews || [],
        pagination: {
          page,
          limit,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / limit)
        }
      }
    })

  } catch (error) {
    console.error('Get reviews error:', error)
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    // Check authentication
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Authentication required'
      }, { status: 401 })
    }

    const { rating, title, content } = await request.json()

    // Validate input
    if (!rating || !content) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Rating and content are required'
      }, { status: 400 })
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Rating must be between 1 and 5'
      }, { status: 400 })
    }

    // Create review
    const { data: review, error } = await supabase
      .from('reviews')
      .insert({
        user_id: user.id,
        book_id: 'nested-reality',
        rating,
        title: title || null,
        content,
        moderation_status: 'pending',
        is_approved: false,
      })
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
      message: 'Review submitted successfully and pending moderation'
    }, { status: 201 })

  } catch (error) {
    console.error('Create review error:', error)
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}

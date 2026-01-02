import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { ApiResponse, PaginatedResponse, DatabaseEssay } from '@/types';

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)

    // Parse query parameters
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const sortBy = searchParams.get('sort') || 'created_at'
    const order = searchParams.get('order') || 'desc'
    const category = searchParams.get('category')
    const tag = searchParams.get('tag')
    const authorId = searchParams.get('author_id')
    const published = searchParams.get('published')

    // Build query
    let query = supabase
      .from('essays')
      .select('*, user:users(username, full_name, avatar_url)', { count: 'exact' })

    // Filter by published status (default to true for public view)
    if (published !== 'false') {
      query = query.eq('is_published', true).eq('is_approved', true)
    }

    // Apply filters
    if (category) {
      query = query.eq('category', category)
    }
    if (tag) {
      query = query.contains('tags', [tag])
    }
    if (authorId) {
      query = query.eq('user_id', authorId)
    }

    // Calculate pagination
    const start = (page - 1) * limit
    const end = start + limit - 1

    // Get paginated results
    const { data: essays, error, count } = await query
      .order(sortBy as keyof DatabaseEssay, { ascending: order === 'asc' })
      .range(start, end)

    if (error) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: error.message
      }, { status: 400 })
    }

    return NextResponse.json<ApiResponse<PaginatedResponse<DatabaseEssay>>>({
      success: true,
      data: {
        data: essays || [],
        pagination: {
          page,
          limit,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / limit)
        }
      }
    })

  } catch (error) {
    console.error('Get essays error:', error)
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

    const {
      title,
      excerpt,
      content,
      category,
      tags,
      featured_image,
      images,
      word_count,
      read_time_minutes
    } = await request.json()

    // Validate input
    if (!title || !content) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Title and content are required'
      }, { status: 400 })
    }

    if (title.length > 300) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Title must be less than 300 characters'
      }, { status: 400 })
    }

    // Create essay
    const { data: essay, error } = await supabase
      .from('essays')
      .insert({
        user_id: user.id,
        title,
        excerpt: excerpt || null,
        content,
        category: category || null,
        tags: tags || null,
        featured_image: featured_image || null,
        word_count: word_count || null,
        read_time_minutes: read_time_minutes || null,
        is_published: true, // Auto-publish
        is_approved: true, // Auto-approve
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
      data: essay,
      message: 'Essay published successfully!'
    }, { status: 201 })

  } catch (error) {
    console.error('Create essay error:', error)
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}

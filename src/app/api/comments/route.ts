import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { ApiResponse } from '@/types';

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)

    const parentType = searchParams.get('parent_type')
    const parentId = searchParams.get('parent_id')

    if (!parentType || !parentId) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'parent_type and parent_id are required'
      }, { status: 400 })
    }

    // Get comments with user info
    const { data: comments, error } = await supabase
      .from('comments')
      .select('*, user:users(id, username, full_name, avatar_url)')
      .eq('parent_type', parentType)
      .eq('parent_id', parentId)
      .eq('is_approved', true)
      .order('created_at', { ascending: true })

    if (error) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: error.message
      }, { status: 400 })
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: comments || []
    })

  } catch (error) {
    console.error('Get comments error:', error)
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

    const { parent_type, parent_id, content } = await request.json()

    // Validate input
    if (!parent_type || !parent_id || !content) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'parent_type, parent_id, and content are required'
      }, { status: 400 })
    }

    if (!['essay', 'review', 'comment'].includes(parent_type)) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Invalid parent_type. Must be "essay", "review", or "comment"'
      }, { status: 400 })
    }

    if (content.trim().length < 3) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Comment must be at least 3 characters'
      }, { status: 400 })
    }

    // Create comment (auto-approved for now, can add moderation later)
    const { data: comment, error } = await supabase
      .from('comments')
      .insert({
        user_id: user.id,
        parent_type,
        parent_id,
        content: content.trim(),
        is_approved: true, // Auto-approve (change to false for moderation)
      })
      .select('*, user:users(id, username, full_name, avatar_url)')
      .single()

    if (error) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: error.message
      }, { status: 400 })
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: comment,
      message: 'Comment posted successfully'
    }, { status: 201 })

  } catch (error) {
    console.error('Create comment error:', error)
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}

import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { ApiResponse } from '@/types';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient()

    const { data: essay, error } = await supabase
      .from('essays')
      .select('*, user:users(id, username, full_name, avatar_url, bio)')
      .eq('id', id)
      .single()

    if (error || !essay) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Essay not found'
      }, { status: 404 })
    }

    // Increment view count
    await supabase
      .from('essays')
      .update({ view_count: (essay.view_count || 0) + 1 })
      .eq('id', id)

    return NextResponse.json<ApiResponse>({
      success: true,
      data: essay
    })

  } catch (error) {
    console.error('Get essay error:', error)
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
    const { id } = await params;
    const supabase = await createClient()

    // Check authentication
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Authentication required'
      }, { status: 401 })
    }

    // Get existing essay
    const { data: existingEssay, error: fetchError } = await supabase
      .from('essays')
      .select('user_id')
      .eq('id', id)
      .single()

    if (fetchError || !existingEssay) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Essay not found'
      }, { status: 404 })
    }

    // Check ownership
    if (existingEssay.user_id !== user.id) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'You can only edit your own essays'
      }, { status: 403 })
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

    // Update essay
    const { data: essay, error } = await supabase
      .from('essays')
      .update({
        title,
        excerpt: excerpt || null,
        content,
        category: category || null,
        tags: tags || null,
        featured_image: featured_image || null,
        word_count: word_count || null,
        read_time_minutes: read_time_minutes || null,
        updated_at: new Date().toISOString(),
        // Auto-approve edits
        is_approved: true,
        is_published: true,
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
      data: essay,
      message: 'Essay updated successfully!'
    })

  } catch (error) {
    console.error('Update essay error:', error)
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
    const { id } = await params;
    const supabase = await createClient()

    // Check authentication
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Authentication required'
      }, { status: 401 })
    }

    // Get existing essay
    const { data: existingEssay, error: fetchError } = await supabase
      .from('essays')
      .select('user_id, featured_image')
      .eq('id', id)
      .single()

    if (fetchError || !existingEssay) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Essay not found'
      }, { status: 404 })
    }

    // Check ownership
    if (existingEssay.user_id !== user.id) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'You can only delete your own essays'
      }, { status: 403 })
    }

    // Delete associated image if exists
    if (existingEssay.featured_image) {
      const imagePath = existingEssay.featured_image.split('/').pop();
      if (imagePath) {
        await supabase.storage
          .from('images')
          .remove([`essays/${imagePath}`]);
      }
    }

    // Delete essay
    const { error } = await supabase
      .from('essays')
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
      message: 'Essay deleted successfully'
    })

  } catch (error) {
    console.error('Delete essay error:', error)
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}

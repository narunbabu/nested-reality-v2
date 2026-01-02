import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { ApiResponse } from '@/types';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    const { id: reviewId } = await params

    // Check authentication
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Authentication required'
      }, { status: 401 })
    }

    const { vote_type } = await request.json()

    // Validate vote type
    if (!vote_type || !['helpful', 'not_helpful'].includes(vote_type)) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Invalid vote type'
      }, { status: 400 })
    }

    // Check if user already voted
    const { data: existingVote } = await supabase
      .from('review_votes')
      .select('*')
      .eq('user_id', user.id)
      .eq('review_id', reviewId)
      .single()

    if (existingVote) {
      // Update existing vote
      const { error } = await supabase
        .from('review_votes')
        .update({ vote_type })
        .eq('id', existingVote.id)

      if (error) {
        return NextResponse.json<ApiResponse>({
          success: false,
          error: error.message
        }, { status: 400 })
      }

      return NextResponse.json<ApiResponse>({
        success: true,
        message: 'Vote updated successfully'
      })
    } else {
      // Insert new vote
      const { error } = await supabase
        .from('review_votes')
        .insert({
          user_id: user.id,
          review_id: reviewId,
          vote_type
        })

      if (error) {
        return NextResponse.json<ApiResponse>({
          success: false,
          error: error.message
        }, { status: 400 })
      }

      return NextResponse.json<ApiResponse>({
        success: true,
        message: 'Vote recorded successfully'
      })
    }

  } catch (error) {
    console.error('Vote error:', error)
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const essayId = params.id;
    const userId = user.id;

    // Check if essay exists
    const { data: essay, error: essayError } = await supabase
      .from('essays')
      .select('id')
      .eq('id', essayId)
      .single();

    if (essayError || !essay) {
      return NextResponse.json(
        { error: 'Essay not found' },
        { status: 404 }
      );
    }

    // Check if user already liked this essay
    const { data: existingLike } = await supabase
      .from('essay_likes')
      .select('id')
      .eq('user_id', userId)
      .eq('essay_id', essayId)
      .single();

    if (existingLike) {
      // Unlike: Remove the like
      const { error: deleteError } = await supabase
        .from('essay_likes')
        .delete()
        .eq('user_id', userId)
        .eq('essay_id', essayId);

      if (deleteError) {
        console.error('Error unliking essay:', deleteError);
        return NextResponse.json(
          { error: 'Failed to unlike essay' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        liked: false,
        message: 'Essay unliked successfully'
      });
    } else {
      // Like: Add the like
      const { error: insertError } = await supabase
        .from('essay_likes')
        .insert({
          user_id: userId,
          essay_id: essayId
        });

      if (insertError) {
        console.error('Error liking essay:', insertError);
        return NextResponse.json(
          { error: 'Failed to like essay' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        liked: true,
        message: 'Essay liked successfully'
      });
    }
  } catch (error) {
    console.error('Error in essay like endpoint:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies });

    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { liked: false, likeCount: 0 },
        { status: 200 }
      );
    }

    const essayId = params.id;
    const userId = user.id;

    // Check if user liked this essay
    const { data: userLike } = await supabase
      .from('essay_likes')
      .select('id')
      .eq('user_id', userId)
      .eq('essay_id', essayId)
      .single();

    // Get total like count
    const { data: essay } = await supabase
      .from('essays')
      .select('like_count')
      .eq('id', essayId)
      .single();

    return NextResponse.json({
      liked: !!userLike,
      likeCount: essay?.like_count || 0
    });
  } catch (error) {
    console.error('Error getting essay like status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

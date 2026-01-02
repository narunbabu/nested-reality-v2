import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();

    // Check if user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { id: commentId } = await params;
    const userId = user.id;

    // Check if comment exists
    const { data: comment, error: commentError } = await supabase
      .from('comments')
      .select('id')
      .eq('id', commentId)
      .single();

    if (commentError || !comment) {
      return NextResponse.json(
        { error: 'Comment not found' },
        { status: 404 }
      );
    }

    // Check if user already liked this comment
    const { data: existingLike } = await supabase
      .from('comment_likes')
      .select('id')
      .eq('user_id', userId)
      .eq('comment_id', commentId)
      .single();

    if (existingLike) {
      // Unlike: Remove the like
      const { error: deleteError } = await supabase
        .from('comment_likes')
        .delete()
        .eq('user_id', userId)
        .eq('comment_id', commentId);

      if (deleteError) {
        console.error('Error unliking comment:', deleteError);
        return NextResponse.json(
          { error: 'Failed to unlike comment' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        liked: false,
        message: 'Comment unliked successfully'
      });
    } else {
      // Like: Add the like
      const { error: insertError } = await supabase
        .from('comment_likes')
        .insert({
          user_id: userId,
          comment_id: commentId
        });

      if (insertError) {
        console.error('Error liking comment:', insertError);
        return NextResponse.json(
          { error: 'Failed to like comment' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        liked: true,
        message: 'Comment liked successfully'
      });
    }
  } catch (error) {
    console.error('Error in comment like endpoint:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();

    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { liked: false, likeCount: 0 },
        { status: 200 }
      );
    }

    const { id: commentId } = await params;
    const userId = user.id;

    // Check if user liked this comment
    const { data: userLike } = await supabase
      .from('comment_likes')
      .select('id')
      .eq('user_id', userId)
      .eq('comment_id', commentId)
      .single();

    // Get total like count
    const { data: comment } = await supabase
      .from('comments')
      .select('like_count')
      .eq('id', commentId)
      .single();

    return NextResponse.json({
      liked: !!userLike,
      likeCount: comment?.like_count || 0
    });
  } catch (error) {
    console.error('Error getting comment like status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

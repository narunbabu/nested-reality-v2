import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/discussion-selections?discussion_id=xxx - Get user's discussion selections
export async function GET(request: NextRequest) {
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

    const userId = user.id;
    const discussionId = request.nextUrl.searchParams.get('discussion_id');

    if (!discussionId) {
      return NextResponse.json(
        { error: 'discussion_id parameter is required' },
        { status: 400 }
      );
    }

    // Get user's discussion selections
    const { data: selection, error } = await supabase
      .from('discussion_selections')
      .select('*')
      .eq('user_id', userId)
      .eq('discussion_id', discussionId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = not found
      console.error('Error fetching discussion selections:', error);
      return NextResponse.json(
        { error: 'Failed to fetch discussion selections' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message_indices: selection?.message_indices || []
    });
  } catch (error) {
    console.error('Error in discussion selections GET endpoint:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/discussion-selections - Update user's discussion selections
export async function POST(request: NextRequest) {
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

    const userId = user.id;
    const body = await request.json();

    if (!body.discussion_id) {
      return NextResponse.json(
        { error: 'discussion_id is required' },
        { status: 400 }
      );
    }

    if (!Array.isArray(body.message_indices)) {
      return NextResponse.json(
        { error: 'message_indices must be an array' },
        { status: 400 }
      );
    }

    // Check if selection already exists
    const { data: existing } = await supabase
      .from('discussion_selections')
      .select('id')
      .eq('user_id', userId)
      .eq('discussion_id', body.discussion_id)
      .single();

    let result;

    if (existing) {
      // Update existing selection
      const { data, error } = await supabase
        .from('discussion_selections')
        .update({
          message_indices: body.message_indices,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .eq('discussion_id', body.discussion_id)
        .select()
        .single();

      if (error) {
        console.error('Error updating discussion selections:', error);
        return NextResponse.json(
          { error: 'Failed to update discussion selections' },
          { status: 500 }
        );
      }

      result = data;
    } else {
      // Create new selection
      const { data, error } = await supabase
        .from('discussion_selections')
        .insert({
          user_id: userId,
          discussion_id: body.discussion_id,
          message_indices: body.message_indices
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating discussion selections:', error);
        return NextResponse.json(
          { error: 'Failed to create discussion selections' },
          { status: 500 }
        );
      }

      result = data;
    }

    return NextResponse.json({
      message_indices: result.message_indices,
      message: 'Discussion selections updated successfully'
    });
  } catch (error) {
    console.error('Error in discussion selections POST endpoint:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

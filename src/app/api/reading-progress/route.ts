import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/reading-progress - Get user's reading progress
export async function GET(request: NextRequest) {
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

    const userId = user.id;

    // Get user's reading progress
    const { data: progress, error } = await supabase
      .from('reading_progress')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = not found
      console.error('Error fetching reading progress:', error);
      return NextResponse.json(
        { error: 'Failed to fetch reading progress' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      progress: progress || {
        status: null,
        progress_percentage: 0,
        current_chapter: null,
        notes: null
      }
    });
  } catch (error) {
    console.error('Error in reading progress GET endpoint:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/reading-progress - Update user's reading progress
export async function POST(request: NextRequest) {
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

    const userId = user.id;
    const body = await request.json();

    // Validate status
    const validStatuses = [
      'planning',
      'started',
      'first_4_chapters',
      'first_10_chapters',
      'completed',
      'reviewed'
    ];

    if (body.status && !validStatuses.includes(body.status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be one of: ' + validStatuses.join(', ') },
        { status: 400 }
      );
    }

    // Check if progress already exists
    const { data: existing } = await supabase
      .from('reading_progress')
      .select('id')
      .eq('user_id', userId)
      .single();

    let result;

    if (existing) {
      // Update existing progress
      const updateData: any = {};

      if (body.status !== undefined) updateData.status = body.status;
      if (body.current_chapter !== undefined) updateData.current_chapter = body.current_chapter;
      if (body.notes !== undefined) updateData.notes = body.notes;

      const { data, error } = await supabase
        .from('reading_progress')
        .update(updateData)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) {
        console.error('Error updating reading progress:', error);
        return NextResponse.json(
          { error: 'Failed to update reading progress' },
          { status: 500 }
        );
      }

      result = data;
    } else {
      // Create new progress
      const { data, error } = await supabase
        .from('reading_progress')
        .insert({
          user_id: userId,
          status: body.status || 'planning',
          current_chapter: body.current_chapter,
          notes: body.notes
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating reading progress:', error);
        return NextResponse.json(
          { error: 'Failed to create reading progress' },
          { status: 500 }
        );
      }

      result = data;
    }

    return NextResponse.json({
      progress: result,
      message: 'Reading progress updated successfully'
    });
  } catch (error) {
    console.error('Error in reading progress POST endpoint:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

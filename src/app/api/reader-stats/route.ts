import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/reader-stats - Get public reader statistics (no auth required)
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get total count of readers with progress
    const { count: totalReaders, error: readersError } = await supabase
      .from('reading_progress')
      .select('*', { count: 'exact', head: true });

    if (readersError) {
      console.error('Error counting readers:', readersError);
    }

    // Get total count of readers engaged in discussions
    const { count: discussionEngagement, error: discussionError } = await supabase
      .from('discussion_selections')
      .select('user_id', { count: 'exact', head: true });

    if (discussionError) {
      console.error('Error counting discussion engagement:', discussionError);
    }

    // Get average completion percentage
    const { data: progressData, error: progressError } = await supabase
      .from('reading_progress')
      .select('progress_percentage');

    let averageCompletion = 0;
    if (!progressError && progressData && progressData.length > 0) {
      const total = progressData.reduce((sum, item) => sum + (item.progress_percentage || 0), 0);
      averageCompletion = Math.round(total / progressData.length);
    }

    // Get reading status distribution
    const { data: statusData, error: statusError } = await supabase
      .from('reading_progress')
      .select('status');

    let statusDistribution: Record<string, number> = {
      planning: 0,
      started: 0,
      first_4_chapters: 0,
      first_10_chapters: 0,
      completed: 0,
      reviewed: 0
    };

    if (!statusError && statusData) {
      statusData.forEach(item => {
        if (item.status && statusDistribution.hasOwnProperty(item.status)) {
          statusDistribution[item.status]++;
        }
      });
    }

    return NextResponse.json({
      stats: {
        total_readers: totalReaders || 0,
        total_discussions_engaged: discussionEngagement || 0,
        average_completion: averageCompletion,
        status_distribution: statusDistribution,
        popular_topics: [
          'Density vs Force',
          'Nesting Principle',
          'Motion Without External Force'
        ]
      }
    });
  } catch (error) {
    console.error('Error in reader stats GET endpoint:', error);
    // Return default stats on error instead of failing
    return NextResponse.json({
      stats: {
        total_readers: 0,
        total_discussions_engaged: 0,
        average_completion: 0,
        status_distribution: {
          planning: 0,
          started: 0,
          first_4_chapters: 0,
          first_10_chapters: 0,
          completed: 0,
          reviewed: 0
        },
        popular_topics: []
      }
    });
  }
}

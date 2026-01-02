import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

// GET /api/reading-progress/stats - Get public reading progress statistics
export async function GET() {
  try {
    const supabase = await createClient();

    // Get reading progress statistics using the helper function
    const { data, error } = await supabase
      .rpc('get_reading_progress_stats');

    if (error) {
      console.error('Error fetching reading progress stats:', error);

      // Fallback: manually calculate stats if function doesn't exist
      const { data: progressData, error: fallbackError } = await supabase
        .from('reading_progress')
        .select('status');

      if (fallbackError) {
        return NextResponse.json(
          { error: 'Failed to fetch statistics' },
          { status: 500 }
        );
      }

      // Calculate stats manually
      const stats = progressData?.reduce((acc: any, curr: any) => {
        acc[curr.status] = (acc[curr.status] || 0) + 1;
        return acc;
      }, {}) || {};

      const total = Object.values(stats).reduce((sum: number, count: any) => sum + count, 0);

      const formattedStats = [
        { status: 'planning', count: stats.planning || 0, percentage: total > 0 ? ((stats.planning || 0) / total * 100).toFixed(2) : 0 },
        { status: 'started', count: stats.started || 0, percentage: total > 0 ? ((stats.started || 0) / total * 100).toFixed(2) : 0 },
        { status: 'first_4_chapters', count: stats.first_4_chapters || 0, percentage: total > 0 ? ((stats.first_4_chapters || 0) / total * 100).toFixed(2) : 0 },
        { status: 'first_10_chapters', count: stats.first_10_chapters || 0, percentage: total > 0 ? ((stats.first_10_chapters || 0) / total * 100).toFixed(2) : 0 },
        { status: 'completed', count: stats.completed || 0, percentage: total > 0 ? ((stats.completed || 0) / total * 100).toFixed(2) : 0 },
        { status: 'reviewed', count: stats.reviewed || 0, percentage: total > 0 ? ((stats.reviewed || 0) / total * 100).toFixed(2) : 0 }
      ];

      return NextResponse.json({
        stats: formattedStats,
        total_readers: total
      });
    }

    return NextResponse.json({
      stats: data,
      total_readers: data?.reduce((sum: number, stat: any) => sum + stat.count, 0) || 0
    });
  } catch (error) {
    console.error('Error in reading progress stats endpoint:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

'use client';

import { useState, useEffect } from 'react';

interface StatItem {
  status: string;
  count: number;
  percentage: string | number;
}

interface ReadingProgressStatsProps {
  className?: string;
}

const STATUS_INFO: Record<string, { label: string; icon: string; color: string }> = {
  planning: { label: 'Planning to Read', icon: '📖', color: 'blue' },
  started: { label: 'Started Reading', icon: '📚', color: 'green' },
  first_4_chapters: { label: 'First 4 Chapters', icon: '📖', color: 'yellow' },
  first_10_chapters: { label: 'First 10 Chapters', icon: '📕', color: 'orange' },
  completed: { label: 'Full Book Read', icon: '✅', color: 'purple' },
  reviewed: { label: 'Review Submitted', icon: '⭐', color: 'red' }
};

const COLOR_CLASSES: Record<string, { bg: string; text: string; border: string }> = {
  blue: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  green: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
  yellow: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' },
  orange: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
  purple: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  red: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' }
};

export default function ReadingProgressStats({ className = '' }: ReadingProgressStatsProps) {
  const [stats, setStats] = useState<StatItem[]>([]);
  const [totalReaders, setTotalReaders] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/reading-progress/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats || []);
        setTotalReaders(data.total_readers || 0);
      }
    } catch (error) {
      console.error('Error fetching reading progress stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Reader Statistics</h2>
        <p className="text-gray-600">See how the community is progressing through "Nested Reality"</p>
      </div>

      <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
        <div className="text-center">
          <p className="text-sm font-medium text-gray-600 mb-1">Total Readers Tracking Progress</p>
          <p className="text-4xl font-bold text-gray-900">{totalReaders}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {stats.map((stat) => {
          const info = STATUS_INFO[stat.status];
          const colors = COLOR_CLASSES[info.color];

          return (
            <div
              key={stat.status}
              className={`p-4 rounded-lg border-2 ${colors.bg} ${colors.border} transition-all duration-200 hover:shadow-md`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{info.icon}</span>
                  <span className={`font-semibold ${colors.text}`}>{info.label}</span>
                </div>
                <div className="text-right">
                  <p className={`text-2xl font-bold ${colors.text}`}>{stat.count}</p>
                  <p className="text-sm text-gray-600">readers</p>
                </div>
              </div>

              <div className="mt-3">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Percentage</span>
                  <span className="font-medium">{typeof stat.percentage === 'number' ? stat.percentage.toFixed(1) : stat.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${colors.text.replace('text', 'bg')}`}
                    style={{ width: `${typeof stat.percentage === 'number' ? stat.percentage : parseFloat(stat.percentage as string)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {stats.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No readers tracking progress yet.</p>
          <p className="text-gray-400 text-sm mt-2">Be the first to track your reading journey!</p>
        </div>
      )}
    </div>
  );
}

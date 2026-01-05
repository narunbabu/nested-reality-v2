'use client';

import { useState, useEffect } from 'react';

interface ReaderStats {
  total_readers: number;
  total_discussions_engaged: number;
  average_completion: number;
  popular_topics: string[];
}

export default function ReaderStatistics() {
  const [stats, setStats] = useState<ReaderStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/reader-stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching reader statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-2/3 mb-4"></div>
          <div className="space-y-3">
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  // Default stats if API fails
  const displayStats: ReaderStats = stats || {
    total_readers: 0,
    total_discussions_engaged: 0,
    average_completion: 0,
    popular_topics: []
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Reader Community Statistics</h2>

      <div className="space-y-6">
        {/* Total Readers */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
          <div>
            <p className="text-sm text-blue-700 font-medium">Total Readers Tracking Progress</p>
            <p className="text-3xl font-bold text-blue-900">{displayStats.total_readers}</p>
          </div>
          <div className="text-4xl">📚</div>
        </div>

        {/* Discussion Engagement */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
          <div>
            <p className="text-sm text-purple-700 font-medium">Readers Engaged in Discussions</p>
            <p className="text-3xl font-bold text-purple-900">{displayStats.total_discussions_engaged}</p>
          </div>
          <div className="text-4xl">💬</div>
        </div>

        {/* Average Completion */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
          <div>
            <p className="text-sm text-green-700 font-medium">Average Reading Progress</p>
            <p className="text-3xl font-bold text-green-900">{displayStats.average_completion}%</p>
          </div>
          <div className="text-4xl">📈</div>
        </div>

        {/* Reading Milestones Distribution */}
        <div className="border-t pt-4">
          <h3 className="text-lg font-bold text-gray-900 mb-3">Reading Journey Distribution</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-xl">📖</span>
              <div className="flex-1">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700">Planning to Read</span>
                  <span className="text-gray-500">0%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '0%' }}></div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xl">📚</span>
              <div className="flex-1">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700">Started Reading</span>
                  <span className="text-gray-500">0%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '0%' }}></div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xl">📕</span>
              <div className="flex-1">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700">In Progress (4-10 chapters)</span>
                  <span className="text-gray-500">0%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: '0%' }}></div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xl">✅</span>
              <div className="flex-1">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700">Completed</span>
                  <span className="text-gray-500">0%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '0%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Community Insights */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-4">
          <h3 className="text-lg font-bold text-amber-900 mb-2">💡 Community Insights</h3>
          <p className="text-sm text-amber-800">
            Join our growing community of readers exploring the revolutionary concepts in Nested Reality.
            Track your progress, engage in discussions, and connect with fellow readers on this journey
            through density-based physics.
          </p>
        </div>
      </div>
    </div>
  );
}

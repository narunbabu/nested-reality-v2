import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import ReadingProgressTracker from '@/components/ReadingProgressTracker';
import ReadingProgressStats from '@/components/ReadingProgressStats';
import ReaderStatistics from '@/components/ReaderStatistics';
import DiscussionSelector from '@/components/DiscussionSelector';
import { DISCUSSIONS } from '@/lib/constants';

export const dynamic = 'force-dynamic';

export default async function ReadersPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Nested Reality Readers</h1>
            <p className="text-xl text-blue-100">
              Track your reading journey, engage in discussions, and connect with fellow readers
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Reading Progress Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Left Column - User's Progress Tracker */}
            <div>
              {user ? (
                <>
                  <ReadingProgressTracker />
                  <div className="mt-8 bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">About Reading Progress</h3>
                    <div className="space-y-3 text-gray-600">
                      <p>
                        Track your journey through "Nested Reality: A Density-Based Rewriting of Physics, Matter, and Life"
                        by updating your reading status as you progress.
                      </p>
                      <p>
                        Select from the following milestones:
                      </p>
                      <ul className="list-disc list-inside space-y-2 ml-4">
                        <li><strong>Planning to Read:</strong> You're interested and planning to start</li>
                        <li><strong>Started Reading:</strong> You've begun your journey</li>
                        <li><strong>First 4 Chapters:</strong> Completed the introductory chapters</li>
                        <li><strong>First 10 Chapters:</strong> Halfway through the book</li>
                        <li><strong>Full Book Read:</strong> Completed the entire book</li>
                        <li><strong>Review Submitted:</strong> You've read and submitted a review</li>
                      </ul>
                    </div>
                  </div>
                </>
              ) : (
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                  <div className="mb-4">
                    <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Sign In to Track Progress</h2>
                  <p className="text-gray-600 mb-6">
                    Join our community of readers and track your journey through "Nested Reality"
                  </p>
                  <a
                    href="/auth/signin?redirect=/readers"
                    className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Sign In to Get Started
                  </a>
                </div>
              )}
            </div>

            {/* Right Column - Community Stats */}
            <div>
              <ReaderStatistics />
            </div>
          </div>

          {/* Reader Discussions Section */}
          <div className="border-t border-gray-300 pt-12 mb-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Reader Discussions</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Dive deep into thoughtful conversations with readers and scholars.
                {user
                  ? ' Select key points that resonate with your understanding.'
                  : ' Sign in to track your progress through these discussions.'}
              </p>
              <div className="mt-4 bg-stone-50 border border-stone-200 rounded-lg p-4 max-w-2xl mx-auto">
                <p className="text-sm text-stone-700">
                  <strong>📖 Just browsing?</strong> You can also view discussions without signing in on the{' '}
                  <a href="/discussions" className="font-bold text-blue-600 underline hover:text-blue-700">
                    Discussions page
                  </a>
                  .
                </p>
              </div>
            </div>

            {DISCUSSIONS.map((discussion) => (
              <DiscussionSelector
                key={discussion.id}
                discussion={discussion}
                isAuthenticated={!!user}
              />
            ))}
          </div>

          {/* Bottom Section - Book Information */}
          <div className="bg-white rounded-lg shadow-md p-8 border-t border-gray-300">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">About "Nested Reality"</h2>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div className="p-4">
                <div className="text-4xl mb-2">🌌</div>
                <h3 className="font-semibold text-gray-900 mb-2">Revolutionary Physics</h3>
                <p className="text-gray-600 text-sm">
                  A density-based framework that reimagines our understanding of the universe
                </p>
              </div>
              <div className="p-4">
                <div className="text-4xl mb-2">🧬</div>
                <h3 className="font-semibold text-gray-900 mb-2">Matter & Life</h3>
                <p className="text-gray-600 text-sm">
                  Exploring the fundamental nature of reality from the smallest particles to consciousness
                </p>
              </div>
              <div className="p-4">
                <div className="text-4xl mb-2">💭</div>
                <h3 className="font-semibold text-gray-900 mb-2">New Perspectives</h3>
                <p className="text-gray-600 text-sm">
                  Challenging conventional thinking and opening new avenues of scientific inquiry
                </p>
              </div>
            </div>
            <div className="mt-8 text-center">
              <a
                href="/about-book"
                className="inline-block px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors"
              >
                Learn More About the Book
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

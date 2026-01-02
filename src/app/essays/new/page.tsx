'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Image from 'next/image';
import RichTextEditor from '@/components/RichTextEditor';
import MultipleImageUpload from '@/components/MultipleImageUpload';

const DRAFT_STORAGE_KEY = 'essay-draft';
const AUTOSAVE_INTERVAL = 30000; // 30 seconds

interface DraftData {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string;
  timestamp: number;
}

export default function NewEssayPage() {
  const router = useRouter();
  const supabase = createClient();

  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [images, setImages] = useState<Array<{ file?: File; url: string; id: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [showRestorePrompt, setShowRestorePrompt] = useState(false);
  const [hasDraft, setHasDraft] = useState(false);

  const categories = [
    'Concept Clarifications',
    'Comparative Essays',
    'Philosophy & Science',
    'Questions & Answers',
    'Related Topics',
    'Personal Reflections',
  ];

  // Load draft on mount
  useEffect(() => {
    const draftJson = localStorage.getItem(DRAFT_STORAGE_KEY);
    if (draftJson) {
      try {
        const draft: DraftData = JSON.parse(draftJson);
        const ageInMinutes = (Date.now() - draft.timestamp) / 1000 / 60;

        // Only show restore prompt if draft is less than 24 hours old
        if (ageInMinutes < 1440 && (draft.title || draft.content)) {
          setHasDraft(true);
          setShowRestorePrompt(true);
        }
      } catch (err) {
        console.error('Failed to parse draft:', err);
        localStorage.removeItem(DRAFT_STORAGE_KEY);
      }
    }
  }, []);

  // Auto-save draft every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (title || excerpt || content) {
        saveDraft();
      }
    }, AUTOSAVE_INTERVAL);

    return () => clearInterval(interval);
  }, [title, excerpt, content, category, tags]);

  // Save draft to localStorage
  const saveDraft = () => {
    setSaveStatus('saving');

    try {
      const draft: DraftData = {
        title,
        excerpt,
        content,
        category,
        tags,
        timestamp: Date.now(),
      };

      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
      setSaveStatus('saved');
      setHasDraft(true);

      // Clear "saved" status after 2 seconds
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (err) {
      console.error('Failed to save draft:', err);
      setSaveStatus('error');
    }
  };

  // Restore draft from localStorage
  const restoreDraft = () => {
    const draftJson = localStorage.getItem(DRAFT_STORAGE_KEY);
    if (draftJson) {
      try {
        const draft: DraftData = JSON.parse(draftJson);
        setTitle(draft.title);
        setExcerpt(draft.excerpt);
        setContent(draft.content);
        setCategory(draft.category);
        setTags(draft.tags);
        setShowRestorePrompt(false);
      } catch (err) {
        console.error('Failed to restore draft:', err);
      }
    }
  };

  // Clear draft from localStorage
  const clearDraft = () => {
    localStorage.removeItem(DRAFT_STORAGE_KEY);
    setHasDraft(false);
    setShowRestorePrompt(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Check authentication
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError('You must be logged in to create an essay');
        setLoading(false);
        return;
      }

      // Upload images if provided
      let featuredImageUrl = null;
      const uploadedImageUrls: string[] = [];

      for (const image of images) {
        if (image.file) {
          const fileExt = image.file.name.split('.').pop();
          const fileName = `${user.id}-${Date.now()}-${Math.random()}.${fileExt}`;
          const filePath = `essays/${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from('images')
            .upload(filePath, image.file, {
              cacheControl: '3600',
              upsert: false
            });

          if (uploadError) {
            throw new Error(`Image upload failed: ${uploadError.message}`);
          }

          // Get public URL
          const { data: { publicUrl } } = supabase.storage
            .from('images')
            .getPublicUrl(filePath);

          uploadedImageUrls.push(publicUrl);

          // Use first image as featured image
          if (!featuredImageUrl) {
            featuredImageUrl = publicUrl;
          }
        }
      }

      // Calculate word count and read time
      const wordCount = content.trim().split(/\s+/).length;
      const readTimeMinutes = Math.ceil(wordCount / 200); // Average reading speed

      // Parse tags
      const tagsArray = tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      // Create essay
      const response = await fetch('/api/essays', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          excerpt,
          content,
          category: category || null,
          tags: tagsArray.length > 0 ? tagsArray : null,
          featured_image: featuredImageUrl,
          word_count: wordCount,
          read_time_minutes: readTimeMinutes,
        }),
      });

      const data = await response.json();

      if (data.success) {
        clearDraft(); // Clear draft after successful submission
        router.push('/blog');
        router.refresh();
      } else {
        setError(data.error || 'Failed to create essay');
      }
    } catch (err) {
      console.error('Essay creation error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 py-12">
      <div className="max-w-4xl mx-auto px-6">
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-serif text-stone-900 mb-2">Write an Essay</h1>
              <p className="text-stone-600">
                Share your reflections on Nested Reality and related topics.
              </p>
            </div>
            {/* Save Status Indicator */}
            {saveStatus !== 'idle' && (
              <div className="flex items-center gap-2 text-sm">
                {saveStatus === 'saving' && (
                  <span className="text-stone-500">Saving...</span>
                )}
                {saveStatus === 'saved' && (
                  <span className="text-green-600">Saved</span>
                )}
                {saveStatus === 'error' && (
                  <span className="text-red-600">Save failed</span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Restore Draft Prompt */}
        {showRestorePrompt && (
          <div className="bg-blue-50 border border-blue-200 p-6 mb-8 rounded-lg">
            <h3 className="font-bold text-stone-900 mb-2">Restore your draft?</h3>
            <p className="text-stone-600 text-sm mb-4">
              We found a saved draft from your previous session. Would you like to restore it?
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={restoreDraft}
                className="px-4 py-2 bg-blue-600 text-white font-bold text-xs uppercase tracking-widest hover:bg-blue-700"
              >
                Restore Draft
              </button>
              <button
                type="button"
                onClick={clearDraft}
                className="px-4 py-2 bg-stone-200 text-stone-900 font-bold text-xs uppercase tracking-widest hover:bg-stone-300"
              >
                Discard
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white border border-stone-200 p-8 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
              {error}
            </div>
          )}

          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-bold text-stone-900 mb-2">
              Title *
            </label>
            <input
              id="title"
              type="text"
              required
              maxLength={300}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 border border-stone-200 focus:outline-none focus:border-stone-900 text-lg"
              placeholder="Enter essay title"
            />
          </div>

          {/* Excerpt */}
          <div>
            <label htmlFor="excerpt" className="block text-sm font-bold text-stone-900 mb-2">
              Excerpt (Brief Summary)
            </label>
            <textarea
              id="excerpt"
              rows={3}
              maxLength={500}
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              className="w-full px-4 py-3 border border-stone-200 focus:outline-none focus:border-stone-900"
              placeholder="A brief summary that will appear in listings..."
            />
            <p className="text-xs text-stone-500 mt-1">{excerpt.length}/500 characters</p>
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-bold text-stone-900 mb-2">
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 border border-stone-200 focus:outline-none focus:border-stone-900"
            >
              <option value="">Select a category (optional)</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Tags */}
          <div>
            <label htmlFor="tags" className="block text-sm font-bold text-stone-900 mb-2">
              Tags
            </label>
            <input
              id="tags"
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full px-4 py-3 border border-stone-200 focus:outline-none focus:border-stone-900"
              placeholder="density, physics, philosophy (comma-separated)"
            />
            <p className="text-xs text-stone-500 mt-1">Separate tags with commas</p>
          </div>

          {/* Featured Image */}
          <MultipleImageUpload
            images={images}
            onChange={setImages}
            maxImages={1}
          />

          {/* Content */}
          <div>
            <label className="block text-sm font-bold text-stone-900 mb-2">
              Essay Content *
            </label>
            <RichTextEditor
              content={content}
              onChange={setContent}
              placeholder="Start writing your essay... Use the toolbar to format text, add links, create lists, and more."
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-4 bg-stone-900 text-white font-bold text-sm uppercase tracking-widest hover:bg-stone-800 transition-colors disabled:bg-stone-400"
            >
              {loading ? 'Submitting...' : 'Submit for Review'}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="px-8 py-4 bg-white border border-stone-200 text-stone-900 font-bold text-sm uppercase tracking-widest hover:bg-stone-50 transition-colors"
            >
              Cancel
            </button>
          </div>

          <p className="text-xs text-stone-500 text-center pt-2">
            Your essay will be reviewed by moderators before being published.
          </p>
        </form>
      </div>
    </div>
  );
}

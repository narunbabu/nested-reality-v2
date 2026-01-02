'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Image from 'next/image';
import RichTextEditor from '@/components/RichTextEditor';
import MultipleImageUpload from '@/components/MultipleImageUpload';

const AUTOSAVE_INTERVAL = 30000; // 30 seconds

interface EditDraftData {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string;
  timestamp: number;
}

export default function EditEssayPage() {
  const params = useParams();
  const router = useRouter();
  const supabase = createClient();

  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [images, setImages] = useState<Array<{ file?: File; url: string; id: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  const categories = [
    'Concept Clarifications',
    'Comparative Essays',
    'Philosophy & Science',
    'Questions & Answers',
    'Related Topics',
    'Personal Reflections',
  ];

  const getDraftStorageKey = () => `essay-edit-draft-${params.id}`;

  // Auto-save draft every 30 seconds
  useEffect(() => {
    if (loading) return; // Don't auto-save while loading initial data

    const interval = setInterval(() => {
      if (title || excerpt || content) {
        saveDraft();
      }
    }, AUTOSAVE_INTERVAL);

    return () => clearInterval(interval);
  }, [title, excerpt, content, category, tags, loading]);

  // Save draft to localStorage
  const saveDraft = () => {
    setSaveStatus('saving');

    try {
      const draft: EditDraftData = {
        title,
        excerpt,
        content,
        category,
        tags,
        timestamp: Date.now(),
      };

      localStorage.setItem(getDraftStorageKey(), JSON.stringify(draft));
      setSaveStatus('saved');

      // Clear "saved" status after 2 seconds
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (err) {
      console.error('Failed to save draft:', err);
      setSaveStatus('error');
    }
  };

  // Clear draft from localStorage
  const clearDraft = () => {
    localStorage.removeItem(getDraftStorageKey());
  };

  useEffect(() => {
    loadEssay();
  }, [params.id]);

  const loadEssay = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      const response = await fetch(`/api/essays/${params.id}`);
      const data = await response.json();

      if (!data.success) {
        setError('Essay not found');
        return;
      }

      const essay = data.data;

      // Check ownership
      if (essay.user_id !== user.id) {
        setError('You can only edit your own essays');
        return;
      }

      // Populate form
      setTitle(essay.title);
      setExcerpt(essay.excerpt || '');
      setContent(essay.content);
      setCategory(essay.category || '');
      setTags(essay.tags ? essay.tags.join(', ') : '');

      // Load existing featured image
      if (essay.featured_image) {
        setImages([{
          url: essay.featured_image,
          id: 'existing-0',
        }]);
      }

    } catch (err) {
      setError('Failed to load essay');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError('You must be logged in');
        setSubmitting(false);
        return;
      }

      // Upload new images and track all image URLs
      let featuredImageUrl = null;
      const uploadedImageUrls: string[] = [];

      for (const image of images) {
        if (image.file) {
          // New image to upload
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

          const { data: { publicUrl } } = supabase.storage
            .from('images')
            .getPublicUrl(filePath);

          uploadedImageUrls.push(publicUrl);

          // Use first image as featured image
          if (!featuredImageUrl) {
            featuredImageUrl = publicUrl;
          }
        } else if (!image.file) {
          // Existing image
          uploadedImageUrls.push(image.url);

          // Use first image as featured image
          if (!featuredImageUrl) {
            featuredImageUrl = image.url;
          }
        }
      }

      // Calculate word count and read time
      const wordCount = content.trim().split(/\s+/).length;
      const readTimeMinutes = Math.ceil(wordCount / 200);

      // Parse tags
      const tagsArray = tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      // Update essay
      const response = await fetch(`/api/essays/${params.id}`, {
        method: 'PUT',
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
        router.push(`/essays/${params.id}`);
        router.refresh();
      } else {
        setError(data.error || 'Failed to update essay');
      }
    } catch (err) {
      console.error('Essay update error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-stone-500">Loading...</div>
      </div>
    );
  }

  if (error && !title) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-serif text-stone-900 mb-4">Error</h1>
          <p className="text-stone-600 mb-6">{error}</p>
          <button
            onClick={() => router.back()}
            className="inline-block px-6 py-3 bg-stone-900 text-white font-bold text-xs uppercase tracking-widest hover:bg-stone-800"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 py-12">
      <div className="max-w-4xl mx-auto px-6">
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-serif text-stone-900 mb-2">Edit Essay</h1>
              <p className="text-stone-600">
                Make changes to your essay. It will be reviewed again before publishing.
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
            />
          </div>

          {/* Excerpt */}
          <div>
            <label htmlFor="excerpt" className="block text-sm font-bold text-stone-900 mb-2">
              Excerpt
            </label>
            <textarea
              id="excerpt"
              rows={3}
              maxLength={500}
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              className="w-full px-4 py-3 border border-stone-200 focus:outline-none focus:border-stone-900"
            />
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
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
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
            />
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
              Content *
            </label>
            <RichTextEditor
              content={content}
              onChange={setContent}
              placeholder="Edit your essay content here..."
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-4 bg-stone-900 text-white font-bold text-xs uppercase tracking-widest hover:bg-stone-800 disabled:bg-stone-400"
            >
              {submitting ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="px-8 py-4 bg-white border border-stone-200 text-stone-900 font-bold text-xs uppercase tracking-widest hover:bg-stone-50"
            >
              Cancel
            </button>
          </div>

          <p className="text-xs text-stone-500 text-center pt-2">
            Your edited essay will be re-reviewed before being published.
          </p>
        </form>
      </div>
    </div>
  );
}

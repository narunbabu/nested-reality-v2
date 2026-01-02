'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function TestStoragePage() {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const testConnection = async () => {
    setLoading(true);
    setResult('Testing...');

    try {
      // Test 1: List all buckets
      const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();

      if (bucketsError) {
        setResult(`⚠️ Cannot list buckets: ${bucketsError.message}\n\nThis is a permissions issue. Run the SQL fix in supabase/storage-permissions.sql\n\nBUT the bucket might still exist and work! Try Test 2.`);
        setLoading(false);
        return;
      }

      setResult(`✅ Found ${buckets?.length || 0} buckets:\n${JSON.stringify(buckets, null, 2)}`);

      // Test 2: Check if 'images' bucket exists
      const imagesBucket = buckets?.find(b => b.name === 'images');
      if (!imagesBucket) {
        setResult(prev => prev + '\n\n⚠️ "images" bucket not found in list!\n\nAvailable buckets:\n' + (buckets?.map(b => `  - ${b.name}`).join('\n') || '  (none)') + '\n\nIf you created the bucket in the dashboard, run Test 2 anyway - it might still work!');
      } else {
        setResult(prev => prev + '\n\n✅ "images" bucket found!\n' + JSON.stringify(imagesBucket, null, 2));
      }

    } catch (err) {
      setResult(`❌ Unexpected error: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoading(false);
    }
  };

  const testUpload = async () => {
    setLoading(true);
    setResult('Testing upload...');

    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setResult('❌ You must be logged in to test upload');
        setLoading(false);
        return;
      }

      // Create a tiny 1x1 PNG image (valid image file)
      // This is a base64-encoded 1x1 transparent PNG
      const base64PNG = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
      const imageBlob = await fetch(`data:image/png;base64,${base64PNG}`).then(res => res.blob());

      const fileName = `test-${Date.now()}.png`;
      const filePath = `test/${fileName}`;

      const { data, error } = await supabase.storage
        .from('images')
        .upload(filePath, imageBlob, {
          cacheControl: '3600',
          upsert: false,
          contentType: 'image/png'
        });

      if (error) {
        setResult(`❌ Upload failed: ${error.message}\n\nFull error:\n${JSON.stringify(error, null, 2)}`);
      } else {
        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('images')
          .getPublicUrl(filePath);

        setResult(`✅ Upload successful!\n\nPath: ${data.path}\nPublic URL: ${publicUrl}\n\nFull response:\n${JSON.stringify(data, null, 2)}`);

        // Clean up test file
        await supabase.storage.from('images').remove([filePath]);
        setResult(prev => prev + '\n\n✅ Cleanup successful - test file deleted');
      }

    } catch (err) {
      setResult(`❌ Unexpected error: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 py-12">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-4xl font-serif text-stone-900 mb-8">Storage Connection Test</h1>

        <div className="bg-white border border-stone-200 p-8 space-y-6">
          <div className="space-y-4">
            <button
              onClick={testConnection}
              disabled={loading}
              className="w-full px-6 py-3 bg-stone-900 text-white font-bold text-xs uppercase tracking-widest hover:bg-stone-800 disabled:bg-stone-400"
            >
              {loading ? 'Testing...' : 'Test 1: List Buckets'}
            </button>

            <button
              onClick={testUpload}
              disabled={loading}
              className="w-full px-6 py-3 bg-blue-900 text-white font-bold text-xs uppercase tracking-widest hover:bg-blue-800 disabled:bg-blue-400"
            >
              {loading ? 'Testing...' : 'Test 2: Test Upload (requires login)'}
            </button>
          </div>

          {result && (
            <div className="mt-6">
              <h3 className="text-sm font-bold text-stone-900 mb-2">Result:</h3>
              <pre className="bg-stone-100 p-4 rounded text-xs overflow-auto max-h-96 whitespace-pre-wrap">
                {result}
              </pre>
            </div>
          )}

          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded">
            <h4 className="text-sm font-bold text-yellow-900 mb-2">Expected Results:</h4>
            <ul className="text-xs text-yellow-800 space-y-1">
              <li>✅ Test 1 should list all buckets including "images"</li>
              <li>✅ Test 2 should successfully upload a test file (after logging in)</li>
              <li>❌ If "images" bucket is not found, you need to create it in Supabase</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 bg-white border border-stone-200 p-8">
          <h3 className="text-lg font-bold text-stone-900 mb-4">Quick Setup Guide</h3>
          <ol className="text-sm text-stone-700 space-y-2 list-decimal list-inside">
            <li>Go to: <a href="https://supabase.com/dashboard/project/xalevbfosxgpfwnkbspq/storage/buckets" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Storage Dashboard</a></li>
            <li>Click "New bucket"</li>
            <li>Name it exactly: <code className="bg-stone-100 px-2 py-1 rounded">images</code></li>
            <li>Enable "Public bucket"</li>
            <li>Set file size limit to 5MB (5242880 bytes)</li>
            <li>Click "Create bucket"</li>
            <li>Go to Policies tab and add the policies from ESSAYS_SETUP.md</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

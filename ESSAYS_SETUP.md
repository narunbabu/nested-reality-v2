# Essay System Setup Guide 📝

Complete guide for the community essay/blogging system with image uploads, comments, and social sharing.

---

## Features Implemented ✅

### Essay Writing & Management
- ✅ Create essays with rich content
- ✅ Upload one featured image per essay
- ✅ Automatic word count and read time calculation
- ✅ Category and tag organization
- ✅ Edit your own essays
- ✅ Delete essays (with image cleanup)
- ✅ Moderation queue (essays require approval)

### Commenting System
- ✅ Any logged-in user can comment on essays
- ✅ Essay authors get "Author" badge in comments
- ✅ Real-time comment updates
- ✅ Chronological comment ordering

### Social Sharing
- ✅ X (Twitter)
- ✅ Facebook
- ✅ LinkedIn
- ✅ WhatsApp
- ✅ Email
- ✅ Copy link to clipboard

### Image Handling
- ✅ Upload images up to 5MB
- ✅ Supported formats: JPG, PNG, WebP
- ✅ Image preview before upload
- ✅ Edit/replace images
- ✅ Automatic cleanup on essay deletion

---

## Setup Instructions 🔧

### Step 1: Create Supabase Storage Bucket

1. Go to your Supabase Dashboard → https://supabase.com/dashboard/project/xalevbfosxgpfwnkbspq
2. Navigate to **Storage** in the left sidebar
3. Click **"New bucket"**
4. Configure:
   ```
   Name: images
   Public bucket: ✅ ON
   File size limit: 5242880 (5MB)
   Allowed MIME types: image/jpeg,image/png,image/webp
   ```
5. Click **"Create bucket"**

### Step 2: Set Storage Policies

In the **Storage** → **Policies** section for the `images` bucket:

#### Policy 1: Public Read Access
```sql
-- Allow anyone to read images
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'images' );
```

#### Policy 2: Authenticated Upload
```sql
-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'images'
  AND auth.role() = 'authenticated'
);
```

#### Policy 3: Owner Delete
```sql
-- Allow users to delete their own images
CREATE POLICY "Users can delete own images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'images'
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

### Step 3: Verify Database Tables

Ensure these tables exist (they should from `supabase/schema.sql`):

- ✅ `essays` table
- ✅ `comments` table
- ✅ `users` table

If missing, run the schema from `/supabase/schema.sql`

---

## User Workflow 👥

### For Writers

1. **Sign in** to your account
2. Go to `/blog` or `/essays/new`
3. **Write Essay**:
   - Enter title (required)
   - Add excerpt (optional summary)
   - Select category
   - Add comma-separated tags
   - Upload featured image (optional, max 5MB)
   - Write content (required)
4. **Submit** → Essay enters moderation queue
5. **Edit anytime** → Re-submitted for approval
6. **Delete if needed** → Removes essay and images

### For Readers

1. Browse essays at `/blog`
2. Click to read full essay at `/essays/[id]`
3. **Comment** (requires login):
   - Sign in
   - Scroll to comments section
   - Write comment
   - Post → appears immediately
4. **Share** via social buttons

### For Admins

**Approve Essays** (Manual for now):
1. Go to Supabase Dashboard
2. Navigate to **Table Editor** → `essays`
3. Find pending essays (`is_approved = false`)
4. Set `is_approved = true` and `is_published = true`

*Note: Admin dashboard coming in Phase 2*

---

## API Endpoints 🔌

### Essays

```
GET  /api/essays
     ?page=1
     &limit=10
     &sort=created_at
     &order=desc
     &category=Philosophy
     &tag=physics
     &author_id=uuid
```

```
POST /api/essays
Body: {
  title: string (required),
  excerpt: string,
  content: string (required),
  category: string,
  tags: string[],
  featured_image: string (Supabase URL),
  word_count: number,
  read_time_minutes: number
}
```

```
GET  /api/essays/[id]
PUT  /api/essays/[id]  (owner only)
DELETE /api/essays/[id]  (owner only)
```

### Comments

```
GET  /api/comments?parent_type=essay&parent_id=uuid
POST /api/comments
Body: {
  parent_type: 'essay' | 'review',
  parent_id: string,
  content: string
}
```

---

## File Structure 📁

```
src/
├── app/
│   ├── api/
│   │   ├── essays/
│   │   │   ├── route.ts              # GET, POST essays
│   │   │   └── [id]/
│   │   │       └── route.ts          # GET, PUT, DELETE essay
│   │   └── comments/
│   │       └── route.ts              # GET, POST comments
│   ├── blog/
│   │   └── page.tsx                  # Essay list view
│   ├── essays/
│   │   ├── new/
│   │   │   └── page.tsx              # Create essay form
│   │   └── [id]/
│   │       ├── page.tsx              # View essay with comments
│   │       └── edit/
│   │           └── page.tsx          # Edit essay form
│   └── ...
├── components/
│   ├── Comments.tsx                  # Comment system
│   ├── SocialShare.tsx               # Share buttons
│   ├── Navigation.tsx                # Site navigation
│   └── Footer.tsx                    # Site footer
└── lib/
    ├── supabase/                     # Supabase utilities
    ├── constants.ts                  # App constants
    └── geminiService.ts              # Gemini AI service
```

---

## Usage Examples 💡

### Create an Essay

```typescript
// From /essays/new
const response = await fetch('/api/essays', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'Understanding Nested Reality',
    excerpt: 'A deep dive into density-based physics',
    content: 'Full essay content...',
    category: 'Concept Clarifications',
    tags: ['physics', 'density', 'philosophy'],
    featured_image: 'https://supabase-url/image.jpg',
    word_count: 1500,
    read_time_minutes: 8
  })
});
```

### Upload Image

```typescript
const { error } = await supabase.storage
  .from('images')
  .upload(`essays/${fileName}`, file, {
    cacheControl: '3600',
    upsert: false
  });

const { data: { publicUrl } } = supabase.storage
  .from('images')
  .getPublicUrl(filePath);
```

### Post Comment

```typescript
const response = await fetch('/api/comments', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    parent_type: 'essay',
    parent_id: essayId,
    content: 'Great insights!'
  })
});
```

---

## Image Guidelines 📸

### For Users

**Recommended Specs**:
- **Dimensions**: 1200x675px (16:9 aspect ratio)
- **Format**: JPG or WebP (best compression)
- **Size**: Under 1MB recommended (5MB max)
- **Content**: Relevant to essay topic

**Best Practices**:
- Use high-quality, relevant images
- Avoid copyrighted images (use free stock photos)
- Compress images before upload (use tinypng.com)
- Test on mobile devices

### For Admins

**Storage Management**:
- Monitor bucket size in Supabase Dashboard
- Unused images auto-delete when essay deleted
- Set up CDN for better performance (optional)

---

## Moderation Workflow 🛡️

### Current Process (Manual)

1. User submits essay → `is_approved = false`, `is_published = false`
2. Admin reviews in Supabase Dashboard
3. Admin sets `is_approved = true`, `is_published = true`
4. Essay appears in public feed

### Coming in Phase 2 (Automated)

- Admin dashboard at `/admin`
- Review queue with approve/reject buttons
- Email notifications to authors
- Bulk moderation actions

---

## Security & Privacy 🔒

### What's Protected

✅ **Authentication Required**:
- Writing essays
- Editing essays
- Deleting essays
- Posting comments

✅ **Authorization Enforced**:
- Users can only edit/delete their own essays
- Image uploads scoped to user folders

✅ **Input Validation**:
- Title max 300 characters
- Content required
- Image size limit 5MB
- File type validation

### What's Public

- Approved & published essays
- All comments (auto-approved currently)
- User profiles (username, full name, avatar)
- Featured images

---

## Troubleshooting 🔧

### "Image upload failed"

**Check**:
1. Bucket named `images` exists
2. Bucket is public
3. Storage policies are set correctly
4. File size < 5MB
5. File type is image/*

### "Essay not appearing"

**Check**:
1. `is_approved` = `true`
2. `is_published` = `true`
3. User is authenticated when viewing drafts

### "Cannot edit essay"

**Check**:
1. User is logged in
2. User is essay author (match `user_id`)
3. Essay exists in database

### "Comments not loading"

**Check**:
1. `comments` table exists
2. `is_approved` = `true` for comments
3. Correct `parent_type` and `parent_id`

---

## Future Enhancements 🚀

### Phase 2 (Coming Soon)
- [ ] Admin moderation dashboard
- [ ] Rich text editor (WYSIWYG)
- [ ] Image resize/crop in browser
- [ ] Multiple images per essay
- [ ] Draft auto-save
- [ ] Essay versioning
- [ ] Comment threading (replies)
- [ ] Comment moderation
- [ ] User badges (Verified, Contributor, etc.)

### Phase 3 (Planned)
- [ ] Advanced search & filtering
- [ ] Related essays recommendations
- [ ] Reading lists
- [ ] Essay bookmarking
- [ ] Email digest of new essays
- [ ] RSS feed
- [ ] Essay series/collections
- [ ] Co-authoring support

---

## Support & Documentation 📚

- **Supabase Docs**: https://supabase.com/docs/guides/storage
- **Next.js Docs**: https://nextjs.org/docs
- **Implementation Plan**: `/IMPLEMENTATION_PLAN.md`
- **Setup Guide**: `/SETUP_GUIDE.md`

---

**Questions?**
- Review the API endpoints above
- Check Supabase Dashboard for data
- Examine browser console for errors
- Test with sample data first

**Ready to launch!** 🎉

# Nested Reality V2 - Setup Guide

**Phase 1 Foundation Complete** ✅

## Quick Start

### 1. Configure Environment Variables

```bash
cd /mnt/c/ArunApps/NestedReality/nested-reality-v2
cp .env.example .env.local
```

Edit `.env.local` with your credentials:

```bash
# Required: Supabase (get from https://supabase.com)
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Required: Gemini AI (get from https://ai.google.dev)
GEMINI_API_KEY=your-gemini-api-key

# Optional: ConvertKit Newsletter
CONVERTKIT_API_KEY=your-convertkit-api-key
CONVERTKIT_API_SECRET=your-convertkit-api-secret
CONVERTKIT_FORM_ID=your-form-id

# Optional: Google Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=your-ga-measurement-id

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 2. Set Up Supabase Database

1. Go to [supabase.com](https://supabase.com) and create a new project
2. In the SQL Editor, run the schema from `supabase/schema.sql`
3. Get your API keys from Project Settings > API

### 3. Install Dependencies and Run

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`

---

## Project Structure

```
nested-reality-v2/
├── src/
│   ├── app/                      # Next.js App Router pages
│   │   ├── api/                  # API routes
│   │   │   ├── auth/            # Authentication endpoints
│   │   │   └── reviews/         # Reviews CRUD endpoints
│   │   ├── about-book/          # About Book page
│   │   ├── about-author/        # About Author page
│   │   ├── explorer/            # Concept Explorer (with AI)
│   │   ├── reviews/             # Reviews page
│   │   ├── blog/                # Blog page
│   │   ├── contact/             # Contact page
│   │   ├── newsletter/          # Newsletter page
│   │   ├── media/               # Media page
│   │   ├── privacy/             # Privacy Policy
│   │   ├── terms/               # Terms of Engagement
│   │   ├── ethics/              # Academic Ethics
│   │   ├── login/               # Login page
│   │   ├── register/            # Register page
│   │   ├── layout.tsx           # Root layout
│   │   ├── page.tsx             # Home page
│   │   ├── sitemap.ts           # SEO Sitemap
│   │   └── robots.ts            # SEO Robots.txt
│   ├── components/              # React components
│   │   ├── Navigation.tsx       # Site navigation with auth
│   │   └── Footer.tsx           # Site footer
│   ├── lib/                     # Utilities and services
│   │   ├── supabase/           # Supabase client utilities
│   │   │   ├── client.ts       # Browser client
│   │   │   ├── server.ts       # Server client
│   │   │   └── middleware.ts   # Auth middleware
│   │   ├── constants.ts        # App constants (BOOK_METADATA, etc.)
│   │   └── geminiService.ts    # Gemini AI service
│   ├── types/                   # TypeScript types
│   │   └── index.ts            # All type definitions
│   ├── middleware.ts            # Next.js middleware (auth)
│   └── globals.css             # Global styles
├── supabase/
│   └── schema.sql              # Database schema
├── .env.example                # Environment variables template
└── package.json
```

---

## Completed Features (Phase 1)

### ✅ Backend Infrastructure
- Next.js 16 with App Router
- Supabase integration (database + auth)
- TypeScript configuration
- Tailwind CSS v4 styling

### ✅ Authentication System
- User registration (`/register`)
- User login (`/logout`)
- Session management
- Protected routes middleware
- Auth state in navigation

### ✅ Database Schema
- Users table (with roles)
- Reviews table (with moderation)
- Essays/Blog posts table
- Comments table
- Review votes table
- Newsletter subscribers table
- Row Level Security (RLS) policies
- Performance indexes
- Automated triggers

### ✅ API Routes
- **Auth**: `POST /api/auth/register`, `/api/auth/login`, `/api/auth/logout`
- **Reviews**: `GET /api/reviews`, `POST /api/reviews`, `PUT /api/reviews/[id]`, `DELETE /api/reviews/[id]`
- **Votes**: `POST /api/reviews/[id]/vote`

### ✅ Pages
- Home (`/`)
- About Book (`/about-book`)
- About Author (`/about-author`)
- Concept Explorer (`/explorer`) - with Gemini AI integration
- Reviews (`/reviews`) - displays database reviews
- Blog (`/blog`)
- Media (`/media`)
- Contact (`/contact`)
- Newsletter (`/newsletter`)
- Legal: Privacy (`/privacy`), Terms (`/terms`), Ethics (`/ethics`)

### ✅ Components
- Navigation (with auth state)
- Footer
- Layout (with SEO metadata)

### ✅ SEO
- Dynamic sitemap (`/sitemap.xml`)
- Robots.txt (`/robots.txt`)
- Open Graph metadata
- Proper meta tags

---

## Remaining Phase 1 Tasks

### ⏳ Review Submission Form
Location: `/dashboard` or modal in `/reviews`

Requirements:
- Rating selector (1-5 stars)
- Title (optional)
- Content (required, long-form)
- Submit to `/api/reviews`
- Show submitted reviews in moderation queue

### ⏳ Admin Moderation Dashboard
Location: `/admin`

Requirements:
- List pending reviews
- Approve/reject reviews
- Edit review content
- View user info

### ⏳ Newsletter Integration
Location: `/newsletter` form handler

Requirements:
- Integrate ConvertKit API
- Store subscribers in database
- Send welcome email sequence

### ⏳ Google Analytics
Location: `layout.tsx`

Requirements:
- Add GA4 script
- Track page views
- Track custom events (review submits, etc.)

---

## Development Commands

```bash
# Development server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

---

## Database Queries Reference

### Get Approved Reviews
```sql
SELECT * FROM reviews
WHERE is_approved = true
ORDER BY created_at DESC;
```

### Get Pending Reviews (Admin)
```sql
SELECT r.*, u.username, u.email
FROM reviews r
LEFT JOIN users u ON r.user_id = u.id
WHERE r.moderation_status = 'pending';
```

### Create Admin User
```sql
-- First create auth user via Supabase Auth, then:
INSERT INTO users (id, email, role, is_verified)
VALUES ('UUID_FROM_AUTH', 'admin@example.com', 'admin', true);
```

---

## Troubleshooting

### Supabase Connection Issues
- Verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are correct
- Check Supabase project is active
- Ensure RLS policies are correct

### Gemini AI Not Working
- Verify `GEMINI_API_KEY` is set
- Check API key is valid at [ai.google.dev](https://ai.google.dev)

### Build Errors
- Delete `.next` folder: `rm -rf .next`
- Clear node modules: `rm -rf node_modules && npm install`

---

## Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Environment Variables in Vercel
Set all variables from `.env.local` in Vercel dashboard:
- Project Settings > Environment Variables

---

## Next Steps

1. **Set up Supabase account** and run the schema
2. **Configure `.env.local`** with your API keys
3. **Test the application** locally
4. **Build review submission form** for authenticated users
5. **Create admin dashboard** for moderation
6. **Integrate ConvertKit** for newsletter
7. **Deploy to Vercel**

---

**Questions?**
- Review the implementation plan: `/mnt/c/ArunApps/NestedReality/IMPLEMENTATION_PLAN.md`
- Check original components: `/mnt/c/ArunApps/NestedReality/components/`

# Open Graph Image Creation Guide

## Quick Summary
You need to create **og-image.jpg** (1200x630px) for optimal social sharing on WhatsApp, LinkedIn, Facebook, Twitter, etc.

## Specifications

### Technical Requirements
- **Dimensions**: 1200x630px (exact)
- **Format**: JPG or PNG
- **File Size**: <1MB (recommended <300KB)
- **Aspect Ratio**: 1.91:1
- **Color Mode**: RGB
- **Resolution**: 72 DPI (web standard)

### File Location
Place the final image at:
```
/public/og-image.jpg
```

## Design Recommendations

### Layout Structure
```
┌────────────────────────────────────────────────────┐
│                                                    │
│  [Book Cover Image - Left 40%]  [Text - Right 60%]│
│                                                    │
│  ┌──────────┐                                     │
│  │          │    NESTED REALITY                   │
│  │  3D Book │                                     │
│  │  Cover   │    A Density-Based Rewriting        │
│  │          │    of Physics, Matter, and Life     │
│  │          │                                     │
│  └──────────┘    By Arun Nalamara                 │
│                                                    │
│                  [Amazon Top 4 Badge] [Rating ★★★★★]│
│                                                    │
└────────────────────────────────────────────────────┘
```

### Color Scheme
- **Background**: Dark gradient (#1C1917 → #0C0A09)
- **Primary Text**: White (#FFFFFF)
- **Accent**: Gold (#C5A059)
- **Secondary**: Stone-400 (#A8A29E)

### Typography
- **Title Font**: Crimson Pro Bold (or serif)
  - Size: 72px
  - Weight: 700
  - Color: White
- **Subtitle**: Inter Regular (or sans-serif)
  - Size: 36px
  - Weight: 400
  - Color: Stone-300
- **Author**: Inter Medium
  - Size: 28px
  - Weight: 500
  - Color: Gold (#C5A059)

### Content Elements
1. **Book Cover** (left side):
   - Use: `nested_reality_3d_transp.PNG`
   - Position: Left 40% of canvas
   - Add subtle glow effect

2. **Title** (right side, top):
   - "NESTED REALITY"
   - Large, bold, white
   - Letter-spacing: 2px

3. **Subtitle** (right side, middle):
   - "A Density-Based Rewriting of Physics, Matter, and Life"
   - Medium size, stone-300 color

4. **Author** (right side):
   - "By Arun Nalamara"
   - Gold color for emphasis

5. **Social Proof** (bottom right):
   - "Amazon Top 4 First Week"
   - 5-star rating display
   - Small badges

## Creation Methods

### Method 1: Canva (Recommended - Easy)
1. Go to [Canva.com](https://canva.com)
2. Create custom size: 1200x630px
3. Set dark gradient background
4. Upload book cover image (`nested_reality_3d_transp.PNG`)
5. Add text elements as specified above
6. Export as JPG, quality 90%

**Template**:
Search Canva for "Open Graph Image Template" or start from blank.

### Method 2: Figma (Professional)
1. Create new frame: 1200x630px
2. Add gradient background
3. Import book cover
4. Add text layers with proper fonts
5. Export as PNG or JPG (2x quality)

### Method 3: Photoshop
1. New document: 1200x630px, 72 DPI
2. Create layers:
   - Background gradient
   - Book cover (placed left, with glow)
   - Text overlays (right side)
3. Add layer styles (drop shadows, glows)
4. Save for Web: JPG, Quality 80-90%

### Method 4: HTML + Screenshot (Quick)
Use the provided HTML template below:

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      margin: 0;
      width: 1200px;
      height: 630px;
      background: linear-gradient(135deg, #1C1917 0%, #0C0A09 100%);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      display: flex;
      align-items: center;
      padding: 60px;
      box-sizing: border-box;
    }
    .container {
      display: flex;
      align-items: center;
      gap: 60px;
      width: 100%;
    }
    .book-cover {
      width: 400px;
      filter: drop-shadow(0 20px 60px rgba(197, 160, 89, 0.3));
    }
    .content {
      flex: 1;
      color: white;
    }
    .title {
      font-size: 72px;
      font-weight: 700;
      letter-spacing: 2px;
      margin: 0 0 20px 0;
      line-height: 1.1;
    }
    .subtitle {
      font-size: 32px;
      color: #A8A29E;
      margin: 0 0 30px 0;
      line-height: 1.4;
    }
    .author {
      font-size: 28px;
      color: #C5A059;
      font-weight: 500;
      margin: 0 0 40px 0;
    }
    .badges {
      display: flex;
      gap: 20px;
      align-items: center;
    }
    .badge {
      background: rgba(197, 160, 89, 0.1);
      border: 1px solid rgba(197, 160, 89, 0.3);
      padding: 8px 16px;
      border-radius: 4px;
      color: #C5A059;
      font-size: 18px;
      font-weight: 600;
    }
    .stars {
      color: #C5A059;
      font-size: 24px;
    }
  </style>
</head>
<body>
  <div class="container">
    <img src="path/to/nested_reality_3d_transp.PNG" alt="Book Cover" class="book-cover">
    <div class="content">
      <h1 class="title">NESTED<br>REALITY</h1>
      <p class="subtitle">A Density-Based Rewriting of Physics, Matter, and Life</p>
      <p class="author">By Arun Nalamara</p>
      <div class="badges">
        <div class="badge">⭐ Top 4 First Week</div>
        <div class="stars">★★★★★</div>
      </div>
    </div>
  </div>
</body>
</html>
```

**To use**:
1. Save as `og-template.html`
2. Update image path to your book cover
3. Open in browser at 100% zoom
4. Take screenshot (1200x630px)
5. Save as `og-image.jpg`

### Method 5: Automated (Next.js OG Image Generation)
Using Vercel's `@vercel/og` package:

```tsx
// app/api/og/route.tsx
import { ImageResponse } from '@vercel/og';

export async function GET() {
  return new ImageResponse(
    (
      <div style={{
        background: 'linear-gradient(135deg, #1C1917 0%, #0C0A09 100%)',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        padding: '60px',
      }}>
        <div style={{ display: 'flex', gap: '60px', alignItems: 'center' }}>
          <img src="/images/nested_reality_3d_transp.PNG" width="400" />
          <div style={{ display: 'flex', flexDirection: 'column', color: 'white' }}>
            <h1 style={{ fontSize: '72px', fontWeight: 700 }}>NESTED REALITY</h1>
            <p style={{ fontSize: '32px', color: '#A8A29E' }}>
              A Density-Based Rewriting of Physics
            </p>
            <p style={{ fontSize: '28px', color: '#C5A059' }}>By Arun Nalamara</p>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
```

## Testing Your Image

### Visual Preview
1. **Facebook Debugger**:
   - URL: https://developers.facebook.com/tools/debug/
   - Enter your site URL
   - Check image preview

2. **Twitter Card Validator**:
   - URL: https://cards-dev.twitter.com/validator
   - Preview how card appears

3. **LinkedIn Inspector**:
   - URL: https://www.linkedin.com/post-inspector/
   - Validate professional appearance

### Quality Checklist
- [ ] Image is exactly 1200x630px
- [ ] Text is readable at small sizes (mobile preview)
- [ ] Book cover is clearly visible
- [ ] Color contrast is sufficient (WCAG AA)
- [ ] File size under 1MB
- [ ] No important content in outer 10% (safe zone)
- [ ] Text doesn't overlap book cover
- [ ] Looks good on both light and dark backgrounds

## Platform-Specific Variations (Optional)

### WhatsApp (Square Thumbnail)
Create: `og-image-square.jpg` (600x600px)
- Book cover centered
- Title below or overlaid
- Simpler layout

### Twitter (16:9)
Create: `og-image-twitter.jpg` (1200x675px)
- Slightly different aspect ratio
- More horizontal space

### Email Preview
Create: `og-image-email.jpg` (600x400px)
- Smaller version
- Optimized for email clients

## Final Steps

1. **Create the image** using one of the methods above
2. **Save** as `og-image.jpg` in `/public/` directory
3. **Optimize** file size (use TinyPNG or similar)
4. **Test** on all platforms using debugging tools
5. **Deploy** and verify live previews

## Current Status

**Missing**:
- ❌ `/public/og-image.jpg` not found

**Available Assets**:
- ✅ Book cover: `/public/images/nested_reality_3d_transp.PNG`
- ✅ Achievement badges: `/public/images/top4.png`, `/public/images/top100general.png`

## Quick Win
**Temporary solution**: Copy book cover as og-image
```bash
cp public/images/nested_reality_3d_transp.PNG public/og-image.jpg
```

This will work but won't be optimal. Create a proper composite image for best results.

---

**Next**: After creating og-image.jpg, test all share buttons on the landing page!

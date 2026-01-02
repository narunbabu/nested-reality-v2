# Testing Guide - Nested Reality V2

**Complete User & Admin Flow Testing**

## Prerequisites

1. **Supabase Project Set Up**
   ```bash
   # 1. Go to https://supabase.com
   # 2. Create project
   # 3. Run the SQL from supabase/schema.sql
   # 4. Get API keys
   ```

2. **Environment Variables**
   ```bash
   cd /mnt/c/ArunApps/NestedReality/nested-reality-v2
   cp .env.example .env.local
   # Add your Supabase and Gemini API keys
   ```

3. **Install & Run**
   ```bash
   npm install
   npm run dev
   # Visit http://localhost:3000
   ```

---

## Test Flow 1: User Registration → Login → Submit Review

### Step 1: Register a New User

1. Go to `http://localhost:3000/register`
2. Fill in the form:
   - **Full Name**: Test User
   - **Username**: testuser
   - **Email**: test@example.com
   - **Password**: password123
3. Click "Create account"
4. ✅ Expected: Redirect to `/login?registered=true`

### Step 2: Login

1. At the login page, enter:
   - **Email**: test@example.com
   - **Password**: password123
2. Click "Sign in"
3. ✅ Expected: Redirect to home page with "Dashboard" and "Logout" in navigation

### Step 3: Access Dashboard

1. Click "Dashboard" in navigation
2. ✅ Expected: See `/dashboard` with:
   - Welcome message
   - Quick action cards
   - "No reviews yet" message

### Step 4: Submit a Review

**Option A: From Dashboard**
1. Click "+ New Review" button
2. Modal opens with review form
3. Fill in:
   - **Rating**: Click 5 stars
   - **Title**: Excellent read!
   - **Content**: This is a fascinating exploration of density over force. Highly recommend for anyone interested in physics and philosophy. (51+ characters)
4. Click "Submit Review"
5. ✅ Expected: Success message "Review Submitted!"
6. Modal closes after 2 seconds
7. Review now appears in "My Reviews" with "PENDING" status

**Option B: From Reviews Page**
1. Go to `/reviews`
2. Click "Sign In to Review" button
3. Redirected to `/dashboard`
4. Follow Option A steps above

### Step 5: Check Review Status

1. In Dashboard, look at "My Reviews"
2. ✅ Expected: Review shows:
   - Yellow background
   - "PENDING" badge
   - Your rating, title, and content
   - Submission date

---

## Test Flow 2: Admin Moderation

### Step 1: Create Admin User

Since this is a fresh database, you need to promote a user to admin:

1. Register as: `admin@example.com` / `admin123`
2. Note the user ID (check browser DevTools → Application → Local Storage → `supabase.auth.token`)
3. In Supabase SQL Editor:
   ```sql
   UPDATE users SET role = 'admin' WHERE email = 'admin@example.com';
   ```
4. Login as admin

### Step 2: Access Admin Dashboard

1. Go to `http://localhost:3000/admin`
2. ✅ Expected: See admin dashboard with:
   - Stats cards (Total, Pending, Approved, Rejected)
   - "Pending Reviews" tab (active)
   - List of pending reviews

### Step 3: Moderate a Review

1. Find the test review you submitted
2. ✅ Expected: Review shows:
   - Yellow background
   - User info (name, email, date)
   - Review content
   - "Add Moderation Notes" button
   - "Approve" and "Reject" buttons

3. (Optional) Click "Add Moderation Notes"
   - Enter: "Great review! Thanks for sharing."
   - Click "Hide" to close notes field

4. Click "Approve" button
5. ✅ Expected:
   - Button shows "Processing..."
   - Review disappears from pending list
   - Stats update: Pending decreases, Approved increases

### Step 4: Verify Approved Review

1. Go to `/reviews` (public reviews page)
2. ✅ Expected: Your review now appears in the public list!

### Step 5: Test Rejection (Optional)

1. Submit another review as regular user (use different email or edit database)
2. Go to admin dashboard
3. Click "Reject" button
4. ✅ Expected: Review marked as rejected, no longer appears in public list

---

## Test Flow 3: Review Updates and Deletion

### Step 1: Edit Your Own Review

1. Go to `/dashboard`
2. Find your approved review
3. Click "Edit" (TODO: Add edit button - coming in Phase 2)
4. Modify content
5. Save

### Step 2: Delete Your Own Review

1. In dashboard, find review
2. Click "Delete" (TODO: Add delete button - coming in Phase 2)
3. Confirm deletion

---

## Test Flow 4: Public Review Viewing

### Step 1: View Reviews as Anonymous User

1. Logout (if logged in)
2. Go to `/reviews`
3. ✅ Expected:
   - See all approved reviews
   - Amazon review CTA
   - "Sign In to Review" button (not submission form)
   - Each review shows: author, rating, title, content, date

### Step 2: Review Filtering

1. Add filter to URL: `/reviews?rating=5`
2. ✅ Expected: Only 5-star reviews shown

### Step 3: Pagination

1. If you have >10 reviews, add `?page=2`
2. ✅ Expected: Second page of reviews

---

## Database Verification Queries

Run these in Supabase SQL Editor to verify:

```sql
-- Check all users
SELECT * FROM users;

-- Check all reviews with status
SELECT
  r.id,
  r.rating,
  r.title,
  r.moderation_status,
  r.is_approved,
  u.email,
  u.full_name
FROM reviews r
LEFT JOIN users u ON r.user_id = u.id
ORDER BY r.created_at DESC;

-- Count reviews by status
SELECT
  moderation_status,
  COUNT(*) as count
FROM reviews
GROUP BY moderation_status;

-- Check if admin user exists
SELECT * FROM users WHERE role = 'admin';
```

---

## Common Issues & Solutions

### Issue 1: "Authentication required" error
**Solution**: Make sure you're logged in. Check browser console for auth errors.

### Issue 2: "Admin access required" error
**Solution**: Run the SQL command to promote user to admin role (see Test Flow 2, Step 1)

### Issue 3: Review doesn't appear after submission
**Solution**: Check it's in pending status in database. Reviews need admin approval before appearing publicly.

### Issue 4: Can't access /admin or /dashboard
**Solution**:
- Make sure middleware is working
- Check user role in database
- Verify NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are correct

### Issue 5: "SupabaseAuthError: Invalid claim"
**Solution**:
- Clear browser localStorage
- Logout and login again
- Verify JWT expiration settings in Supabase

---

## Success Criteria ✅

### User Flow
- ✅ Can register new account
- ✅ Can login with valid credentials
- ✅ Can access dashboard
- ✅ Can submit review with validation
- ✅ Review shows as pending
- ✅ Can see own reviews in dashboard

### Admin Flow
- ✅ Admin user can access /admin
- ✅ Non-admin users redirected from /admin
- ✅ Can see moderation stats
- ✅ Can approve reviews (they appear publicly)
- ✅ Can reject reviews (they don't appear publicly)
- ✅ Can add moderation notes

### Public Viewing
- ✅ Anonymous users can see approved reviews
- ✅ Cannot see pending/rejected reviews
- ✅ Can navigate to all public pages

---

## Next Steps After Testing

Once all flows pass:

1. **✅ Fix styling** - DONE
2. **✅ Build review submission** - DONE
3. **✅ Create admin dashboard** - DONE
4. **⏳ Test flows** - IN PROGRESS (you're here!)
5. **⏳ ConvertKit integration**
6. **⏳ Google Analytics**

---

## Quick Test Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

**Happy Testing! 🎉**

If you find any bugs or issues, check:
1. Browser console for errors
2. Network tab for failed API calls
3. Supabase logs for database errors
4. Terminal for server errors

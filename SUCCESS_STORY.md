🎉 SUCCESS STORY: Nested Reality Production Deployment

  Date: January 7, 2026
  Project: Nested Reality (Next.js 15 + Supabase + Google Ads)
  Status: ✅ FULLY OPERATIONAL

  ---
  📋 Mission Objectives Achieved

  1. ✅ Privacy Policy Created - Comprehensive GDPR-compliant policy for Google Ads verification
  2. ✅ Authentication Fixed - Supabase OAuth redirects working correctly
  3. ✅ Production Deployment - Next.js app running stable on port 3001
  4. ✅ PM2 Process Management - Zombie process issues eliminated
  5. ✅ Nginx Configuration - Large header support for auth callbacks

  ---
  🔥 Critical Issues Solved

  Issue 1: Google Ads Privacy Policy Requirement

  Problem: Google Ads account verification required comprehensive privacy policy
  Solution: Created full privacy policy at /privacy covering:
  - Data collection and usage
  - Third-party services (Supabase, Google Gemini, Google Ads, Amazon)
  - GDPR compliance
  - User rights and data protection
  - Cookie policies
  - Google Ads specific disclosures

  File: nested-reality-v2/src/app/privacy/page.tsx

  ---
  Issue 2: Login Redirecting to Localhost

  Problem: After login, Supabase redirected to http://localhost:3000 instead of production URL

  Root Causes:
  1. Environment variable NEXT_PUBLIC_APP_URL set to http://localhost:3000
  2. Supabase dashboard still configured for localhost
  3. Environment variables not loaded by PM2

  Solutions:
  1. Updated .env.local on server:
  NEXT_PUBLIC_APP_URL=https://nestedreality.org
  NEXT_PUBLIC_SITE_URL=https://nestedreality.org
  2. Updated Supabase Dashboard:
    - Site URL: https://nestedreality.org
    - Redirect URLs:
        - https://nestedreality.org/auth/callback
      - https://nestedreality.org/*
  3. Fixed PM2 environment injection in ecosystem.config.js

  ---
  Issue 3: PM2 Zombie Process Hell (The Big One!)

  Problem: EADDRINUSE: address already in use :::3001 - App kept crashing on restart

  Root Cause: PM2 was running npm start, which:
  1. PM2 starts npm as main process
  2. npm spawns Next.js as child process
  3. On restart, PM2 kills npm but child process survives as zombie
  4. Zombie holds port 3001
  5. New instance tries to bind to 3001 → crashes
  6. PM2 auto-restarts → infinite crash loop

  Solution: Run Next.js binary directly, bypass npm wrapper

  Before (WRONG):
  script: 'npm',
  args: 'start -- -p 3001'

  After (CORRECT):
  script: 'node_modules/next/dist/bin/next',
  args: 'start',
  env: { PORT: 3001 }

  Key Learning: Always run Node.js apps directly under PM2, never through npm wrapper!

  ---
  Issue 4: 502 Bad Gateway on Auth Callback

  Problem: Login worked, but callback URL returned 502 error

  Root Cause: Supabase auth tokens in headers exceeded nginx default buffer size (8KB)

  Error in Logs:
  upstream sent too big header while reading response header from upstream

  Solution: Increased nginx buffer sizes in /etc/nginx/sites-enabled/nestedreality.org:

  proxy_buffer_size          128k;
  proxy_buffers              4 256k;
  proxy_busy_buffers_size    256k;
  large_client_header_buffers 4 32k;

  Then: sudo nginx -t && sudo systemctl reload nginx

  ---
  Issue 5: File Permission Errors During Build

  Problem: Build failed with EACCES: permission denied on .next directory

  Root Cause: Used sudo rm -rf .next which created root-owned files

  Solution:
  sudo chown -R narun:narun /var/www/nestedreality.org
  rm -rf .next  # without sudo
  npm run build

  Key Learning: Never use sudo for build operations, only for system-level tasks

  ---
  📁 Final Configuration Files

  ecosystem.config.js (Production PM2 Config)

  module.exports = {
    apps: [{
      name: 'nestedreality',
      script: 'node_modules/next/dist/bin/next',
      args: 'start',
      cwd: '/var/www/nestedreality.org',
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
        NEXT_PUBLIC_APP_URL: 'https://nestedreality.org',
        NEXT_PUBLIC_SITE_URL: 'https://nestedreality.org'
      },
      error_file: '/home/narun/.pm2/logs/nestedreality-error.log',
      out_file: '/home/narun/.pm2/logs/nestedreality-out.log',
      log_file: '/home/narun/.pm2/logs/nestedreality-combined.log',
      time: true
    }]
  }

  .env.local (Server Environment)

  NEXT_PUBLIC_SUPABASE_URL=https://xalevbfosxgpfwnkbspq.supabase.co
  NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
  SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
  GEMINI_API_KEY=AIzaSy...
  NEXT_PUBLIC_APP_URL=https://nestedreality.org
  NEXT_PUBLIC_SITE_URL=https://nestedreality.org

  Nginx Config Additions

  # Inside server { } block
  proxy_buffer_size          128k;
  proxy_buffers              4 256k;
  proxy_busy_buffers_size    256k;
  large_client_header_buffers 4 32k;

  location / {
      proxy_pass http://localhost:3001;
      proxy_http_version 1.1;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection 'upgrade';
      proxy_set_header Host $host;
      proxy_cache_bypass $http_upgrade;
  }

  ---
  🛠️ Deployment Commands

  Clean Deploy

  cd /var/www/nestedreality.org
  pm2 delete nestedreality
  sudo lsof -ti:3001 | xargs sudo kill -9 2>/dev/null || true
  rm -rf .next
  npm run build
  pm2 start ecosystem.config.js
  pm2 save

  Quick Status Check

  pm2 list
  pm2 logs nestedreality --lines 20
  curl -I http://localhost:3001

  ---
  🎯 Key Learnings for Future Projects

  1. PM2 + npm = Zombies: Always run Node binaries directly under PM2
  2. Auth Headers are Large: Configure nginx buffers for JWT/OAuth flows
  3. Environment Variables: Use .env.local on server, inject via PM2 config
  4. Never sudo build commands: Causes permission nightmares
  5. PM2 caches configs: Always pm2 delete before applying new ecosystem.config.js
  6. Flush logs for debugging: pm2 flush clears old logs that confuse troubleshooting

  ---
  📊 System Status

  ┌────┬────────────────────┬──────┬──────┬────────┬─────────┬──────────┐
  │ id │ name               │ mode │ ↺    │ status │ cpu     │ memory   │
  ├────┼────────────────────┼──────┼──────┼────────┼─────────┼──────────┤
  │ 0  │ nestedreality      │ fork │ 0    │ online │ 0%      │ 57.9mb   │
  └────┴────────────────────┴──────┴──────┴────────�─────────┴──────────┘

  Logs:
    ▲ Next.js 15.1.7
    - Local:        http://127.0.0.1:3001
    - Network:      http://127.0.0.1:3001
    ✓ Starting...
    ✓ Ready in 2.9s

  ---
  ✅ Verification Checklist

  - Website loads: https://nestedreality.org
  - Login works with Google OAuth
  - Redirects to production URL (not localhost)
  - Auth callback completes successfully
  - Privacy policy accessible: https://nestedreality.org/privacy
  - PM2 process stable (no restart loops)
  - No 502 errors on auth flow
  - Environment variables loaded correctly

  ---
  🎊 Final Status

  Production URL: https://nestedreality.org
  Authentication: ✅ Working
  Privacy Policy: ✅ Live
  Google Ads: ✅ Ready for verification
  Deployment: ✅ Stable

  Time to Resolution: ~2 hours
  Issues Resolved: 5 major
  Coffee Consumed: ☕☕☕

  ---
  Deployment completed successfully! The Nested Reality is now nested in production reality. 🎉
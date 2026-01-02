# Next.js v2 Deployment Guide
**Hostinger VPS → nestedreality.org**

---

## 📋 Architecture Overview

**Next.js 16** is a full-stack framework that requires a **running Node.js server** (unlike static React sites).

**Deployment Flow:**
```
User Browser → Nginx (Port 443) → Next.js Server (Port 3000) → Supabase
```

---

## 📋 Server Requirements

**Minimum Specifications** ✅ (Your server likely exceeds these)
- OS: Ubuntu 20.04+ or Debian 10+
- RAM: 2GB minimum (4GB recommended for Next.js)
- CPU: 2 cores minimum
- Storage: 20GB SSD

**Required Software**
- Node.js: 20.x LTS
- Nginx: 1.18+
- PM2: Process manager for Node.js
- Certbot: For SSL certificates
- Git: For code deployment

---

## 📝 Step-by-Step Deployment

### Phase 1: Initial Server Setup

**SSH into your server:**
```bash
ssh root@69.62.73.225
```

**1. Update system packages**
```bash
apt update && apt upgrade -y
```

**2. Install essential packages**
```bash
apt install -y curl wget git unzip nginx
```

**3. Install Node.js 20.x via NodeSource**
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
node --version  # Should show v20.x.x
npm --version
```

**4. Install PM2 (Process Manager)**
```bash
npm install -g pm2
pm2 --version
```

**5. Configure firewall**
```bash
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw allow 3000  # Next.js default port
ufw enable
ufw status
```

**6. Install Nginx**
```bash
apt install -y nginx
systemctl enable nginx
systemctl start nginx
```

**7. Install Certbot for SSL**
```bash
apt install -y certbot python3-certbot-nginx
```

---

### Phase 2: DNS Configuration

**Before deploying, configure DNS records:**

Log into your domain registrar (where you bought nestedreality.org) and add:

| Type | Name | Value |
|------|------|-------|
| A | @ | 69.62.73.225 |
| A | www | 69.62.73.225 |

**Wait for DNS propagation** (can take 10 min to 24 hours):
```bash
# Check from your local machine
nslookup nestedreality.org
```

✅ *You already confirmed this is working!*

---

### Phase 3: Deploy Next.js Application

**1. Create deployment directory**
```bash
mkdir -p /var/www/nestedreality.org
```

**2. Clone repository**
```bash
cd /var/www
git clone https://github.com/narunbabu/nested-reality-v2.git nestedreality.org
cd nestedreality.org
```

**3. Install dependencies and build**
```bash
npm install
npm run build
```

**4. Set up environment variables**
```bash
# Create production .env file
nano .env.production
```

**Add your environment variables:**
```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Google Gemini AI
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key

# Next.js Configuration
NEXT_PUBLIC_APP_URL=https://nestedreality.org
```

**Save with Ctrl+O, Enter, Ctrl+X**

**5. Test the application locally**
```bash
npm start
```

You should see:
```
▲ Next.js 16.1.1
- Local:        http://localhost:3000
- Network:      http://69.62.73.225:3000

✓ Ready in Xms
```

**Stop with Ctrl+C** (we'll use PM2 next)

---

### Phase 4: Run with PM2 (Process Manager)

PM2 keeps your Next.js app running forever and restarts it automatically if it crashes.

**1. Create PM2 ecosystem file**
```bash
nano ecosystem.config.js
```

**Paste this configuration:**
```javascript
module.exports = {
  apps: [
    {
      name: 'nested-reality',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3000',
      cwd: '/var/www/nestedreality.org',
      instances: 1,
      exec_mode: 'cluster',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      error_file: '/var/log/pm2/nested-reality-error.log',
      out_file: '/var/log/pm2/nested-reality-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
    }
  ]
};
```

**Save with Ctrl+O, Enter, Ctrl+X**

**2. Create PM2 log directory**
```bash
mkdir -p /var/log/pm2
```

**3. Start application with PM2**
```bash
cd /var/www/nestedreality.org
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

**4. Verify PM2 is running**
```bash
pm2 status
pm2 logs nested-reality
```

You should see:
```
┌────┬─────────────────┬─────────┬─────────┐
│ id │ name            │ status  │ cpu     │
├────┼─────────────────┼─────────┼─────────┤
│ 0  │ nested-reality  │ online  │ 0%      │
└────┴─────────────────┴─────────┴─────────┘
```

---

### Phase 5: Nginx Configuration

Nginx will act as a reverse proxy, forwarding HTTPS requests to your Next.js app.

**1. Create Nginx config**
```bash
nano /etc/nginx/sites-available/nestedreality.org
```

**Paste this configuration:**
```nginx
# HTTP to HTTPS redirect
server {
    listen 80;
    listen [::]:80;
    server_name nestedreality.org www.nestedreality.org;
    return 301 https://$host$request_uri;
}

# HTTPS server
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name nestedreality.org www.nestedreality.org;

    # SSL certificates (will be added by Certbot)
    # ssl_certificate /etc/letsencrypt/live/nestedreality.org/fullchain.pem;
    # ssl_certificate_key /etc/letsencrypt/live/nestedreality.org/privkey.pem;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Increase client body size for file uploads
    client_max_body_size 10M;

    # Proxy to Next.js server
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;

        # WebSocket support (for hot reload in dev)
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';

        # Headers
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Timeouts
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;

        # Disable buffering
        proxy_buffering off;
    }

    # Next.js static files caching
    location /_next/static {
        proxy_pass http://127.0.0.1:3000;
        proxy_cache_valid 200 60m;
        add_header Cache-Control "public, immutable";
    }

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript application/json;

    # ACME challenge for Let's Encrypt
    location ^~ /.well-known/acme-challenge/ {
        allow all;
        default_type "text/plain";
        try_files $uri =404;
    }
}
```

**Save with Ctrl+O, Enter, Ctrl+X**

**2. Enable site**
```bash
ln -s /etc/nginx/sites-available/nestedreality.org /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

---

### Phase 6: SSL Certificate Setup

**1. Obtain SSL certificate**
```bash
certbot --nginx -d nestedreality.org -d www.nestedreality.org
```

Follow the prompts:
- Enter email address for renewal notices
- Agree to Terms of Service
- Choose whether to share email (optional)
- **Choose "Redirect" option 2** when asked about HTTP→HTTPS redirect

**2. Verify SSL**
```bash
certbot certificates
certbot renew --dry-run
```

---

### Phase 7: Verify Deployment

**1. Check PM2 status**
```bash
pm2 status
pm2 logs nested-reality --lines 50
```

**2. Check Nginx status**
```bash
systemctl status nginx
```

**3. Test from server**
```bash
curl http://localhost:3000
# Should return HTML from your Next.js app

curl -I https://nestedreality.org
# Should return HTTP/2 200
```

**4. Open in browser**
- https://nestedreality.org
- https://www.nestedreality.org

---

## 🔄 Update Deployment

When you need to update the site:

**Option A: Manual SSH update**
```bash
ssh root@69.62.73.225

cd /var/www/nestedreality.org
git pull origin main
npm install
npm run build
pm2 restart nested-reality
```

**Option B: GitHub Actions (Recommended for automation)**

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy Next.js to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Deploy to server
        uses: appleboy/ssh-action@v1.0.0
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SERVER_SSH_KEY }}
          script: |
            cd /var/www/nestedreality.org
            git pull origin main
            npm install
            npm run build
            pm2 restart nested-reality
```

**Add GitHub Secrets:**
1. Go to: https://github.com/narunbabu/nested-reality-v2/settings/secrets/actions
2. Add:
   - `SERVER_HOST`: `69.62.73.225`
   - `SERVER_USER`: `root`
   - `SERVER_SSH_KEY`: Your private SSH key (contents of `~/.ssh/id_rsa`)

---

## 🔒 Security Hardening

**1. SSH hardening**
```bash
nano /etc/ssh/sshd_config
```
Change/add these lines:
```
PermitRootLogin prohibit-password
PasswordAuthentication no
PubkeyAuthentication yes
```
```bash
systemctl restart sshd
```

**2. Install fail2ban**
```bash
apt install -y fail2ban
systemctl enable fail2ban
systemctl start fail2ban
```

**3. Automatic security updates**
```bash
apt install -y unattended-upgrades
dpkg-reconfigure --priority=low unattended-upgrades
```

**4. Secure environment variables**
```bash
chmod 600 .env.production
chown root:root .env.production
```

---

## 🚨 Troubleshooting

**Issue: Next.js app not starting**
```bash
# Check PM2 logs
pm2 logs nested-reality --lines 100

# Check if port 3000 is in use
netstat -tlnp | grep 3000

# Restart PM2
pm2 restart nested-reality
pm2 reset nested-reality
```

**Issue: Nginx 502 Bad Gateway**
```bash
# Check if Next.js is running
pm2 status

# Check Nginx error logs
tail -50 /var/log/nginx/error.log

# Test Next.js directly
curl http://localhost:3000
```

**Issue: Build fails**
```bash
# Clear cache and rebuild
cd /var/www/nestedreality.org
rm -rf .next node_modules
npm install
npm run build
```

**Issue: Environment variables not working**
```bash
# Verify .env.production exists
cat .env.production

# Check PM2 has access to env vars
pm2 restart nested-reality --update-env
```

**Issue: Supabase connection errors**
```bash
# Verify environment variables
grep SUPABASE .env.production

# Test Supabase connection from server
curl https://your-project.supabase.co/rest/v1/
```

---

## 📊 Monitoring & Maintenance

**PM2 Monitoring**
```bash
# Real-time monitoring
pm2 monit

# View logs
pm2 logs nested-reality

# View detailed info
pm2 show nested-reality
```

**Check disk space**
```bash
df -h
```

**Check memory**
```bash
free -h
pm2 status
```

**View Nginx logs**
```bash
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

**Health check script**
```bash
#!/bin/bash
echo "=== Nested Reality Health Check ==="
echo "Time: $(date)"
echo ""

# Check PM2
if pm2 status | grep -q "online"; then
    echo "✅ Next.js (PM2): Running"
else
    echo "❌ Next.js (PM2): STOPPED"
fi

# Check Nginx
if systemctl is-active --quiet nginx; then
    echo "✅ Nginx: Running"
else
    echo "❌ Nginx: STOPPED"
fi

# Check HTTPS
if curl -Is https://nestedreality.org | head -1 | grep -q "200"; then
    echo "✅ HTTPS: Working"
else
    echo "❌ HTTPS: Not responding"
fi

# Disk usage
echo ""
echo "Disk Usage:"
df -h / | tail -1

# Memory
echo ""
echo "Memory Usage:"
free -h | grep Mem

echo ""
echo "=== End Health Check ==="
```

---

## ✅ Post-Deployment Checklist

- [ ] DNS records configured (A records for @ and www)
- [ ] DNS propagated ✅ (confirmed)
- [ ] Node.js 20.x installed
- [ ] PM2 installed and configured
- [ ] Next.js application built successfully (`npm run build`)
- [ ] Environment variables configured (`.env.production`)
- [ ] PM2 process running (`pm2 status`)
- [ ] Nginx configured and running
- [ ] SSL certificate issued (HTTPS working)
- [ ] Auto-renewal configured (certbot)
- [ ] Firewall configured (UFW enabled)
- [ ] Site accessible at https://nestedreality.org
- [ ] All pages load correctly
- [ ] Supabase integration working (if applicable)

---

## 📞 Support & Resources

- Next.js Deployment: https://nextjs.org/docs/deployment
- PM2 Documentation: https://pm2.keymetrics.io/
- Nginx Documentation: https://nginx.org/en/docs/
- Let's Encrypt: https://letsencrypt.org/

---

**Estimated deployment time: 45-90 minutes**

**Good luck with your deployment! 🎉**

#!/bin/bash

# Nested Reality Deployment Script
# Usage: ./deploy.sh

set -e  # Exit on any error

echo "=================================================="
echo "🚀 Starting Nested Reality Deployment"
echo "=================================================="
echo ""

# Navigate to project directory
cd /var/www/nestedreality.org

# Display current status
echo "📊 Current PM2 Status:"
pm2 status || echo "No PM2 processes running"
echo ""

# Pull latest changes from GitHub
echo "📥 Pulling latest changes from GitHub..."
git pull origin main
echo "✅ Git pull completed"
echo ""

# Stop PM2 process completely (not just restart)
echo "🛑 Stopping PM2 process..."
pm2 delete nestedreality || echo "Process not found, continuing..."
echo ""

# Kill any lingering processes on port 3001
echo "🔪 Ensuring port 3001 is free..."
sudo fuser -k 3001/tcp || echo "Port already free"
sleep 2
echo ""

# Clean build directory to prevent chunk loading errors
echo "🧹 Cleaning old build files..."
rm -rf .next
echo "✅ Old build files removed"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install
echo "✅ Dependencies installed"
echo ""

# Clear npm cache for clean build
echo "🗑️  Clearing npm cache..."
npm cache clean --force
echo "✅ Cache cleared"
echo ""

# Build the application
echo "🔨 Building Next.js application..."
npm run build
echo "✅ Build completed"
echo ""

# Start fresh PM2 process
echo "▶️  Starting PM2 process..."
pm2 start ecosystem.config.js
pm2 save
echo "✅ PM2 started"
echo ""

# Show final status
echo "📊 Updated PM2 Status:"
pm2 status
echo ""

# Show recent logs
echo "📋 Recent logs (last 20 lines):"
pm2 logs nestedreality --lines 20 --nostream
echo ""

# Test the application
echo "🧪 Testing application..."
sleep 5
if curl -f -s -I http://localhost:3001 > /dev/null; then
    echo "✅ Application is responding on port 3001"
else
    echo "❌ WARNING: Application not responding on port 3001"
    echo "Check logs with: pm2 logs nestedreality"
fi
echo ""

echo "=================================================="
echo "✅ Deployment completed successfully!"
echo "=================================================="
echo ""
echo "🌐 Check your site: https://nestedreality.org"
echo "💡 Hard refresh your browser (Ctrl+Shift+R) to clear cached chunks"
echo ""

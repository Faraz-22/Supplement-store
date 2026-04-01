# 🚀 FITPRO E-COMMERCE - COMPLETE DEPLOYMENT GUIDE

## 📋 TABLE OF CONTENTS
1. [Prerequisites](#prerequisites)
2. [Local Development Setup](#local-development-setup)
3. [Database Setup](#database-setup)
4. [Environment Configuration](#environment-configuration)
5. [Production Deployment](#production-deployment)
6. [Post-Deployment](#post-deployment)
7. [Troubleshooting](#troubleshooting)

---

## 1. PREREQUISITES

### Required Tools
- **Node.js**: v18.x or higher
- **npm** or **yarn**: Latest version
- **PostgreSQL**: v14 or higher
- **Git**: Latest version

### Required Accounts
- **Vercel** (for frontend deployment)
- **Railway/Supabase** (for PostgreSQL database)
- **Cloudinary** (for image storage)
- **Razorpay** (for payment gateway)

---

## 2. LOCAL DEVELOPMENT SETUP

### Step 1: Clone Repository
```bash
git clone https://github.com/yourusername/fitness-ecommerce.git
cd fitness-ecommerce
```

### Step 2: Install Dependencies
```bash
npm install
# or
yarn install
```

### Step 3: Environment Setup
```bash
# Copy environment template
cp .env.example .env.local

# Edit .env.local with your credentials
nano .env.local  # or use your preferred editor
```

### Step 4: Database Setup (Local PostgreSQL)
```bash
# Install PostgreSQL if not installed
# Mac: brew install postgresql@14
# Ubuntu: sudo apt-get install postgresql-14

# Start PostgreSQL service
# Mac: brew services start postgresql@14
# Ubuntu: sudo systemctl start postgresql

# Create database
createdb fitness_ecommerce

# Update DATABASE_URL in .env.local
DATABASE_URL="postgresql://username:password@localhost:5432/fitness_ecommerce"
```

### Step 5: Initialize Prisma
```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database
npx prisma db push

# Seed initial data
npm run db:seed
```

### Step 6: Run Development Server
```bash
npm run dev

# Server will start at http://localhost:3000
```

### Step 7: Access Admin Panel
```
URL: http://localhost:3000/admin
Default Credentials:
  Email: admin@fitpro.com
  Password: Admin@123
```

---

## 3. DATABASE SETUP

### Option 1: Railway (Recommended)

#### 1. Create Railway Account
- Go to https://railway.app
- Sign up with GitHub

#### 2. Create New Project
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Create new project
railway init

# Add PostgreSQL
railway add postgresql
```

#### 3. Get Database URL
```bash
railway variables

# Copy the DATABASE_URL value
# It looks like: postgresql://postgres:xxx@containers.railway.app:5432/railway
```

#### 4. Update .env.local
```env
DATABASE_URL="your-railway-postgres-url"
```

#### 5. Run Migrations
```bash
npx prisma db push
npm run db:seed
```

### Option 2: Supabase

#### 1. Create Supabase Account
- Go to https://supabase.com
- Create new project
- Wait for database provisioning (2-3 minutes)

#### 2. Get Connection String
- Go to Project Settings → Database
- Copy "Connection string" under "Connection pooling"
- Use "Transaction mode" for Prisma

#### 3. Update .env.local
```env
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
```

#### 4. Update Prisma Schema
```prisma
datasource db {
  provider          = "postgresql"
  url               = env("DATABASE_URL")
  directUrl         = env("DIRECT_URL")
}
```

#### 5. Run Migrations
```bash
npx prisma db push
npm run db:seed
```

---

## 4. ENVIRONMENT CONFIGURATION

### Cloudinary Setup

#### 1. Create Account
- Go to https://cloudinary.com
- Sign up (free tier available)

#### 2. Get Credentials
- Dashboard → Account Details
- Copy: Cloud Name, API Key, API Secret

#### 3. Add to .env.local
```env
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

### Razorpay Setup

#### 1. Create Account
- Go to https://razorpay.com
- Complete business verification
- Start with Test Mode

#### 2. Get API Keys
- Dashboard → Settings → API Keys
- Generate Test Keys

#### 3. Add to .env.local
```env
RAZORPAY_KEY_ID="rzp_test_xxxxxxxxxxxxx"
RAZORPAY_KEY_SECRET="your-secret-key"
NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_test_xxxxxxxxxxxxx"
```

### JWT Secret Generation
```bash
# Generate secure random string
openssl rand -base64 32

# Add to .env.local
JWT_SECRET="generated-random-string"
```

### Complete .env.local Example
```env
# Database
DATABASE_URL="postgresql://user:pass@host:5432/dbname"

# JWT
JWT_SECRET="your-super-secret-jwt-key-min-32-chars"

# Cloudinary
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="123456789012345"
CLOUDINARY_API_SECRET="your-secret"

# Razorpay
RAZORPAY_KEY_ID="rzp_test_xxxxx"
RAZORPAY_KEY_SECRET="your-secret"
NEXT_PUBLIC_RAZORPAY_KEY_ID="rzp_test_xxxxx"

# App URLs
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_API_URL="http://localhost:3000/api"

# Admin
ADMIN_EMAIL="admin@fitpro.com"
ADMIN_PASSWORD="Admin@123"
```

---

## 5. PRODUCTION DEPLOYMENT

### Deploy to Vercel

#### 1. Install Vercel CLI
```bash
npm install -g vercel
```

#### 2. Login to Vercel
```bash
vercel login
```

#### 3. Deploy
```bash
# Initial deployment
vercel

# Production deployment
vercel --prod
```

#### 4. Add Environment Variables
Go to Vercel Dashboard → Project → Settings → Environment Variables

Add all variables from .env.local:
- DATABASE_URL
- JWT_SECRET
- CLOUDINARY_CLOUD_NAME
- CLOUDINARY_API_KEY
- CLOUDINARY_API_SECRET
- RAZORPAY_KEY_ID
- RAZORPAY_KEY_SECRET
- NEXT_PUBLIC_RAZORPAY_KEY_ID
- NEXT_PUBLIC_APP_URL (use your vercel domain)

#### 5. Redeploy
```bash
vercel --prod
```

### Alternative: Deploy via GitHub

#### 1. Push to GitHub
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

#### 2. Connect to Vercel
- Go to https://vercel.com
- New Project → Import Git Repository
- Select your repository
- Add environment variables
- Deploy

---

## 6. POST-DEPLOYMENT

### Database Migrations in Production
```bash
# Set production DATABASE_URL
export DATABASE_URL="your-production-db-url"

# Run migrations
npx prisma db push

# Seed database
npm run db:seed
```

### Verify Deployment Checklist
- [ ] Homepage loads correctly
- [ ] Products page displays items
- [ ] Admin panel is accessible
- [ ] Image uploads work (Cloudinary)
- [ ] Test order placement
- [ ] Test payment flow (Razorpay Test Mode)
- [ ] Email notifications (if configured)
- [ ] Mobile responsiveness

### Enable Production Razorpay
1. Complete KYC in Razorpay Dashboard
2. Get Live API Keys
3. Update environment variables
4. Test with real payment (refund immediately)

### Performance Optimization
```bash
# Build for production
npm run build

# Analyze bundle
npm install -g @next/bundle-analyzer
ANALYZE=true npm run build
```

---

## 7. TROUBLESHOOTING

### Common Issues

#### Issue: "Module not found" errors
```bash
# Solution: Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### Issue: Prisma Client errors
```bash
# Solution: Regenerate Prisma Client
npx prisma generate
```

#### Issue: Database connection timeout
```
# Solution: Check DATABASE_URL format
# Ensure IP whitelist in Railway/Supabase
# Check firewall settings
```

#### Issue: Images not uploading
```
# Solution: Verify Cloudinary credentials
# Check API key permissions
# Ensure proper CORS settings
```

#### Issue: Payment not working
```
# Solution: Verify Razorpay keys
# Check webhook URL configuration
# Enable required payment methods in Razorpay dashboard
```

### Debug Mode
```bash
# Enable verbose logging
DEBUG=* npm run dev

# Check Prisma queries
npx prisma studio

# Test API endpoints
curl http://localhost:3000/api/products
```

### Database Reset (Development Only)
```bash
# WARNING: This deletes all data
npx prisma db push --force-reset
npm run db:seed
```

---

## 8. MONITORING & MAINTENANCE

### Setup Error Tracking (Optional)
```bash
# Install Sentry
npm install @sentry/nextjs

# Configure
npx @sentry/wizard -i nextjs
```

### Setup Analytics (Optional)
```bash
# Add Google Analytics ID to .env.local
NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"
```

### Database Backups
```bash
# Automated backups (Railway)
# Railway provides automatic daily backups

# Manual backup
pg_dump DATABASE_URL > backup.sql

# Restore backup
psql DATABASE_URL < backup.sql
```

### Update Dependencies
```bash
# Check outdated packages
npm outdated

# Update all packages
npm update

# Update Prisma
npm install @prisma/client@latest prisma@latest
npx prisma generate
```

---

## 9. SCALING CONSIDERATIONS

### When to Scale

**Indicators:**
- 1000+ products
- 100+ concurrent users
- 10,000+ orders/month

**Recommended Upgrades:**
1. **Database**: Upgrade Railway/Supabase plan
2. **CDN**: Use Cloudinary CDN for images
3. **Caching**: Add Redis for session/cart storage
4. **Search**: Implement Algolia for product search
5. **Monitoring**: Add Datadog/New Relic

### Redis Setup (Optional)
```bash
# Install Redis client
npm install ioredis

# Add to .env.local
REDIS_URL="redis://localhost:6379"
```

---

## 10. SECURITY CHECKLIST

- [ ] Environment variables secured (not in code)
- [ ] JWT secret is strong (32+ characters)
- [ ] HTTPS enabled in production
- [ ] CORS configured properly
- [ ] Rate limiting on API routes
- [ ] SQL injection prevention (Prisma handles this)
- [ ] XSS protection (React handles this)
- [ ] Input validation (Zod schemas)
- [ ] File upload restrictions (size, type)
- [ ] Admin routes protected

---

## 🎉 DEPLOYMENT COMPLETE!

Your premium fitness e-commerce platform is now live!

**Next Steps:**
1. Add products via admin panel
2. Test complete user journey
3. Configure email notifications
4. Set up Google Analytics
5. Launch marketing campaigns

**Support:**
- Documentation: /docs
- API Reference: /api-docs
- Admin Guide: /admin/help

---

**Built with ❤️ using Next.js, Prisma, and Tailwind CSS**

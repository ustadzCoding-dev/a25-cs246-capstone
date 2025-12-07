# 🚀 Deployment Guide

Panduan lengkap untuk deploy DC-09 ke production.

---

## 📋 Table of Contents

1. [Pre-Deployment](#pre-deployment)
2. [Frontend Deployment (Vercel)](#frontend-deployment-vercel)
3. [Backend Deployment (Railway)](#backend-deployment-railway)
4. [Database Setup (MongoDB Atlas)](#database-setup-mongodb-atlas)
5. [CI/CD Pipeline](#cicd-pipeline)
6. [Post-Deployment](#post-deployment)
7. [Monitoring & Logging](#monitoring--logging)
8. [Troubleshooting](#troubleshooting)

---

## Pre-Deployment

### Pre-Deployment Checklist

- [ ] All tests passing (`npm test`)
- [ ] Code reviewed and merged to main
- [ ] Environment variables configured
- [ ] Database backups created
- [ ] Security audit completed
- [ ] Performance testing done
- [ ] Documentation updated
- [ ] Version number updated in package.json
- [ ] CHANGELOG.md updated
- [ ] Team notified of deployment

### Environment Variables

**Backend Production (.env):**

```env
NODE_ENV=production
PORT=8000
FRONTEND_URL=https://yourdomain.com

MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/capstone-db?retryWrites=true&w=majority

JWT_SECRET=your_super_secret_key_change_this
JWT_EXPIRE=7d

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=https://api.yourdomain.com/api/auth/google/callback

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM=noreply@yourdomain.com

CORS_ORIGIN=https://yourdomain.com
```

**Frontend Production (.env):**

```env
VITE_API_BASE_URL=https://api.yourdomain.com/api
VITE_APP_NAME=DC-09 Capstone
VITE_APP_VERSION=1.0.0
VITE_ENABLE_GOOGLE_OAUTH=true
```

---

## Frontend Deployment (Vercel)

### Step 1: Create Vercel Account

1. Go to https://vercel.com
2. Sign up with GitHub account
3. Authorize Vercel to access your GitHub repositories

### Step 2: Connect GitHub Repository

1. Click "New Project"
2. Select your GitHub repository (A25-CS246)
3. Select "frontend" folder as root directory
4. Click "Deploy"

### Step 3: Configure Environment Variables

1. Go to Project Settings → Environment Variables
2. Add production environment variables:

   - `VITE_API_BASE_URL=https://api.yourdomain.com/api`
   - `VITE_APP_NAME=DC-09 Capstone`
   - `VITE_APP_VERSION=1.0.0`

3. Click "Save"

### Step 4: Configure Custom Domain

1. Go to Project Settings → Domains
2. Click "Add Domain"
3. Enter your domain (e.g., yourdomain.com)
4. Follow DNS configuration instructions
5. Wait for DNS propagation (up to 48 hours)

### Step 5: Enable Auto-Deployment

1. Go to Git → Connected Git Repository
2. Select "main" branch for production
3. Enable "Automatic Deployments"
4. Every push to main will auto-deploy

### Deployment Commands

```bash
# Manual deployment
vercel deploy --prod

# Check deployment status
vercel status

# View logs
vercel logs
```

### Vercel Dashboard

- **URL:** https://vercel.com/dashboard
- **View deployments:** Projects → A25-CS246 → Deployments
- **Check logs:** Deployments → Select deployment → Logs

---

## Backend Deployment (Railway)

### Step 1: Create Railway Account

1. Go to https://railway.app
2. Sign up with GitHub account
3. Authorize Railway to access your GitHub repositories

### Step 2: Create New Project

1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Select your GitHub repository (A25-CS246)
4. Select "backend" folder as root directory

### Step 3: Configure Environment Variables

1. Go to Project → Variables
2. Add production environment variables:

   - `NODE_ENV=production`
   - `PORT=8000`
   - `MONGODB_URI=mongodb+srv://...`
   - `JWT_SECRET=your_secret_key`
   - `GOOGLE_CLIENT_ID=...`
   - `GOOGLE_CLIENT_SECRET=...`
   - `GOOGLE_CALLBACK_URL=https://api.yourdomain.com/api/auth/google/callback`
   - `CLOUDINARY_CLOUD_NAME=...`
   - `CLOUDINARY_API_KEY=...`
   - `CLOUDINARY_API_SECRET=...`
   - `SMTP_HOST=smtp.gmail.com`
   - `SMTP_PORT=587`
   - `SMTP_USER=...`
   - `SMTP_PASS=...`
   - `CORS_ORIGIN=https://yourdomain.com`

3. Click "Save"

### Step 4: Configure Custom Domain

1. Go to Project → Settings → Domain
2. Click "Add Domain"
3. Enter your API domain (e.g., api.yourdomain.com)
4. Follow DNS configuration instructions

### Step 5: Enable Auto-Deployment

1. Go to Project → Settings → GitHub
2. Select "main" branch for production
3. Enable "Auto Deploy"
4. Every push to main will auto-deploy

### Deployment Commands

```bash
# Manual deployment
railway deploy

# Check deployment status
railway status

# View logs
railway logs
```

### Railway Dashboard

- **URL:** https://railway.app/dashboard
- **View deployments:** Projects → A25-CS246 → Deployments
- **Check logs:** Deployments → Select deployment → Logs
- **Monitor:** Projects → A25-CS246 → Metrics

---

## Database Setup (MongoDB Atlas)

### Step 1: Create MongoDB Atlas Account

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for free account
3. Create organization and project

### Step 2: Create Cluster

1. Click "Create a Cluster"
2. Select "M0 Free" tier (for development)
3. Choose region closest to your users
4. Click "Create Cluster"
5. Wait for cluster to be ready (5-10 minutes)

### Step 3: Create Database User

1. Go to "Database Access"
2. Click "Add New Database User"
3. Set username and password
4. Select "Built-in Role" → "Atlas Admin"
5. Click "Add User"

### Step 4: Get Connection String

1. Go to "Clusters"
2. Click "Connect"
3. Choose "Connect your application"
4. Copy connection string
5. Replace `<password>` with your password
6. Replace `<database>` with "capstone-db"

**Example:**

```
mongodb+srv://username:password@cluster.mongodb.net/capstone-db?retryWrites=true&w=majority
```

### Step 5: Configure IP Whitelist

1. Go to "Network Access"
2. Click "Add IP Address"
3. Select "Allow Access from Anywhere" (0.0.0.0/0)
4. Click "Confirm"

**Note:** For production, use specific IP addresses instead

### Step 6: Create Database

1. Go to "Clusters"
2. Click "Browse Collections"
3. Click "Create Database"
4. Database name: "capstone-db"
5. Collection name: "users"
6. Click "Create"

### Step 7: Enable Backups

1. Go to "Clusters"
2. Click "Backup"
3. Enable "Automatic Backup"
4. Set backup frequency: Every 5 minutes
5. Set retention: 35 days

### Step 8: Configure Monitoring

1. Go to "Monitoring"
2. Enable "Real-time Performance Panel"
3. Set up alerts for:
   - High CPU usage
   - High memory usage
   - Connection pool exhaustion
   - Replication lag

---

## CI/CD Pipeline

### GitHub Actions Setup

**File: `.github/workflows/deploy.yml`**

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: "18"

      - name: Install dependencies (Backend)
        run: cd backend && npm install

      - name: Run tests (Backend)
        run: cd backend && npm test

      - name: Install dependencies (Frontend)
        run: cd frontend && npm install

      - name: Run tests (Frontend)
        run: cd frontend && npm test

      - name: Build Frontend
        run: cd frontend && npm run build

  deploy-frontend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Deploy to Vercel
        uses: vercel/action@master
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}

  deploy-backend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2

      - name: Deploy to Railway
        run: |
          npm install -g @railway/cli
          railway deploy
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
```

### GitHub Secrets Setup

1. Go to Repository → Settings → Secrets and variables → Actions
2. Add the following secrets:
   - `VERCEL_TOKEN` - Get from Vercel account settings
   - `VERCEL_ORG_ID` - Get from Vercel project settings
   - `VERCEL_PROJECT_ID` - Get from Vercel project settings
   - `RAILWAY_TOKEN` - Get from Railway account settings

---

## Post-Deployment

### Health Checks

```bash
# Check API health
curl https://api.yourdomain.com/api/health

# Expected response:
# {
#   "success": true,
#   "message": "API is running",
#   "timestamp": "...",
#   "googleOAuth": "configured"
# }
```

### Verify Deployments

1. **Frontend:**

   - Visit https://yourdomain.com
   - Check if application loads
   - Test login functionality
   - Test team registration

2. **Backend:**

   - Check API health endpoint
   - Test API endpoints with Postman
   - Verify database connection
   - Check email notifications

3. **Database:**
   - Verify data integrity
   - Check backup status
   - Test restore procedures

### Performance Testing

```bash
# Load testing with Apache Bench
ab -n 1000 -c 10 https://api.yourdomain.com/api/health

# Load testing with wrk
wrk -t4 -c100 -d30s https://api.yourdomain.com/api/health
```

### Security Verification

- [ ] HTTPS enabled on all endpoints
- [ ] CORS properly configured
- [ ] JWT tokens working
- [ ] Google OAuth working
- [ ] Rate limiting active
- [ ] Security headers present

### Monitoring Setup

1. **Vercel Monitoring:**

   - Go to Project → Analytics
   - Monitor response times
   - Monitor error rates
   - Monitor bandwidth usage

2. **Railway Monitoring:**

   - Go to Project → Metrics
   - Monitor CPU usage
   - Monitor memory usage
   - Monitor network I/O

3. **MongoDB Atlas Monitoring:**
   - Go to Monitoring → Real-time Performance Panel
   - Monitor query performance
   - Monitor connection pool
   - Monitor replication lag

---

## Monitoring & Logging

### Application Logging

**Backend Logs:**

```bash
# View Railway logs
railway logs

# View specific service logs
railway logs -s backend
```

**Frontend Logs:**

```bash
# View Vercel logs
vercel logs

# View build logs
vercel logs --follow
```

### Error Tracking

1. **Setup Sentry (Optional)**

   - Go to https://sentry.io
   - Create new project
   - Add Sentry SDK to backend & frontend
   - Configure error reporting

2. **Monitor Error Rates**
   - Check application logs daily
   - Set up alerts for errors
   - Review error patterns weekly

### Performance Monitoring

1. **Backend Performance:**

   - Monitor API response times
   - Monitor database query times
   - Monitor memory usage
   - Monitor CPU usage

2. **Frontend Performance:**
   - Monitor page load times
   - Monitor Core Web Vitals
   - Monitor bundle size
   - Monitor error rates

### Uptime Monitoring

1. **Setup Uptime Robot (Optional)**
   - Go to https://uptimerobot.com
   - Create monitors for:
     - Frontend: https://yourdomain.com
     - Backend: https://api.yourdomain.com/api/health
   - Set alert frequency: Every 5 minutes

---

## Troubleshooting

### Deployment Failures

**Problem: Build fails on Vercel**

Solution:

1. Check build logs in Vercel dashboard
2. Verify environment variables are set
3. Check for syntax errors
4. Try manual deployment: `vercel deploy --prod`

**Problem: Backend deployment fails on Railway**

Solution:

1. Check deployment logs in Railway dashboard
2. Verify environment variables are set
3. Check Node.js version compatibility
4. Try manual deployment: `railway deploy`

### Runtime Issues

**Problem: API returns 500 error**

Solution:

1. Check backend logs: `railway logs`
2. Check database connection
3. Verify environment variables
4. Check MongoDB Atlas connection string

**Problem: Frontend shows blank page**

Solution:

1. Check browser console for errors
2. Check Vercel logs
3. Verify API URL in environment variables
4. Check CORS configuration

**Problem: Database connection timeout**

Solution:

1. Check MongoDB Atlas IP whitelist
2. Verify connection string
3. Check network connectivity
4. Restart database connection

### Performance Issues

**Problem: Slow API responses**

Solution:

1. Check database query performance
2. Add database indexes
3. Enable caching
4. Optimize API endpoints

**Problem: High memory usage**

Solution:

1. Check for memory leaks
2. Optimize data structures
3. Implement pagination
4. Increase server memory

---

## Rollback Procedures

### Rollback Frontend

```bash
# View deployment history
vercel deployments

# Rollback to previous deployment
vercel rollback <deployment-id>

# Or redeploy from previous commit
git revert <commit-hash>
git push origin main
```

### Rollback Backend

```bash
# View deployment history
railway deployments

# Rollback to previous deployment
railway rollback <deployment-id>

# Or redeploy from previous commit
git revert <commit-hash>
git push origin main
```

### Rollback Database

1. Go to MongoDB Atlas → Backup
2. Select backup point
3. Click "Restore"
4. Select target cluster
5. Confirm restore

---

## Maintenance

### Regular Tasks

- [ ] Monitor logs daily
- [ ] Check performance metrics weekly
- [ ] Review error reports weekly
- [ ] Update dependencies monthly
- [ ] Security audit quarterly
- [ ] Database optimization quarterly
- [ ] Disaster recovery test quarterly

### Backup Strategy

- Automatic backups: Every 5 minutes
- Retention period: 35 days
- Test restore: Monthly
- Off-site backup: Quarterly

---

**Last Updated:** December 8, 2025 | **Version:** 1.0.0

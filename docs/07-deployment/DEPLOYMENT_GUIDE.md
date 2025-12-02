# 🚀 DEPLOYMENT GUIDE

Complete guide for deploying to production.

---

## 📋 Pre-Deployment Checklist

### Code Quality

- [ ] All tests passing
- [ ] No console.log statements
- [ ] ESLint clean
- [ ] Code reviewed

### Security

- [ ] No API keys in code
- [ ] Environment variables configured
- [ ] HTTPS enabled
- [ ] CORS configured
- [ ] Rate limiting enabled

### Database

- [ ] Migrations run
- [ ] Backups created
- [ ] Indexes created
- [ ] Connection tested

### Frontend

- [ ] Build successful
- [ ] Assets optimized
- [ ] No build warnings

---

## 🔧 Environment Setup

### Backend Production Variables

```env
NODE_ENV=production
PORT=8000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db
JWT_SECRET=<strong-secret-min-32-chars>
CORS_ORIGIN=https://yourdomain.com
GOOGLE_CLIENT_ID=<production-id>
GOOGLE_CLIENT_SECRET=<production-secret>
CLOUDINARY_CLOUD_NAME=<cloud-name>
CLOUDINARY_API_KEY=<api-key>
CLOUDINARY_API_SECRET=<api-secret>
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=<email>
SMTP_PASSWORD=<app-password>
```

### Frontend Production Variables

```env
VITE_API_BASE_URL=https://api.yourdomain.com/api
```

---

## 🚀 Backend Deployment (Railway)

### Step 1: Connect Repository

```
1. Go to railway.app
2. Click "New Project"
3. Select "Deploy from GitHub"
4. Connect GitHub account
5. Select repository
```

### Step 2: Configure Environment

```
1. Add environment variables
2. Set NODE_ENV=production
3. Set MONGODB_URI
4. Set all required secrets
```

### Step 3: Deploy

```
1. Railway auto-deploys on push
2. Check deployment status
3. View logs if needed
```

---

## 🎨 Frontend Deployment (Vercel)

### Step 1: Connect Repository

```
1. Go to vercel.com
2. Click "New Project"
3. Select "Import Git Repository"
4. Connect GitHub
5. Select repository
```

### Step 2: Configure

```
1. Set build command: npm run build
2. Set output directory: dist
3. Add environment variables
4. Set VITE_API_BASE_URL
```

### Step 3: Deploy

```
1. Click "Deploy"
2. Wait for build
3. Get production URL
```

---

## 🗄️ Database Setup (MongoDB Atlas)

### Step 1: Create Cluster

```
1. Go to mongodb.com/cloud/atlas
2. Create account
3. Create M0 free cluster
4. Select region
5. Wait for cluster creation
```

### Step 2: Configure Access

```
1. Create database user
2. Add IP whitelist (0.0.0.0/0 for testing)
3. Get connection string
4. Use in MONGODB_URI
```

### Step 3: Create Database

```
1. Create database: dicoding-capstone
2. Create collections
3. Add indexes
```

---

## 🔐 SSL/HTTPS Setup

### Using Let's Encrypt (Free)

```
1. Install Certbot
2. Run: certbot certonly --standalone -d yourdomain.com
3. Configure nginx/apache
4. Auto-renew enabled
```

### Using Cloudflare (Free)

```
1. Add domain to Cloudflare
2. Update nameservers
3. Enable SSL (Flexible)
4. Auto-renew included
```

---

## 📊 Post-Deployment Verification

### Health Checks

```
GET /api/health
Expected: { success: true, message: "API is running" }
```

### Database Connection

```
Check MongoDB Atlas dashboard
Verify connection count
Check operation metrics
```

### Frontend Access

```
Visit https://yourdomain.com
Check console for errors
Verify API calls work
```

---

## 🔄 Continuous Deployment

### GitHub Actions (Auto-Deploy)

```
1. Create .github/workflows/deploy.yml
2. Configure triggers (push to main)
3. Run tests
4. Build
5. Deploy to production
```

---

## 🆘 Troubleshooting

### Deployment fails

- Check build logs
- Verify environment variables
- Check database connection
- Review error messages

### API not responding

- Check backend logs
- Verify database connection
- Check rate limiting
- Restart application

### Frontend not loading

- Check build output
- Verify API base URL
- Check CORS settings
- Clear browser cache

---

## 📈 Monitoring

### Application Monitoring

- Error tracking: Sentry
- Performance: DataDog
- Uptime: UptimeRobot

### Database Monitoring

- MongoDB Atlas dashboard
- Connection metrics
- Query performance
- Storage usage

---

**Last Updated:** 30 November 2025

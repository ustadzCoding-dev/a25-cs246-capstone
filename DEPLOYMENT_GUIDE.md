# Deployment Guide

## Prerequisites

- Node.js 18+
- MongoDB 5+
- npm or yarn
- Git
- Docker (optional)

---

## Environment Setup

### 1. Backend Environment Variables

Create `.env` file in `backend/` directory:

```env
# Server
NODE_ENV=production
PORT=8000
API_BASE_URL=https://api.yourdomain.com

# Database
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/dbname
DB_NAME=dicoding_capstone

# JWT
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_REFRESH_SECRET=your-super-secret-refresh-key-min-32-chars
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=https://api.yourdomain.com/auth/google/callback

# File Upload
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760

# Logging
LOG_LEVEL=info
LOG_FILE=./logs/app.log

# CORS
CORS_ORIGIN=https://yourdomain.com

# Email (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### 2. Frontend Environment Variables

Create `.env.production` file in `frontend/` directory:

```env
VITE_API_BASE_URL=https://api.yourdomain.com/api
VITE_APP_NAME=Dicoding Capstone
VITE_APP_VERSION=1.0.0
```

---

## Deployment Steps

### 1. Backend Deployment

#### Option A: Traditional Server

```bash
# 1. Clone repository
git clone https://github.com/your-repo/capstone.git
cd capstone/backend

# 2. Install dependencies
npm install

# 3. Set environment variables
cp .env.example .env
# Edit .env with production values

# 4. Build (if needed)
npm run build

# 5. Run database migrations
npm run db:migrate

# 6. Start server
npm start

# 7. Setup PM2 for process management
npm install -g pm2
pm2 start src/server.js --name "capstone-api"
pm2 save
pm2 startup
```

#### Option B: Docker

```bash
# 1. Build Docker image
docker build -t capstone-api:1.0.0 .

# 2. Run container
docker run -d \
  --name capstone-api \
  -p 8000:8000 \
  --env-file .env \
  -v ./uploads:/app/uploads \
  capstone-api:1.0.0

# 3. Check logs
docker logs -f capstone-api
```

### 2. Frontend Deployment

#### Option A: Netlify

```bash
# 1. Build frontend
cd frontend
npm run build

# 2. Deploy to Netlify
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

#### Option B: Vercel

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Deploy
vercel --prod
```

#### Option C: Traditional Server

```bash
# 1. Build frontend
npm run build

# 2. Copy dist to web server
cp -r dist/* /var/www/html/

# 3. Configure nginx/apache
# See nginx.conf example below
```

---

## Production Checklist

### Pre-Deployment

- [ ] All tests passing
- [ ] Code coverage > 70%
- [ ] No security vulnerabilities
- [ ] Environment variables set
- [ ] Database backups configured
- [ ] SSL certificates ready
- [ ] CDN configured
- [ ] Monitoring setup

### Deployment

- [ ] Backend deployed and running
- [ ] Frontend deployed and accessible
- [ ] Database migrations completed
- [ ] Admin account created
- [ ] Health checks passing
- [ ] Logs being collected

### Post-Deployment

- [ ] Smoke tests passed
- [ ] API endpoints responding
- [ ] Authentication working
- [ ] Database connected
- [ ] File uploads working
- [ ] Error logging working
- [ ] Monitoring alerts active

---

## Monitoring & Maintenance

### Health Check

```bash
curl https://api.yourdomain.com/api/health
```

### View Logs

```bash
# PM2
pm2 logs capstone-api

# Docker
docker logs -f capstone-api

# System logs
tail -f /var/log/app.log
```

### Database Backup

```bash
# MongoDB
mongodump --uri="mongodb+srv://user:pass@cluster.mongodb.net/dbname" \
  --out=/backups/$(date +%Y%m%d)
```

### Update Application

```bash
# Pull latest code
git pull origin main

# Install dependencies
npm install

# Run migrations
npm run db:migrate

# Restart application
pm2 restart capstone-api
```

---

## Troubleshooting

### Issue: API not responding

```bash
# Check if service is running
pm2 status

# Restart service
pm2 restart capstone-api

# Check logs
pm2 logs capstone-api
```

### Issue: Database connection error

```bash
# Check MongoDB connection string
# Verify IP whitelist in MongoDB Atlas
# Check network connectivity
ping cluster.mongodb.net
```

### Issue: File upload not working

```bash
# Check upload directory permissions
chmod 755 ./uploads

# Check disk space
df -h

# Check file size limits in nginx/apache
```

---

## Rollback Procedure

```bash
# 1. Identify last working commit
git log --oneline -10

# 2. Checkout previous version
git checkout <commit-hash>

# 3. Reinstall dependencies
npm install

# 4. Restart application
pm2 restart capstone-api

# 5. Verify health
curl https://api.yourdomain.com/api/health
```

---

## Performance Optimization

### Backend

- Enable gzip compression
- Use Redis for caching
- Optimize database queries
- Enable CDN for static files
- Use load balancer for scaling

### Frontend

- Minify and bundle code
- Lazy load components
- Optimize images
- Enable browser caching
- Use CDN for assets

---

## Security Hardening

- [ ] Enable HTTPS/SSL
- [ ] Configure firewall
- [ ] Setup rate limiting
- [ ] Enable CORS properly
- [ ] Use security headers
- [ ] Regular security updates
- [ ] Monitor for vulnerabilities
- [ ] Setup DDoS protection

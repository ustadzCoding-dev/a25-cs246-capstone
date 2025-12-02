# ⚡ PERFORMANCE GUIDE

Performance optimization strategies and best practices.

---

## 📊 Performance Targets

### Frontend

- Page load: < 3 seconds
- First contentful paint: < 1.5 seconds
- Time to interactive: < 3 seconds
- Lighthouse score: > 90

### Backend

- API response: < 200ms (p95)
- Database query: < 50ms
- Throughput: > 1000 req/sec
- Error rate: < 0.1%

---

## 🎨 Frontend Optimization

### Code Splitting

```javascript
// Lazy load routes
const Dashboard = () => import("@/views/Dashboard.vue");
const Team = () => import("@/views/Team.vue");
```

### Image Optimization

- Use WebP format
- Compress images
- Lazy load images
- Use CDN (Cloudinary)

### Bundle Size

```bash
npm run build
# Check dist/ size
# Target: < 500KB
```

### Caching

- Browser cache: 1 year for assets
- Service worker: Offline support
- HTTP cache headers

---

## 🔧 Backend Optimization

### Database Queries

```javascript
// Add indexes
db.users.createIndex({ email: 1 });
db.capstonegroups.createIndex({ leaderId: 1 });

// Use projections
db.users.find({}, { password: 0 });

// Pagination
db.users.find().limit(10).skip(0);
```

### Connection Pooling

```javascript
mongoose.connect(uri, {
  maxPoolSize: 10,
  minPoolSize: 5,
});
```

### Caching

```javascript
// Redis caching
const cache = await redis.get("key");
if (!cache) {
  const data = await db.query();
  await redis.set("key", data, "EX", 3600);
}
```

---

## 📈 Monitoring Performance

### Frontend Metrics

```javascript
// Web Vitals
import { getCLS, getFID, getFCP, getLCP, getTTFB } from "web-vitals";

getCLS(console.log);
getFID(console.log);
getFCP(console.log);
getLCP(console.log);
getTTFB(console.log);
```

### Backend Metrics

```javascript
// Response time
const start = Date.now();
// ... do work
const duration = Date.now() - start;
logger.info("Request took", { duration });
```

---

## 🔍 Profiling

### Frontend

```bash
# Chrome DevTools
F12 → Performance tab
Record → Perform action → Stop
Analyze results
```

### Backend

```bash
# Node profiler
node --prof server.js
node --prof-process isolate-*.log > profile.txt
```

---

## 🚀 Deployment Optimization

### Frontend Build

```bash
npm run build
# Minification
# Tree shaking
# Code splitting
# Asset optimization
```

### Backend Deployment

- Use production mode
- Enable compression
- Configure caching headers
- Use CDN for static files

---

## 📊 Performance Checklist

- [ ] Page load < 3 seconds
- [ ] API response < 200ms
- [ ] Bundle size < 500KB
- [ ] Lighthouse > 90
- [ ] Database indexes created
- [ ] Caching configured
- [ ] Images optimized
- [ ] Code splitting enabled

---

## 🔗 Performance Tools

- **Lighthouse** - Page speed analysis
- **WebPageTest** - Detailed performance metrics
- **Chrome DevTools** - Browser profiling
- **New Relic** - Application monitoring
- **DataDog** - Infrastructure monitoring

---

**Last Updated:** 30 November 2025

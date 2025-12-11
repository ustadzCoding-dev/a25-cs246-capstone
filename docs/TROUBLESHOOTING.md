# 🔧 Troubleshooting Guide

Panduan mengatasi masalah umum pada DC-09 Capstone Project Management System.

---

## 📋 Table of Contents

1. [Backend Issues](#backend-issues)
2. [Frontend Issues](#frontend-issues)
3. [Database Issues](#database-issues)
4. [Deployment Issues](#deployment-issues)
5. [Performance Issues](#performance-issues)
6. [Debug Commands](#debug-commands)

---

## Backend Issues

### 500 Internal Server Error

**Problem:** API returns 500 error

**Causes & Solutions:**

1. **Database Connection Failed**

   ```bash
   # Check MongoDB connection
   mongosh

   # Verify connection string in .env
   echo $MONGODB_URI

   # Restart MongoDB
   brew services restart mongodb-community  # macOS
   ```

2. **Missing Environment Variables**

   ```bash
   # Check .env file
   cat backend/.env

   # Add missing variables
   cp backend/.env.example backend/.env
   ```

3. **Unhandled Exception**

   ```bash
   # Check server logs
   npm run dev  # Look for error messages

   # Check error handler
   # Verify error handling in controllers
   ```

**Solution:**

1. Check backend logs
2. Verify environment variables
3. Check database connection
4. Restart server

---

### JWT Token Invalid

**Problem:** "Invalid token" error

**Causes & Solutions:**

1. **Token Expired**

   - Token expires after 7 days
   - User needs to login again

2. **Wrong Secret Key**

   ```bash
   # Verify JWT_SECRET in .env
   echo $JWT_SECRET
   ```

3. **Token Malformed**
   - Check Authorization header format
   - Should be: `Authorization: Bearer <token>`

**Solution:**

1. Clear localStorage
2. Login again
3. Verify JWT_SECRET

---

### Email Not Sending

**Problem:** Emails not received or "Connection timeout" error

**Causes & Solutions:**

1. **SMTP Connection Timeout (Railway)**

   **Symptom:** `Connection timeout` error in logs

   ```
   [ERROR] Failed to send invitation email: Connection timeout
   ```

   **Causes:**

   - Railway IP blocked by Gmail security
   - Port 587 (TLS) may be blocked
   - Network firewall restrictions

   **Solutions:**

   a) **Use Port 465 (SSL) instead of 587:**

   ```env
   SMTP_PORT=465
   SMTP_SECURE=true
   ```

   b) **Use SendGrid (Recommended for Production):**

   ```env
   SENDGRID_API_KEY=your_api_key
   SENDGRID_FROM_EMAIL=noreply@yourdomain.com
   ```

   - Sign up: https://sendgrid.com
   - Free tier: 100 emails/day
   - More reliable than Gmail SMTP from Railway

   c) **Use Mailgun (Alternative):**

   ```env
   MAILGUN_API_KEY=your_api_key
   MAILGUN_DOMAIN=your_domain
   ```

   - Sign up: https://mailgun.com
   - Free tier: 5000 emails/month

2. **Gmail App Password Issues**

   ```bash
   # Use App Password, not regular password
   # Generate at: https://myaccount.google.com/apppasswords

   # Requirements:
   # - 2FA must be enabled
   # - Use 16-character app password
   # - Not your Gmail password

   # Verify SMTP credentials in .env
   echo $SMTP_USER
   echo $SMTP_PASSWORD
   ```

3. **SMTP Configuration**

   ```bash
   # Test SMTP connection locally
   telnet smtp.gmail.com 465
   # or
   telnet smtp.gmail.com 587
   ```

4. **Email Blocked**
   - Check Gmail spam folder
   - Check email filters
   - Verify sender email is whitelisted

**Solution Priority:**

1. **Local Development:** Use Gmail SMTP (port 465)
2. **Production (Railway):** Use SendGrid or Mailgun
3. **Conditional Setup:** Use environment-based email service

**Example Conditional Setup:**

```javascript
// EmailService.js
if (process.env.NODE_ENV === "production") {
  // Use SendGrid
} else {
  // Use Gmail SMTP
}
```

---

### File Upload Failed

**Problem:** Cannot upload documents

**Causes & Solutions:**

1. **Cloudinary Credentials**

   ```bash
   # Verify Cloudinary credentials in .env
   echo $CLOUDINARY_CLOUD_NAME
   echo $CLOUDINARY_API_KEY
   ```

2. **File Too Large**

   - Maximum file size: 50MB
   - Check file size before upload

3. **Invalid File Type**
   - Allowed: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX
   - Check file extension

**Solution:**

1. Verify Cloudinary credentials
2. Check file size
3. Check file type
4. Check network connection

---

## Frontend Issues

### Blank Page

**Problem:** Frontend shows blank page

**Causes & Solutions:**

1. **Build Error**

   ```bash
   # Check for build errors
   npm run build

   # Check console for errors (F12)
   ```

2. **API Connection Failed**

   ```bash
   # Verify API URL in .env
   echo $VITE_API_BASE_URL

   # Check if backend is running
   curl http://localhost:8000/api/health
   ```

3. **Router Configuration**
   - Check router/index.js
   - Verify route definitions

**Solution:**

1. Check browser console (F12)
2. Check Vite build output
3. Verify API URL
4. Restart dev server

---

### API Call Fails

**Problem:** "Failed to fetch" or CORS error

**Causes & Solutions:**

1. **CORS Error**

   ```bash
   # Verify CORS configuration in backend
   # Check server.js for CORS settings

   # Should allow frontend URL
   CORS_ORIGIN=http://localhost:5173
   ```

2. **Backend Not Running**

   ```bash
   # Check if backend is running
   curl http://localhost:8000/api/health

   # Start backend
   cd backend && npm run dev
   ```

3. **Wrong API URL**
   ```bash
   # Verify API URL in .env
   VITE_API_BASE_URL=http://localhost:8000/api
   ```

**Solution:**

1. Check CORS configuration
2. Start backend server
3. Verify API URL
4. Check network tab (F12)

---

### State Management Issues

**Problem:** Pinia store not updating

**Causes & Solutions:**

1. **Store Not Initialized**

   ```javascript
   // Verify store is imported and used
   import { useAuthStore } from "@/stores/authStore";
   const store = useAuthStore();
   ```

2. **Async Action Not Awaited**

   ```javascript
   // Make sure to await async actions
   await store.fetchTeams();
   ```

3. **Component Not Reactive**
   ```vue
   <!-- Use ref or computed for reactivity -->
   <script setup>
   import { computed } from "vue";
   const store = useAuthStore();
   const user = computed(() => store.user);
   </script>
   ```

**Solution:**

1. Check store initialization
2. Await async actions
3. Use computed for reactivity
4. Check Vue DevTools

---

## Database Issues

### Connection Timeout

**Problem:** "Connection timeout" error

**Causes & Solutions:**

1. **MongoDB Not Running**

   ```bash
   # Check if MongoDB is running
   mongosh

   # Start MongoDB
   brew services start mongodb-community  # macOS
   ```

2. **Wrong Connection String**

   ```bash
   # Verify connection string
   echo $MONGODB_URI

   # Format should be:
   # mongodb://localhost:27017/capstone-db
   # or
   # mongodb+srv://user:pass@cluster.mongodb.net/db
   ```

3. **Network Issue**
   ```bash
   # Check network connectivity
   ping 8.8.8.8
   ```

**Solution:**

1. Start MongoDB
2. Verify connection string
3. Check network connectivity
4. Check firewall settings

---

### Duplicate Key Error

**Problem:** "E11000 duplicate key error"

**Causes & Solutions:**

1. **Unique Index Violation**

   - Email already exists
   - Team name already exists
   - User ID already in team

2. **Fix:**

   ```bash
   # Drop problematic index
   db.users.dropIndex('email_1')

   # Or delete duplicate document
   db.users.deleteOne({ email: 'duplicate@example.com' })
   ```

**Solution:**

1. Check for duplicates
2. Delete duplicate records
3. Verify unique constraints

---

### Query Timeout

**Problem:** Database query takes too long

**Causes & Solutions:**

1. **Missing Index**

   ```bash
   # Add index to frequently queried fields
   db.capstonegroups.createIndex({ status: 1 })
   db.users.createIndex({ email: 1 })
   ```

2. **Large Dataset**

   - Implement pagination
   - Limit query results

3. **Complex Query**
   - Optimize query logic
   - Use aggregation pipeline

**Solution:**

1. Add indexes
2. Implement pagination
3. Optimize queries
4. Monitor query performance

---

## Deployment Issues

### Build Fails on Vercel

**Problem:** Vercel build fails

**Causes & Solutions:**

1. **Environment Variables Missing**

   - Go to Vercel → Settings → Environment Variables
   - Add all required variables

2. **Node Version Mismatch**

   ```bash
   # Specify Node version
   # Create .nvmrc file with: 18.0.0
   ```

3. **Build Script Error**
   ```bash
   # Test build locally
   npm run build
   ```

**Solution:**

1. Check Vercel logs
2. Add environment variables
3. Test build locally
4. Check Node version

---

### Backend Deployment Fails on Railway

**Problem:** Railway deployment fails

**Causes & Solutions:**

1. **Environment Variables Missing**

   - Go to Railway → Variables
   - Add all required variables

2. **Port Configuration**

   - Railway assigns PORT automatically
   - Don't hardcode port

3. **Start Script**
   ```json
   // package.json
   "scripts": {
     "start": "node src/server.js"
   }
   ```

**Solution:**

1. Check Railway logs
2. Add environment variables
3. Verify start script
4. Check port configuration

---

## Performance Issues

### Slow API Response

**Problem:** API responses slow (>1 second)

**Causes & Solutions:**

1. **Database Query Slow**

   ```bash
   # Check query performance
   db.capstonegroups.find().explain('executionStats')

   # Add indexes if needed
   ```

2. **Large Response**

   - Implement pagination
   - Limit fields returned

3. **Missing Caching**
   - Implement Redis caching
   - Cache frequently accessed data

**Solution:**

1. Optimize database queries
2. Add indexes
3. Implement pagination
4. Add caching

---

### High Memory Usage

**Problem:** Server using too much memory

**Causes & Solutions:**

1. **Memory Leak**

   ```bash
   # Check for memory leaks
   # Use Node.js profiler
   ```

2. **Large Data in Memory**

   - Stream large files
   - Implement pagination
   - Clear unused data

3. **Too Many Connections**
   - Limit connection pool
   - Close unused connections

**Solution:**

1. Check for memory leaks
2. Implement streaming
3. Limit connection pool
4. Monitor memory usage

---

## Debug Commands

### Backend Debug

```bash
# Enable debug logging
DEBUG=* npm run dev

# Check server status
curl http://localhost:8000/api/health

# Check database connection
mongosh

# View server logs
npm run dev  # Look at console output

# Test API endpoint
curl -X GET http://localhost:8000/api/users \
  -H "Authorization: Bearer <token>"
```

### Frontend Debug

```bash
# Check browser console (F12)
# Look for errors and warnings

# Check network tab
# Verify API calls

# Use Vue DevTools
# Inspect components and stores

# Check local storage
# localStorage.getItem('token')
```

### Database Debug

```bash
# Connect to MongoDB
mongosh

# Show databases
show dbs

# Use database
use capstone-db

# Show collections
show collections

# Find documents
db.users.find()

# Count documents
db.users.countDocuments()

# Check indexes
db.users.getIndexes()
```

---

## Getting Help

- **GitHub Issues:** https://github.com/ustadzCoding/A25-CS246/issues
- **GitHub Discussions:** https://github.com/ustadzCoding/A25-CS246/discussions
- **Email:** asah@dicoding.com

---

---

## MongoDB Transaction Issues

### Write Conflict Error

**Problem:** `Write conflict during plan execution and yielding is disabled`

**Causes & Solutions:**

1. **Missing Replica Set**

   **Symptom:**

   ```
   Write conflict during plan execution and yielding is disabled
   ```

   **Cause:** MongoDB transactions require a replica set

   **Solution:**

   ```env
   # Add replicaSet parameter to MONGODB_URI
   MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db?retryWrites=true&w=majority&replicaSet=atlas-l46ddf-shard-0
   ```

   **How to find replica set name:**

   1. Go to MongoDB Atlas → Clusters
   2. Click "Connect"
   3. Choose "Connect your application"
   4. Copy connection string
   5. Extract replica set name (e.g., `atlas-l46ddf-shard-0`)

2. **Connection Timeout During Transaction**

   **Symptom:**

   ```
   timeout of 60000ms exceeded
   ```

   **Cause:** Long-running operations inside transaction (e.g., email sending)

   **Solution:** Move non-critical operations outside transaction

   ```javascript
   // ❌ WRONG - Email inside transaction
   await withTransaction(async (session) => {
     // ... database operations ...
     await EmailService.sendEmail(); // BLOCKS transaction
   });

   // ✅ CORRECT - Email outside transaction
   await withTransaction(async (session) => {
     // ... database operations ...
   });
   // Send email asynchronously (fire and forget)
   (async () => {
     await EmailService.sendEmail();
   })();
   ```

---

**Last Updated:** December 11, 2025 | **Version:** 1.1.0

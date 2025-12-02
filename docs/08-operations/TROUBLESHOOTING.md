# 🔍 TROUBLESHOOTING GUIDE

Common issues and solutions.

---

## 🔴 Critical Issues

### Application Won't Start

**Error: Port already in use**

```bash
# Find process on port 8000
lsof -i :8000  # macOS/Linux
netstat -ano | findstr :8000  # Windows

# Kill process
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows

# Or change port in .env
PORT=8001
```

**Error: Database connection failed**

```bash
# Check MongoDB is running
mongosh

# Check connection string
MONGODB_URI=mongodb://localhost:27017/dicoding-capstone

# Verify credentials if using Atlas
# Check IP whitelist in MongoDB Atlas
```

**Error: Module not found**

```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Clear npm cache
npm cache clean --force
```

---

## 🟠 Backend Issues

### API Returns 500 Error

**Step 1: Check logs**

```bash
# Look for error messages
# Check stack trace
# Identify failing function
```

**Step 2: Common causes**

- Database connection lost
- Invalid query
- Missing environment variable
- Unhandled exception

**Step 3: Fix**

```bash
# Restart application
npm run dev

# Check database
mongosh

# Verify environment variables
cat .env
```

### CORS Error

**Error: Access to XMLHttpRequest blocked**

**Solution:**

```env
# Check CORS_ORIGIN in .env
CORS_ORIGIN=http://localhost:5173

# Restart backend
npm run dev
```

### Authentication Fails

**Error: Invalid token**

```bash
# Check JWT_SECRET is set
# Verify token expiration
# Check Authorization header format
# Should be: Authorization: Bearer <token>
```

### Email Not Sending

**Error: Invitation email not received**

**Check:**

```bash
# Verify SMTP settings in .env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=app-password

# Check Gmail app password (not regular password)
# Enable "Less secure app access" if needed
# Check spam folder
```

---

## 🟡 Frontend Issues

### Blank Page

**Solution:**

```bash
# Hard refresh
Ctrl+Shift+R (Windows/Linux)
Cmd+Shift+R (macOS)

# Clear cache
npm run dev

# Check console for errors
F12 → Console tab
```

### API Calls Fail

**Error: 404 Not Found**

```bash
# Check API base URL
# Should be: http://localhost:8000/api

# Verify backend is running
# Check endpoint exists
```

**Error: CORS blocked**

```bash
# Check backend CORS_ORIGIN
# Should match frontend URL
# Restart backend
```

### State Not Updating

**Issue: Pinia store not updating**

**Solution:**

```javascript
// Use ref() for reactive data
const data = ref([])

// Use computed() for derived data
const filtered = computed(() => data.value.filter(...))

// Use watch() for side effects
watch(() => data.value, () => { ... })
```

---

## 🔵 Database Issues

### Connection Timeout

**Error: MongoDB connection timeout**

**Solution:**

```bash
# Check MongoDB is running
mongosh

# Check connection string
# Verify IP whitelist (if using Atlas)
# Check network connectivity
```

### Query Fails

**Error: Invalid query**

**Solution:**

```bash
# Check MongoDB syntax
# Verify collection name
# Check field names
# Test in MongoDB shell first
```

### Data Corruption

**Error: Unexpected data format**

**Solution:**

```bash
# Check data validation
# Verify schema
# Run migrations if needed
# Restore from backup if necessary
```

---

## 🟢 Performance Issues

### Slow API Response

**Diagnosis:**

```bash
# Check database query time
# Check network latency
# Check server load
# Check memory usage
```

**Solution:**

```bash
# Add database indexes
# Optimize queries
# Implement caching
# Scale horizontally
```

### High Memory Usage

**Diagnosis:**

```bash
# Check process memory
# Look for memory leaks
# Check event listeners
# Check file handles
```

**Solution:**

```bash
# Restart application
# Update dependencies
# Fix memory leaks
# Increase server RAM
```

---

## 🔧 Development Issues

### Tests Failing

**Solution:**

```bash
# Run tests with verbose output
npm test -- --verbose

# Run specific test
npm test -- filename.test.js

# Check test database
# Verify test data setup
```

### Build Fails

**Frontend:**

```bash
# Check for syntax errors
npm run build

# Clear dist folder
rm -rf dist

# Rebuild
npm run build
```

**Backend:**

```bash
# Check for syntax errors
npm run lint

# Fix linting issues
npm run format

# Test build
npm run build
```

---

## 📞 Getting Help

### Before Asking for Help

1. Check error message carefully
2. Search documentation
3. Check GitHub issues
4. Try restarting
5. Check logs

### When Reporting Issues

- Describe what you did
- Show error message
- Include logs
- Provide steps to reproduce
- Mention environment (OS, Node version, etc.)

---

## 🆘 Emergency Contacts

- **Backend Issues:** Contact Ganza
- **Frontend Issues:** Contact Deby
- **Database Issues:** Contact Rizky
- **Deployment Issues:** Contact Rizky
- **General Questions:** Ask in team chat

---

**Last Updated:** 30 November 2025

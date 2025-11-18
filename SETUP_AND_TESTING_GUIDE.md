# 📚 Complete Setup and Testing Guide

## 🎯 Quick Start

### Step 1: Clear Database

```bash
cd d:\A25-CS246\backend
node src/scripts/clearDatabase.js
```

### Step 2: Setup Test Data

```bash
node src/scripts/setupTestData.js
```

### Step 3: Start Backend

```bash
npm run dev
```

### Step 4: Start Frontend (New Terminal)

```bash
cd d:\A25-CS246\frontend
npm run dev
```

---

## 📝 Test Accounts

**Password for all:** `TestPassword123!`

### Admin

```
Email: admin_1@student.devacademy.id
Name: Paramita Zulaika
```

### Students

```
1. fui0001@student.devacademy.id - Lutfan Gunawan
2. fui0002@student.devacademy.id - Darimin Jailani
3. fui0003@student.devacademy.id - Hana Yulianti
```

---

## 🌐 URLs

```
Frontend:  http://localhost:5173
Backend:   http://localhost:8000
API Docs:  http://localhost:8000/api-docs
Health:    http://localhost:8000/health
```

---

## 🧪 Testing Checklist

### Phase 1: Authentication (15 min)

- [ ] Admin login
- [ ] Student login
- [ ] Invalid login (error message)
- [ ] Logout

### Phase 2: Team Management (30 min)

- [ ] Admin view teams
- [ ] Student register team
- [ ] Admin approve team
- [ ] Admin reject team
- [ ] View team details

### Phase 3: Documents (20 min)

- [ ] Student upload document
- [ ] View document list
- [ ] Download document
- [ ] Delete document

### Phase 4: Timeline (15 min)

- [ ] Admin view timeline
- [ ] Admin create event
- [ ] Admin update event
- [ ] Admin delete event

### Phase 5: Announcements (10 min)

- [ ] View announcements
- [ ] Admin create announcement
- [ ] Admin delete announcement

### Phase 6: Error Handling (10 min)

- [ ] Invalid login error
- [ ] Validation error
- [ ] Authorization error
- [ ] 404 error

### Phase 7: Performance (10 min)

- [ ] Page load time < 3 sec
- [ ] Mobile responsive
- [ ] UI/UX consistent

---

## 📊 Test Data

**Total Users:** 60

- 1 Admin
- 59 Students

**Use Cases:** 2

- E-Commerce Platform (10 slots)
- Social Media App (8 slots)

---

## 🔍 Verification

### Backend Health Check

```bash
curl http://localhost:8000/health
```

Expected:

```json
{
  "status": "ok",
  "database": "connected"
}
```

### Check Database

```bash
# Login to MongoDB
mongosh

# Select database
use capstone_test

# Check users
db.users.countDocuments()  # Should be 60

# Check use cases
db.usecases.countDocuments()  # Should be 2
```

---

## 🐛 Troubleshooting

### Issue: "User not found"

**Solution:** Run setupTestData.js again

### Issue: "Database connection failed"

**Solution:** Check MongoDB is running and .env is configured

### Issue: "Port 8000 already in use"

**Solution:** Kill process or use different port

### Issue: "CORS error"

**Solution:** Check backend .env has correct FRONTEND_URL

---

## 📋 Testing Tips

1. **Clear Cache:** Ctrl+Shift+Delete before each test
2. **Check Console:** F12 → Console (look for errors)
3. **Check Network:** F12 → Network (verify API calls)
4. **Check Storage:** F12 → Application → Storage (verify token)
5. **Mobile View:** F12 → Toggle device toolbar

---

## ✅ Sign-Off

**Tested by:** ******\_\_\_******
**Date:** ******\_\_\_******
**Status:** [ ] PASS [ ] FAIL

**Issues Found:**

1. ***
2. ***
3. ***

**Ready for Deployment:** [ ] YES [ ] NO

---

## 📞 Support

If you encounter issues:

1. Check browser console (F12)
2. Check backend logs
3. Verify database connection
4. Check network requests
5. Review error messages

**Good luck with testing!** 🚀

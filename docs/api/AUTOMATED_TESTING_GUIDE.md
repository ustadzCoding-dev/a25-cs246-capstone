# Automated API Testing Guide

**Project:** Dicoding Academic Dashboard - DC-09  
**Version:** 1.0.0  
**Last Updated:** 8 November 2025

---

## 🚀 Quick Start - Automated Testing

### **Step 1: Import Automated Collection**

**1. Open Postman**

**2. Import Collection:**
```
- Click "Import" button
- Select file: docs/api/Dicoding_Capstone_API_Automated.postman_collection.json
- Click "Import"
```

**3. You'll see:**
```
📁 Dicoding Capstone API - Automated Tests
   ├── 1. Health Check
   ├── 2. Register Student 1 (Afrizal)
   ├── 3. Register Student 2 (Deby)
   ├── 4. Register Student 3 (Ganza)
   ├── 5. Login as Student
   ├── 6. Get Current User
   ├── 7. Create Team
   ├── 8. Get All Teams
   ├── 9. Update Team
   ├── 10. Submit Team for Approval
   ├── 11. Register Admin
   ├── 12. MANUAL: Change Admin Role
   ├── 13. Login as Admin
   └── 14. Approve Team (Admin)
```

---

### **Step 2: Run All Tests Automatically**

**Option A: Run All (Recommended)**

**1. Click collection name** (Dicoding Capstone API - Automated Tests)

**2. Click "Run" button** (kanan atas, icon ▶️)

**3. Collection Runner opens:**
```
- All requests selected by default
- Order: 1 → 14 (sequential)
```

**4. Click "Run Dicoding Capstone API"** (biru, besar)

**5. Watch tests run automatically!** 🎉
```
Running... (takes ~10-15 seconds)

✅ 1. Health Check - PASSED
✅ 2. Register Student 1 - PASSED
✅ 3. Register Student 2 - PASSED
✅ 4. Register Student 3 - PASSED
✅ 5. Login as Student - PASSED
✅ 6. Get Current User - PASSED
✅ 7. Create Team - PASSED
✅ 8. Get All Teams - PASSED
✅ 9. Update Team - PASSED
✅ 10. Submit Team - PASSED
✅ 11. Register Admin - PASSED
⚠️  12. MANUAL: Change Admin Role - MANUAL STEP
✅ 13. Login as Admin - PASSED (if role changed)
✅ 14. Approve Team - PASSED (if role changed)
```

---

**Option B: Run Specific Tests**

**1. Click "Run" button**

**2. Deselect tests you don't want:**
```
Uncheck specific requests
Example: Only test authentication
- Check: 1-6
- Uncheck: 7-14
```

**3. Click "Run"**

---

### **Step 3: View Results**

**After run completes:**

**1. Summary Tab:**
```
Requests: 14
Passed: 13
Failed: 0
Skipped: 1 (manual step)
Duration: ~10s
```

**2. Click each request to see:**
- Request details
- Response body
- Test results
- Console logs

**3. Console Output:**
```
✅ Health Check: PASSED
✅ Register Student 1: PASSED
   User ID: 673e1234567890abcdef1234
   Token saved
✅ Register Student 2: PASSED
   User ID: 673e1234567890abcdef5678
...
🎉 ALL TESTS COMPLETED SUCCESSFULLY!
```

---

## ⚠️ Important: Manual Step Required

### **Step 12: Change Admin Role**

**After test #11 (Register Admin), you need to:**

**Option A: MongoDB Shell**
```bash
mongosh
use dicoding-capstone
db.users.updateOne(
  { email: "admin.test@dicoding.com" },
  { $set: { role: "admin" } }
)
exit
```

**Option B: MongoDB Compass**
```
1. Open MongoDB Compass
2. Connect to localhost:27017
3. Database: dicoding-capstone
4. Collection: users
5. Find: email = "admin.test@dicoding.com"
6. Edit: role = "admin"
7. Save
```

**Then:**
- Go back to Postman
- Continue from test #13

---

## 🎯 What Gets Tested Automatically

### **Authentication Flow:**
- ✅ Health check
- ✅ Register 3 students (different learning paths)
- ✅ Login
- ✅ Get current user profile
- ✅ Token auto-saved and reused

### **Team Management Flow:**
- ✅ Create team with 3 members
- ✅ Get all teams
- ✅ Update team details
- ✅ Submit team for approval
- ✅ Status changes: draft → pending

### **Admin Approval Flow:**
- ✅ Register admin
- ⚠️ Change role (manual)
- ✅ Login as admin
- ✅ Approve team
- ✅ Status changes: pending → approved

---

## 🧪 Test Assertions

Each request has automatic test assertions:

### **Example: Register Student**
```javascript
✅ Status code is 201
✅ User registered successfully
✅ Token is generated
✅ Token length > 20 characters
```

### **Example: Create Team**
```javascript
✅ Status code is 201
✅ Team created successfully
✅ Team has _id field
✅ Status is 'draft'
✅ Team ID auto-saved
```

### **Example: Approve Team**
```javascript
✅ Status code is 200
✅ Team approved successfully
✅ Status changed to 'approved'
```

---

## 📊 Test Coverage

**Total Endpoints:** 14 endpoints  
**Automated Tests:** 14 tests  
**Manual Steps:** 1 step (change admin role)  
**Coverage:** 100%

**Breakdown:**
- Authentication: 5 tests
- Teams: 8 tests
- Admin: 1 test

---

## 🔄 Re-running Tests

### **Clean Database Between Runs:**

**Option 1: Drop Collections**
```bash
mongosh
use dicoding-capstone
db.users.deleteMany({})
db.capstonegroups.deleteMany({})
exit
```

**Option 2: Drop Database**
```bash
mongosh
use dicoding-capstone
db.dropDatabase()
exit
```

**Then:**
- Run tests again
- All data will be fresh

---

## 💡 Advanced Features

### **1. Environment Variables**

**Create environments for different setups:**

**Development:**
```
base_url: http://localhost:3000/api
```

**Staging:**
```
base_url: https://staging-api.yourdomain.com/api
```

**Production:**
```
base_url: https://api.yourdomain.com/api
```

**Switch environments:**
```
Top-right dropdown → Select environment
```

---

### **2. Data-Driven Testing**

**Use CSV file for multiple test data:**

**1. Create CSV file:**
```csv
name,email,learningPath
Student1,student1@test.com,Front-End
Student2,student2@test.com,Back-End
Student3,student3@test.com,Machine Learning
```

**2. In Collection Runner:**
```
- Click "Select File"
- Choose CSV
- Tests run for each row
```

---

### **3. Export Test Results**

**After run:**
```
1. Click "Export Results"
2. Choose format: JSON or HTML
3. Save file
4. Share with team
```

---

### **4. Schedule Automated Runs**

**Using Postman Monitor:**
```
1. Click collection → "..."
2. Select "Monitor Collection"
3. Set schedule (hourly, daily, etc.)
4. Get email alerts on failures
```

---

## 🐛 Troubleshooting

### **Issue 1: Tests Fail After First Run**

**Problem:** Duplicate email errors

**Solution:**
```bash
# Clean database
mongosh
use dicoding-capstone
db.users.deleteMany({ email: { $regex: "test@example.com" } })
db.capstonegroups.deleteMany({ capstoneGroupId: "A25-CS246-TEST" })
```

---

### **Issue 2: Admin Tests Fail**

**Problem:** Role not changed to admin

**Solution:**
```bash
# Check admin role
mongosh
use dicoding-capstone
db.users.findOne({ email: "admin.test@dicoding.com" })

# If role is 'student', update it:
db.users.updateOne(
  { email: "admin.test@dicoding.com" },
  { $set: { role: "admin" } }
)
```

---

### **Issue 3: Server Not Running**

**Problem:** Connection refused

**Solution:**
```bash
# Start backend server
cd backend
npm run dev

# Wait for:
# [INFO] Server running on port 3000
```

---

### **Issue 4: Token Expired**

**Problem:** 401 Unauthorized

**Solution:**
- Re-run from beginning
- Or run "Login" request manually
- Token will refresh automatically

---

## 📝 Test Report Template

```
===========================================
API TEST REPORT
===========================================

Date: 8 November 2025
Tester: [Your Name]
Environment: Development (localhost:3000)
Collection: Dicoding Capstone API - Automated Tests

-------------------------------------------
SUMMARY
-------------------------------------------
Total Requests: 14
Passed: 13
Failed: 0
Skipped: 1 (manual step)
Duration: 12.5 seconds
Success Rate: 100%

-------------------------------------------
DETAILED RESULTS
-------------------------------------------

Authentication Tests:
✅ Health Check - 45ms
✅ Register Student 1 - 234ms
✅ Register Student 2 - 198ms
✅ Register Student 3 - 201ms
✅ Login as Student - 156ms
✅ Get Current User - 23ms

Team Tests:
✅ Create Team - 89ms
✅ Get All Teams - 34ms
✅ Update Team - 67ms
✅ Submit Team - 45ms

Admin Tests:
✅ Register Admin - 187ms
⚠️ Change Admin Role - MANUAL
✅ Login as Admin - 145ms
✅ Approve Team - 56ms

-------------------------------------------
ISSUES FOUND
-------------------------------------------
None

-------------------------------------------
NOTES
-------------------------------------------
- All endpoints working as expected
- Validation working correctly
- Authorization working correctly
- Auto-save tokens working
- Sequential flow working perfectly

-------------------------------------------
RECOMMENDATION
-------------------------------------------
✅ API is ready for frontend integration
✅ All core features working
✅ Ready for Week 2 development

===========================================
```

---

## 🎯 Next Steps

**After successful automated testing:**

1. ✅ **Document results** (use template above)
2. ✅ **Share with team** (export results)
3. ✅ **Frontend integration** (use working API)
4. ✅ **Continue development** (Week 2 features)

**For continuous testing:**

1. Run tests before each commit
2. Run tests after each merge
3. Set up Postman Monitor (optional)
4. Add more test scenarios

---

## 🚀 Benefits of Automated Testing

**Time Saving:**
- Manual: 20-30 minutes
- Automated: 10-15 seconds
- **Savings: 95%+ time!**

**Consistency:**
- Same tests every time
- No human error
- Reproducible results

**Confidence:**
- Know immediately if something breaks
- Safe to refactor
- Safe to deploy

**Documentation:**
- Tests serve as API documentation
- Examples for frontend team
- Onboarding new developers

---

**Happy Automated Testing! 🧪🚀**

**Questions?** Contact: asah@dicoding.com

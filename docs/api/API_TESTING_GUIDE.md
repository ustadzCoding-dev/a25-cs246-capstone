# API Testing Guide

**Project:** Dicoding Academic Dashboard - DC-09
**Version:** 1.0.0
**Last Updated:** 8 November 2025

---

## 📋 Prerequisites

### **1. Backend Server Running**
```bash
cd backend
npm run dev
```

**Expected Output:**
```
[INFO] MongoDB Connected: localhost
[INFO] Database: dicoding-capstone
[INFO] Server running on port 3000
[INFO] Environment: development
[INFO] Health check: http://localhost:8000/health
```

### **2. MongoDB Running**
```bash
# Check if MongoDB is running
mongosh
```

### **3. Postman Installed**
- Download: https://www.postman.com/downloads/
- Or use Thunder Client (VS Code extension)

---

## 🚀 Quick Start

### **Option 1: Import Postman Collection**

**1. Open Postman**

**2. Import Collection:**
- Click "Import" button
- Select file: `docs/api/Dicoding_Capstone_Test_API.postman_collection.json`
- Click "Import"

**3. Collection Ready!**
- You'll see "Dicoding Capstone API - DC-09" in sidebar
- Contains all endpoints with examples

---

### **Option 2: Manual Testing with curl**

**Health Check:**
```bash
curl http://localhost:3000/api/health
```

**Register User:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "dicodingId": "F886D5Y0069",
    "name": "Afrizal",
    "email": "afrizal@example.com",
    "password": "password123",
    "learningPath": "Front-End",
    "university": "Universitas Indonesia"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "afrizal@example.com",
    "password": "password123"
  }'
```

---

## 🧪 Testing Scenarios

### **Scenario 1: User Registration & Login**

**Step 1: Register Student**
```
POST /api/auth/register

Body:
{
  "dicodingId": "F886D5Y0069",
  "name": "Afrizal",
  "email": "afrizal@example.com",
  "password": "password123",
  "learningPath": "Front-End",
  "university": "Universitas Indonesia"
}

Expected: 201 Created
Response: { success: true, data: { user, token } }
```

**Step 2: Login**
```
POST /api/auth/login

Body:
{
  "email": "afrizal@example.com",
  "password": "password123"
}

Expected: 200 OK
Response: { success: true, data: { user, token } }
```

**Step 3: Get Profile**
```
GET /api/auth/me
Authorization: Bearer <token>

Expected: 200 OK
Response: { success: true, data: { user details } }
```

---

### **Scenario 2: Team Creation (Full Flow)**

**Step 1: Register 3 Students**
```
Register:
- Afrizal (Front-End)
- Deby (Back-End)
- Ganza (Machine Learning)
```

**Step 2: Login as Afrizal (Team Leader)**
```
POST /api/auth/login
Save the token!
```

**Step 3: Create Team**
```
POST /api/teams
Authorization: Bearer <afrizal_token>

Body:
{
  "capstoneGroupId": "A25-CS246",
  "teamName": "Tim Awesome",
  "members": [
    { "userId": "<afrizal_id>", "role": "leader" },
    { "userId": "<deby_id>", "role": "member" },
    { "userId": "<ganza_id>", "role": "member" }
  ],
  "leaderId": "<afrizal_id>"
}

Expected: 201 Created
Note: Save team_id from response!
```

**Step 4: Update Team Details**
```
PUT /api/teams/<team_id>
Authorization: Bearer <afrizal_token>

Body:
{
  "projectTitle": "Enhanced Academic Dashboard",
  "projectDescription": "A comprehensive dashboard...",
  "githubRepo": "https://github.com/ustadzCoding-dev/A25-CS246"
}

Expected: 200 OK
```

**Step 5: Submit for Approval**
```
POST /api/teams/<team_id>/submit
Authorization: Bearer <afrizal_token>

Expected: 200 OK
Status: draft → pending
```

---

### **Scenario 3: Admin Approval**

**Step 1: Register Admin**
```
POST /api/auth/register

Body:
{
  "dicodingId": "ADMIN001",
  "name": "Admin Dicoding",
  "email": "admin@dicoding.com",
  "password": "admin123",
  "learningPath": "Front-End"
}

Note: Manually change role to 'admin' in database
```

**Step 2: Login as Admin**
```
POST /api/auth/login
Save admin token!
```

**Step 3: View Pending Teams**
```
GET /api/teams?status=pending
Authorization: Bearer <admin_token>

Expected: 200 OK
```

**Step 4: Approve Team**
```
POST /api/teams/<team_id>/approve
Authorization: Bearer <admin_token>

Expected: 200 OK
Status: pending → approved
```

**Or Reject Team:**
```
POST /api/teams/<team_id>/reject
Authorization: Bearer <admin_token>

Body:
{
  "reason": "Team composition does not meet requirements"
}

Expected: 200 OK
Status: pending → rejected
```

---

## ✅ Test Checklist

### **Authentication Endpoints:**
- [ ] POST /api/auth/register - Success
- [ ] POST /api/auth/register - Duplicate email (409)
- [ ] POST /api/auth/register - Invalid data (400)
- [ ] POST /api/auth/login - Success
- [ ] POST /api/auth/login - Wrong password (401)
- [ ] POST /api/auth/login - User not found (401)
- [ ] GET /api/auth/me - Success
- [ ] GET /api/auth/me - No token (401)
- [ ] PUT /api/auth/profile - Success
- [ ] POST /api/auth/logout - Success

### **Team Endpoints:**
- [ ] POST /api/teams - Success
- [ ] POST /api/teams - Duplicate team ID (409)
- [ ] POST /api/teams - User already in team (400)
- [ ] POST /api/teams - Invalid members (400)
- [ ] GET /api/teams - Success
- [ ] GET /api/teams - With filters
- [ ] GET /api/teams/:id - Success
- [ ] GET /api/teams/:id - Not found (404)
- [ ] PUT /api/teams/:id - Success (leader)
- [ ] PUT /api/teams/:id - Forbidden (not leader) (403)
- [ ] POST /api/teams/:id/submit - Success
- [ ] POST /api/teams/:id/submit - Invalid composition (400)
- [ ] POST /api/teams/:id/approve - Success (admin)
- [ ] POST /api/teams/:id/approve - Forbidden (not admin) (403)
- [ ] POST /api/teams/:id/reject - Success (admin)
- [ ] DELETE /api/teams/:id - Success

---

## 🐛 Common Issues & Solutions

### **Issue 1: Server not starting**
```
Error: Cannot find module 'xxx'
```
**Solution:**
```bash
cd backend
npm install
```

### **Issue 2: MongoDB connection failed**
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution:**
```bash
# Start MongoDB
mongod
# Or
net start MongoDB
```

### **Issue 3: 401 Unauthorized**
```
Error: Invalid or expired token
```
**Solution:**
- Login again to get new token
- Copy token from response
- Add to Authorization header: `Bearer <token>`

### **Issue 4: 400 Validation Error**
```
Error: Validation Error
```
**Solution:**
- Check request body format
- Ensure all required fields present
- Check data types (string, number, etc.)

### **Issue 5: 409 Conflict**
```
Error: Email already registered
```
**Solution:**
- Use different email
- Or delete user from database first

---

## 📊 Expected Response Formats

### **Success Response:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### **Error Response:**
```json
{
  "success": false,
  "message": "Error message",
  "errors": ["Detail 1", "Detail 2"]
}
```

### **Pagination Response:**
```json
{
  "success": true,
  "data": {
    "teams": [ ... ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 50,
      "itemsPerPage": 10
    }
  }
}
```

---

## 🎯 Testing Tips

### **1. Use Postman Variables**
```
{{base_url}} = http://localhost:3000/api
{{auth_token}} = <your_token>
{{user_id}} = <your_user_id>
{{team_id}} = <your_team_id>
```

### **2. Auto-Save Tokens**
Add to Postman Tests tab:
```javascript
if (pm.response.code === 200) {
    const response = pm.response.json();
    pm.collectionVariables.set('auth_token', response.data.token);
}
```

### **3. Test in Order**
1. Health Check
2. Register Users
3. Login
4. Create Team
5. Update Team
6. Submit Team
7. Admin Approval

### **4. Clean Database Between Tests**
```bash
mongosh
use dicoding-capstone
db.users.deleteMany({})
db.capstonegroups.deleteMany({})
```

---

## 📝 Test Results Template

```
Date: 8 November 2025
Tester: [Your Name]
Environment: Development (localhost)

Authentication:
✅ Register - Success
✅ Login - Success
✅ Get Profile - Success
✅ Update Profile - Success

Teams:
✅ Create Team - Success
✅ Get Teams - Success
✅ Update Team - Success
✅ Submit Team - Success
✅ Approve Team - Success

Issues Found:
- None

Notes:
- All endpoints working as expected
- Validation working correctly
- Error handling proper
```

---

## 🚀 Next Steps

After testing:
1. Document any bugs found
2. Create GitHub issues for bugs
3. Test edge cases
4. Performance testing
5. Security testing

---

**Happy Testing! 🧪**

**Questions?** Contact: asah@dicoding.com

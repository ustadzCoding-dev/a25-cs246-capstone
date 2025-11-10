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

### **Import Postman Collection**

**1. Open Postman**

**2. Import Collection:**
- Click "Import" button
- Select file: `docs/api/Dicoding_Capstone_Test_API.postman_collection.json`
- Click "Import"

**3. Collection Ready!**
- You'll see "Dicoding Capstone Test API" in sidebar
- Contains all endpoints with examples

---

## 🧪 Testing Scenarios

### **Scenario 1: User Registration & Login**
#### *From API_DOCUMENTATION.md*

Step 1: Register Student

Step 2: Login

Step 3: Get Profile

---

### **Scenario 2: Capstone Group Creation (Full Flow)**
#### *From API_DOCUMENTATION.md*

Step 1: Register captone group with members

Step 2: Update capstone group while status is "*pending*"

Step 3: Wait for approval from admin

---

### **Scenario 3: Admin Approval or Reject**
#### *From API_DOCUMENTATION.md*

Step 1: Register as admin

Step 2: Login

Step 3: View pending capstone groups

Step 4: Approve or reject capstone groups

---

## ✅ Test Checklist

### **Authentication Endpoints:**
- [ ] POST /api/auth/register - Success
- [ ] POST /api/auth/login - Success

### **Users Endpoints:**
- [ ] GET /api/users - Success
- [ ] GET /api/user/profile - Success
- [ ] PUT /api/user/profile/update - Success

### **Capstone Groups Endpoints:**
- [ ] GET /api/capstone-groups - Success
- [ ] GET /api/capstone-group/:id - Success
- [ ] PUT /api/capstone-group/update/:id - Success
- [ ] PUT /api/capstone-group/:id/approve - Success
- [ ] PUT /api/capstone-group/:id/reject - Success
- [ ] POST /api/capstone-group/add - Success
- [ ] DEL /api/capstone-group/:id/delete - Success

### **Usecases Endpoints:**
- [ ] GET /api/usecases - Success
- [ ] GET /api/usecase/:id - Success
- [ ] POST /api/usecase/add - Success

### **Documents Endpoints:**
- [ ] GET /api/documents - Success
- [ ] GET /api/document/:id/download - Success
- [ ] GET /api/document/:id - Success
- [ ] POST /api/document/add - Success
- [ ] DEL /api/document/:id/delete - Success

### **Timelines Endpoints:**
- [ ] GET /api/timelines - Success
- [ ] GET /api/timelines/overdue - Success
- [ ] GET /api/timelines/upcoming - Success
- [ ] POST /api/timeline/add - Success
- [ ] PUT /api/timeline/update/:id - Success
- [ ] DEL /api/timeline/:id/delete - Success

### **Timelines Endpoints:**
- [ ] GET /api/learning-groups - Success
- [ ] GET /api/learning-group/:id - Success
- [ ] POST /api/learning-group/add - Success
- [ ] PUT /api/learning-group/update/:id - Success
- [ ] DEL /api/learning-group/:id/delete - Success

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
  "message": "Error message"
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
      "totalItems": 1,
      "limit": 10
    }
  }
}
```

**Happy Testing! 🧪**

**Last Updated:** 11 November 2025

**Maintained by:** Tim A25-CS246


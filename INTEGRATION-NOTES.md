# 🔗 Integration Notes - Frontend & Backend

Catatan penting untuk integrasi frontend dan backend.

## ⚙️ Configuration

### **Backend (.env)**
```env
# Server Configuration
PORT=8000                    # Backend port (MUST be 8000)
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/dicoding-capstone

# JWT
JWT_SECRET=your-secret-key-here-change-in-production
JWT_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=http://localhost:5173    # Frontend URL (MUST match frontend port)

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads
```

### **Frontend (.env)**
```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8000/api    # Backend API URL
```

---

## 🚀 Running Both Servers

### **1. Start MongoDB**
```bash
# Make sure MongoDB is running
mongod
```

### **2. Start Backend (Port 8000)**
```bash
cd backend
npm install
npm run dev
```

**Expected output:**
```
[INFO] Server running on port 8000
[INFO] Environment: development
[INFO] Health check: http://localhost:8000/health
[INFO] MongoDB Connected: dicoding-capstone
```

### **3. Start Frontend (Port 5173)**
```bash
cd frontend
npm install
npm run dev
```

**Expected output:**
```
ROLLDOWN-VITE v7.1.14  ready in 575 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

---

## 🧪 Testing Integration

### **1. Health Check**
```bash
curl http://localhost:8000/api/health
```

**Expected:**
```json
{
  "success": true,
  "message": "API is running",
  "timestamp": "2025-11-11T..."
}
```

### **2. Test Frontend**
Open browser: http://localhost:5173

### **3. Test Authentication**
- Signup: http://localhost:5173/signup
- Login: http://localhost:5173/login

---

## 📋 API Endpoints Available

### **Authentication**
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/user/profile` - Get user profile (protected)
- `PUT /api/user/profile/update` - Update profile (protected)

### **Teams (Capstone Groups)**
- `GET /api/capstone-groups` - Get all teams (protected)
- `GET /api/capstone-group/:id` - Get team by ID (protected)
- `POST /api/capstone-group/add` - Create team (protected)
- `PUT /api/capstone-group/update/:id` - Update team (protected)
- `PUT /api/capstone-group/:id/approve` - Approve team (admin)
- `PUT /api/capstone-group/:id/reject` - Reject team (admin)
- `DELETE /api/capstone-group/:id/delete` - Delete team (admin)

### **Use Cases**
- `GET /api/usecases` - Get all use cases (protected)
- `GET /api/usecase/:id` - Get use case by ID (protected)
- `POST /api/usecase/add` - Add use case (admin)

### **Documents**
- `GET /api/documents` - Get all documents (protected)
- `GET /api/document/:id` - Get document by ID (protected)
- `POST /api/document/add` - Upload document (admin)
- `DELETE /api/document/:id/delete` - Delete document (admin)
- `GET /api/document/:id/download` - Download document (protected)

### **Timeline**
- `GET /api/timelines` - Get all timelines (protected)
- `GET /api/timelines/upcoming` - Get upcoming timelines (protected)
- `GET /api/timelines/overdue` - Get overdue timelines (protected)
- `POST /api/timeline/add` - Add timeline (admin)
- `PUT /api/timeline/update/:id` - Update timeline (admin)
- `DELETE /api/timeline/:id/delete` - Delete timeline (admin)

### **Learning Groups**
- `GET /api/learning-groups` - Get all learning groups (protected)
- `GET /api/learning-group/:id` - Get learning group by ID (protected)
- `POST /api/learning-group/add` - Add learning group (admin)
- `PUT /api/learning-group/update/:id` - Update learning group (admin)
- `DELETE /api/learning-group/:id/delete` - Delete learning group (admin)

---

## 🔧 Frontend Services Created

### **Services (API Calls)**
- ✅ `authService.js` - Authentication
- ✅ `teamService.js` - Team management
- ✅ `documentService.js` - Document management
- ✅ `timelineService.js` - Timeline management
- ✅ `userService.js` - User profile
- ✅ `learningGroupService.js` - Learning groups

### **Stores (State Management)**
- ✅ `authStore.js` - Auth state
- ✅ `teamStore.js` - Team state
- ✅ `documentStore.js` - Document state
- ✅ `timelineStore.js` - Timeline state

---

## 🐛 Common Issues

### **CORS Error**
**Problem:** Frontend can't access backend API
**Solution:** Make sure `CORS_ORIGIN` in backend `.env` is `http://localhost:5173`

### **Port Already in Use**
**Problem:** Port 8000 or 5173 already in use
**Solution:**
```bash
# Kill all node processes
taskkill /F /IM node.exe

# Or change port in .env files
```

### **MongoDB Connection Error**
**Problem:** Can't connect to MongoDB
**Solution:**
```bash
# Start MongoDB
mongod

# Or check if MongoDB service is running
```

### **401 Unauthorized**
**Problem:** API returns 401 error
**Solution:** 
- Check if token is saved in localStorage
- Check if token is expired
- Try login again

---

## 📝 Next Steps

### **Phase 1: Update Pages** ✅ IN PROGRESS
- Update Team pages to use teamStore
- Update Document pages to use documentStore
- Update Timeline pages to use timelineStore
- Update Profile page to use userService

### **Phase 2: Testing**
- Test all CRUD operations
- Test authentication flow
- Test file upload/download
- Test error handling

### **Phase 3: Polish**
- Add loading states
- Improve error messages
- Add success notifications
- Improve UX

---

## 👥 Team

- **Afrizal** - Frontend Developer
- **Ganza** - Backend Developer
- **Deby** - UI/UX Designer

---

**Last Updated:** November 11, 2025 - 09:10 PM

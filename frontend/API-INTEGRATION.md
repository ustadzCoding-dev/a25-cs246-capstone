# 🔌 API Integration Guide

Panduan integrasi frontend dengan backend API - Untuk Ganza (Backend Developer)

## 📍 API Configuration

**Base URL:** `http://localhost:8000/api`

Configured in `.env` file:
```env
VITE_API_BASE_URL=http://localhost:8000/api
```

---

## 🔐 Authentication

### Headers
All authenticated requests include:
```javascript
Authorization: Bearer {token}
Content-Type: application/json
```

Token is stored in `localStorage` with key `token`.

---

## 📋 Required API Endpoints

### 🔑 Authentication Endpoints 

#### 1. POST `/auth/login`
Login user with email and password.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "user@example.com",
      "role": "student",  // or "admin"
      "learningPath": "Front-End Web",
      "university": "Universitas Indonesia"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Response (401):**
```json
{
  "success": false,
  "message": "Email atau password salah"
}
```

---

#### 2. POST `/auth/register`
Register new user.

**Request:**
```json
{
  "name": "John Doe",
  "email": "user@example.com",
  "password": "password123",
  "learningPath": "Front-End Web",
  "university": "Universitas Indonesia"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "user": { /* same as login */ },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Response (400):**
```json
{
  "success": false,
  "message": "Email sudah terdaftar"
}
```

---

#### 3. GET `/auth/profile`
Get current user profile (requires auth).

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "user@example.com",
    "role": "student",
    "learningPath": "Front-End Web",
    "university": "Universitas Indonesia",
    "avatar": "https://example.com/avatar.jpg"
  }
}
```

---

#### 4. PUT `/auth/profile`
Update user profile (requires auth).

**Request:**
```json
{
  "name": "John Doe Updated",
  "learningPath": "Back-End",
  "university": "Universitas Gadjah Mada"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": { /* updated user object */ }
}
```

---

### 👥 Team Endpoints

#### 5. GET `/teams`
Get all teams (admin only).

**Query Parameters:**
- `status` - Filter by status: `pending`, `approved`, `rejected`
- `search` - Search by team name
- `page` - Page number (pagination)
- `limit` - Items per page

**Response (200):**
```json
{
  "success": true,
  "data": {
    "teams": [
      {
        "id": 1,
        "name": "Team Alpha",
        "status": "pending",
        "leader": {
          "id": 1,
          "name": "John Doe",
          "email": "john@example.com"
        },
        "members": [
          {
            "id": 2,
            "name": "Jane Smith",
            "role": "member"
          }
        ],
        "createdAt": "2025-11-10T10:00:00Z"
      }
    ],
    "pagination": {
      "total": 50,
      "page": 1,
      "limit": 10,
      "totalPages": 5
    }
  }
}
```

---

#### 6. POST `/teams`
Create new team (student only).

**Request:**
```json
{
  "name": "Team Alpha",
  "members": [
    {
      "name": "Jane Smith",
      "email": "jane@example.com",
      "role": "member"
    }
  ]
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Team Alpha",
    "status": "pending",
    "leader": { /* current user */ },
    "members": [ /* team members */ ]
  }
}
```

---

#### 7. GET `/teams/:id`
Get team details.

**Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Team Alpha",
    "status": "approved",
    "leader": { /* leader info */ },
    "members": [ /* members array */ ],
    "createdAt": "2025-11-10T10:00:00Z",
    "approvedAt": "2025-11-11T09:00:00Z"
  }
}
```

---

#### 8. PUT `/teams/:id/status`
Update team status (admin only).

**Request:**
```json
{
  "status": "approved",  // or "rejected"
  "reason": "Team composition meets requirements"  // optional, for rejected
}
```

**Response (200):**
```json
{
  "success": true,
  "data": { /* updated team */ }
}
```

---

### 📄 Document Endpoints

#### 9. GET `/documents`
Get all documents.

**Query Parameters:**
- `category` - Filter by category
- `status` - Filter by status
- `search` - Search by title

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Panduan Capstone",
      "description": "Panduan lengkap untuk capstone project",
      "category": "guide",
      "fileUrl": "https://example.com/documents/guide.pdf",
      "fileSize": 1024000,
      "uploadedBy": {
        "id": 1,
        "name": "Admin"
      },
      "uploadedAt": "2025-11-10T10:00:00Z"
    }
  ]
}
```

---

#### 10. POST `/documents`
Upload new document (admin only).

**Request (multipart/form-data):**
```
title: "Panduan Capstone"
description: "Panduan lengkap"
category: "guide"
file: [File]
```

**Response (201):**
```json
{
  "success": true,
  "data": { /* document object */ }
}
```

---

#### 11. DELETE `/documents/:id`
Delete document (admin only).

**Response (200):**
```json
{
  "success": true,
  "message": "Document deleted successfully"
}
```

---

### 📅 Timeline Endpoints

#### 12. GET `/timeline`
Get all timeline events.

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Kickoff Meeting",
      "description": "Project kickoff and team introduction",
      "date": "2025-11-15T09:00:00Z",
      "status": "upcoming",  // or "ongoing", "completed"
      "type": "meeting"
    }
  ]
}
```

---

#### 13. POST `/timeline`
Create timeline event (admin only).

**Request:**
```json
{
  "title": "Kickoff Meeting",
  "description": "Project kickoff",
  "date": "2025-11-15T09:00:00Z",
  "type": "meeting"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": { /* timeline event */ }
}
```

---

#### 14. PUT `/timeline/:id`
Update timeline event (admin only).

**Request:**
```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "date": "2025-11-16T09:00:00Z",
  "status": "completed"
}
```

---

#### 15. DELETE `/timeline/:id`
Delete timeline event (admin only).

---

### 📢 Announcement Endpoints

#### 16. GET `/announcements`
Get all announcements.

**Query Parameters:**
- `priority` - Filter by priority: `normal`, `important`, `urgent`

**Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Important Update",
      "content": "Please check your email for details",
      "priority": "important",
      "author": {
        "id": 1,
        "name": "Admin"
      },
      "createdAt": "2025-11-10T10:00:00Z"
    }
  ]
}
```

---

#### 17. POST `/announcements`
Create announcement (admin only).

**Request:**
```json
{
  "title": "Important Update",
  "content": "Please check your email",
  "priority": "important"
}
```

---

#### 18. PUT `/announcements/:id`
Update announcement (admin only).

---

#### 19. DELETE `/announcements/:id`
Delete announcement (admin only).

---

## 🔄 Response Format

### Success Response
```json
{
  "success": true,
  "data": { /* response data */ },
  "message": "Optional success message"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "errors": {  // Optional, for validation errors
    "email": "Email is required",
    "password": "Password must be at least 6 characters"
  }
}
```

---

## 🚨 Error Codes

- **400** - Bad Request (validation error)
- **401** - Unauthorized (not logged in or invalid token)
- **403** - Forbidden (insufficient permissions)
- **404** - Not Found
- **500** - Internal Server Error

---

## 🔧 Frontend Implementation

### Frontend Configuration
- **Dev Server:** http://localhost:5173
- **API Base URL:** http://localhost:8000/api

### API Service Location
- **File:** `src/services/api.js`
- **Auth Service:** `src/services/authService.js`

### Request Interceptor
Automatically adds `Authorization` header with JWT token.

### Response Interceptor
Automatically handles:
- Token extraction from response
- Error logging
- Network error handling

---

## 📝 Notes for Backend Developer

1. **CORS Configuration**
   - Allow origin: `http://localhost:5173`
   - Allow methods: `GET, POST, PUT, DELETE`
   - Allow headers: `Authorization, Content-Type`

2. **JWT Token**
   - Include user info in token payload (id, role, email)
   - Token expiration: 24 hours recommended
   - Refresh token: Optional but recommended

3. **File Upload**
   - Max file size: 10MB recommended
   - Allowed types: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX
   - Store files in cloud storage (S3, GCS, etc.)

4. **Pagination**
   - Default limit: 10 items per page
   - Max limit: 100 items per page

5. **Date Format**
   - Use ISO 8601 format: `2025-11-10T10:00:00Z`
   - Frontend will handle timezone conversion

---

## 🧪 Testing

### Test with Postman/Thunder Client
Import this collection or test manually with the endpoints above.

### Mock Data
Frontend currently uses mock data. Replace with real API calls once backend is ready.

---

## 📞 Contact

**Frontend Developer:** Afrizal
**Backend Developer:** Ganza

Kalau ada pertanyaan atau perlu diskusi API, langsung chat ya! 💬

---

**Last Updated:** November 11, 2025 - 02:47 AM

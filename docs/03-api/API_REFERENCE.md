# 📖 API REFERENCE

Complete API documentation for Dicoding Academic Dashboard.

**Base URL:** `http://localhost:8000/api`

---

## 🔐 Authentication

All protected endpoints require JWT token in header:

```
Authorization: Bearer <token>
```

### Login

```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response (200):
{
  "success": true,
  "data": {
    "user": { /* user object */ },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

### Register

```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "learningPath": "Machine Learning",
  "university": "Universitas Indonesia",
  "role": "student"
}

Response (201):
{
  "success": true,
  "data": { /* user object */ }
}
```

### Google OAuth

```http
GET /auth/google
# Redirects to Google login

GET /auth/google/callback?code=...
# Callback from Google, returns token
```

### Complete Profile (Google users)

```http
POST /auth/complete-profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "learningPath": "Machine Learning",
  "university": "Universitas Indonesia"
}

Response (200):
{
  "success": true,
  "data": { /* updated user object */ }
}
```

---

## 👤 USER ENDPOINTS

### Get Current User

```http
GET /auth/me
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "data": { /* user object */ }
}
```

### Get User Profile

```http
GET /user/profile
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "data": { /* user object with full details */ }
}
```

### Update User Profile

```http
PUT /user/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "New Name",
  "university": "New University",
  "learningPathName": "Front-End Web & Back-End with AI"
}

Response (200):
{
  "success": true,
  "data": { /* updated user object */ }
}
```

### Upload Profile Picture

```http
POST /user/profile-picture/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

FormData:
- profilePicture: <image file>

Response (200):
{
  "success": true,
  "data": {
    "profilePicture": "https://res.cloudinary.com/...",
    "user": { /* user object */ }
  }
}
```

### Delete Profile Picture

```http
DELETE /user/profile-picture/delete
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "message": "Profile picture deleted successfully"
}
```

### Change Password

```http
PUT /user/change-password
Authorization: Bearer <token>
Content-Type: application/json

{
  "currentPassword": "old123",
  "newPassword": "new123"
}

Response (200):
{
  "success": true,
  "message": "Password changed successfully"
}
```

---

## 👥 TEAM ENDPOINTS

### Create Team

```http
POST /capstone-groups
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Team Alpha",
  "useCaseId": "507f1f77bcf86cd799439011",
  "memberIds": ["507f1f77bcf86cd799439012", "507f1f77bcf86cd799439013"],
  "learningPaths": ["Machine Learning", "Front-End Web & Back-End with AI"]
}

Response (201):
{
  "success": true,
  "data": { /* team object */ }
}
```

### Get All Teams

```http
GET /capstone-groups?status=pending&search=&page=1&limit=10
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "data": [ /* array of teams */ ],
  "meta": {
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "pages": 3
    }
  }
}
```

### Get Team Details

```http
GET /capstone-groups/:teamId
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "data": { /* team object */ }
}
```

### Edit Team

```http
PUT /capstone-groups/:teamId/edit
Authorization: Bearer <token>
Content-Type: application/json

{
  "memberIds": ["507f1f77bcf86cd799439012", "507f1f77bcf86cd799439013", "507f1f77bcf86cd799439014"],
  "learningPaths": ["Machine Learning", "Front-End Web & Back-End with AI", "Machine Learning"]
}

Response (200):
{
  "success": true,
  "data": { /* updated team object */ }
}
```

### Approve Team

```http
PUT /capstone-groups/:teamId/approve
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "message": "Team approved successfully"
}
```

### Reject Team

```http
PUT /capstone-groups/:teamId/reject
Authorization: Bearer <token>
Content-Type: application/json

{
  "reason": "Composition does not match requirements"
}

Response (200):
{
  "success": true,
  "message": "Team rejected successfully"
}
```

---

## 📧 INVITATION ENDPOINTS

### Get Pending Invitations

```http
GET /invitations
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "data": [ /* array of pending invitations */ ]
}
```

### Get Team Invitations

```http
GET /invitations/team/:teamId
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "data": [ /* array of team invitations */ ]
}
```

### Accept Invitation

```http
PUT /invitations/:invitationId/accept
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "message": "Invitation accepted successfully"
}
```

### Reject Invitation

```http
PUT /invitations/:invitationId/reject
Authorization: Bearer <token>
Content-Type: application/json

{
  "reason": "Cannot join at this time"
}

Response (200):
{
  "success": true,
  "message": "Invitation rejected successfully"
}
```

---

## 📄 DOCUMENT ENDPOINTS

### Upload Document

```http
POST /documents
Authorization: Bearer <token>
Content-Type: multipart/form-data

FormData:
- title: "Capstone Guidelines"
- category: "guidelines"
- file: <pdf file>

Response (201):
{
  "success": true,
  "data": { /* document object */ }
}
```

### Get All Documents

```http
GET /documents?category=guidelines&search=&page=1&limit=10
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "data": [ /* array of documents */ ],
  "meta": {
    "pagination": { /* pagination info */ }
  }
}
```

### Download Document

```http
GET /documents/:documentId/download
Authorization: Bearer <token>

Response (200):
# File download
```

### Delete Document

```http
DELETE /documents/:documentId
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "message": "Document deleted successfully"
}
```

---

## 📅 TIMELINE ENDPOINTS

### Create Timeline

```http
POST /timelines
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Team Registration Deadline",
  "description": "Last day to register your team",
  "startDate": "2025-12-01T00:00:00Z",
  "endDate": "2025-12-15T23:59:59Z",
  "type": "deadline"
}

Response (201):
{
  "success": true,
  "data": { /* timeline object */ }
}
```

### Get All Timelines

```http
GET /timelines?type=deadline&page=1&limit=10
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "data": [ /* array of timelines */ ],
  "meta": { /* pagination info */ }
}
```

### Update Timeline

```http
PUT /timelines/:timelineId
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Title",
  "endDate": "2025-12-20T23:59:59Z"
}

Response (200):
{
  "success": true,
  "data": { /* updated timeline object */ }
}
```

### Delete Timeline

```http
DELETE /timelines/:timelineId
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "message": "Timeline deleted successfully"
}
```

---

## 📢 ANNOUNCEMENT ENDPOINTS

### Create Announcement

```http
POST /announcements
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Important Update",
  "content": "Please read this important announcement",
  "priority": "high"
}

Response (201):
{
  "success": true,
  "data": { /* announcement object */ }
}
```

### Get All Announcements

```http
GET /announcements?priority=high&search=&page=1&limit=10
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "data": [ /* array of announcements */ ],
  "meta": { /* pagination info */ }
}
```

### Update Announcement

```http
PUT /announcements/:announcementId
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Title",
  "content": "Updated content"
}

Response (200):
{
  "success": true,
  "data": { /* updated announcement object */ }
}
```

### Delete Announcement

```http
DELETE /announcements/:announcementId
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "message": "Announcement deleted successfully"
}
```

---

## 📋 WORKSHEET ENDPOINTS

### Submit Worksheet

```http
POST /worksheets
Authorization: Bearer <token>
Content-Type: multipart/form-data

FormData:
- worksheetPeriodId: "507f1f77bcf86cd799439011"
- description: "This week we completed..."
- files: [<file1>, <file2>]

Response (201):
{
  "success": true,
  "data": { /* worksheet object */ }
}
```

### Get Worksheets

```http
GET /worksheets?periodId=&status=&page=1&limit=10
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "data": [ /* array of worksheets */ ],
  "meta": { /* pagination info */ }
}
```

### Validate Worksheet

```http
PUT /worksheets/:worksheetId/validate
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "completed",
  "notes": "Good progress"
}

Response (200):
{
  "success": true,
  "data": { /* updated worksheet object */ }
}
```

---

## 🎓 LEARNING PATH ENDPOINTS

### Get All Learning Paths

```http
GET /learning-paths
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "data": [ /* array of learning paths */ ]
}
```

### Create Learning Path

```http
POST /learning-paths
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Machine Learning",
  "code": "ML",
  "description": "Learn machine learning",
  "dicodingIdPrefix": "ML"
}

Response (201):
{
  "success": true,
  "data": { /* learning path object */ }
}
```

---

## 📊 DASHBOARD ENDPOINTS

### Get Dashboard Stats

```http
GET /dashboard/stats
Authorization: Bearer <token>

Response (200):
{
  "success": true,
  "data": {
    "totalTeams": 25,
    "pendingTeams": 5,
    "approvedTeams": 20,
    "totalStudents": 150,
    "totalDocuments": 12
  }
}
```

---

## ⚠️ Error Responses

### 400 Bad Request

```json
{
  "success": false,
  "message": "Invalid input data",
  "errors": {
    "email": "Email is required",
    "password": "Password must be at least 6 characters"
  }
}
```

### 401 Unauthorized

```json
{
  "success": false,
  "message": "Authentication required"
}
```

### 403 Forbidden

```json
{
  "success": false,
  "message": "You do not have permission to access this resource"
}
```

### 404 Not Found

```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 500 Internal Server Error

```json
{
  "success": false,
  "message": "Internal server error"
}
```

---

## 📊 Response Format

All responses follow this format:

```json
{
  "success": true/false,
  "message": "Optional message",
  "data": { /* response data */ },
  "meta": { /* optional metadata */ }
}
```

---

## 🔗 Related Documentation

- [Authentication](./AUTHENTICATION.md) - Detailed auth flow
- [Error Handling](./ERROR_HANDLING.md) - Error codes
- [API Examples](./API_EXAMPLES.md) - Usage examples

---

**Last Updated:** 29 November 2025

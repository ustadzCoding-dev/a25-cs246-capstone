# API Documentation - Dicoding Academic Dashboard

**Version:** 1.0.0  
**Last Updated:** 7 November 2025  
**Base URL:** 
- Development: `http://localhost:3000/api`
- Staging: TBD
- Production: TBD

---

## 📋 Table of Contents

1. [Authentication](#authentication)
2. [Users](#users)
3. [Capstone Groups (Teams)](#capstone-groups)
4. [Use Cases](#use-cases)
5. [Documents](#documents)
6. [Timeline](#timeline)
7. [Learning Groups](#learning-groups)
8. [Error Handling](#error-handling)

---

## 🔐 Authentication

All protected endpoints require a Bearer token in the Authorization header.

### Headers
```
Authorization: Bearer <token>
Content-Type: application/json
```

### Login
```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Afrizal",
      "email": "afrizal@example.com",
      "role": "student",
      "learningPath": "Front-End"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Register
```http
POST /api/auth/register
```

**Request Body:**
```json
{
  "dicodingId": "F886D5Y0069",
  "name": "Afrizal",
  "email": "afrizal@example.com",
  "password": "password123",
  "learningPath": "Front-End",
  "university": "Universitas Indonesia"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": { ... },
    "token": "..."
  }
}
```

---

## 👥 Users

### Get Current User Profile
```http
GET /api/users/profile
```

**Headers:** `Authorization: Bearer <token>`

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "dicodingId": "F886D5Y0069",
    "name": "Afrizal",
    "email": "afrizal@example.com",
    "learningPath": "Front-End",
    "role": "student",
    "university": "Universitas Indonesia",
    "capstoneGroupId": "507f1f77bcf86cd799439012",
    "createdAt": "2025-11-01T00:00:00.000Z"
  }
}
```

### Update User Profile
```http
PUT /api/users/profile
```

**Request Body:**
```json
{
  "name": "Afrizal Updated",
  "phoneNumber": "081234567890",
  "university": "UI"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": { ... }
}
```

### Get All Users (Admin Only)
```http
GET /api/users
```

**Query Parameters:**
- `role` - Filter by role (student, admin, mentor)
- `learningPath` - Filter by learning path
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "users": [ ... ],
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

## 👨‍👩‍👧‍👦 Capstone Groups (Teams)

### Create Team
```http
POST /api/teams
```

**Request Body:**
```json
{
  "capstoneGroupId": "A25-CS246",
  "teamName": "Tim Awesome",
  "members": [
    {
      "userId": "507f1f77bcf86cd799439011",
      "role": "leader"
    },
    {
      "userId": "507f1f77bcf86cd799439012",
      "role": "member"
    }
  ],
  "leaderId": "507f1f77bcf86cd799439011"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Team created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439020",
    "capstoneGroupId": "A25-CS246",
    "teamName": "Tim Awesome",
    "status": "draft",
    "memberCount": 2,
    "createdAt": "2025-11-07T00:00:00.000Z"
  }
}
```

### Get All Teams
```http
GET /api/teams
```

**Query Parameters:**
- `status` - Filter by status (draft, pending, approved, rejected)
- `page` - Page number
- `limit` - Items per page

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "teams": [
      {
        "_id": "507f1f77bcf86cd799439020",
        "capstoneGroupId": "A25-CS246",
        "teamName": "Tim Awesome",
        "status": "pending",
        "memberCount": 3,
        "leader": {
          "name": "Afrizal",
          "email": "afrizal@example.com"
        },
        "submittedAt": "2025-11-07T00:00:00.000Z"
      }
    ],
    "pagination": { ... }
  }
}
```

### Get Team by ID
```http
GET /api/teams/:id
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439020",
    "capstoneGroupId": "A25-CS246",
    "teamName": "Tim Awesome",
    "members": [
      {
        "userId": {
          "_id": "507f1f77bcf86cd799439011",
          "name": "Afrizal",
          "email": "afrizal@example.com",
          "learningPath": "Front-End"
        },
        "role": "leader",
        "joinedAt": "2025-11-07T00:00:00.000Z"
      }
    ],
    "status": "pending",
    "selectedUseCaseId": "507f1f77bcf86cd799439030",
    "projectTitle": "Dashboard Enhancement",
    "submittedAt": "2025-11-07T00:00:00.000Z"
  }
}
```

### Update Team
```http
PUT /api/teams/:id
```

**Request Body:**
```json
{
  "teamName": "Tim Awesome Updated",
  "projectTitle": "New Title",
  "projectDescription": "Description here",
  "githubRepo": "https://github.com/user/repo"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Team updated successfully",
  "data": { ... }
}
```

### Submit Team for Validation
```http
POST /api/teams/:id/submit
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Team submitted for validation",
  "data": {
    "status": "pending",
    "submittedAt": "2025-11-07T00:00:00.000Z"
  }
}
```

### Approve Team (Admin Only)
```http
POST /api/teams/:id/approve
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Team approved successfully",
  "data": {
    "status": "approved",
    "validatedBy": "507f1f77bcf86cd799439099",
    "validatedAt": "2025-11-07T00:00:00.000Z"
  }
}
```

### Reject Team (Admin Only)
```http
POST /api/teams/:id/reject
```

**Request Body:**
```json
{
  "reason": "Team composition does not meet requirements"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Team rejected",
  "data": {
    "status": "rejected",
    "rejectionReason": "Team composition does not meet requirements",
    "validatedBy": "507f1f77bcf86cd799439099",
    "validatedAt": "2025-11-07T00:00:00.000Z"
  }
}
```

### Delete Team
```http
DELETE /api/teams/:id
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Team deleted successfully"
}
```

---

## 🎯 Use Cases

### Get All Use Cases
```http
GET /api/usecases
```

**Query Parameters:**
- `isActive` - Filter active use cases (true/false)
- `partner` - Filter by partner name

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439030",
      "useCaseCode": "DC-09",
      "title": "Enhancing Academic Dashboard",
      "description": "Add capstone project features",
      "partner": "Accenture",
      "totalSlots": 10,
      "availableSlots": 7,
      "difficulty": "intermediate",
      "isActive": true
    }
  ]
}
```

### Get Use Case by ID
```http
GET /api/usecases/:id
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439030",
    "useCaseCode": "DC-09",
    "title": "Enhancing Academic Dashboard",
    "description": "Add capstone project features to existing dashboard",
    "partner": "Accenture",
    "totalSlots": 10,
    "availableSlots": 7,
    "requirements": {
      "learningPaths": ["Front-End", "Back-End"],
      "minTeamSize": 3,
      "maxTeamSize": 5
    },
    "difficulty": "intermediate",
    "tags": ["dashboard", "web", "fullstack"],
    "assignedTeamsCount": 3
  }
}
```

### Create Use Case (Admin Only)
```http
POST /api/usecases
```

**Request Body:**
```json
{
  "useCaseCode": "DC-10",
  "title": "New Use Case",
  "description": "Description here",
  "partner": "Partner Name",
  "totalSlots": 5,
  "difficulty": "intermediate",
  "requirements": {
    "learningPaths": ["Front-End", "Back-End"],
    "minTeamSize": 3,
    "maxTeamSize": 5
  }
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Use case created successfully",
  "data": { ... }
}
```

---

## 📄 Documents

### Get All Documents
```http
GET /api/documents
```

**Query Parameters:**
- `category` - Filter by category (guideline, template, reference, submission)
- `visibility` - Filter by visibility (public, team-only, admin-only)
- `page` - Page number
- `limit` - Items per page

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "documents": [
      {
        "_id": "507f1f77bcf86cd799439040",
        "title": "Capstone Guidelines",
        "description": "Complete guidelines for capstone project",
        "fileName": "guidelines.pdf",
        "fileUrl": "https://storage.example.com/guidelines.pdf",
        "category": "guideline",
        "visibility": "public",
        "uploadedBy": {
          "name": "Admin",
          "email": "admin@dicoding.com"
        },
        "downloadCount": 150,
        "createdAt": "2025-11-01T00:00:00.000Z"
      }
    ],
    "pagination": { ... }
  }
}
```

### Get Document by ID
```http
GET /api/documents/:id
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439040",
    "title": "Capstone Guidelines",
    "description": "Complete guidelines",
    "fileName": "guidelines.pdf",
    "fileUrl": "https://storage.example.com/guidelines.pdf",
    "fileSize": 2048576,
    "fileType": "application/pdf",
    "category": "guideline",
    "visibility": "public",
    "downloadCount": 150,
    "uploader": { ... }
  }
}
```

### Upload Document (Admin Only)
```http
POST /api/documents
```

**Content-Type:** `multipart/form-data`

**Form Data:**
- `file` - File to upload
- `title` - Document title
- `description` - Document description
- `category` - Category (guideline, template, etc.)
- `visibility` - Visibility (public, team-only, admin-only)

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Document uploaded successfully",
  "data": { ... }
}
```

### Download Document
```http
GET /api/documents/:id/download
```

**Response:** File download

### Delete Document (Admin Only)
```http
DELETE /api/documents/:id
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Document deleted successfully"
}
```

---

## 📅 Timeline

### Get All Timeline Items
```http
GET /api/timeline
```

**Query Parameters:**
- `type` - Filter by type (milestone, deadline, submission, meeting, event)
- `status` - Filter by status (upcoming, ongoing, completed, overdue)
- `startDate` - Filter from date (ISO 8601)
- `endDate` - Filter to date (ISO 8601)

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439050",
      "title": "Project Plan Submission",
      "description": "Submit project plan document",
      "type": "submission",
      "startDate": "2025-10-31T00:00:00.000Z",
      "endDate": "2025-10-31T23:59:59.000Z",
      "status": "completed",
      "priority": "high",
      "daysRemaining": -7,
      "isOverdue": false
    }
  ]
}
```

### Get Upcoming Deadlines
```http
GET /api/timeline/upcoming
```

**Query Parameters:**
- `days` - Number of days ahead (default: 7)

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439051",
      "title": "Week 2 Deliverable",
      "endDate": "2025-11-13T23:59:59.000Z",
      "daysRemaining": 6,
      "priority": "high"
    }
  ]
}
```

### Get Overdue Items
```http
GET /api/timeline/overdue
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [ ... ]
}
```

### Create Timeline Item (Admin Only)
```http
POST /api/timeline
```

**Request Body:**
```json
{
  "title": "New Milestone",
  "description": "Description here",
  "type": "milestone",
  "startDate": "2025-11-15T00:00:00.000Z",
  "endDate": "2025-11-20T23:59:59.000Z",
  "priority": "high",
  "relatedTo": "all"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Timeline item created successfully",
  "data": { ... }
}
```

### Update Timeline Item (Admin Only)
```http
PUT /api/timeline/:id
```

**Request Body:**
```json
{
  "title": "Updated Title",
  "status": "completed"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Timeline item updated successfully",
  "data": { ... }
}
```

### Delete Timeline Item (Admin Only)
```http
DELETE /api/timeline/:id
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Timeline item deleted successfully"
}
```

---

## 👨‍🎓 Learning Groups

### Get All Learning Groups
```http
GET /api/learning-groups
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439060",
      "learningGroupId": "ASAH-2025-01",
      "name": "Group Alpha",
      "cohort": "Asah 2025 Batch 1",
      "mentor": "Mentor Name",
      "memberCount": 25,
      "maxMembers": 30,
      "availableSlots": 5,
      "isActive": true
    }
  ]
}
```

### Get Learning Group by ID
```http
GET /api/learning-groups/:id
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439060",
    "learningGroupId": "ASAH-2025-01",
    "name": "Group Alpha",
    "cohort": "Asah 2025 Batch 1",
    "mentor": "Mentor Name",
    "mentorEmail": "mentor@example.com",
    "members": [ ... ],
    "schedule": {
      "day": "Monday",
      "time": "19:00-21:00",
      "timezone": "Asia/Jakarta"
    },
    "startDate": "2025-10-01T00:00:00.000Z",
    "endDate": "2025-12-31T23:59:59.000Z"
  }
}
```

---

## ❌ Error Handling

### Error Response Format

All errors follow this format:

```json
{
  "success": false,
  "message": "Error message here",
  "errors": ["Detailed error 1", "Detailed error 2"]
}
```

### HTTP Status Codes

- `200` - OK
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (missing or invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate resource)
- `500` - Internal Server Error

### Common Error Examples

**400 Bad Request:**
```json
{
  "success": false,
  "message": "Validation Error",
  "errors": [
    "Email is required",
    "Password must be at least 6 characters"
  ]
}
```

**401 Unauthorized:**
```json
{
  "success": false,
  "message": "Invalid or expired token"
}
```

**403 Forbidden:**
```json
{
  "success": false,
  "message": "Access denied. Admin role required."
}
```

**404 Not Found:**
```json
{
  "success": false,
  "message": "Team not found"
}
```

**409 Conflict:**
```json
{
  "success": false,
  "message": "Email already exists"
}
```

---

## 📝 Notes

### Pagination

All list endpoints support pagination with these query parameters:
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10, max: 100)

Response includes pagination info:
```json
{
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 50,
    "itemsPerPage": 10,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

### Date Format

All dates use ISO 8601 format: `YYYY-MM-DDTHH:mm:ss.sssZ`

Example: `2025-11-07T00:00:00.000Z`

### File Upload

Maximum file size: 5MB  
Supported formats: PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX, ZIP

---

## 🔗 Postman Collection

Postman collection will be available at: `docs/api/postman_collection.json`

---

**Last Updated:** 7 November 2025  
**Maintained by:** Tim A25-CS246  
**Contact:** asah@dicoding.com

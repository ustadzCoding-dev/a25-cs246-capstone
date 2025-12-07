# 📚 API Reference

Dokumentasi lengkap semua 50+ API endpoints DC-09 Capstone Project.

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Users](#users)
4. [Teams](#teams)
5. [Invitations](#invitations)
6. [Documents](#documents)
7. [Timeline](#timeline)
8. [Announcements](#announcements)
9. [Learning Paths](#learning-paths)
10. [Use Cases](#use-cases)
11. [Dashboard](#dashboard)
12. [Health Check](#health-check)
13. [Error Responses](#error-responses)
14. [Status Codes](#status-codes)

---

## Overview

### Base URL

- **Development:** `http://localhost:8000/api`
- **Production:** `https://api.yourdomain.com/api`

### Authentication

All endpoints (except public ones) require JWT Bearer token:

```
Authorization: Bearer <jwt_token>
```

### Response Format

All responses follow this format:

```json
{
  "success": true,
  "message": "Success message",
  "data": {
    /* response data */
  }
}
```

### Interactive Documentation

- **Swagger UI:** http://localhost:8000/api-docs
- **OpenAPI JSON:** http://localhost:8000/api-docs.json

---

## Authentication

### POST /auth/register

Register new user account.

**Request:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "learningPath": "Front-End"
}
```

**Response (201):**

```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "...",
      "email": "john@example.com",
      "name": "John Doe",
      "role": "student",
      "learningPath": "Front-End"
    },
    "accessToken": "eyJhbGc..."
  }
}
```

**Errors:**

- `400` - Validation error or user already exists
- `500` - Server error

---

### POST /auth/login

Login with email and password.

**Request:**

```json
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      /* user object */
    },
    "accessToken": "eyJhbGc..."
  }
}
```

**Errors:**

- `401` - Invalid credentials
- `400` - Validation error

---

### POST /auth/logout

Logout user.

**Authentication:** Required (Bearer token)

**Response (200):**

```json
{
  "success": true,
  "message": "Logout successful"
}
```

---

### GET /auth/me

Get current authenticated user.

**Authentication:** Required

**Response (200):**

```json
{
  "success": true,
  "data": {
    /* user object */
  }
}
```

---

## Users

### GET /users

Get all users (Admin only).

**Authentication:** Required (Admin)

**Query Parameters:**

- `role` - Filter by role (student/admin)
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)

**Response (200):**

```json
{
  "success": true,
  "data": [
    {
      /* user objects */
    }
  ],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "pages": 10
  }
}
```

---

### GET /user/profile

Get current user profile.

**Authentication:** Required

**Response (200):**

```json
{
  "success": true,
  "data": {
    /* user object */
  }
}
```

---

### PUT /user/profile/update

Update user profile.

**Authentication:** Required

**Request:**

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "learningPath": "Back-End"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Profile updated successfully",
  "data": {
    /* updated user */
  }
}
```

---

### PUT /user/password/change

Change password.

**Authentication:** Required

**Request:**

```json
{
  "currentPassword": "OldPass123!",
  "newPassword": "NewPass123!"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

---

### POST /user/profile-picture/upload

Upload profile picture.

**Authentication:** Required

**Request:** multipart/form-data

- `profilePicture` - Image file (JPG, PNG, max 5MB)

**Response (200):**

```json
{
  "success": true,
  "message": "Profile picture uploaded",
  "data": {
    "profilePicture": "https://cloudinary.com/..."
  }
}
```

---

### DELETE /user/profile-picture/delete

Delete profile picture.

**Authentication:** Required

**Response (200):**

```json
{
  "success": true,
  "message": "Profile picture deleted"
}
```

---

### PUT /users/{id}/role

Change user role (Admin only).

**Authentication:** Required (Admin)

**Request:**

```json
{
  "role": "admin"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "User role updated",
  "data": {
    /* updated user */
  }
}
```

---

## Teams

### POST /capstone-group/register

Register new capstone team.

**Authentication:** Required (Student)

**Request:**

```json
{
  "teamName": "Team Alpha",
  "selectedUseCaseId": "...",
  "membersUserId": ["userId1", "userId2", "userId3", "userId4", "userId5"]
}
```

**Response (201):**

```json
{
  "success": true,
  "message": "Team registered successfully",
  "data": {
    "_id": "...",
    "teamName": "Team Alpha",
    "status": "pending",
    "membersUserId": [...]
  }
}
```

---

### GET /capstone-groups

Get all capstone teams.

**Authentication:** Required

**Query Parameters:**

- `status` - Filter by status (pending/approved/rejected)
- `useCaseId` - Filter by use case
- `page` - Page number
- `limit` - Items per page

**Response (200):**

```json
{
  "success": true,
  "data": [
    /* team objects */
  ],
  "pagination": {
    /* pagination info */
  }
}
```

---

### GET /capstone-group/current

Get current user's team.

**Authentication:** Required

**Response (200):**

```json
{
  "success": true,
  "data": {
    /* team object */
  }
}
```

**Errors:**

- `404` - User not in a team

---

### GET /capstone-group/{id}

Get team by ID.

**Authentication:** Required

**Response (200):**

```json
{
  "success": true,
  "data": {
    /* team object */
  }
}
```

---

### PUT /capstone-group/{id}/edit

Edit team (before approval).

**Authentication:** Required (Team leader)

**Request:**

```json
{
  "membersUserId": ["userId1", "userId2", "userId3", "userId4", "userId5"]
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Team updated",
  "data": {
    /* updated team */
  }
}
```

---

### PUT /capstone-group/{id}/approve

Approve team (Admin only).

**Authentication:** Required (Admin)

**Response (200):**

```json
{
  "success": true,
  "message": "Team approved",
  "data": {
    /* updated team */
  }
}
```

---

### PUT /capstone-group/{id}/reject

Reject team (Admin only).

**Authentication:** Required (Admin)

**Request:**

```json
{
  "rejectionReason": "Composition does not match requirement"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Team rejected",
  "data": {
    /* updated team */
  }
}
```

---

### DELETE /capstone-group/{id}

Delete team (Admin only).

**Authentication:** Required (Admin)

**Response (200):**

```json
{
  "success": true,
  "message": "Team deleted"
}
```

---

### GET /capstone-group/export-csv

Export teams to CSV (Admin only).

**Authentication:** Required (Admin)

**Query Parameters:**

- `status` - Filter by status
- `useCaseId` - Filter by use case

**Response (200):** CSV file

---

### POST /capstone-group/bulk-approve

Bulk approve teams (Admin only).

**Authentication:** Required (Admin)

**Request:**

```json
{
  "teamIds": ["id1", "id2", "id3"]
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Teams approved",
  "data": { "approvedCount": 3 }
}
```

---

### POST /capstone-group/bulk-reject

Bulk reject teams (Admin only).

**Authentication:** Required (Admin)

**Request:**

```json
{
  "teamIds": ["id1", "id2", "id3"],
  "rejectionReason": "Composition invalid"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Teams rejected",
  "data": { "rejectedCount": 3 }
}
```

---

### POST /capstone-group/bulk-delete

Bulk delete teams (Admin only).

**Authentication:** Required (Admin)

**Request:**

```json
{
  "teamIds": ["id1", "id2", "id3"]
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Teams deleted",
  "data": { "deletedCount": 3 }
}
```

---

## Invitations

### GET /invitations

Get pending invitations for current user.

**Authentication:** Required

**Response (200):**

```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "teamId": "...",
      "leaderId": "...",
      "status": "pending",
      "createdAt": "..."
    }
  ]
}
```

---

### GET /invitations/team/{teamId}

Get team invitations (Leader/Admin only).

**Authentication:** Required

**Response (200):**

```json
{
  "success": true,
  "data": [
    /* invitation objects */
  ]
}
```

---

### PUT /invitations/{id}/accept

Accept invitation.

**Authentication:** Required

**Response (200):**

```json
{
  "success": true,
  "message": "Invitation accepted",
  "data": {
    /* updated invitation */
  }
}
```

---

### PUT /invitations/{id}/reject

Reject invitation.

**Authentication:** Required

**Request:**

```json
{
  "rejectionReason": "Already in another team"
}
```

**Response (200):**

```json
{
  "success": true,
  "message": "Invitation rejected",
  "data": {
    /* updated invitation */
  }
}
```

---

### DELETE /invitations/{id}

Delete invitation (Leader/Admin only).

**Authentication:** Required

**Response (200):**

```json
{
  "success": true,
  "message": "Invitation deleted"
}
```

---

## Documents

### GET /documents

Get all documents.

**Authentication:** Required

**Query Parameters:**

- `category` - Filter by category
- `page` - Page number
- `limit` - Items per page

**Response (200):**

```json
{
  "success": true,
  "data": [
    /* document objects */
  ],
  "pagination": {
    /* pagination info */
  }
}
```

---

### POST /document/add

Upload document (Admin only).

**Authentication:** Required (Admin)

**Request:** multipart/form-data

- `file` - Document file
- `title` - Document title
- `description` - Document description
- `category` - Document category

**Response (201):**

```json
{
  "success": true,
  "message": "Document uploaded",
  "data": {
    /* document object */
  }
}
```

---

### GET /document/{id}

Get document by ID.

**Authentication:** Required

**Response (200):**

```json
{
  "success": true,
  "data": {
    /* document object */
  }
}
```

---

### PUT /document/{id}

Update document (Admin only).

**Authentication:** Required (Admin)

**Request:** multipart/form-data (optional file)

**Response (200):**

```json
{
  "success": true,
  "message": "Document updated",
  "data": {
    /* updated document */
  }
}
```

---

### DELETE /document/{id}

Delete document (Admin only).

**Authentication:** Required (Admin)

**Response (200):**

```json
{
  "success": true,
  "message": "Document deleted"
}
```

---

### GET /document/{id}/download

Download document.

**Authentication:** Required

**Response (200):** File download

---

## Timeline

### GET /timelines

Get all timelines.

**Authentication:** Required

**Response (200):**

```json
{
  "success": true,
  "data": [
    /* timeline objects */
  ]
}
```

---

### POST /timeline/add

Create timeline (Admin only).

**Authentication:** Required (Admin)

**Request:**

```json
{
  "title": "Proposal Submission",
  "description": "Submit capstone proposal",
  "startDate": "2025-12-15T00:00:00Z",
  "endDate": "2025-12-20T23:59:59Z"
}
```

**Response (201):**

```json
{
  "success": true,
  "message": "Timeline created",
  "data": {
    /* timeline object */
  }
}
```

---

### GET /timeline/{id}

Get timeline by ID.

**Authentication:** Required

**Response (200):**

```json
{
  "success": true,
  "data": {
    /* timeline object */
  }
}
```

---

### PUT /timeline/{id}

Update timeline (Admin only).

**Authentication:** Required (Admin)

**Request:** (same as create)

**Response (200):**

```json
{
  "success": true,
  "message": "Timeline updated",
  "data": {
    /* updated timeline */
  }
}
```

---

### DELETE /timeline/{id}

Delete timeline (Admin only).

**Authentication:** Required (Admin)

**Response (200):**

```json
{
  "success": true,
  "message": "Timeline deleted"
}
```

---

## Announcements

### GET /announcements

Get all announcements.

**Authentication:** Required

**Query Parameters:**

- `type` - Filter by type
- `page` - Page number
- `limit` - Items per page

**Response (200):**

```json
{
  "success": true,
  "data": [
    /* announcement objects */
  ],
  "pagination": {
    /* pagination info */
  }
}
```

---

### POST /announcements

Create announcement (Admin only).

**Authentication:** Required (Admin)

**Request:**

```json
{
  "title": "Important Update",
  "content": "Please read this important update...",
  "type": "warning"
}
```

**Response (201):**

```json
{
  "success": true,
  "message": "Announcement created",
  "data": {
    /* announcement object */
  }
}
```

---

### GET /announcements/{id}

Get announcement by ID.

**Authentication:** Required

**Response (200):**

```json
{
  "success": true,
  "data": {
    /* announcement object */
  }
}
```

---

### PUT /announcements/{id}

Update announcement (Admin only).

**Authentication:** Required (Admin)

**Request:** (same as create)

**Response (200):**

```json
{
  "success": true,
  "message": "Announcement updated",
  "data": {
    /* updated announcement */
  }
}
```

---

### DELETE /announcements/{id}

Delete announcement (Admin only).

**Authentication:** Required (Admin)

**Response (200):**

```json
{
  "success": true,
  "message": "Announcement deleted"
}
```

---

## Learning Paths

### GET /learning-paths

Get all active learning paths (Public).

**Response (200):**

```json
{
  "success": true,
  "data": [
    /* learning path objects */
  ]
}
```

---

### GET /admin/learning-paths

Get all learning paths (Admin only).

**Authentication:** Required (Admin)

**Response (200):**

```json
{
  "success": true,
  "data": [
    /* learning path objects */
  ]
}
```

---

### POST /admin/learning-paths

Create learning path (Admin only).

**Authentication:** Required (Admin)

**Request:**

```json
{
  "name": "Front-End Web Development",
  "code": "FE",
  "dicodingIdPrefix": "FE",
  "description": "Learn front-end development"
}
```

**Response (201):**

```json
{
  "success": true,
  "message": "Learning path created",
  "data": {
    /* learning path object */
  }
}
```

---

### GET /admin/learning-paths/{id}

Get learning path by ID (Admin only).

**Authentication:** Required (Admin)

**Response (200):**

```json
{
  "success": true,
  "data": {
    /* learning path object */
  }
}
```

---

### PUT /admin/learning-paths/{id}

Update learning path (Admin only).

**Authentication:** Required (Admin)

**Response (200):**

```json
{
  "success": true,
  "message": "Learning path updated",
  "data": {
    /* updated learning path */
  }
}
```

---

### DELETE /admin/learning-paths/{id}

Delete learning path (Admin only).

**Authentication:** Required (Admin)

**Response (200):**

```json
{
  "success": true,
  "message": "Learning path deleted"
}
```

---

### PUT /admin/learning-paths/{id}/toggle

Toggle learning path status (Admin only).

**Authentication:** Required (Admin)

**Response (200):**

```json
{
  "success": true,
  "message": "Learning path status toggled",
  "data": {
    /* updated learning path */
  }
}
```

---

## Use Cases

### GET /use-cases

Get all use cases.

**Authentication:** Required

**Response (200):**

```json
{
  "success": true,
  "data": [
    /* use case objects */
  ]
}
```

---

### GET /use-cases/{id}

Get use case by ID.

**Authentication:** Required

**Response (200):**

```json
{
  "success": true,
  "data": {
    /* use case object */
  }
}
```

---

## Dashboard

### GET /dashboard/stats

Get admin dashboard statistics (Admin only).

**Authentication:** Required (Admin)

**Response (200):**

```json
{
  "success": true,
  "data": {
    "totalTeams": 50,
    "pendingTeams": 10,
    "approvedTeams": 35,
    "rejectedTeams": 5,
    "totalStudents": 250
  }
}
```

---

### GET /dashboard/student-stats

Get student dashboard statistics (Student only).

**Authentication:** Required (Student)

**Response (200):**

```json
{
  "success": true,
  "data": {
    "teamStatus": "approved",
    "teamName": "Team Alpha",
    "membersCount": 5,
    "selectedUseCase": "DC-01"
  }
}
```

---

## Health Check

### GET /health

Health check endpoint (Public).

**Response (200):**

```json
{
  "success": true,
  "message": "API is running",
  "timestamp": "2025-12-08T...",
  "googleOAuth": "configured"
}
```

---

## Error Responses

### Standard Error Response

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error message"
  }
}
```

### Validation Error

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "email",
        "message": "Email is required"
      }
    ]
  }
}
```

---

## Status Codes

| Code  | Meaning      | Description                       |
| ----- | ------------ | --------------------------------- |
| `200` | OK           | Request successful                |
| `201` | Created      | Resource created successfully     |
| `400` | Bad Request  | Validation error                  |
| `401` | Unauthorized | Missing or invalid authentication |
| `403` | Forbidden    | Insufficient permissions          |
| `404` | Not Found    | Resource not found                |
| `409` | Conflict     | Resource already exists           |
| `500` | Server Error | Internal server error             |

---

## Rate Limiting

- **Limit:** 100 requests per 15 minutes per IP
- **Headers:**
  - `X-RateLimit-Limit`: 100
  - `X-RateLimit-Remaining`: Remaining requests
  - `X-RateLimit-Reset`: Reset timestamp

---

## Pagination

### Query Parameters

- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10, max: 100)

### Response Format

```json
{
  "success": true,
  "data": [
    /* items */
  ],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "pages": 10
  }
}
```

---

## Filtering

### Common Filter Parameters

- `status` - Filter by status
- `role` - Filter by role
- `category` - Filter by category
- `type` - Filter by type

---

## Sorting

### Query Parameter

- `sort` - Sort field (prefix with `-` for descending)
- Example: `sort=-createdAt` (newest first)

---

## Swagger UI

Interactive API documentation available at:

- **Development:** http://localhost:8000/api-docs
- **Production:** https://api.yourdomain.com/api-docs

---

**Last Updated:** December 8, 2025 | **Version:** 1.0.0

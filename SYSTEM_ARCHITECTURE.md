# 🏗️ System Architecture - Best Practice

## 📋 Layers & Flow

### Layer 1: Frontend (Vue 3 + Pinia)

```
User Interface
    ↓
Views (Pages)
    ↓
Stores (Pinia - State Management)
    ↓
Composables (Reusable Logic)
    ↓
Services (API Calls)
    ↓
HTTP Request to Backend
```

### Layer 2: Backend (Express.js)

```
HTTP Request
    ↓
Routes (API Endpoints)
    ↓
Middleware (Security, Auth, Validation)
    ↓
Controllers (Request Handlers)
    ↓
Services (Business Logic)
    ↓
Models (Database Schema)
    ↓
Database Query
    ↓
MongoDB
```

### Layer 3: Database (MongoDB)

```
Collections:
- users
- capstonegroups (teams)
- documents
- timelines
- announcements
- usecases
```

---

## 🔐 Authentication Flow

```
1. User enters credentials
2. Frontend sends POST /api/auth/login
3. Backend validates credentials
4. Backend generates JWT token
5. Frontend stores token in localStorage
6. Frontend adds token to all future requests
7. Backend verifies token on each request
```

### Token Structure

```
Header: Authorization: Bearer {token}
Token contains: user_id, role, email, expiry
```

---

## 👤 Authorization Flow

```
1. User makes request with token
2. Backend middleware extracts token
3. Middleware verifies token validity
4. Middleware checks user role
5. If authorized: proceed to controller
6. If not authorized: return 403 Forbidden
```

### User Roles

```
- Admin: Full system access, team validation, document management, timeline management
- Student: Team registration, document upload, view timeline and announcements
```

---

## 👥 Team Management Flow

### Create Team (Student)

```
1. Student fills team form
2. Frontend validates form
3. Frontend sends POST /api/teams
4. Backend validates data
5. Backend checks member availability
6. Backend creates team with status "pending"
7. Frontend shows success message
8. Team appears in admin dashboard
```

### Approve Team (Admin)

```
1. Admin views pending teams
2. Admin clicks "Approve"
3. Frontend sends PUT /api/teams/:id/approve
4. Backend updates status to "approved"
5. Backend notifies team members
6. Frontend shows success message
```

---

## 📄 Document Management Flow

### Upload Document (Student)

```
1. Student selects file
2. Frontend validates file (size, type)
3. Frontend sends multipart/form-data
4. Backend receives file
5. Backend stores file in storage
6. Backend saves metadata to database
7. Frontend shows success message
```

### Download Document

```
1. User clicks download
2. Frontend sends GET /api/documents/:id/download
3. Backend retrieves file from storage
4. Backend sends file to frontend
5. Browser downloads file
```

---

## 📅 Timeline Management Flow

### Create Event (Admin)

```
1. Admin fills event form
2. Frontend validates data
3. Frontend sends POST /api/timeline
4. Backend creates event
5. Backend saves to database
6. Frontend shows success message
7. Event appears in timeline
```

---

## 📢 Announcement Management Flow

### Create Announcement (Admin)

```
1. Admin fills announcement form
2. Frontend validates data
3. Frontend sends POST /api/announcements
4. Backend creates announcement
5. Backend saves to database
6. Frontend shows success message
7. Announcement visible to all users
```

---

## ⚠️ Error Handling Flow

### Error Response Format

```json
{
  "statusCode": 400,
  "code": "VALIDATION_ERROR",
  "message": "Validation failed",
  "details": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ],
  "timestamp": "2025-11-18T15:00:00.000Z"
}
```

### Error Types

```
- 400: Bad Request (validation error)
- 401: Unauthorized (invalid token)
- 403: Forbidden (no permission)
- 404: Not Found (resource not found)
- 500: Server Error (internal error)
```

### Frontend Error Handling

```
1. Catch API error
2. Check error status code
3. Display appropriate error message
4. Log error to console
5. Offer retry or alternative action
```

---

## 🔄 Data Flow Example: Team Registration

### Step-by-Step

**Frontend Side:**

```
1. User fills team form
   - Team name
   - Select members
   - Select use case

2. User clicks "Register"
   - Form validation (client-side)
   - Show loading state

3. Frontend sends request
   - POST /api/teams
   - Body: { teamName, membersUserId, useCaseId }
   - Header: Authorization: Bearer {token}

4. Wait for response
   - Show loading spinner
   - Disable form

5. Response received
   - If success: show success message, redirect
   - If error: show error message, keep form

6. Update store
   - Add team to teamStore
   - Update UI
```

**Backend Side:**

```
1. Receive request
   - Extract token from header
   - Extract body data

2. Middleware processing
   - Verify token (auth middleware)
   - Check user role (authorization middleware)
   - Validate data (validation middleware)

3. Controller processing
   - Extract data from request
   - Call TeamService.createTeam()

4. Service processing
   - Validate members availability
   - Validate use case exists
   - Create team document
   - Update user documents
   - Update use case slots

5. Return response
   - If success: return team data + 201
   - If error: return error object + status code

6. Frontend receives response
   - Parse JSON
   - Update UI
   - Show message
```

---

## 🧪 Testing Points

### Frontend Testing

```
- Form validation works
- API calls are made correctly
- Responses are handled correctly
- Error messages display
- Loading states show
- Data updates in store
- UI updates correctly
```

### Backend Testing

```
- Endpoints respond correctly
- Authentication works
- Authorization works
- Validation works
- Business logic works
- Database operations work
- Error handling works
```

### Integration Testing

```
- Frontend ↔ Backend communication
- Data flows correctly
- Error handling end-to-end
- User workflows complete
```

---

## 📊 Request/Response Example

### Login Request

```
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@dicoding.com",
  "password": "AdminPassword123!"
}
```

### Login Response (Success)

```
HTTP 200 OK
Content-Type: application/json

{
  "statusCode": 200,
  "message": "Login successful",
  "data": {
    "user": {
      "_id": "user123",
      "email": "admin@dicoding.com",
      "role": "admin",
      "name": "Admin User"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Login Response (Error)

```
HTTP 401 Unauthorized
Content-Type: application/json

{
  "statusCode": 401,
  "code": "INVALID_CREDENTIALS",
  "message": "Invalid email or password",
  "timestamp": "2025-11-18T15:00:00.000Z"
}
```

---

## ✅ Best Practices Implemented

### Frontend

- ✅ Pinia for centralized state management
- ✅ Composables for reusable logic
- ✅ Services for API communication
- ✅ Error handling with user-friendly messages
- ✅ Loading states for async operations
- ✅ Form validation before submission

### Backend

- ✅ Layered architecture (routes → controllers → services → models)
- ✅ Middleware for cross-cutting concerns
- ✅ JWT authentication
- ✅ Role-based authorization
- ✅ Input validation
- ✅ Consistent error responses
- ✅ Business logic in services

### Database

- ✅ MongoDB with Mongoose
- ✅ Schema validation
- ✅ Relationships between collections
- ✅ Indexes for performance

---

## 🎯 Summary

**Frontend** → **Backend** → **Database**

1. User interacts with UI
2. Frontend validates & sends request
3. Backend processes request
4. Backend queries database
5. Database returns data
6. Backend processes response
7. Frontend receives & displays data
8. User sees result

**All with proper error handling, authentication, and authorization!**

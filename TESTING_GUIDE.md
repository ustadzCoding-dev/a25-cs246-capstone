# 🧪 Testing Guide - A25-CS246 Capstone Project

## 📋 Table of Contents

1. [System Flow Overview](#system-flow-overview)
2. [Authentication Flow](#authentication-flow)
3. [Team Registration Flow](#team-registration-flow)
4. [Document Management Flow](#document-management-flow)
5. [Timeline Management Flow](#timeline-management-flow)
6. [Testing Scenarios](#testing-scenarios)

---

## 🔄 System Flow Overview

```
┌─────────────┐
│   User      │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────────┐
│         AUTHENTICATION LAYER            │
│  ┌──────────────┐    ┌──────────────┐  │
│  │ Local Login  │    │ Google OAuth │  │
│  └──────┬───────┘    └──────┬───────┘  │
│         └────────┬───────────┘          │
│                  ▼                       │
│         ┌────────────────┐              │
│         │  JWT Tokens    │              │
│         │ (Access+Refresh)│             │
│         └────────┬───────┘              │
└──────────────────┼──────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│      AUTHORIZATION MIDDLEWARE           │
│         (Role-Based Access)             │
│                                         │
│  ┌────────┐  ┌────────┐  ┌──────────┐ │
│  │Student │  │ Admin  │  │  Mentor  │ │
│  └────┬───┘  └────┬───┘  └─────┬────┘ │
└───────┼───────────┼─────────────┼──────┘
        │           │             │
        ▼           ▼             ▼
┌─────────────────────────────────────────┐
│           API ENDPOINTS                  │
│                                          │
│  ┌──────────────────────────────────┐   │
│  │  Student Routes:                 │   │
│  │  - View Teams                    │   │
│  │  - Register Team                 │   │
│  │  - View Documents                │   │
│  │  - Download Documents            │   │
│  │  - View Timeline                 │   │
│  │  - View Announcements            │   │
│  └──────────────────────────────────┘   │
│                                          │
│  ┌──────────────────────────────────┐   │
│  │  Admin Routes:                   │   │
│  │  - Approve/Reject Teams          │   │
│  │  - Upload Documents              │   │
│  │  - Manage Timeline               │   │
│  │  - Create Announcements          │   │
│  │  - Manage Use Cases              │   │
│  └──────────────────────────────────┘   │
└─────────────────┬────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│         DATABASE (MongoDB)               │
│                                          │
│  Users | Teams | Documents | Timeline   │
│  UseCases | Announcements | Groups      │
└──────────────────────────────────────────┘
```

---

## 🔐 Authentication Flow

### 1. Local Authentication Flow

```
START
  │
  ▼
┌─────────────────────────┐
│ User Input:             │
│ - Email                 │
│ - Password              │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│ POST /api/auth/login    │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│ Validate Email Format   │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│ Find User in DB         │
└───────────┬─────────────┘
            │
        ┌───┴───┐
        │       │
   NOT FOUND  FOUND
        │       │
        ▼       ▼
    [ERROR] ┌─────────────────────┐
    401     │ Compare Password    │
            │ (bcrypt.compare)    │
            └───────┬─────────────┘
                    │
                ┌───┴───┐
                │       │
              FAIL    MATCH
                │       │
                ▼       ▼
            [ERROR] ┌─────────────────────┐
            401     │ Generate Tokens:    │
                    │ - Access Token (1h) │
                    │ - Refresh Token(7d)│
                    └───────┬─────────────┘
                            │
                            ▼
                    ┌─────────────────────┐
                    │ Update lastLogin    │
                    │ Save refresh token  │
                    └───────┬─────────────┘
                            │
                            ▼
                    ┌─────────────────────┐
                    │ Return:             │
                    │ - User data         │
                    │ - Access token      │
                    │ - Refresh token     │
                    └─────────────────────┘
                            │
                            ▼
                          [END]
```

### 2. Google OAuth Flow

```
START
  │
  ▼
┌─────────────────────────┐
│ User clicks             │
│ "Login with Google"     │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│ Redirect to Google      │
│ /api/auth/google        │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│ Google Authentication   │
│ (User consent)          │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│ Callback:               │
│ /api/auth/google/callback│
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│ Check if user exists    │
│ (by googleId or email)  │
└───────────┬─────────────┘
            │
        ┌───┴───┐
        │       │
   NEW USER  EXISTING
        │       │
        ▼       ▼
┌───────────┐ ┌──────────────┐
│Create New │ │Update Profile│
│User with  │ │(if needed)   │
│Google data│ └──────┬───────┘
└─────┬─────┘        │
      │              │
      └──────┬───────┘
             │
             ▼
┌─────────────────────────┐
│ Check Profile Complete: │
│ - dicodingId?           │
│ - learningPath?         │
│ - university?           │
└───────────┬─────────────┘
            │
        ┌───┴───┐
        │       │
   INCOMPLETE COMPLETE
        │       │
        ▼       ▼
┌─────────────┐ ┌──────────────┐
│Redirect to  │ │Generate JWT  │
│/profile/    │ │tokens        │
│complete     │ └──────┬───────┘
└─────────────┘        │
                       ▼
                ┌──────────────┐
                │Redirect to   │
                │dashboard     │
                └──────────────┘
                       │
                       ▼
                     [END]
```

---

## 👥 Team Registration Flow

```
START (Student logged in)
  │
  ▼
┌─────────────────────────────────┐
│ Student navigates to            │
│ /team/register                  │
└───────────┬─────────────────────┘
            │
            ▼
┌─────────────────────────────────┐
│ Check if student already        │
│ has a team (capstoneGroupId)    │
└───────────┬─────────────────────┘
            │
        ┌───┴───┐
        │       │
   HAS TEAM  NO TEAM
        │       │
        ▼       ▼
┌─────────────┐ ┌─────────────────────┐
│Redirect to  │ │Show Registration    │
│/team (view) │ │Form                 │
└─────────────┘ └──────┬──────────────┘
                       │
                       ▼
                ┌──────────────────────┐
                │ Student fills:       │
                │ - Team Name          │
                │ - Use Case           │
                │ - Member IDs (1-3)   │
                │ - Learning Paths     │
                └──────┬───────────────┘
                       │
                       ▼
                ┌──────────────────────┐
                │ Submit Form:         │
                │ POST /api/capstone-  │
                │ group/add            │
                └──────┬───────────────┘
                       │
                       ▼
┌────────────────────────────────────────────┐
│          BACKEND VALIDATION                │
│                                            │
│  1. Check team name uniqueness             │
│     └─> Duplicate? → ERROR 400             │
│                                            │
│  2. Validate members exist in DB           │
│     └─> Not found? → ERROR 400             │
│                                            │
│  3. Check team size (2-4 members)          │
│     └─> Invalid? → ERROR 400               │
│                                            │
│  4. Check technical member requirement     │
│     └─> No FE/BE member? → ERROR 400       │
│                                            │
│  5. Check members availability             │
│     └─> Already in team? → ERROR 400       │
│                                            │
│  6. Validate use case                      │
│     └─> Invalid/Closed? → ERROR 400        │
└────────────────┬───────────────────────────┘
                 │
                 ▼ ALL VALID
┌─────────────────────────────────┐
│ Generate Team ID (TI-001)       │
│ via Counter model               │
└───────────┬─────────────────────┘
            │
            ▼
┌─────────────────────────────────┐
│ Create CapstoneGroup document:  │
│ - status: "pending"             │
│ - submittedAt: now()            │
└───────────┬─────────────────────┘
            │
            ▼
┌─────────────────────────────────┐
│ Update all members:             │
│ - Set capstoneGroupId           │
└───────────┬─────────────────────┘
            │
            ▼
┌─────────────────────────────────┐
│ Update UseCase:                 │
│ - Add team to capstoneGroup[]   │
│ - Decrease availableSlots       │
│ - Set status="closed" if full   │
└───────────┬─────────────────────┘
            │
            ▼
┌─────────────────────────────────┐
│ Return SUCCESS 201              │
│ - Team data                     │
└───────────┬─────────────────────┘
            │
            ▼
┌─────────────────────────────────┐
│ Frontend: Show success message  │
│ Redirect to /team               │
└─────────────────────────────────┘
            │
            ▼
          [END]
```

### Admin Approval Flow

```
START (Admin logged in)
  │
  ▼
┌─────────────────────────────────┐
│ Admin views pending teams       │
│ GET /api/capstone-groups        │
│ ?status=pending                 │
└───────────┬─────────────────────┘
            │
            ▼
┌─────────────────────────────────┐
│ Select team to review           │
└───────────┬─────────────────────┘
            │
        ┌───┴───┐
        │       │
    APPROVE  REJECT
        │       │
        ▼       ▼
┌─────────────┐ ┌─────────────────┐
│PUT /api/    │ │PUT /api/        │
│capstone-    │ │capstone-        │
│group/:id/   │ │group/:id/       │
│approve      │ │reject           │
└──────┬──────┘ │+ reason         │
       │        └────────┬────────┘
       │                 │
       ▼                 ▼
┌─────────────┐   ┌──────────────┐
│Update:      │   │Update:       │
│status=      │   │status=       │
│"approved"   │   │"rejected"    │
│validatedBy  │   │validatedBy   │
│validatedAt  │   │validatedAt   │
└──────┬──────┘   │rejectionReason│
       │          └────────┬──────┘
       │                   │
       └─────────┬─────────┘
                 │
                 ▼
          ┌──────────────┐
          │Notify Student│
          │(future)      │
          └──────────────┘
                 │
                 ▼
               [END]
```

---

## 📄 Document Management Flow

### Student View Documents

```
START (Student logged in)
  │
  ▼
┌─────────────────────────────────┐
│ Navigate to /documents          │
└───────────┬─────────────────────┘
            │
            ▼
┌─────────────────────────────────┐
│ GET /api/documents              │
│ ?category=&visibility=public    │
└───────────┬─────────────────────┘
            │
            ▼
┌─────────────────────────────────┐
│ Backend filters documents:      │
│ - Public visibility only        │
│ - Optional category filter      │
│ - Pagination (page, limit)      │
└───────────┬─────────────────────┘
            │
            ▼
┌─────────────────────────────────┐
│ Return document list            │
│ with pagination info            │
└───────────┬─────────────────────┘
            │
            ▼
┌─────────────────────────────────┐
│ Student clicks download         │
└───────────┬─────────────────────┘
            │
            ▼
┌─────────────────────────────────┐
│ GET /api/document/:id/download  │
└───────────┬─────────────────────┘
            │
            ▼
┌─────────────────────────────────┐
│ Backend:                        │
│ 1. Find document by ID          │
│ 2. Check file exists on disk    │
│ 3. Stream file to response      │
└───────────┬─────────────────────┘
            │
            ▼
┌─────────────────────────────────┐
│ Browser downloads file          │
└─────────────────────────────────┘
            │
            ▼
          [END]
```

### Admin Upload Document

```
START (Admin logged in)
  │
  ▼
┌─────────────────────────────────┐
│ Navigate to /admin/documents    │
│ Click "Upload Document"         │
└───────────┬─────────────────────┘
            │
            ▼
┌─────────────────────────────────┐
│ Fill upload form:               │
│ - Title                         │
│ - Description                   │
│ - Category                      │
│ - Visibility                    │
│ - File (select)                 │
└───────────┬─────────────────────┘
            │
            ▼
┌─────────────────────────────────┐
│ Submit:                         │
│ POST /api/document/upload       │
│ Content-Type: multipart/form-data│
└───────────┬─────────────────────┘
            │
            ▼
┌────────────────────────────────────────────┐
│      MULTER MIDDLEWARE VALIDATION          │
│                                            │
│  1. Check file type                        │
│     └─> Invalid? → ERROR 400               │
│     (Allowed: PDF, DOC, XLS, PPT, TXT, ZIP)│
│                                            │
│  2. Check file size                        │
│     └─> > 10MB? → ERROR 400                │
│                                            │
│  3. Generate unique filename               │
│     (timestamp + random + sanitized name)  │
│                                            │
│  4. Save to /uploads/documents/            │
└────────────────┬───────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────┐
│ Controller validation:          │
│ - Check title uniqueness        │
│ - Validate required fields      │
└───────────┬─────────────────────┘
            │
        ┌───┴───┐
        │       │
     FAIL    SUCCESS
        │       │
        ▼       ▼
┌─────────────┐ ┌─────────────────┐
│Delete upload│ │Save to DB:      │
│file         │ │- fileName       │
│Return ERROR │ │- fileUrl        │
└─────────────┘ │- uploadedBy     │
                │- isActive=true  │
                └────────┬────────┘
                         │
                         ▼
                  ┌──────────────┐
                  │Return SUCCESS│
                  │201 + document│
                  └──────────────┘
                         │
                         ▼
                       [END]
```

---

## 📅 Timeline Management Flow

### View Timeline

```
START (Any authenticated user)
  │
  ▼
┌─────────────────────────────────┐
│ Navigate to /timeline           │
└───────────┬─────────────────────┘
            │
            ▼
┌─────────────────────────────────┐
│ GET /api/timelines              │
│ ?status=&type=                  │
└───────────┬─────────────────────┘
            │
            ▼
┌─────────────────────────────────┐
│ Backend calculates:             │
│ - daysRemaining (endDate - now) │
│ - isOverdue (endDate < now)     │
│ - status (upcoming/ongoing/     │
│   overdue based on dates)       │
└───────────┬─────────────────────┘
            │
            ▼
┌─────────────────────────────────┐
│ Return timelines sorted by date │
└───────────┬─────────────────────┘
            │
            ▼
┌─────────────────────────────────┐
│ Frontend displays:              │
│ - Current timeline highlighted  │
│ - Upcoming deadlines            │
│ - Overdue items (if any)        │
│ - Visual progress bar           │
└─────────────────────────────────┘
            │
            ▼
          [END]
```

### Admin Create Timeline

```
START (Admin logged in)
  │
  ▼
┌─────────────────────────────────┐
│ Fill timeline form:             │
│ - Title                         │
│ - Description                   │
│ - Type (submission/meeting/etc) │
│ - Start Date                    │
│ - End Date                      │
│ - Priority (high/medium/low)    │
└───────────┬─────────────────────┘
            │
            ▼
┌─────────────────────────────────┐
│ POST /api/timeline/add          │
└───────────┬─────────────────────┘
            │
            ▼
┌─────────────────────────────────┐
│ Backend validation:             │
│ 1. Check title uniqueness       │
│ 2. Validate date format         │
│ 3. Check startDate < endDate    │
└───────────┬─────────────────────┘
            │
            ▼
┌─────────────────────────────────┐
│ Calculate (using dayjs):        │
│ - daysRemaining                 │
│ - isOverdue                     │
│ - status (based on dates vs now)│
└───────────┬─────────────────────┘
            │
            ▼
┌─────────────────────────────────┐
│ Save to database                │
│ createdBy: admin._id            │
└───────────┬─────────────────────┘
            │
            ▼
┌─────────────────────────────────┐
│ Return SUCCESS 201              │
└─────────────────────────────────┘
            │
            ▼
          [END]
```

---

## 🧪 Testing Scenarios

### 1. Authentication Tests

#### Local Login Tests

```javascript
✅ Should login with valid credentials
✅ Should return 401 for invalid email
✅ Should return 401 for wrong password
✅ Should return access token and refresh token
✅ Should update lastLogin timestamp
✅ Should save refresh token to database
```

#### Google OAuth Tests

```javascript
✅ Should redirect to Google OAuth consent page
✅ Should create new user for first-time Google login
✅ Should link existing user by email
✅ Should redirect to profile completion if incomplete
✅ Should redirect to dashboard if profile complete
```

#### Token Refresh Tests

```javascript
✅ Should refresh access token with valid refresh token
✅ Should return 401 for invalid refresh token
✅ Should return 401 for expired refresh token
```

---

### 2. Team Registration Tests

#### Validation Tests (ALREADY IMPLEMENTED ✅)

```javascript
✅ Should reject duplicate team name
✅ Should reject team with < 2 members
✅ Should reject team with > 4 members
✅ Should reject team without technical member
✅ Should reject if member already in another team
✅ Should reject invalid use case ID
✅ Should reject closed use case
✅ Should accept valid team composition (2-4 members, 1+ technical)
```

#### Integration Tests (TODO)

```javascript
⏳ Should create team and update all members' capstoneGroupId
⏳ Should generate unique team ID (TI-001, TI-002, etc)
⏳ Should update use case availableSlots
⏳ Should set use case status to "closed" when full
⏳ Should allow team leader to update pending team
⏳ Should prevent update after approval
```

#### Admin Approval Tests (TODO)

```javascript
⏳ Should allow admin to approve pending team
⏳ Should allow admin to reject with reason
⏳ Should prevent non-admin from approving
⏳ Should update validatedBy and validatedAt fields
⏳ Should prevent approval of already-processed team
```

---

### 3. Document Management Tests

#### Student Access Tests (TODO)

```javascript
⏳ Should list public documents only
⏳ Should filter by category
⏳ Should paginate results
⏳ Should download document successfully
⏳ Should return 404 for non-existent document
⏳ Should return 404 if file not found on disk
```

#### Admin Upload Tests (TODO)

```javascript
⏳ Should upload valid file (PDF, DOC, etc)
⏳ Should reject invalid file type
⏳ Should reject file > 10MB
⏳ Should generate unique filename
⏳ Should save file to /uploads/documents/
⏳ Should create document record in database
⏳ Should reject duplicate title
⏳ Should delete uploaded file if validation fails
⏳ Should prevent non-admin from uploading
```

---

### 4. Timeline Tests

#### View Tests (TODO)

```javascript
⏳ Should list all timelines
⏳ Should filter by status (upcoming/ongoing/overdue)
⏳ Should filter by type
⏳ Should calculate daysRemaining correctly
⏳ Should mark as overdue when endDate < now
⏳ Should sort by startDate
```

#### Admin CRUD Tests (TODO)

```javascript
⏳ Should create timeline with valid data
⏳ Should reject duplicate title
⏳ Should validate date format
⏳ Should reject if startDate > endDate
⏳ Should update timeline
⏳ Should delete timeline
⏳ Should prevent non-admin from creating
```

---

## 📝 Test Execution Order

### Phase 1: Unit Tests (Current Focus)

1. ✅ **Models validation** (Mongoose schema)
2. ✅ **Store logic** (Pinia stores) - DONE (24 tests passing)
3. ✅ **Components** (Vue components) - DONE (24 tests passing)
4. ⏳ **Controllers validation logic** - PARTIAL (11 tests)
5. ⏳ **Middleware** (auth, upload, validation)
6. ⏳ **Utils** (JWT, logger)

### Phase 2: Integration Tests

1. ⏳ **API endpoints** (Supertest)
2. ⏳ **Database operations** (CRUD)
3. ⏳ **File upload flow** (end-to-end)
4. ⏳ **Authentication flow** (login → access resources)

### Phase 3: E2E Tests (Optional)

1. ⏳ **Complete user journey** (signup → create team → view documents)
2. ⏳ **Admin workflow** (approve team → upload doc → create timeline)

---

## 🎯 Coverage Target

### Current Coverage

- **Frontend**: 24 tests passing (100% pass rate)

  - Team Store: 10 tests ✅
  - Components: 14 tests ✅

- **Backend**: 11 validation tests
  - Team Registration: 11 tests ✅

### Target Coverage (80%)

- **Frontend**: Need ~50+ more tests

  - Document Store tests
  - Timeline Store tests
  - Auth Store tests
  - More component tests

- **Backend**: Need ~40+ more tests
  - Document controller tests
  - Timeline controller tests
  - Auth controller tests
  - Middleware tests
  - Integration tests

---

## 🚀 Running Tests

### Frontend Tests

```bash
cd frontend

# Run all tests
npm run test:unit

# Watch mode
npm run test

# With UI
npm run test:ui

# Coverage report
npm run test:coverage
```

### Backend Tests

```bash
cd backend

# Run all tests
npm run test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

---

## ✅ Test Checklist

### Before Testing

- [ ] Database is running (MongoDB)
- [ ] Environment variables are set
- [ ] All dependencies installed
- [ ] No compilation errors

### During Testing

- [ ] All tests pass
- [ ] No console errors
- [ ] Coverage meets target (80%)
- [ ] Edge cases covered

### After Testing

- [ ] Review coverage report
- [ ] Fix failing tests
- [ ] Add missing tests
- [ ] Commit test files

---

**Happy Testing! 🧪**

# 🔄 DATA FLOW DIAGRAMS

Detailed data flow for key system processes.

---

## 🔐 Authentication Flow

### Local Authentication

```
┌─────────────────────────────────────────────────────────┐
│ Frontend                                                │
│ ┌──────────────────────────────────────────────────┐   │
│ │ Login Form                                       │   │
│ │ - Email input                                    │   │
│ │ - Password input                                 │   │
│ └──────────────────────────────────────────────────┘   │
│                      ↓                                   │
│ ┌──────────────────────────────────────────────────┐   │
│ │ POST /auth/login                                 │   │
│ │ { email, password }                              │   │
│ └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────────┐
│ Backend                                                 │
│ ┌──────────────────────────────────────────────────┐   │
│ │ authController.login()                           │   │
│ │ 1. Validate input                                │   │
│ │ 2. Find user in database                         │   │
│ │ 3. Compare password with hash                    │   │
│ │ 4. Generate JWT token                            │   │
│ │ 5. Return token + user data                      │   │
│ └──────────────────────────────────────────────────┘   │
│                      ↓                                   │
│ ┌──────────────────────────────────────────────────┐   │
│ │ Database Query                                   │   │
│ │ db.users.findOne({ email })                      │   │
│ └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────────┐
│ Frontend                                                │
│ ┌──────────────────────────────────────────────────┐   │
│ │ Response: { token, user }                        │   │
│ │ 1. Store token in localStorage                   │   │
│ │ 2. Store user in Pinia store                     │   │
│ │ 3. Redirect to dashboard                         │   │
│ └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

---

## 🔐 Google OAuth Flow

```
┌─────────────────────────────────────────────────────────┐
│ Frontend                                                │
│ ┌──────────────────────────────────────────────────┐   │
│ │ "Login with Google" button                       │   │
│ └──────────────────────────────────────────────────┘   │
│                      ↓                                   │
│ ┌──────────────────────────────────────────────────┐   │
│ │ Redirect to Google OAuth                         │   │
│ │ https://accounts.google.com/o/oauth2/v2/auth    │   │
│ └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────────┐
│ Google                                                  │
│ ┌──────────────────────────────────────────────────┐   │
│ │ User authorizes application                      │   │
│ │ Google generates authorization code              │   │
│ └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────────┐
│ Backend                                                 │
│ ┌──────────────────────────────────────────────────┐   │
│ │ GET /auth/google/callback?code=...               │   │
│ │ 1. Exchange code for token                       │   │
│ │ 2. Get user info from Google                     │   │
│ │ 3. Check if user exists                          │   │
│ │ 4. If new: Create user account                   │   │
│ │ 5. If existing: Update lastLogin                 │   │
│ │ 6. Generate JWT token                            │   │
│ │ 7. Redirect to frontend with token               │   │
│ └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────────┐
│ Frontend                                                │
│ ┌──────────────────────────────────────────────────┐   │
│ │ Receive token from callback                      │   │
│ │ 1. Store token in localStorage                   │   │
│ │ 2. Redirect to profile completion                │   │
│ │ (if new user)                                    │   │
│ │ OR dashboard (if existing)                       │   │
│ └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

---

## 👥 Team Registration Flow

```
┌─────────────────────────────────────────────────────────┐
│ Frontend                                                │
│ ┌──────────────────────────────────────────────────┐   │
│ │ Team Registration Form                           │   │
│ │ 1. Select use case                               │   │
│ │ 2. Enter member IDs                              │   │
│ │ 3. Auto-fetch learning paths                     │   │
│ │ 4. Validate composition                          │   │
│ │ 5. Submit form                                   │   │
│ └──────────────────────────────────────────────────┘   │
│                      ↓                                   │
│ ┌──────────────────────────────────────────────────┐   │
│ │ POST /capstone-groups                            │   │
│ │ { name, useCaseId, memberIds, learningPaths }   │   │
│ └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────────┐
│ Backend                                                 │
│ ┌──────────────────────────────────────────────────┐   │
│ │ capstoneGroupController.createTeam()             │   │
│ │ 1. Validate input                                │   │
│ │ 2. Validate composition                          │   │
│ │ 3. Check member availability                     │   │
│ │ 4. Create team in database                       │   │
│ │ 5. Create invitations for members                │   │
│ │ 6. Send emails                                   │   │
│ │ 7. Return success response                       │   │
│ └──────────────────────────────────────────────────┘   │
│                      ↓                                   │
│ ┌──────────────────────────────────────────────────┐   │
│ │ Database Operations                              │   │
│ │ 1. Insert CapstoneGroup                          │   │
│ │ 2. Update User.capstoneGroupId                   │   │
│ │ 3. Insert Invitations                            │   │
│ │ 4. Update UseCase.usedSlots                      │   │
│ └──────────────────────────────────────────────────┘   │
│                      ↓                                   │
│ ┌──────────────────────────────────────────────────┐   │
│ │ Email Service                                    │   │
│ │ 1. For each member:                              │   │
│ │    - Generate email content                      │   │
│ │    - Send via Nodemailer                         │   │
│ │    - Log result                                  │   │
│ └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────────────────┐
│ Frontend                                                │
│ ┌──────────────────────────────────────────────────┐   │
│ │ Response: { success, team }                      │   │
│ │ 1. Show success message                          │   │
│ │ 2. Redirect to dashboard                         │   │
│ │ 3. Update team list                              │   │
│ └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

---

## 📧 Invitation Flow

```
Invitation Created
    ↓
Email Service
    ├─ Generate email
    ├─ Send via SMTP
    └─ Log result
    ↓
Member Receives Email
    ↓
Member Clicks Accept/Reject
    ↓
Frontend: PUT /invitations/:id/accept or /reject
    ↓
Backend: Update invitation status
    ↓
If Accept:
    ├─ Add member to team
    ├─ Update User.capstoneGroupId
    ├─ Send confirmation email
    └─ Update frontend

If Reject:
    ├─ Keep member out of team
    ├─ Send rejection email to leader
    └─ Update frontend
```

---

## 📤 File Upload Flow (Profile Picture)

```
Frontend
    ↓
User selects file
    ↓
Validate:
├─ File type (JPEG, PNG, etc.)
├─ File size (max 5MB)
└─ Image dimensions
    ↓
POST /user/profile-picture/upload
    ↓
Backend
    ↓
Multer middleware
    ├─ Receive file
    └─ Validate again
    ↓
CloudinaryService.upload()
    ├─ Upload to Cloudinary
    ├─ Get CDN URL
    └─ Return URL
    ↓
Update User.profilePicture
    ↓
Return response with URL
    ↓
Frontend
    ├─ Display new picture
    ├─ Update Pinia store
    └─ Show success message
```

---

## 📊 Data Persistence

### Request → Response Cycle

```
1. Frontend sends request
   ↓
2. Express middleware processes
   ├─ CORS check
   ├─ Auth check
   ├─ Rate limit check
   └─ Body parsing
   ↓
3. Route handler executes
   ↓
4. Controller processes
   ├─ Validate input
   ├─ Call service
   └─ Format response
   ↓
5. Service executes business logic
   ├─ Database queries
   ├─ External API calls
   └─ Data transformation
   ↓
6. Database operations
   ├─ Query execution
   ├─ Data validation
   └─ Result return
   ↓
7. Response sent to frontend
   ├─ Status code
   ├─ Headers
   └─ Body (JSON)
   ↓
8. Frontend processes response
   ├─ Parse JSON
   ├─ Update state
   └─ Update UI
```

---

## 🔐 Authentication Header Flow

```
Frontend stores token
    ↓
Every request includes:
Authorization: Bearer <token>
    ↓
Backend middleware checks:
├─ Token exists
├─ Token valid
├─ Token not expired
└─ User has permission
    ↓
If valid: Continue
If invalid: Return 401 Unauthorized
```

---

**Last Updated:** 29 November 2025

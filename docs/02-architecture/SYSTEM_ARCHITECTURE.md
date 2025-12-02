# 🏛️ SYSTEM ARCHITECTURE

High-level system design and architecture overview.

---

## 📊 System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     CLIENT LAYER (Frontend)                     │
│  Vue.js 3 + Vite + Pinia + Tailwind CSS (Port: 5173)           │
└────────────────────────────┬────────────────────────────────────┘
                             │
                    HTTP/REST API (CORS)
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                    API GATEWAY LAYER                            │
│  Express.js 5 + JWT Auth + Rate Limiting (Port: 8000)          │
└────────────────────────────┬────────────────────────────────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
┌───────▼────────┐  ┌────────▼────────┐  ┌──────▼──────────┐
│  Controllers   │  │   Middleware    │  │   Validators   │
│  (13 files)    │  │   (12 files)    │  │   (Joi)        │
└───────┬────────┘  └────────┬────────┘  └──────┬──────────┘
        │                    │                   │
        └────────────────────┼───────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                   BUSINESS LOGIC LAYER                          │
│  Services (TeamService, EmailService, CloudinaryService)       │
└────────────────────────────┬────────────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                    DATA ACCESS LAYER                            │
│  Mongoose Models (14 models) + MongoDB Queries                 │
└────────────────────────────┬────────────────────────────────────┘
                             │
┌────────────────────────────▼────────────────────────────────────┐
│                    DATABASE LAYER                               │
│  MongoDB 7 (Local or MongoDB Atlas)                            │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Data Flow Architecture

### Authentication Flow

```
User Input (Email/Password)
    ↓
Frontend Form
    ↓
POST /auth/login
    ↓
authController.login()
    ↓
Validate credentials
    ↓
Generate JWT Token
    ↓
Return token + user data
    ↓
Frontend stores token in localStorage
    ↓
Attach token to all future requests
```

### Google OAuth Flow

```
User clicks "Login with Google"
    ↓
Redirect to Google OAuth
    ↓
User authorizes
    ↓
Google redirects to /auth/google/callback
    ↓
authController.googleCallback()
    ↓
Check if user exists
    ↓
If new: Create user
If existing: Update lastLogin
    ↓
Generate JWT Token
    ↓
Redirect to frontend with token
    ↓
Frontend stores token
```

### Team Registration Flow

```
Student fills team form
    ↓
Frontend validates composition
    ↓
POST /capstone-groups
    ↓
capstoneGroupController.createTeam()
    ↓
Backend validates composition again
    ↓
Create team in database
    ↓
Create invitations for members
    ↓
EmailService sends emails
    ↓
Return success response
    ↓
Frontend redirects to dashboard
```

### Invitation Flow

```
Team created → Invitations created
    ↓
EmailService sends invitation emails
    ↓
Members receive emails
    ↓
Members click Accept/Reject link or use UI
    ↓
PUT /invitations/:id/accept or /reject
    ↓
invitationController updates status
    ↓
If accepted: Add member to team
    ↓
Frontend updates UI
```

---

## 🏗️ Component Architecture

### Frontend Components

```
App.vue (Root)
├── AuthLayout
│   ├── LoginPage
│   ├── SignUpPage
│   └── AuthCallback
├── DashboardLayout
│   ├── Sidebar
│   └── [Page Components]
│       ├── StudentDashboard
│       ├── AdminDashboard
│       ├── StudentTeam
│       ├── AdminTeamManagement
│       ├── StudentDocuments
│       ├── AdminDocuments
│       ├── StudentTimeline
│       ├── AdminTimeline
│       ├── StudentAnnouncements
│       ├── AdminAnnouncements
│       ├── StudentWorksheet
│       ├── AdminWorksheet
│       ├── ProfilePage
│       ├── ProfileComplete
│       ├── AdminLearningPaths
│       └── AdminUseCase
└── NotFound
```

### Backend Controllers

```
authController
├── login()
├── register()
├── googleCallback()
├── completeProfile()
└── changePassword()

userController
├── getProfile()
├── updateProfile()
├── uploadProfilePicture()
└── deleteProfilePicture()

capstoneGroupController
├── createTeam()
├── getAllTeams()
├── getTeamDetails()
├── editTeam()
├── approveTeam()
└── rejectTeam()

invitationController
├── getPendingInvitations()
├── getTeamInvitations()
├── createInvitation()
├── acceptInvitation()
├── rejectInvitation()
└── deleteInvitation()

[Similar for: documentController, timelineController, announcementController, worksheetController, etc.]
```

---

## 📦 State Management (Pinia)

### Store Structure

```
authStore
├── state
│   ├── user
│   ├── token
│   └── isAuthenticated
├── getters
│   ├── isAdmin
│   ├── isStudent
│   └── isLoggedIn
└── actions
    ├── login()
    ├── register()
    ├── logout()
    ├── handleGoogleCallback()
    └── completeProfile()

teamStore
├── state
│   ├── teams
│   ├── selectedTeam
│   └── loading
├── getters
│   ├── filteredTeams
│   └── teamCount
└── actions
    ├── fetchTeams()
    ├── createTeam()
    ├── editTeam()
    └── approveTeam()

[Similar for: documentStore, timelineStore, announcementStore, worksheetStore, usecaseStore]
```

---

## 🔐 Security Architecture

### Authentication

- **JWT Tokens:** Issued on login/register
- **Token Storage:** localStorage (frontend)
- **Token Expiration:** 7 days
- **Refresh:** Re-login required

### Authorization

- **Role-based Access Control (RBAC):**
  - `student` - Can create teams, submit worksheets
  - `admin` - Can approve teams, manage documents
  - `mentor` - Can review worksheets

### Data Protection

- **Password Hashing:** bcrypt (10 rounds)
- **CORS:** Restricted to frontend URL
- **Rate Limiting:** 100 requests/15 minutes
- **Input Validation:** Joi validators on all endpoints
- **XSS Protection:** Express middleware

### File Security

- **Profile Pictures:** Cloudinary (CDN)
- **Documents:** Cloudinary or local storage
- **File Size Limits:** 5MB for images, 50MB for documents
- **File Type Validation:** Whitelist allowed types

---

## 🗄️ Database Architecture

### Collections (14 total)

1. **users** - User accounts
2. **learningpaths** - Learning path definitions
3. **usecases** - Use case definitions
4. **capstonegroups** - Teams
5. **invitations** - Team invitations
6. **documents** - Capstone documents
7. **timelines** - Milestones & deadlines
8. **announcements** - System announcements
9. **worksheets** - Student worksheets
10. **worksheetperiods** - Worksheet periods
11. **learninggroups** - Learning groups
12. **counters** - Auto-increment counters
13. **auditlogs** - Audit trail (optional)
14. **sessions** - Session management (optional)

### Indexing Strategy

- **Unique Indexes:** email, dicodingId, code
- **Compound Indexes:** (userId, status), (teamId, status)
- **TTL Indexes:** For session expiration

---

## 🔄 Integration Points

### External Services

1. **Google OAuth**

   - Endpoint: `https://accounts.google.com/o/oauth2/v2/auth`
   - Callback: `/auth/google/callback`

2. **Cloudinary**

   - Image upload & storage
   - CDN delivery
   - Automatic optimization

3. **Email Service (Nodemailer)**
   - SMTP: Gmail or custom
   - Templates: Invitation, announcement
   - Async sending

---

## 📊 Scalability Considerations

### Horizontal Scaling

- **Load Balancer:** Nginx or AWS ALB
- **Multiple Instances:** Node.js clusters
- **Session Storage:** Redis for distributed sessions
- **Database Replication:** MongoDB replica set

### Vertical Scaling

- **Caching:** Redis for frequently accessed data
- **Database Optimization:** Proper indexing
- **Code Optimization:** Lazy loading, code splitting
- **CDN:** Cloudinary for static files

### Performance Optimization

- **Frontend:**

  - Code splitting
  - Lazy loading routes
  - Image optimization
  - Minification & compression

- **Backend:**
  - Query optimization
  - Connection pooling
  - Caching strategies
  - Async operations

---

## 🚀 Deployment Architecture

### Development Environment

```
Local Machine
├── Frontend (Vite dev server)
├── Backend (Node.js with nodemon)
└── MongoDB (local or Atlas)
```

### Staging Environment

```
Staging Server
├── Frontend (Vercel)
├── Backend (Railway)
└── Database (MongoDB Atlas)
```

### Production Environment

```
Production Server
├── Frontend (Vercel CDN)
├── Backend (Railway with auto-scaling)
├── Database (MongoDB Atlas with backups)
├── Cache (Redis)
└── Monitoring (Sentry, DataDog)
```

---

## 📈 Monitoring & Logging

### Application Monitoring

- **Error Tracking:** Sentry
- **Performance Monitoring:** New Relic or DataDog
- **Uptime Monitoring:** Pingdom or UptimeRobot

### Logging

- **Application Logs:** Winston or Bunyan
- **Access Logs:** Morgan middleware
- **Database Logs:** MongoDB logs
- **Log Aggregation:** ELK Stack or Splunk

---

## 🔗 Related Documentation

- [Database Schema](./DATABASE_SCHEMA.md) - Detailed model documentation
- [API Reference](../03-api/API_REFERENCE.md) - All endpoints
- [Data Flow](./DATA_FLOW.md) - Detailed data flow diagrams

---

**Last Updated:** 29 November 2025

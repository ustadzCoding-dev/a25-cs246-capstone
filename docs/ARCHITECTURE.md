# 🏗️ Architecture & System Design

Dokumentasi lengkap arsitektur sistem DC-09 Capstone Project Management.

---

## 📋 Table of Contents

1. [System Overview](#system-overview)
2. [Technology Stack](#technology-stack)
3. [Architecture Diagram](#architecture-diagram)
4. [Frontend Architecture](#frontend-architecture)
5. [Backend Architecture](#backend-architecture)
6. [Database Architecture](#database-architecture)
7. [Authentication Flow](#authentication-flow)
8. [Data Flow](#data-flow)
9. [Deployment Architecture](#deployment-architecture)
10. [Security Architecture](#security-architecture)

---

## System Overview

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      CLIENT LAYER                           │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Web Browser (Vue 3 + Vite)                            │ │
│  │  - Student Dashboard                                  │ │
│  │  - Team Management Interface                          │ │
│  │  - Document Repository                               │ │
│  │  - Timeline & Announcements                          │ │
│  │  - Admin Control Panel                               │ │
│  └────────────────────────────────────────────────────────┘ │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTPS/REST API
                       │
┌──────────────────────▼──────────────────────────────────────┐
│                    API LAYER                                │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  Express.js Server (Node.js)                           │ │
│  │  - 50+ REST API Endpoints                              │ │
│  │  - JWT Authentication & Authorization                 │ │
│  │  - Input Validation & Error Handling                  │ │
│  │  - Business Logic & Services                          │ │
│  │  - Middleware Pipeline                                │ │
│  │  - Swagger/OpenAPI Documentation                      │ │
│  └────────────────────────────────────────────────────────┘ │
└──────────────────────┬──────────────────────────────────────┘
                       │
        ┌──────────────┼──────────────┐
        │              │              │
        ▼              ▼              ▼
┌──────────────┐ ┌──────────┐ ┌──────────┐
│   MongoDB    │ │Cloudinary│ │  Gmail   │
│  (Database)  │ │(Storage) │ │ (Email)  │
└──────────────┘ └──────────┘ └──────────┘
```

---

## Technology Stack

### Frontend Stack

| Layer                | Technology   | Version | Purpose                          |
| -------------------- | ------------ | ------- | -------------------------------- |
| **Framework**        | Vue.js       | 3.x     | Progressive JavaScript framework |
| **Build Tool**       | Vite         | 5.x     | Next-gen build tool              |
| **Styling**          | Tailwind CSS | 3.x     | Utility-first CSS                |
| **State Management** | Pinia        | 2.x     | Vue state management             |
| **Routing**          | Vue Router   | 4.x     | Client-side routing              |
| **HTTP Client**      | Axios        | 1.x     | Promise-based HTTP client        |
| **Icons**            | Lucide Vue   | Latest  | Icon library                     |
| **Testing**          | Vitest       | 4.x     | Unit testing framework           |

### Backend Stack

| Layer              | Technology  | Version | Purpose                 |
| ------------------ | ----------- | ------- | ----------------------- |
| **Framework**      | Express.js  | 4.x     | Web framework           |
| **Runtime**        | Node.js     | 18+ LTS | JavaScript runtime      |
| **Database**       | MongoDB     | 7.x     | NoSQL database          |
| **ODM**            | Mongoose    | 8.x     | MongoDB object modeling |
| **Authentication** | JWT         | Latest  | Token-based auth        |
| **OAuth**          | Passport.js | 0.7.x   | OAuth 2.0 strategy      |
| **Password Hash**  | Bcrypt      | 6.x     | Password hashing        |
| **File Upload**    | Multer      | 2.x     | File upload handling    |
| **Cloud Storage**  | Cloudinary  | 2.x     | Cloud file storage      |
| **Email**          | Nodemailer  | 7.x     | Email service           |
| **API Docs**       | Swagger     | 3.x     | OpenAPI documentation   |
| **Testing**        | Vitest      | 1.x     | Unit testing framework  |

### Infrastructure

| Service              | Provider       | Purpose                        |
| -------------------- | -------------- | ------------------------------ |
| **Frontend Hosting** | Vercel         | Frontend deployment            |
| **Backend Hosting**  | Railway        | Backend deployment             |
| **Database**         | MongoDB Atlas  | Cloud database                 |
| **File Storage**     | Cloudinary     | Cloud storage                  |
| **Email Service**    | Gmail SMTP     | Email notifications            |
| **OAuth Provider**   | Google         | Social authentication          |
| **CI/CD**            | GitHub Actions | Automated testing & deployment |

---

## Architecture Diagram

### Component Interaction

```
┌─────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Student    │  │    Admin     │  │   Mentor     │      │
│  │  Dashboard   │  │   Dashboard  │  │  Dashboard   │      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘      │
└─────────┼──────────────────┼──────────────────┼──────────────┘
          │                  │                  │
          └──────────────────┼──────────────────┘
                             │ REST API
┌────────────────────────────▼────────────────────────────────┐
│                   APPLICATION LAYER                         │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Express.js Application Server                      │   │
│  │  ┌──────────────────────────────────────────────┐   │   │
│  │  │ Routes (50+ endpoints)                       │   │   │
│  │  │ - Auth Routes                                │   │   │
│  │  │ - Team Routes                                │   │   │
│  │  │ - Document Routes                            │   │   │
│  │  │ - Timeline Routes                            │   │   │
│  │  │ - Announcement Routes                        │   │   │
│  │  └──────────────────────────────────────────────┘   │   │
│  │  ┌──────────────────────────────────────────────┐   │   │
│  │  │ Middleware Pipeline                          │   │   │
│  │  │ - Authentication (JWT/OAuth)                 │   │   │
│  │  │ - Authorization (Role-based)                 │   │   │
│  │  │ - Validation (Joi schemas)                   │   │   │
│  │  │ - Error Handling                             │   │   │
│  │  │ - CORS & Security                            │   │   │
│  │  └──────────────────────────────────────────────┘   │   │
│  │  ┌──────────────────────────────────────────────┐   │   │
│  │  │ Controllers (13 controllers)                 │   │   │
│  │  │ - Auth Controller                            │   │   │
│  │  │ - Team Controller                            │   │   │
│  │  │ - Document Controller                        │   │   │
│  │  │ - Timeline Controller                        │   │   │
│  │  │ - Announcement Controller                    │   │   │
│  │  └──────────────────────────────────────────────┘   │   │
│  │  ┌──────────────────────────────────────────────┐   │   │
│  │  │ Services (6 services)                        │   │   │
│  │  │ - Team Service                               │   │   │
│  │  │ - Email Service                              │   │   │
│  │  │ - Cloudinary Service                         │   │   │
│  │  │ - Auth Service                               │   │   │
│  │  └──────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────┘   │
└────────────────────┬────────────────────────────────────────┘
                     │
        ┌────────────┼────────────┐
        │            │            │
        ▼            ▼            ▼
┌──────────────┐ ┌──────────┐ ┌──────────┐
│   MongoDB    │ │Cloudinary│ │  Gmail   │
│  (Database)  │ │(Storage) │ │ (Email)  │
└──────────────┘ └──────────┘ └──────────┘
```

---

## Frontend Architecture

### Directory Structure

```
frontend/src/
├── components/              # Reusable components (28 files)
│   ├── modals/             # Modal dialogs
│   ├── cards/              # Card components
│   ├── forms/              # Form components
│   ├── navigation/         # Navigation components
│   └── ...
├── views/                  # Page components (27 files)
│   ├── auth/               # Login, register pages
│   ├── team/               # Team management pages
│   ├── documents/          # Document pages
│   ├── timeline/           # Timeline pages
│   ├── announcements/      # Announcement pages
│   ├── admin/              # Admin pages
│   └── ...
├── stores/                 # Pinia state management (8 stores)
│   ├── authStore.js        # Authentication state
│   ├── teamStore.js        # Team state
│   ├── userStore.js        # User state
│   ├── documentStore.js    # Document state
│   ├── timelineStore.js    # Timeline state
│   ├── announcementStore.js# Announcement state
│   └── ...
├── services/               # API services (10 files)
│   ├── authService.js
│   ├── teamService.js
│   ├── documentService.js
│   ├── timelineService.js
│   ├── announcementService.js
│   └── ...
├── router/                 # Vue Router configuration
│   └── index.js            # Route definitions
├── composables/            # Composition functions (5 files)
│   ├── useStudentMenu.js
│   ├── useAdminMenu.js
│   └── ...
├── utils/                  # Utility functions
│   └── validators.js
├── assets/                 # Static assets
└── main.js                 # Entry point
```

### State Management (Pinia)

```
┌─────────────────────────────────────────┐
│         Pinia Store (State)             │
├─────────────────────────────────────────┤
│ authStore                               │
│ - user                                  │
│ - token                                 │
│ - isAuthenticated                       │
│ - role                                  │
├─────────────────────────────────────────┤
│ teamStore                               │
│ - currentTeam                           │
│ - teams                                 │
│ - teamStatus                            │
├─────────────────────────────────────────┤
│ documentStore                           │
│ - documents                             │
│ - selectedDocument                      │
├─────────────────────────────────────────┤
│ ... other stores                        │
└─────────────────────────────────────────┘
```

### Data Flow (Frontend)

```
User Action
    ↓
Component Event Handler
    ↓
Service Call (API)
    ↓
Pinia Store Update
    ↓
Component Re-render
    ↓
UI Update
```

---

## Backend Architecture

### Directory Structure

```
backend/src/
├── config/                 # Configuration files
│   ├── database.js        # MongoDB connection
│   ├── swagger.js         # Swagger/OpenAPI config
│   ├── cloudinary.js      # Cloudinary config
│   └── passport.js        # Passport OAuth config
├── models/                # MongoDB schemas (14 models)
│   ├── User.js
│   ├── CapstoneGroup.js
│   ├── Invitation.js
│   ├── Document.js
│   ├── Timeline.js
│   ├── Announcement.js
│   ├── UseCase.js
│   ├── LearningPath.js
│   ├── LearningGroup.js
│   ├── Counter.js
│   ├── Worksheet.js
│   ├── WorksheetPeriod.js
│   └── ...
├── controllers/           # Route handlers (13 controllers)
│   ├── authController.js
│   ├── userController.js
│   ├── capstoneGroupController.js
│   ├── invitationController.js
│   ├── documentController.js
│   ├── timelineController.js
│   ├── announcementController.js
│   ├── dashboardController.js
│   └── ...
├── services/              # Business logic (6 services)
│   ├── TeamService.js
│   ├── EmailService.js
│   ├── CloudinaryService.js
│   ├── AuthService.js
│   └── ...
├── middleware/            # Express middleware (12 files)
│   ├── auth.js            # JWT authentication
│   ├── authorize.js       # Role-based authorization
│   ├── validation.js      # Input validation
│   ├── errorHandler.js    # Error handling
│   ├── security.js        # Security headers
│   ├── multer.js          # File upload
│   ├── multerProfilePicture.js
│   ├── responseFormatter.js
│   ├── auditLogger.js
│   └── ...
├── routes/                # API routes
│   ├── index.js           # Main routes (50+ endpoints)
│   └── auth.js            # Auth routes
├── docs/                  # API documentation
│   └── swagger-endpoints.js
├── utils/                 # Utility functions (7 files)
│   ├── validators.js      # Validation schemas
│   ├── errorHandler.js    # Error utilities
│   ├── logger.js          # Logging utility
│   └── ...
├── tests/                 # Test files (4 files)
│   ├── auth.test.js
│   ├── team.test.js
│   └── ...
└── server.js              # Entry point
```

### Request Processing Pipeline

```
HTTP Request
    ↓
CORS Middleware
    ↓
Body Parser
    ↓
Authentication Middleware (JWT/OAuth)
    ↓
Authorization Middleware (Role-based)
    ↓
Validation Middleware (Joi schemas)
    ↓
Route Handler
    ↓
Controller Logic
    ↓
Service Logic
    ↓
Database Query (Mongoose)
    ↓
Response Formatter
    ↓
HTTP Response
```

---

## Database Architecture

### 14 MongoDB Collections

```
┌─────────────────────────────────────────────────────┐
│              MongoDB Database                       │
├─────────────────────────────────────────────────────┤
│ Users Collection                                    │
│ - _id, email, name, role, learningPath             │
│ - provider, isEmailVerified, isActive              │
├─────────────────────────────────────────────────────┤
│ CapstoneGroups Collection                          │
│ - _id, capstoneGroupId, teamName, leaderId         │
│ - membersUserId, selectedUseCaseId, status         │
├─────────────────────────────────────────────────────┤
│ Invitations Collection                             │
│ - _id, leaderId, memberId, teamId, status          │
│ - rejectionReason, expiresAt                       │
├─────────────────────────────────────────────────────┤
│ Documents Collection                               │
│ - _id, title, description, fileUrl, category       │
│ - uploadedBy, fileSize, fileType                   │
├─────────────────────────────────────────────────────┤
│ Timelines Collection                               │
│ - _id, title, description, startDate, endDate      │
│ - status, createdBy                                │
├─────────────────────────────────────────────────────┤
│ Announcements Collection                           │
│ - _id, title, content, type, createdBy             │
│ - isPublished, publishedAt                         │
├─────────────────────────────────────────────────────┤
│ UseCases Collection                                │
│ - _id, useCaseId, title, description               │
│ - composition, totalSlots, availableSlots          │
├─────────────────────────────────────────────────────┤
│ LearningPaths Collection                           │
│ - _id, name, code, description, isActive           │
│ - dicodingIdPrefix                                 │
├─────────────────────────────────────────────────────┤
│ LearningGroups Collection                          │
│ - _id, learningGroupId, cohort, mentorName         │
│ - maxMembers, currentMembers, isActive             │
├─────────────────────────────────────────────────────┤
│ Counter Collection                                 │
│ - _id, sequence_value                              │
├─────────────────────────────────────────────────────┤
│ Worksheets Collection (Phase 2)                    │
│ - _id, periodId, userId, teamId, content           │
│ - status, submittedAt, validatedAt                 │
├─────────────────────────────────────────────────────┤
│ WorksheetPeriods Collection (Phase 2)              │
│ - _id, periodNumber, title, startDate, deadline    │
│ - autoValidationDate, status                       │
└─────────────────────────────────────────────────────┘
```

### Relationships

```
User ──┬─→ CapstoneGroup (leader)
       ├─→ CapstoneGroup (member)
       ├─→ Invitation (sender/receiver)
       ├─→ Document (uploader)
       ├─→ Timeline (creator)
       ├─→ Announcement (creator)
       └─→ LearningPath

CapstoneGroup ──┬─→ Invitation
                ├─→ UseCase
                └─→ LearningGroup

LearningPath ──→ LearningGroup

LearningGroup ──→ User
```

---

## Authentication Flow

### JWT + Google OAuth

```
┌─────────────────────────────────────────────────────┐
│         Authentication Flow                        │
├─────────────────────────────────────────────────────┤
│ 1. User Login/Register                             │
│    ├─ Email/Password → Hash with Bcrypt           │
│    └─ Google OAuth → Passport.js                   │
│                                                     │
│ 2. Generate JWT Token                              │
│    ├─ Payload: userId, role, email                │
│    ├─ Secret: JWT_SECRET from .env                │
│    └─ Expiry: 7 days                              │
│                                                     │
│ 3. Store Token                                     │
│    ├─ Frontend: localStorage                       │
│    └─ Backend: Session (optional)                  │
│                                                     │
│ 4. Subsequent Requests                             │
│    ├─ Header: Authorization: Bearer <token>       │
│    ├─ Verify: JWT signature & expiry              │
│    └─ Extract: userId, role from token            │
│                                                     │
│ 5. Authorization Check                             │
│    ├─ Check role (student/admin/mentor)           │
│    ├─ Check permissions                            │
│    └─ Allow/Deny access                            │
└─────────────────────────────────────────────────────┘
```

---

## Data Flow

### Team Registration Flow

```
Student
  ↓
Fill Registration Form
  ↓
Submit to Backend
  ↓
Validate Composition
  ├─ Check learning paths
  ├─ Check member count
  └─ Check use case slots
  ↓
Create CapstoneGroup
  ↓
Generate Invitations
  ↓
Send Emails
  ↓
Update Frontend State
  ↓
Show Confirmation
```

### Document Upload Flow

```
Admin
  ↓
Upload File
  ↓
Multer Middleware
  ├─ Validate file type
  ├─ Check file size
  └─ Store in Cloudinary
  ↓
Save to Database
  ├─ Document model
  ├─ File URL
  └─ Metadata
  ↓
Return Response
  ↓
Update Document List
```

---

## Deployment Architecture

### Production Environment

```
┌─────────────────────────────────────────────────────┐
│              Production Deployment                 │
├─────────────────────────────────────────────────────┤
│ Frontend (Vercel)                                   │
│ - Automatic deployment on push to main             │
│ - CDN distribution                                 │
│ - SSL/TLS certificate                              │
│ - Custom domain                                    │
├─────────────────────────────────────────────────────┤
│ Backend (Railway)                                   │
│ - Automatic deployment on push to main             │
│ - Environment variables management                 │
│ - Health checks & auto-restart                     │
│ - Logging & monitoring                             │
├─────────────────────────────────────────────────────┤
│ Database (MongoDB Atlas)                            │
│ - M0 Free tier (development)                       │
│ - Automatic backups every 5 minutes                │
│ - 35-day backup retention                          │
│ - Point-in-time restore                            │
├─────────────────────────────────────────────────────┤
│ File Storage (Cloudinary)                           │
│ - Cloud storage for documents                      │
│ - CDN for fast delivery                            │
│ - Automatic optimization                           │
├─────────────────────────────────────────────────────┤
│ Email Service (Gmail SMTP)                          │
│ - Transactional emails                             │
│ - Invitation notifications                         │
│ - Admin alerts                                     │
└─────────────────────────────────────────────────────┘
```

---

## Security Architecture

### Security Layers

```
┌─────────────────────────────────────────────────────┐
│           Security Architecture                    │
├─────────────────────────────────────────────────────┤
│ 1. Transport Security                              │
│    ├─ HTTPS/TLS encryption                        │
│    ├─ Certificate validation                       │
│    └─ Secure headers (Helmet.js)                   │
├─────────────────────────────────────────────────────┤
│ 2. Authentication                                  │
│    ├─ JWT token-based auth                        │
│    ├─ Bcrypt password hashing                     │
│    ├─ Google OAuth 2.0                            │
│    └─ Token refresh mechanism                     │
├─────────────────────────────────────────────────────┤
│ 3. Authorization                                   │
│    ├─ Role-based access control (RBAC)            │
│    ├─ Permission checking                         │
│    └─ Resource ownership validation                │
├─────────────────────────────────────────────────────┤
│ 4. Input Validation                                │
│    ├─ Joi schema validation                       │
│    ├─ Type checking                               │
│    ├─ Sanitization                                │
│    └─ XSS prevention                              │
├─────────────────────────────────────────────────────┤
│ 5. API Security                                    │
│    ├─ Rate limiting                               │
│    ├─ CORS configuration                          │
│    ├─ HPP (HTTP Parameter Pollution) prevention   │
│    └─ Request size limits                         │
├─────────────────────────────────────────────────────┤
│ 6. Data Protection                                 │
│    ├─ Environment variables for secrets           │
│    ├─ Database access control                     │
│    ├─ File upload validation                      │
│    └─ Sensitive data masking                      │
└─────────────────────────────────────────────────────┘
```

---

## Performance Optimization

### Frontend Optimization

- Code splitting with Vite
- Lazy loading of routes
- Image optimization
- CSS minification
- JavaScript minification
- Caching strategies

### Backend Optimization

- Database indexing
- Query optimization
- Connection pooling
- Caching (Redis ready)
- Compression (gzip)
- Load balancing ready

---

## Scalability Considerations

### Horizontal Scaling

- Stateless API design
- Load balancer ready
- Database replication ready
- CDN for static assets

### Vertical Scaling

- Efficient database queries
- Memory optimization
- CPU optimization
- Connection management

---

## Monitoring & Logging

### Logging

- Request logging
- Error logging
- Audit logging
- Performance logging

### Monitoring

- Health checks
- Performance metrics
- Error tracking
- User analytics

---

**Last Updated:** December 8, 2025 | **Version:** 1.0.0

# 📝 Changelog

Dokumentasi perubahan dan rilis untuk DC-09 Capstone Project Management System.

---

## [1.0.0] - 2025-12-08

### MVP Release

**Status:** ✅ Production Ready

### Added

#### Features

- ✅ Team Management System

  - Dynamic team registration with auto-fetched learning paths
  - Composition validation (automatic checking)
  - Member invitations with email notifications
  - Accept/reject invitation flow
  - Team editing before admin approval
  - Admin approval/rejection workflow
  - Team ID assignment
  - Bulk operations (approve/reject/delete)
  - CSV export functionality

- ✅ Document Management

  - Centralized document repository
  - File upload via Cloudinary
  - External link support
  - Document categorization
  - Student access and download
  - Document metadata tracking

- ✅ Timeline Management

  - Milestone creation and tracking
  - Deadline visualization
  - Status indicators (upcoming/ongoing/completed)
  - Edit and delete functionality

- ✅ Announcements System

  - Create announcements
  - Announcement types (info/warning/success/error)
  - Edit and delete functionality
  - Student dashboard integration

- ✅ Authentication & Authorization

  - Email/password authentication
  - Google OAuth 2.0 integration
  - JWT token-based auth
  - Role-based access control (student/admin/mentor)
  - Email verification
  - Password hashing with Bcrypt

- ✅ Dashboard & Analytics
  - Admin dashboard with statistics
  - Student dashboard with team info
  - Team statistics (pending/approved/rejected)
  - Quick action buttons

#### Technical

- ✅ 50+ REST API endpoints
- ✅ Swagger/OpenAPI documentation
- ✅ 14 MongoDB collections
- ✅ Comprehensive error handling
- ✅ Input validation with Joi
- ✅ Security headers with Helmet
- ✅ Rate limiting
- ✅ CORS configuration
- ✅ Logging system
- ✅ Unit and integration tests

#### Documentation

- ✅ README.md - Project overview
- ✅ SETUP.md - Installation guide
- ✅ ARCHITECTURE.md - System design
- ✅ DATABASE_SCHEMA.md - Data models
- ✅ API_REFERENCE.md - API endpoints
- ✅ USER_GUIDE.md - User manual
- ✅ DEVELOPER_GUIDE.md - Development guide
- ✅ DEPLOYMENT.md - Deployment guide
- ✅ CONTRIBUTING.md - Contributing guidelines
- ✅ TESTING.md - Testing guide
- ✅ TROUBLESHOOTING.md - Troubleshooting
- ✅ SECURITY.md - Security practices
- ✅ GLOSSARY.md - Terms and definitions

### Fixed

- Fixed team composition validation logic
- Fixed JWT token expiration handling
- Fixed email notification delivery
- Fixed file upload error handling
- Fixed CORS configuration for OAuth

### Security

- ✅ Password hashing with Bcrypt (10 rounds)
- ✅ JWT token-based authentication
- ✅ Google OAuth 2.0 implementation
- ✅ Input validation with Joi schemas
- ✅ XSS prevention
- ✅ CSRF protection ready
- ✅ Rate limiting (100 requests/15 min)
- ✅ Security headers (Helmet.js)
- ✅ CORS properly configured
- ✅ Environment variables for secrets

### Performance

- ✅ Database indexing on frequently queried fields
- ✅ Query optimization
- ✅ Connection pooling
- ✅ Response compression
- ✅ Frontend code splitting
- ✅ Lazy loading of routes
- ✅ Image optimization

### Known Issues

- Worksheet feature (Phase 2) - Currently disabled
- 360-degree feedback (Phase 2) - Not implemented
- Real-time notifications (Phase 2) - Not implemented
- Mobile app (Phase 3) - Not implemented

---

## [1.0.1] - 2025-12-11

### Bug Fixes & Improvements

**Status:** ✅ Production Hotfix

### Fixed

#### MongoDB Transactions

- ✅ Added `replicaSet` parameter to `MONGODB_URI` for transaction support
- ✅ Fixed "Write conflict during plan execution" error
- ✅ Ensured MongoDB Atlas replica set configuration

#### Team Creation

- ✅ Moved email sending outside transaction to prevent timeout
- ✅ Implemented async email sending (fire-and-forget pattern)
- ✅ Added comprehensive logging for email operations
- ✅ Fixed `timeout of 60000ms exceeded` error during team creation

#### Email Service

- ✅ Updated SMTP port from 587 (TLS) to 465 (SSL) for better reliability
- ✅ Added `SMTP_SECURE=true` configuration
- ✅ Added timeout configurations (connectionTimeout, socketTimeout, greetingTimeout)
- ✅ Enabled debug logging for SMTP operations
- ✅ Documented email service limitations on Railway

#### Rate Limiting

- ✅ Increased production global rate limit from 100 to 300 requests/15min
- ✅ Increased production auth rate limit from 5 to 50 requests/15min
- ✅ Prevented legitimate users from being rate-limited

#### Dashboard Statistics

- ✅ Added `isActive` field to Document model for soft deletes
- ✅ Fixed document count calculations
- ✅ Added "this month" statistics to dashboard
- ✅ Backward compatible with existing documents

### Changed

- Updated SMTP configuration in `.env` and Railway variables
- Modified `EmailService.js` to use port 465 with SSL
- Refactored `TeamService.createTeam()` to move email outside transaction
- Updated rate limiting middleware for production environment
- Enhanced logging in email sending process

### Documentation

- ✅ Updated `DEPLOYMENT.md` with MongoDB replicaSet instructions
- ✅ Updated `DEPLOYMENT.md` with SMTP port 465 configuration
- ✅ Added email service options (SendGrid, Mailgun) to `DEPLOYMENT.md`
- ✅ Enhanced `TROUBLESHOOTING.md` with email timeout solutions
- ✅ Added MongoDB transaction troubleshooting section
- ✅ Added conditional email service setup example

### Known Limitations

- **Gmail SMTP from Railway:** May experience connection timeouts due to network restrictions
  - **Workaround:** Use port 465 (SSL) or switch to SendGrid/Mailgun for production
- **Email Delivery:** Currently using Gmail SMTP; consider SendGrid for production reliability

### Migration Notes

**For existing deployments:**

1. Update `MONGODB_URI` with `replicaSet` parameter
2. Update `SMTP_PORT` to 465 and set `SMTP_SECURE=true`
3. Redeploy backend to Railway
4. Test team creation and email sending

**For new deployments:**

- Follow updated `DEPLOYMENT.md` guide
- Use SendGrid or Mailgun for production email service

---

## [1.1.0] - 2026-Q1 (Planned)

### Planned Features

- [ ] Worksheet feature with auto-validation
- [ ] Enhanced email notifications
- [ ] Performance improvements
- [ ] Bug fixes and stability improvements
- [ ] Additional test coverage

---

## [2.0.0] - 2026-Q2 (Planned)

### Phase 2 Features

- [ ] Worksheet feature - Team check-in system
- [ ] 360-Degree Feedback - Peer evaluation
- [ ] Advanced Analytics - Team performance metrics
- [ ] Real-time Notifications - Push & email alerts
- [ ] Mentor Role - Mentor assignment & monitoring

---

## [3.0.0] - 2026-Q3 (Planned)

### Phase 3 Features

- [ ] Team Communication - Internal messaging
- [ ] Performance Tracking - Contribution metrics
- [ ] Mobile App - iOS/Android native apps
- [ ] Advanced Reporting - Custom reports & visualization

---

## Version Numbering

We follow Semantic Versioning (MAJOR.MINOR.PATCH):

- **MAJOR** - Breaking changes
- **MINOR** - New features (backward compatible)
- **PATCH** - Bug fixes (backward compatible)

---

## Release Process

1. **Create release branch** from develop
2. **Update version** in package.json
3. **Update CHANGELOG.md**
4. **Create Pull Request** to main
5. **Code review** and approval
6. **Merge to main** and tag release
7. **Deploy to production**
8. **Merge back to develop**

---

## Contributors

- **Afrizal Ilza Munadhif** - Project Manager & Full Stack
- **Deby Maulida** - Frontend Lead & UI/UX
- **Ganza Wajendra Ekasakti** - Backend Lead & Database
- **Marsa Ardita** - Full Stack Developer
- **Muhammad Rizky** - Full Stack & DevOps

---

**Last Updated:** December 11, 2025 | **Version:** 1.0.1

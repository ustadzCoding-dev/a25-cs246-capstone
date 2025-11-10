# Changelog

All notable changes to the frontend project will be documented in this file.

## [1.0.0] - 2025-11-11

### 🎉 Initial Release

#### ✨ Features
- **Authentication System**
  - Login page with email/password
  - Signup page with learning path selection
  - Google Sign-In button (UI ready, backend integration pending)
  - JWT token management with localStorage
  - Auto-redirect after login based on role

- **Dashboard**
  - Admin dashboard with statistics and management overview
  - Student dashboard with team status and quick actions
  - Responsive cards and charts layout

- **Team Management**
  - Student: View team status, members, and invitations
  - Student: Team registration form with validation
  - Admin: Team approval/rejection system
  - Admin: Team list with filters and search

- **Document Management**
  - Student: View and download documents by category
  - Admin: Upload, edit, and delete documents
  - Document categories and status badges
  - File upload with drag & drop support

- **Timeline Management**
  - Student: View project timeline and milestones
  - Admin: Create, edit, and delete timeline events
  - Visual timeline with date pickers
  - Status tracking (upcoming, ongoing, completed)

- **Announcements**
  - Student: View announcements with filters
  - Admin: Create, edit, and delete announcements
  - Priority levels (normal, important, urgent)
  - Rich text support

- **Profile Management**
  - View and edit user profile
  - Change password functionality
  - Avatar upload (UI ready)
  - Learning path and university information

#### 🎨 UI/UX
- Modern and clean design with Tailwind CSS
- Fully responsive (mobile, tablet, desktop)
- Consistent color scheme with primary blue
- Smooth transitions and hover effects
- Loading states and spinners
- Error handling with user-friendly messages
- Form validation with inline error messages

#### 🔧 Technical Implementation
- **Framework:** Vue 3.5.22 with Composition API
- **Build Tool:** Vite 7.1.14 (rolldown-vite)
- **Styling:** Tailwind CSS 3.4.1
- **Routing:** Vue Router 4.6.3 with navigation guards
- **State Management:** Pinia 3.0.4
- **HTTP Client:** Axios 1.13.2 with interceptors
- **Components:** 25 reusable components
  - 13 base components (Input, Button, Modal, Select, etc.)
  - 9 display components (Cards, Timeline, etc.)
  - 3 layout components (Auth, Dashboard, Sidebar)

#### 📁 Project Structure
- Clean and organized folder structure
- Separation of concerns (components, views, services, stores)
- Modular component architecture
- Centralized API service with error handling
- Environment-based configuration

#### 📚 Documentation
- Comprehensive README.md
- STYLING-GUIDE.md for UI/UX designer
- API-INTEGRATION.md for backend integration
- Inline code comments
- JSDoc for functions

#### 🔐 Security
- JWT token authentication
- Protected routes with auth guards
- Role-based access control (admin vs student)
- XSS protection with Vue's built-in sanitization
- Secure API communication

#### 🐛 Bug Fixes
- Fixed Tailwind CSS v4 compatibility issue (downgraded to v3.4.1)
- Fixed port conflicts (frontend: 9000, backend: 8000)
- Fixed API base URL configuration
- Fixed browser cache issues
- Fixed component import paths

#### 🚀 Performance
- Lazy loading for routes
- Code splitting with Vite
- Optimized bundle size
- Fast HMR (Hot Module Replacement)
- Efficient state management with Pinia

---

## [Unreleased]

### 🔜 Planned Features
- Real backend API integration
- Google OAuth implementation
- Real-time notifications with WebSocket
- File preview for documents
- Advanced search and filters
- Export data to PDF/Excel
- Dark mode support
- Internationalization (i18n)
- Unit tests with Vitest
- E2E tests with Playwright

### 🐛 Known Issues
- Google Sign-In not yet implemented (backend pending)
- Mock data used for all pages (backend integration pending)
- Avatar upload not yet functional (backend pending)

---

## Notes

### Version Format
- **Major.Minor.Patch** (e.g., 1.0.0)
- **Major:** Breaking changes
- **Minor:** New features (backward compatible)
- **Patch:** Bug fixes

### Commit Convention
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Adding tests
- `chore:` Maintenance tasks

---

**Last Updated:** November 11, 2025 - 02:47 AM
**Contributors:** Afrizal (Frontend Developer), Deby (UI/UX Designer)

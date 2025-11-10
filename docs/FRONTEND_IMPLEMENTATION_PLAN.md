# 🚀 Frontend Implementation Plan

## 📊 Project Overview

**Project:** Dicoding Capstone - Team Management System (Frontend)  
**Timeline:** November 11-17, 2025 (Week 2-3)  
**Total Effort:** 56 hours (7 days)  
**Tech Stack:** Vue 3, Vite, Tailwind CSS, Pinia, Axios, Vue Router

---

## 🎯 Objectives

### Week 2 Goals (Nov 11-13):
- ✅ Create all 20 base components
- ✅ Implement authentication pages & flow
- ✅ Build admin & student dashboards
- ✅ Setup routing & state management

### Week 3 Goals (Nov 14-17):
- ✅ Implement team management pages
- ✅ Build document, timeline, announcement pages
- ✅ Complete API integration
- ✅ Testing, bug fixes, and polish

---

## 📋 Complete Wireframe Inventory

### Total Screens: 23 wireframes

**Auth Pages (2):**
1. Login Page
2. Sign Up Page

**Dashboard Pages (2):**
3. Admin Dashboard
4. Student Dashboard

**Team Management (6):**
5. Kelola Tim (admin table view)
6. Tim Saya - Empty State (no team)
7. Tim Saya - Buat Tim Baru (create team form)
8. Tim Saya - Daftar Individu (register individual)
9. Tim Saya - Informasi Tim (team info display)
10. Tim Saya - Undangan Tim (team invitations)

**Document Pages (3):**
11. Dokumen (student view)
12. Kelola Dokumen (admin table view)
13. Dokumen (admin view with upload)

**Timeline Pages (2):**
14. Timeline Capstone (admin - with add/delete)
15. Timeline Capstone (student - read-only)

**Announcement Pages (2):**
16. Pengumuman (admin - with add/delete)
17. Pengumuman (student - read-only)

**Profile Pages (2):**
18. Profile Saya (student with team info)
19. Profile Saya (admin without team)

**Modals (4):**
20. Tambah Dokumen Modal
21. Tambah Timeline Modal
22. Buat Pengumuman Modal
23. Team Invitation Modal (if needed)

---

## 🔧 Component Architecture

### Components Already Created (7):
```
✅ BaseButton.vue
✅ BaseInput.vue
✅ BaseCard.vue
✅ BaseModal.vue
✅ BaseAlert.vue
✅ BaseBadge.vue
✅ BaseSpinner.vue
```

### Components to Create (20):

#### Priority 1: Essential Form Components (8)
```
1. BaseSelect.vue - Dropdown/Select with search
2. BasePasswordInput.vue - Password input with toggle visibility
3. BaseCheckbox.vue - Checkbox with label
4. BaseTextarea.vue - Multi-line text input
5. BaseDatePicker.vue - Date input with calendar picker
6. BaseFileUpload.vue - File/photo upload with preview
7. BaseSearch.vue - Search input with icon
8. BaseTable.vue - Data table with sorting & pagination
```

#### Priority 2: Layout Components (3)
```
9. Sidebar.vue - Navigation sidebar with menu items
10. AuthLayout.vue - Layout wrapper for auth pages
11. DashboardLayout.vue - Layout wrapper for dashboard pages
```

#### Priority 3: Display Components (9)
```
12. StatsCard.vue - Metric display cards
13. DocumentCard.vue - Document list item card
14. TimelineItem.vue - Timeline entry with date
15. AnnouncementCard.vue - Announcement display card
16. TeamStatusCard.vue - Team status card (dashboard)
17. TeamInfoCard.vue - Team info card (profile)
18. InvitationCard.vue - Team invitation card
19. DynamicInputList.vue - Add/remove input fields
20. GoogleButton.vue - OAuth Google button
```

---

## 📄 Page Structure

### Pages to Create (15):

#### Auth Pages (2)
```
/views/auth/
├── LoginPage.vue
└── SignUpPage.vue
```

#### Dashboard Pages (2)
```
/views/dashboard/
├── AdminDashboard.vue
└── StudentDashboard.vue
```

#### Team Pages (4)
```
/views/team/
├── TeamManagementPage.vue (admin)
├── MyTeamPage.vue (student)
├── CreateTeamPage.vue (student)
└── RegisterIndividualPage.vue (student)
```

#### Document Pages (2)
```
/views/documents/
├── DocumentListPage.vue (student)
└── DocumentManagementPage.vue (admin)
```

#### Timeline Page (1)
```
/views/timeline/
└── TimelinePage.vue (admin & student)
```

#### Announcement Page (1)
```
/views/announcements/
└── AnnouncementPage.vue (admin & student)
```

#### Profile Page (1)
```
/views/profile/
└── ProfilePage.vue (admin & student)
```

#### Modals (4)
```
/components/modals/
├── AddDocumentModal.vue
├── AddTimelineModal.vue
├── AddAnnouncementModal.vue
└── TeamInvitationModal.vue
```

---

## 🔄 Services & State Management

### API Services (6):
```
/services/
├── authService.js - Authentication API calls
├── teamService.js - Team management API calls
├── documentService.js - Document API calls
├── timelineService.js - Timeline API calls
├── announcementService.js - Announcement API calls
└── userService.js - User profile API calls
```

### Pinia Stores (5):
```
/stores/
├── authStore.js - Auth state (user, token, isAuthenticated)
├── teamStore.js - Team state (teams, myTeam, invitations)
├── documentStore.js - Document state (documents, filters)
├── timelineStore.js - Timeline state (timelines, deadlines)
└── announcementStore.js - Announcement state (announcements)
```

---

## 📅 7-Day Implementation Schedule

### **Day 1 (Nov 11): Foundation - Components**

#### Morning (4 hours): Essential Form Components
```
Time: 08:00 - 12:00

Tasks:
1. BaseSelect.vue (30 min)
   - Dropdown with options
   - Search functionality (optional)
   - Error state
   - Disabled state

2. BasePasswordInput.vue (30 min)
   - Password input
   - Toggle show/hide
   - Eye icon button
   - Strength indicator (optional)

3. BaseCheckbox.vue (20 min)
   - Checkbox styling
   - Label support
   - Disabled state

4. BaseTextarea.vue (20 min)
   - Multi-line input
   - Character count (optional)
   - Auto-resize (optional)

5. BaseDatePicker.vue (45 min)
   - Date input
   - Calendar picker
   - Date formatting
   - Min/max dates

6. BaseFileUpload.vue (45 min)
   - File upload
   - Image preview
   - File size validation
   - Drag & drop (optional)

7. BaseSearch.vue (20 min)
   - Search input
   - Search icon
   - Clear button

8. BaseTable.vue (1 hour)
   - Table structure
   - Sortable columns
   - Pagination
   - Row actions

Deliverable: 8 form components ready
```

#### Afternoon (4 hours): Layout & Display Components
```
Time: 13:00 - 17:00

Tasks:
1. Sidebar.vue (1 hour)
   - Navigation menu
   - Active state
   - Icons
   - User info section
   - Logout button

2. AuthLayout.vue (45 min)
   - Centered card layout
   - Header with logo
   - Footer
   - Background styling

3. DashboardLayout.vue (1 hour)
   - Sidebar integration
   - Main content area
   - Header/topbar
   - Responsive design

4. StatsCard.vue (30 min)
   - Icon display
   - Number/metric
   - Label
   - Percentage change (optional)

5. DocumentCard.vue (30 min)
   - Title & description
   - Date display
   - Action button/link
   - Status badge

6. TimelineItem.vue (30 min)
   - Timeline dot
   - Title & description
   - Date range
   - Delete button (admin)

Deliverable: 6 layout/display components ready
```

#### Evening (2 hours): Remaining Display Components
```
Time: 19:00 - 21:00

Tasks:
1. AnnouncementCard.vue (30 min)
2. TeamStatusCard.vue (30 min)
3. TeamInfoCard.vue (30 min)
4. InvitationCard.vue (20 min)
5. DynamicInputList.vue (30 min)
6. GoogleButton.vue (20 min)

Deliverable: All 20 components complete ✅
```

---

### **Day 2 (Nov 12): Authentication & Services**

#### Morning (4 hours): Auth Services & Store
```
Time: 08:00 - 12:00

Tasks:
1. Setup Axios instance (30 min)
   - Base URL configuration
   - Request interceptors
   - Response interceptors
   - Error handling

2. authService.js (1 hour)
   - login(email, password)
   - register(userData)
   - logout()
   - getCurrentUser()
   - updateProfile(data)

3. authStore.js (1.5 hours)
   - State: user, token, isAuthenticated
   - Actions: login, register, logout, fetchUser
   - Getters: isAdmin, isStudent, userName
   - Persist token in localStorage

4. Router setup (1 hour)
   - Route definitions
   - Route guards (auth middleware)
   - Redirect logic
   - Meta fields (requiresAuth, role)

Deliverable: Auth infrastructure ready
```

#### Afternoon (4 hours): Auth Pages
```
Time: 13:00 - 17:00

Tasks:
1. LoginPage.vue (1.5 hours)
   - Use AuthLayout
   - Email & password inputs
   - Remember me checkbox
   - Forgot password link
   - Google sign in button
   - Form validation
   - Error handling
   - Redirect after login

2. SignUpPage.vue (2 hours)
   - Use AuthLayout
   - All form fields (name, email, learning path, passwords)
   - Password validation
   - Terms checkbox
   - Google sign up button
   - Form validation
   - Error handling
   - Redirect after signup

3. Testing auth flow (30 min)
   - Test login
   - Test signup
   - Test logout
   - Test route guards

Deliverable: Auth pages complete ✅
```

---

### **Day 3 (Nov 13): Dashboard Pages**

#### Morning (4 hours): Admin Dashboard
```
Time: 08:00 - 12:00

Tasks:
1. AdminDashboard.vue (3 hours)
   - Use DashboardLayout
   - Stats cards (4 metrics)
   - Team table (Daftar Kelompok)
   - Activity feed
   - Quick actions panel
   - API integration
   - Real-time data

2. TeamManagementPage.vue (1 hour)
   - Team list table
   - Student without team table
   - Approve/reject actions
   - Filters & search
   - Pagination

Deliverable: Admin dashboard complete
```

#### Afternoon (4 hours): Student Dashboard
```
Time: 13:00 - 17:00

Tasks:
1. StudentDashboard.vue (2 hours)
   - Use DashboardLayout
   - Team status card
   - Stats cards (3 metrics)
   - Timeline preview
   - Announcements preview
   - API integration

2. teamService.js (1 hour)
   - getAllTeams()
   - getMyTeam()
   - createTeam(data)
   - updateTeam(id, data)
   - deleteTeam(id)
   - approveTeam(id)
   - rejectTeam(id)

3. teamStore.js (1 hour)
   - State: teams, myTeam, invitations
   - Actions: fetch, create, update, delete
   - Getters: teamMembers, teamLeader

Deliverable: Student dashboard complete ✅
```

---

### **Day 4 (Nov 14): Team Management & Documents**

#### Morning (4 hours): Team Pages
```
Time: 08:00 - 12:00

Tasks:
1. MyTeamPage.vue (2 hours)
   - Empty state (no team)
   - Team info display
   - Invitation cards
   - Create team button
   - Register individual button
   - Accept/reject invitation

2. CreateTeamPage.vue (1 hour)
   - Use case selection
   - Dynamic member input list
   - Form validation
   - Submit team

3. RegisterIndividualPage.vue (1 hour)
   - Use case selection
   - Skills textarea
   - Form validation
   - Submit registration

Deliverable: Team pages complete
```

#### Afternoon (4 hours): Document Pages
```
Time: 13:00 - 17:00

Tasks:
1. DocumentListPage.vue (1.5 hours)
   - Student view
   - Document cards
   - Search & filter
   - Download/view document

2. DocumentManagementPage.vue (1.5 hours)
   - Admin view
   - Document table
   - Add document button
   - Review/approve documents
   - Delete documents

3. AddDocumentModal.vue (1 hour)
   - Document name input
   - Document URL input
   - Description textarea
   - Submit form

Deliverable: Document pages complete ✅
```

---

### **Day 5 (Nov 15): Timeline, Announcements & Profile**

#### Morning (4 hours): Timeline & Announcements
```
Time: 08:00 - 12:00

Tasks:
1. TimelinePage.vue (2 hours)
   - Timeline list display
   - Add timeline button (admin)
   - Delete timeline (admin)
   - Read-only view (student)
   - API integration

2. AddTimelineModal.vue (1 hour)
   - Title input
   - Description textarea
   - Start date picker
   - End date picker
   - Submit form

3. AnnouncementPage.vue (1 hour)
   - Announcement cards
   - Add announcement button (admin)
   - Delete announcement (admin)
   - Read-only view (student)

Deliverable: Timeline & announcements complete
```

#### Afternoon (4 hours): Profile & Remaining Services
```
Time: 13:00 - 17:00

Tasks:
1. ProfilePage.vue (2 hours)
   - Profile photo upload
   - User info display (readonly)
   - Team info card (student only)
   - Edit profile (future)

2. AddAnnouncementModal.vue (30 min)
   - Title input
   - Content textarea
   - Priority select
   - Submit form

3. documentService.js (30 min)
4. timelineService.js (30 min)
5. announcementService.js (30 min)

Deliverable: All pages complete ✅
```

---

### **Day 6 (Nov 16): Integration & Testing**

#### Morning (4 hours): API Integration
```
Time: 08:00 - 12:00

Tasks:
1. Complete all API service functions
2. Integrate services with stores
3. Connect stores to pages
4. Handle loading states
5. Handle error states
6. Add success notifications

Deliverable: Full API integration
```

#### Afternoon (4 hours): Testing
```
Time: 13:00 - 17:00

Tasks:
1. Test auth flow (login, signup, logout)
2. Test admin dashboard & actions
3. Test student dashboard
4. Test team management flow
5. Test document management
6. Test timeline & announcements
7. Test profile page
8. Fix bugs found

Deliverable: All features tested
```

---

### **Day 7 (Nov 17): Polish & Deployment**

#### Morning (4 hours): UI/UX Polish
```
Time: 08:00 - 12:00

Tasks:
1. Responsive design fixes
2. Loading states polish
3. Error message improvements
4. Success feedback improvements
5. Accessibility improvements
6. Performance optimization

Deliverable: Polished UI/UX
```

#### Afternoon (4 hours): Final Testing & Documentation
```
Time: 13:00 - 17:00

Tasks:
1. Final end-to-end testing
2. Cross-browser testing
3. Mobile responsiveness testing
4. Fix critical bugs
5. Update README
6. Create user guide (if needed)
7. Prepare for deployment

Deliverable: Production-ready frontend ✅
```

---

## 🎯 Success Criteria

### Week 2 Completion (Nov 13):
- ✅ All 20 components created
- ✅ Auth pages functional
- ✅ Dashboard pages functional
- ✅ Routing & state management setup

### Week 3 Completion (Nov 17):
- ✅ All pages implemented
- ✅ Full API integration
- ✅ All features tested
- ✅ UI/UX polished
- ✅ Production-ready

---

## 📊 Progress Tracking

### Component Progress: 0/20
```
[ ] BaseSelect
[ ] BasePasswordInput
[ ] BaseCheckbox
[ ] BaseTextarea
[ ] BaseDatePicker
[ ] BaseFileUpload
[ ] BaseSearch
[ ] BaseTable
[ ] Sidebar
[ ] AuthLayout
[ ] DashboardLayout
[ ] StatsCard
[ ] DocumentCard
[ ] TimelineItem
[ ] AnnouncementCard
[ ] TeamStatusCard
[ ] TeamInfoCard
[ ] InvitationCard
[ ] DynamicInputList
[ ] GoogleButton
```

### Page Progress: 0/15
```
[ ] LoginPage
[ ] SignUpPage
[ ] AdminDashboard
[ ] StudentDashboard
[ ] TeamManagementPage
[ ] MyTeamPage
[ ] CreateTeamPage
[ ] RegisterIndividualPage
[ ] DocumentListPage
[ ] DocumentManagementPage
[ ] TimelinePage
[ ] AnnouncementPage
[ ] ProfilePage
[ ] AddDocumentModal
[ ] AddTimelineModal
[ ] AddAnnouncementModal
```

---

## 🚀 Next Steps

**Tonight (Nov 10):**
1. ✅ Review this plan
2. ✅ Setup folder structure
3. ✅ Prepare component templates
4. ✅ Commit & push

**Tomorrow (Nov 11):**
1. Start Day 1 tasks
2. Create all 20 components
3. Daily standup & progress update

---

## 📝 Notes

- Follow existing code style and conventions
- Use Tailwind CSS for all styling
- Ensure responsive design for all pages
- Add proper error handling
- Add loading states
- Add success/error notifications
- Write clean, maintainable code
- Comment complex logic
- Test thoroughly before moving to next task

---

**Last Updated:** November 10, 2025  
**Status:** Ready to start  
**Next Milestone:** Day 1 - Component Creation

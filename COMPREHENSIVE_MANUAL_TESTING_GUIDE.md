# 📚 Comprehensive Manual Testing Guide - A25-CS246

## 🎯 Overview

Panduan lengkap untuk manual testing sistem Academic Dashboard dengan Capstone Project Features.

**Total Test Cases:** 35+
**Estimated Time:** 3-4 hours
**Test Environment:** Development
**Status:** Ready for Testing

---

## 📋 Table of Contents

1. [Setup & Prerequisites](#setup--prerequisites)
2. [Test Accounts](#test-accounts)
3. [Testing Environment](#testing-environment)
4. [Phase 1: Authentication Testing](#phase-1-authentication-testing)
5. [Phase 2: Team Management Testing](#phase-2-team-management-testing)
6. [Phase 3: Document Management Testing](#phase-3-document-management-testing)
7. [Phase 4: Timeline Management Testing](#phase-4-timeline-management-testing)
8. [Phase 5: Announcement Testing](#phase-5-announcement-testing)
9. [Phase 6: Error Handling Testing](#phase-6-error-handling-testing)
10. [Phase 7: Performance & UI Testing](#phase-7-performance--ui-testing)
11. [Test Results Summary](#test-results-summary)

---

## 🔧 Setup & Prerequisites

### Before Testing

Pastikan sudah ada:

- ✅ Backend running: `npm run dev` (port 8000)
- ✅ Frontend running: `npm run dev` (port 5173)
- ✅ MongoDB connected
- ✅ Test data imported (61 users, 2 use cases)
- ✅ Browser with DevTools (F12)

### Quick Setup Commands

```bash
# Terminal 1: Backend
cd d:\A25-CS246\backend
node src/scripts/clearDatabase.js
node src/scripts/setupTestData.js
npm run dev

# Terminal 2: Frontend
cd d:\A25-CS246\frontend
npm run dev
```

---

## 📝 Test Accounts

### Admin Account

```
Email: admin_1@student.devacademy.id
Password: TestPassword123!
Name: Paramita Zulaika
Role: Administrator
```

### Student Accounts

**Student 1 (For Team Registration)**

```
Email: fui0001@student.devacademy.id
Password: TestPassword123!
Name: Lutfan Gunawan
Learning Path: Front-End & Back-End with AI
```

**Student 2 (For Team Registration)**

```
Email: fui0002@student.devacademy.id
Password: TestPassword123!
Name: Darimin Jailani
Learning Path: Front-End & Back-End with AI
```

**Student 3 (For Team Registration)**

```
Email: fui0003@student.devacademy.id
Password: TestPassword123!
Name: Hana Yulianti
Learning Path: Front-End & Back-End with AI
```

---

## 🌐 Testing Environment

### URLs

| Service           | URL                            |
| ----------------- | ------------------------------ |
| Frontend          | http://localhost:5173          |
| Backend API       | http://localhost:8000/api      |
| API Documentation | http://localhost:8000/api-docs |
| Health Check      | http://localhost:8000/health   |

### Browser DevTools

- **Open DevTools:** F12
- **Console:** Check for JavaScript errors
- **Network:** Verify API calls
- **Storage:** Check localStorage for token
- **Mobile View:** Toggle device toolbar (Ctrl+Shift+M)

---

# 🧪 PHASE 1: AUTHENTICATION TESTING

**Duration:** 15 minutes
**Test Cases:** 4

---

## Test 1.1: Admin Login - Valid Credentials

**Objective:** Verify admin can login with valid credentials

**Steps:**

1. [ ] Open http://localhost:5173
2. [ ] Observe login page displays
3. [ ] Click "Login" button
4. [ ] Enter email: `admin_1@student.devacademy.id`
5. [ ] Enter password: `TestPassword123!`
6. [ ] Click "Login" button
7. [ ] Wait for redirect

**Expected Results:**

- [ ] Page redirects to admin dashboard
- [ ] URL changes to: http://localhost:5173/admin/dashboard
- [ ] User name "Paramita Zulaika" displays in header
- [ ] Admin menu items visible (Dashboard, Kelola Tim, Dokumen, Timeline, Pengumuman)
- [ ] No error messages
- [ ] Token stored in localStorage

**Verification:**

```javascript
// Open DevTools (F12) → Console
localStorage.getItem("token"); // Should have JWT token
localStorage.getItem("user"); // Should have user data
```

**Status:** [ ] PASS [ ] FAIL

**Notes:** ******\_\_\_******

---

## Test 1.2: Student Login - Valid Credentials

**Objective:** Verify student can login with valid credentials

**Steps:**

1. [ ] Click profile icon (top right)
2. [ ] Click "Logout"
3. [ ] Verify redirect to login page
4. [ ] Enter email: `fui0001@student.devacademy.id`
5. [ ] Enter password: `TestPassword123!`
6. [ ] Click "Login"
7. [ ] Wait for redirect

**Expected Results:**

- [ ] Page redirects to student dashboard
- [ ] URL changes to: http://localhost:5173/student/dashboard
- [ ] User name "Lutfan Gunawan" displays in header
- [ ] Student menu items visible (different from admin)
- [ ] No error messages
- [ ] Token stored in localStorage

**Status:** [ ] PASS [ ] FAIL

**Notes:** ******\_\_\_******

---

## Test 1.3: Invalid Login - Wrong Password

**Objective:** Verify system rejects invalid credentials

**Steps:**

1. [ ] Click "Logout"
2. [ ] Enter email: `admin_1@student.devacademy.id`
3. [ ] Enter password: `WrongPassword123!`
4. [ ] Click "Login"
5. [ ] Observe response

**Expected Results:**

- [ ] Login fails
- [ ] Error message displays: "Invalid email or password"
- [ ] Stay on login page (no redirect)
- [ ] No token stored in localStorage
- [ ] Form fields remain filled (except password)

**Status:** [ ] PASS [ ] FAIL

**Notes:** ******\_\_\_******

---

## Test 1.4: Logout

**Objective:** Verify logout functionality

**Steps:**

1. [ ] Login as admin
2. [ ] Click profile icon (top right)
3. [ ] Click "Logout" button
4. [ ] Observe response

**Expected Results:**

- [ ] Redirect to login page
- [ ] URL changes to: http://localhost:5173/login
- [ ] Token removed from localStorage
- [ ] User data removed from localStorage
- [ ] Cannot access dashboard (if try to go back)

**Status:** [ ] PASS [ ] FAIL

**Notes:** ******\_\_\_******

---

# 👥 PHASE 2: TEAM MANAGEMENT TESTING

**Duration:** 30 minutes
**Test Cases:** 5

---

## Test 2.1: Admin View Teams - Empty List

**Objective:** Verify admin can view teams list (initially empty)

**Steps:**

1. [ ] Login as admin
2. [ ] Click "Kelola Tim" in sidebar
3. [ ] Observe teams page

**Expected Results:**

- [ ] Teams page loads
- [ ] Empty state message displays: "Tidak ada tim yang terdaftar"
- [ ] "Register Team" button visible
- [ ] Statistics show: Total Tim = 0, Tim Pending = 0
- [ ] No error messages

**Status:** [ ] PASS [ ] FAIL

**Notes:** ******\_\_\_******

---

## Test 2.2: Student Register Team

**Objective:** Verify student can register a team

**Steps:**

1. [ ] Logout
2. [ ] Login as student1 (fui0001@student.devacademy.id)
3. [ ] Click "Register Team" or similar button
4. [ ] Fill form:
   - [ ] Team name: "Team Alpha"
   - [ ] Select members: student1, student2, student3
   - [ ] Select use case: "E-Commerce Platform"
5. [ ] Click "Register" button
6. [ ] Observe response

**Expected Results:**

- [ ] Team registered successfully
- [ ] Success message displays: "Team registered successfully"
- [ ] Redirect to team details or dashboard
- [ ] Team status shows: "Pending Approval"
- [ ] Team appears in admin's team list

**Verification (as Admin):**

- [ ] Login as admin
- [ ] Go to "Kelola Tim"
- [ ] "Team Alpha" appears with status "Pending"
- [ ] Statistics updated: Total Tim = 1, Tim Pending = 1

**Status:** [ ] PASS [ ] FAIL

**Team ID:** ******\_\_\_******

**Notes:** ******\_\_\_******

---

## Test 2.3: Admin Approve Team

**Objective:** Verify admin can approve pending team

**Steps:**

1. [ ] Login as admin (if not already)
2. [ ] Go to "Kelola Tim"
3. [ ] Find "Team Alpha" with status "Pending"
4. [ ] Click "Approve" button
5. [ ] Confirm action if prompted
6. [ ] Observe response

**Expected Results:**

- [ ] Team status changed to "Approved"
- [ ] Success message displays: "Team approved successfully"
- [ ] Team members can now upload documents
- [ ] Statistics updated: Tim Pending = 0
- [ ] Team details page shows approval date

**Status:** [ ] PASS [ ] FAIL

**Notes:** ******\_\_\_******

---

## Test 2.4: Admin Reject Team

**Objective:** Verify admin can reject pending team

**Steps:**

1. [ ] Login as student2 (fui0002@student.devacademy.id)
2. [ ] Register new team: "Team Beta"
   - [ ] Members: student2, student3, student1
   - [ ] Use case: "Social Media App"
3. [ ] Login as admin
4. [ ] Go to "Kelola Tim"
5. [ ] Find "Team Beta" with status "Pending"
6. [ ] Click "Reject" button
7. [ ] Enter rejection reason: "Invalid team composition"
8. [ ] Confirm action

**Expected Results:**

- [ ] Team status changed to "Rejected"
- [ ] Rejection reason stored
- [ ] Success message displays
- [ ] Team members notified (if notification feature exists)
- [ ] Team can re-register

**Status:** [ ] PASS [ ] FAIL

**Notes:** ******\_\_\_******

---

## Test 2.5: View Team Details

**Objective:** Verify team details page displays correctly

**Steps:**

1. [ ] Login as admin
2. [ ] Go to "Kelola Tim"
3. [ ] Click on "Team Alpha" (approved team)
4. [ ] Observe team details page

**Expected Results:**

- [ ] Team details page loads
- [ ] Displays:
  - [ ] Team name: "Team Alpha"
  - [ ] Team members list (3 students)
  - [ ] Team status: "Approved"
  - [ ] Use case: "E-Commerce Platform"
  - [ ] Registration date
  - [ ] Approval date
- [ ] Documents section visible (empty initially)
- [ ] Timeline section visible
- [ ] Back button works

**Status:** [ ] PASS [ ] FAIL

**Notes:** ******\_\_\_******

---

# 📄 PHASE 3: DOCUMENT MANAGEMENT TESTING

**Duration:** 20 minutes
**Test Cases:** 4

---

## Test 3.1: Student Upload Document

**Objective:** Verify student can upload document

**Steps:**

1. [ ] Login as student1 (from approved team)
2. [ ] Navigate to "Dokumen" section
3. [ ] Click "Upload Document" button
4. [ ] Select file: (any PDF or image file)
5. [ ] Enter title: "Project Proposal"
6. [ ] Enter description: "Initial project proposal document"
7. [ ] Click "Upload" button
8. [ ] Observe upload progress

**Expected Results:**

- [ ] Upload progress bar shows
- [ ] File uploads successfully
- [ ] Success message displays: "Document uploaded successfully"
- [ ] Document appears in documents list
- [ ] Document shows:
  - [ ] Title: "Project Proposal"
  - [ ] Uploader: "Lutfan Gunawan"
  - [ ] Upload date: Today
  - [ ] File size
  - [ ] Download button
  - [ ] Delete button (for owner)

**Status:** [ ] PASS [ ] FAIL

**Document ID:** ******\_\_\_******

**Notes:** ******\_\_\_******

---

## Test 3.2: View Document List

**Objective:** Verify documents list displays correctly

**Steps:**

1. [ ] Go to "Dokumen" section
2. [ ] Observe documents list

**Expected Results:**

- [ ] All documents display
- [ ] Shows:
  - [ ] Document title
  - [ ] Uploader name
  - [ ] Upload date
  - [ ] File size
  - [ ] Action buttons (Download, Delete)
- [ ] Sorted by newest first
- [ ] Pagination works (if many documents)
- [ ] Search/filter works (if available)

**Status:** [ ] PASS [ ] FAIL

**Notes:** ******\_\_\_******

---

## Test 3.3: Download Document

**Objective:** Verify document download functionality

**Steps:**

1. [ ] Find uploaded document in list
2. [ ] Click "Download" button
3. [ ] Wait for download
4. [ ] Verify downloaded file

**Expected Results:**

- [ ] File downloads successfully
- [ ] File name correct: "Project Proposal" (or similar)
- [ ] File format correct (PDF/image)
- [ ] File opens correctly
- [ ] File content intact
- [ ] No errors in console

**Status:** [ ] PASS [ ] FAIL

**Notes:** ******\_\_\_******

---

## Test 3.4: Delete Document

**Objective:** Verify document deletion

**Steps:**

1. [ ] Find document uploaded by current user
2. [ ] Click "Delete" button
3. [ ] Confirm deletion if prompted
4. [ ] Observe response

**Expected Results:**

- [ ] Document deleted successfully
- [ ] Success message displays: "Document deleted successfully"
- [ ] Document removed from list
- [ ] File removed from storage
- [ ] Cannot re-download deleted document

**Status:** [ ] PASS [ ] FAIL

**Notes:** ******\_\_\_******

---

# 📅 PHASE 4: TIMELINE MANAGEMENT TESTING

**Duration:** 15 minutes
**Test Cases:** 4

---

## Test 4.1: Admin View Timeline

**Objective:** Verify admin can view timeline

**Steps:**

1. [ ] Login as admin
2. [ ] Click "Timeline" in sidebar
3. [ ] Observe timeline page

**Expected Results:**

- [ ] Timeline page loads
- [ ] Events display in chronological order
- [ ] Shows:
  - [ ] Event date
  - [ ] Event title
  - [ ] Event description
- [ ] Visual timeline layout looks good
- [ ] "Create Event" button visible

**Status:** [ ] PASS [ ] FAIL

**Notes:** ******\_\_\_******

---

## Test 4.2: Admin Create Timeline Event

**Objective:** Verify admin can create timeline event

**Steps:**

1. [ ] Click "Create Event" button
2. [ ] Fill form:
   - [ ] Event name: "Project Submission Deadline"
   - [ ] Event date: (select future date, e.g., 2025-12-15)
   - [ ] Event description: "Final project submission deadline"
3. [ ] Click "Create" button
4. [ ] Observe response

**Expected Results:**

- [ ] Event created successfully
- [ ] Success message displays: "Event created successfully"
- [ ] Event appears in timeline
- [ ] Event shows correct date and description
- [ ] Timeline updates immediately

**Status:** [ ] PASS [ ] FAIL

**Event ID:** ******\_\_\_******

**Notes:** ******\_\_\_******

---

## Test 4.3: Admin Update Timeline Event

**Objective:** Verify admin can update timeline event

**Steps:**

1. [ ] Find created event in timeline
2. [ ] Click "Edit" button (if available)
3. [ ] Change description: "Updated deadline - Final submission"
4. [ ] Click "Save" button
5. [ ] Observe response

**Expected Results:**

- [ ] Event updated successfully
- [ ] Success message displays: "Event updated successfully"
- [ ] Changes visible immediately in timeline
- [ ] New description shows: "Updated deadline - Final submission"

**Status:** [ ] PASS [ ] FAIL

**Notes:** ******\_\_\_******

---

## Test 4.4: Admin Delete Timeline Event

**Objective:** Verify admin can delete timeline event

**Steps:**

1. [ ] Find event to delete
2. [ ] Click "Delete" button
3. [ ] Confirm deletion if prompted
4. [ ] Observe response

**Expected Results:**

- [ ] Event deleted successfully
- [ ] Success message displays: "Event deleted successfully"
- [ ] Event removed from timeline
- [ ] Cannot see deleted event anymore

**Status:** [ ] PASS [ ] FAIL

**Notes:** ******\_\_\_******

---

# 📢 PHASE 5: ANNOUNCEMENT TESTING

**Duration:** 10 minutes
**Test Cases:** 3

---

## Test 5.1: View Announcements

**Objective:** Verify announcements display correctly

**Steps:**

1. [ ] Login as any user (admin or student)
2. [ ] Navigate to "Pengumuman" section
3. [ ] Observe announcements list

**Expected Results:**

- [ ] Announcements page loads
- [ ] Shows:
  - [ ] Announcement title
  - [ ] Announcement content
  - [ ] Publication date
  - [ ] Author (if shown)
- [ ] Sorted by newest first
- [ ] Pagination works (if many announcements)

**Status:** [ ] PASS [ ] FAIL

**Notes:** ******\_\_\_******

---

## Test 5.2: Admin Create Announcement

**Objective:** Verify admin can create announcement

**Steps:**

1. [ ] Login as admin
2. [ ] Go to "Pengumuman"
3. [ ] Click "Create Announcement" button
4. [ ] Fill form:
   - [ ] Title: "System Maintenance Notice"
   - [ ] Content: "System maintenance scheduled for tomorrow at 10 PM. Please save your work."
5. [ ] Click "Publish" button
6. [ ] Observe response

**Expected Results:**

- [ ] Announcement created successfully
- [ ] Success message displays: "Announcement published successfully"
- [ ] Announcement appears in list
- [ ] All users can see the announcement
- [ ] Shows publication date

**Status:** [ ] PASS [ ] FAIL

**Notes:** ******\_\_\_******

---

## Test 5.3: Admin Delete Announcement

**Objective:** Verify admin can delete announcement

**Steps:**

1. [ ] Find announcement to delete
2. [ ] Click "Delete" button
3. [ ] Confirm deletion if prompted
4. [ ] Observe response

**Expected Results:**

- [ ] Announcement deleted successfully
- [ ] Success message displays: "Announcement deleted successfully"
- [ ] Announcement removed from list
- [ ] Users can no longer see deleted announcement

**Status:** [ ] PASS [ ] FAIL

**Notes:** ******\_\_\_******

---

# ⚠️ PHASE 6: ERROR HANDLING TESTING

**Duration:** 10 minutes
**Test Cases:** 4

---

## Test 6.1: Invalid Login Error

**Objective:** Verify error handling for invalid login

**Steps:**

1. [ ] Go to login page
2. [ ] Enter email: `admin_1@student.devacademy.id`
3. [ ] Enter password: `InvalidPassword123!`
4. [ ] Click "Login"
5. [ ] Observe error

**Expected Results:**

- [ ] Login fails
- [ ] Error message clear and user-friendly
- [ ] Message: "Invalid email or password"
- [ ] No sensitive data exposed
- [ ] Form remains on page
- [ ] Can retry login

**Status:** [ ] PASS [ ] FAIL

**Error Message:** ******\_\_\_******

**Notes:** ******\_\_\_******

---

## Test 6.2: Validation Error - Missing Required Field

**Objective:** Verify form validation

**Steps:**

1. [ ] Login as student
2. [ ] Try to register team without selecting members
3. [ ] Click "Register" button
4. [ ] Observe validation error

**Expected Results:**

- [ ] Validation error displays
- [ ] Message indicates missing field: "Please select at least 3 members"
- [ ] Form not submitted
- [ ] Field highlighted in red
- [ ] Can correct and resubmit

**Status:** [ ] PASS [ ] FAIL

**Error Message:** ******\_\_\_******

**Notes:** ******\_\_\_******

---

## Test 6.3: Authorization Error

**Objective:** Verify authorization enforcement

**Steps:**

1. [ ] Login as student
2. [ ] Try to access admin panel via URL: http://localhost:5173/admin/dashboard
3. [ ] Observe response

**Expected Results:**

- [ ] Access denied
- [ ] Redirect to student dashboard
- [ ] Error message: "You don't have permission to access this page"
- [ ] No sensitive data exposed
- [ ] Cannot bypass authorization

**Status:** [ ] PASS [ ] FAIL

**Error Message:** ******\_\_\_******

**Notes:** ******\_\_\_******

---

## Test 6.4: 404 Error - Page Not Found

**Objective:** Verify 404 error handling

**Steps:**

1. [ ] Go to invalid URL: http://localhost:5173/invalid-page-xyz
2. [ ] Observe response

**Expected Results:**

- [ ] 404 page displays
- [ ] Message: "Page not found"
- [ ] Link to home page available
- [ ] No crash or blank page
- [ ] Can navigate back

**Status:** [ ] PASS [ ] FAIL

**Notes:** ******\_\_\_******

---

# ⚡ PHASE 7: PERFORMANCE & UI TESTING

**Duration:** 10 minutes
**Test Cases:** 3

---

## Test 7.1: Page Load Time

**Objective:** Verify page load performance

**Steps:**

1. [ ] Open DevTools (F12)
2. [ ] Go to Network tab
3. [ ] Reload page (Ctrl+R)
4. [ ] Check load time

**Expected Results:**

- [ ] Page loads in < 3 seconds
- [ ] First Contentful Paint (FCP) < 1.5 seconds
- [ ] All resources load successfully
- [ ] No 404 errors
- [ ] No failed requests

**Metrics:**

- Load Time: **\_** seconds
- FCP: **\_** seconds
- Total Resources: **\_**

**Status:** [ ] PASS [ ] FAIL

**Notes:** ******\_\_\_******

---

## Test 7.2: Responsive Design - Mobile View

**Objective:** Verify mobile responsiveness

**Steps:**

1. [ ] Open DevTools (F12)
2. [ ] Toggle device toolbar (Ctrl+Shift+M)
3. [ ] Set to mobile size: 375x667
4. [ ] Test navigation and content

**Expected Results:**

- [ ] Layout responsive on mobile
- [ ] Navigation menu accessible (hamburger menu or similar)
- [ ] Content readable without horizontal scroll
- [ ] Buttons clickable and properly sized
- [ ] Images scale correctly
- [ ] Forms usable on mobile

**Status:** [ ] PASS [ ] FAIL

**Notes:** ******\_\_\_******

---

## Test 7.3: UI/UX Consistency

**Objective:** Verify UI consistency across pages

**Steps:**

1. [ ] Check all pages:
   - [ ] Login page
   - [ ] Admin dashboard
   - [ ] Student dashboard
   - [ ] Teams page
   - [ ] Documents page
   - [ ] Timeline page
   - [ ] Announcements page
2. [ ] Verify consistency

**Expected Results:**

- [ ] Colors consistent across pages
- [ ] Fonts consistent
- [ ] Button styles consistent
- [ ] Spacing/padding consistent
- [ ] Icons consistent
- [ ] No layout issues
- [ ] Professional appearance

**Status:** [ ] PASS [ ] FAIL

**Notes:** ******\_\_\_******

---

# 📊 TEST RESULTS SUMMARY

## Overall Results

| Phase               | Tests  | Passed  | Failed  | Blocked |
| ------------------- | ------ | ------- | ------- | ------- |
| 1. Authentication   | 4      | [ ]     | [ ]     | [ ]     |
| 2. Team Management  | 5      | [ ]     | [ ]     | [ ]     |
| 3. Documents        | 4      | [ ]     | [ ]     | [ ]     |
| 4. Timeline         | 4      | [ ]     | [ ]     | [ ]     |
| 5. Announcements    | 3      | [ ]     | [ ]     | [ ]     |
| 6. Error Handling   | 4      | [ ]     | [ ]     | [ ]     |
| 7. Performance & UI | 3      | [ ]     | [ ]     | [ ]     |
| **TOTAL**           | **27** | **[ ]** | **[ ]** | **[ ]** |

---

## Critical Issues Found

1. ***
2. ***
3. ***

---

## Minor Issues Found

1. ***
2. ***
3. ***

---

## Recommendations

1. ***
2. ***
3. ***

---

## ✅ Sign-Off

**Tested by:** ******\_\_\_******

**Date:** ******\_\_\_******

**Time Spent:** **\_** hours

**Overall Status:** [ ] PASS [ ] FAIL [ ] BLOCKED

**All Critical Tests Passed?** [ ] YES [ ] NO

**Ready for Deployment?** [ ] YES [ ] NO

**Comments:**

---

---

## 📞 Troubleshooting

### Common Issues

**Issue: "User not found" error**

- Solution: Run setupTestData.js again

**Issue: "Database connection failed"**

- Solution: Check MongoDB is running and .env is configured

**Issue: "Port 8000 already in use"**

- Solution: Kill process or use different port

**Issue: "CORS error"**

- Solution: Check backend .env has correct FRONTEND_URL

**Issue: "Token expired"**

- Solution: Logout and login again

---

## 💡 Testing Tips

1. **Clear Cache:** Ctrl+Shift+Delete before each test
2. **Check Console:** F12 → Console (look for errors)
3. **Check Network:** F12 → Network (verify API calls)
4. **Check Storage:** F12 → Application → Storage (verify token)
5. **Mobile View:** F12 → Toggle device toolbar
6. **Take Screenshots:** Document issues with screenshots
7. **Note Errors:** Write down exact error messages

---

## 📋 Next Steps After Testing

1. [ ] Document all bugs found
2. [ ] Create GitHub issues for bugs
3. [ ] Prioritize critical bugs
4. [ ] Fix bugs
5. [ ] Re-test fixed issues
6. [ ] Get approval for deployment
7. [ ] Deploy to production

---

**Good luck with comprehensive testing!** 🚀

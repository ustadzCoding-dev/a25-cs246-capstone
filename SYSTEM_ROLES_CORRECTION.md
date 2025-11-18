# 🔧 System Roles Correction - Based on ProjectPlan

## ⚠️ CORRECTION NEEDED

Setelah membaca ProjectPlan.md dengan detail, saya menemukan bahwa dokumentasi sistem yang saya buat **TIDAK SESUAI** dengan project plan yang sebenarnya.

---

## 📋 STAKEHOLDERS SESUAI PROJECT PLAN

Dari ProjectPlan.md (Line 25):

```
"Who: Tim program Dicoding, admin, dan peserta capstone."
```

### Stakeholders yang Sebenarnya:

1. **Admin** (Tim program Dicoding)

   - Validasi komposisi tim
   - Approve/reject tim
   - Manage dokumen capstone
   - Manage timeline/deadline
   - Publish announcements

2. **Student** (Peserta capstone)
   - Register tim
   - Upload dokumen
   - View timeline
   - View announcements
   - Manage team members

---

## ❌ SALAH - Roles yang Saya Buat

Saya menambahkan role **"Lecturer"** yang **TIDAK ADA** di project plan:

```
- Admin: Full system access
- Student: Team management, document upload
- Lecturer: View teams, announcements  ❌ TIDAK ADA DI PROJECT PLAN
```

---

## ✅ BENAR - Roles Sesuai Project Plan

Hanya ada **2 roles**:

```
1. Admin (Tim program Dicoding)
   - Full system access
   - Validasi tim
   - Manage dokumen
   - Manage timeline
   - Publish announcements

2. Student (Peserta capstone)
   - Register tim
   - Upload dokumen
   - View timeline
   - View announcements
```

---

## 📊 Feature Matrix - Sesuai Project Plan

### In Scope (Yang Dikerjakan):

```
✅ Fitur Registrasi Tim Capstone dengan validasi komposisi otomatis
✅ Fitur Informasi Dokumen Capstone dengan akses terpusat
✅ Fitur Timeline Capstone dengan visualisasi deadline dan milestone
✅ Dashboard admin untuk melihat status pengajuan tim
✅ Responsive design untuk mobile dan desktop
```

### Out of Scope (Tidak Dikerjakan):

```
❌ Worksheet Individu / Check-in Progress (fitur opsional)
❌ 360-Degree Feedback (fitur opsional)
❌ Notifikasi push/email otomatis
❌ Integration dengan sistem autentikasi Dicoding yang sesungguhnya
❌ Fitur chat/messaging real-time
❌ Export data ke berbagai format
```

---

## 🔄 Corrected System Flow

### Frontend Layer

```
User Interface
    ↓
Views (Pages)
├── Login/Signup
├── Admin Dashboard
├── Team Management
├── Document Management
├── Timeline Management
└── Announcements
    ↓
Stores (Pinia - State Management)
├── authStore (user, token, role)
├── teamStore (teams, loading, errors)
├── documentStore (documents, loading, errors)
├── timelineStore (events, loading, errors)
└── announcementStore (announcements, loading, errors)
    ↓
Composables (Reusable Logic)
├── useAsyncAction
├── useForm
└── usePagination
    ↓
Services (API Calls)
├── authService
├── teamService
├── documentService
├── timelineService
└── announcementService
    ↓
HTTP Request to Backend
```

### Backend Layer

```
HTTP Request
    ↓
Routes (API Endpoints)
├── POST /api/auth/login
├── POST /api/auth/signup
├── GET /api/teams
├── POST /api/teams (student)
├── PUT /api/teams/:id/approve (admin)
├── PUT /api/teams/:id/reject (admin)
├── POST /api/documents/upload (student)
├── GET /api/documents
├── DELETE /api/documents/:id (admin/owner)
├── GET /api/timeline
├── POST /api/timeline (admin)
├── GET /api/announcements
└── POST /api/announcements (admin)
    ↓
Middleware (Security, Auth, Validation)
├── Security (helmet, cors, rate-limit)
├── Authentication (verify JWT token)
├── Authorization (check user role)
├── Validation (validate request data)
└── Error Handling (catch & format errors)
    ↓
Controllers (Request Handlers)
├── authController
├── capstoneGroupController
├── documentController
├── timelineController
└── announcementController
    ↓
Services (Business Logic)
├── TeamService
├── DocumentService
└── TimelineService
    ↓
Models (Database Schema)
├── User
├── CapstoneGroup (Team)
├── Document
├── Timeline
├── Announcement
└── UseCase
    ↓
MongoDB
```

---

## 🧪 Corrected Testing Scenarios

### Authentication Tests

```
✅ Login as Admin
✅ Login as Student
✅ Signup as Student
✅ Logout
```

### Admin Features

```
✅ View pending teams
✅ Approve team
✅ Reject team
✅ Upload/manage documents
✅ Create/manage timeline events
✅ Create/manage announcements
```

### Student Features

```
✅ Register team
✅ View team status
✅ Upload documents
✅ View timeline
✅ View announcements
```

---

## 📝 Corrected Test Accounts

### Admin Account

```
Email: admin@dicoding.com
Password: AdminPassword123!
Role: Admin
```

### Student Accounts

```
Email: student1@dicoding.com
Password: StudentPassword123!
Role: Student

Email: student2@dicoding.com
Password: StudentPassword123!
Role: Student

Email: student3@dicoding.com
Password: StudentPassword123!
Role: Student
```

---

## ✅ Action Items

### Files to Update:

1. ❌ SYSTEM_ARCHITECTURE.md - Remove Lecturer role
2. ❌ MANUAL_TESTING_GUIDE.md - Remove Lecturer tests
3. ❌ QUICK_TEST_REFERENCE.md - Remove Lecturer account
4. ✅ Backend code - Already correct (only Admin & Student)
5. ✅ Frontend code - Already correct (only Admin & Student)

### Database Models to Verify:

```
User model should have:
- role: enum ['admin', 'student'] ✅
- NOT 'lecturer'
```

---

## 🎯 Summary

**BEFORE (SALAH):**

- Admin, Student, Lecturer (3 roles)

**AFTER (BENAR):**

- Admin, Student (2 roles)

**Reason:**

- ProjectPlan.md hanya mention "Tim program Dicoding, admin, dan peserta capstone"
- Tidak ada mention tentang Lecturer
- Use case DC-09 fokus pada team registration, document management, dan timeline

---

## 📞 Next Steps

1. Update SYSTEM_ARCHITECTURE.md - remove Lecturer
2. Update MANUAL_TESTING_GUIDE.md - remove Lecturer tests
3. Update QUICK_TEST_REFERENCE.md - remove Lecturer account
4. Verify backend code - confirm only Admin & Student roles
5. Verify frontend code - confirm only Admin & Student roles
6. Re-run tests to ensure everything works

**Terima kasih sudah mengingatkan!** 🙏

# Dokumen Project Plan
**Asah led by Dicoding in association with Accenture**

**ID Tim Capstone Project:** [A25-CS246]  
**ID Use Case:** [DC-09]

## List Anggota:
1. (F886D5Y0069) - (Afrizal Ilza Munadhif) - (Front-End & Back-End with AI) - [Aktif]
2. (F891D5X0445) - (Deby Maulida) - (Front-End & Back-End with AI) - [Aktif]
3. (F268D5Y0679) – (Ganza Wajendra Ekasakti) - (Front-End & Back-End with AI) - [Aktif]
4. (F891D5X1077) - (Marsa Ardita) - (Front-End & Back-End with AI) - [Aktif]
5. (F295D5Y1370) - (Muhammad Rizky) - (Front-End & Back-End with AI) - [Aktif]

---

## A. Ringkasan Eksekutif

### Problem Statement

Dicoding Indonesia telah menjalankan program pelatihan intensif yang diikuti oleh lebih dari 30.000 siswa, dengan Capstone Project sebagai aktivitas krusial dalam mengukur pencapaian akhir peserta. Namun, saat ini belum tersedia wadah terintegrasi yang dapat menyatukan seluruh informasi dan aktivitas capstone dalam satu sistem dashboard yang efisien. Kondisi ini menyebabkan beberapa permasalahan:

- **What:** Tidak adanya sistem terpusat untuk manajemen capstone project.
- **When:** Terjadi setiap periode capstone (bulanan/per cohort).
- **Where:** Platform Academic Dashboard Dicoding.
- **Who:** Tim program Dicoding, admin, dan peserta capstone.
- **Why:** Proses manual menyebabkan inefisiensi dalam monitoring progress, validasi tim, dan distribusi informasi.
- **How:** Diperlukan integrasi fitur capstone ke dalam Academic Dashboard yang sudah ada.

Dampak dari permasalahan ini mencakup lambatnya proses validasi tim capstone, kesulitan monitoring progress peserta secara real-time, dan rendahnya efisiensi koordinasi antara tim program dengan peserta.

### Research Questions

1. Bagaimana mengimplementasikan sistem registrasi tim capstone yang dapat melakukan validasi komposisi otomatis sesuai dengan ketentuan learning path?
2. Bagaimana merancang sistem informasi dokumen dan timeline yang dapat diakses secara mudah dan real-time oleh seluruh stakeholder?
3. Fitur-fitur apa saja yang paling efektif untuk meningkatkan efisiensi manajemen capstone project di lingkungan Dicoding?

### Latar Belakang

Program Asah Dicoding memiliki Academic Dashboard yang digunakan untuk melacak progress pembelajaran siswa. Namun, aktivitas capstone project yang merupakan tahap krusial belum terintegrasi dengan baik ke dalam dashboard tersebut. Informasi mengenai timeline, dokumen panduan, dan status tim masih tersebar di berbagai platform (email, Google Form, spreadsheet), menyebabkan fragmentasi informasi dan meningkatkan beban administratif.

Dengan mengintegrasikan fitur capstone project ke dalam Academic Dashboard, diharapkan dapat tercipta ekosistem yang lebih kohesif, meningkatkan transparansi progress, dan memudahkan tim program dalam melakukan monitoring serta intervensi dini terhadap tim yang mengalami kendala.

### Alasan Memilih Proyek

Tim kami memilih use case DC-09 karena:

1. **Relevansi Langsung:** Sebagai peserta program Asah, kami mengalami langsung tantangan dalam mengelola informasi capstone yang tersebar.
2. **Impact Scalability:** Solusi yang kami bangun akan bermanfaat untuk 30.000+ peserta Dicoding
3. **Technical Challenge:** Proyek ini memerlukan integrasi front-end dan back-end yang kompleks, sesuai dengan learning path kami
4. **Sustainability:** Produk yang dihasilkan dapat terus digunakan dan dikembangkan untuk cohort mendatang

Kami percaya bahwa proyek ini adalah "painkiller" yang mengatasi pain point nyata, bukan sekadar "vitamin" yang nice-to-have.

---

## B. Cakupan Proyek dan Hasil Kerja

### Batasan Proyek

#### In Scope (Yang Dikerjakan):
- Fitur Registrasi Tim Capstone dengan validasi komposisi otomatis
- Fitur Informasi Dokumen Capstone dengan akses terpusat
- Fitur Timeline Capstone dengan visualisasi deadline dan milestone
- Integrasi dengan Academic Dashboard yang sudah ada (simulasi)
- Dashboard admin untuk melihat status pengajuan tim
- Responsive design untuk mobile dan desktop
- State management menggunakan Pinia/Vuex untuk sinkronisasi data

#### Out of Scope (Tidak Dikerjakan pada MVP):
- Worksheet Individu / Check-in Progress (fitur opsional)
- 360-Degree Feedback (fitur opsional)
- Notifikasi push/email otomatis
- Integration dengan sistem autentikasi Dicoding yang sesungguhnya
- Fitur chat/messaging real-time
- Export data ke berbagai format

### Milestone Proyek

#### Week 1 (31 Oktober - 6 November 2025)
- Kickoff meeting dan finalisasi tech stack
- Setup repository GitHub dan environment development
- Desain database schema dan ERD
- Wireframing dan UI/UX design
- Setup Vue 3 project dengan Vite
- **Submission:** Project Plan (31 Oktober)

#### Week 2 (7 November - 13 November 2025)
- Development Fitur Registrasi Tim (Front-End)
- Development API Registrasi dan Validasi Komposisi (Back-End)
- Setup CI/CD pipeline
- Unit testing untuk komponen registrasi

#### Week 3 (14 November - 20 November 2025)
- Development Fitur Informasi Dokumen (Front-End + Back-End)
- Integrasi Front-End dengan Back-End untuk Registrasi
- Setup state management dengan Pinia
- **Submission:** Laporan Kemajuan (18 November)
- Sesi Mentoring dengan Advisor (dijadwalkan)

#### Week 4 (21 November - 27 November 2025)
- Development Fitur Timeline Capstone (Front-End + Back-End)
- Integration testing seluruh fitur
- Responsive design implementation
- Bug fixing fase 1

#### Week 5 (28 November - 4 Desember 2025)
- User Acceptance Testing (UAT)
- Deployment ke staging environment
- Performance optimization (Vue bundle size, lazy loading)
- Dokumentasi API dan user guide

#### Week 6 (5 Desember - 15 Desember 2025)
- Final testing dan quality assurance
- Deployment ke production
- Pembuatan video presentasi dan slide
- Penulisan Project Brief
- **Submission:** 360 Feedback (13-15 Desember)
- **Submission:** Project Brief dan Final Deliverables (15 Desember)

---

## C. Jadwal Pengerjaan

### Gantt Chart Overview

| Minggu | Tanggal | Aktivitas Utama | PIC | Status |
|--------|---------|-----------------|-----|--------|
| W1 | 31 Okt - 6 Nov | Planning & Setup | All | ✅ 86% Complete |
| W2 | 7 Nov - 13 Nov | Registrasi Tim Feature | Afrizal, Deby, Ganza | ⏳ Ready to Start |
| W3 | 14 Nov - 20 Nov | Informasi Dokumen Feature | Marsa, Ganza | 📅 Scheduled |
| W4 | 21 Nov - 27 Nov | Timeline Feature | Rizky, Deby | 📅 Scheduled |
| W5 | 28 Nov - 4 Des | Testing & Deployment | All | 📅 Scheduled |
| W6 | 5 Des - 15 Des | Finalisasi & Deliverables | All | 📅 Scheduled |

### Jadwal Detail Mingguan

#### Week 1: Planning & Setup (31 Okt - 6 Nov)

| Hari | Aktivitas | PIC | Status | Deliverable |
|------|-----------|-----|--------|-------------|
| Kamis (31 Okt) | Kickoff meeting, diskusi tech stack | All | ✅ Done | Meeting notes, Submit Project Plan |
| Jumat (1 Nov) | Setup GitHub repo (private), branching strategy | Rizky | ✅ Done | Repository structure |
| Sabtu (2 Nov) | Database design (ERD), API specification | Ganza | ✅ Done | ERD diagram, Mongoose models |
| Minggu (3 Nov) | Wireframe & UI design Figma | Deby | 🔄 Partially Done | Wireframe mockup (partial) |
| Senin (4 Nov) | Setup Vue 3 + Vite, install dependencies | All | ✅ Done | Dev environment ready |
| Selasa (5 Nov) | Inisialisasi project structure (front & back) | Afrizal, Marsa | ✅ Done | Boilerplate code |
| Rabu (6 Nov) | Code review setup, CI/CD pipeline | Rizky | ✅ Done | CI/CD configured |

**Week 1 Progress:** 6/7 tasks completed (86%)

#### Week 2: Registrasi Tim Feature (7 Nov - 13 Nov)

| Hari | Aktivitas | PIC | Deliverable |
|------|-----------|-----|-------------|
| Kamis (7 Nov) | Form registrasi UI dengan Vue components | Deby | Registration form UI |
| Jumat (8 Nov) | API endpoint registrasi tim (POST /api/teams) | Ganza | API endpoint |
| Sabtu (9 Nov) | Logika validasi komposisi tim + VueUse for validation | Ganza | Validation logic |
| Minggu (10 Nov) | Integrasi form Vue dengan API menggunakan Axios | Afrizal | Working registration |
| Senin (11 Nov) | Admin dashboard Vue - list pending teams | Afrizal | Admin view |
| Selasa (12 Nov) | API untuk update status tim (approve/reject) | Ganza | Status update API |
| Rabu (13 Nov) | Unit testing fitur registrasi | Deby, Ganza | Test coverage 80% |

#### Week 3: Informasi Dokumen Feature (14 Nov - 20 Nov)

| Hari | Aktivitas | PIC | Deliverable |
|------|-----------|-----|-------------|
| Kamis (14 Nov) | Halaman Informasi Dokumen UI | Marsa | Document page UI |
| Jumat (15 Nov) | API untuk mengelola dokumen (CRUD) | Marsa | Document API |
| Sabtu (16 Nov) | Fitur upload/delete dokumen (admin) | Marsa | Upload functionality |
| Minggu (17 Nov) | Fitur download/view dokumen (siswa) | Marsa | Download feature |
| Senin (18 Nov) | Integration testing Registrasi + Dokumen, setup Pinia store | All | Submit Laporan Kemajuan |
| Selasa (19 Nov) | Bug fixing dan UI polishing | Deby | Clean UI |
| Rabu (20 Nov) | Sesi Mentoring dengan Advisor (tentative) | All | Mentoring notes |

#### Week 4: Timeline Feature (21 Nov - 27 Nov)

| Hari | Aktivitas | PIC | Deliverable |
|------|-----------|-----|-------------|
| Kamis (21 Nov) | Timeline UI dengan visualisasi milestone | Rizky, Deby | Timeline component |
| Jumat (22 Nov) | API untuk mengelola timeline/deadline | Rizky | Timeline API |
| Sabtu (23 Nov) | Highlight deadline terdekat dan overdue (computed properties) | Rizky | Deadline alerts |
| Minggu (24 Nov) | Responsive design untuk mobile | Deby | Mobile-friendly UI |
| Senin (25 Nov) | Integration testing seluruh fitur | All | End-to-end testing |
| Selasa (26 Nov) | Performance testing dan optimization (computed properties) | Rizky | Performance metrics |
| Rabu (27 Nov) | Bug fixing critical issues | All | Bug tracker cleared |

#### Week 5: Testing & Deployment (28 Nov - 4 Des)

| Hari | Aktivitas | PIC | Deliverable |
|------|-----------|-----|-------------|
| Kamis (28 Nov) | User Acceptance Testing (UAT) | All | UAT checklist |
| Jumat (29 Nov) | Deployment ke staging environment | Rizky | Staging URL |
| Sabtu (30 Nov) | Load testing dan security audit | Ganza, Rizky | Security report |
| Minggu (1 Des) | Dokumentasi API (Swagger/Postman) | Ganza | API documentation |
| Senin (2 Des) | User guide dan README GitHub | Marsa | User manual |
| Selasa (3 Des) | Deployment ke production | Rizky | Production URL |
| Rabu (4 Des) | Final bug fixes dan monitoring | All | Stable production |

#### Week 6: Finalisasi & Deliverables (5 Des - 15 Des)

| Hari | Aktivitas | PIC | Deliverable |
|------|-----------|-----|-------------|
| Kamis (5 Des) | Persiapan slide presentasi | Afrizal, Deby | Presentation slides |
| Jumat (6 Des) | Rekaman video presentasi (10 menit) | All | Presentation video |
| Sabtu (7 Des) | Penulisan Project Brief | Afrizal, Marsa | Project Brief draft |
| Minggu (8 Des) | Video tutorial penggunaan produk | Rizky | Tutorial video |
| Senin (9 Des) | Review dan revisi Project Brief | All | Project Brief final |
| Selasa (10 Des) | Download GitHub repository (.zip) | Rizky | Repository ZIP |
| Rabu (11 Des) | Final quality check semua deliverables | All | QA checklist |
| 13-15 Des | Isi formulir 360 Feedback | All | 360 Feedback submitted |
| Minggu (15 Des) | Submission Final Deliverables | Afrizal | All documents submitted |

---

## D. Uraian Rencana Penugasan/Job Desk Setiap Learning Path

Karena seluruh anggota tim memiliki learning path yang sama (Front-End & Back-End with AI), pembagian tugas dilakukan berdasarkan fitur dan spesialisasi teknis:

### 1. Afrizal Ilza Munadhif (Ketua Tim)

**Peran Utama:** Project Manager + Full Stack Developer

**Tanggung Jawab:**
- Koordinasi tim dan komunikasi dengan advisor/asesor/Tim Asah
- Memimpin daily standup dan weekly retrospective
- Mengerjakan Fitur Registrasi Tim (integrasi Vue front-end dengan Express back-end)
- Admin dashboard Vue untuk validasi tim
- Setup dan konfigurasi Vue Router
- Memastikan semua checkpoint dan submission tepat waktu
- Point of contact untuk pelaporan progress

**Deliverables:**
- Project Plan, Project Brief, dan dokumen formal lainnya
- Fitur Registrasi Tim Capstone (full stack dengan Vue.js)
- Admin dashboard untuk approve/reject tim
- Vue Router configuration

### 2. Deby Maulida

**Peran Utama:** Front-End Developer Lead + UI/UX Designer

**Tanggung Jawab:**
- Desain UI/UX seluruh aplikasi (Figma)
- Implementasi halaman Registrasi Tim dengan Vue 3 Composition API
- Implementasi Timeline UI dengan visualisasi yang menarik menggunakan Vue components
- Memastikan responsive design untuk mobile dan desktop dengan Tailwind CSS
- Konsistensi design system (color, typography, spacing)
- Code review untuk Vue components dan front-end
- Implementasi Vue transitions dan animations

**Deliverables:**
- Wireframe dan mockup Figma
- Halaman Registrasi Tim (Vue front-end)
- Timeline visualization component
- Style guide dan design tokens
- Reusable Vue components library

### 3. Ganza Wajendra Ekasakti

**Peran Utama:** Back-End Developer Lead + Database Architect

**Tanggung Jawab:**
- Merancang arsitektur database dan ERD
- Implementasi API untuk Registrasi Tim (POST, GET, PUT)
- Logika validasi komposisi tim sesuai learning path
- API untuk update status tim (approve/reject)
- Database migration dan seeding
- Code review untuk back-end code
- Security implementation (authentication, authorization)
- CORS configuration untuk Vue front-end

**Deliverables:**
- Database schema (ERD)
- API endpoints untuk Registrasi Tim
- Validation logic untuk komposisi tim
- API documentation (Postman)
- RESTful API yang Vue-friendly

### 4. Marsa Ardita

**Peran Utama:** Full Stack Developer (Fitur Informasi & Dokumen)

**Tanggung Jawab:**
- Implementasi Fitur Informasi Dokumen dengan Vue.js (front-end + back-end)
- API untuk CRUD dokumen panduan capstone
- Fitur upload dokumen (admin) dan download (siswa)
- Manajemen file storage (local/cloud)
- Setup Pinia store untuk state management dokumen
- Penulisan user guide dan dokumentasi produk
- Membantu penulisan README GitHub

**Deliverables:**
- Halaman Informasi Dokumen (full stack dengan Vue)
- API untuk document management
- File upload/download functionality
- Pinia store modules untuk dokumen
- User manual dan panduan penggunaan produk

### 5. Muhammad Rizky

**Peran Utama:** Full Stack Developer (Timeline) + DevOps Engineer

**Tanggung Jawab:**
- Implementasi Fitur Timeline Capstone dengan Vue.js (front-end + back-end)
- API untuk mengelola timeline/deadline/milestone
- Highlight deadline terdekat dan status overdue dengan Vue computed properties
- Setup CI/CD pipeline (GitHub Actions) untuk Vue + Express
- Deployment ke staging dan production (Vercel untuk Vue + Railway untuk Express)
- Monitoring dan performance optimization (Vue bundle optimization)
- Penulisan dokumentasi teknis
- Setup Vite build configuration untuk production

**Deliverables:**
- Fitur Timeline Capstone (full stack dengan Vue)
- CI/CD pipeline configured untuk Vue.js
- Staging dan production deployment
- Performance monitoring dashboard
- Technical documentation
- Optimized Vue production build

---

## E. Sumber Daya Proyek

### Bahasa Pemrograman

1. **JavaScript (Node.js):** Back-end development
   - Fungsi: Bahasa utama untuk API server, business logic, dan database operations

2. **JavaScript (Vue.js):** Front-end development
   - Fungsi: Progressive framework untuk membangun user interface yang reaktif dan performance

### Framework & Library

#### Front-End (Vue.js Ecosystem)

1. **Vue.js v3** - Progressive JavaScript framework
   - Fungsi: Membangun single-page application dengan reactive data binding dan component-based architecture
   - Alasan: Lebih lightweight dibanding React, excellent documentation, dan cocok untuk dashboard apps

2. **Vite v5** - Build tool
   - Fungsi: Fast development server dan optimized production build untuk Vue
   - Alasan: Jauh lebih cepat dibandingkan webpack dan mendukung modul ES (ES Modules) secara native

3. **Vue Router v4** - Official routing library
   - Fungsi: Mengelola navigasi antar halaman dalam SPA dengan nested routes

4. **Pinia** - State management
   - Fungsi: Modern state management untuk Vue 3, pengganti Vuex yang lebih simple
   - Alasan: Type-safe, devtools support, dan modular stores

5. **Tailwind CSS v3** - Utility-first CSS framework
   - Fungsi: Styling yang cepat dan konsisten dengan utility classes

6. **Axios** - HTTP client
   - Fungsi: Melakukan request ke API back-end dengan interceptor untuk error handling

7. **VueUse** - Collection of Vue Composition Utilities
   - Fungsi: Reusable composition functions untuk form validation, storage, dll

8. **Vue Query (TanStack Query)** - Data fetching library
   - Fungsi: Caching, synchronization, dan state management untuk server data

9. **Vitest** - Testing framework
   - Fungsi: Unit testing untuk Vue components (Vite-native)

10. **@vue/test-utils** - Vue testing utilities
    - Fungsi: Official testing utilities untuk Vue components

#### Back-End

1. **Express.js v4** - Web framework
   - Fungsi: Membangun RESTful API dengan middleware support

2. **Sequelize ORM** - Database ORM
   - Fungsi: Abstraksi database operations dan migration management

3. **JWT (jsonwebtoken)** - Authentication
   - Fungsi: Implementasi token-based authentication untuk admin dan siswa

4. **Bcrypt** - Password hashing
   - Fungsi: Enkripsi password untuk keamanan data user

5. **Multer** - File upload
   - Fungsi: Handling upload dokumen panduan capstone

6. **Joi** - Validation
   - Fungsi: Schema validation untuk request body API

7. **CORS** - Cross-Origin Resource Sharing
   - Fungsi: Mengizinkan Vue front-end mengakses Express API dari domain berbeda

### Database

1. **MongoDB v7** - NoSQL document database
   - Fungsi: Menyimpan data tim, user, dokumen, timeline dalam format JSON/BSON yang fleksibel
   - Alasan: Schema-less flexibility, excellent untuk rapid development, native JSON support, easy integration dengan Express (MEVN stack)

2. **Mongoose v8** - MongoDB ODM (Object Data Modeling)
   - Fungsi: Schema definition, validation, dan query abstraction untuk MongoDB
   - Alasan: Type safety, built-in validation, middleware support, dan relationship management

### Cloud & Deployment

1. **Vercel** - Front-end hosting
   - Fungsi: Deploy Vue app dengan CI/CD otomatis dari GitHub
   - Alasan: Optimized untuk Vite builds, automatic HTTPS, dan CDN global

2. **Railway** - Back-end hosting
   - Fungsi: Deploy Express.js API dengan database MongoDB
   - Alasan: Simple deployment, integrated database, dan auto-scaling

3. **Cloudinary (optional)** - File storage
   - Fungsi: Menyimpan dokumen dan file upload jika tidak menggunakan local storage

### Development Tools

1. **GitHub** - Version control
   - Fungsi: Kolaborasi kode dengan branching strategy (main, develop, feature branches)

2. **Postman** - API testing
   - Fungsi: Testing dan dokumentasi API endpoints

3. **Figma** - UI/UX design
   - Fungsi: Wireframing dan prototyping sebelum development

4. **ESLint + Prettier** - Code quality
   - Fungsi: Linting dan formatting untuk konsistensi kode

5. **Vue DevTools** - Browser extension
   - Fungsi: Debugging Vue components, Pinia stores, dan routing

6. **Lighthouse** - Performance auditing
   - Fungsi: Audit performance, accessibility, dan SEO untuk Vue app

### Communication & Project Management

1. **Discord/WhatsApp** - Daily communication
   - Fungsi: Real-time chat untuk koordinasi cepat

2. **Google Calendar** - Scheduling
   - Fungsi: Reminder untuk deadline dan sesi mentoring

3. **Asana** - Project management
   - Fungsi: Task tracking, dokumentasi, dan knowledge base

4. **Google Meet** - Video conference
   - Fungsi: Daily standup dan weekly retrospective

### Documentation & Reference

1. **Dicoding Capstone Playbook** - Guideline
   - Fungsi: Referensi untuk requirement dan submission guidelines

2. **Vue.js Official Documentation** - Technical reference
   - Fungsi: Dokumentasi Vue 3, Composition API, dan best practices

3. **Vite Documentation** - Build tool reference
   - Fungsi: Configuration dan optimization guidelines

4. **Pinia Documentation** - State management guide
   - Fungsi: Store setup dan patterns

5. **Stack Overflow** - Problem solving
   - Fungsi: Mencari solusi untuk technical issues

---

## F. Rencana Manajemen Risiko dan Isu

### Analisis SWOT

#### Strengths (Kekuatan)
- Seluruh anggota memiliki learning path yang sama (Full Stack) sehingga memudahkan kolaborasi
- Tim berjumlah 5 orang (ideal untuk pembagian tugas)
- Use case DC-09 memiliki scope yang jelas dengan fitur wajib terdefinisi
- Tim sudah mengalami langsung pain point sebagai peserta capstone
- Vue.js memiliki learning curve yang lebih gentle dibanding React
- Vue documentation sangat comprehensive dan beginner-friendly

#### Weaknesses (Kelemahan)
- Keterbatasan waktu pengerjaan (4-5 minggu)
- Belum ada anggota dengan spesialisasi DevOps yang kuat
- Kemungkinan perbedaan skill level antar anggota
- Risiko konflik jadwal dengan kelas atau pekerjaan anggota
- Tim belum berpengalaman dengan Vue.js (perlu learning period)
- Perlu adaptasi dari React mindset ke Vue approach

#### Opportunities (Peluang)
- Produk dapat digunakan oleh 30.000+ peserta Dicoding (high impact)
- Kesempatan untuk menjadi Top Capstone Project jika eksekusi baik
- Learning experience yang sangat valuable untuk karir
- Networking dengan Advisor dan tim Dicoding/Accenture
- Vue.js adalah skill yang in-demand di industri
- Vue ecosystem memiliki tooling yang excellent (Vite, Pinia)

#### Threats (Ancaman)
- Anggota tidak aktif atau drop out di tengah jalan
- Technical issues yang tidak terprediksi (bug kompleks)
- Scope creep (keinginan menambah fitur di luar MVP)
- Dependency pada third-party service (downtime)
- Learning curve Vue.js untuk tim yang belum familiar
- Potensi refactoring jika pattern yang digunakan tidak optimal

### Risk Assessment Matrix

| Risk ID | Risiko | Probability | Impact | Severity | Mitigasi | Contingency Plan |
|---------|--------|-------------|--------|----------|----------|------------------|
| R01 | Anggota tidak responsif/inactive | Medium | High | Critical | Daily standup 15 menit, weekly 1-on-1, isi worksheet bi-weekly | Laporkan ke Tim Asah via formulir inactive, redistribusi tugas ke anggota aktif |
| R02 | Vue.js learning curve | High | Medium | High | Learning session intensif week 1, pair programming, code review, gunakan Vue docs | Fokus pada basic patterns dulu, avoid advanced features sampai MVP selesai |
| R03 | Timeline terlambat | Medium | High | Critical | Buffer 3-5 hari sebelum deadline, daily progress tracking | Lembur akhir pekan, kurangi fitur non-essential |
| R04 | Bug critical menjelang deadline | Low | High | High | Testing mulai week 4, implementasi CI/CD, gunakan Vue DevTools | Rollback ke stable version, prioritas bug fixing |
| R05 | Integrasi Vue-Express bermasalah | Medium | Medium | Medium | API contract agreement di awal, mock data untuk development, test CORS early | Gunakan mock API sementara, debugging session bersama |
| R06 | Konflik merge di GitHub | Low | Low | Low | Branching strategy jelas, pull request review | Resolve conflict manual, komunikasi sebelum merge |
| R07 | Deployment failure (Vercel/Railway) | Low | Medium | Medium | Testing di staging sebelum production, backup database | Rollback deployment, debug di local |
| R08 | Scope creep (fitur berlebihan) | Medium | Medium | Medium | Fokus pada MVP fitur wajib, reject fitur opsional sampai MVP selesai | Timebox fitur tambahan hanya jika ada waktu tersisa |
| R09 | Data loss (tidak backup) | Low | High | High | Daily commit ke GitHub, backup database weekly | Restore dari backup terakhir, recreate dari memory |
| R10 | Advisor tidak responsif | Low | Medium | Medium | Kirim email perkenalan segera, follow up 3x24 jam | Laporkan ke Tim Asah via formulir, konsultasi dengan peers |
| R11 | Vue state management issues | Medium | Medium | Medium | Proper Pinia store design, follow best practices, gunakan Vue DevTools untuk debug | Simplify state structure, minimize shared state |
| R12 | Performance issues (bundle size) | Low | Medium | Medium | Lazy loading routes, code splitting, optimize Vite build config | Analyze bundle dengan Vite Bundle Analyzer, remove unused dependencies |

### Issue Management Plan

#### Proses Identifikasi Isu

1. **Daily Standup (15 menit setiap pagi jam 09.00 WIB)**
   - Setiap anggota share: What I did yesterday, What I'll do today, Any blockers?
   - Identifikasi blocker dan risiko potensial, especially Vue-related issues

2. **Weekly Retrospective (setiap Minggu malam)**
   - Review progress vs jadwal
   - Diskusi: What went well, What can improve, Action items
   - Evaluate Vue learning progress

3. **Bi-weekly Checkpoint (sesuai jadwal Tim Asah)**
   - Isi worksheet capstone individu
   - Monitoring oleh Tim Asah

#### Proses Penyelesaian Isu

1. **Low Impact Issue:** Diselesaikan langsung oleh PIC yang bersangkutan, check Vue docs first
2. **Medium Impact Issue:** Diskusi di grup WhatsApp, selesaikan dalam 1-2 hari, pair programming jika stuck
3. **High Impact Issue:** Emergency meeting, eskalasi ke Advisor jika perlu, leverage Vue community
4. **Critical Issue:** Ketua tim langsung koordinasi, hubungi Tim Asah jika blocker tidak teratasi

#### Komunikasi dan Eskalasi

- **Internal Team:** WhatsApp group untuk komunikasi cepat
- **With Advisor:** Email + Dicoding Mentoring Platform (untuk sesi resmi)
- **With Tim Asah:** Email asah@dicoding.com untuk isu formal
- **Emergency Contact:** 0856-5945-2688, Nomor WA ketua tim (Afrizal)
- **Vue Community:** Vue Discord, Stack Overflow untuk technical questions

### Strategi Mitigasi Proaktif

#### 1. Vue.js Learning Sprint (Week 1 Priority)

**Hari 1-2: Semua anggota wajib menyelesaikan Vue 3 fundamentals**
- Vue 3 Composition API basics
- Reactive data dengan ref() dan reactive()
- Computed properties dan watchers
- Component communication (props, emits)

**Hari 3-4: Advanced topics**
- Vue Router setup dan navigation
- Pinia store creation dan usage
- Form handling dengan VueUse

**Hari 5-7: Practice dengan mini project**
- Build simple CRUD app sebagai latihan
- Code review bersama untuk share learning

**Resources:**
- Vue 3 Official Tutorial (interactive)
- Vue Mastery (free courses)
- VueSchool (selected free videos)

#### 2. Daily Standup Ritual

- **Waktu:** Setiap hari jam 21.00 WIB (15 menit)
- **Platform:** Google Meet / WhatsApp Video Call
- **Format:** Setiap orang share progress, blocker, dan Vue learning
- **Goal:** Deteksi masalah sedini mungkin, share Vue tips & tricks

#### 3. Pair Programming (Vue Focus)

- **Week 2-4:** Setiap fitur Vue dikerjakan berpasangan
- **Pairing:** Senior Vue dev dengan yang sedang belajar
- **Benefit:** Knowledge sharing, mengurangi bug, faster Vue adoption

#### 4. Code Review Mandatory (Vue Pattern Focus)

- Setiap pull request harus di-review minimal 1 orang
- Gunakan GitHub PR template dengan Vue-specific checklist:
  - Component naming mengikuti konvensi Vue
  - Penggunaan Composition API yang tepat
  - Tidak ada manipulasi DOM secara langsung
  - Validasi props harus didefinisikan
  - Emits harus dinyatakan secara eksplisit
  - Reactive data digunakan dengan benar
- Tidak boleh merge tanpa approval

#### 5. Documentation-First Approach

- Tulis README dan API docs sambil coding, bukan di akhir
- Dokumentasikan Vue component API (props, emits, slots)
- Dokumentasi jadi referensi untuk testing

#### 6. Testing Incremental (Vue Components)

- Tidak menunggu semua fitur selesai baru testing
- Unit test dengan Vitest untuk setiap Vue component
- Integration test setelah fitur selesai
- Gunakan @vue/test-utils untuk component testing

#### 7. Backup Strategy

- **Code:** GitHub (remote repository)
- **Database:** Weekly export ke file SQL atau JSON
- **Dokumen:** Google Drive shared folder
- **Vue components:** Organize by feature, easy to rollback

#### 8. Vue Best Practices Checklist

- Gunakan Composition API secara konsisten
- Buat komponen kecil dan fokus pada satu tanggung jawab (Single Responsibility)
- Gunakan Pinia untuk manajemen state global, dan props untuk state lokal
- Terapkan lazy loading pada routing (memuat halaman hanya saat dibutuhkan)
- Gunakan computed properties daripada methods jika memungkinkan (untuk efisiensi reaktifitas)
- Lakukan pembersihan dengan benar dalam hook onUnmounted (membersihkan event listener, interval, dsb)
- Gunakan TypeScript dan tipe data (opsional, jika waktu memungkinkan)

### Contingency Plan untuk Skenario Terburuk

#### Skenario 1: Anggota Drop Out

**Jika 1 anggota drop out (tim jadi 4 orang):**
- Redistribusi tugas anggota tersebut ke 4 orang sisanya
- Prioritas: Selesaikan fitur wajib dulu, skip fitur tambahan
- Laporkan ke Tim Asah untuk adjustment penilaian

**Jika 2+ anggota drop out:**
- Eskalasi urgent ke Tim Asah
- Minta penggabungan dengan tim lain atau adjustment scope

#### Skenario 2: Tim Kesulitan dengan Vue.js

**Jika learning curve terlalu steep:**
- Fokus pada pola dasar Vue, hindari fitur-fitur lanjutan terlebih dahulu
- Gunakan sintaks template lebih banyak, dan minimalkan penggunaan Composition API yang kompleks
- Manfaatkan library komponen UI Vue (seperti Vuetify atau PrimeVue) untuk mempercepat pengembangan
- Konsultasi intensif dengan Advisor tentang Vue architecture

**Jika harus switch dari Vue mid-project (extreme case):**
- Evaluasi kelayakan terlebih dahulu, hanya boleh dilakukan jika masih di minggu ke-2 atau ke-3
- Eskalasi ke Tim Asah dan Advisor untuk guidance
- Tidak direkomendasikan, sebaiknya sederhanakan implementasi Vue daripada mengganti framework sepenuhnya

#### Skenario 3: Ketinggalan Deadline

**Jika tertinggal 1-2 hari:**
- Lembur dan fokus penuh menyelesaikan
- Minta extension ke Tim Asah dengan alasan jelas (if possible)

**Jika tertinggal >3 hari:**
- Pivot ke minimum viable product (MVP minimal)
- Dokumentasikan fitur yang tidak sempat dibuat sebagai "future work"
- Fokus pada fitur inti: Registrasi + Timeline (lewati fitur Dokumen jika perlu)

#### Skenario 4: Technical Failure Total

**Jika deployment Vue gagal total:**
- Submit video demo dari local environment (npm run dev)
- Sertakan dokumentasi lengkap tentang cara run locally
- Explain technical challenge yang dihadapi di Project Brief

**Jika database corrupt:**
- Restore dari backup terakhir
- Recreate data dummy untuk demo

**Jika Vue build error di production:**
- Check Vite config dan environment variables
- Rollback to last working commit
- Deploy previous stable version
- Debug build locally first dengan npm run build

#### Skenario 5: Integration Issues Vue-Express

**Jika CORS issues persist:**
- Konfigurasikan CORS dengan benar di Express
- Uji API menggunakan Postman terlebih dahulu sebelum diintegrasikan dengan Vue
- Gunakan proxy di konfigurasi Vite untuk keperluan pengembangan (development)

**Jika state synchronization issues:**
- Sederhanakan struktur store Pinia
- Gunakan Vue Query untuk menangani server state, bukan Pinia
- Terapkan optimistic updates dengan hati-hati (untuk menghindari inkonsistensi data)

---

## Kesimpulan

Dokumen Project Plan ini telah disusun untuk memastikan proyek **DC-09 Enhancing Academic Dashboard with Capstone Project Features** dapat diselesaikan tepat waktu dengan kualitas yang baik menggunakan **Vue.js 3** sebagai framework front-end utama. Dengan pembagian tugas yang jelas, jadwal yang terstruktur, risk management yang komprehensif, dan strategi learning Vue.js yang proaktif, tim kami siap untuk menghadapi tantangan dalam 4-5 minggu ke depan.

### Kami berkomitmen untuk:

- Menerapkan best practices dalam software development dengan Vue.js ecosystem
- Berkomunikasi secara transparan dan konsisten
- Menyelesaikan seluruh deliverable tepat waktu
- Menghasilkan produk yang memberikan dampak nyata bagi Dicoding
- Memanfaatkan learning period Vue.js di Week 1 secara maksimal
- Leverage Vue.js advantages: reactivity, composition API, dan excellent tooling

---

**Disusun oleh:**  
Tim Capstone Project A25-CS246  
Program Asah - Dicoding Indonesia x Accenture

**Tanggal Submission:** 31 Oktober 2025
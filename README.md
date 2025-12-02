# 🎓 Dicoding Academic Dashboard - Capstone Project Features

**Tim Capstone Project:** A25-CS246
**Use Case:** DC-09 - Enhancing Academic Dashboard with Capstone Project Features
**Program:** Asah - Dicoding Indonesia x Accenture

## 📋 Deskripsi Project

Sistem dashboard terintegrasi untuk manajemen Capstone Project Dicoding yang melayani 30.000+ peserta. Proyek ini mengintegrasikan fitur-fitur capstone ke dalam Academic Dashboard untuk meningkatkan efisiensi monitoring, validasi tim, dan distribusi informasi.

## 👥 Tim Pengembang

| Nama                    | ID          | Role                               | Learning Path                |
| ----------------------- | ----------- | ---------------------------------- | ---------------------------- |
| Afrizal Ilza Munadhif   | F886D5Y0069 | Project Manager + Full Stack       | Front-End & Back-End with AI |
| Deby Maulida            | F891D5X0445 | Front-End Lead + UI/UX Designer    | Front-End & Back-End with AI |
| Ganza Wajendra Ekasakti | F268D5Y0679 | Back-End Lead + Database Architect | Front-End & Back-End with AI |
| Marsa Ardita            | F891D5X1077 | Full Stack Developer               | Front-End & Back-End with AI |
| Muhammad Rizky          | F295D5Y1370 | Full Stack Developer + DevOps      | Front-End & Back-End with AI |

## ✨ Fitur Utama (MVP)

### 1. 📝 Registrasi Tim Capstone

- Form pendaftaran tim dengan validasi otomatis
- Validasi komposisi learning path sesuai ketentuan
- Admin dashboard untuk approve/reject tim
- Status tracking pengajuan tim

### 2. 📚 Informasi Dokumen Capstone

- Repository terpusat untuk dokumen panduan
- Upload/download dokumen (admin/siswa)
- Kategorisasi dokumen berdasarkan jenis
- Search dan filter dokumen

### 3. 📅 Timeline Capstone

- Visualisasi milestone dan deadline
- Highlight deadline terdekat
- Status overdue tracking
- Calendar view untuk semua aktivitas

### 4. 👤 Profile Management

- Google OAuth authentication
- Profile picture upload ke Cloudinary
- Learning path management
- University information

### 5. 📧 Team Invitations

- Automatic invitation creation
- Email notifications
- Accept/reject workflow
- Invitation tracking

### 6. � Worksheet/Check-in

- Bi-weekly progress check-in
- Evidence submission
- Admin validation
- Status tracking

## �🛠️ Tech Stack

### Front-End

- **Framework:** Vue.js 3 (Composition API)
- **Build Tool:** Vite 5
- **Routing:** Vue Router 4
- **State Management:** Pinia
- **Styling:** Tailwind CSS 3
- **HTTP Client:** Axios
- **Utilities:** VueUse
- **Data Fetching:** Vue Query (TanStack Query)
- **Testing:** Vitest + @vue/test-utils

### Back-End

- **Framework:** Express.js 4
- **Database:** MongoDB 7
- **ODM:** Mongoose 8
- **Authentication:** JWT + Bcrypt
- **File Upload:** Multer
- **Validation:** Joi
- **CORS:** CORS middleware

### DevOps & Tools

- **Version Control:** GitHub
- **CI/CD:** GitHub Actions
- **Front-End Hosting:** Vercel
- **Back-End Hosting:** Railway
- **API Testing:** Postman
- **Design:** Figma
- **Code Quality:** ESLint + Prettier

## 📁 Struktur Project

```
A25-CS246/
├── frontend/                 # Vue.js Application
│   ├── src/
│   │   ├── assets/          # Images, fonts, static files
│   │   ├── components/      # Reusable Vue components
│   │   ├── views/           # Page components
│   │   ├── router/          # Vue Router configuration
│   │   ├── stores/          # Pinia stores
│   │   ├── composables/     # Composition functions
│   │   ├── utils/           # Helper functions
│   │   ├── services/        # API services
│   │   ├── App.vue          # Root component
│   │   └── main.js          # Entry point
│   ├── public/              # Public static files
│   ├── tests/               # Unit & integration tests
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── backend/                 # Express.js API
│   ├── src/
│   │   ├── config/          # Configuration files
│   │   ├── models/          # Mongoose models
│   │   ├── controllers/     # Route controllers
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Custom middleware
│   │   ├── utils/           # Helper functions
│   │   ├── validators/      # Joi validators
│   │   └── server.js        # Entry point
│   ├── tests/               # API tests
│   ├── uploads/             # Uploaded files (gitignored)
│   └── package.json
│
├── docs/                    # Documentation
│   ├── api/                 # API documentation
│   ├── design/              # Design files & wireframes
│   └── reports/             # Progress reports
│
├── .github/                 # GitHub configuration
│   ├── workflows/           # CI/CD workflows
│   └── PULL_REQUEST_TEMPLATE.md
│
├── .gitignore
├── README.md
├── ProjectPlan.md
└── BRANCHING_STRATEGY.md
```

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.x
- npm >= 9.x
- MongoDB >= 7.x
- Git

### Installation

#### 1. Clone Repository

```bash
git clone https://github.com/[username]/A25-CS246.git
cd A25-CS246
```

#### 2. Setup Front-End

```bash
cd frontend
npm install
cp .env.example .env
# Edit .env dengan konfigurasi Anda
npm run dev
```

Front-end akan berjalan di `http://localhost:5173`

#### 3. Setup Back-End

```bash
cd backend
npm install
cp .env.example .env
# Edit .env dengan konfigurasi MongoDB dan JWT secret
npm run dev
```

Back-end akan berjalan di `http://localhost:3000`

## 📝 Environment Variables

### Front-End (.env)

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

### Back-End (.env)

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/dicoding-capstone
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=7d
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

## 🔄 Branching Strategy

Kami menggunakan **Git Flow** dengan struktur:

- `main` - Production-ready code
- `develop` - Development branch
- `feature/*` - Feature branches
- `bugfix/*` - Bug fix branches
- `hotfix/*` - Hotfix branches

Lihat [BRANCHING_STRATEGY.md](./BRANCHING_STRATEGY.md) untuk detail lengkap.

## 🧪 Testing

### Front-End Testing

```bash
cd frontend
npm run test          # Run unit tests
npm run test:ui       # Run tests with UI
npm run coverage      # Generate coverage report
```

### Back-End Testing

```bash
cd backend
npm run test          # Run API tests
npm run test:watch    # Run tests in watch mode
```

## 📦 Build & Deployment

### Build Front-End

```bash
cd frontend
npm run build         # Build untuk production
npm run preview       # Preview production build
```

### Build Back-End

```bash
cd backend
npm run build         # Jika menggunakan TypeScript
npm start             # Run production server
```

### Deployment

- **Front-End:** Auto-deploy ke Vercel via GitHub integration
- **Back-End:** Auto-deploy ke Railway via GitHub integration

## 📚 Documentation

- [Project Plan](./ProjectPlan.md) - Rencana lengkap proyek
- [Roadmap](./ROADMAP.md) - Project roadmap & timeline
- [API Documentation](./docs/api/API_REFERENCE.md) - Complete API reference
- [Developer Setup](./docs/01-getting-started/DEVELOPER_SETUP.md) - Local development guide
- [Branching Strategy](./BRANCHING_STRATEGY.md) - Git workflow
- [Design Files](./docs/design/) - Figma wireframes & mockups
- [Full Documentation](./docs/README.md) - Complete documentation index

## 🤝 Contributing

### Pull Request Process

1. Create feature branch dari `develop`

   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/nama-fitur
   ```

2. Commit changes dengan conventional commits

   ```bash
   git commit -m "feat: add registration form validation"
   ```

3. Push dan create Pull Request

   ```bash
   git push origin feature/nama-fitur
   ```

4. Request review dari minimal 1 team member
5. Merge setelah approved dan CI/CD passed

### Commit Convention

Gunakan [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - Fitur baru
- `fix:` - Bug fix
- `docs:` - Dokumentasi
- `style:` - Formatting, tidak mengubah logic
- `refactor:` - Refactoring code
- `test:` - Menambah/update tests
- `chore:` - Maintenance tasks

## 📅 Timeline

| Week | Periode         | Fokus                     |
| ---- | --------------- | ------------------------- |
| W1   | 31 Okt - 6 Nov  | Planning & Setup          |
| W2   | 7 Nov - 13 Nov  | Registrasi Tim Feature    |
| W3   | 14 Nov - 20 Nov | Informasi Dokumen Feature |
| W4   | 21 Nov - 27 Nov | Timeline Feature          |
| W5   | 28 Nov - 4 Des  | Testing & Deployment      |
| W6   | 5 Des - 15 Des  | Finalisasi & Deliverables |

**Submission Deadlines:**

- ✅ Project Plan: 31 Oktober 2025
- 📝 Laporan Kemajuan: 18 November 2025
- 🔄 360 Feedback: 13-15 Desember 2025
- 🎯 Final Deliverables: 15 Desember 2025

## 📞 Contact

**Ketua Tim:** Afrizal Ilza Munadhif
**Email:** asah@dicoding.com
**WhatsApp:** 0856-5945-2688

## 📄 License

This project is developed for educational purposes as part of Dicoding's Asah Program in association with Accenture.

---

**Made with ❤️ by Tim A25-CS246**
_Dicoding Indonesia x Accenture - Asah Program 2025_

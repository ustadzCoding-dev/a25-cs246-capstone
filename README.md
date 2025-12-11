# 🎓 DC-09 Capstone Project Management System

**Sistem manajemen capstone project terintegrasi** untuk Dicoding Academy dengan fitur team management, document repository, timeline tracking, dan announcement system.

**Status:** ✅ Production Ready (v1.0.1) | **Last Updated:** December 11, 2025 | **Repository:** [GitHub](https://github.com/ustadzCoding/A25-CS246)

**Latest Release:** [v1.0.1](./CHANGELOG.md#101---2025-12-11) - MongoDB replicaSet support, SMTP improvements, rate limiting fixes

---

## 📖 Quick Navigation

### For Different Roles

| Role             | Start Here             | Key Features                                                                                                               |
| ---------------- | ---------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| **👨‍🎓 Student**   | [SETUP.md](./SETUP.md) | Register team, view documents, check timeline, accept invitations                                                          |
| **👨‍💼 Admin**     | [SETUP.md](./SETUP.md) | Approve teams, manage documents, create announcements, view stats                                                          |
| **👨‍💻 Developer** | [SETUP.md](./SETUP.md) | [Architecture](./docs/ARCHITECTURE.md), [API Docs](http://localhost:8000/api-docs), [Contributing](./docs/CONTRIBUTING.md) |

### Documentation Quick Links

| Document                                        | Purpose                               |
| ----------------------------------------------- | ------------------------------------- |
| [SETUP.md](./SETUP.md)                          | Installation & environment setup      |
| [ARCHITECTURE.md](./docs/ARCHITECTURE.md)       | System design, data flows, tech stack |
| [DATABASE_SCHEMA.md](./docs/DATABASE_SCHEMA.md) | 14 MongoDB models documentation       |
| [API_REFERENCE.md](./docs/API_REFERENCE.md)     | All API endpoints with examples       |
| [USER_GUIDE.md](./docs/USER_GUIDE.md)           | Student & Admin user manual           |
| [DEVELOPER_GUIDE.md](./docs/DEVELOPER_GUIDE.md) | Development setup & code structure    |
| [DEPLOYMENT.md](./docs/DEPLOYMENT.md)           | Production deployment guide           |
| [CONTRIBUTING.md](./docs/CONTRIBUTING.md)       | Git workflow, commit conventions      |
| [TESTING.md](./docs/TESTING.md)                 | Testing & QA procedures               |
| [TROUBLESHOOTING.md](./docs/TROUBLESHOOTING.md) | Common issues & solutions             |
| [SECURITY.md](./docs/SECURITY.md)               | Security best practices               |
| [CHANGELOG.md](./CHANGELOG.md)                  | Version history & release notes       |
| [GLOSSARY.md](./docs/GLOSSARY.md)               | Terms & definitions                   |

---

## 🚀 Quick Start (5 Minutes)

### Prerequisites

```bash
✅ Node.js 18+ LTS
✅ npm 9+
✅ MongoDB 7+ (local atau MongoDB Atlas)
✅ Git 2.40+
```

### Installation Steps

```bash
# 1️⃣ Clone repository
git clone https://github.com/ustadzCoding/A25-CS246.git
cd A25-CS246

# 2️⃣ Setup Backend
cd backend
npm install
cp .env.example .env
# Edit .env dengan credentials Anda

# 3️⃣ Setup Frontend
cd ../frontend
npm install
cp .env.example .env

# 4️⃣ Run Development Servers
# Terminal 1 - Backend (port 8000)
cd backend && npm run dev

# Terminal 2 - Frontend (port 5173)
cd frontend && npm run dev
```

### Access Points

| Service          | URL                              | Purpose                       |
| ---------------- | -------------------------------- | ----------------------------- |
| **Frontend**     | http://localhost:5173            | Web application               |
| **Backend API**  | http://localhost:8000            | REST API                      |
| **Swagger Docs** | http://localhost:8000/api-docs   | Interactive API documentation |
| **Health Check** | http://localhost:8000/api/health | API status                    |

---

## 📋 Table of Contents

1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Architecture Overview](#architecture-overview)
5. [Getting Started](#getting-started)
6. [Development](#development)
7. [Deployment](#deployment)
8. [Team](#team)
9. [Contributing](#contributing)
10. [License](#license)

---

## ✨ Features

### MVP Features (v1.0.0) ✅

#### 👥 Team Management

- ✅ **Dynamic Team Registration** - Students create teams with auto-fetched learning paths
- ✅ **Composition Validation** - Automatic validation of team member learning path counts
- ✅ **Member Invitations** - Auto-generated invitations with email notifications
- ✅ **Accept/Reject Flow** - Members can accept or reject invitations
- ✅ **Team Editing** - Leader can edit team members before admin approval
- ✅ **Admin Approval Workflow** - Admin validates composition and approves teams
- ✅ **Rejection with Reason** - Admin can reject with detailed feedback
- ✅ **Team ID Assignment** - Admin assigns unique capstone group IDs
- ✅ **Bulk Operations** - Bulk approve/reject/delete teams
- ✅ **CSV Export** - Export team data to CSV

#### 📄 Document Management

- ✅ **Document Repository** - Centralized storage for capstone guidance documents
- ✅ **File Upload** - Admin uploads documents (via Cloudinary)
- ✅ **External Links** - Support for external document links
- ✅ **Document Categories** - Organize documents by category
- ✅ **Student Access** - Students can view and download documents
- ✅ **Document Metadata** - Title, description, file size, type

#### 📅 Timeline Management

- ✅ **Milestone Creation** - Admin creates capstone project milestones
- ✅ **Deadline Tracking** - Visual timeline with status indicators
- ✅ **Status Indicators** - Upcoming, ongoing, completed milestones
- ✅ **Edit & Delete** - Admin can update or remove milestones

#### 📢 Announcements

- ✅ **Create Announcements** - Admin broadcasts messages to all students
- ✅ **Announcement Types** - Info, warning, success, error
- ✅ **Edit & Delete** - Admin can update or remove announcements
- ✅ **Student View** - Students see announcements on dashboard

#### 🔐 Authentication & Authorization

- ✅ **Email/Password Login** - Standard authentication
- ✅ **Google OAuth** - Sign in with Google
- ✅ **JWT Tokens** - Secure token-based authentication
- ✅ **Role-Based Access** - Student, Admin, Mentor roles
- ✅ **Email Verification** - Verify email ownership
- ✅ **Password Hashing** - Bcrypt encryption

#### 📊 Dashboard & Analytics

- ✅ **Admin Dashboard** - View team statistics
- ✅ **Student Dashboard** - View personal team info
- ✅ **Statistics** - Pending, approved, rejected team counts
- ✅ **Quick Actions** - Fast access to common tasks

### Phase 2 Features (Planned Q2 2026) 🔄

- 🔄 **Worksheet Feature** - Team check-in system with auto-validation
- 🔄 **360-Degree Feedback** - Peer evaluation system
- 🔄 **Advanced Analytics** - Team performance metrics
- 🔄 **Real-time Notifications** - Push & email alerts
- 🔄 **Mentor Role** - Mentor assignment & monitoring

### Phase 3 Features (Planned Q3 2026) 📋

- 📋 **Team Communication** - Internal messaging & discussion board
- 📋 **Performance Tracking** - Contribution metrics & leaderboard
- 📋 **Mobile App** - iOS/Android native apps
- 📋 **Advanced Reporting** - Custom reports & data visualization

---

## 🛠️ Tech Stack

### Frontend

| Technology       | Version | Purpose                          |
| ---------------- | ------- | -------------------------------- |
| **Vue.js**       | 3.x     | Progressive JavaScript framework |
| **Vite**         | 5.x     | Next generation build tool       |
| **Tailwind CSS** | 3.x     | Utility-first CSS framework      |
| **Pinia**        | 2.x     | State management                 |
| **Vue Router**   | 4.x     | Client-side routing              |
| **Axios**        | 1.x     | HTTP client                      |
| **Lucide Vue**   | Latest  | Icon library                     |

### Backend

| Technology     | Version | Purpose              |
| -------------- | ------- | -------------------- |
| **Express.js** | 4.x     | Web framework        |
| **Node.js**    | 18+ LTS | JavaScript runtime   |
| **MongoDB**    | 7.x     | NoSQL database       |
| **Mongoose**   | 8.x     | MongoDB ODM          |
| **JWT**        | Latest  | Token authentication |
| **Bcrypt**     | 5.x     | Password hashing     |
| **Multer**     | 1.x     | File upload handling |
| **Cloudinary** | Latest  | Cloud file storage   |
| **Nodemailer** | 6.x     | Email service        |
| **Swagger**    | 3.x     | API documentation    |

### Infrastructure

| Service              | Provider      | Purpose             |
| -------------------- | ------------- | ------------------- |
| **Frontend Hosting** | Vercel        | Frontend deployment |
| **Backend Hosting**  | Railway       | Backend deployment  |
| **Database**         | MongoDB Atlas | Cloud database      |
| **File Storage**     | Cloudinary    | Cloud storage       |
| **Email**            | Gmail SMTP    | Email service       |
| **OAuth**            | Google        | Social login        |

---

## 📁 Project Structure

```
A25-CS246/
├── 📂 backend/                      # Express.js backend
│   ├── src/
│   │   ├── config/                  # Configuration files
│   │   ├── models/                  # MongoDB schemas (14 models)
│   │   ├── controllers/             # Route handlers (13 controllers)
│   │   ├── services/                # Business logic (6 services)
│   │   ├── middleware/              # Express middleware (12 files)
│   │   ├── routes/                  # API routes (50+ endpoints)
│   │   ├── docs/                    # API documentation
│   │   ├── utils/                   # Utility functions (7 files)
│   │   ├── tests/                   # Test files (4 files)
│   │   └── server.js                # Entry point
│   ├── package.json
│   └── .env.example
│
├── 📂 frontend/                     # Vue 3 + Vite frontend
│   ├── src/
│   │   ├── components/              # Reusable components (28 files)
│   │   ├── views/                   # Page components (27 files)
│   │   ├── stores/                  # Pinia state management (8 stores)
│   │   ├── services/                # API services (10 files)
│   │   ├── router/                  # Vue Router configuration
│   │   ├── composables/             # Composition functions (5 files)
│   │   ├── utils/                   # Utility functions
│   │   ├── assets/                  # Static assets
│   │   ├── tests/                   # Test files (3 files)
│   │   └── main.js                  # Entry point
│   ├── package.json
│   └── .env.example
│
├── 📂 docs/                         # Documentation (14 files)
│   ├── ARCHITECTURE.md              # System design
│   ├── DATABASE_SCHEMA.md           # Database models
│   ├── API_REFERENCE.md             # API documentation
│   ├── USER_GUIDE.md                # User manual
│   ├── DEVELOPER_GUIDE.md           # Development guide
│   ├── DEPLOYMENT.md                # Deployment guide
│   ├── CONTRIBUTING.md              # Contributing guidelines
│   ├── TESTING.md                   # Testing guide
│   ├── TROUBLESHOOTING.md           # Troubleshooting
│   ├── SECURITY.md                  # Security practices
│   ├── GLOSSARY.md                  # Terms & definitions
│   ├── PROJECT_PLAN.md              # Project planning
│   ├── DATABASE_SCHEMA.png          # ERD diagram
│   └── a25-cs246.json               # Project data
│
├── 📂 .github/                      # GitHub configuration
│   ├── ISSUE_TEMPLATE/
│   ├── PULL_REQUEST_TEMPLATE.md
│   └── workflows/                   # CI/CD pipelines
│
├── CHANGELOG.md                     # Version history
├── LICENSE                          # MIT License
├── SETUP.md                         # Quick setup guide
└── package.json                     # Root package config
```

---

## 🏗️ Architecture Overview

### System Architecture

```
┌─────────────────────────────────────────────────────┐
│                    CLIENT LAYER                     │
│  ┌──────────────────────────────────────────────┐   │
│  │  Web Browser (Vue 3 + Vite)                  │   │
│  │  - Student Dashboard                        │   │
│  │  - Team Management                          │   │
│  │  - Document Repository                      │   │
│  │  - Timeline & Announcements                 │   │
│  │  - Admin Panel                              │   │
│  └──────────────────────────────────────────────┘   │
└────────────────────┬────────────────────────────────┘
                     │ HTTPS/REST API
                     │
┌────────────────────▼────────────────────────────────┐
│                  API LAYER                          │
│  ┌──────────────────────────────────────────────┐   │
│  │  Express.js Server (Node.js)                 │   │
│  │  - 50+ REST API Endpoints                    │   │
│  │  - JWT Authentication                       │   │
│  │  - Input Validation & Error Handling        │   │
│  │  - Business Logic & Services                │   │
│  │  - Swagger/OpenAPI Documentation            │   │
│  └──────────────────────────────────────────────┘   │
└────────────────────┬────────────────────────────────┘
                     │
        ┌────────────┼────────────┐
        │            │            │
        ▼            ▼            ▼
┌──────────────┐ ┌──────────┐ ┌──────────┐
│  MongoDB     │ │Cloudinary│ │  Gmail   │
│  (Database)  │ │(Storage) │ │ (Email)  │
└──────────────┘ └──────────┘ └──────────┘
```

---

## 🚀 Getting Started

### For Students

1. **Register Account** - Go to http://localhost:5173, click "Register", select learning path
2. **Create/Join Team** - Go to "Tim Saya", click "Daftar Tim Baru", select use case, add members
3. **Accept Invitations** - Check "Tim Saya" for pending invitations, click "Accept" or "Reject"
4. **View Documents & Timeline** - Go to "Dokumen" and "Timeline" to see project information

### For Admins

1. **Login as Admin** - Use admin credentials to access admin dashboard
2. **Manage Teams** - View pending teams, approve/reject, assign team IDs
3. **Manage Documents** - Upload guidance documents, organize by category
4. **Create Timeline & Announcements** - Add milestones and broadcast messages

### For Developers

1. **Setup Development Environment** - Follow [SETUP.md](./SETUP.md)
2. **Understand Architecture** - Read [ARCHITECTURE.md](./docs/ARCHITECTURE.md)
3. **Follow Development Guidelines** - Read [CONTRIBUTING.md](./docs/CONTRIBUTING.md)
4. **Run Tests & Verify** - Run `npm test` and check Swagger UI

---

## 🚢 Deployment

### Frontend (Vercel)

```bash
# Automatic deployment on push to main
# Manual deployment:
vercel deploy --prod
```

### Backend (Railway)

```bash
# Automatic deployment on push to main
# Manual deployment:
railway deploy
```

### Database (MongoDB Atlas)

- Automatic backups every 5 minutes
- 35-day backup retention
- Point-in-time restore capability

See [DEPLOYMENT.md](./docs/DEPLOYMENT.md) for detailed instructions.

---

## 👥 Team

| Name                        | Role                         | Responsibility                           |
| --------------------------- | ---------------------------- | ---------------------------------------- |
| **Afrizal Ilza Munadhif**   | Project Manager + Full Stack | Overall project management, architecture |
| **Deby Maulida**            | Frontend Lead + UI/UX        | Frontend development, UI/UX design       |
| **Ganza Wajendra Ekasakti** | Backend Lead + Database      | Backend development, database design     |
| **Marsa Ardita**            | Full Stack                   | Documents & features implementation      |
| **Muhammad Rizky**          | Full Stack + DevOps          | Timeline, deployment, infrastructure     |

---

## 🤝 Contributing

We welcome contributions! Please read [CONTRIBUTING.md](./docs/CONTRIBUTING.md) for:

- **Git Flow Strategy** - How to branch and merge
- **Commit Conventions** - How to write commit messages
- **Pull Request Process** - How to submit PRs
- **Code Review Checklist** - What we look for in reviews
- **Coding Standards** - JavaScript & Vue best practices
- **Testing Requirements** - Unit & integration tests

---

## 📄 License

This project is licensed under the **MIT License** - see [LICENSE](./LICENSE) file for details.

---

## 📞 Support & Contact

- **Issues:** [GitHub Issues](https://github.com/ustadzCoding/A25-CS246/issues)
- **Discussions:** [GitHub Discussions](https://github.com/ustadzCoding/A25-CS246/discussions)
- **Email:** asah@dicoding.com

---

## 🎯 Project Status

| Aspect               | Status         | Details                                  |
| -------------------- | -------------- | ---------------------------------------- |
| **MVP Development**  | ✅ Complete    | v1.0.0 ready for production              |
| **Documentation**    | ✅ Complete    | 14 comprehensive documents               |
| **Testing**          | 🟡 In Progress | Unit & integration tests                 |
| **Deployment**       | ✅ Ready       | Vercel (frontend), Railway (backend)     |
| **Phase 2 Planning** | 📋 Planned     | Q2 2026 - Worksheet, Feedback, Analytics |

---

## 🔗 Quick Links

- **GitHub Repository:** https://github.com/ustadzCoding/A25-CS246
- **Project Plan:** [PROJECT_PLAN.md](./docs/PROJECT_PLAN.md)
- **Swagger API Docs:** http://localhost:8000/api-docs

---

**Last Updated:** December 8, 2025 | **Version:** 1.0.0 | **Maintained by:** A25-CS246 Team

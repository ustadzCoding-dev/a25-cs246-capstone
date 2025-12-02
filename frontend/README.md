# 🎓 Frontend - Dicoding Kampus Merdeka

Platform manajemen tim Kampus Merdeka Dicoding Indonesia - Tim A25-CS246

## 🛠️ Tech Stack

- **Vue 3.5.22** - Progressive JavaScript framework (Composition API)
- **Vite 7.1.14** - Next generation frontend tooling (rolldown-vite)
- **Vue Router 4.6.3** - Official routing library with navigation guards
- **Pinia 3.0.4** - Intuitive state management
- **Axios 1.13.2** - Promise-based HTTP client
- **Tailwind CSS 3.4.1** - Utility-first CSS framework
- **SweetAlert2** - Beautiful alerts & modals
- **VueUse** - Vue 3 composition utilities

## 📦 Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Update .env with your backend API URL
# VITE_API_BASE_URL=http://localhost:8000/api
```

## 🚀 Development

```bash
# Start dev server (http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
frontend/
├── public/                 # Static assets (logo, favicon)
├── src/
│   ├── components/ (26 components)
│   │   ├── base/          # Base components (13)
│   │   │   ├── BaseInput.vue
│   │   │   ├── BaseButton.vue
│   │   │   ├── BaseModal.vue
│   │   │   ├── BaseSelect.vue
│   │   │   ├── BaseTable.vue
│   │   │   ├── BaseCard.vue
│   │   │   ├── BaseAlert.vue
│   │   │   ├── BaseLoader.vue
│   │   │   ├── BaseCheckbox.vue
│   │   │   ├── BaseRadio.vue
│   │   │   ├── BaseTextarea.vue
│   │   │   ├── BaseFile.vue
│   │   │   └── BasePagination.vue
│   │   ├── display/       # Display components (9)
│   │   │   ├── StatsCard.vue
│   │   │   ├── TeamInfoCard.vue
│   │   │   ├── DocumentCard.vue
│   │   │   ├── TimelineCard.vue
│   │   │   ├── AnnouncementCard.vue
│   │   │   ├── WorksheetCard.vue
│   │   │   ├── UserAvatar.vue
│   │   │   ├── StatusBadge.vue
│   │   │   └── EmptyState.vue
│   │   ├── modals/        # Modal components (4)
│   │   │   ├── EditTeamModal.vue
│   │   │   ├── ConfirmModal.vue
│   │   │   ├── FormModal.vue
│   │   │   └── ImagePreviewModal.vue
│   │   └── layout/        # Layout components (3)
│   │       ├── AuthLayout.vue
│   │       ├── DashboardLayout.vue
│   │       └── Sidebar.vue
│   ├── views/ (22 pages)
│   │   ├── auth/
│   │   │   ├── LoginPage.vue
│   │   │   ├── SignUpPage.vue
│   │   │   └── AuthCallback.vue
│   │   ├── dashboard/
│   │   │   ├── AdminDashboard.vue
│   │   │   └── StudentDashboard.vue
│   │   ├── team/
│   │   │   ├── StudentTeam.vue
│   │   │   ├── AdminTeamManagement.vue
│   │   │   └── TeamRegistrationForm.vue
│   │   ├── documents/
│   │   │   ├── StudentDocuments.vue
│   │   │   └── AdminDocuments.vue
│   │   ├── timeline/
│   │   │   ├── StudentTimeline.vue
│   │   │   └── AdminTimeline.vue
│   │   ├── announcements/
│   │   │   ├── StudentAnnouncements.vue
│   │   │   └── AdminAnnouncements.vue
│   │   ├── worksheet/
│   │   │   ├── StudentWorksheet.vue
│   │   │   └── AdminWorksheet.vue
│   │   ├── profile/
│   │   │   ├── ProfilePage.vue
│   │   │   └── ProfileComplete.vue
│   │   ├── usecase/
│   │   │   └── AdminUseCase.vue
│   │   ├── admin/
│   │   │   └── AdminLearningPaths.vue
│   │   ├── invitations/
│   │   │   └── InvitationResponse.vue
│   │   └── NotFound.vue
│   ├── router/
│   │   └── index.js       # Vue Router with auth guards
│   ├── stores/ (8 stores)
│   │   ├── authStore.js   # Authentication state
│   │   ├── teamStore.js   # Team management state
│   │   ├── documentStore.js
│   │   ├── timelineStore.js
│   │   ├── announcementStore.js
│   │   ├── worksheetStore.js
│   │   ├── usecaseStore.js
│   │   └── index.js       # Pinia instance
│   ├── services/ (10 services)
│   │   ├── api.js         # Axios instance with interceptors
│   │   ├── authService.js # Auth API calls
│   │   ├── teamService.js # Team API calls
│   │   ├── documentService.js
│   │   ├── timelineService.js
│   │   ├── announcementService.js
│   │   ├── worksheetService.js
│   │   ├── usecaseService.js
│   │   ├── profilePictureService.js
│   │   └── learningPathService.js
│   ├── composables/ (5 composables)
│   │   ├── useStudentMenu.js
│   │   ├── useAdminMenu.js
│   │   ├── useAuth.js
│   │   ├── useForm.js
│   │   └── useNotification.js
│   ├── App.vue            # Root component
│   ├── main.js            # Entry point
│   └── style.css          # Global styles (Tailwind)
├── .env                   # Environment variables (gitignored)
├── .env.example           # Environment variables template
├── index.html             # HTML entry point
├── vite.config.js         # Vite configuration
├── tailwind.config.js     # Tailwind CSS configuration
├── postcss.config.js      # PostCSS configuration
└── package.json           # Dependencies and scripts
```

## 🔧 Environment Variables

Create `.env` file in the root directory:

```env
# Backend API URL
VITE_API_BASE_URL=http://localhost:8000/api
```

## 🎨 Customizing Colors & Styling

Edit `tailwind.config.js` to customize colors, fonts, and shadows:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        500: '#3b82f6',  // Main blue color
        // Add more shades...
      },
      // Add custom colors...
    },
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
    },
  },
}
```

**After editing:**

1. Save the file
2. Refresh browser (Ctrl + R)
3. Changes will apply automatically (hot reload)

## 🔐 Authentication & Routing

The app uses Vue Router with navigation guards:

- **Public routes:** `/login`, `/signup`
- **Protected routes:** `/dashboard`, `/team`, `/documents`, etc.
- **Admin routes:** `/admin/dashboard`, `/admin/teams`, etc.

Authentication state is managed by Pinia (`authStore.js`).

## 🌐 Available Pages

### Student Pages

- **Dashboard:** `/dashboard` - Overview & statistics
- **Tim Saya:** `/team` - Team management & invitations
- **Dokumen:** `/documents` - Document repository
- **Timeline:** `/timeline` - Milestones & deadlines
- **Pengumuman:** `/announcements` - Announcements
- **Worksheet:** `/worksheet` - Progress check-in
- **Profil:** `/profile` - User profile & settings

### Admin Pages

- **Admin Dashboard:** `/admin/dashboard` - System overview
- **Kelola Tim:** `/admin/teams` - Team approval & management
- **Kelola Dokumen:** `/admin/documents` - Document management
- **Kelola Timeline:** `/admin/timeline` - Timeline management
- **Kelola Pengumuman:** `/admin/announcements` - Announcement management
- **Kelola Worksheet:** `/admin/worksheet` - Worksheet validation
- **Kelola Learning Path:** `/admin/learning-paths` - Learning path setup
- **Kelola Use Case:** `/admin/usecase` - Use case management

### Authentication Pages

- **Login:** `/login` - User login
- **Sign Up:** `/signup` - User registration
- **Auth Callback:** `/auth/callback` - Google OAuth callback
- **Profile Complete:** `/profile/complete` - Google user profile completion

## 📚 Documentation

- [Vue 3 Docs](https://vuejs.org/)
- [Vite Docs](https://vitejs.dev/)
- [Vue Router Docs](https://router.vuejs.org/)
- [Pinia Docs](https://pinia.vuejs.org/)
- [Tailwind CSS Docs](https://tailwindcss.com/)
- [Axios Docs](https://axios-http.com/)

## 🐛 Troubleshooting

### Port already in use

```bash
# Kill all node processes
taskkill /F /IM node.exe

# Or change port in vite.config.js
```

### Tailwind CSS not working

```bash
# Reinstall dependencies
npm install

# Clear cache and restart
npm run dev
```

### Browser showing old cached content

- Hard refresh: `Ctrl + Shift + R`
- Clear browser cache
- Use incognito mode

## 👥 Team

**Tim A25-CS246** - Dicoding Indonesia x Accenture

- **Afrizal** - Frontend Developer
- **Deby** - UI/UX Designer
- **Ganza** - Backend Developer

## 📝 Notes

- Frontend dev server runs on port **5173**
- Backend API runs on port **8000**
- All pages are fully responsive
- Components follow Vue 3 Composition API
- Styling uses Tailwind CSS utility classes

---

**Last Updated:** November 29, 2025

---

## 📚 Additional Resources

- [API Reference](../docs/03-api/API_REFERENCE.md) - Complete API documentation
- [Developer Setup](../docs/01-getting-started/DEVELOPER_SETUP.md) - Detailed setup guide
- [Roadmap](../ROADMAP.md) - Project roadmap & timeline
- [User Guide](../docs/06-user-guides/STUDENT_GUIDE.md) - Student workflow guide

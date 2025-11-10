# 🎓 Frontend - Dicoding Kampus Merdeka

Platform manajemen tim Kampus Merdeka Dicoding Indonesia - Tim A25-CS246

## 🛠️ Tech Stack

- **Vue 3.5.22** - Progressive JavaScript framework (Composition API)
- **Vite 7.1.14** - Next generation frontend tooling (rolldown-vite)
- **Vue Router 4.6.3** - Official routing library with navigation guards
- **Pinia 3.0.4** - Intuitive state management
- **Axios 1.13.2** - Promise-based HTTP client
- **Tailwind CSS 3.4.1** - Utility-first CSS framework

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
# Start dev server (http://localhost:9000)
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
│   ├── components/
│   │   ├── base/          # Base components (13 components)
│   │   │   ├── BaseInput.vue
│   │   │   ├── BaseButton.vue
│   │   │   ├── BaseModal.vue
│   │   │   ├── BaseSelect.vue
│   │   │   ├── BaseTable.vue
│   │   │   └── ...
│   │   ├── display/       # Display components (9 components)
│   │   │   ├── StatsCard.vue
│   │   │   ├── TeamInfoCard.vue
│   │   │   ├── DocumentCard.vue
│   │   │   └── ...
│   │   └── layout/        # Layout components (3 components)
│   │       ├── AuthLayout.vue
│   │       ├── DashboardLayout.vue
│   │       └── Sidebar.vue
│   ├── views/             # Page components
│   │   ├── auth/          # Login, Signup
│   │   ├── dashboard/     # Admin & Student Dashboard
│   │   ├── team/          # Team Management
│   │   ├── documents/     # Document Management
│   │   ├── timeline/      # Timeline Management
│   │   ├── announcements/ # Announcements
│   │   ├── profile/       # User Profile
│   │   └── NotFound.vue
│   ├── router/
│   │   └── index.js       # Vue Router with auth guards
│   ├── stores/
│   │   ├── authStore.js   # Authentication state
│   │   └── index.js       # Pinia instance
│   ├── services/
│   │   ├── api.js         # Axios instance with interceptors
│   │   └── authService.js # Auth API calls
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
- **Dashboard:** `/dashboard`
- **Tim Saya:** `/team`
- **Dokumen:** `/documents`
- **Timeline:** `/timeline`
- **Pengumuman:** `/announcements`
- **Profil:** `/profile`

### Admin Pages
- **Admin Dashboard:** `/admin/dashboard`
- **Kelola Tim:** `/admin/teams`
- **Kelola Dokumen:** `/admin/documents`
- **Kelola Timeline:** `/admin/timeline`
- **Kelola Pengumuman:** `/admin/announcements`

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

- Frontend dev server runs on port **9000**
- Backend API runs on port **8000**
- All pages are fully responsive
- Components follow Vue 3 Composition API
- Styling uses Tailwind CSS utility classes

---

**Last Updated:** November 11, 2025

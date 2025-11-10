# 📁 Frontend Folder Structure

## 🎯 Overview

This document outlines the complete folder structure for the frontend application, organized by feature and component type.

---

## 📂 Directory Structure

```
frontend/
├── public/                          # Static assets
│   ├── favicon.ico
│   └── logo.png
│
├── src/
│   ├── assets/                      # Images, fonts, etc.
│   │   ├── images/
│   │   ├── fonts/
│   │   └── styles/
│   │       └── main.css
│   │
│   ├── components/                  # Reusable components
│   │   ├── base/                    # Base UI components (20 total)
│   │   │   ├── BaseButton.vue       ✅ (already created)
│   │   │   ├── BaseInput.vue        ✅ (already created)
│   │   │   ├── BaseCard.vue         ✅ (already created)
│   │   │   ├── BaseModal.vue        ✅ (already created)
│   │   │   ├── BaseAlert.vue        ✅ (already created)
│   │   │   ├── BaseBadge.vue        ✅ (already created)
│   │   │   ├── BaseSpinner.vue      ✅ (already created)
│   │   │   ├── BaseSelect.vue       ⏳ (to create)
│   │   │   ├── BasePasswordInput.vue ⏳ (to create)
│   │   │   ├── BaseCheckbox.vue     ⏳ (to create)
│   │   │   ├── BaseTextarea.vue     ⏳ (to create)
│   │   │   ├── BaseDatePicker.vue   ⏳ (to create)
│   │   │   ├── BaseFileUpload.vue   ⏳ (to create)
│   │   │   ├── BaseSearch.vue       ⏳ (to create)
│   │   │   └── BaseTable.vue        ⏳ (to create)
│   │   │
│   │   ├── layout/                  # Layout components
│   │   │   ├── Sidebar.vue          ⏳ (to create)
│   │   │   ├── AuthLayout.vue       ⏳ (to create)
│   │   │   ├── DashboardLayout.vue  ⏳ (to create)
│   │   │   ├── Header.vue           ⏳ (optional)
│   │   │   └── Footer.vue           ⏳ (optional)
│   │   │
│   │   ├── display/                 # Display components
│   │   │   ├── StatsCard.vue        ⏳ (to create)
│   │   │   ├── DocumentCard.vue     ⏳ (to create)
│   │   │   ├── TimelineItem.vue     ⏳ (to create)
│   │   │   ├── AnnouncementCard.vue ⏳ (to create)
│   │   │   ├── TeamStatusCard.vue   ⏳ (to create)
│   │   │   ├── TeamInfoCard.vue     ⏳ (to create)
│   │   │   ├── InvitationCard.vue   ⏳ (to create)
│   │   │   ├── DynamicInputList.vue ⏳ (to create)
│   │   │   └── GoogleButton.vue     ⏳ (to create)
│   │   │
│   │   └── modals/                  # Modal components
│   │       ├── AddDocumentModal.vue ⏳ (to create)
│   │       ├── AddTimelineModal.vue ⏳ (to create)
│   │       └── AddAnnouncementModal.vue ⏳ (to create)
│   │
│   ├── views/                       # Page components
│   │   ├── auth/                    # Authentication pages
│   │   │   ├── LoginPage.vue        ⏳ (to create)
│   │   │   └── SignUpPage.vue       ⏳ (to create)
│   │   │
│   │   ├── dashboard/               # Dashboard pages
│   │   │   ├── AdminDashboard.vue   ⏳ (to create)
│   │   │   └── StudentDashboard.vue ⏳ (to create)
│   │   │
│   │   ├── team/                    # Team management pages
│   │   │   ├── TeamManagementPage.vue ⏳ (to create - admin)
│   │   │   ├── MyTeamPage.vue       ⏳ (to create - student)
│   │   │   ├── CreateTeamPage.vue   ⏳ (to create - student)
│   │   │   └── RegisterIndividualPage.vue ⏳ (to create - student)
│   │   │
│   │   ├── documents/               # Document pages
│   │   │   ├── DocumentListPage.vue ⏳ (to create - student)
│   │   │   └── DocumentManagementPage.vue ⏳ (to create - admin)
│   │   │
│   │   ├── timeline/                # Timeline pages
│   │   │   └── TimelinePage.vue     ⏳ (to create - admin & student)
│   │   │
│   │   ├── announcements/           # Announcement pages
│   │   │   └── AnnouncementPage.vue ⏳ (to create - admin & student)
│   │   │
│   │   └── profile/                 # Profile pages
│   │       └── ProfilePage.vue      ⏳ (to create - admin & student)
│   │
│   ├── router/                      # Vue Router configuration
│   │   └── index.js                 ✅ (exists, needs update)
│   │
│   ├── stores/                      # Pinia stores
│   │   ├── authStore.js             ⏳ (to create)
│   │   ├── teamStore.js             ⏳ (to create)
│   │   ├── documentStore.js         ⏳ (to create)
│   │   ├── timelineStore.js         ⏳ (to create)
│   │   └── announcementStore.js     ⏳ (to create)
│   │
│   ├── services/                    # API services
│   │   ├── api.js                   ⏳ (Axios instance)
│   │   ├── authService.js           ⏳ (to create)
│   │   ├── teamService.js           ⏳ (to create)
│   │   ├── documentService.js       ⏳ (to create)
│   │   ├── timelineService.js       ⏳ (to create)
│   │   ├── announcementService.js   ⏳ (to create)
│   │   └── userService.js           ⏳ (to create)
│   │
│   ├── composables/                 # Vue composables
│   │   ├── useAuth.js               ⏳ (optional)
│   │   ├── useTeam.js               ⏳ (optional)
│   │   └── useNotification.js       ⏳ (optional)
│   │
│   ├── utils/                       # Utility functions
│   │   ├── validators.js            ⏳ (form validation)
│   │   ├── formatters.js            ⏳ (date, number formatting)
│   │   └── constants.js             ⏳ (app constants)
│   │
│   ├── App.vue                      ✅ (exists)
│   └── main.js                      ✅ (exists)
│
├── .env.example                     ✅ (exists)
├── .gitignore                       ✅ (exists)
├── index.html                       ✅ (exists)
├── package.json                     ✅ (exists)
├── tailwind.config.js               ✅ (exists)
├── vite.config.js                   ✅ (exists)
└── README.md                        ✅ (exists)
```

---

## 📊 Component Breakdown

### Base Components (15 total)
**Already Created (7):**
- ✅ BaseButton.vue
- ✅ BaseInput.vue
- ✅ BaseCard.vue
- ✅ BaseModal.vue
- ✅ BaseAlert.vue
- ✅ BaseBadge.vue
- ✅ BaseSpinner.vue

**To Create (8):**
- ⏳ BaseSelect.vue
- ⏳ BasePasswordInput.vue
- ⏳ BaseCheckbox.vue
- ⏳ BaseTextarea.vue
- ⏳ BaseDatePicker.vue
- ⏳ BaseFileUpload.vue
- ⏳ BaseSearch.vue
- ⏳ BaseTable.vue

### Layout Components (3)
- ⏳ Sidebar.vue
- ⏳ AuthLayout.vue
- ⏳ DashboardLayout.vue

### Display Components (9)
- ⏳ StatsCard.vue
- ⏳ DocumentCard.vue
- ⏳ TimelineItem.vue
- ⏳ AnnouncementCard.vue
- ⏳ TeamStatusCard.vue
- ⏳ TeamInfoCard.vue
- ⏳ InvitationCard.vue
- ⏳ DynamicInputList.vue
- ⏳ GoogleButton.vue

### Modal Components (3)
- ⏳ AddDocumentModal.vue
- ⏳ AddTimelineModal.vue
- ⏳ AddAnnouncementModal.vue

---

## 📄 Page Breakdown

### Auth Pages (2)
- ⏳ LoginPage.vue
- ⏳ SignUpPage.vue

### Dashboard Pages (2)
- ⏳ AdminDashboard.vue
- ⏳ StudentDashboard.vue

### Team Pages (4)
- ⏳ TeamManagementPage.vue (admin)
- ⏳ MyTeamPage.vue (student)
- ⏳ CreateTeamPage.vue (student)
- ⏳ RegisterIndividualPage.vue (student)

### Document Pages (2)
- ⏳ DocumentListPage.vue (student)
- ⏳ DocumentManagementPage.vue (admin)

### Other Pages (3)
- ⏳ TimelinePage.vue
- ⏳ AnnouncementPage.vue
- ⏳ ProfilePage.vue

---

## 🔄 Services & Stores

### API Services (7)
- ⏳ api.js (Axios instance)
- ⏳ authService.js
- ⏳ teamService.js
- ⏳ documentService.js
- ⏳ timelineService.js
- ⏳ announcementService.js
- ⏳ userService.js

### Pinia Stores (5)
- ⏳ authStore.js
- ⏳ teamStore.js
- ⏳ documentStore.js
- ⏳ timelineStore.js
- ⏳ announcementStore.js

---

## 🎯 Naming Conventions

### Components
- **Base components:** `Base[Name].vue` (e.g., `BaseButton.vue`)
- **Layout components:** `[Name].vue` (e.g., `Sidebar.vue`)
- **Display components:** `[Name]Card.vue` or `[Name]Item.vue`
- **Modal components:** `Add[Name]Modal.vue`

### Pages
- **Page components:** `[Name]Page.vue` (e.g., `LoginPage.vue`)
- **Dashboard components:** `[Role]Dashboard.vue`

### Services
- **Service files:** `[name]Service.js` (e.g., `authService.js`)

### Stores
- **Store files:** `[name]Store.js` (e.g., `authStore.js`)

---

## 📝 File Organization Rules

1. **One component per file**
2. **PascalCase for component names**
3. **camelCase for service/store names**
4. **Group related components in folders**
5. **Keep components small and focused**
6. **Reuse base components everywhere**
7. **Use composition API for all components**
8. **Use Pinia for state management**
9. **Use Axios for API calls**
10. **Follow Vue 3 best practices**

---

## 🚀 Next Steps

1. ✅ Folder structure created
2. ⏳ Create component templates
3. ⏳ Start Day 1 implementation
4. ⏳ Follow implementation plan

---

**Last Updated:** November 10, 2025  
**Status:** Folder structure ready ✅  
**Next:** Create component templates

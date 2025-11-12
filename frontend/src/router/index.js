import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/authStore";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Public Routes
    {
      path: "/login",
      name: "login",
      component: () => import("../views/auth/LoginPage.vue"),
      meta: { requiresGuest: true },
    },
    {
      path: "/signup",
      name: "signup",
      component: () => import("../views/auth/SignUpPage.vue"),
      meta: { requiresGuest: true },
    },
    // Google OAuth Callback Route
    {
      path: "/auth/callback",
      name: "auth-callback",
      component: () => import("../views/auth/AuthCallback.vue"),
      meta: { requiresGuest: true },
    },

    // ========== NEW: PROFILE COMPLETION ROUTE ==========
    {
      path: "/profile/complete",
      name: "profile-complete",
      component: () => import("../views/profile/ProfileComplete.vue"),
      meta: { requiresAuth: true, skipProfileCheck: true },
    },

    // Protected Routes - Admin
    {
      path: "/admin",
      redirect: "/admin/dashboard",
      meta: { requiresAuth: true, requiresAdmin: true },
    },
    {
      path: "/admin/dashboard",
      name: "admin-dashboard",
      component: () => import("../views/dashboard/AdminDashboard.vue"),
      meta: {
        requiresAuth: true,
        requiresAdmin: true,
        title: "Admin Dashboard",
      },
    },
    {
      path: "/admin/teams",
      name: "admin-teams",
      component: () => import("../views/team/AdminTeamManagement.vue"),
      meta: { requiresAuth: true, requiresAdmin: true, title: "Kelola Tim" },
    },
    {
      path: "/admin/documents",
      name: "admin-documents",
      component: () => import("../views/documents/AdminDocuments.vue"),
      meta: {
        requiresAuth: true,
        requiresAdmin: true,
        title: "Kelola Dokumen",
      },
    },
    {
      path: "/admin/timeline",
      name: "admin-timeline",
      component: () => import("../views/timeline/AdminTimeline.vue"),
      meta: {
        requiresAuth: true,
        requiresAdmin: true,
        title: "Kelola Timeline",
      },
    },
    {
      path: "/admin/announcements",
      name: "admin-announcements",
      component: () => import("../views/announcements/AdminAnnouncements.vue"),
      meta: {
        requiresAuth: true,
        requiresAdmin: true,
        title: "Kelola Pengumuman",
      },
    },

    // Protected Routes - Student
    {
      path: "/",
      redirect: "/dashboard",
    },
    {
      path: "/dashboard",
      name: "student-dashboard",
      component: () => import("../views/dashboard/StudentDashboard.vue"),
      meta: { requiresAuth: true, title: "Dashboard" },
    },
    {
      path: "/team",
      name: "student-team",
      component: () => import("../views/team/StudentTeam.vue"),
      meta: { requiresAuth: true, title: "Tim Saya" },
    },
    {
      path: "/documents",
      name: "student-documents",
      component: () => import("../views/documents/StudentDocuments.vue"),
      meta: { requiresAuth: true, title: "Dokumen" },
    },
    {
      path: "/timeline",
      name: "student-timeline",
      component: () => import("../views/timeline/StudentTimeline.vue"),
      meta: { requiresAuth: true, title: "Timeline" },
    },
    {
      path: "/announcements",
      name: "student-announcements",
      component: () =>
        import("../views/announcements/StudentAnnouncements.vue"),
      meta: { requiresAuth: true, title: "Pengumuman" },
    },
    {
      path: "/profile",
      name: "profile",
      component: () => import("../views/profile/ProfilePage.vue"),
      meta: { requiresAuth: true, title: "Profil" },
    },

    // 404 Not Found
    {
      path: "/:pathMatch(.*)*",
      name: "not-found",
      component: () => import("../views/NotFound.vue"),
    },
  ],
});

// Navigation Guards
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  // Check if route requires authentication
  if (to.meta.requiresAuth) {
    if (!authStore.isAuthenticated) {
      // Redirect to login if not authenticated
      next({ name: "login", query: { redirect: to.fullPath } });
      return;
    }

    // ========== NEW: PROFILE COMPLETION CHECK ==========
    // Skip profile check for specific routes
    if (!to.meta.skipProfileCheck) {
      const user = authStore.user;

      // Check if profile is incomplete (for Google OAuth users)
      const isProfileIncomplete =
        user?.provider === "google" &&
        (!user.dicodingId || !user.learningPath || !user.university);

      // Redirect to profile completion if incomplete
      if (isProfileIncomplete) {
        next({ name: "profile-complete" });
        return;
      }
    }

    // Check if route requires admin role
    if (to.meta.requiresAdmin && !authStore.isAdmin) {
      // Redirect to student dashboard if not admin
      next({ name: "student-dashboard" });
      return;
    }
  }

  // Check if route requires guest (not authenticated)
  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    // EXCEPTION: Allow /auth/callback even if authenticated (for Google OAuth flow)
    if (to.name === "auth-callback") {
      next();
      return;
    }

    // Redirect to appropriate dashboard based on role
    if (authStore.isAdmin) {
      next({ name: "admin-dashboard" });
    } else {
      next({ name: "student-dashboard" });
    }
    return;
  }

  next();
});

export default router;

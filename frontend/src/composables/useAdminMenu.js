import { computed } from 'vue'

export const useAdminMenu = () => {
  const adminMenuItems = computed(() => [
    { name: 'Dashboard', icon: 'dashboard', path: '/admin/dashboard', roles: ['admin'] },
    { name: 'Manage Users', icon: 'team', path: '/admin/users', roles: ['admin'] },
    { name: 'Manage Teams', icon: 'team', path: '/admin/teams', roles: ['admin'] },
    { name: 'Learning Paths', icon: 'settings', path: '/admin/learning-paths', roles: ['admin'] },
    { name: 'Documents', icon: 'document', path: '/admin/documents', roles: ['admin'] },
    { name: 'Timelines', icon: 'timeline', path: '/admin/timeline', roles: ['admin'] },
    { name: 'Announcements', icon: 'announcement', path: '/admin/announcements', roles: ['admin'] },
    { name: 'Use Cases', icon: 'settings', path: '/admin/usecase', roles: ['admin'] },
    // { name: 'Worksheet', icon: 'document', path: '/admin/worksheet', roles: ['admin'] }, // DISABLED: Worksheet feature removed
  ])

  return {
    adminMenuItems,
  }
}

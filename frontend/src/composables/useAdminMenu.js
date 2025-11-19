import { computed } from 'vue'

export const useAdminMenu = () => {
  const adminMenuItems = computed(() => [
    { name: 'Dashboard', icon: 'dashboard', path: '/admin/dashboard', roles: ['admin'] },
    { name: 'Kelola Tim', icon: 'team', path: '/admin/teams', roles: ['admin'] },
    { name: 'Dokumen', icon: 'document', path: '/admin/documents', roles: ['admin'] },
    { name: 'Timeline', icon: 'timeline', path: '/admin/timeline', roles: ['admin'] },
    { name: 'Pengumuman', icon: 'announcement', path: '/admin/announcements', roles: ['admin'] },
    { name: 'Use Case', icon: 'settings', path: '/admin/usecase', roles: ['admin'] }
  ])

  return {
    adminMenuItems
  }
}

import { computed } from 'vue'

export const useStudentMenu = () => {
  const studentMenuItems = computed(() => [
    { name: 'Dashboard', icon: 'dashboard', path: '/dashboard', roles: ['student'] },
    { name: 'Capstone Team', icon: 'team', path: '/team', roles: ['student'] },
    { name: 'Worksheet', icon: 'document', path: '/worksheet', roles: ['student'] },
    { name: 'Document', icon: 'document', path: '/documents', roles: ['student'] },
    { name: 'Timeline', icon: 'timeline', path: '/timeline', roles: ['student'] },
    { name: 'Announcement', icon: 'announcement', path: '/announcements', roles: ['student'] },
    { name: 'Profile', icon: 'user', path: '/profile', roles: ['student'] },
  ])

  return {
    studentMenuItems,
  }
}

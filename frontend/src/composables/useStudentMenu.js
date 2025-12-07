import { computed } from 'vue'

export const useStudentMenu = () => {
  const studentMenuItems = computed(() => [
    { name: 'Dashboard', icon: 'dashboard', path: '/dashboard', roles: ['student'] },
    { name: 'Capstone Teams', icon: 'team', path: '/team', roles: ['student'] },
    // { name: 'Worksheets', icon: 'document', path: '/worksheet', roles: ['student'] }, // DISABLED: Worksheet feature removed
    { name: 'Documents', icon: 'document', path: '/documents', roles: ['student'] },
    { name: 'Timelines', icon: 'timeline', path: '/timeline', roles: ['student'] },
    { name: 'Announcements', icon: 'announcement', path: '/announcements', roles: ['student'] },
    { name: 'Profile', icon: 'user', path: '/profile', roles: ['student'] },
  ])

  return {
    studentMenuItems,
  }
}

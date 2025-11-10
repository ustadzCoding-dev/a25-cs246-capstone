# 📝 Component Templates - TODO List

## ✅ COMPLETED (4 components)

1. ✅ BaseSelect.vue
2. ✅ BasePasswordInput.vue
3. ✅ BaseCheckbox.vue
4. ✅ BaseTextarea.vue

---

## ⏳ REMAINING COMPONENTS (16 components)

### Base Components (4 remaining)

#### 5. BaseDatePicker.vue
```vue
Props:
- modelValue: String (date)
- label: String
- placeholder: String
- error: String
- hint: String
- required: Boolean
- disabled: Boolean
- minDate: String
- maxDate: String

Features:
- Date input with calendar picker
- Date formatting (DD/MM/YYYY)
- Min/max date validation
- Clear button
```

#### 6. BaseFileUpload.vue
```vue
Props:
- modelValue: File
- label: String
- accept: String (e.g., 'image/*')
- maxSize: Number (in MB)
- error: String
- hint: String
- required: Boolean
- disabled: Boolean
- preview: Boolean

Features:
- File upload button
- Image preview (if image)
- File size validation
- File type validation
- Drag & drop (optional)
```

#### 7. BaseSearch.vue
```vue
Props:
- modelValue: String
- placeholder: String
- loading: Boolean
- disabled: Boolean

Features:
- Search icon
- Clear button (X)
- Loading spinner
- Debounced input (optional)
```

#### 8. BaseTable.vue
```vue
Props:
- columns: Array
  // [{ key: 'name', label: 'Name', sortable: true }]
- data: Array
- loading: Boolean
- pagination: Object
  // { page: 1, limit: 10, total: 100 }
- sortable: Boolean

Features:
- Table headers
- Sortable columns
- Pagination
- Loading state
- Empty state
- Row actions slot
```

---

### Layout Components (3)

#### 9. Sidebar.vue
```vue
Props:
- menuItems: Array
  // [{ name: 'Dashboard', icon: 'dashboard', path: '/dashboard', role: ['admin', 'student'] }]
- userRole: String

Features:
- Logo at top
- Navigation menu with icons
- Active state highlighting
- User info at bottom
- Logout button
- Responsive (collapse on mobile)
```

#### 10. AuthLayout.vue
```vue
Features:
- Centered card layout
- Header with logo & "Langanan Sekarang" button
- Main content slot
- Footer with copyright
- Background styling
- Responsive design
```

#### 11. DashboardLayout.vue
```vue
Features:
- Sidebar integration
- Main content area
- Header/topbar (optional)
- Breadcrumbs (optional)
- Responsive design
- Mobile menu toggle
```

---

### Display Components (9)

#### 12. StatsCard.vue
```vue
Props:
- icon: String (component name or SVG)
- label: String
- value: Number/String
- change: Number (percentage)
- trend: String ('up' | 'down')
- color: String ('primary' | 'success' | 'warning' | 'danger')

Features:
- Icon display
- Large number/metric
- Label text
- Percentage change with trend arrow
- Color variants
```

#### 13. DocumentCard.vue
```vue
Props:
- title: String
- description: String
- date: String
- link: String
- icon: String

Features:
- Title (bold)
- Description text
- Date with calendar icon
- "Buka Dokumen" link
- Border & rounded corners
- Hover effect
```

#### 14. TimelineItem.vue
```vue
Props:
- title: String
- description: String
- startDate: String
- endDate: String
- canDelete: Boolean

Events:
- @delete

Features:
- Timeline dot (circle)
- Connecting line (CSS)
- Title & description
- Date range with icon
- Delete button (admin only)
```

#### 15. AnnouncementCard.vue
```vue
Props:
- title: String
- content: String
- date: String
- priority: String ('normal' | 'important')
- canDelete: Boolean

Events:
- @delete

Features:
- Megaphone icon
- Title (bold)
- Date
- Content/description
- Priority badge
- Delete button (admin only)
```

#### 16. TeamStatusCard.vue
```vue
Props:
- teamName: String
- leaderName: String
- useCase: String
- status: String
- members: Array

Features:
- Checkmark icon (if active)
- Team name
- Leader name
- Use case display
- Status badge
- Member count
```

#### 17. TeamInfoCard.vue
```vue
Props:
- team: Object
  // { name, leader, useCase, members: [] }

Features:
- Team name & ID
- Leader info
- Use case
- Member list with IDs
- Learning paths
- Checkmark icon
```

#### 18. InvitationCard.vue
```vue
Props:
- invitation: Object
  // { teamName, leader, useCase, members }

Events:
- @accept
- @reject

Features:
- Team details
- Leader name
- Use case
- Member list
- "Terima" button
- "Tolak" button
```

#### 19. DynamicInputList.vue
```vue
Props:
- modelValue: Array<String>
- label: String
- placeholder: String
- addButtonText: String
- maxItems: Number

Events:
- @update:modelValue

Features:
- Multiple input fields
- "+ Tambah Anggota" button
- Delete button for each item
- Validation
- Max items limit
```

#### 20. GoogleButton.vue
```vue
Props:
- text: String ('Sign in with Google' | 'Sign up with Google')
- loading: Boolean

Events:
- @click

Features:
- Google logo
- Button text
- Loading state
- OAuth ready
- Hover effect
```

---

## 📋 IMPLEMENTATION PRIORITY

### Day 1 Morning (Nov 11, 08:00-12:00):
```
✅ BaseSelect
✅ BasePasswordInput
✅ BaseCheckbox
✅ BaseTextarea
⏳ BaseDatePicker
⏳ BaseFileUpload
⏳ BaseSearch
⏳ BaseTable
```

### Day 1 Afternoon (Nov 11, 13:00-17:00):
```
⏳ Sidebar
⏳ AuthLayout
⏳ DashboardLayout
⏳ StatsCard
⏳ DocumentCard
⏳ TimelineItem
```

### Day 1 Evening (Nov 11, 19:00-21:00):
```
⏳ AnnouncementCard
⏳ TeamStatusCard
⏳ TeamInfoCard
⏳ InvitationCard
⏳ DynamicInputList
⏳ GoogleButton
```

---

## 🎯 NEXT STEPS

**Tonight (Nov 10):**
- ✅ Implementation plan created
- ✅ Folder structure created
- ✅ 4 base components created
- ✅ Committed & pushed

**Tomorrow Morning (Nov 11, 08:00):**
1. Create remaining 4 base components
2. Create 3 layout components
3. Create 9 display components
4. Test all components
5. Ready for Day 2 (Auth pages)

---

**Status:** 4/20 components complete (20%)  
**Next:** Create remaining 16 components  
**Timeline:** Day 1 (Nov 11)

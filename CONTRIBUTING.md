# 🤝 Contributing Guidelines - A25-CS246

Terima kasih telah berkontribusi pada proyek Dicoding Academic Dashboard! Dokumen ini berisi panduan untuk berkontribusi dengan efektif.

## 📋 Table of Contents

1. [Getting Started](#getting-started)
2. [Development Workflow](#development-workflow)
3. [Code Standards](#code-standards)
4. [Testing Guidelines](#testing-guidelines)
5. [Commit Guidelines](#commit-guidelines)
6. [Pull Request Process](#pull-request-process)

## 🚀 Getting Started

### Prerequisites

Pastikan Anda sudah menginstall:
- Node.js >= 18.x
- npm >= 9.x
- Git
- MongoDB >= 7.x
- Code editor (VS Code recommended)

### Setup Development Environment

1. **Clone repository**
   ```bash
   git clone https://github.com/[username]/A25-CS246.git
   cd A25-CS246
   ```

2. **Install dependencies**
   ```bash
   # Frontend
   cd frontend
   npm install
   
   # Backend
   cd ../backend
   npm install
   ```

3. **Setup environment variables**
   ```bash
   # Frontend
   cd frontend
   cp .env.example .env
   
   # Backend
   cd ../backend
   cp .env.example .env
   ```

4. **Start development servers**
   ```bash
   # Terminal 1 - Frontend
   cd frontend
   npm run dev
   
   # Terminal 2 - Backend
   cd backend
   npm run dev
   ```

## 🔄 Development Workflow

### 1. Pick a Task

- Check project board untuk available tasks
- Assign task ke diri sendiri
- Move task ke "In Progress"

### 2. Create Branch

```bash
git checkout develop
git pull origin develop
git checkout -b feature/your-feature-name
```

### 3. Develop

- Write code
- Test locally
- Commit frequently

### 4. Submit PR

- Push branch
- Create Pull Request
- Request reviews

### 5. Address Feedback

- Make requested changes
- Push updates
- Re-request review

### 6. Merge

- After approval, merge via GitHub
- Delete branch
- Move task to "Done"

## 📝 Code Standards

### Vue.js (Frontend)

#### Component Structure

```vue
<script setup>
// 1. Imports
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'

// 2. Props
const props = defineProps({
  title: {
    type: String,
    required: true
  }
})

// 3. Emits
const emit = defineEmits(['submit', 'cancel'])

// 4. Composables
const router = useRouter()

// 5. Reactive state
const isLoading = ref(false)
const formData = ref({})

// 6. Computed properties
const isValid = computed(() => {
  return formData.value.name && formData.value.email
})

// 7. Methods
const handleSubmit = () => {
  emit('submit', formData.value)
}

// 8. Lifecycle hooks
onMounted(() => {
  // Initialize
})
</script>

<template>
  <div class="component-name">
    <!-- Template content -->
  </div>
</template>

<style scoped>
/* Component-specific styles */
</style>
```

#### Naming Conventions

- **Components:** PascalCase (`UserProfile.vue`)
- **Props:** camelCase (`userName`)
- **Events:** kebab-case (`user-updated`)
- **Variables:** camelCase (`isLoading`)
- **Constants:** UPPER_SNAKE_CASE (`API_BASE_URL`)

#### Best Practices

✅ **DO:**
- Use Composition API
- Define prop types
- Declare emits explicitly
- Use computed for derived state
- Clean up in onUnmounted
- Keep components small and focused

❌ **DON'T:**
- Manipulate DOM directly
- Use global state for local data
- Mutate props
- Use methods for derived state
- Leave console.log in code

### Express.js (Backend)

#### Route Structure

```javascript
// routes/teams.js
const express = require('express')
const router = express.Router()
const teamController = require('../controllers/teamController')
const { validateTeam } = require('../validators/teamValidator')
const { authenticate } = require('../middleware/auth')

router.post('/', authenticate, validateTeam, teamController.create)
router.get('/', authenticate, teamController.getAll)
router.get('/:id', authenticate, teamController.getById)
router.put('/:id', authenticate, validateTeam, teamController.update)
router.delete('/:id', authenticate, teamController.delete)

module.exports = router
```

#### Controller Pattern

```javascript
// controllers/teamController.js
const Team = require('../models/Team')
const { AppError } = require('../utils/errors')

exports.create = async (req, res, next) => {
  try {
    const team = await Team.create(req.body)
    
    res.status(201).json({
      success: true,
      data: team
    })
  } catch (error) {
    next(error)
  }
}
```

#### Best Practices

✅ **DO:**
- Use async/await
- Validate input with Joi
- Handle errors properly
- Use HTTP status codes correctly
- Keep controllers thin
- Use middleware for common logic

❌ **DON'T:**
- Use callbacks (use async/await)
- Put business logic in routes
- Ignore error handling
- Hardcode values
- Leave sensitive data in responses

## 🧪 Testing Guidelines

### Frontend Testing (Vitest)

```javascript
// tests/components/RegistrationForm.test.js
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import RegistrationForm from '@/components/RegistrationForm.vue'

describe('RegistrationForm', () => {
  it('renders properly', () => {
    const wrapper = mount(RegistrationForm)
    expect(wrapper.find('form').exists()).toBe(true)
  })
  
  it('validates required fields', async () => {
    const wrapper = mount(RegistrationForm)
    await wrapper.find('form').trigger('submit')
    expect(wrapper.find('.error-message').exists()).toBe(true)
  })
})
```

### Backend Testing

```javascript
// tests/api/teams.test.js
const request = require('supertest')
const app = require('../src/app')

describe('POST /api/teams', () => {
  it('should create a new team', async () => {
    const response = await request(app)
      .post('/api/teams')
      .send({
        name: 'Team A',
        members: ['user1', 'user2']
      })
      .expect(201)
    
    expect(response.body.success).toBe(true)
    expect(response.body.data).toHaveProperty('_id')
  })
})
```

### Testing Checklist

- [ ] Unit tests untuk components/functions
- [ ] Integration tests untuk API endpoints
- [ ] Edge cases covered
- [ ] Error scenarios tested
- [ ] Test coverage > 80%

## 💬 Commit Guidelines

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `style:` - Formatting
- `refactor:` - Code refactoring
- `test:` - Tests
- `chore:` - Maintenance

### Examples

```bash
feat(frontend): add registration form validation

- Add email format validation
- Add required field checks
- Display error messages

Closes #123
```

```bash
fix(api): resolve CORS issue in team endpoint

The team endpoint was blocking requests from frontend
due to missing CORS headers.

Fixes #456
```

## 🔍 Pull Request Process

### Before Creating PR

1. **Update your branch**
   ```bash
   git checkout develop
   git pull origin develop
   git checkout feature/your-feature
   git merge develop
   ```

2. **Run tests**
   ```bash
   npm run test
   ```

3. **Run linter**
   ```bash
   npm run lint
   ```

4. **Self-review**
   - Check for console.logs
   - Remove commented code
   - Verify all changes are intentional

### Creating PR

1. **Push your branch**
   ```bash
   git push origin feature/your-feature
   ```

2. **Create PR on GitHub**
   - Use descriptive title
   - Fill out PR template completely
   - Add screenshots for UI changes
   - Link related issues

3. **Request reviews**
   - Tag relevant team members
   - Explain complex changes in comments

### After Creating PR

1. **Respond to feedback**
   - Address all comments
   - Make requested changes
   - Push updates

2. **Keep PR updated**
   - Merge develop if conflicts arise
   - Re-run tests after changes

3. **Merge**
   - Wait for approval
   - Ensure CI passes
   - Use "Squash and merge"

## 🎨 Code Style

### JavaScript/Vue

- Use 2 spaces for indentation
- Use single quotes for strings
- Add semicolons
- Max line length: 100 characters
- Use trailing commas

### CSS/Tailwind

- Use Tailwind utilities first
- Custom CSS only when necessary
- Use scoped styles in components
- Follow BEM naming for custom classes

## 📚 Documentation

### Code Comments

```javascript
// ✅ Good: Explains WHY
// Using debounce to prevent excessive API calls
const debouncedSearch = debounce(search, 300)

// ❌ Bad: Explains WHAT (obvious from code)
// Set loading to true
isLoading.value = true
```

### JSDoc for Functions

```javascript
/**
 * Validates team composition based on learning paths
 * @param {Array} members - Array of team member objects
 * @returns {Object} Validation result with isValid and errors
 */
function validateTeamComposition(members) {
  // Implementation
}
```

## 🐛 Debugging Tips

### Frontend (Vue)

1. Use Vue DevTools
2. Check browser console
3. Verify API responses in Network tab
4. Use `console.log` temporarily (remove before commit)

### Backend (Express)

1. Check server logs
2. Use Postman to test endpoints
3. Verify MongoDB data
4. Use debugger or console.log

## 🆘 Getting Help

### When Stuck

1. **Check documentation**
   - Vue.js docs
   - Express.js docs
   - Project README

2. **Search existing issues**
   - GitHub issues
   - Stack Overflow

3. **Ask the team**
   - WhatsApp group
   - Daily standup
   - Tag in PR comments

4. **Escalate if needed**
   - Contact team lead (Afrizal)
   - Discuss in retrospective

## ✅ Definition of Done

A task is considered "Done" when:

- [ ] Code is written and tested
- [ ] Tests are passing
- [ ] Code is reviewed and approved
- [ ] Documentation is updated
- [ ] PR is merged to develop
- [ ] Task is moved to "Done" column

## 🎯 Quality Standards

### Code Quality

- No linting errors
- Test coverage > 80%
- No console.logs in production code
- Proper error handling
- Meaningful variable names

### Performance

- Bundle size optimized
- Images compressed
- Lazy loading implemented
- API responses < 500ms
- No memory leaks

### Security

- Input validation
- SQL injection prevention
- XSS protection
- Secure authentication
- Environment variables for secrets

## 📞 Contact

Questions about contributing?

- **Team Lead:** Afrizal Ilza Munadhif
- **DevOps:** Muhammad Rizky
- **WhatsApp Group:** [Link]
- **Email:** asah@dicoding.com

---

**Thank you for contributing! 🙏**

*Last updated: 6 November 2025*

# 🤝 Contributing Guide

Panduan untuk berkontribusi pada project DC-09 Capstone Project Management System.

---

## 📋 Table of Contents

1. [Git Flow Strategy](#git-flow-strategy)
2. [Commit Conventions](#commit-conventions)
3. [Pull Request Process](#pull-request-process)
4. [Code Review](#code-review)
5. [Coding Standards](#coding-standards)
6. [Testing Requirements](#testing-requirements)

---

## Git Flow Strategy

### Branch Naming Conventions

**Main Branches:**

- `main` - Production-ready code
- `develop` - Development branch (default)

**Feature Branches:**

```
feature/feature-name
feature/user-authentication
feature/team-management
```

**Bugfix Branches:**

```
bugfix/bug-description
bugfix/login-error
```

**Hotfix Branches:**

```
hotfix/critical-issue
```

### Creating Feature Branch

```bash
# Update develop branch
git checkout develop
git pull origin develop

# Create feature branch
git checkout -b feature/your-feature-name

# Make changes and commit
git add .
git commit -m "feat: add your feature"

# Push to remote
git push origin feature/your-feature-name
```

---

## Commit Conventions

### Conventional Commits Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

| Type         | Description      | Example                                  |
| ------------ | ---------------- | ---------------------------------------- |
| **feat**     | New feature      | `feat(auth): add Google OAuth`           |
| **fix**      | Bug fix          | `fix(team): fix composition validation`  |
| **docs**     | Documentation    | `docs: update README`                    |
| **style**    | Code style       | `style: format code with Prettier`       |
| **refactor** | Code refactoring | `refactor(api): simplify error handling` |
| **perf**     | Performance      | `perf(db): add indexes`                  |
| **test**     | Add/update tests | `test(auth): add login tests`            |
| **chore**    | Build/dependency | `chore: update dependencies`             |

### Scope

- `auth` - Authentication
- `team` - Team management
- `document` - Document management
- `timeline` - Timeline management
- `announcement` - Announcements
- `api` - API endpoints
- `db` - Database
- `ui` - User interface

### Subject

- Use imperative mood ("add" not "added")
- Don't capitalize first letter
- No period (.) at the end
- Limit to 50 characters

### Examples

**Good:**

```
feat(auth): add Google OAuth login
fix(team): fix composition validation
docs: update API documentation
```

**Bad:**

```
fixed stuff
updated code
WIP
```

---

## Pull Request Process

### Creating Pull Request

1. **Push your feature branch:**

   ```bash
   git push origin feature/your-feature-name
   ```

2. **Go to GitHub repository**

   - Click "Pull requests" tab
   - Click "New pull request"
   - Select base: `develop`
   - Select compare: `feature/your-feature-name`

3. **Fill PR description:**
   - Describe changes clearly
   - Link related issues: `Closes #123`
   - Add screenshots if UI changes

### PR Template

```markdown
## Description

Brief description of changes

## Type of Change

- [ ] New feature
- [ ] Bug fix
- [ ] Documentation update
- [ ] Performance improvement

## Related Issues

Closes #123

## Changes Made

- Change 1
- Change 2

## Testing Done

- [ ] Unit tests added
- [ ] Manual testing done

## Checklist

- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Tests added/updated
- [ ] All tests passing
```

### PR Review Process

1. **Wait for code review**

   - At least 1 approval required
   - Address review comments
   - Push fixes to same branch

2. **After approval**
   - Merge to develop
   - Delete feature branch
   - Close related issues

---

## Code Review

### Code Review Checklist

**Functionality:**

- [ ] Code works as intended
- [ ] No breaking changes
- [ ] Edge cases handled
- [ ] Error handling proper

**Code Quality:**

- [ ] Code is readable
- [ ] No code duplication
- [ ] Follows conventions
- [ ] Comments added

**Performance:**

- [ ] No performance issues
- [ ] Database queries optimized
- [ ] No memory leaks
- [ ] Bundle size acceptable

**Security:**

- [ ] No security vulnerabilities
- [ ] Input validation done
- [ ] No hardcoded secrets
- [ ] CORS properly configured

**Testing:**

- [ ] Tests added/updated
- [ ] Tests passing
- [ ] Coverage adequate
- [ ] Edge cases tested

---

## Coding Standards

### JavaScript/Node.js

**Style Guide:**

- Use ESLint configuration
- Use Prettier for formatting
- Use 2-space indentation
- Use const/let, not var
- Use arrow functions
- Use template literals

**Example:**

```javascript
// Good
const getUserById = async (id) => {
  const user = await User.findById(id);
  return user;
};

// Bad
var getUserById = function (id) {
  return User.findById(id);
};
```

### Vue.js

**Component Structure:**

```vue
<template>
  <!-- Template -->
</template>

<script setup>
// Script
</script>

<style scoped>
/* Styles */
</style>
```

**Naming:**

- Components: PascalCase (UserProfile.vue)
- Props: camelCase
- Events: kebab-case
- Methods: camelCase

### CSS/Tailwind

**Tailwind Classes:**

- Use utility classes
- Avoid custom CSS when possible
- Use responsive prefixes (sm:, md:, lg:)
- Use dark mode prefixes (dark:)

**Example:**

```vue
<div class="bg-white dark:bg-gray-800 p-4 rounded-lg">
  <h1 class="text-xl font-bold text-gray-900 dark:text-white">
    Title
  </h1>
</div>
```

---

## Testing Requirements

### Unit Tests

**Backend:**

```bash
# Run tests
npm test

# Run with coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

**Frontend:**

```bash
# Run tests
npm test

# Run with coverage
npm run test:coverage

# UI mode
npm run test:ui
```

### Test Coverage

- **Minimum:** 70% coverage
- **Target:** 80%+ coverage
- **Critical paths:** 100% coverage

### Test Examples

**Backend (Vitest):**

```javascript
describe("User Model", () => {
  it("should create user with valid data", async () => {
    const user = await User.create({
      email: "test@example.com",
      name: "Test User",
      password: "password123",
    });
    expect(user).toBeDefined();
    expect(user.email).toBe("test@example.com");
  });
});
```

**Frontend (Vitest):**

```javascript
describe("LoginForm Component", () => {
  it("should render login form", () => {
    const { getByText } = render(LoginForm);
    expect(getByText("Login")).toBeDefined();
  });
});
```

---

## Issue Reporting

### Bug Report Template

```markdown
## Description

Brief description of the bug

## Steps to Reproduce

1. Step 1
2. Step 2
3. Step 3

## Expected Behavior

What should happen

## Actual Behavior

What actually happens

## Screenshots

[Add screenshots if applicable]

## Environment

- OS: Windows/macOS/Linux
- Browser: Chrome/Firefox/Safari
- Version: 1.0.0

## Additional Context

Any additional information
```

### Feature Request Template

```markdown
## Description

Brief description of the feature

## Motivation

Why this feature is needed

## Proposed Solution

How to implement it

## Alternatives

Other possible solutions

## Additional Context

Any additional information
```

---

## Development Workflow

### Setup Development Environment

```bash
# Clone repository
git clone https://github.com/ustadzCoding/A25-CS246.git
cd A25-CS246

# Install dependencies
cd backend && npm install
cd ../frontend && npm install

# Setup environment variables
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Run development servers
# Terminal 1
cd backend && npm run dev

# Terminal 2
cd frontend && npm run dev
```

### Before Committing

```bash
# Run linter
npm run lint

# Format code
npm run format

# Run tests
npm test

# Build check
npm run build
```

### Pushing Changes

```bash
# Check git status
git status

# Add changes
git add .

# Commit with message
git commit -m "feat(scope): description"

# Push to remote
git push origin feature/your-feature-name
```

---

## Code of Conduct

### Be Respectful

- Treat all team members with respect
- Listen to feedback
- Help others learn
- Celebrate successes

### Be Professional

- Use professional language
- Avoid offensive comments
- Focus on code, not people
- Provide constructive feedback

### Be Collaborative

- Share knowledge
- Help teammates
- Review code thoroughly
- Communicate clearly

---

## Questions?

- **Email:** asah@dicoding.com
- **GitHub Issues:** https://github.com/ustadzCoding/A25-CS246/issues
- **GitHub Discussions:** https://github.com/ustadzCoding/A25-CS246/discussions

---

**Last Updated:** December 8, 2025 | **Version:** 1.0.0

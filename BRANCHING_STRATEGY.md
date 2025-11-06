# 🌿 Branching Strategy - A25-CS246

## Overview

Tim A25-CS246 menggunakan **Git Flow** sebagai branching strategy untuk memastikan kolaborasi yang terstruktur dan deployment yang aman.

## Branch Types

### 1. `main` Branch
- **Purpose:** Production-ready code
- **Protection:** Protected branch, requires PR approval
- **Deployment:** Auto-deploy ke production (Vercel + Railway)
- **Rules:**
  - ❌ No direct commits
  - ✅ Only merge from `develop` via Pull Request
  - ✅ Must pass all CI/CD checks
  - ✅ Requires 1+ approvals

### 2. `develop` Branch
- **Purpose:** Integration branch untuk development
- **Protection:** Protected branch
- **Deployment:** Auto-deploy ke staging environment
- **Rules:**
  - ❌ No direct commits (kecuali hotfix urgent)
  - ✅ Merge dari feature branches via PR
  - ✅ Must pass all tests

### 3. `feature/*` Branches
- **Purpose:** Development fitur baru
- **Naming Convention:** `feature/nama-fitur-singkat`
- **Base Branch:** `develop`
- **Merge Target:** `develop`

**Examples:**
```bash
feature/registration-form
feature/admin-dashboard
feature/document-upload
feature/timeline-visualization
```

**Workflow:**
```bash
# Create feature branch
git checkout develop
git pull origin develop
git checkout -b feature/registration-form

# Work on feature
git add .
git commit -m "feat: add registration form UI"

# Push and create PR
git push origin feature/registration-form
```

### 4. `bugfix/*` Branches
- **Purpose:** Fix bugs di development
- **Naming Convention:** `bugfix/deskripsi-bug`
- **Base Branch:** `develop`
- **Merge Target:** `develop`

**Examples:**
```bash
bugfix/validation-error
bugfix/cors-issue
bugfix/form-submit-failed
```

### 5. `hotfix/*` Branches
- **Purpose:** Urgent fixes untuk production
- **Naming Convention:** `hotfix/deskripsi-masalah`
- **Base Branch:** `main`
- **Merge Target:** `main` AND `develop`

**Examples:**
```bash
hotfix/security-vulnerability
hotfix/critical-api-error
```

**Workflow:**
```bash
# Create hotfix branch
git checkout main
git pull origin main
git checkout -b hotfix/critical-api-error

# Fix the issue
git add .
git commit -m "fix: resolve critical API error"

# Push and create PR to main
git push origin hotfix/critical-api-error

# After merge to main, also merge to develop
git checkout develop
git merge hotfix/critical-api-error
git push origin develop
```

## Workflow Diagram

```
main (production)
  ↑
  └─── hotfix/* (urgent fixes)
  ↑
  └─── develop (staging)
        ↑
        ├─── feature/registration-form
        ├─── feature/admin-dashboard
        ├─── feature/document-upload
        └─── bugfix/validation-error
```

## Commit Message Convention

Gunakan [Conventional Commits](https://www.conventionalcommits.org/) format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- `feat:` - Fitur baru
- `fix:` - Bug fix
- `docs:` - Perubahan dokumentasi
- `style:` - Formatting, semicolons, dll (tidak mengubah logic)
- `refactor:` - Refactoring code (tidak menambah fitur atau fix bug)
- `perf:` - Performance improvements
- `test:` - Menambah atau update tests
- `chore:` - Maintenance tasks (update dependencies, dll)
- `ci:` - CI/CD configuration changes

### Scope (Optional)
- `frontend` - Vue.js related
- `backend` - Express.js related
- `api` - API endpoints
- `ui` - User interface
- `db` - Database related

### Examples

```bash
# Good commits
git commit -m "feat(frontend): add registration form validation"
git commit -m "fix(api): resolve CORS issue in team endpoint"
git commit -m "docs: update README with setup instructions"
git commit -m "refactor(backend): simplify validation logic"
git commit -m "test(frontend): add unit tests for registration form"

# Bad commits (avoid these)
git commit -m "update"
git commit -m "fix bug"
git commit -m "changes"
git commit -m "wip"
```

## Pull Request Process

### 1. Create Pull Request

**Title Format:**
```
[TYPE] Brief description
```

**Examples:**
```
[FEAT] Add registration form with validation
[FIX] Resolve CORS issue in API
[DOCS] Update API documentation
```

**Description Template:** (akan otomatis muncul dari template)

### 2. PR Requirements

✅ **Before Creating PR:**
- [ ] Code follows project conventions
- [ ] All tests passing locally
- [ ] No console.log() or debugging code
- [ ] Updated documentation if needed
- [ ] Self-review completed

✅ **PR Checklist:**
- [ ] Descriptive title and description
- [ ] Linked to related issue (if any)
- [ ] Screenshots/videos for UI changes
- [ ] Tested in local environment
- [ ] No merge conflicts

### 3. Code Review

**Reviewers Must Check:**
- ✅ Code quality and readability
- ✅ Vue.js best practices (Composition API, reactivity)
- ✅ No security vulnerabilities
- ✅ Performance considerations
- ✅ Test coverage
- ✅ Documentation updated

**Review Response Time:**
- Target: Within 24 hours
- Critical PRs: Within 6 hours

### 4. Merge Strategy

**Use:** `Squash and Merge` untuk feature branches
- Keeps history clean
- Combines all commits into one

**Use:** `Merge Commit` untuk hotfix branches
- Preserves full history
- Important for tracking critical fixes

## Branch Naming Rules

### ✅ Good Names
```
feature/registration-form
feature/admin-dashboard-ui
bugfix/validation-error-message
hotfix/security-patch
```

### ❌ Bad Names
```
feature/new-stuff
bugfix/fix
my-branch
test123
```

### Rules
- Use lowercase
- Use hyphens (-) not underscores (_)
- Be descriptive but concise
- Max 50 characters

## Daily Workflow

### Morning Routine
```bash
# 1. Update local develop
git checkout develop
git pull origin develop

# 2. Create/switch to feature branch
git checkout -b feature/my-new-feature
# or
git checkout feature/my-existing-feature
git merge develop  # Update with latest changes
```

### During Development
```bash
# Commit frequently with meaningful messages
git add .
git commit -m "feat(frontend): add form validation logic"

# Push to remote regularly
git push origin feature/my-new-feature
```

### End of Day
```bash
# Push all changes
git push origin feature/my-new-feature

# Update task status in project board
```

## Conflict Resolution

### If Merge Conflict Occurs

```bash
# 1. Update your branch with latest develop
git checkout feature/your-feature
git fetch origin
git merge origin/develop

# 2. Resolve conflicts in your editor
# Look for <<<<<<< HEAD markers

# 3. After resolving
git add .
git commit -m "chore: resolve merge conflicts with develop"
git push origin feature/your-feature
```

### Prevention Tips
- Pull from `develop` frequently
- Keep feature branches short-lived (< 3 days)
- Communicate with team about overlapping work

## Branch Lifecycle

### Feature Branch Lifecycle

```bash
# Day 1: Create
git checkout -b feature/registration-form

# Day 1-3: Develop
git commit -m "feat: add form UI"
git commit -m "feat: add validation logic"
git commit -m "test: add unit tests"

# Day 3: Create PR
git push origin feature/registration-form
# Create PR on GitHub

# Day 3-4: Review & Merge
# After approval and CI passes
# Merge via GitHub UI

# Day 4: Cleanup
git checkout develop
git pull origin develop
git branch -d feature/registration-form  # Delete local
# GitHub will auto-delete remote branch
```

## Emergency Procedures

### Production is Broken! 🚨

```bash
# 1. Create hotfix immediately
git checkout main
git pull origin main
git checkout -b hotfix/critical-fix

# 2. Fix the issue
# ... make changes ...

# 3. Test thoroughly
npm run test

# 4. Commit and push
git commit -m "fix: resolve critical production issue"
git push origin hotfix/critical-fix

# 5. Create PR to main (mark as URGENT)
# 6. After merge, also merge to develop
git checkout develop
git merge hotfix/critical-fix
git push origin develop

# 7. Notify team in WhatsApp group
```

## Best Practices

### ✅ DO
- Commit early and often
- Write descriptive commit messages
- Keep branches focused on single feature/fix
- Delete branches after merge
- Pull from develop before starting work
- Run tests before pushing
- Request reviews from relevant team members

### ❌ DON'T
- Commit directly to main or develop
- Create long-lived feature branches (>1 week)
- Mix multiple features in one branch
- Push broken code
- Force push to shared branches
- Ignore merge conflicts
- Skip code reviews

## Team Responsibilities

### Afrizal (Ketua Tim)
- Approve PRs to main
- Resolve branch conflicts
- Enforce branching strategy

### Rizky (DevOps)
- Maintain CI/CD pipelines
- Configure branch protection rules
- Monitor deployment status

### All Team Members
- Follow branching strategy
- Review PRs assigned to you
- Keep branches up to date
- Communicate about blocking issues

## Tools & Resources

### GitHub Settings
- Branch protection rules enabled
- Required reviews: 1 minimum
- Require status checks to pass
- Auto-delete head branches after merge

### Helpful Commands

```bash
# View all branches
git branch -a

# Delete local branch
git branch -d feature/old-feature

# Delete remote branch
git push origin --delete feature/old-feature

# View commit history
git log --oneline --graph --all

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Stash changes temporarily
git stash
git stash pop
```

## Questions?

If you have questions about branching strategy:
1. Check this document first
2. Ask in WhatsApp group
3. Discuss in daily standup
4. Contact Rizky (DevOps lead)

---

**Last Updated:** 6 November 2025  
**Maintained by:** Tim A25-CS246

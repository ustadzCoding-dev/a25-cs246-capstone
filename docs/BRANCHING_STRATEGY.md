# 🌿 Branching Strategy

## Branch Structure

```
main (production)
  ↑
  └── Pull Request (with approval)
       ↑
develop (staging)
  ↑
  └── Pull Request or Direct Push
       ↑
feature/*, bugfix/*, hotfix/*
```

---

## Branch Types

### **1. `main` - Production Branch**
- **Purpose:** Production-ready code
- **Protection:** ✅ Protected
- **Deploy:** Auto-deploy to production
- **Merge:** Only from `develop` via Pull Request
- **Rules:**
  - Require PR approval
  - Require CI/CD pass
  - No direct push

### **2. `develop` - Development Branch**
- **Purpose:** Integration & testing
- **Protection:** ✅ Protected (CI/CD only)
- **Deploy:** Auto-deploy to staging
- **Merge:** From feature branches
- **Rules:**
  - Require CI/CD pass
  - Direct push allowed (for small fixes)

### **3. `feature/*` - Feature Branches**
- **Purpose:** New features
- **Naming:** `feature/feature-name`
- **Examples:**
  - `feature/login-page`
  - `feature/team-management`
  - `feature/file-upload`
- **Merge to:** `develop`
- **Delete:** After merge

### **4. `bugfix/*` - Bug Fix Branches**
- **Purpose:** Bug fixes
- **Naming:** `bugfix/bug-description`
- **Examples:**
  - `bugfix/login-error`
  - `bugfix/team-creation-fail`
- **Merge to:** `develop`
- **Delete:** After merge

### **5. `hotfix/*` - Hotfix Branches**
- **Purpose:** Critical production fixes
- **Naming:** `hotfix/critical-issue`
- **Examples:**
  - `hotfix/security-vulnerability`
  - `hotfix/production-crash`
- **Merge to:** `main` AND `develop`
- **Delete:** After merge

---

## Workflow Examples

### **Scenario 1: Add New Feature**

```bash
# 1. Create feature branch from develop
git checkout develop
git pull origin develop
git checkout -b feature/login-page

# 2. Work on feature
# ... coding ...
git add .
git commit -m "feat: add login page with validation"

# 3. Push to remote
git push origin feature/login-page

# 4. Create Pull Request on GitHub
# develop ← feature/login-page

# 5. Wait for CI/CD pass
# ✅ Backend CI: PASSED
# ✅ Frontend CI: PASSED
# ✅ PR Checks: PASSED

# 6. Merge PR (on GitHub)
# feature/login-page → develop

# 7. Delete feature branch
git branch -d feature/login-page
git push origin --delete feature/login-page
```

### **Scenario 2: Fix Bug**

```bash
# 1. Create bugfix branch
git checkout develop
git checkout -b bugfix/team-creation-error

# 2. Fix bug
# ... coding ...
git commit -m "fix: resolve team creation validation error"

# 3. Push and merge
git push origin bugfix/team-creation-error
# Create PR → Merge → Delete branch
```

### **Scenario 3: Hotfix Production**

```bash
# 1. Create hotfix from main
git checkout main
git pull origin main
git checkout -b hotfix/security-patch

# 2. Fix critical issue
# ... coding ...
git commit -m "hotfix: patch security vulnerability CVE-2024-XXXX"

# 3. Push to remote
git push origin hotfix/security-patch

# 4. Create TWO Pull Requests:
# PR 1: main ← hotfix/security-patch (URGENT)
# PR 2: develop ← hotfix/security-patch

# 5. Merge both PRs
# 6. Delete hotfix branch
```

### **Scenario 4: Release to Production**

```bash
# 1. Ensure develop is stable
# All tests pass on develop
# Staging environment tested

# 2. Create Pull Request
# main ← develop

# 3. Review & Test
# - Code review by team
# - Final testing on staging
# - Check CI/CD status

# 4. Get approval & merge
# develop → main

# 5. Auto-deploy to production
# GitHub Actions will deploy automatically
```

---

## Commit Message Convention

### **Format:**
```
<type>(<scope>): <subject>

<body>

<footer>
```

### **Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style (formatting)
- `refactor`: Code refactoring
- `test`: Add tests
- `chore`: Maintenance

### **Examples:**
```bash
feat(auth): add JWT authentication
fix(team): resolve member invitation error
docs(api): update Swagger documentation
style(frontend): format code with Prettier
refactor(backend): optimize database queries
test(auth): add unit tests for login
chore(deps): update dependencies
```

---

## Branch Protection Rules

### **`main` Branch:**
```yaml
✅ Require pull request before merging
✅ Require 1 approval (if team > 1)
✅ Require status checks to pass:
   - Backend CI
   - Frontend CI
   - PR Checks
✅ Require conversation resolution
✅ Do not allow bypassing
❌ Allow force push: NO
❌ Allow deletions: NO
```

### **`develop` Branch:**
```yaml
✅ Require status checks to pass:
   - Backend CI
   - Frontend CI
❌ Require pull request: NO (optional)
❌ Allow force push: NO
❌ Allow deletions: NO
```

---

## CI/CD Triggers

### **On Push:**
```yaml
main:
  - Run full CI/CD
  - Deploy to production

develop:
  - Run full CI/CD
  - Deploy to staging

feature/*, bugfix/*, hotfix/*:
  - Run quick checks
  - Run relevant tests only
```

### **On Pull Request:**
```yaml
To main:
  - Run full CI/CD
  - Require approval
  - Block if failed

To develop:
  - Run full CI/CD
  - Auto-merge if passed (optional)
```

---

## Best Practices

### **✅ DO:**
- Create feature branch for each new feature
- Keep branches small and focused
- Write descriptive commit messages
- Delete branches after merge
- Pull latest develop before creating new branch
- Run tests locally before push
- Review your own PR before requesting review

### **❌ DON'T:**
- Push directly to main
- Create long-lived feature branches
- Mix multiple features in one branch
- Force push to protected branches
- Commit sensitive data (API keys, passwords)
- Skip CI/CD checks
- Merge without review (for main)

---

## Quick Reference

```bash
# Create feature branch
git checkout -b feature/my-feature develop

# Update from develop
git checkout develop
git pull origin develop
git checkout feature/my-feature
git merge develop

# Push feature
git push origin feature/my-feature

# Delete local branch
git branch -d feature/my-feature

# Delete remote branch
git push origin --delete feature/my-feature

# View all branches
git branch -a

# View branch status
git status
```

---

## Emergency Procedures

### **Rollback Production:**
```bash
# 1. Identify last good commit
git log --oneline main

# 2. Create hotfix branch
git checkout -b hotfix/rollback <good-commit-hash>

# 3. Push and create PR
git push origin hotfix/rollback
# Create PR: main ← hotfix/rollback

# 4. Merge immediately
```

### **Fix Broken Develop:**
```bash
# 1. Identify issue
git log develop

# 2. Revert bad commit
git revert <bad-commit-hash>

# 3. Push fix
git push origin develop
```

---

## Questions?

Contact: Team Lead or DevOps

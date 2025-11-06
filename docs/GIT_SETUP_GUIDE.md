# 🚀 Git Repository Setup Guide

Panduan lengkap untuk setup Git repository dan push ke GitHub untuk pertama kali.

## 📋 Prerequisites

- Git installed (`git --version`)
- GitHub account
- Repository access (akan dibuat oleh Rizky)

## 🔧 Initial Setup

### Step 1: Configure Git (First Time Only)

```bash
# Set your name
git config --global user.name "Nama Anda"

# Set your email (gunakan email GitHub)
git config --global user.email "your.email@example.com"

# Verify configuration
git config --list
```

### Step 2: Initialize Git Repository

```bash
# Navigate to project folder
cd d:\A25-CS246

# Initialize Git
git init

# Verify .git folder created
ls -la
```

### Step 3: Add Remote Repository

```bash
# Add GitHub remote (URL akan diberikan oleh Rizky)
git remote add origin https://github.com/[username]/A25-CS246.git

# Verify remote
git remote -v
```

### Step 4: Create Initial Commit

```bash
# Check status
git status

# Add all files
git add .

# Create initial commit
git commit -m "chore: initial project setup with documentation"

# Verify commit
git log --oneline
```

### Step 5: Create and Push Branches

```bash
# Create main branch
git branch -M main

# Push to GitHub
git push -u origin main

# Create develop branch
git checkout -b develop

# Push develop branch
git push -u origin develop

# Verify branches
git branch -a
```

## 🌿 Branch Setup

### Set develop as default branch

1. Go to GitHub repository
2. Settings → Branches
3. Change default branch to `develop`
4. Click "Update"

### Enable Branch Protection

#### For `main` branch:

1. Go to Settings → Branches → Add rule
2. Branch name pattern: `main`
3. Enable:
   - ✅ Require a pull request before merging
   - ✅ Require approvals (1)
   - ✅ Require status checks to pass
   - ✅ Require branches to be up to date
   - ✅ Do not allow bypassing the above settings
4. Save changes

#### For `develop` branch:

1. Add rule for `develop`
2. Enable:
   - ✅ Require a pull request before merging
   - ✅ Require status checks to pass
3. Save changes

## 👥 Team Member Setup

### For Each Team Member:

```bash
# Clone repository
git clone https://github.com/[username]/A25-CS246.git
cd A25-CS246

# Verify branches
git branch -a

# Checkout develop
git checkout develop

# Pull latest changes
git pull origin develop
```

## 🔄 Daily Workflow

### Morning Routine

```bash
# Update local develop
git checkout develop
git pull origin develop

# Create feature branch
git checkout -b feature/your-feature-name
```

### During Development

```bash
# Check status
git status

# Add changes
git add .

# Commit with conventional commit message
git commit -m "feat: add registration form"

# Push to remote
git push origin feature/your-feature-name
```

### Creating Pull Request

1. Go to GitHub repository
2. Click "Pull requests" → "New pull request"
3. Base: `develop` ← Compare: `feature/your-feature-name`
4. Fill PR template
5. Request reviews
6. Wait for approval and CI to pass
7. Merge using "Squash and merge"

## 🔍 Useful Git Commands

### Check Status

```bash
# View changed files
git status

# View commit history
git log --oneline --graph --all

# View specific file history
git log --oneline -- path/to/file
```

### Undo Changes

```bash
# Discard changes in working directory
git checkout -- filename

# Unstage file
git reset HEAD filename

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1
```

### Branch Management

```bash
# List all branches
git branch -a

# Create new branch
git checkout -b feature/new-feature

# Switch branch
git checkout develop

# Delete local branch
git branch -d feature/old-feature

# Delete remote branch
git push origin --delete feature/old-feature
```

### Sync with Remote

```bash
# Fetch changes
git fetch origin

# Pull changes
git pull origin develop

# Push changes
git push origin feature/your-feature
```

### Resolve Conflicts

```bash
# Update your branch
git checkout feature/your-feature
git fetch origin
git merge origin/develop

# If conflicts occur:
# 1. Open conflicted files
# 2. Look for <<<<<<< HEAD markers
# 3. Resolve conflicts manually
# 4. Remove conflict markers
# 5. Add resolved files
git add .
git commit -m "chore: resolve merge conflicts"
git push origin feature/your-feature
```

## 🚨 Common Issues

### Issue: "Permission denied (publickey)"

**Solution:**
```bash
# Generate SSH key
ssh-keygen -t ed25519 -C "your.email@example.com"

# Add SSH key to ssh-agent
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519

# Copy public key
cat ~/.ssh/id_ed25519.pub

# Add to GitHub: Settings → SSH and GPG keys → New SSH key
```

Or use HTTPS instead:
```bash
git remote set-url origin https://github.com/[username]/A25-CS246.git
```

### Issue: "fatal: refusing to merge unrelated histories"

**Solution:**
```bash
git pull origin main --allow-unrelated-histories
```

### Issue: "Your branch is behind 'origin/develop'"

**Solution:**
```bash
git pull origin develop
```

### Issue: "Merge conflict"

**Solution:**
1. Open conflicted files
2. Look for conflict markers:
   ```
   <<<<<<< HEAD
   Your changes
   =======
   Their changes
   >>>>>>> branch-name
   ```
3. Choose which changes to keep
4. Remove conflict markers
5. Save file
6. Add and commit:
   ```bash
   git add .
   git commit -m "chore: resolve merge conflicts"
   ```

## 📝 Git Best Practices

### ✅ DO:

- Commit frequently with meaningful messages
- Pull before starting work
- Create feature branches for each task
- Keep commits focused and atomic
- Write descriptive commit messages
- Review your changes before committing
- Test before pushing

### ❌ DON'T:

- Commit directly to main or develop
- Push broken code
- Commit large binary files
- Use `git push --force` on shared branches
- Commit sensitive data (.env files)
- Make huge commits with many changes
- Skip code reviews

## 🎯 Commit Message Guidelines

### Format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types:

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `style:` - Formatting
- `refactor:` - Code refactoring
- `test:` - Tests
- `chore:` - Maintenance

### Examples:

```bash
# Good
git commit -m "feat(frontend): add registration form validation"
git commit -m "fix(api): resolve CORS issue in team endpoint"
git commit -m "docs: update README with setup instructions"

# Bad
git commit -m "update"
git commit -m "fix bug"
git commit -m "changes"
```

## 🔐 .gitignore

Important files to ignore (already in `.gitignore`):

```
node_modules/
.env
.env.local
dist/
build/
*.log
.DS_Store
```

## 📊 Git Workflow Diagram

```
main (production)
  ↑
  └─── PR from develop (after testing)
       ↑
       develop (staging)
         ↑
         ├─── feature/registration-form
         ├─── feature/admin-dashboard
         └─── bugfix/validation-error
```

## 🔗 Useful Resources

- [Git Documentation](https://git-scm.com/doc)
- [GitHub Guides](https://guides.github.com/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Git Cheat Sheet](https://education.github.com/git-cheat-sheet-education.pdf)

## 📞 Need Help?

If you encounter Git issues:

1. Check this guide first
2. Search error message on Google
3. Ask in WhatsApp group
4. Contact Rizky (DevOps lead)

---

**Last Updated:** 6 November 2025  
**Team:** A25-CS246

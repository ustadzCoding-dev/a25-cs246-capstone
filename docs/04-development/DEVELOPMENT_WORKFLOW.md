# 🔄 DEVELOPMENT WORKFLOW

Git Flow strategy and development best practices.

---

## 📊 Git Flow Strategy

We use **Git Flow** branching model:

```
main (production)
  ↑
  ├─ release/* (release branches)
  │
develop (development)
  ↑
  ├─ feature/* (new features)
  ├─ bugfix/* (bug fixes)
  └─ hotfix/* (production hotfixes)
```

---

## 🌿 Branch Naming Convention

### Feature Branches

```bash
feature/team-registration
feature/profile-picture-upload
feature/email-notifications
```

### Bug Fix Branches

```bash
bugfix/login-redirect-issue
bugfix/profile-picture-validation
bugfix/team-composition-validation
```

### Hotfix Branches (from main)

```bash
hotfix/critical-security-issue
hotfix/database-migration-error
```

### Release Branches

```bash
release/v1.0.0
release/v1.1.0
```

---

## 📝 Commit Convention

Use **Conventional Commits** format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat:** New feature
- **fix:** Bug fix
- **docs:** Documentation
- **style:** Code style (formatting, semicolons, etc.)
- **refactor:** Code refactoring
- **perf:** Performance improvement
- **test:** Adding/updating tests
- **chore:** Maintenance tasks

### Examples

**Good:**

```bash
git commit -m "feat(team): add team registration form with composition validation"
git commit -m "fix(auth): resolve Google OAuth redirect loop issue"
git commit -m "docs(api): add API reference documentation"
git commit -m "test(team): add unit tests for team validation"
```

**Bad:**

```bash
git commit -m "fixed stuff"
git commit -m "update"
git commit -m "changes"
```

---

## 🔄 Workflow Steps

### 1. Create Feature Branch

```bash
# Update develop branch
git checkout develop
git pull origin develop

# Create feature branch
git checkout -b feature/your-feature-name
```

### 2. Make Changes

```bash
# Edit files
# Test locally
# Commit changes
git add .
git commit -m "feat(scope): description"
```

### 3. Push to Remote

```bash
git push origin feature/your-feature-name
```

### 4. Create Pull Request

1. Go to GitHub repository
2. Click "New Pull Request"
3. Select:
   - Base: `develop`
   - Compare: `feature/your-feature-name`
4. Fill PR template:
   - Title: `feat: description`
   - Description: What changed and why
   - Link related issues

### 5. Code Review

- Request review from team members
- Address review comments
- Push updates to same branch

### 6. Merge to Develop

1. Ensure all checks pass (CI/CD)
2. Get approval from at least 1 reviewer
3. Click "Squash and merge" or "Rebase and merge"
4. Delete branch after merge

### 7. Deploy to Production

```bash
# When ready for release
git checkout main
git pull origin main
git merge --no-ff develop
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin main
git push origin v1.0.0
```

---

## 🔀 Handling Merge Conflicts

### If conflicts occur:

```bash
# Update your branch with latest develop
git fetch origin
git rebase origin/develop

# Resolve conflicts in editor
# Then continue rebase
git add .
git rebase --continue

# Push updated branch
git push origin feature/your-feature-name --force
```

---

## 📋 Pull Request Template

```markdown
## Description

Brief description of changes

## Type of Change

- [ ] New feature
- [ ] Bug fix
- [ ] Documentation
- [ ] Other

## Related Issues

Closes #123

## Changes Made

- Change 1
- Change 2
- Change 3

## Testing Done

- [ ] Unit tests added
- [ ] Manual testing completed
- [ ] No breaking changes

## Screenshots (if applicable)

[Add screenshots here]

## Checklist

- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] Tests added/updated
- [ ] No new warnings generated
```

---

## ✅ Code Review Checklist

When reviewing PRs, check:

- ✅ Code follows project style guide
- ✅ No console.log or debug code
- ✅ Tests are included and passing
- ✅ Documentation is updated
- ✅ No hardcoded values
- ✅ Error handling is proper
- ✅ Performance is acceptable
- ✅ Security best practices followed
- ✅ No breaking changes
- ✅ Commit messages are clear

---

## 🚀 Deployment Process

### Development (Automatic)

- Push to `develop` → Auto-deploy to staging
- CI/CD runs tests → If pass, deploy to staging

### Production (Manual)

```bash
# 1. Create release branch
git checkout -b release/v1.0.0 develop

# 2. Update version numbers
# Edit package.json, CHANGELOG.md, etc.

# 3. Commit release changes
git commit -m "chore(release): v1.0.0"

# 4. Merge to main
git checkout main
git merge --no-ff release/v1.0.0

# 5. Tag release
git tag -a v1.0.0 -m "Release v1.0.0"

# 6. Merge back to develop
git checkout develop
git merge --no-ff release/v1.0.0

# 7. Push everything
git push origin main develop
git push origin v1.0.0

# 8. Delete release branch
git branch -d release/v1.0.0
```

---

## 🔐 Security Best Practices

- Never commit `.env` files
- Never commit API keys or secrets
- Use environment variables for sensitive data
- Review code for security vulnerabilities
- Keep dependencies updated
- Use HTTPS in production
- Validate all user inputs

---

## 📚 Useful Commands

```bash
# View commit history
git log --oneline -10

# View branches
git branch -a

# View changes
git diff

# Stash changes temporarily
git stash
git stash pop

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1

# View who changed what
git blame filename.js
```

---

## 🤝 Team Collaboration

### Communication

- Use GitHub Issues for discussions
- Use PR comments for code review
- Use Slack/Discord for urgent matters
- Update team on progress daily

### Code Ownership

- Backend: Ganza (Lead), Marsa, Rizky
- Frontend: Deby (Lead), Marsa, Rizky
- DevOps: Rizky (Lead), Ganza
- Documentation: Afrizal (Lead), Team

### Review Assignments

- Backend PRs: Reviewed by Ganza or Marsa
- Frontend PRs: Reviewed by Deby or Marsa
- DevOps PRs: Reviewed by Rizky or Ganza

---

## 📞 Getting Help

- **Git issues?** Check [Git Documentation](https://git-scm.com/doc)
- **Merge conflicts?** Ask in team chat
- **Code review feedback?** Discuss in PR comments
- **Deployment issues?** Contact Rizky (DevOps)

---

**Happy coding! 🚀**

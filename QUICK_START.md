# 🚀 Quick Start Guide - Tim A25-CS246

**Welcome to the team!** Ini adalah panduan cepat untuk memulai development.

## ⚡ Super Quick Start (5 menit)

```bash
# 1. Clone repository
git clone https://github.com/[username]/A25-CS246.git
cd A25-CS246

# 2. Checkout develop branch
git checkout develop

# 3. You're ready! 🎉
```

## 📚 Essential Reading (15 menit)

Baca dokumen ini sebelum mulai coding:

1. **README.md** - Overview project dan tech stack
2. **BRANCHING_STRATEGY.md** - Git workflow (WAJIB!)
3. **CONTRIBUTING.md** - Code standards dan best practices

## 🛠️ Development Setup

### Prerequisites

Install tools berikut:

- ✅ **Node.js 18+** - [Download](https://nodejs.org/)
- ✅ **Git** - [Download](https://git-scm.com/)
- ✅ **VS Code** - [Download](https://code.visualstudio.com/)
- ✅ **MongoDB 7+** - [Download](https://www.mongodb.com/try/download/community)

### Verify Installation

```bash
node --version    # Should be v18.x or higher
npm --version     # Should be v9.x or higher
git --version     # Any recent version
mongosh --version # Should be v2.x or higher
```

### Install VS Code Extensions

Open VS Code, press `Ctrl+Shift+P`, type "Extensions: Show Recommended Extensions", dan install semua.

**Essential extensions:**
- Vue - Official
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- GitLens

## 🎯 Your First Task

### 1. Create Your First Branch

```bash
# Make sure you're on develop
git checkout develop
git pull origin develop

# Create feature branch
git checkout -b feature/test-setup

# Verify
git branch
```

### 2. Make a Small Change

```bash
# Create a test file
echo "# Test by [Your Name]" > test-[yourname].md

# Stage and commit
git add test-[yourname].md
git commit -m "docs: add test file for [Your Name]"

# Push
git push origin feature/test-setup
```

### 3. Create Your First Pull Request

1. Go to GitHub repository
2. Click "Pull requests" → "New pull request"
3. Base: `develop` ← Compare: `feature/test-setup`
4. Fill PR template
5. Create pull request
6. Request review from team member

**Congratulations!** You've completed your first Git workflow! 🎉

## 📅 Daily Routine

### Morning (Before Coding)

```bash
# 1. Update develop
git checkout develop
git pull origin develop

# 2. Create/update feature branch
git checkout -b feature/your-task
# or if branch exists:
git checkout feature/your-task
git merge develop

# 3. Start coding!
```

### During Development

```bash
# Check what changed
git status

# Add changes
git add .

# Commit (use conventional commits!)
git commit -m "feat: add login form"

# Push regularly
git push origin feature/your-task
```

### End of Day

```bash
# Make sure everything is pushed
git push origin feature/your-task

# Update task status in project board
```

## 💬 Commit Message Format

**Format:** `<type>: <description>`

**Types:**
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `style:` - Formatting
- `refactor:` - Code refactoring
- `test:` - Tests
- `chore:` - Maintenance

**Examples:**
```bash
git commit -m "feat: add registration form validation"
git commit -m "fix: resolve CORS issue in API"
git commit -m "docs: update README with setup instructions"
```

## 🔍 Useful Commands

```bash
# Check status
git status

# View commit history
git log --oneline

# Switch branch
git checkout branch-name

# Update current branch
git pull origin branch-name

# View all branches
git branch -a

# Discard changes
git checkout -- filename
```

**More commands:** See `docs/COMMAND_CHEATSHEET.md`

## 🆘 Common Issues

### "Permission denied"
```bash
# Use HTTPS instead of SSH
git remote set-url origin https://github.com/[username]/A25-CS246.git
```

### "Merge conflict"
1. Open conflicted files
2. Look for `<<<<<<< HEAD` markers
3. Choose which changes to keep
4. Remove conflict markers
5. `git add .` and `git commit`

### "Branch is behind"
```bash
git pull origin develop
```

### Need more help?
- Check `docs/GIT_SETUP_GUIDE.md`
- Ask in WhatsApp group
- Tag team member in PR

## 📞 Team Contacts

| Name | Role | Contact |
|------|------|---------|
| Afrizal | Project Manager | @afrizal |
| Deby | Frontend Lead | @deby |
| Ganza | Backend Lead | @ganza |
| Marsa | Full Stack | @marsa |
| Rizky | DevOps | @rizky |

**WhatsApp Group:** [Link]  
**Daily Standup:** 21.00 WIB (15 menit)

## 🎯 Week 2 Tasks (Starting 7 Nov)

Check project board for your assigned tasks:

- **Frontend:** Registration form UI (Deby, Afrizal)
- **Backend:** Registration API (Ganza)
- **Integration:** Connect frontend-backend (Afrizal)
- **Admin:** Dashboard for team approval (Afrizal)

## 📚 Learning Resources

### Vue.js
- [Vue 3 Official Tutorial](https://vuejs.org/tutorial/)
- [Vue Mastery](https://www.vuemastery.com/)
- [Vue School](https://vueschool.io/)

### Express.js
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

### MongoDB
- [MongoDB University](https://university.mongodb.com/)
- [Mongoose Docs](https://mongoosejs.com/docs/guide.html)

## ✅ Setup Checklist

Before starting development, make sure:

- [ ] Repository cloned
- [ ] On `develop` branch
- [ ] Node.js installed
- [ ] MongoDB installed
- [ ] VS Code extensions installed
- [ ] Read BRANCHING_STRATEGY.md
- [ ] Read CONTRIBUTING.md
- [ ] Created test branch and PR
- [ ] Joined WhatsApp group
- [ ] Know daily standup time

## 🎉 You're Ready!

Selamat! Setup Anda sudah lengkap. Sekarang Anda siap untuk:

1. ✅ Pick task dari project board
2. ✅ Create feature branch
3. ✅ Start coding
4. ✅ Commit & push regularly
5. ✅ Create PR when done
6. ✅ Request reviews
7. ✅ Merge after approval

**Good luck and happy coding! 🚀**

---

**Questions?** Ask in WhatsApp group or check:
- `docs/GIT_SETUP_GUIDE.md` - Detailed Git guide
- `docs/COMMAND_CHEATSHEET.md` - Command reference
- `CONTRIBUTING.md` - Code standards
- `README.md` - Project overview

**Last Updated:** 6 November 2025  
**Team:** A25-CS246

# 📝 Command Cheat Sheet - A25-CS246

Quick reference untuk command yang sering digunakan dalam development.

## 🚀 Git Commands

### Daily Workflow

```bash
# Update local develop
git checkout develop
git pull origin develop

# Create feature branch
git checkout -b feature/your-feature-name

# Check status
git status

# Add changes
git add .
# or add specific files
git add path/to/file

# Commit
git commit -m "feat: your commit message"

# Push to remote
git push origin feature/your-feature-name

# Update feature branch with latest develop
git checkout feature/your-feature-name
git merge develop
```

### Branch Management

```bash
# List all branches
git branch -a

# Switch branch
git checkout branch-name

# Create and switch to new branch
git checkout -b new-branch-name

# Delete local branch
git branch -d branch-name

# Delete remote branch
git push origin --delete branch-name

# Rename current branch
git branch -m new-name
```

### Undo Changes

```bash
# Discard changes in working directory
git checkout -- filename

# Unstage file
git reset HEAD filename

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes) - DANGEROUS!
git reset --hard HEAD~1

# Revert a commit (creates new commit)
git revert commit-hash
```

### View History

```bash
# View commit history
git log

# View compact history
git log --oneline

# View graphical history
git log --oneline --graph --all

# View changes in a commit
git show commit-hash

# View file history
git log --follow -- path/to/file
```

### Stash (Temporary Save)

```bash
# Save current changes
git stash

# Save with message
git stash save "work in progress"

# List stashes
git stash list

# Apply latest stash
git stash pop

# Apply specific stash
git stash apply stash@{0}

# Delete stash
git stash drop stash@{0}
```

## 📦 NPM Commands

### Frontend (Vue.js)

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui

# Generate coverage
npm run coverage

# Run linter
npm run lint

# Fix linting errors
npm run lint:fix

# Format code
npm run format
```

### Backend (Express.js)

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Start dev server (with nodemon)
npm run dev

# Start production server
npm start

# Run tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run integration tests
npm run test:integration

# Generate coverage
npm run coverage

# Run linter
npm run lint

# Fix linting errors
npm run lint:fix

# Run database migrations
npm run migrate

# Seed database
npm run seed
```

## 🗄️ MongoDB Commands

### MongoDB Shell (mongosh)

```bash
# Connect to MongoDB
mongosh

# Show databases
show dbs

# Use database
use dicoding-capstone

# Show collections
show collections

# Find all documents
db.teams.find()

# Find with pretty print
db.teams.find().pretty()

# Find one document
db.teams.findOne()

# Find with filter
db.teams.find({ status: "pending" })

# Count documents
db.teams.countDocuments()

# Insert document
db.teams.insertOne({ name: "Team A" })

# Update document
db.teams.updateOne(
  { _id: ObjectId("...") },
  { $set: { status: "approved" } }
)

# Delete document
db.teams.deleteOne({ _id: ObjectId("...") })

# Drop collection
db.teams.drop()

# Drop database
db.dropDatabase()
```

### MongoDB Backup & Restore

```bash
# Backup database
mongodump --db dicoding-capstone --out ./backup

# Restore database
mongorestore --db dicoding-capstone ./backup/dicoding-capstone

# Export collection to JSON
mongoexport --db dicoding-capstone --collection teams --out teams.json

# Import collection from JSON
mongoimport --db dicoding-capstone --collection teams --file teams.json
```

## 🐳 Docker Commands (Optional)

### MongoDB with Docker

```bash
# Run MongoDB container
docker run -d -p 27017:27017 --name mongodb mongo:7

# Stop container
docker stop mongodb

# Start container
docker start mongodb

# Remove container
docker rm mongodb

# View logs
docker logs mongodb

# Execute mongosh in container
docker exec -it mongodb mongosh
```

## 🌐 Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Link project
vercel link

# Deploy to preview
vercel

# Deploy to production
vercel --prod

# View deployments
vercel ls

# View logs
vercel logs
```

## 🚂 Railway CLI

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link project
railway link

# Deploy
railway up

# View logs
railway logs

# Run command in Railway environment
railway run npm run migrate

# Open project in browser
railway open
```

## 🔍 Debugging Commands

### Frontend Debugging

```bash
# Check Vue version
npm list vue

# Check all dependencies
npm list

# Check for outdated packages
npm outdated

# Check for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix

# Clear npm cache
npm cache clean --force

# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Backend Debugging

```bash
# Check Node version
node --version

# Check npm version
npm --version

# Test MongoDB connection
mongosh --eval "db.adminCommand('ping')"

# Check port usage (Windows)
netstat -ano | findstr :3000

# Kill process on port (Windows)
taskkill /PID <PID> /F

# Check environment variables
echo $env:NODE_ENV  # PowerShell
echo %NODE_ENV%     # CMD
```

## 📊 Testing Commands

### Run Specific Tests

```bash
# Run specific test file
npm test -- path/to/test.spec.js

# Run tests matching pattern
npm test -- --grep "registration"

# Run tests in specific folder
npm test -- tests/unit/

# Run with coverage
npm test -- --coverage

# Run in watch mode
npm test -- --watch
```

## 🔧 VS Code Commands

### Terminal Shortcuts

- **Ctrl + `** - Toggle terminal
- **Ctrl + Shift + `** - New terminal
- **Ctrl + Shift + 5** - Split terminal

### Editor Shortcuts

- **Ctrl + P** - Quick file open
- **Ctrl + Shift + P** - Command palette
- **Ctrl + /** - Toggle comment
- **Alt + Up/Down** - Move line up/down
- **Shift + Alt + Up/Down** - Copy line up/down
- **Ctrl + D** - Select next occurrence
- **Ctrl + Shift + L** - Select all occurrences

### Git Shortcuts

- **Ctrl + Shift + G** - Open source control
- **Ctrl + Enter** - Commit (in source control)

## 🚨 Emergency Commands

### When Things Go Wrong

```bash
# Reset to last commit (DANGEROUS!)
git reset --hard HEAD

# Clean untracked files (DANGEROUS!)
git clean -fd

# Force pull (DANGEROUS!)
git fetch origin
git reset --hard origin/develop

# Remove all node_modules
find . -name "node_modules" -type d -prune -exec rm -rf '{}' +

# Kill all node processes (Windows)
taskkill /F /IM node.exe

# Clear all caches
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

## 📝 Useful Aliases (Optional)

Add to `.bashrc` or `.zshrc`:

```bash
# Git aliases
alias gs='git status'
alias ga='git add .'
alias gc='git commit -m'
alias gp='git push'
alias gl='git log --oneline --graph --all'
alias gco='git checkout'
alias gd='git diff'

# NPM aliases
alias ni='npm install'
alias nid='npm install --save-dev'
alias nrs='npm run start'
alias nrd='npm run dev'
alias nrt='npm run test'
alias nrb='npm run build'

# Navigation
alias ..='cd ..'
alias ...='cd ../..'
alias fe='cd frontend'
alias be='cd backend'
```

## 🔗 Useful Links

- [Git Documentation](https://git-scm.com/doc)
- [NPM Documentation](https://docs.npmjs.com/)
- [MongoDB Manual](https://docs.mongodb.com/manual/)
- [Vue.js Documentation](https://vuejs.org/)
- [Express.js Documentation](https://expressjs.com/)

---

**Last Updated:** 6 November 2025  
**Team:** A25-CS246

**💡 Tip:** Bookmark this page for quick reference!

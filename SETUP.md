# 🔧 Setup Guide - DC-09 Capstone Project

Complete guide untuk setup development environment lokal untuk project DC-09.

---

## 📋 Table of Contents

- [Prerequisites](#prerequisites)
- [Installation Steps](#installation-steps)
- [Environment Configuration](#environment-configuration)
- [Database Setup](#database-setup)
- [Verification](#verification)
- [Troubleshooting](#troubleshooting)
- [Available Scripts](#available-scripts)

---

## Prerequisites

### System Requirements

- **OS:** Windows 10+, macOS 10.15+, atau Linux (Ubuntu 20.04+)
- **RAM:** Minimum 4GB (8GB recommended)
- **Disk Space:** Minimum 2GB free space

### Required Software

| Software               | Version              | Purpose                | Download                      |
| ---------------------- | -------------------- | ---------------------- | ----------------------------- |
| **Node.js**            | 18.x LTS or higher   | JavaScript runtime     | https://nodejs.org            |
| **npm**                | 9.x or higher        | Package manager        | Included with Node.js         |
| **Git**                | 2.40+                | Version control        | https://git-scm.com           |
| **MongoDB**            | 7.x (local) or Atlas | Database               | https://www.mongodb.com       |
| **Visual Studio Code** | Latest               | Code editor (optional) | https://code.visualstudio.com |

### Installation Commands

**Windows (using Chocolatey):**

```bash
choco install nodejs git mongodb-community
```

**macOS (using Homebrew):**

```bash
brew install node git mongodb-community
```

**Linux (Ubuntu):**

```bash
sudo apt-get update
sudo apt-get install nodejs npm git
# MongoDB: https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/
```

### Verify Installation

```bash
# Check Node.js version
node --version  # Should be v18.x or higher

# Check npm version
npm --version   # Should be 9.x or higher

# Check Git version
git --version   # Should be 2.40+
```

---

## Installation Steps

### Step 1: Clone Repository

```bash
# Clone the repository
git clone https://github.com/ustadzCoding/A25-CS246.git
cd A25-CS246

# Verify you're in the right directory
pwd  # macOS/Linux
cd   # Windows
```

### Step 2: Setup Backend

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Copy environment template
cp .env.example .env
# On Windows: copy .env.example .env

# Edit .env file with your configuration
# See "Environment Configuration" section below
```

### Step 3: Setup Frontend

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install

# Copy environment template
cp .env.example .env
# On Windows: copy .env.example .env

# Edit .env file with your configuration
```

### Step 4: Run Development Servers

**Terminal 1 - Backend (port 8000):**

```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend (port 5173):**

```bash
cd frontend
npm run dev
```

**Terminal 3 - MongoDB (if running locally):**

```bash
# macOS/Linux
mongod

# Windows (if installed via Chocolatey)
mongod
```

---

## Environment Configuration

### Backend Environment Variables (.env)

Create `backend/.env` file:

```env
# Server Configuration
NODE_ENV=development
PORT=8000
FRONTEND_URL=http://localhost:5173

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/capstone-db
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/capstone-db?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
JWT_EXPIRE=7d

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:8000/api/auth/google/callback

# Cloudinary Configuration (for file uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email Configuration (Gmail SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM=noreply@capstone.com

# CORS Configuration
CORS_ORIGIN=http://localhost:5173

# Admin Configuration
ADMIN_EMAIL=admin@dicoding.com
ADMIN_PASSWORD=your_secure_password_here
```

### Frontend Environment Variables (.env)

Create `frontend/.env` file:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8000/api

# Application Configuration
VITE_APP_NAME=DC-09 Capstone
VITE_APP_VERSION=1.0.0

# Feature Flags
VITE_ENABLE_GOOGLE_OAUTH=true
```

---

## Database Setup

### Option 1: Local MongoDB

#### macOS/Linux

```bash
# Install MongoDB Community Edition
brew install mongodb-community

# Start MongoDB service
brew services start mongodb-community

# Verify connection
mongosh
# Type: exit
```

#### Windows

```bash
# Install MongoDB Community Edition
# Download from: https://www.mongodb.com/try/download/community

# Start MongoDB service
# MongoDB should start automatically after installation

# Verify connection
mongosh
# Type: exit
```

### Option 2: MongoDB Atlas (Cloud)

1. **Create Account**

   - Go to https://www.mongodb.com/cloud/atlas
   - Sign up for free account

2. **Create Cluster**

   - Click "Create a Cluster"
   - Select "M0 Free" tier
   - Choose region closest to you
   - Click "Create Cluster"

3. **Create Database User**

   - Go to "Database Access"
   - Click "Add New Database User"
   - Set username and password
   - Click "Add User"

4. **Get Connection String**

   - Go to "Clusters"
   - Click "Connect"
   - Choose "Connect your application"
   - Copy connection string
   - Replace `<password>` with your password

5. **Update .env**
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/capstone-db?retryWrites=true&w=majority
   ```

### Database Initialization

```bash
# Navigate to backend directory
cd backend

# Run database seeding (optional)
npm run db:import

# Clear database (if needed)
npm run db:clear

# Set admin password
npm run db:set-admin-password
```

---

## Verification

### Check Backend

```bash
# In backend directory, run:
npm run dev

# Expected output:
# Server running on port 8000
# MongoDB Connected: localhost
# Health check: http://localhost:8000/health
# API Docs: http://localhost:8000/api-docs
```

### Check Frontend

```bash
# In frontend directory, run:
npm run dev

# Expected output:
# VITE v5.x.x  ready in xxx ms
# ➜  Local:   http://localhost:5173/
# ➜  press h to show help
```

### Test API Endpoints

```bash
# Health check
curl http://localhost:8000/api/health

# Expected response:
# {"success":true,"message":"API is running","timestamp":"..."}
```

### Access Applications

| Service      | URL                              | Expected          |
| ------------ | -------------------------------- | ----------------- |
| Frontend     | http://localhost:5173            | Login page        |
| Backend API  | http://localhost:8000/api/health | JSON response     |
| Swagger Docs | http://localhost:8000/api-docs   | API documentation |

---

## Troubleshooting

### Common Issues

#### 1. Port Already in Use

**Problem:** `Error: listen EADDRINUSE: address already in use :::8000`

**Solution:**

```bash
# Find process using port 8000
lsof -i :8000  # macOS/Linux
netstat -ano | findstr :8000  # Windows

# Kill process
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows
```

#### 2. MongoDB Connection Failed

**Problem:** `MongooseError: Cannot connect to MongoDB`

**Solution:**

```bash
# Check if MongoDB is running
mongosh

# If not running, start it:
brew services start mongodb-community  # macOS
# or manually run: mongod

# Check connection string in .env
# Make sure MONGODB_URI is correct
```

#### 3. npm install Fails

**Problem:** `npm ERR! code ERESOLVE`

**Solution:**

```bash
# Clear npm cache
npm cache clean --force

# Install with legacy peer deps
npm install --legacy-peer-deps

# Or use npm 7+ with --force
npm install --force
```

#### 4. Google OAuth Not Working

**Problem:** `Error: Invalid client_id`

**Solution:**

1. Go to https://console.cloud.google.com
2. Create new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Copy Client ID and Secret to .env
6. Add callback URL: `http://localhost:8000/api/auth/google/callback`

#### 5. Cloudinary Upload Fails

**Problem:** `Error: Invalid Cloudinary credentials`

**Solution:**

1. Go to https://cloudinary.com
2. Sign up for free account
3. Get Cloud Name, API Key, API Secret from dashboard
4. Add to .env file

#### 6. Email Not Sending

**Problem:** `Error: Invalid login credentials`

**Solution:**

1. Use Gmail App Password (not regular password)
2. Enable 2-Factor Authentication on Gmail
3. Generate App Password: https://myaccount.google.com/apppasswords
4. Use App Password in SMTP_PASS

---

## Available Scripts

### Backend Scripts

```bash
# Development server with auto-reload
npm run dev

# Production server
npm start

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage

# Lint and fix code
npm run lint

# Format code with Prettier
npm run format

# Database operations
npm run db:clear          # Clear all data
npm run db:import         # Import CSV data
npm run db:set-admin-password  # Set admin password
```

### Frontend Scripts

```bash
# Development server
npm run dev

# Build for production
npm build

# Preview production build
npm run preview

# Run tests
npm test

# Run tests in UI mode
npm run test:ui

# Generate coverage report
npm run test:coverage

# Lint and fix code
npm run lint

# Format code with Prettier
npm run format
```

---

## Next Steps

1. ✅ Complete setup following this guide
2. 📖 Read [ARCHITECTURE.md](./docs/ARCHITECTURE.md) to understand system design
3. 📚 Read [API_REFERENCE.md](./docs/API_REFERENCE.md) for API endpoints
4. 👨‍💻 Read [DEVELOPER_GUIDE.md](./docs/DEVELOPER_GUIDE.md) for development workflow
5. 🤝 Read [CONTRIBUTING.md](./docs/CONTRIBUTING.md) for contribution guidelines

---

## Support

If you encounter issues:

1. Check [TROUBLESHOOTING.md](./docs/TROUBLESHOOTING.md) for more solutions
2. Check GitHub Issues: https://github.com/ustadzCoding/A25-CS246/issues
3. Contact: asah@dicoding.com

---

**Last Updated:** December 8, 2025 | **Version:** 1.0.0

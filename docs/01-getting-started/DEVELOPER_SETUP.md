# 🛠️ DEVELOPER SETUP GUIDE

Complete guide for setting up local development environment.

---

## 📋 Prerequisites

### System Requirements

- **OS:** Windows, macOS, or Linux
- **Node.js:** >= 18.x (LTS recommended)
- **npm:** >= 9.x
- **Git:** Latest version
- **RAM:** 4GB minimum
- **Disk Space:** 2GB minimum

### Verify Installation

```bash
node --version    # Should be >= 18.x
npm --version     # Should be >= 9.x
git --version     # Should be installed
```

---

## 🗄️ Database Setup

### Option 1: MongoDB Local (Recommended for Development)

#### Windows

1. Download: https://www.mongodb.com/try/download/community
2. Run installer with default settings
3. MongoDB will start automatically
4. Verify: Open `http://localhost:27017` (should show error page)

#### macOS

```bash
# Using Homebrew
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

#### Linux (Ubuntu)

```bash
sudo apt-get install -y mongodb
sudo systemctl start mongodb
sudo systemctl enable mongodb
```

### Option 2: MongoDB Atlas (Cloud)

1. Go to: https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create cluster (M0 free tier)
4. Get connection string: `mongodb+srv://user:pass@cluster.mongodb.net/dbname`
5. Use in `.env` file

---

## 📦 Backend Setup

### 1. Clone Repository

```bash
git clone https://github.com/[username]/A25-CS246.git
cd A25-CS246/backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

```bash
cp .env.example .env
```

Edit `.env` file:

```env
PORT=8000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/dicoding-capstone
JWT_SECRET=your-secret-key-here-min-32-chars
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173

# Google OAuth (optional for development)
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
FRONTEND_URL=http://localhost:5173

# Cloudinary (optional for development)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Email Service (optional for development)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM_EMAIL=your-email@gmail.com
```

### 4. Start Development Server

```bash
npm run dev
```

Output should show:

```
[INFO] Server running on http://localhost:8000
[INFO] Database connected to MongoDB
```

### 5. Verify Backend

```bash
curl http://localhost:8000/api/health
```

---

## 🎨 Frontend Setup

### 1. Navigate to Frontend

```bash
cd ../frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

```bash
cp .env.example .env
```

Edit `.env` file:

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

### 4. Start Development Server

```bash
npm run dev
```

Output should show:

```
VITE v7.1.14  ready in 500 ms

➜  Local:   http://localhost:5173/
➜  press h to show help
```

### 5. Open in Browser

Navigate to: `http://localhost:5173`

---

## 🔧 IDE Setup (VS Code Recommended)

### Recommended Extensions

1. **Vetur** - Vue 3 support
2. **ESLint** - Code linting
3. **Prettier** - Code formatting
4. **Thunder Client** - API testing
5. **MongoDB for VS Code** - Database management

### Settings (`.vscode/settings.json`)

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "[vue]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

---

## 📁 Project Structure

```
A25-CS246/
├── backend/
│   ├── src/
│   │   ├── config/        # Configuration files
│   │   ├── models/        # Database models
│   │   ├── controllers/   # Route handlers
│   │   ├── routes/        # API routes
│   │   ├── services/      # Business logic
│   │   ├── middleware/    # Custom middleware
│   │   └── server.js      # Entry point
│   ├── .env               # Environment variables
│   ├── package.json
│   └── README.md
│
├── frontend/
│   ├── src/
│   │   ├── components/    # Vue components
│   │   ├── views/         # Page components
│   │   ├── router/        # Vue Router config
│   │   ├── stores/        # Pinia stores
│   │   ├── services/      # API services
│   │   ├── App.vue        # Root component
│   │   └── main.js        # Entry point
│   ├── .env               # Environment variables
│   ├── vite.config.js     # Vite config
│   ├── package.json
│   └── README.md
│
└── docs/                  # Documentation
```

---

## 🧪 Running Tests

### Backend Tests

```bash
cd backend
npm run test              # Run all tests
npm run test:watch       # Watch mode
npm run test:coverage    # Coverage report
```

### Frontend Tests

```bash
cd frontend
npm run test             # Run all tests
npm run test:ui          # UI mode
npm run test:coverage    # Coverage report
```

---

## 🔍 Debugging

### Backend Debugging

```bash
# With Node debugger
node --inspect src/server.js

# In VS Code: F5 (requires launch.json)
```

### Frontend Debugging

1. Open DevTools: F12
2. Console tab for logs
3. Network tab for API calls
4. Vue DevTools extension for state

---

## 🚀 Common Commands

### Backend

```bash
npm run dev              # Start development server
npm start                # Start production server
npm run lint             # Run ESLint
npm run format           # Format with Prettier
npm run test             # Run tests
```

### Frontend

```bash
npm run dev              # Start development server
npm run build            # Build for production
npm run preview          # Preview production build
npm run lint             # Run ESLint
npm run format           # Format with Prettier
npm run test             # Run tests
```

---

## 🔐 Security Notes

- **Never commit `.env` file** - Already in `.gitignore`
- **Use strong JWT_SECRET** - Minimum 32 characters
- **Rotate API keys regularly** - Cloudinary, Google OAuth, etc.
- **Use HTTPS in production** - Not needed for local development
- **Validate all inputs** - Both frontend and backend

---

## 🐛 Troubleshooting

### Backend Won't Start

```bash
# Check if port is in use
lsof -i :8000  # macOS/Linux
netstat -ano | findstr :8000  # Windows

# Kill process on port 8000
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows
```

### MongoDB Connection Error

```bash
# Check if MongoDB is running
mongosh  # Should connect successfully

# If not running, start it:
# Windows: net start MongoDB
# macOS: brew services start mongodb-community
# Linux: sudo systemctl start mongodb
```

### Frontend Not Loading

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### CORS Errors

- Check `CORS_ORIGIN` in backend `.env`
- Should match frontend URL: `http://localhost:5173`

---

## 📚 Next Steps

1. [Quick Start](./QUICK_START.md) - 5-minute setup
2. [API Reference](../03-api/API_REFERENCE.md) - All endpoints
3. [Development Workflow](../04-development/DEVELOPMENT_WORKFLOW.md) - Git workflow
4. [Project Roadmap](../../ROADMAP.md) - Full plan

---

**Need help? Check [Troubleshooting Guide](../08-operations/TROUBLESHOOTING.md)**

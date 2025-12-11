# 👨‍💻 Developer Guide

Panduan development untuk DC-09 Capstone Project Management System.

---

## 📋 Table of Contents

1. [Development Setup](#development-setup)
2. [Project Structure](#project-structure)
3. [Frontend Development](#frontend-development)
4. [Backend Development](#backend-development)
5. [Code Style & Conventions](#code-style--conventions)
6. [Development Workflow](#development-workflow)
7. [Debugging & Testing](#debugging--testing)
8. [Common Tasks](#common-tasks)

---

## Development Setup

### Prerequisites

- Node.js 18+ LTS
- npm 9+
- MongoDB 7+ (local or Atlas)
- Git 2.40+
- Visual Studio Code (recommended)

### Initial Setup

```bash
# Clone repository
git clone https://github.com/ustadzCoding/A25-CS246.git
cd A25-CS246

# Install backend dependencies
cd backend
npm install
cp .env.example .env

# Install frontend dependencies
cd ../frontend
npm install
cp .env.example .env

# Start development servers
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend
cd frontend && npm run dev
```

### Environment Variables

**Backend (.env):**

```env
NODE_ENV=development
PORT=8000

# MongoDB - Use local or Atlas
# Local: mongodb://localhost:27017/capstone-db
# Atlas: mongodb+srv://user:pass@cluster.mongodb.net/capstone-db?retryWrites=true&w=majority&replicaSet=atlas-l46ddf-shard-0
MONGODB_URI=mongodb://localhost:27017/capstone-db

JWT_SECRET=dev_secret_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
SMTP_FROM_EMAIL=your_email@gmail.com
```

**Frontend (.env):**

```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_APP_NAME=DC-09 Capstone
VITE_APP_VERSION=1.0.0
```

---

## Project Structure

### Backend Structure

```
backend/src/
├── config/              # Configuration files
│   ├── database.js      # MongoDB connection
│   ├── swagger.js       # Swagger config
│   ├── cloudinary.js    # Cloudinary config
│   └── passport.js      # OAuth config
├── models/              # MongoDB schemas (14 models)
├── controllers/         # Route handlers (13 controllers)
├── services/            # Business logic (6 services)
├── middleware/          # Express middleware (12 files)
├── routes/              # API routes
├── docs/                # API documentation
├── utils/               # Utility functions
├── tests/               # Test files
└── server.js            # Entry point
```

### Frontend Structure

```
frontend/src/
├── components/          # Reusable components (28 files)
├── views/               # Page components (27 files)
├── stores/              # Pinia state management (8 stores)
├── services/            # API services (10 files)
├── router/              # Vue Router configuration
├── composables/         # Composition functions (5 files)
├── utils/               # Utility functions
├── assets/              # Static assets
├── tests/               # Test files
├── App.vue              # Root component
├── main.js              # Entry point
└── style.css            # Global styles
```

---

## Frontend Development

### Key Technologies

- **Vue 3** - Progressive JavaScript framework
- **Vite** - Next-gen build tool
- **Pinia** - State management
- **Vue Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS
- **Axios** - HTTP client

### Component Development

**Example Component:**

```vue
<template>
  <div class="bg-white p-4 rounded-lg">
    <h1 class="text-xl font-bold">{{ title }}</h1>
    <p class="text-gray-600">{{ description }}</p>
    <button
      @click="handleClick"
      class="bg-blue-500 text-white px-4 py-2 rounded"
    >
      Click Me
    </button>
  </div>
</template>

<script setup>
import { ref } from "vue";

const title = ref("Component Title");
const description = ref("Component description");

const handleClick = () => {
  console.log("Button clicked");
};
</script>

<style scoped>
/* Component styles */
</style>
```

### State Management (Pinia)

**Example Store:**

```javascript
import { defineStore } from "pinia";
import { ref } from "vue";

export const useTeamStore = defineStore("team", () => {
  const teams = ref([]);
  const currentTeam = ref(null);

  const fetchTeams = async () => {
    // Fetch teams from API
  };

  const selectTeam = (team) => {
    currentTeam.value = team;
  };

  return {
    teams,
    currentTeam,
    fetchTeams,
    selectTeam,
  };
});
```

### API Services

**Example Service:**

```javascript
import api from "./api";

export const teamService = {
  getTeams: () => api.get("/capstone-groups"),
  getTeamById: (id) => api.get(`/capstone-group/${id}`),
  registerTeam: (data) => api.post("/capstone-group/register", data),
  approveTeam: (id) => api.put(`/capstone-group/${id}/approve`),
  rejectTeam: (id, data) => api.put(`/capstone-group/${id}/reject`, data),
};
```

---

## Backend Development

### Key Technologies

- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Token authentication
- **Passport.js** - OAuth strategy
- **Swagger** - API documentation

### Controller Development

**Example Controller:**

```javascript
import CapstoneGroup from "../models/CapstoneGroup.js";

export const getAllCapstoneGroups = async (req, res) => {
  try {
    const groups = await CapstoneGroup.find()
      .populate("leaderId")
      .populate("membersUserId");

    res.status(200).json({
      success: true,
      data: groups,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
```

### Service Development

**Example Service:**

```javascript
import User from "../models/User.js";
import nodemailer from "nodemailer";

export const sendInvitationEmail = async (email, teamName) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject: `Invitation to join ${teamName}`,
    html: `<p>You have been invited to join ${teamName}</p>`,
  });
};
```

### Middleware Development

**Example Middleware:**

```javascript
import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      error: "No token provided",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      error: "Invalid token",
    });
  }
};
```

---

## Code Style & Conventions

### JavaScript Style

**Use ESLint:**

```bash
npm run lint      # Check code
npm run lint:fix  # Fix issues
```

**Use Prettier:**

```bash
npm run format    # Format code
```

**Naming Conventions:**

- Variables: camelCase
- Constants: UPPER_SNAKE_CASE
- Functions: camelCase
- Classes: PascalCase
- Files: camelCase (components: PascalCase)

### Vue.js Conventions

**Component Naming:**

- Single file components: PascalCase (UserProfile.vue)
- Props: camelCase
- Events: kebab-case
- Methods: camelCase

**Template:**

```vue
<template>
  <div class="component">
    <!-- Template content -->
  </div>
</template>
```

**Script:**

```vue
<script setup>
// Imports
// State
// Methods
// Lifecycle hooks
</script>
```

**Style:**

```vue
<style scoped>
/* Component styles */
</style>
```

---

## Development Workflow

### Creating Feature

```bash
# 1. Create feature branch
git checkout -b feature/your-feature-name

# 2. Make changes
# ... edit files ...

# 3. Test changes
npm test

# 4. Commit changes
git add .
git commit -m "feat(scope): description"

# 5. Push to remote
git push origin feature/your-feature-name

# 6. Create Pull Request on GitHub
```

### Code Review Checklist

- [ ] Code follows style guidelines
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] No breaking changes
- [ ] All tests passing

---

## Debugging & Testing

### Frontend Testing

```bash
# Run tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage

# UI mode
npm run test:ui
```

### Backend Testing

```bash
# Run tests
npm test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage
```

### Debugging

**Frontend:**

- Use Vue DevTools browser extension
- Use browser console (F12)
- Use VS Code debugger

**Backend:**

- Use console.log() for logging
- Use VS Code debugger
- Check logs in terminal

---

## Common Tasks

### Add New API Endpoint

1. Create controller method in `controllers/`
2. Add route in `routes/index.js`
3. Add Swagger documentation
4. Add tests in `tests/`
5. Update API_REFERENCE.md

### Add New Database Model

1. Create model in `models/`
2. Define schema and validations
3. Create indexes
4. Add relationships
5. Update DATABASE_SCHEMA.md

### Add New Frontend Page

1. Create component in `views/`
2. Add route in `router/index.js`
3. Create API service in `services/`
4. Create Pinia store if needed
5. Add tests

### Update Dependencies

```bash
# Check for updates
npm outdated

# Update all dependencies
npm update

# Update specific package
npm install package@latest

# Test after update
npm test
```

---

## Performance Tips

### Frontend

- Use lazy loading for routes
- Optimize images
- Minimize bundle size
- Use v-show instead of v-if for frequent toggles
- Implement pagination for lists

### Backend

- Add database indexes
- Use pagination for queries
- Implement caching
- Optimize database queries
- Use connection pooling

---

## Resources

- **Vue 3 Docs:** https://vuejs.org
- **Express Docs:** https://expressjs.com
- **MongoDB Docs:** https://docs.mongodb.com
- **Tailwind CSS:** https://tailwindcss.com
- **Pinia:** https://pinia.vuejs.org

---

## Important Notes

### MongoDB Setup

**For Local Development:**

```bash
# Start MongoDB locally
mongosh  # or mongo

# Create replica set (required for transactions)
rs.initiate()
```

**For MongoDB Atlas:**

- Replica set is automatically configured
- Add `replicaSet` parameter to connection string
- Example: `mongodb+srv://user:pass@cluster.mongodb.net/db?retryWrites=true&w=majority&replicaSet=atlas-l46ddf-shard-0`

### Email Configuration

**Gmail SMTP Setup:**

1. Enable 2FA on Gmail account
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Use port 465 (SSL) for better reliability
4. Set `SMTP_SECURE=true`

**Note:** Gmail SMTP may timeout on Railway. For production, consider SendGrid or Mailgun.

### Rate Limiting

Production rate limits:

- Global: 300 requests/15 minutes
- Auth: 50 requests/15 minutes

Adjust in `backend/src/middleware/security.js` if needed.

---

**Last Updated:** December 11, 2025 | **Version:** 1.0.1

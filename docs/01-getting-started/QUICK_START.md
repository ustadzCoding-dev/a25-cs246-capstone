# ⚡ QUICK START - 5 Minute Setup

**Get the project running in 5 minutes!**

---

## 📋 Prerequisites

- **Node.js** >= 18.x
- **npm** >= 9.x
- **MongoDB** (local or Atlas)
- **Git**

---

## 🚀 Quick Setup

### Step 1: Clone Repository

```bash
git clone https://github.com/[username]/A25-CS246.git
cd A25-CS246
```

### Step 2: Setup Backend (Terminal 1)

```bash
cd backend
npm install
cp .env.example .env
# Edit .env - set MONGODB_URI and JWT_SECRET
npm run dev
```

✅ Backend running at: `http://localhost:8000`

### Step 3: Setup Frontend (Terminal 2)

```bash
cd frontend
npm install
cp .env.example .env
# VITE_API_BASE_URL=http://localhost:8000/api (already set)
npm run dev
```

✅ Frontend running at: `http://localhost:5173`

---

## ✅ Verification

### Test Backend

```bash
curl http://localhost:8000/api/health
```

Expected response:

```json
{
  "success": true,
  "message": "API is running",
  "timestamp": "2025-11-29T..."
}
```

### Test Frontend

Open browser: `http://localhost:5173`

You should see the login page.

---

## 🔐 Test Login

**Default Admin Account:**

- Email: `admin@example.com`
- Password: `admin123`

**Or Create New Account:**

1. Click "Sign Up"
2. Fill form with email, password, learning path, university
3. Click "Register"
4. Login with credentials

---

## 🐛 Troubleshooting

| Issue                    | Solution                          |
| ------------------------ | --------------------------------- |
| Port 8000 already in use | Change PORT in backend/.env       |
| Port 5173 already in use | Vite will auto-use next port      |
| MongoDB connection error | Check MONGODB_URI in .env         |
| CORS error               | Check CORS_ORIGIN in backend/.env |
| Blank page on frontend   | Hard refresh: Ctrl+Shift+R        |

---

## 📚 Next Steps

- [Detailed Developer Setup](./DEVELOPER_SETUP.md) - Full setup guide
- [API Reference](../03-api/API_REFERENCE.md) - All endpoints
- [Project Roadmap](../../ROADMAP.md) - Full project plan

---

**Happy coding! 🎉**

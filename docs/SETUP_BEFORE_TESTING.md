# 🚀 SETUP GUIDE - SEBELUM TESTING

Panduan setup environment sebelum testing manual.

---

## 📋 QUICK SETUP CHECKLIST

### 1. CLONE & BRANCH

```bash
git clone https://github.com/ustadzCoding-dev/A25-CS246.git
cd A25-CS246
git checkout testing/manual-testing-setup
```

---

### 2. BACKEND SETUP

```bash
cd backend
npm install
```

**Create `.env` file:**

```
MONGODB_URI=mongodb://localhost:27017/capstone-dev
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d
PORT=8000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

**Start Backend:**

```bash
npm run dev
```

**Expected:** Server running on port 8000 ✅

---

### 3. FRONTEND SETUP

```bash
cd frontend
npm install
npm run dev
```

**Expected:** Frontend running on http://localhost:5173 ✅

---

### 4. DATABASE SETUP

**Verify MongoDB running:**

```bash
mongosh
use capstone-dev
show collections
```

**Create test users (copy-paste di mongosh):**

```javascript
db.users.insertMany([
  {
    _id: ObjectId(),
    studentId: "fui0001",
    name: "Lutfan Gunawan",
    email: "fui0001@student.devacademy.id",
    password: "hashed",
    role: "student",
    learningPath: "Front-End & Back-End with AI",
    createdAt: new Date(),
  },
  {
    _id: ObjectId(),
    studentId: "fui0002",
    name: "Andi Wijaya",
    email: "fui0002@student.devacademy.id",
    password: "hashed",
    role: "student",
    learningPath: "Front-End & Back-End with AI",
    createdAt: new Date(),
  },
  {
    _id: ObjectId(),
    studentId: "fui0003",
    name: "Budi Santoso",
    email: "fui0003@student.devacademy.id",
    password: "hashed",
    role: "student",
    learningPath: "Machine Learning",
    createdAt: new Date(),
  },
  {
    _id: ObjectId(),
    studentId: "fui0004",
    name: "Citra Dewi",
    email: "fui0004@student.devacademy.id",
    password: "hashed",
    role: "student",
    learningPath: "Machine Learning",
    createdAt: new Date(),
  },
  {
    _id: ObjectId(),
    studentId: "fui0005",
    name: "Doni Hermawan",
    email: "fui0005@student.devacademy.id",
    password: "hashed",
    role: "student",
    learningPath: "Machine Learning",
    createdAt: new Date(),
  },
]);
```

**Verify:**

```javascript
db.users.find({}).pretty();
```

---

### 5. BROWSER SETUP

Open 3 browser windows (Incognito):

- **Browser 1:** http://localhost:5173 (Student 1 - Leader)
- **Browser 2:** http://localhost:5173 (Student 2 - Member)
- **Browser 3:** http://localhost:5173 (Student 3 - Member)

**Open Developer Tools (F12)** di setiap browser → Console tab

---

### 6. MONGODB COMPASS

1. Open MongoDB Compass
2. Connect: `mongodb://localhost:27017`
3. Select database: `capstone-dev`
4. Verify collections exist

---

## ✅ VERIFICATION CHECKLIST

- [ ] Backend running on port 8000
- [ ] Frontend running on port 5173
- [ ] MongoDB connected
- [ ] 5 test users created
- [ ] 3 browsers open with console visible
- [ ] MongoDB Compass connected

---

## 🎯 READY TO TEST!

Setelah semua setup selesai, mulai testing dari **TESTING_MANUAL.md** - TEST 1.1

**Good luck!** 🚀

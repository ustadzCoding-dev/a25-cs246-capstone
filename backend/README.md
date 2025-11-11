# Backend - Dicoding Academic Dashboard

Express.js REST API for Capstone Project Management System.

## 🛠️ Tech Stack

- **Express.js 5** - Web framework
- **MongoDB 8** - NoSQL database
- **Mongoose 8** - MongoDB ODM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Joi** - Validation
- **Multer** - File upload
- **CORS** - Cross-origin resource sharing

## 📦 Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Edit .env with your configuration
```

## 🚀 Development

```bash
# Start development server (with nodemon)
npm run dev

# Start production server
npm start
```

## 📁 Project Structure

```
src/
├── config/
│   └── database.js
├── models/
│   ├── CapstoneGroup.js
│   ├── Counter.js
│   ├── Document.js
│   ├── index.js
│   ├── LearningGroup.js
│   ├── Timeline.js
│   ├── UseCase.js
│   └── User.js
├── controllers/
│   ├── authController.js
│   ├── capstoneGroupController.js
│   ├── documentController.js
│   ├── learningGroupController.js
│   ├── timelineController.js
│   ├── usecaseController.js
│   └── userController.js
├── routes/
│   └── index.js
├── scripts/
│   ├── fixAdminRole.js
│   └── seedData.js
├── middleware/
│   ├── auth.js
│   ├── errorHandler.js
│   ├── security.js
│   └── validate.js
├── validators/
├── utils/
│   └── logger.js
└── server.js
```

## 🔧 Environment Variables

Create `.env` file:

```env
PORT=8000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/capstone_test
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173
```

## 📡 API Endpoints

### Health Check

```http
GET: /api/health
```

**Response:**
```json
{
"success": true,
"message": "API is running",
"timestamp": "2025-11-10T18:29:48.077Z"
}
```

### Placeholder Routes

Routes will be added based on ERD design:

- `/api/auth` - Auth management
- `/api/capstone-groups` - Capstone group management
- `/api/documents` - Document management
- `/api/learning-groups` - Learning group management
- `/api/timelines` - Timeline management
- `/api/usecases` - Usecase management
- `/api/users` - User management

## 🗄️ Database

### MongoDB Setup

```bash
# Install MongoDB
# https://www.mongodb.com/try/download/community

# Start MongoDB
mongod

# Or use MongoDB Atlas (cloud)
# https://www.mongodb.com/cloud/atlas
```

### Connection

The app will automatically connect to MongoDB on startup using the `MONGODB_URI` from `.env`.

## 🔐 Authentication

JWT-based authentication is configured:

- Tokens are sent in `Authorization: Bearer <token>` header
- Middleware: `authenticate` and `authorize`
- Token expiration: 7 days (configurable)

## 🧪 Testing

```bash
# Run tests (to be implemented)
npm test
```

## 📚 API Documentation

API documentation will be added using:
- Postman collection
- Swagger/OpenAPI (optional)

## 🚀 Deployment

### Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Deploy
railway up
```

### Environment Variables (Production)

Set these in Railway dashboard:
- `NODE_ENV=production`
- `MONGODB_URI=<your-mongodb-atlas-uri>`
- `JWT_SECRET=<strong-secret-key>`
- `CORS_ORIGIN=<your-frontend-url>`

## 👥 Team

Tim A25-CS246 - Dicoding Indonesia x Accenture

**Happy Testing! 🧪**

**Last Updated:** 11 November 2025

**Maintained by:** Tim A25-CS246


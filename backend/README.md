# Backend - Dicoding Academic Dashboard

Express.js REST API for Capstone Project Management System.

## 🛠️ Tech Stack

- **Express.js 5** - Web framework
- **MongoDB 8** - NoSQL database
- **Mongoose 8** - MongoDB ODM
- **JWT + Bcrypt** - Authentication & password hashing
- **Passport.js** - Google OAuth 2.0
- **Multer** - File upload
- **Cloudinary** - Image storage & CDN
- **Nodemailer** - Email service
- **Joi** - Validation
- **Helmet** - Security headers
- **Express Rate Limit** - Rate limiting
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
│   ├── database.js
│   ├── cloudinary.js
│   └── passport.js
├── models/ (14 models)
│   ├── User.js
│   ├── LearningPath.js
│   ├── CapstoneGroup.js
│   ├── Invitation.js
│   ├── Document.js
│   ├── Timeline.js
│   ├── Announcement.js
│   ├── Worksheet.js
│   ├── WorksheetPeriod.js
│   ├── UseCase.js
│   ├── LearningGroup.js
│   ├── Counter.js
│   └── index.js
├── controllers/ (13 controllers)
│   ├── authController.js
│   ├── userController.js
│   ├── capstoneGroupController.js
│   ├── invitationController.js
│   ├── documentController.js
│   ├── timelineController.js
│   ├── announcementController.js
│   ├── worksheetController.js
│   ├── usecaseController.js
│   ├── learningPathController.js
│   ├── learningGroupController.js
│   ├── dashboardController.js
│   └── index.js
├── routes/
│   └── index.js
├── services/
│   ├── TeamService.js
│   ├── CloudinaryService.js
│   ├── EmailService.js
│   └── index.js
├── middleware/
│   ├── auth.js
│   ├── errorHandler.js
│   ├── security.js
│   ├── validate.js
│   └── multerProfilePicture.js
├── validators/
├── utils/
│   └── logger.js
├── scripts/
│   ├── seedData.js
│   ├── fixAdminRole.js
│   └── index.js
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

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
FRONTEND_URL=http://localhost:5173

# Cloudinary (Profile Picture Upload)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Email Service (Nodemailer)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM_EMAIL=your-email@gmail.com
```

## 📡 API Endpoints

### Health Check

```http
GET /api/health
```

**Response:**

```json
{
  "success": true,
  "message": "API is running",
  "timestamp": "2025-11-10T18:29:48.077Z"
}
```

### Main API Routes

- `/api/auth` - Authentication (login, register, Google OAuth, profile completion)
- `/api/users` - User management (profile, picture upload, update)
- `/api/capstone-groups` - Team management (create, edit, approve, reject)
- `/api/invitations` - Team invitations (create, accept, reject)
- `/api/documents` - Document management (upload, download, categorize)
- `/api/timelines` - Timeline management (create, update, view milestones)
- `/api/announcements` - Announcement management (create, edit, delete)
- `/api/worksheets` - Worksheet submission & validation
- `/api/learning-paths` - Learning path management
- `/api/usecases` - Use case management
- `/api/learning-groups` - Learning group management
- `/api/dashboard` - Dashboard statistics & overview

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

**Last Updated:** 29 November 2025

**Maintained by:** Tim A25-CS246

---

## 📚 Additional Resources

- [API Reference](../docs/03-api/API_REFERENCE.md) - Complete API documentation
- [Database Schema](../docs/02-architecture/DATABASE_SCHEMA.md) - Database models & relationships
- [Developer Setup](../docs/01-getting-started/DEVELOPER_SETUP.md) - Detailed setup guide
- [Roadmap](../ROADMAP.md) - Project roadmap & timeline

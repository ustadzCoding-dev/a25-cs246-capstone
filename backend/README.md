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
│   └── database.js      # MongoDB connection
├── models/              # Mongoose models (to be added)
├── controllers/         # Route controllers (to be added)
├── routes/
│   └── index.js         # API routes
├── middleware/
│   ├── auth.js          # Authentication middleware
│   └── errorHandler.js  # Error handling
├── validators/          # Joi validators (to be added)
├── utils/
│   └── logger.js        # Logging utility
└── server.js            # Entry point
```

## 🔧 Environment Variables

Create `.env` file:

```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/dicoding-capstone
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173
```

## 📡 API Endpoints

### Health Check

```
GET /health
GET /api/health
```

**Response:**
```json
{
  "status": "ok",
  "message": "Server is running",
  "timestamp": "2025-11-07T00:15:00.000Z",
  "environment": "development"
}
```

### Placeholder Routes

Routes will be added based on ERD design:

- `/api/teams` - Team management
- `/api/documents` - Document management
- `/api/timelines` - Timeline management
- `/api/users` - User management
- `/api/auth` - Authentication

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

## 📝 Development Notes

### Models (To be added after ERD)

Example structure:
```javascript
// models/Team.js
import mongoose from 'mongoose'

const teamSchema = new mongoose.Schema({
  name: String,
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  status: { type: String, enum: ['pending', 'approved', 'rejected'] }
}, { timestamps: true })

export default mongoose.model('Team', teamSchema)
```

### Controllers (To be added)

Example structure:
```javascript
// controllers/teamController.js
export const createTeam = async (req, res, next) => {
  try {
    // Logic here
    res.status(201).json({ success: true, data: team })
  } catch (error) {
    next(error)
  }
}
```

### Validators (To be added)

Example structure:
```javascript
// validators/teamValidator.js
import Joi from 'joi'

export const createTeamSchema = Joi.object({
  name: Joi.string().required(),
  members: Joi.array().items(Joi.string()).min(1).required()
})
```

## 👥 Team

Tim A25-CS246 - Dicoding Indonesia x Accenture

## 📄 License

MIT

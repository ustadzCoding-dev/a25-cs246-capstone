import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import swaggerUi from 'swagger-ui-express'
import connectDB from './config/database.js'
import routes from './routes/index.js'
import errorHandler from './middleware/errorHandler.js'
import logger from './utils/logger.js'
import swaggerSpec from './config/swagger.js'
import {
  helmetMiddleware,
  limiter,
  sanitizeData,
  preventXSS,
  preventHPP,
  customHeaders
} from './middleware/security.js'

// Load environment variables
dotenv.config()

// Initialize Express app
const app = express()
const PORT = process.env.PORT || 3000

// Connect to MongoDB
connectDB()

// Security Middleware (apply first)
app.use(helmetMiddleware)
app.use(customHeaders)
app.use(limiter)
app.use(preventHPP)

// CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}))

// Body parsers
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Note: mongo-sanitize and xss-clean removed due to compatibility issues
// Input validation is handled by Joi schemas in routes

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`)
  next()
})

// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Dicoding Capstone API Docs',
}))

// Swagger JSON endpoint
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  res.send(swaggerSpec)
})

// Routes
app.use('/api', routes)

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: false,
    message: 'Route not found'
  })
})

// Error handler
app.use(errorHandler)

// Start server
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`)
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`)
  logger.info(`Health check: http://localhost:${PORT}/health`)
})

export default app

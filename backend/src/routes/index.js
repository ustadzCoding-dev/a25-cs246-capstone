import express from 'express'

const router = express.Router()

// Health check for API
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString()
  })
})

// Placeholder routes - will be added based on ERD
// Example:
// import teamRoutes from './teamRoutes.js'
// import documentRoutes from './documentRoutes.js'
// import timelineRoutes from './timelineRoutes.js'
// 
// router.use('/teams', teamRoutes)
// router.use('/documents', documentRoutes)
// router.use('/timelines', timelineRoutes)

export default router

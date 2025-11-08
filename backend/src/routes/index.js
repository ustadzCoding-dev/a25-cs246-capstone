import express from 'express'
import authRoutes from './authRoutes.js'
import teamRoutes from './teamRoutes.js'

const router = express.Router()

// Health check for API
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString()
  })
})

// Auth routes
router.use('/auth', authRoutes)

// Team routes
router.use('/teams', teamRoutes)

// Placeholder routes - will be added later
// import documentRoutes from './documentRoutes.js'
// import timelineRoutes from './timelineRoutes.js'
// import useCaseRoutes from './useCaseRoutes.js'
// 
// router.use('/documents', documentRoutes)
// router.use('/timeline', timelineRoutes)
// router.use('/usecases', useCaseRoutes)

export default router

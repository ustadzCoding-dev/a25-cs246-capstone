import express from 'express';
import authRoutes from './auth.js';
import upload from '../middleware/multer.js';
import { protect } from '../middleware/auth.js';
import { adminOnly, studentOnly } from '../middleware/authorize.js';
import { validate, teamSchema, documentSchema, timelineSchema, announcementSchema } from '../utils/validators.js';

// Controllers
import { getAllUsers, getUserById, updateUserProfile } from '../controllers/userController.js';
import { getAllCapstoneGroups, registerTeam, approveCapstoneGroup, rejectCapstoneGroup, deleteCapstoneGroup, getCapstoneGroupById } from '../controllers/capstoneGroupController.js';
import { getAllDocuments, getDocumentById, addDocument, deleteDocument, downloadDocument } from '../controllers/documentController.js';
import { getAllTimelines, addTimeline, updateTimeline, deleteTimeline, getTimelineById, getTimelineStats } from '../controllers/timelineController.js';
import { getAnnouncements, getAnnouncementById, createAnnouncement, updateAnnouncement, deleteAnnouncement, markAnnouncementAsRead } from '../controllers/announcementController.js';
import { getDashboardStats, getStudentDashboardStats } from '../controllers/dashboardController.js';

const router = express.Router();

// ========== API INFO ==========
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Dicoding Capstone API',
    version: '2.0.0',
    endpoints: {
      health: '/api/health',
      docs: '/api-docs',
      auth: {
        local: '/api/auth/login (OLD), /api/auth/register (OLD)',
        google: '/api/auth/google (NEW)',
        refresh: '/api/auth/refresh (NEW)',
        me: '/api/auth/me (NEW)'
      }
    }
  });
});

// ========== HEALTH CHECK ==========
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
    googleOAuth: process.env.GOOGLE_CLIENT_ID ? 'configured' : 'not configured'
  });
});

// ========== AUTH ROUTES ==========
// ⭐ REGISTER AUTH ROUTES (Google OAuth + New Local Auth)
router.use('/auth', authRoutes);

// ⭐ OLD AUTH ROUTES (Backward Compatibility)
// Keep these for existing clients, but recommend migrating to /api/auth/*
// router.post("/auth/login", loginUser); // OLD: Keep for compatibility
// router.post("/auth/register", registerUser); // OLD: Keep for compatibility

// ========== USERS ==========
router.get('/users', protect, getAllUsers);
router.get('/user/profile', protect, getUserById);
router.put('/user/profile/update', protect, updateUserProfile);

// ========== CAPSTONE GROUPS ==========
// Student: Register team
router.post('/capstone-group/register', protect, studentOnly, validate(teamSchema.create), registerTeam);

// All: View teams
router.get('/capstone-groups', protect, getAllCapstoneGroups);
router.get('/capstone-group/:id', protect, getCapstoneGroupById);

// Admin: Approve/Reject/Delete teams
router.put('/capstone-group/:id/approve', protect, adminOnly, approveCapstoneGroup);
router.put('/capstone-group/:id/reject', protect, adminOnly, validate(teamSchema.reject), rejectCapstoneGroup);
router.delete('/capstone-group/:id', protect, adminOnly, deleteCapstoneGroup);

// ========== DOCUMENTS ==========
// All: View documents
router.get('/documents', protect, getAllDocuments);
router.get('/document/:id', protect, getDocumentById);
router.get('/document/:id/download', protect, downloadDocument);

// Admin: Upload/Delete documents
router.post('/document/add', protect, adminOnly, upload.single('file'), validate(documentSchema.create), addDocument);
router.delete('/document/:id', protect, adminOnly, deleteDocument);

// ========== TIMELINES ==========
// All: View timelines
router.get('/timelines', protect, getAllTimelines);
router.get('/timeline/:id', protect, getTimelineById);
router.get('/timeline/stats', protect, adminOnly, getTimelineStats);

// Admin: Create/Update/Delete timelines
router.post('/timeline/add', protect, adminOnly, validate(timelineSchema.create), addTimeline);
router.put('/timeline/:id', protect, adminOnly, validate(timelineSchema.update), updateTimeline);
router.delete('/timeline/:id', protect, adminOnly, deleteTimeline);

// ========== ANNOUNCEMENTS ==========
// All: View announcements
router.get('/announcements', protect, getAnnouncements);
router.get('/announcements/:id', protect, getAnnouncementById);
router.post('/announcements/:id/read', protect, markAnnouncementAsRead);

// Admin: Create/Update/Delete announcements
router.post('/announcements', protect, adminOnly, validate(announcementSchema.create), createAnnouncement);
router.put('/announcements/:id', protect, adminOnly, validate(announcementSchema.update), updateAnnouncement);
router.delete('/announcements/:id', protect, adminOnly, deleteAnnouncement);

// ========== DASHBOARD ==========
// Admin: Dashboard stats
router.get('/dashboard/stats', protect, adminOnly, getDashboardStats);

// Student: Student dashboard stats
router.get('/dashboard/student-stats', protect, studentOnly, getStudentDashboardStats);

export default router;

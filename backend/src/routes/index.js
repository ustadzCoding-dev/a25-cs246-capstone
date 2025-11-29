import express from 'express';
import authRoutes from './auth.js';
import upload from '../middleware/multer.js';
import uploadProfilePicture from '../middleware/multerProfilePicture.js';
import { uploadEvidence } from '../middleware/multerWorksheet.js';
import { protect } from '../middleware/auth.js';
import { adminOnly, studentOnly } from '../middleware/authorize.js';
import {
  validate,
  teamSchema,
  timelineSchema,
  announcementSchema,
  worksheetPeriodSchema,
  worksheetSchema
} from '../utils/validators.js';
import { parseFormDataFields } from '../middleware/parseFormData.js';
import { asyncHandler } from '../utils/errorHandler.js';
import User from '../models/User.js';

// Controllers
import {
  getAllUsers,
  getUserById,
  updateUserProfile,
  changePassword,
  uploadProfilePictureController,
  deleteProfilePictureController
} from '../controllers/userController.js';
import {
  getAllCapstoneGroups,
  registerTeam,
  editTeam,
  approveCapstoneGroup,
  rejectCapstoneGroup,
  deleteCapstoneGroup,
  getCapstoneGroupById,
  getCurrentCapstoneGroup,
  setTeamComposition,
  updateCapstoneGroup
} from '../controllers/capstoneGroupController.js';
import {
  getAllDocuments,
  getDocumentById,
  addDocument,
  updateDocument,
  deleteDocument,
  restoreDocument,
  downloadDocument
} from '../controllers/documentController.js';
import {
  getAllTimelines,
  addTimeline,
  updateTimeline,
  deleteTimeline,
  getTimelineById,
  getTimelineStats
} from '../controllers/timelineController.js';
import {
  getAnnouncements,
  getAnnouncementById,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  markAnnouncementAsRead
} from '../controllers/announcementController.js';
import { getDashboardStats, getStudentDashboardStats } from '../controllers/dashboardController.js';
import {
  getPendingInvitations,
  getTeamInvitations,
  createInvitation,
  acceptInvitation,
  rejectInvitation,
  deleteInvitation
} from '../controllers/invitationController.js';
import {
  getAllLearningPaths,
  getLearningPathById,
  createLearningPath,
  updateLearningPath,
  deleteLearningPath,
  toggleLearningPathStatus
} from '../controllers/learningPathController.js';
import {
  getAllPeriods,
  getPeriodById,
  createPeriod,
  updatePeriod,
  deletePeriod,
  activatePeriod,
  closePeriod,
  getMyWorksheets,
  getMyWorksheetByPeriod,
  saveWorksheetDraft,
  submitWorksheet,
  uploadEvidence as uploadEvidenceController,
  removeEvidence,
  getWorksheetsByPeriod,
  getValidationStats,
  validateWorksheet,
  runAutoValidation,
  exportWorksheetData,
  exportWorksheetCSV,
  sendReminderNotifications,
  getWorksheetDetail
} from '../controllers/worksheetController.js';

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
router.put('/user/password/change', protect, changePassword);
router.post(
  '/user/profile-picture/upload',
  protect,
  uploadProfilePicture.single('profilePicture'),
  uploadProfilePictureController
);
router.delete('/user/profile-picture/delete', protect, deleteProfilePictureController);

// ========== LEARNING PATHS ==========
// Get all active learning paths (public - for student profile)
router.get('/learning-paths', async (req, res) => {
  try {
    const LearningPath = (await import('../models/LearningPath.js')).default;
    const paths = await LearningPath.find({ isActive: true }).sort({ name: 1 });

    res.success(paths, 'Learning paths retrieved', 200);
  } catch (err) {
    console.error('Failed to fetch learning paths:', err);
    res.error('Failed to fetch learning paths', 500);
  }
});

// Admin: Manage learning paths
router.get('/admin/learning-paths', protect, adminOnly, getAllLearningPaths);
router.get('/admin/learning-paths/:id', protect, adminOnly, getLearningPathById);
router.post('/admin/learning-paths', protect, adminOnly, createLearningPath);
router.put('/admin/learning-paths/:id', protect, adminOnly, updateLearningPath);
router.delete('/admin/learning-paths/:id', protect, adminOnly, deleteLearningPath);
router.put('/admin/learning-paths/:id/toggle', protect, adminOnly, toggleLearningPathStatus);

// Student lookup by ID (for team registration - public)
router.get('/students/lookup/:studentId', async (req, res) => {
  try {
    const { studentId } = req.params;
    const User = (await import('../models/User.js')).default;

    // Find by studentId (coding ID like fui0001) or email
    const student = await User.findOne({
      $or: [{ studentId: studentId }, { email: { $regex: `^${studentId}`, $options: 'i' } }]
    }).select('_id studentId name email learningPathId learningPathName');

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    res.success(
      {
        id: student._id,
        studentId: student.studentId,
        name: student.name,
        email: student.email,
        learningPathId: student.learningPathId,
        learningPathName: student.learningPathName
      },
      'Student found',
      200
    );
  } catch (err) {
    console.error('Failed to lookup student:', err);
    res.error('Failed to lookup student', 500);
  }
});

// ========== CAPSTONE GROUPS ==========
// Student: Register team
router.post(
  '/capstone-group/register',
  protect,
  studentOnly,
  validate(teamSchema.create),
  registerTeam
);

// Student: Edit pending team (Leader only)
router.put('/capstone-group/:id/edit', protect, studentOnly, validate(teamSchema.edit), editTeam);

// All: View teams
router.get('/capstone-groups', protect, getAllCapstoneGroups);
router.get('/capstone-group/current', protect, getCurrentCapstoneGroup);
router.get('/capstone-group/:id', protect, getCapstoneGroupById);

// Admin: Approve/Reject/Delete teams
router.put('/capstone-group/:id/approve', protect, adminOnly, approveCapstoneGroup);
router.put(
  '/capstone-group/:id/reject',
  protect,
  adminOnly,
  validate(teamSchema.reject),
  rejectCapstoneGroup
);
router.put('/capstone-group/update/:id', protect, adminOnly, updateCapstoneGroup);
router.delete('/capstone-group/:id', protect, adminOnly, deleteCapstoneGroup);

// Admin: Debug - Clear all member capstoneGroupId
router.post(
  '/admin/debug/clear-members',
  protect,
  adminOnly,
  asyncHandler(async (req, res) => {
    const result = await User.updateMany(
      { capstoneGroupId: { $exists: true, $ne: null } },
      { $set: { capstoneGroupId: null } }
    );
    console.log('[DEBUG] Cleared capstoneGroupId from', result.modifiedCount, 'members');
    res.success({ modifiedCount: result.modifiedCount }, 'Members cleared', 200);
  })
);

// Admin: Set team composition for use case
router.put('/usecase/:usecaseId/team-composition', protect, adminOnly, setTeamComposition);

// ========== DOCUMENTS ==========
// All: View documents
router.get('/documents', protect, getAllDocuments);
router.get('/document/:id', protect, getDocumentById);
router.get('/document/:id/download', protect, downloadDocument);

// Admin: Upload/Delete documents
// Note: Validator middleware removed because it cannot handle FormData
// Validation is done in DocumentService instead
router.post(
  '/document/add',
  protect,
  adminOnly,
  upload.single('file'),
  parseFormDataFields,
  addDocument
);
router.put('/document/:id', protect, adminOnly, parseFormDataFields, updateDocument);
router.delete('/document/:id', protect, adminOnly, deleteDocument);
router.put('/document/:id/restore', protect, adminOnly, restoreDocument);

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
router.post(
  '/announcements',
  protect,
  adminOnly,
  validate(announcementSchema.create),
  createAnnouncement
);
router.put(
  '/announcements/:id',
  protect,
  adminOnly,
  validate(announcementSchema.update),
  updateAnnouncement
);
router.delete('/announcements/:id', protect, adminOnly, deleteAnnouncement);

// ========== USE CASES ==========
// All: View use cases (PUBLIC - no auth required)
router.get('/usecases', async (req, res) => {
  try {
    const UseCase = (await import('../models/UseCase.js')).default;
    const useCases = await UseCase.find();
    res.success(useCases, 'Use cases retrieved successfully', 200);
  } catch (err) {
    console.error('Failed to fetch use cases:', err);
    res.error('Failed to fetch use cases', 500);
  }
});

// Admin: Create use case
router.post('/usecases', protect, adminOnly, async (req, res) => {
  try {
    const UseCase = (await import('../models/UseCase.js')).default;
    const { usecaseId, title, description, partner, totalSlots, difficulty } = req.body;

    // Validate required fields
    if (!usecaseId || !title || !description || !totalSlots) {
      return res.error('Missing required fields', 400);
    }

    // Create new use case
    const newUseCase = await UseCase.create({
      usecaseId,
      title,
      description,
      partner: partner || '',
      totalSlots,
      availableSlots: totalSlots,
      difficulty: difficulty || 'medium',
      status: 'open'
    });

    res.success(newUseCase, 'Use case created successfully', 201);
  } catch (err) {
    console.error('Failed to create use case:', err);
    res.error('Failed to create use case', 500);
  }
});

// Admin: Delete use case
router.delete('/usecases/:id', protect, adminOnly, async (req, res) => {
  try {
    const UseCase = (await import('../models/UseCase.js')).default;
    const { id } = req.params;

    const deletedUseCase = await UseCase.findByIdAndDelete(id);

    if (!deletedUseCase) {
      return res.error('Use case not found', 404);
    }

    res.success(deletedUseCase, 'Use case deleted successfully', 200);
  } catch (err) {
    console.error('Failed to delete use case:', err);
    res.error('Failed to delete use case', 500);
  }
});

// ========== INVITATIONS ==========
// Student: Get pending invitations
router.get('/invitations', protect, getPendingInvitations);

// Leader: Get team invitations
router.get('/invitations/team/:teamId', protect, getTeamInvitations);

// Leader: Create invitation
router.post('/invitations', protect, createInvitation);

// Student: Accept invitation
router.put('/invitations/:id/accept', protect, acceptInvitation);

// Student: Reject invitation
router.put('/invitations/:id/reject', protect, rejectInvitation);

// Admin/Leader: Delete invitation
router.delete('/invitations/:id', protect, deleteInvitation);

// ========== DASHBOARD ==========
// Admin: Dashboard stats
router.get('/dashboard/stats', protect, adminOnly, getDashboardStats);

// Student: Student dashboard stats
router.get('/dashboard/student-stats', protect, studentOnly, getStudentDashboardStats);

// ========== WORKSHEET / CHECK-IN PROGRESS ==========
// All: Get all periods
router.get('/worksheet/periods', protect, getAllPeriods);
router.get('/worksheet/periods/:id', protect, getPeriodById);

// Student: Worksheet management
router.get('/worksheet/my-worksheets', protect, studentOnly, getMyWorksheets);
router.get('/worksheet/my-worksheets/:periodId', protect, studentOnly, getMyWorksheetByPeriod);
router.post(
  '/worksheet/save-draft/:periodId',
  protect,
  studentOnly,
  validate(worksheetSchema.saveDraft),
  saveWorksheetDraft
);
router.post(
  '/worksheet/submit/:periodId',
  protect,
  studentOnly,
  validate(worksheetSchema.submit),
  submitWorksheet
);
router.post(
  '/worksheet/upload-evidence/:periodId',
  protect,
  studentOnly,
  (req, res, next) => {
    uploadEvidence(req, res, (err) => {
      if (err) {
        console.error('[uploadEvidence middleware] Error:', err.message);
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            success: false,
            error: { code: 'FILE_TOO_LARGE', message: 'File size exceeds 5MB limit' }
          });
        }
        if (err.code === 'LIMIT_FILE_COUNT') {
          return res.status(400).json({
            success: false,
            error: { code: 'TOO_MANY_FILES', message: 'Maximum 5 files allowed' }
          });
        }
        if (err.message && err.message.includes('File type')) {
          return res.status(400).json({
            success: false,
            error: { code: 'INVALID_FILE_TYPE', message: err.message }
          });
        }
        return res.status(400).json({
          success: false,
          error: { code: 'UPLOAD_ERROR', message: err.message || 'File upload failed' }
        });
      }
      next();
    });
  },
  uploadEvidenceController
);
router.delete('/worksheet/evidence/:periodId/:evidenceId', protect, studentOnly, removeEvidence);

// Admin: Period management
router.post(
  '/worksheet/periods',
  protect,
  adminOnly,
  validate(worksheetPeriodSchema.create),
  createPeriod
);
router.put(
  '/worksheet/periods/:id',
  protect,
  adminOnly,
  validate(worksheetPeriodSchema.update),
  updatePeriod
);
router.delete('/worksheet/periods/:id', protect, adminOnly, deletePeriod);
router.put('/worksheet/periods/:id/activate', protect, adminOnly, activatePeriod);
router.put('/worksheet/periods/:id/close', protect, adminOnly, closePeriod);

// Admin: Worksheet validation and management
router.get('/worksheet/admin/period/:periodId', protect, adminOnly, getWorksheetsByPeriod);
router.get('/worksheet/admin/period/:periodId/stats', protect, adminOnly, getValidationStats);
router.get('/worksheet/admin/detail/:worksheetId', protect, adminOnly, getWorksheetDetail);
router.put(
  '/worksheet/admin/validate/:worksheetId',
  protect,
  adminOnly,
  validate(worksheetSchema.validate),
  validateWorksheet
);
router.post(
  '/worksheet/admin/period/:periodId/auto-validate',
  protect,
  adminOnly,
  runAutoValidation
);
router.get('/worksheet/admin/period/:periodId/export', protect, adminOnly, exportWorksheetData);
router.get('/worksheet/admin/period/:periodId/export-csv', protect, adminOnly, exportWorksheetCSV);
router.post(
  '/worksheet/admin/period/:periodId/send-reminders',
  protect,
  adminOnly,
  sendReminderNotifications
);

export default router;

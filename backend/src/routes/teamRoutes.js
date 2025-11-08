import express from 'express'
import {
  createTeam,
  getAllTeams,
  getTeamById,
  updateTeam,
  submitTeam,
  approveTeam,
  rejectTeam,
  deleteTeam
} from '../controllers/teamController.js'
import { authenticate, authorize } from '../middleware/auth.js'
import validate from '../middleware/validate.js'
import {
  createTeamSchema,
  updateTeamSchema,
  rejectTeamSchema,
  getTeamsQuerySchema
} from '../validators/teamValidator.js'

const router = express.Router()

/**
 * @route   POST /api/teams
 * @desc    Create new team
 * @access  Private (Student)
 */
router.post(
  '/',
  authenticate,
  authorize('student', 'admin'),
  validate(createTeamSchema),
  createTeam
)

/**
 * @route   GET /api/teams
 * @desc    Get all teams (with filters)
 * @access  Private
 */
router.get(
  '/',
  authenticate,
  validate(getTeamsQuerySchema, 'query'),
  getAllTeams
)

/**
 * @route   GET /api/teams/:id
 * @desc    Get team by ID
 * @access  Private
 */
router.get('/:id', authenticate, getTeamById)

/**
 * @route   PUT /api/teams/:id
 * @desc    Update team
 * @access  Private (Team Leader or Admin)
 */
router.put(
  '/:id',
  authenticate,
  validate(updateTeamSchema),
  updateTeam
)

/**
 * @route   POST /api/teams/:id/submit
 * @desc    Submit team for validation
 * @access  Private (Team Leader)
 */
router.post('/:id/submit', authenticate, submitTeam)

/**
 * @route   POST /api/teams/:id/approve
 * @desc    Approve team
 * @access  Private (Admin only)
 */
router.post(
  '/:id/approve',
  authenticate,
  authorize('admin'),
  approveTeam
)

/**
 * @route   POST /api/teams/:id/reject
 * @desc    Reject team
 * @access  Private (Admin only)
 */
router.post(
  '/:id/reject',
  authenticate,
  authorize('admin'),
  validate(rejectTeamSchema),
  rejectTeam
)

/**
 * @route   DELETE /api/teams/:id
 * @desc    Delete team
 * @access  Private (Team Leader or Admin)
 */
router.delete('/:id', authenticate, deleteTeam)

export default router

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
 * @swagger
 * /api/teams:
 *   post:
 *     summary: Create a new capstone team
 *     tags: [Teams]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - teamName
 *               - memberIds
 *             properties:
 *               teamName:
 *                 type: string
 *                 example: Team Innovation
 *               memberIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 minItems: 2
 *                 maxItems: 4
 *                 example: ["user_id_1", "user_id_2", "user_id_3"]
 *     responses:
 *       201:
 *         description: Team created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Team created successfully
 *                 data:
 *                   $ref: '#/components/schemas/Team'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */
router.post(
  '/',
  authenticate,
  authorize('student', 'admin'),
  validate(createTeamSchema),
  createTeam
)

/**
 * @swagger
 * /api/teams:
 *   get:
 *     summary: Get all teams with optional filters
 *     tags: [Teams]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [draft, pending, approved, rejected]
 *         description: Filter by team status
 *       - in: query
 *         name: learningPath
 *         schema:
 *           type: string
 *           enum: [Front-End, Back-End, Multi-Platform, React, Machine Learning]
 *         description: Filter by learning path
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Items per page
 *     responses:
 *       200:
 *         description: Teams retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Team'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                     pages:
 *                       type: integer
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
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

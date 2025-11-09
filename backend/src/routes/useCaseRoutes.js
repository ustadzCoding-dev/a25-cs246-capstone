import express from 'express';
import {
  getAllUseCases,
  getUseCaseById,
  createUseCase,
  updateUseCase,
  deleteUseCase,
} from '../controllers/useCaseController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import validate from '../middleware/validate.js';
import {
  createUseCaseSchema,
  updateUseCaseSchema,
  getUseCasesQuerySchema,
} from '../validators/useCaseValidator.js';

const router = express.Router();

/**
 * @swagger
 * /api/use-cases:
 *   get:
 *     summary: Get all use cases
 *     tags: [Use Cases]
 *     parameters:
 *       - in: query
 *         name: learningPath
 *         schema:
 *           type: string
 *           enum: [Front-End, Back-End, Multi-Platform, React, Machine Learning]
 *         description: Filter by learning path
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *         description: Filter by active status
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
 *         description: Use cases retrieved successfully
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
 *                     type: object
 *                 pagination:
 *                   type: object
 */
router.get(
  '/',
  validate(getUseCasesQuerySchema, 'query'),
  getAllUseCases
);

/**
 * @swagger
 * /api/use-cases/{id}:
 *   get:
 *     summary: Get use case by ID
 *     tags: [Use Cases]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Use case ID
 *     responses:
 *       200:
 *         description: Use case retrieved successfully
 *       404:
 *         description: Use case not found
 */
router.get('/:id', getUseCaseById);

/**
 * @swagger
 * /api/use-cases:
 *   post:
 *     summary: Create a new use case (Admin only)
 *     tags: [Use Cases]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - useCaseCode
 *               - title
 *               - description
 *               - partner
 *               - learningPath
 *             properties:
 *               useCaseCode:
 *                 type: string
 *                 example: ASAH-UC-001
 *               title:
 *                 type: string
 *                 example: E-Commerce Platform
 *               description:
 *                 type: string
 *                 example: Build a complete e-commerce platform with payment integration
 *               partner:
 *                 type: string
 *                 example: Tokopedia
 *               learningPath:
 *                 type: string
 *                 enum: [Front-End, Back-End, Multi-Platform, React, Machine Learning]
 *                 example: Front-End
 *               isActive:
 *                 type: boolean
 *                 default: true
 *     responses:
 *       201:
 *         description: Use case created successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       409:
 *         description: Use case code already exists
 */
router.post(
  '/',
  authenticate,
  authorize('admin'),
  validate(createUseCaseSchema),
  createUseCase
);

/**
 * @swagger
 * /api/use-cases/{id}:
 *   put:
 *     summary: Update use case (Admin only)
 *     tags: [Use Cases]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Use case ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               partner:
 *                 type: string
 *               learningPath:
 *                 type: string
 *                 enum: [Front-End, Back-End, Multi-Platform, React, Machine Learning]
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Use case updated successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         description: Use case not found
 */
router.put(
  '/:id',
  authenticate,
  authorize('admin'),
  validate(updateUseCaseSchema),
  updateUseCase
);

/**
 * @swagger
 * /api/use-cases/{id}:
 *   delete:
 *     summary: Delete use case (Admin only)
 *     tags: [Use Cases]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Use case ID
 *     responses:
 *       200:
 *         description: Use case deleted successfully
 *       400:
 *         description: Cannot delete - use case is being used by teams
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         description: Use case not found
 */
router.delete(
  '/:id',
  authenticate,
  authorize('admin'),
  deleteUseCase
);

export default router;

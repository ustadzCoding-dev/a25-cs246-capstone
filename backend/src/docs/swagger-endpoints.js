/**
 * SWAGGER DOCUMENTATION FOR ALL ENDPOINTS
 * This file contains JSDoc comments for all API endpoints
 * Auto-generated Swagger UI at: http://localhost:8000/api-docs
 */

// ============================================================================
// AUTHENTICATION ENDPOINTS
// ============================================================================

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Register new user
 *     description: Create a new user account with email and password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - learningPath
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "john@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 example: "SecurePass123!"
 *               learningPath:
 *                 type: string
 *                 enum: ["Front-End", "Back-End", "Multi-Platform", "React", "Machine Learning"]
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Validation error or user already exists
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Login user
 *     description: Authenticate user with email and password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *                     accessToken:
 *                       type: string
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Logout user
 *     description: Clear user session and tokens
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     tags:
 *       - Authentication
 *     summary: Get current user
 *     description: Retrieve authenticated user information
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User data retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */

// ============================================================================
// USER ENDPOINTS
// ============================================================================

/**
 * @swagger
 * /api/users:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get all users
 *     description: Retrieve list of all users (Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: ["student", "admin"]
 *         description: Filter by user role
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */

/**
 * @swagger
 * /api/user/profile:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get user profile
 *     description: Retrieve authenticated user's profile information
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */

/**
 * @swagger
 * /api/user/profile/update:
 *   put:
 *     tags:
 *       - Users
 *     summary: Update user profile
 *     description: Update authenticated user's profile information
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               learningPath:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */

/**
 * @swagger
 * /api/user/password/change:
 *   put:
 *     tags:
 *       - Users
 *     summary: Change password
 *     description: Change authenticated user's password
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *                 format: password
 *               newPassword:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Invalid current password
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */

/**
 * @swagger
 * /api/user/profile-picture/upload:
 *   post:
 *     tags:
 *       - Users
 *     summary: Upload profile picture
 *     description: Upload or update user's profile picture
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - profilePicture
 *             properties:
 *               profilePicture:
 *                 type: string
 *                 format: binary
 *                 description: Profile picture file (JPG, PNG, max 5MB)
 *     responses:
 *       200:
 *         description: Profile picture uploaded successfully
 *       400:
 *         description: Invalid file format or size
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */

/**
 * @swagger
 * /api/user/profile-picture/delete:
 *   delete:
 *     tags:
 *       - Users
 *     summary: Delete profile picture
 *     description: Remove user's profile picture
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile picture deleted successfully
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 */

/**
 * @swagger
 * /api/users/{id}/role:
 *   put:
 *     tags:
 *       - Users
 *     summary: Change user role
 *     description: Change user role (Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - role
 *             properties:
 *               role:
 *                 type: string
 *                 enum: ["student", "admin"]
 *     responses:
 *       200:
 *         description: User role updated
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */

// ============================================================================
// LEARNING PATHS ENDPOINTS
// ============================================================================

/**
 * @swagger
 * /api/learning-paths:
 *   get:
 *     tags:
 *       - Learning Paths
 *     summary: Get all active learning paths
 *     description: Retrieve list of active learning paths (Public endpoint)
 *     responses:
 *       200:
 *         description: Learning paths retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       code:
 *                         type: string
 *                       isActive:
 *                         type: boolean
 */

/**
 * @swagger
 * /api/admin/learning-paths:
 *   get:
 *     tags:
 *       - Learning Paths
 *     summary: Get all learning paths (Admin)
 *     description: Retrieve all learning paths including inactive ones (Admin only)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Learning paths retrieved
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *   post:
 *     tags:
 *       - Learning Paths
 *     summary: Create learning path
 *     description: Create a new learning path (Admin only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - code
 *               - dicodingIdPrefix
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Front-End Web Development"
 *               code:
 *                 type: string
 *                 example: "FE"
 *               dicodingIdPrefix:
 *                 type: string
 *                 example: "FE"
 *               description:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *                 default: true
 *     responses:
 *       201:
 *         description: Learning path created
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */

/**
 * @swagger
 * /api/admin/learning-paths/{id}:
 *   get:
 *     tags:
 *       - Learning Paths
 *     summary: Get learning path by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Learning path retrieved
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *   put:
 *     tags:
 *       - Learning Paths
 *     summary: Update learning path
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               code:
 *                 type: string
 *               description:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Learning path updated
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *   delete:
 *     tags:
 *       - Learning Paths
 *     summary: Delete learning path
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Learning path deleted
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */

/**
 * @swagger
 * /api/admin/learning-paths/{id}/toggle:
 *   put:
 *     tags:
 *       - Learning Paths
 *     summary: Toggle learning path status
 *     description: Activate or deactivate a learning path
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Learning path status toggled
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */

// ============================================================================
// CAPSTONE TEAMS ENDPOINTS
// ============================================================================

/**
 * @swagger
 * /api/capstone-group/register:
 *   post:
 *     tags:
 *       - Teams
 *     summary: Register new team
 *     description: Create and register a new capstone team (Student only)
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
 *               - useCaseId
 *               - membersUserId
 *             properties:
 *               teamName:
 *                 type: string
 *                 example: "Team Alpha"
 *               useCaseId:
 *                 type: string
 *                 description: Use case ID
 *               membersUserId:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of member user IDs
 *     responses:
 *       201:
 *         description: Team registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Team'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */

/**
 * @swagger
 * /api/capstone-groups:
 *   get:
 *     tags:
 *       - Teams
 *     summary: Get all teams
 *     description: Retrieve list of all capstone teams
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: ["pending", "approved", "rejected"]
 *       - in: query
 *         name: useCaseId
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Teams retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Team'
 */

/**
 * @swagger
 * /api/capstone-group/current:
 *   get:
 *     tags:
 *       - Teams
 *     summary: Get current user's team
 *     description: Retrieve the capstone team of the authenticated user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Team retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Team'
 *       404:
 *         description: User is not in a team
 */

/**
 * @swagger
 * /api/capstone-group/{id}:
 *   get:
 *     tags:
 *       - Teams
 *     summary: Get team by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Team retrieved
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */

/**
 * @swagger
 * /api/capstone-group/{id}/edit:
 *   put:
 *     tags:
 *       - Teams
 *     summary: Edit pending team
 *     description: Edit team members (Leader only, team must be pending)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               membersUserId:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Team updated
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       403:
 *         description: Only team leader can edit
 */

/**
 * @swagger
 * /api/capstone-group/{id}/approve:
 *   put:
 *     tags:
 *       - Teams
 *     summary: Approve team
 *     description: Approve a pending team (Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Team approved
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */

/**
 * @swagger
 * /api/capstone-group/{id}/reject:
 *   put:
 *     tags:
 *       - Teams
 *     summary: Reject team
 *     description: Reject a pending team with reason (Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rejectionReason:
 *                 type: string
 *     responses:
 *       200:
 *         description: Team rejected
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */

/**
 * @swagger
 * /api/capstone-group/{id}:
 *   delete:
 *     tags:
 *       - Teams
 *     summary: Delete team
 *     description: Delete a team (Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Team deleted
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */

/**
 * @swagger
 * /api/capstone-group/export-csv:
 *   get:
 *     tags:
 *       - Teams
 *     summary: Export teams to CSV
 *     description: Export all teams data to CSV file (Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: ["pending", "approved", "rejected"]
 *       - in: query
 *         name: useCaseId
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: CSV file generated
 *         content:
 *           text/csv:
 *             schema:
 *               type: string
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */

/**
 * @swagger
 * /api/capstone-group/bulk-approve:
 *   post:
 *     tags:
 *       - Teams
 *     summary: Bulk approve teams
 *     description: Approve multiple teams at once (Admin only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - teamIds
 *             properties:
 *               teamIds:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Teams approved
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */

/**
 * @swagger
 * /api/capstone-group/bulk-reject:
 *   post:
 *     tags:
 *       - Teams
 *     summary: Bulk reject teams
 *     description: Reject multiple teams at once (Admin only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - teamIds
 *             properties:
 *               teamIds:
 *                 type: array
 *                 items:
 *                   type: string
 *               rejectionReason:
 *                 type: string
 *     responses:
 *       200:
 *         description: Teams rejected
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */

/**
 * @swagger
 * /api/capstone-group/bulk-delete:
 *   post:
 *     tags:
 *       - Teams
 *     summary: Bulk delete teams
 *     description: Delete multiple teams at once (Admin only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - teamIds
 *             properties:
 *               teamIds:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Teams deleted
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */

// ============================================================================
// INVITATIONS ENDPOINTS
// ============================================================================

/**
 * @swagger
 * /api/invitations:
 *   get:
 *     tags:
 *       - Invitations
 *     summary: Get pending invitations
 *     description: Retrieve pending team invitations for current user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Invitations retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       teamId:
 *                         type: string
 *                       status:
 *                         type: string
 *                         enum: ["pending", "accepted", "rejected"]
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 */

/**
 * @swagger
 * /api/invitations/{id}/accept:
 *   put:
 *     tags:
 *       - Invitations
 *     summary: Accept invitation
 *     description: Accept a team invitation
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Invitation accepted
 *       400:
 *         description: Invitation already accepted or team not found
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */

/**
 * @swagger
 * /api/invitations/{id}/reject:
 *   put:
 *     tags:
 *       - Invitations
 *     summary: Reject invitation
 *     description: Reject a team invitation
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rejectionReason:
 *                 type: string
 *     responses:
 *       200:
 *         description: Invitation rejected
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */

/**
 * @swagger
 * /api/invitations/team/{teamId}:
 *   get:
 *     tags:
 *       - Invitations
 *     summary: Get team invitations
 *     description: Retrieve all invitations for a specific team (Leader/Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: teamId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Team invitations retrieved
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */

/**
 * @swagger
 * /api/invitations/{id}:
 *   delete:
 *     tags:
 *       - Invitations
 *     summary: Delete invitation
 *     description: Delete a team invitation (Leader/Admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Invitation deleted
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */

// ============================================================================
// DOCUMENTS ENDPOINTS
// ============================================================================

/**
 * @swagger
 * /api/documents:
 *   get:
 *     tags:
 *       - Documents
 *     summary: Get all documents
 *     description: Retrieve list of all capstone guidance documents
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Documents retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       title:
 *                         type: string
 *                       description:
 *                         type: string
 *                       fileUrl:
 *                         type: string
 *                       uploadedAt:
 *                         type: string
 *                         format: date-time
 */

/**
 * @swagger
 * /api/document/add:
 *   post:
 *     tags:
 *       - Documents
 *     summary: Upload document
 *     description: Upload a new capstone guidance document (Admin only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *               - title
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Document uploaded
 *       400:
 *         description: Invalid file or missing fields
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */

/**
 * @swagger
 * /api/document/{id}:
 *   get:
 *     tags:
 *       - Documents
 *     summary: Get document by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Document retrieved
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *   put:
 *     tags:
 *       - Documents
 *     summary: Update document
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Document updated
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *   delete:
 *     tags:
 *       - Documents
 *     summary: Delete document
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Document deleted
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */

/**
 * @swagger
 * /api/document/{id}/download:
 *   get:
 *     tags:
 *       - Documents
 *     summary: Download document
 *     description: Download a document file
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: File downloaded
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */

// ============================================================================
// TIMELINE ENDPOINTS
// ============================================================================

/**
 * @swagger
 * /api/timelines:
 *   get:
 *     tags:
 *       - Timeline
 *     summary: Get all timelines
 *     description: Retrieve list of capstone project timelines
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Timelines retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       title:
 *                         type: string
 *                       description:
 *                         type: string
 *                       startDate:
 *                         type: string
 *                         format: date-time
 *                       endDate:
 *                         type: string
 *                         format: date-time
 */

/**
 * @swagger
 * /api/timeline/add:
 *   post:
 *     tags:
 *       - Timeline
 *     summary: Create timeline
 *     description: Create a new capstone timeline (Admin only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - startDate
 *               - endDate
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date-time
 *               endDate:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Timeline created
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */

/**
 * @swagger
 * /api/timeline/{id}:
 *   get:
 *     tags:
 *       - Timeline
 *     summary: Get timeline by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Timeline retrieved
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *   put:
 *     tags:
 *       - Timeline
 *     summary: Update timeline
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
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
 *               startDate:
 *                 type: string
 *                 format: date-time
 *               endDate:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Timeline updated
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *   delete:
 *     tags:
 *       - Timeline
 *     summary: Delete timeline
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Timeline deleted
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */

// ============================================================================
// ANNOUNCEMENTS ENDPOINTS
// ============================================================================

/**
 * @swagger
 * /api/announcements:
 *   get:
 *     tags:
 *       - Announcements
 *     summary: Get all announcements
 *     description: Retrieve list of announcements
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Announcements retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       title:
 *                         type: string
 *                       content:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *   post:
 *     tags:
 *       - Announcements
 *     summary: Create announcement
 *     description: Create a new announcement (Admin only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Announcement created
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */

/**
 * @swagger
 * /api/announcements/{id}:
 *   get:
 *     tags:
 *       - Announcements
 *     summary: Get announcement by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Announcement retrieved
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 *   put:
 *     tags:
 *       - Announcements
 *     summary: Update announcement
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Announcement updated
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 *   delete:
 *     tags:
 *       - Announcements
 *     summary: Delete announcement
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Announcement deleted
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */

// ============================================================================
// USE CASES ENDPOINTS
// ============================================================================

/**
 * @swagger
 * /api/use-cases:
 *   get:
 *     tags:
 *       - Use Cases
 *     summary: Get all use cases
 *     description: Retrieve list of all capstone use cases
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Use cases retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       useCaseId:
 *                         type: string
 *                       title:
 *                         type: string
 *                       description:
 *                         type: string
 *                       composition:
 *                         type: object
 *                       totalSlots:
 *                         type: integer
 *                       availableSlots:
 *                         type: integer
 */

/**
 * @swagger
 * /api/use-cases/{id}:
 *   get:
 *     tags:
 *       - Use Cases
 *     summary: Get use case by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Use case retrieved
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */

// ============================================================================
// STUDENTS LOOKUP ENDPOINTS
// ============================================================================

/**
 * @swagger
 * /api/students/lookup/{studentId}:
 *   get:
 *     tags:
 *       - Students
 *     summary: Lookup student by ID
 *     description: Get student information by student/user ID (Public endpoint)
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: string
 *         description: Student ID or User ID
 *     responses:
 *       200:
 *         description: Student found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     learningPath:
 *                       type: string
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */

// ============================================================================
// HEALTH CHECK ENDPOINTS
// ============================================================================

/**
 * @swagger
 * /api/health:
 *   get:
 *     tags:
 *       - Health
 *     summary: Health check
 *     description: Check if API is running (Public endpoint)
 *     responses:
 *       200:
 *         description: API is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 */

// ============================================================================
// WORKSHEET ENDPOINTS (PHASE 2 - FUTURE)
// ============================================================================
// NOTE: Worksheet feature is planned for Phase 2 (Q2 2026)
// These endpoints are documented for future implementation
// Currently DISABLED in MVP

// ============================================================================
// DASHBOARD ENDPOINTS
// ============================================================================

/**
 * @swagger
 * /api/dashboard/stats:
 *   get:
 *     tags:
 *       - Dashboard
 *     summary: Get admin dashboard stats
 *     description: Retrieve dashboard statistics (Admin only)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Stats retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalTeams:
 *                       type: integer
 *                     pendingTeams:
 *                       type: integer
 *                     approvedTeams:
 *                       type: integer
 *                     totalStudents:
 *                       type: integer
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */

/**
 * @swagger
 * /api/dashboard/student-stats:
 *   get:
 *     tags:
 *       - Dashboard
 *     summary: Get student dashboard stats
 *     description: Retrieve student dashboard statistics (Student only)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Stats retrieved
 *       403:
 *         $ref: '#/components/responses/ForbiddenError'
 */

export default {};

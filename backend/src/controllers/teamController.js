import { CapstoneGroup, User, UseCase } from '../models/index.js'
import logger from '../utils/logger.js'

/**
 * @route   POST /api/teams
 * @desc    Create new team
 * @access  Private (Student)
 */
export const createTeam = async (req, res, next) => {
  try {
    const { capstoneGroupId, teamName, members, leaderId } = req.body
    const userId = req.user.userId

    // Check if user already in a team
    const user = await User.findById(userId)
    if (user.capstoneGroupId) {
      return res.status(400).json({
        success: false,
        message: 'You are already in a team'
      })
    }

    // Check if team ID already exists
    const existingTeam = await CapstoneGroup.findOne({ capstoneGroupId })
    if (existingTeam) {
      return res.status(409).json({
        success: false,
        message: 'Team ID already exists'
      })
    }

    // Verify all members exist
    const memberIds = members.map(m => m.userId)
    const allMembers = await User.find({ _id: { $in: memberIds } })
    
    if (allMembers.length !== memberIds.length) {
      return res.status(400).json({
        success: false,
        message: 'One or more members not found'
      })
    }

    // Check if any member is already in a team
    const membersInTeam = allMembers.filter(m => m.capstoneGroupId)
    if (membersInTeam.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Some members are already in a team: ${membersInTeam.map(m => m.name).join(', ')}`
      })
    }

    // Verify leader is in members list
    if (!memberIds.includes(leaderId)) {
      return res.status(400).json({
        success: false,
        message: 'Leader must be a member of the team'
      })
    }

    // Create team
    const team = await CapstoneGroup.create({
      capstoneGroupId,
      teamName,
      members: members.map(m => ({
        userId: m.userId,
        role: m.userId.toString() === leaderId.toString() ? 'leader' : 'member',
        joinedAt: new Date()
      })),
      leaderId,
      status: 'draft'
    })

    // Update all members' capstoneGroupId
    await User.updateMany(
      { _id: { $in: memberIds } },
      { capstoneGroupId: team._id }
    )

    logger.info(`Team created: ${capstoneGroupId} by user ${userId}`)

    // Populate team data
    const populatedTeam = await CapstoneGroup.findById(team._id)
      .populate('members.userId', 'name email learningPath')
      .populate('leaderId', 'name email')

    res.status(201).json({
      success: true,
      message: 'Team created successfully',
      data: populatedTeam
    })
  } catch (error) {
    logger.error(`Create team error: ${error.message}`)
    next(error)
  }
}

/**
 * @route   GET /api/teams
 * @desc    Get all teams (with filters)
 * @access  Private
 */
export const getAllTeams = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query
    const userId = req.user.userId
    const userRole = req.user.role

    // Build query
    const query = {}
    if (status) query.status = status

    // Students can only see their own team and approved teams
    if (userRole === 'student') {
      const user = await User.findById(userId)
      query.$or = [
        { _id: user.capstoneGroupId },
        { status: 'approved' }
      ]
    }

    // Pagination
    const skip = (page - 1) * limit
    const total = await CapstoneGroup.countDocuments(query)

    const teams = await CapstoneGroup.find(query)
      .populate('members.userId', 'name email learningPath')
      .populate('leaderId', 'name email')
      .populate('selectedUseCaseId', 'useCaseCode title partner')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))

    res.status(200).json({
      success: true,
      data: {
        teams,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: parseInt(limit)
        }
      }
    })
  } catch (error) {
    logger.error(`Get teams error: ${error.message}`)
    next(error)
  }
}

/**
 * @route   GET /api/teams/:id
 * @desc    Get team by ID
 * @access  Private
 */
export const getTeamById = async (req, res, next) => {
  try {
    const { id } = req.params

    const team = await CapstoneGroup.findById(id)
      .populate('members.userId', 'name email learningPath university')
      .populate('leaderId', 'name email')
      .populate('selectedUseCaseId')
      .populate('validatedBy', 'name email')

    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      })
    }

    res.status(200).json({
      success: true,
      data: team
    })
  } catch (error) {
    logger.error(`Get team error: ${error.message}`)
    next(error)
  }
}

/**
 * @route   PUT /api/teams/:id
 * @desc    Update team
 * @access  Private (Team Leader)
 */
export const updateTeam = async (req, res, next) => {
  try {
    const { id } = req.params
    const userId = req.user.userId
    const {
      teamName,
      projectTitle,
      projectDescription,
      githubRepo,
      demoUrl,
      selectedUseCaseId
    } = req.body

    const team = await CapstoneGroup.findById(id)

    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      })
    }

    // Check if user is team leader
    if (team.leaderId.toString() !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only team leader can update team'
      })
    }

    // Can only update if status is draft or rejected
    if (!['draft', 'rejected'].includes(team.status) && req.user.role !== 'admin') {
      return res.status(400).json({
        success: false,
        message: `Cannot update team with status: ${team.status}`
      })
    }

    // Update fields
    if (teamName) team.teamName = teamName
    if (projectTitle) team.projectTitle = projectTitle
    if (projectDescription) team.projectDescription = projectDescription
    if (githubRepo) team.githubRepo = githubRepo
    if (demoUrl) team.demoUrl = demoUrl

    // Handle use case change
    if (selectedUseCaseId && selectedUseCaseId !== team.selectedUseCaseId?.toString()) {
      // Release old slot if exists
      if (team.selectedUseCaseId) {
        const oldUseCase = await UseCase.findById(team.selectedUseCaseId)
        if (oldUseCase) {
          await oldUseCase.releaseSlot()
        }
      }

      // Reserve new slot
      const newUseCase = await UseCase.findById(selectedUseCaseId)
      if (!newUseCase) {
        return res.status(404).json({
          success: false,
          message: 'Use case not found'
        })
      }

      if (!newUseCase.hasAvailableSlots()) {
        return res.status(400).json({
          success: false,
          message: 'No available slots for this use case'
        })
      }

      await newUseCase.reserveSlot()
      team.selectedUseCaseId = selectedUseCaseId
    }

    await team.save()

    logger.info(`Team updated: ${team.capstoneGroupId}`)

    const updatedTeam = await CapstoneGroup.findById(id)
      .populate('members.userId', 'name email learningPath')
      .populate('selectedUseCaseId')

    res.status(200).json({
      success: true,
      message: 'Team updated successfully',
      data: updatedTeam
    })
  } catch (error) {
    logger.error(`Update team error: ${error.message}`)
    next(error)
  }
}

/**
 * @route   POST /api/teams/:id/submit
 * @desc    Submit team for validation
 * @access  Private (Team Leader)
 */
export const submitTeam = async (req, res, next) => {
  try {
    const { id } = req.params
    const userId = req.user.userId

    const team = await CapstoneGroup.findById(id)
      .populate('members.userId', 'learningPath')

    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      })
    }

    // Check if user is team leader
    if (team.leaderId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Only team leader can submit team'
      })
    }

    // Validate team composition
    const validation = await team.validateComposition()
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: validation.message
      })
    }

    // Check if use case is selected
    if (!team.selectedUseCaseId) {
      return res.status(400).json({
        success: false,
        message: 'Please select a use case before submitting'
      })
    }

    // Submit team
    await team.submitForValidation()

    logger.info(`Team submitted for validation: ${team.capstoneGroupId}`)

    res.status(200).json({
      success: true,
      message: 'Team submitted for validation',
      data: {
        status: team.status,
        submittedAt: team.submittedAt
      }
    })
  } catch (error) {
    logger.error(`Submit team error: ${error.message}`)
    next(error)
  }
}

/**
 * @route   POST /api/teams/:id/approve
 * @desc    Approve team
 * @access  Private (Admin)
 */
export const approveTeam = async (req, res, next) => {
  try {
    const { id } = req.params
    const adminId = req.user.userId

    const team = await CapstoneGroup.findById(id)

    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      })
    }

    if (team.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Cannot approve team with status: ${team.status}`
      })
    }

    await team.approve(adminId)

    logger.info(`Team approved: ${team.capstoneGroupId} by admin ${adminId}`)

    res.status(200).json({
      success: true,
      message: 'Team approved successfully',
      data: {
        status: team.status,
        validatedBy: team.validatedBy,
        validatedAt: team.validatedAt
      }
    })
  } catch (error) {
    logger.error(`Approve team error: ${error.message}`)
    next(error)
  }
}

/**
 * @route   POST /api/teams/:id/reject
 * @desc    Reject team
 * @access  Private (Admin)
 */
export const rejectTeam = async (req, res, next) => {
  try {
    const { id } = req.params
    const { reason } = req.body
    const adminId = req.user.userId

    if (!reason) {
      return res.status(400).json({
        success: false,
        message: 'Rejection reason is required'
      })
    }

    const team = await CapstoneGroup.findById(id)

    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      })
    }

    if (team.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `Cannot reject team with status: ${team.status}`
      })
    }

    await team.reject(adminId, reason)

    // Release use case slot
    if (team.selectedUseCaseId) {
      const useCase = await UseCase.findById(team.selectedUseCaseId)
      if (useCase) {
        await useCase.releaseSlot()
      }
    }

    logger.info(`Team rejected: ${team.capstoneGroupId} by admin ${adminId}`)

    res.status(200).json({
      success: true,
      message: 'Team rejected',
      data: {
        status: team.status,
        rejectionReason: team.rejectionReason,
        validatedBy: team.validatedBy,
        validatedAt: team.validatedAt
      }
    })
  } catch (error) {
    logger.error(`Reject team error: ${error.message}`)
    next(error)
  }
}

/**
 * @route   DELETE /api/teams/:id
 * @desc    Delete team
 * @access  Private (Team Leader or Admin)
 */
export const deleteTeam = async (req, res, next) => {
  try {
    const { id } = req.params
    const userId = req.user.userId
    const userRole = req.user.role

    const team = await CapstoneGroup.findById(id)

    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found'
      })
    }

    // Check permission
    if (team.leaderId.toString() !== userId && userRole !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only team leader or admin can delete team'
      })
    }

    // Cannot delete approved teams
    if (team.status === 'approved' && userRole !== 'admin') {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete approved team'
      })
    }

    // Release use case slot
    if (team.selectedUseCaseId) {
      const useCase = await UseCase.findById(team.selectedUseCaseId)
      if (useCase) {
        await useCase.releaseSlot()
      }
    }

    // Remove team reference from users
    const memberIds = team.members.map(m => m.userId)
    await User.updateMany(
      { _id: { $in: memberIds } },
      { capstoneGroupId: null }
    )

    // Delete team
    await CapstoneGroup.findByIdAndDelete(id)

    logger.info(`Team deleted: ${team.capstoneGroupId}`)

    res.status(200).json({
      success: true,
      message: 'Team deleted successfully'
    })
  } catch (error) {
    logger.error(`Delete team error: ${error.message}`)
    next(error)
  }
}

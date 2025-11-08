import Joi from 'joi'

/**
 * Validation schema for team creation
 */
export const createTeamSchema = Joi.object({
  capstoneGroupId: Joi.string()
    .required()
    .trim()
    .uppercase()
    .pattern(/^[A-Z0-9-]+$/)
    .messages({
      'string.empty': 'Team ID is required',
      'string.pattern.base': 'Team ID must contain only uppercase letters, numbers, and hyphens',
      'any.required': 'Team ID is required'
    }),

  teamName: Joi.string()
    .required()
    .trim()
    .min(3)
    .max(100)
    .messages({
      'string.empty': 'Team name is required',
      'string.min': 'Team name must be at least 3 characters',
      'string.max': 'Team name must not exceed 100 characters',
      'any.required': 'Team name is required'
    }),

  members: Joi.array()
    .items(
      Joi.object({
        userId: Joi.string()
          .required()
          .pattern(/^[0-9a-fA-F]{24}$/)
          .messages({
            'string.empty': 'Member user ID is required',
            'string.pattern.base': 'Invalid user ID format',
            'any.required': 'Member user ID is required'
          }),
        role: Joi.string()
          .optional()
          .valid('leader', 'member')
          .default('member')
      })
    )
    .min(3)
    .max(5)
    .required()
    .messages({
      'array.min': 'Team must have at least 3 members',
      'array.max': 'Team must not exceed 5 members',
      'any.required': 'Team members are required'
    }),

  leaderId: Joi.string()
    .required()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .messages({
      'string.empty': 'Team leader is required',
      'string.pattern.base': 'Invalid leader ID format',
      'any.required': 'Team leader is required'
    })
})

/**
 * Validation schema for team update
 */
export const updateTeamSchema = Joi.object({
  teamName: Joi.string()
    .optional()
    .trim()
    .min(3)
    .max(100)
    .messages({
      'string.min': 'Team name must be at least 3 characters',
      'string.max': 'Team name must not exceed 100 characters'
    }),

  projectTitle: Joi.string()
    .optional()
    .trim()
    .min(5)
    .max(200)
    .messages({
      'string.min': 'Project title must be at least 5 characters',
      'string.max': 'Project title must not exceed 200 characters'
    }),

  projectDescription: Joi.string()
    .optional()
    .trim()
    .min(20)
    .max(2000)
    .messages({
      'string.min': 'Project description must be at least 20 characters',
      'string.max': 'Project description must not exceed 2000 characters'
    }),

  githubRepo: Joi.string()
    .optional()
    .trim()
    .uri()
    .pattern(/^https?:\/\/(www\.)?github\.com\/[\w-]+\/[\w-]+/)
    .messages({
      'string.uri': 'Please provide a valid URL',
      'string.pattern.base': 'Please provide a valid GitHub repository URL'
    }),

  demoUrl: Joi.string()
    .optional()
    .trim()
    .uri()
    .messages({
      'string.uri': 'Please provide a valid demo URL'
    }),

  selectedUseCaseId: Joi.string()
    .optional()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .messages({
      'string.pattern.base': 'Invalid use case ID format'
    })
})

/**
 * Validation schema for team rejection
 */
export const rejectTeamSchema = Joi.object({
  reason: Joi.string()
    .required()
    .trim()
    .min(10)
    .max(500)
    .messages({
      'string.empty': 'Rejection reason is required',
      'string.min': 'Rejection reason must be at least 10 characters',
      'string.max': 'Rejection reason must not exceed 500 characters',
      'any.required': 'Rejection reason is required'
    })
})

/**
 * Validation schema for query parameters
 */
export const getTeamsQuerySchema = Joi.object({
  status: Joi.string()
    .optional()
    .valid('draft', 'pending', 'approved', 'rejected', 'completed')
    .messages({
      'any.only': 'Invalid status value'
    }),

  page: Joi.number()
    .optional()
    .integer()
    .min(1)
    .default(1)
    .messages({
      'number.base': 'Page must be a number',
      'number.integer': 'Page must be an integer',
      'number.min': 'Page must be at least 1'
    }),

  limit: Joi.number()
    .optional()
    .integer()
    .min(1)
    .max(100)
    .default(10)
    .messages({
      'number.base': 'Limit must be a number',
      'number.integer': 'Limit must be an integer',
      'number.min': 'Limit must be at least 1',
      'number.max': 'Limit must not exceed 100'
    })
})

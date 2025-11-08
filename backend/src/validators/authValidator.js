import Joi from 'joi'

/**
 * Validation schema for user registration
 */
export const registerSchema = Joi.object({
  dicodingId: Joi.string()
    .required()
    .trim()
    .messages({
      'string.empty': 'Dicoding ID is required',
      'any.required': 'Dicoding ID is required'
    }),

  name: Joi.string()
    .required()
    .trim()
    .min(3)
    .max(100)
    .messages({
      'string.empty': 'Name is required',
      'string.min': 'Name must be at least 3 characters',
      'string.max': 'Name must not exceed 100 characters',
      'any.required': 'Name is required'
    }),

  email: Joi.string()
    .required()
    .email()
    .trim()
    .lowercase()
    .messages({
      'string.empty': 'Email is required',
      'string.email': 'Please provide a valid email',
      'any.required': 'Email is required'
    }),

  password: Joi.string()
    .required()
    .min(6)
    .messages({
      'string.empty': 'Password is required',
      'string.min': 'Password must be at least 6 characters',
      'any.required': 'Password is required'
    }),

  learningPath: Joi.string()
    .required()
    .valid(
      'Front-End',
      'Back-End',
      'Android',
      'iOS',
      'Machine Learning',
      'DevOps',
      'Multi-Platform',
      'React',
      'Flutter'
    )
    .messages({
      'string.empty': 'Learning path is required',
      'any.only': 'Invalid learning path',
      'any.required': 'Learning path is required'
    }),

  university: Joi.string()
    .optional()
    .trim()
    .max(200)
    .messages({
      'string.max': 'University name must not exceed 200 characters'
    }),

  phoneNumber: Joi.string()
    .optional()
    .trim()
    .pattern(/^[0-9+\-\s()]+$/)
    .messages({
      'string.pattern.base': 'Please provide a valid phone number'
    })
})

/**
 * Validation schema for user login
 */
export const loginSchema = Joi.object({
  email: Joi.string()
    .required()
    .email()
    .trim()
    .lowercase()
    .messages({
      'string.empty': 'Email is required',
      'string.email': 'Please provide a valid email',
      'any.required': 'Email is required'
    }),

  password: Joi.string()
    .required()
    .messages({
      'string.empty': 'Password is required',
      'any.required': 'Password is required'
    })
})

/**
 * Validation schema for profile update
 */
export const updateProfileSchema = Joi.object({
  name: Joi.string()
    .optional()
    .trim()
    .min(3)
    .max(100)
    .messages({
      'string.min': 'Name must be at least 3 characters',
      'string.max': 'Name must not exceed 100 characters'
    }),

  phoneNumber: Joi.string()
    .optional()
    .trim()
    .pattern(/^[0-9+\-\s()]+$/)
    .allow('')
    .messages({
      'string.pattern.base': 'Please provide a valid phone number'
    }),

  university: Joi.string()
    .optional()
    .trim()
    .max(200)
    .allow('')
    .messages({
      'string.max': 'University name must not exceed 200 characters'
    }),

  profilePicture: Joi.string()
    .optional()
    .uri()
    .allow('')
    .messages({
      'string.uri': 'Please provide a valid URL for profile picture'
    })
})

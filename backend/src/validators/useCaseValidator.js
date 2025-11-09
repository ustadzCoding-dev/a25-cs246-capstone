import Joi from 'joi';

/**
 * Validation schema for creating a use case
 */
export const createUseCaseSchema = Joi.object({
  useCaseCode: Joi.string()
    .required()
    .trim()
    .uppercase()
    .pattern(/^[A-Z0-9-]+$/)
    .messages({
      'string.empty': 'Use case code is required',
      'string.pattern.base': 'Use case code must contain only uppercase letters, numbers, and hyphens',
      'any.required': 'Use case code is required',
    }),
  title: Joi.string()
    .required()
    .trim()
    .min(5)
    .max(200)
    .messages({
      'string.empty': 'Title is required',
      'string.min': 'Title must be at least 5 characters',
      'string.max': 'Title must not exceed 200 characters',
      'any.required': 'Title is required',
    }),
  description: Joi.string()
    .required()
    .trim()
    .min(20)
    .messages({
      'string.empty': 'Description is required',
      'string.min': 'Description must be at least 20 characters',
      'any.required': 'Description is required',
    }),
  partner: Joi.string()
    .required()
    .trim()
    .messages({
      'string.empty': 'Partner is required',
      'any.required': 'Partner is required',
    }),
  learningPath: Joi.string()
    .valid('Front-End', 'Back-End', 'Multi-Platform', 'React', 'Machine Learning')
    .required()
    .messages({
      'any.only': 'Learning path must be one of: Front-End, Back-End, Multi-Platform, React, Machine Learning',
      'any.required': 'Learning path is required',
    }),
  isActive: Joi.boolean()
    .default(true),
});

/**
 * Validation schema for updating a use case
 */
export const updateUseCaseSchema = Joi.object({
  title: Joi.string()
    .trim()
    .min(5)
    .max(200)
    .messages({
      'string.min': 'Title must be at least 5 characters',
      'string.max': 'Title must not exceed 200 characters',
    }),
  description: Joi.string()
    .trim()
    .min(20)
    .messages({
      'string.min': 'Description must be at least 20 characters',
    }),
  partner: Joi.string()
    .trim(),
  learningPath: Joi.string()
    .valid('Front-End', 'Back-End', 'Multi-Platform', 'React', 'Machine Learning')
    .messages({
      'any.only': 'Learning path must be one of: Front-End, Back-End, Multi-Platform, React, Machine Learning',
    }),
  isActive: Joi.boolean(),
}).min(1).messages({
  'object.min': 'At least one field must be provided for update',
});

/**
 * Validation schema for use case query parameters
 */
export const getUseCasesQuerySchema = Joi.object({
  learningPath: Joi.string()
    .valid('Front-End', 'Back-End', 'Multi-Platform', 'React', 'Machine Learning')
    .messages({
      'any.only': 'Learning path must be one of: Front-End, Back-End, Multi-Platform, React, Machine Learning',
    }),
  isActive: Joi.boolean(),
  page: Joi.number()
    .integer()
    .min(1)
    .default(1)
    .messages({
      'number.min': 'Page must be at least 1',
    }),
  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(10)
    .messages({
      'number.min': 'Limit must be at least 1',
      'number.max': 'Limit must not exceed 100',
    }),
});

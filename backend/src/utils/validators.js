import Joi from 'joi';

/**
 * Validation schemas untuk semua admin endpoints
 */

// Timeline validation
export const timelineSchema = {
  create: Joi.object({
    title: Joi.string().required().min(3).max(100).trim(),
    description: Joi.string().required().min(10).max(500).trim(),
    type: Joi.string().required().valid('milestone', 'deadline', 'review', 'submission'),
    startDate: Joi.date().required().iso(),
    endDate: Joi.date().required().iso().min(Joi.ref('startDate')),
    priority: Joi.string().valid('low', 'medium', 'high').default('medium')
  }),
  update: Joi.object({
    title: Joi.string().min(3).max(100).trim(),
    description: Joi.string().min(10).max(500).trim(),
    type: Joi.string().valid('milestone', 'deadline', 'review', 'submission'),
    startDate: Joi.date().iso(),
    endDate: Joi.date().iso(),
    priority: Joi.string().valid('low', 'medium', 'high'),
    status: Joi.string().valid('upcoming', 'ongoing', 'completed', 'overdue')
  }).min(1)
};

// Announcement validation
export const announcementSchema = {
  create: Joi.object({
    title: Joi.string().required().min(3).max(200).trim(),
    content: Joi.string().required().min(10).max(5000).trim(),
    priority: Joi.string().valid('normal', 'important', 'urgent').default('normal')
  }),
  update: Joi.object({
    title: Joi.string().min(3).max(200).trim(),
    content: Joi.string().min(10).max(5000).trim(),
    priority: Joi.string().valid('normal', 'important', 'urgent')
  }).min(1)
};

// Document validation
export const documentSchema = {
  create: Joi.object({
    title: Joi.string().required().min(3).max(200).trim(),
    description: Joi.string().required().min(10).max(1000).trim(),
    category: Joi.string().required().valid('Panduan', 'Template', 'Referensi', 'Lainnya'),
    visibility: Joi.string().required().valid('public', 'private'),
    file: Joi.any().required()
  })
};

// Team (Capstone Group) validation
export const teamSchema = {
  create: Joi.object({
    teamName: Joi.string().required().min(3).max(100).trim(),
    membersUserId: Joi.array().items(Joi.string()).required().min(2).max(4),
    useCaseId: Joi.string().required()
  }),
  reject: Joi.object({
    reason: Joi.string().required().min(5).max(500).trim()
  })
};

// UseCase validation
export const usecaseSchema = {
  create: Joi.object({
    title: Joi.string().required().min(3).max(200).trim(),
    description: Joi.string().required().min(10).max(2000).trim(),
    partner: Joi.string().required().min(3).max(200).trim(),
    totalSlots: Joi.number().required().min(1).max(100),
    difficulty: Joi.string().required().valid('easy', 'medium', 'hard')
  })
};

// Learning Group validation
export const learningGroupSchema = {
  create: Joi.object({
    cohort: Joi.string().required().valid(
      'Front-End Web & Back-End with AI',
      'React & Back-End with AI',
      'Machine Learning'
    ),
    mentorName: Joi.string().required().min(3).max(100).trim(),
    maxMembers: Joi.number().required().min(1).max(50)
  }),
  update: Joi.object({
    mentorName: Joi.string().min(3).max(100).trim(),
    maxMembers: Joi.number().min(1).max(50),
    isActive: Joi.boolean()
  }).min(1)
};

/**
 * Validation middleware factory
 */
export const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Validation failed',
          details: errors
        }
      });
    }

    req.validatedBody = value;
    next();
  };
};

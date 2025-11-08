/**
 * Validation middleware using Joi schemas
 * @param {Object} schema - Joi validation schema
 * @param {String} property - Property to validate ('body', 'query', 'params')
 */
const validate = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false, // Return all errors, not just the first one
      stripUnknown: true // Remove unknown fields
    })

    if (error) {
      const errors = error.details.map(detail => detail.message)
      
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors
      })
    }

    // Replace request property with validated value (except for query which is read-only)
    if (property !== 'query') {
      req[property] = value
    }
    next()
  }
}

export default validate

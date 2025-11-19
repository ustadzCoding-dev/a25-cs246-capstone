/**
 * Multer Error Handler Middleware
 * Handles file upload errors from multer
 */

export const multerErrorHandler = (err, req, res, next) => {
  // Handle multer errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      error: {
        code: 'FILE_TOO_LARGE',
        message: 'File size exceeds 10MB limit'
      }
    });
  }

  if (err.code === 'LIMIT_FILE_COUNT') {
    return res.status(400).json({
      success: false,
      error: {
        code: 'TOO_MANY_FILES',
        message: 'Too many files uploaded'
      }
    });
  }

  if (err.code === 'LIMIT_PART_COUNT') {
    return res.status(400).json({
      success: false,
      error: {
        code: 'TOO_MANY_PARTS',
        message: 'Too many form parts'
      }
    });
  }

  if (err.message && err.message.includes('File type')) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'INVALID_FILE_TYPE',
        message: err.message
      }
    });
  }

  // Handle other multer errors
  if (err.name === 'MulterError') {
    return res.status(400).json({
      success: false,
      error: {
        code: 'UPLOAD_ERROR',
        message: err.message || 'File upload failed'
      }
    });
  }

  // Pass to next error handler if not a multer error
  next(err);
};

export default multerErrorHandler;

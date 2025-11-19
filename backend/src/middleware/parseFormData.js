/**
 * Parse FormData Fields Middleware
 * Ensures FormData fields are properly parsed into req.body
 */

export const parseFormDataFields = (req, res, next) => {
  // Log received data
  console.log('=== parseFormDataFields Middleware ===');
  console.log('req.body:', req.body);
  console.log('req.file:', req.file ? { filename: req.file.filename, size: req.file.size } : null);

  // If multer has already parsed the file, fields should be in req.body
  // But if they're not, we need to ensure they're there
  if (req.body) {
    // Ensure all fields are strings (multer might have parsed them)
    if (req.body.title) {
      req.body.title = String(req.body.title).trim();
    }
    if (req.body.description) {
      req.body.description = String(req.body.description).trim();
    }
    if (req.body.category) {
      req.body.category = String(req.body.category).trim();
    }
    if (req.body.visibility) {
      req.body.visibility = String(req.body.visibility).trim();
    }
  }

  console.log('After parsing - req.body:', req.body);
  next();
};

export default parseFormDataFields;

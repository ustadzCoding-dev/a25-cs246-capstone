import multer from 'multer';

// Use memory storage for Cloudinary upload
const storage = multer.memoryStorage();

// File filter to allow only images and PDF
const fileFilter = (req, file, cb) => {
  // Allowed file types for worksheet evidence
  const allowedMimes = [
    // Images (screenshots)
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    // PDF documents
    'application/pdf'
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `File type ${file.mimetype} is not allowed. Only images (JPEG, PNG, GIF, WebP) and PDF files are accepted.`
      ),
      false
    );
  }
};

// Configure multer for worksheet evidence
const uploadWorksheet = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit per file
    files: 5 // Maximum 5 files per upload
  }
});

// Middleware for uploading multiple evidence files
export const uploadEvidence = uploadWorksheet.array('evidence', 5);

// Middleware for uploading single evidence file
export const uploadSingleEvidence = uploadWorksheet.single('evidence');

// Helper function to get evidence file info (for files stored in memory)
export const getEvidenceFileInfo = (file, cloudinaryResult) => {
  return {
    originalName: file.originalname,
    fileName: cloudinaryResult.publicId,
    filePath: cloudinaryResult.url, // URL from Cloudinary
    fileUrl: cloudinaryResult.url, // Explicit URL field
    publicId: cloudinaryResult.publicId,
    mimeType: file.mimetype,
    fileSize: file.size,
    resourceType: cloudinaryResult.resourceType,
    uploadedAt: new Date()
  };
};

// Legacy helper for local file deletion (kept for backward compatibility)
export const deleteEvidenceFile = (_filePath) => {
  return Promise.resolve(true);
};

// Legacy helper for multiple local file deletion
export const deleteEvidenceFiles = async (filePaths) => {
  return filePaths.length;
};

export default uploadWorksheet;

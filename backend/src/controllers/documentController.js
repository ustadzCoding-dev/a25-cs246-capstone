import { asyncHandler } from '../utils/errorHandler.js';
import DocumentService from '../services/DocumentService.js';

/**
 * Get all documents with filters and pagination
 * GET /api/documents
 */
export const getAllDocuments = asyncHandler(async (req, res) => {
  const { category, visibility, search, page, limit, showDeleted } = req.query;
  const userRole = req.user?.role || 'student';

  const result = await DocumentService.getAllDocuments({
    category,
    visibility,
    search,
    page,
    limit,
    userRole,
    showDeleted: showDeleted === 'true'
  });

  res.success(result.data, 'Documents retrieved successfully', 200, result.pagination);
});

/**
 * Get document by ID
 * GET /api/document/:id
 */
export const getDocumentById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const document = await DocumentService.getDocumentById(id);

  res.success(document, 'Document retrieved successfully', 200);
});

/**
 * Upload a new document
 * POST /api/document/add
 */
export const addDocument = asyncHandler(async (req, res) => {
  // Use req.body directly since FormData fields are parsed into req.body
  const documentData = req.body;
  const file = req.file;
  const adminId = req.user._id;

  console.log('=== Document Upload Debug ===');
  console.log('req.body keys:', Object.keys(req.body));
  console.log('documentData:', documentData);
  console.log('file:', file ? { filename: file.filename, mimetype: file.mimetype, size: file.size } : null);
  console.log('adminId:', adminId);
  console.log('req.body.title:', req.body.title);
  console.log('req.body.description:', req.body.description);
  console.log('req.body.category:', req.body.category);
  console.log('req.body.visibility:', req.body.visibility);

  const document = await DocumentService.uploadDocument(documentData, file, adminId);

  res.success(document, 'Document uploaded successfully', 201);
});

/**
 * Update a document
 * PUT /api/document/:id
 */
export const updateDocument = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  console.log('=== Document Update Debug ===');
  console.log('documentId:', id);
  console.log('updateData:', updateData);

  const document = await DocumentService.updateDocument(id, updateData);

  res.success(document, 'Document updated successfully', 200);
});

/**
 * Delete a document
 * DELETE /api/document/:id/delete
 */
export const deleteDocument = asyncHandler(async (req, res) => {
  const { id } = req.params;

  await DocumentService.deleteDocument(id);

  res.success(null, 'Document deleted successfully', 200);
});

/**
 * Restore a deleted document
 * PUT /api/document/:id/restore
 */
export const restoreDocument = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const document = await DocumentService.restoreDocument(id);

  res.success(document, 'Document restored successfully', 200);
});

/**
 * Download a document
 * GET /api/document/:id/download
 */
export const downloadDocument = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const { document, filePath } = await DocumentService.downloadDocument(id);

  // Check if file exists
  const fs = await import('fs/promises');
  try {
    await fs.access(filePath);
  } catch {
    console.error('File not found:', filePath);
    return res.status(404).json({
      success: false,
      error: {
        code: 'FILE_NOT_FOUND',
        message: 'Document file not found on server'
      }
    });
  }

  // Set CORS headers for file download
  res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_URL || 'http://localhost:5173');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Send file
  res.download(filePath, document.fileName, (err) => {
    if (err) {
      console.error('Download error:', err);
    }
  });
});

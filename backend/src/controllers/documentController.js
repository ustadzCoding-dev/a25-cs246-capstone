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
 * Can update metadata only, or metadata + file
 */
export const updateDocument = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  const file = req.file;

  console.log('=== Document Update Debug ===');
  console.log('documentId:', id);
  console.log('updateData:', updateData);
  console.log('file:', file ? { filename: file.filename, mimetype: file.mimetype, size: file.size } : null);

  let document;

  // If file provided, use updateDocumentWithFile
  if (file) {
    document = await DocumentService.updateDocumentWithFile(id, updateData, file);
  } else {
    // Otherwise just update metadata
    document = await DocumentService.updateDocument(id, updateData);
  }

  res.success(document, 'Document updated successfully', 200);
});

/**
 * Delete a document (hard delete - permanent)
 * DELETE /api/document/:id
 */
export const deleteDocument = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const adminId = req.user._id;

  const deletedDocInfo = await DocumentService.deleteDocument(id, adminId);

  // Log deletion to audit log
  try {
    const { AuditLog } = await import('../models/AuditLog.js');
    await AuditLog.create({
      action: 'DELETE_DOCUMENT',
      userId: adminId,
      resourceType: 'Document',
      resourceId: id,
      details: {
        title: deletedDocInfo.title,
        fileName: deletedDocInfo.fileName,
        category: deletedDocInfo.category
      },
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    });
  } catch (error) {
    console.error('Failed to create audit log:', error.message);
    // Don't fail the delete if audit log fails
  }

  res.success(null, 'Document deleted successfully', 200);
});

/**
 * Download a document
 * GET /api/document/:id/download
 * Returns Cloudinary URL for frontend to handle download
 */
export const downloadDocument = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const document = await DocumentService.downloadDocument(id);

  console.log('Download requested for document:', id);
  console.log('Original File URL:', document.fileUrl);
  console.log('External Link:', document.link);
  console.log('File name:', document.fileName);

  let downloadUrl;

  // Case 1: File uploaded to Cloudinary
  if (document.fileUrl) {
    // Add download parameter to force download instead of preview
    // ?fl_attachment tells Cloudinary to serve as attachment, not inline
    downloadUrl = document.fileUrl + '?fl_attachment';
    console.log('Download URL with ?fl_attachment:', downloadUrl);
  }
  // Case 2: External link only
  else if (document.link) {
    downloadUrl = document.link;
    console.log('Using external link:', downloadUrl);
  }
  // Case 3: Neither file nor link (should not happen)
  else {
    return res.error('Document has no file or link', 400);
  }

  // Return URL with download metadata
  res.success({
    fileUrl: downloadUrl,
    fileName: document.fileName,
    downloadCount: document.downloadCount
  }, 'Document ready for download', 200);
});

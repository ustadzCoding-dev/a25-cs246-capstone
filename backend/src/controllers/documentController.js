import { asyncHandler } from '../utils/errorHandler.js';
import DocumentService from '../services/DocumentService.js';

/**
 * Get all documents with filters and pagination
 * GET /api/documents
 */
export const getAllDocuments = asyncHandler(async (req, res) => {
  const { category, visibility, search, page, limit } = req.query;

  const result = await DocumentService.getAllDocuments({
    category,
    visibility,
    search,
    page,
    limit
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
  const documentData = req.validatedBody;
  const file = req.file;
  const adminId = req.user._id;

  const document = await DocumentService.uploadDocument(documentData, file, adminId);

  res.success(document, 'Document uploaded successfully', 201);
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
 * Download a document
 * GET /api/document/:id/download
 */
export const downloadDocument = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const document = await DocumentService.downloadDocument(id);

  res.success(document, 'Document download recorded', 200);
});

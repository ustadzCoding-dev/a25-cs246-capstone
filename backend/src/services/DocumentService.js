import Document from '../models/Document.js';
import fs from 'fs/promises';
import path from 'path';
import { ValidationError, NotFoundError, ConflictError } from '../utils/errorHandler.js';

/**
 * Document Service
 * Handles all business logic related to documents
 */
export class DocumentService {
  /**
   * Upload a new document
   * @param {Object} documentData - Document metadata
   * @param {string} documentData.title - Document title
   * @param {string} documentData.description - Document description
   * @param {string} documentData.category - Document category
   * @param {string} documentData.visibility - Document visibility (public/private)
   * @param {Object} file - Uploaded file from Multer
   * @param {string} file.filename - Saved filename
   * @param {string} file.path - File path
   * @param {string} adminId - Admin user ID
   * @returns {Promise<Object>} Created document
   * @throws {ValidationError} If validation fails
   * @throws {ConflictError} If title already exists
   */
  async uploadDocument(documentData, file, adminId) {
    console.log('=== DocumentService.uploadDocument ===');
    console.log('documentData:', documentData);
    console.log('file:', file ? { filename: file.filename, mimetype: file.mimetype, size: file.size } : null);
    console.log('adminId:', adminId);

    try {
      // 1. Validate input
      console.log('Validating document data...');
      this.validateDocumentData(documentData);
      console.log('Document data validation passed');

      // 2. Validate file
      if (!file) {
        throw new ValidationError('File is required');
      }
      console.log('File validation passed');

      // 3. Check title uniqueness
      console.log('Checking title uniqueness...');
      await this.checkTitleUniqueness(documentData.title);
      console.log('Title uniqueness check passed');
    } catch (error) {
      console.error('DocumentService validation error:', error.message);
      throw error;
    }

    // 4. Create document record
    const fileUrl = `/uploads/documents/${file.filename}`;

    const document = await Document.create({
      title: documentData.title.trim(),
      description: documentData.description.trim(),
      category: documentData.category,
      visibility: documentData.visibility,
      fileName: file.filename,
      fileUrl,
      uploadedBy: adminId,
      downloadCount: 0,
      isActive: true
    });

    return document;
  }

  /**
   * Get all documents with filters
   * @param {Object} filters - Filter options
   * @param {string} filters.category - Document category
   * @param {string} filters.visibility - Document visibility
   * @param {string} filters.search - Search query
   * @param {number} filters.page - Page number
   * @param {number} filters.limit - Items per page
   * @param {string} filters.userRole - User role (admin or student)
   * @returns {Promise<Object>} Documents and pagination info
   */
  async getAllDocuments(filters = {}) {
    const {
      category,
      visibility,
      search,
      page = 1,
      limit = 10,
      userRole = 'student',
      showDeleted = false
    } = filters;

    // Build query
    const query = {};

    // Filter by active/deleted status
    if (showDeleted) {
      query.isActive = false;
    } else {
      query.isActive = true;
    }

    // If not admin, only show public documents
    if (userRole !== 'admin') {
      query.visibility = 'public';
    } else if (visibility) {
      // If admin specifies visibility, use it
      query.visibility = visibility;
    }

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute query
    const documents = await Document.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select('-__v')
      .lean();

    const total = await Document.countDocuments(query);

    return {
      data: documents,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1
      }
    };
  }

  /**
   * Get document by ID
   * @param {string} documentId - Document ID
   * @returns {Promise<Object>} Document data
   * @throws {NotFoundError} If document not found
   */
  async getDocumentById(documentId) {
    const document = await Document.findById(documentId);

    if (!document) {
      throw new NotFoundError('Document not found');
    }

    return document;
  }

  /**
   * Download document
   * @param {string} documentId - Document ID
   * @returns {Promise<Object>} Object with document and filePath
   * @throws {NotFoundError} If document not found
   */
  async downloadDocument(documentId) {
    const document = await Document.findByIdAndUpdate(
      documentId,
      { $inc: { downloadCount: 1 } },
      { new: true }
    );

    if (!document) {
      throw new NotFoundError('Document not found');
    }

    // Build file path
    const filePath = path.join(process.cwd(), 'uploads', 'documents', document.fileName);

    return {
      document,
      filePath
    };
  }

  /**
   * Delete document (Soft delete - only mark as inactive)
   * @param {string} documentId - Document ID
   * @returns {Promise<void>}
   * @throws {NotFoundError} If document not found
   */
  async deleteDocument(documentId) {
    const document = await Document.findById(documentId);

    if (!document) {
      throw new NotFoundError('Document not found');
    }

    // Soft delete from database (do NOT delete file)
    // File will be deleted only on permanent delete
    document.isActive = false;
    await document.save();
  }

  /**
   * Restore a deleted document
   * @param {string} documentId - Document ID
   * @returns {Promise<Object>} Restored document
   * @throws {NotFoundError} If document not found
   */
  async restoreDocument(documentId) {
    const document = await Document.findById(documentId);

    if (!document) {
      throw new NotFoundError('Document not found');
    }

    // Restore from soft delete
    document.isActive = true;
    await document.save();

    return document;
  }

  /**
   * Update document
   * @param {string} documentId - Document ID
   * @param {Object} updateData - Data to update
   * @returns {Promise<Object>} Updated document
   * @throws {NotFoundError} If document not found
   */
  async updateDocument(documentId, updateData) {
    const document = await Document.findById(documentId);

    if (!document) {
      throw new NotFoundError('Document not found');
    }

    // Update allowed fields
    const allowedFields = ['title', 'description', 'category', 'visibility'];
    allowedFields.forEach(field => {
      if (updateData[field]) {
        document[field] = updateData[field];
      }
    });

    await document.save();
    return document;
  }

  /**
   * Get document statistics
   * @returns {Promise<Object>} Document stats
   */
  async getDocumentStats() {
    const stats = await Document.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          totalDownloads: { $sum: '$downloadCount' },
          byCategory: {
            $push: {
              category: '$category',
              count: 1
            }
          }
        }
      }
    ]);

    if (stats.length === 0) {
      return {
        total: 0,
        totalDownloads: 0,
        byCategory: []
      };
    }

    return stats[0];
  }

  /**
   * PRIVATE METHODS
   */

  /**
   * Validate document data
   * @private
   */
  validateDocumentData(documentData) {
    if (!documentData.title || typeof documentData.title !== 'string') {
      throw new ValidationError('Document title is required and must be a string');
    }

    if (documentData.title.length < 3 || documentData.title.length > 200) {
      throw new ValidationError('Document title must be 3-200 characters');
    }

    if (!documentData.description || typeof documentData.description !== 'string') {
      throw new ValidationError('Document description is required');
    }

    if (documentData.description.length < 10 || documentData.description.length > 1000) {
      throw new ValidationError('Document description must be 10-1000 characters');
    }

    if (!documentData.category) {
      throw new ValidationError('Document category is required');
    }

    const validCategories = ['Panduan', 'Template', 'Referensi', 'Lainnya'];
    if (!validCategories.includes(documentData.category)) {
      throw new ValidationError(`Category must be one of: ${validCategories.join(', ')}`);
    }

    if (!documentData.visibility) {
      throw new ValidationError('Document visibility is required');
    }

    const validVisibility = ['public', 'private'];
    if (!validVisibility.includes(documentData.visibility)) {
      throw new ValidationError('Visibility must be public or private');
    }
  }

  /**
   * Check title uniqueness
   * @private
   */
  async checkTitleUniqueness(title) {
    const existing = await Document.findOne({
      title: title.trim(),
      isActive: true
    });

    if (existing) {
      throw new ConflictError('Document title already exists');
    }
  }

  /**
   * Delete file from filesystem
   * @private
   */
  async deleteFile(fileName) {
    try {
      const filePath = path.join(process.cwd(), 'uploads', 'documents', fileName);
      // Check if file exists before deleting
      try {
        await fs.access(filePath);
        await fs.unlink(filePath);
        console.log(`File deleted: ${fileName}`);
      } catch {
        // File doesn't exist, which is fine for soft delete
        console.log(`File not found (already deleted): ${fileName}`);
      }
    } catch (error) {
      // Log error but don't throw - file might already be deleted
      console.error(`Error deleting file ${fileName}:`, error.message);
    }
  }
}

export default new DocumentService();

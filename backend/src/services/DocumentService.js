import Document from '../models/Document.js';
import { v2 as cloudinary } from 'cloudinary';
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

      // 2. Validate file or link (at least one required)
      if (!file && !documentData.link) {
        throw new ValidationError('File atau Link harus diisi (minimal salah satu)');
      }
      console.log('File or Link validation passed');

      // 3. Check title uniqueness
      console.log('Checking title uniqueness...');
      await this.checkTitleUniqueness(documentData.title);
      console.log('Title uniqueness check passed');
    } catch (error) {
      console.error('DocumentService validation error:', error.message);
      throw error;
    }

    // 4. Upload file to Cloudinary (if file provided)
    console.log('Processing file upload...');
    let fileUrl = null;
    let fileName = 'External Link';

    if (file) {
      try {
        console.log('File object keys:', Object.keys(file));
        console.log('File path:', file.path);
        console.log('File secure_url:', file.secure_url);

        // If file already has secure_url (from multer-storage-cloudinary), use it
        if (file.secure_url) {
          fileUrl = file.secure_url;
          console.log('Using existing Cloudinary URL from multer-storage-cloudinary');
        } else if (file.path) {
          // Upload to Cloudinary with signed upload (more reliable)
          const uploadOptions = {
            resource_type: 'auto',
            folder: 'capstone/documents',
            use_filename: true,
            unique_filename: false,
            access_mode: 'public'
          };

          console.log('Using signed upload with API credentials');
          console.log('Uploading from path:', file.path);
          const result = await cloudinary.uploader.upload(file.path, uploadOptions);
          fileUrl = result.secure_url;
          console.log('Uploaded to Cloudinary:', fileUrl);
        } else {
          console.error('File object:', JSON.stringify(file, null, 2));
          throw new ValidationError('No file path available for upload. File object missing path property.');
        }
        fileName = file.originalname || file.filename;
      } catch (error) {
        console.error('Cloudinary upload error - Full error:', error);
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        throw new Error(`Failed to upload file to Cloudinary: ${error.message || JSON.stringify(error)}`);
      }
    } else {
      console.log('No file provided, using external link instead');
    }

    // 5. Create document record
    const document = await Document.create({
      title: documentData.title.trim(),
      description: documentData.description.trim(),
      category: documentData.category,
      visibility: documentData.visibility,
      fileName: fileName,
      fileUrl: fileUrl,
      link: documentData.link || null,
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
      userRole = 'student'
    } = filters;

    // Build query
    const query = {};

    // Note: Hard delete implemented - no soft delete, so no isActive filter needed
    // All documents in DB are "active" (deleted ones are removed)

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
   * @returns {Promise<Object>} Document with updated download count
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

    return document;
  }

  /**
   * Delete a document (hard delete - permanent)
   * @param {string} documentId - Document ID
   * @param {string} _adminId - Admin user ID (for audit log)
   * @returns {Promise<Object>} Deleted document info
   * @throws {NotFoundError} If document not found
   */
  async deleteDocument(documentId, _adminId) {
    const document = await Document.findById(documentId);

    if (!document) {
      throw new NotFoundError('Document not found');
    }

    // Store document info before deletion (for audit log)
    const deletedDocInfo = {
      id: document._id,
      title: document.title,
      fileName: document.fileName,
      fileUrl: document.fileUrl,
      link: document.link,
      category: document.category
    };

    // Delete file from Cloudinary if exists
    if (document.fileUrl) {
      try {
        await this.deleteCloudinaryFile(document.fileUrl);
        console.log('Deleted from Cloudinary:', document.fileUrl);
      } catch (error) {
        console.error('Failed to delete file from Cloudinary:', error.message);
        // Continue with database deletion even if Cloudinary delete fails
      }
    }

    // Hard delete from database
    await Document.findByIdAndDelete(documentId);
    console.log('Document hard deleted from database:', documentId);

    return deletedDocInfo;
  }

  /**
   * Update document (metadata only, no file)
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

    // Update allowed fields (including link now)
    const allowedFields = ['title', 'description', 'category', 'visibility', 'link'];
    allowedFields.forEach(field => {
      if (field === 'link') {
        // Allow link to be updated or cleared
        document[field] = updateData[field] || null;
      } else if (updateData[field]) {
        document[field] = updateData[field];
      }
    });

    await document.save();
    return document;
  }

  /**
   * Update document with file replacement
   * @param {string} documentId - Document ID
   * @param {Object} updateData - Data to update (title, description, category, visibility, link)
   * @param {Object} file - New file from Multer (optional)
   * @returns {Promise<Object>} Updated document
   * @throws {NotFoundError} If document not found
   * @throws {ValidationError} If validation fails
   */
  async updateDocumentWithFile(documentId, updateData, file) {
    console.log('=== DocumentService.updateDocumentWithFile ===');
    console.log('documentId:', documentId);
    console.log('updateData:', updateData);
    console.log('file:', file ? { filename: file.filename, mimetype: file.mimetype, size: file.size } : null);

    const document = await Document.findById(documentId);

    if (!document) {
      throw new NotFoundError('Document not found');
    }

    try {
      // 1. Validate input
      console.log('Validating document data...');
      this.validateDocumentData(updateData);
      console.log('Document data validation passed');

      // 2. Validate file or link (at least one required)
      if (!file && !updateData.link && !document.fileUrl) {
        throw new ValidationError('File atau Link harus diisi (minimal salah satu)');
      }
      console.log('File or Link validation passed');

      // 3. Check title uniqueness (if title changed)
      if (updateData.title !== document.title) {
        console.log('Checking title uniqueness for new title...');
        const existing = await Document.findOne({
          title: updateData.title.trim(),
          isActive: true,
          _id: { $ne: documentId }
        });

        if (existing) {
          throw new ConflictError('Document title already exists');
        }
        console.log('Title uniqueness check passed');
      }

      // 4. Handle file upload (if new file provided)
      let fileUrl = document.fileUrl;
      let fileName = document.fileName;

      if (file) {
        try {
          // Delete old file from Cloudinary if exists
          if (document.fileUrl) {
            console.log('Deleting old file from Cloudinary...');
            await this.deleteCloudinaryFile(document.fileUrl);
            console.log('Old file deleted');
          }

          // Upload new file
          const uploadOptions = {
            resource_type: 'auto',
            folder: 'capstone/documents',
            use_filename: true,
            unique_filename: false,
            access_mode: 'public'
          };

          console.log('Uploading new file to Cloudinary...');
          const result = await cloudinary.uploader.upload(file.path, uploadOptions);
          fileUrl = result.secure_url;
          fileName = file.originalname || file.filename;
          console.log('New file uploaded:', fileUrl);
        } catch (error) {
          console.error('Cloudinary upload error:', error.message);
          throw new Error(`Failed to upload file to Cloudinary: ${error.message}`);
        }
      }

      // 5. Update document
      document.title = updateData.title.trim();
      document.description = updateData.description.trim();
      document.category = updateData.category;
      document.visibility = updateData.visibility;
      document.fileUrl = fileUrl;
      document.fileName = fileName;
      document.link = updateData.link || null;

      await document.save();
      console.log('Document updated successfully');

      return document;
    } catch (error) {
      console.error('DocumentService.updateDocumentWithFile error:', error.message);
      throw error;
    }
  }

  /**
   * Delete file from Cloudinary
   * @private
   */
  async deleteCloudinaryFile(fileUrl) {
    try {
      // Extract public_id from Cloudinary URL
      // URL format: https://res.cloudinary.com/[cloud]/image/upload/v[version]/[folder]/[public_id]
      const urlParts = fileUrl.split('/');
      const fileName = urlParts[urlParts.length - 1];
      const publicId = `capstone/documents/${fileName.split('.')[0]}`;

      console.log('Attempting to delete Cloudinary file:', publicId);
      await cloudinary.uploader.destroy(publicId);
      console.log('Cloudinary file deleted successfully');
    } catch (error) {
      console.error('Error deleting Cloudinary file:', error.message);
      // Don't throw error, just log it - file deletion failure shouldn't block update
    }
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

}

export default new DocumentService();

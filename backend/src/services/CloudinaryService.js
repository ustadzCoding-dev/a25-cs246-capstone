import cloudinary from '../config/cloudinary.js';
import { Readable } from 'stream';
import logger from '../utils/logger.js';

/**
 * Upload profile picture ke Cloudinary
 * @param {Buffer} fileBuffer - Buffer file dari multer
 * @param {string} fileName - Nama file original
 * @param {string} userId - User ID untuk folder organization
 * @returns {Promise<string>} - URL foto di Cloudinary
 */
export const uploadProfilePicture = async (fileBuffer, fileName, userId) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'capstone-dicoding/profile-pictures',
        public_id: `user-${userId}`,
        overwrite: true,
        resource_type: 'auto',
        quality: 'auto',
        fetch_format: 'auto'
      },
      (error, result) => {
        if (error) {
          logger.error('Cloudinary upload error:', error);
          reject(error);
        } else {
          logger.info(`Profile picture uploaded for user ${userId}`);
          resolve(result.secure_url);
        }
      }
    );

    // Convert buffer to stream and pipe to Cloudinary
    const bufferStream = Readable.from(fileBuffer);
    bufferStream.pipe(stream);
  });
};

/**
 * Delete profile picture dari Cloudinary
 * @param {string} userId - User ID
 * @returns {Promise<void>}
 */
export const deleteProfilePicture = async (userId) => {
  try {
    await cloudinary.uploader.destroy(`capstone-dicoding/profile-pictures/user-${userId}`);
    logger.info(`Profile picture deleted for user ${userId}`);
  } catch (error) {
    logger.error('Cloudinary delete error:', error);
    throw error;
  }
};

/**
 * Upload worksheet evidence ke Cloudinary
 * @param {string} filePath - Path file dari multer disk storage
 * @param {string} originalName - Nama file original
 * @param {string} userId - User ID untuk folder organization
 * @param {string} periodId - Period ID untuk folder organization
 * @returns {Promise<Object>} - Object dengan URL dan public_id
 */
export const uploadWorksheetEvidence = async (filePath, originalName, userId, periodId) => {
  return new Promise((resolve, reject) => {
    // Determine resource type based on file extension
    const ext = originalName.toLowerCase().split('.').pop();
    const isPdf = ext === 'pdf';

    const uploadOptions = {
      folder: `capstone-dicoding/worksheets/${userId}/${periodId}`,
      public_id: `evidence-${Date.now()}`,
      resource_type: isPdf ? 'raw' : 'image',
      overwrite: true
    };

    // Add image optimization for non-PDF files
    if (!isPdf) {
      uploadOptions.quality = 'auto';
      uploadOptions.fetch_format = 'auto';
    }

    cloudinary.uploader.upload(filePath, uploadOptions, (error, result) => {
      if (error) {
        logger.error('Cloudinary worksheet evidence upload error:', error);
        reject(error);
      } else {
        logger.info(`Worksheet evidence uploaded for user ${userId}, period ${periodId}`);
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
          resourceType: result.resource_type,
          format: result.format,
          bytes: result.bytes
        });
      }
    });
  });
};

/**
 * Upload worksheet evidence from buffer ke Cloudinary
 * @param {Buffer} fileBuffer - Buffer file dari multer
 * @param {string} originalName - Nama file original
 * @param {string} mimeType - MIME type of the file
 * @param {string} userId - User ID untuk folder organization
 * @param {string} periodId - Period ID untuk folder organization
 * @returns {Promise<Object>} - Object dengan URL dan public_id
 */
export const uploadWorksheetEvidenceBuffer = async (
  fileBuffer,
  originalName,
  mimeType,
  userId,
  periodId
) => {
  return new Promise((resolve, reject) => {
    const isPdf = mimeType === 'application/pdf';

    const uploadOptions = {
      folder: `capstone-dicoding/worksheets/${userId}/${periodId}`,
      public_id: `evidence-${Date.now()}`,
      resource_type: isPdf ? 'raw' : 'image',
      overwrite: true
    };

    if (!isPdf) {
      uploadOptions.quality = 'auto';
      uploadOptions.fetch_format = 'auto';
    }

    const stream = cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
      if (error) {
        logger.error('Cloudinary worksheet evidence upload error:', error);
        reject(error);
      } else {
        logger.info(`Worksheet evidence uploaded for user ${userId}, period ${periodId}`);
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
          resourceType: result.resource_type,
          format: result.format,
          bytes: result.bytes
        });
      }
    });

    // Convert buffer to stream and pipe to Cloudinary
    const bufferStream = Readable.from(fileBuffer);
    bufferStream.pipe(stream);
  });
};

/**
 * Delete worksheet evidence dari Cloudinary
 * @param {string} publicId - Public ID of the file
 * @param {string} resourceType - Resource type (image or raw)
 * @returns {Promise<void>}
 */
export const deleteWorksheetEvidence = async (publicId, resourceType = 'image') => {
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
    logger.info(`Worksheet evidence deleted: ${publicId}`);
  } catch (error) {
    logger.error('Cloudinary delete worksheet evidence error:', error);
    throw error;
  }
};

/**
 * Delete multiple worksheet evidences dari Cloudinary
 * @param {Array<{publicId: string, resourceType: string}>} evidences - Array of evidence objects
 * @returns {Promise<number>} - Number of deleted files
 */
export const deleteMultipleWorksheetEvidences = async (evidences) => {
  let deletedCount = 0;

  for (const evidence of evidences) {
    try {
      await deleteWorksheetEvidence(evidence.publicId, evidence.resourceType || 'image');
      deletedCount++;
    } catch (error) {
      logger.warn(`Failed to delete evidence ${evidence.publicId}: ${error.message}`);
    }
  }

  return deletedCount;
};

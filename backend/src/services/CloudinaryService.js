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

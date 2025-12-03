/**
 * ============================================================
 * SAFARIA Platform - Cloudinary Upload Middleware
 * ============================================================
 * Handles streaming uploads directly to Cloudinary
 * ============================================================
 */

const { cloudinary } = require('../config/cloudinary');
const streamifier = require('streamifier');

/**
 * Upload a single file to Cloudinary
 * @param {string} folder - Cloudinary folder name
 */
const uploadToCloudinary = (folder) => {
  return async (req, res, next) => {
    if (!req.file) {
      return next();
    }

    try {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `safaria/${folder}`,
          transformation: [{ width: 1200, height: 800, crop: 'limit', quality: 'auto' }],
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            return next(error);
          }
          // Replace file object with Cloudinary result
          req.file.path = result.secure_url;
          req.file.cloudinary_id = result.public_id;
          req.file.url = result.secure_url;
          next();
        }
      );

      streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
    } catch (error) {
      console.error('Upload stream error:', error);
      next(error);
    }
  };
};

/**
 * Upload multiple files to Cloudinary
 * @param {string} folder - Cloudinary folder name
 */
const uploadMultipleToCloudinary = (folder) => {
  return async (req, res, next) => {
    if (!req.files || req.files.length === 0) {
      return next();
    }

    try {
      const uploadPromises = req.files.map((file) => {
        return new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: `safaria/${folder}`,
              transformation: [{ width: 1200, height: 800, crop: 'limit', quality: 'auto' }],
            },
            (error, result) => {
              if (error) {
                console.error('Cloudinary upload error:', error);
                reject(error);
              } else {
                resolve({
                  path: result.secure_url,
                  url: result.secure_url,
                  cloudinary_id: result.public_id,
                  originalname: file.originalname,
                });
              }
            }
          );
          streamifier.createReadStream(file.buffer).pipe(uploadStream);
        });
      });

      const results = await Promise.all(uploadPromises);
      req.files = results;
      req.uploadedFiles = results; // Keep a copy of uploaded files info
      next();
    } catch (error) {
      console.error('Multiple upload error:', error);
      next(error);
    }
  };
};

/**
 * Delete an image from Cloudinary
 * @param {string} publicId - Cloudinary public ID
 */
const deleteFromCloudinary = async (publicId) => {
  try {
    if (publicId && publicId.includes('safaria/')) {
      const result = await cloudinary.uploader.destroy(publicId);
      return result;
    }
    return null;
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw error;
  }
};

module.exports = {
  uploadToCloudinary,
  uploadMultipleToCloudinary,
  deleteFromCloudinary,
};

/**
 * Image compression utility for handling large images
 * Especially useful for 360° panoramic images
 */

/**
 * Compress an image file
 * @param {File} file - Image file to compress
 * @param {Object} options - Compression options
 * @returns {Promise<File>} Compressed image file
 */
export const compressImage = async (file, options = {}) => {
  const {
    maxWidth = 2048,
    maxHeight = 2048,
    quality = 0.8,
    is360 = false
  } = options;

  // For 360 images, use higher resolution but still compress
  const targetWidth = is360 ? 4096 : maxWidth;
  const targetHeight = is360 ? 2048 : maxHeight;

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions while maintaining aspect ratio
        if (width > targetWidth || height > targetHeight) {
          if (width > height) {
            height = (height / width) * targetWidth;
            width = targetWidth;
          } else {
            width = (width / height) * targetHeight;
            height = targetHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now()
              });
              resolve(compressedFile);
            } else {
              reject(new Error('Compression failed'));
            }
          },
          'image/jpeg',
          quality
        );
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target.result;
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
};

/**
 * Compress multiple images
 * @param {File[]} files - Array of image files
 * @param {Object} options - Compression options
 * @returns {Promise<File[]>} Array of compressed images
 */
export const compressImages = async (files, options = {}) => {
  const compressionPromises = files.map(file => {
    // Only compress if it's a File object (not a URL string)
    if (file instanceof File) {
      return compressImage(file, options);
    }
    return Promise.resolve(file);
  });

  return Promise.all(compressionPromises);
};

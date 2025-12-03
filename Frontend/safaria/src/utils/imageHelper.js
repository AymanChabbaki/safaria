/**
 * Helper function to get the correct image URL
 * Handles both Cloudinary URLs and legacy local paths
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const getImageUrl = (imagePath) => {
  if (!imagePath) {
    return '/uploads/placeholder.jpg';
  }
  
  // If it's already a full URL (Cloudinary), return as-is
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // If it's a relative path (old local uploads), prepend API URL
  return `${API_URL}${imagePath}`;
};

export default getImageUrl;


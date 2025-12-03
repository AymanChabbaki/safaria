const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Storage for profile images
const profileStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'safaria/profiles',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 500, height: 500, crop: 'limit' }],
  },
});

// Storage for artisan images
const artisanStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'safaria/artisans',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 1200, height: 800, crop: 'limit' }],
  },
});

// Storage for sejour images
const sejourStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'safaria/sejours',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 1200, height: 800, crop: 'limit' }],
  },
});

// Storage for caravane images
const caravaneStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'safaria/caravanes',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 1200, height: 800, crop: 'limit' }],
  },
});

// Storage for 360 images
const image360Storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'safaria/360-images',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    resource_type: 'image',
  },
});

module.exports = {
  cloudinary,
  profileStorage,
  artisanStorage,
  sejourStorage,
  caravaneStorage,
  image360Storage,
};

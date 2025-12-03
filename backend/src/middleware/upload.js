/**
 * ============================================================
 * SAFARIA Platform - File Upload Middleware
 * ============================================================
 * Multer configuration for handling image uploads with Cloudinary
 * Supports different storage paths and file validation
 * ============================================================
 */

const multer = require('multer');
const path = require('path');
const {
    profileStorage,
    artisanStorage,
    sejourStorage,
    caravaneStorage,
    image360Storage,
} = require('../config/cloudinary');

// Helper to determine storage based on route
const getStorage = (req) => {
    const route = req.baseUrl || req.url;
    
    if (route.includes('/auth') || route.includes('/profile')) {
        return profileStorage;
    } else if (route.includes('/artisan')) {
        return artisanStorage;
    } else if (route.includes('/sejour')) {
        return sejourStorage;
    } else if (route.includes('/caravane')) {
        return caravaneStorage;
    } else if (route.includes('/360')) {
        return image360Storage;
    }
    
    return artisanStorage; // Default
};

// Configure storage - dynamically determined per request
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // This won't be used with Cloudinary, but keeping for fallback
        cb(null, 'src/uploads/temp/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        const nameWithoutExt = path.basename(file.originalname, ext);
        cb(null, nameWithoutExt + '-' + uniqueSuffix + ext);
    }
});

// File filter - accept only images
const fileFilter = (req, file, cb) => {
    // Allowed file types
    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
    
    const ext = path.extname(file.originalname).toLowerCase();
    const mimeType = file.mimetype;
    
    if (allowedMimeTypes.includes(mimeType) && allowedExtensions.includes(ext)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPG, JPEG, PNG, and GIF images are allowed.'), false);
    }
};

// Create Cloudinary upload middleware
const createCloudinaryUpload = (fieldName, maxCount = 1) => {
    return (req, res, next) => {
        const cloudinaryStorage = getStorage(req);
        const cloudinaryUpload = multer({ 
            storage: cloudinaryStorage,
            limits: {
                fileSize: 10 * 1024 * 1024 // 10MB max file size for Cloudinary
            },
            fileFilter: fileFilter
        });
        
        if (maxCount === 1) {
            cloudinaryUpload.single(fieldName)(req, res, next);
        } else {
            cloudinaryUpload.array(fieldName, maxCount)(req, res, next);
        }
    };
};

// Standard upload middleware (fallback to local storage if needed)
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB max file size
    },
    fileFilter: fileFilter
});

// Error handling middleware for multer
const handleUploadError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        // Multer-specific errors
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: 'File too large. Maximum size is 10MB.'
            });
        }
        return res.status(400).json({
            success: false,
            message: `Upload error: ${err.message}`
        });
    } else if (err) {
        // Custom errors (like file type validation)
        return res.status(400).json({
            success: false,
            message: err.message
        });
    }
    next();
};

module.exports = {
    upload,
    createCloudinaryUpload,
    handleUploadError,
    // Convenient exports for different upload types
    singleUpload: (fieldName) => createCloudinaryUpload(fieldName, 1),
    multipleUpload: (fieldName, maxCount) => createCloudinaryUpload(fieldName, maxCount),
};

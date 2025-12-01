/**
 * ============================================================
 * SAFARIA Platform - File Upload Middleware
 * ============================================================
 * Multer configuration for handling image uploads
 * Supports different storage paths and file validation
 * ============================================================
 */

const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure upload directories exist
const ensureDirectoryExists = (dirPath) => {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
};

// Configure storage for different upload types
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let uploadPath = 'src/uploads/';
        
        // Determine upload path based on route
        if (req.baseUrl.includes('/artisans')) {
            uploadPath += 'artisans/';
        } else if (req.baseUrl.includes('/sejours')) {
            uploadPath += 'sejours/';
        } else if (req.baseUrl.includes('/caravanes')) {
            uploadPath += 'caravanes/';
        } else if (req.baseUrl.includes('/360')) {
            uploadPath += '360/';
        } else if (req.baseUrl.includes('/auth')) {
            uploadPath += 'profiles/';
        }
        
        ensureDirectoryExists(uploadPath);
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        // Generate unique filename: timestamp-randomstring-originalname
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

// Upload middleware configuration
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
                message: 'File too large. Maximum size is 5MB.'
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
    handleUploadError
};

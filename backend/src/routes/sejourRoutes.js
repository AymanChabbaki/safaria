/**
 * ============================================================
 * SAFARIA Platform - Sejours Routes
 * ============================================================
 */

const express = require('express');
const router = express.Router();
const { createCloudinaryMultiFieldUpload, handleUploadError } = require('../middleware/upload');
const { authenticateToken } = require('../middleware/auth');
const {
    createSejour,
    getAllSejours,
    getSejourById,
    updateSejour,
    deleteSejour
} = require('../controllers/sejourController');

// Define multi-field upload configuration
const uploadFields = createCloudinaryMultiFieldUpload([
    { name: 'main_image', maxCount: 1 },
    { name: 'images', maxCount: 10 },
    { name: 'images360', maxCount: 10 }
]);

// Public routes
router.get('/', getAllSejours);
router.get('/:id', getSejourById);

// Protected routes (require authentication) - Using Cloudinary
router.post('/', uploadFields, handleUploadError, createSejour);
router.put('/:id', uploadFields, handleUploadError, updateSejour);
router.delete('/:id', deleteSejour);

module.exports = router;

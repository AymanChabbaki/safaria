/**
 * ============================================================
 * SAFARIA Platform - Artisans Routes
 * ============================================================
 */

const express = require('express');
const router = express.Router();
const { createCloudinaryMultiFieldUpload, handleUploadError } = require('../middleware/upload');
const { authenticateToken } = require('../middleware/auth');
const {
    createArtisan,
    getAllArtisans,
    getArtisanById,
    updateArtisan,
    deleteArtisan
} = require('../controllers/artisanController');

// Define multi-field upload configuration
const uploadFields = createCloudinaryMultiFieldUpload([
    { name: 'main_image', maxCount: 1 },
    { name: 'images', maxCount: 10 },
    { name: 'images360', maxCount: 10 }
]);

// Public routes
router.get('/', getAllArtisans);
router.get('/:id', getArtisanById);

// Protected routes (require authentication) - Using Cloudinary
router.post('/', uploadFields, handleUploadError, createArtisan);
router.put('/:id', uploadFields, handleUploadError, updateArtisan);
router.delete('/:id', deleteArtisan);

module.exports = router;

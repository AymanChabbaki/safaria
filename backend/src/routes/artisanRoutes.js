/**
 * ============================================================
 * SAFARIA Platform - Artisans Routes
 * ============================================================
 */

const express = require('express');
const router = express.Router();
const { createCloudinaryUpload, handleUploadError } = require('../middleware/upload');
const { authenticateToken } = require('../middleware/auth');
const {
    createArtisan,
    getAllArtisans,
    getArtisanById,
    updateArtisan,
    deleteArtisan
} = require('../controllers/artisanController');

// Public routes
router.get('/', getAllArtisans);
router.get('/:id', getArtisanById);

// Protected routes (require authentication) - Using Cloudinary
router.post('/', createCloudinaryUpload('main_image', 1), createCloudinaryUpload('images', 10), handleUploadError, createArtisan);
router.put('/:id', createCloudinaryUpload('main_image', 1), createCloudinaryUpload('images', 10), handleUploadError, updateArtisan);
router.delete('/:id', deleteArtisan);

module.exports = router;

/**
 * ============================================================
 * SAFARIA Platform - Sejours Routes
 * ============================================================
 */

const express = require('express');
const router = express.Router();
const { createCloudinaryUpload, handleUploadError } = require('../middleware/upload');
const { authenticateToken } = require('../middleware/auth');
const {
    createSejour,
    getAllSejours,
    getSejourById,
    updateSejour,
    deleteSejour
} = require('../controllers/sejourController');

// Public routes
router.get('/', getAllSejours);
router.get('/:id', getSejourById);

// Protected routes (require authentication) - Using Cloudinary
router.post('/', createCloudinaryUpload('main_image', 1), createCloudinaryUpload('images', 10), createCloudinaryUpload('images360', 10), handleUploadError, createSejour);
router.put('/:id', createCloudinaryUpload('main_image', 1), createCloudinaryUpload('images', 10), createCloudinaryUpload('images360', 10), handleUploadError, updateSejour);
router.delete('/:id', deleteSejour);

module.exports = router;

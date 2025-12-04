/**
 * ============================================================
 * SAFARIA Platform - Caravanes Routes
 * ============================================================
 */

const express = require('express');
const router = express.Router();
const { createCloudinaryUpload, handleUploadError } = require('../middleware/upload');
const { authenticateToken } = require('../middleware/auth');
const {
    createCaravane,
    getAllCaravanes,
    getCaravaneById,
    updateCaravane,
    deleteCaravane
} = require('../controllers/caravaneController');

// Public routes
router.get('/', getAllCaravanes);
router.get('/:id', getCaravaneById);

// Protected routes (require authentication) - Using Cloudinary
router.post('/', createCloudinaryUpload('main_image', 1), createCloudinaryUpload('images', 10), createCloudinaryUpload('images360', 10), handleUploadError, createCaravane);
router.put('/:id', createCloudinaryUpload('main_image', 1), createCloudinaryUpload('images', 10), createCloudinaryUpload('images360', 10), handleUploadError, updateCaravane);
router.delete('/:id', deleteCaravane);

module.exports = router;

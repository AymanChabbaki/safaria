/**
 * ============================================================
 * SAFARIA Platform - Caravanes Routes
 * ============================================================
 */

const express = require('express');
const router = express.Router();
const { createCloudinaryMultiFieldUpload, handleUploadError } = require('../middleware/upload');
const { authenticateToken } = require('../middleware/auth');
const {
    createCaravane,
    getAllCaravanes,
    getCaravaneById,
    updateCaravane,
    deleteCaravane
} = require('../controllers/caravaneController');

// Define multi-field upload configuration
const uploadFields = createCloudinaryMultiFieldUpload([
    { name: 'main_image', maxCount: 1 },
    { name: 'images', maxCount: 10 },
    { name: 'images360', maxCount: 10 }
]);

// Public routes
router.get('/', getAllCaravanes);
router.get('/:id', getCaravaneById);

// Protected routes (require authentication) - Using Cloudinary
router.post('/', uploadFields, handleUploadError, createCaravane);
router.put('/:id', uploadFields, handleUploadError, updateCaravane);
router.delete('/:id', deleteCaravane);

module.exports = router;

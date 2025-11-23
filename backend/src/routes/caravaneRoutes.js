/**
 * ============================================================
 * SAFARIA Platform - Caravanes Routes
 * ============================================================
 */

const express = require('express');
const router = express.Router();
const { upload, handleUploadError } = require('../middleware/upload');
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

// Protected routes (require authentication)
router.post('/', upload.single('main_image'), handleUploadError, createCaravane);
router.put('/:id', upload.single('main_image'), handleUploadError, updateCaravane);
router.delete('/:id', deleteCaravane);

module.exports = router;

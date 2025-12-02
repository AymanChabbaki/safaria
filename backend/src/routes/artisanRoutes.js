/**
 * ============================================================
 * SAFARIA Platform - Artisans Routes
 * ============================================================
 */

const express = require('express');
const router = express.Router();
const { upload, handleUploadError } = require('../middleware/upload');
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

// Protected routes (require authentication)
router.post('/', upload.fields([{ name: 'main_image', maxCount: 1 }, { name: 'images', maxCount: 10 }, { name: 'images360', maxCount: 10 }]), handleUploadError, createArtisan);
router.put('/:id', upload.fields([{ name: 'main_image', maxCount: 1 }, { name: 'images', maxCount: 10 }, { name: 'images360', maxCount: 10 }]), handleUploadError, updateArtisan);
router.delete('/:id', deleteArtisan);

module.exports = router;

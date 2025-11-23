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
router.post('/', upload.single('main_image'), handleUploadError, createArtisan);
router.put('/:id', upload.single('main_image'), handleUploadError, updateArtisan);
router.delete('/:id', deleteArtisan);

module.exports = router;

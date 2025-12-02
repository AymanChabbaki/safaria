/**
 * ============================================================
 * SAFARIA Platform - Sejours Routes
 * ============================================================
 */

const express = require('express');
const router = express.Router();
const { upload, handleUploadError } = require('../middleware/upload');
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

// Protected routes (require authentication)
router.post('/', upload.fields([{ name: 'main_image', maxCount: 1 }, { name: 'images', maxCount: 10 }, { name: 'images360', maxCount: 10 }]), handleUploadError, createSejour);
router.put('/:id', upload.fields([{ name: 'main_image', maxCount: 1 }, { name: 'images', maxCount: 10 }, { name: 'images360', maxCount: 10 }]), handleUploadError, updateSejour);
router.delete('/:id', deleteSejour);

module.exports = router;

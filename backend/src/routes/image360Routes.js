/**
 * ============================================================
 * SAFARIA Platform - Images 360 Routes
 * ============================================================
 */

const express = require('express');
const router = express.Router();
const { upload, handleUploadError } = require('../middleware/upload');
const { authenticateToken } = require('../middleware/auth');
const {
    upload360Image,
    get360Images,
    delete360Image
} = require('../controllers/image360Controller');

// Public route - get 360 images
router.get('/:itemType/:itemId', get360Images);

// Protected routes - require authentication
router.post('/', upload.single('image'), handleUploadError, upload360Image);
router.delete('/:id', delete360Image);

module.exports = router;

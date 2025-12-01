/**
 * ============================================================
 * SAFARIA Platform - Authentication Routes
 * ============================================================
 */

const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { upload } = require('../middleware/upload');
const {
    login,
    register,
    verifyToken,
    updateProfile
} = require('../controllers/authController');

// Public routes
router.post('/login', login);
router.post('/register', register);

// Protected routes
router.get('/verify', authenticateToken, verifyToken);
router.put('/profile', authenticateToken, upload.single('photo'), updateProfile);

module.exports = router;

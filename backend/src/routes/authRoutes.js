/**
 * ============================================================
 * SAFARIA Platform - Authentication Routes
 * ============================================================
 */

const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const {
    login,
    register,
    verifyToken
} = require('../controllers/authController');

// Public routes
router.post('/login', login);
router.post('/register', register);

// Protected route
router.get('/verify', authenticateToken, verifyToken);

module.exports = router;

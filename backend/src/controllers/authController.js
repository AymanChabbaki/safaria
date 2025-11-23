/**
 * ============================================================
 * SAFARIA Platform - Authentication Controller
 * ============================================================
 * Handles admin login and JWT token generation
 * ============================================================
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/db');
const { sendSuccess, sendError } = require('../utils/responseHelper');

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate admin user and return JWT token
 * @access  Public
 */
const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Validation
        if (!username || !password) {
            return sendError(res, 'Username and password are required', 400);
        }
        
        // Find user by username
        const [users] = await pool.query(
            'SELECT * FROM users WHERE username = ?',
            [username]
        );
        
        if (users.length === 0) {
            return sendError(res, 'Invalid credentials', 401);
        }
        
        const user = users[0];
        
        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password_hash);
        
        if (!isValidPassword) {
            return sendError(res, 'Invalid credentials', 401);
        }
        
        // Generate JWT token
        const token = jwt.sign(
            {
                id: user.id,
                username: user.username,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES_IN || '7d'
            }
        );
        
        // Return token and user info (excluding password)
        return sendSuccess(res, {
            token,
            user: {
                id: user.id,
                username: user.username,
                role: user.role
            }
        }, 'Login successful');
    } catch (error) {
        console.error('Error during login:', error);
        return sendError(res, 'Login failed', 500, error.message);
    }
};

/**
 * @route   POST /api/auth/register
 * @desc    Register a new admin user (for initial setup)
 * @access  Private
 */
const register = async (req, res) => {
    try {
        const { username, password, role = 'admin' } = req.body;
        
        // Validation
        if (!username || !password) {
            return sendError(res, 'Username and password are required', 400);
        }
        
        if (password.length < 6) {
            return sendError(res, 'Password must be at least 6 characters long', 400);
        }
        
        // Check if username already exists
        const [existing] = await pool.query(
            'SELECT id FROM users WHERE username = ?',
            [username]
        );
        
        if (existing.length > 0) {
            return sendError(res, 'Username already exists', 400);
        }
        
        // Hash password
        const password_hash = await bcrypt.hash(password, 10);
        
        // Insert new user
        const [result] = await pool.query(
            'INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)',
            [username, password_hash, role]
        );
        
        // Return success (without password)
        return sendSuccess(res, {
            id: result.insertId,
            username,
            role
        }, 'User registered successfully', 201);
    } catch (error) {
        console.error('Error during registration:', error);
        return sendError(res, 'Registration failed', 500, error.message);
    }
};

/**
 * @route   GET /api/auth/verify
 * @desc    Verify JWT token and return user info
 * @access  Private
 */
const verifyToken = async (req, res) => {
    try {
        // User info is already attached by auth middleware
        return sendSuccess(res, {
            user: req.user
        }, 'Token is valid');
    } catch (error) {
        console.error('Error verifying token:', error);
        return sendError(res, 'Token verification failed', 500, error.message);
    }
};

module.exports = {
    login,
    register,
    verifyToken
};

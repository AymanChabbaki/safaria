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
 * @desc    Authenticate user and return JWT token
 * @access  Public
 */
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Validation
        if (!email || !password) {
            return sendError(res, 'Email and password are required', 400);
        }
        
        // Find user by email
        const [users] = await pool.query(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );
        
        if (users.length === 0) {
            return sendError(res, 'Invalid credentials', 401);
        }
        
        const user = users[0];
        
        // Verify password
        const isValidPassword = await bcrypt.compare(password, user.password);
        
        if (!isValidPassword) {
            return sendError(res, 'Invalid credentials', 401);
        }
        
        // Generate JWT token
        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
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
                email: user.email,
                name: user.name,
                phone: user.phone,
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
 * @desc    Register a new user
 * @access  Public
 */
const register = async (req, res) => {
    try {
        const { name, email, phone, password, role = 'user' } = req.body;
        
        // Validation
        if (!email || !password) {
            return sendError(res, 'Email and password are required', 400);
        }
        
        if (password.length < 6) {
            return sendError(res, 'Password must be at least 6 characters long', 400);
        }
        
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return sendError(res, 'Invalid email format', 400);
        }
        
        // Check if email already exists
        const [existing] = await pool.query(
            'SELECT id FROM users WHERE email = ?',
            [email]
        );
        
        if (existing.length > 0) {
            return sendError(res, 'Email already exists', 400);
        }
        
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Insert new user
        const [result] = await pool.query(
            'INSERT INTO users (email, name, phone, password, role) VALUES (?, ?, ?, ?, ?)',
            [email, name || null, phone || null, hashedPassword, role]
        );
        
        // Generate JWT token for auto-login
        const token = jwt.sign(
            {
                id: result.insertId,
                email,
                role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES_IN || '7d'
            }
        );
        
        // Return success with token for auto-login
        return sendSuccess(res, {
            token,
            user: {
                id: result.insertId,
                email,
                name: name || null,
                phone: phone || null,
                role
            }
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

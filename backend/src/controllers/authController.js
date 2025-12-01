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
                photo: user.photo,
                role: user.role,
                created_at: user.created_at
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
        
        // Fetch the newly created user to get created_at
        const [newUsers] = await pool.query(
            'SELECT id, email, name, phone, photo, role, created_at FROM users WHERE id = ?',
            [result.insertId]
        );
        
        const newUser = newUsers[0];
        
        // Generate JWT token for auto-login
        const token = jwt.sign(
            {
                id: newUser.id,
                email: newUser.email,
                role: newUser.role
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
                id: newUser.id,
                email: newUser.email,
                name: newUser.name,
                phone: newUser.phone,
                photo: newUser.photo,
                role: newUser.role,
                created_at: newUser.created_at
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

/**
 * @route   PUT /api/auth/profile
 * @desc    Update user profile (name, phone, photo)
 * @access  Private
 */
const updateProfile = async (req, res) => {
    try {
        console.log('Update profile request:', {
            userId: req.user?.id,
            body: req.body,
            file: req.file ? { filename: req.file.filename, size: req.file.size } : null
        });

        const userId = req.user?.id;
        if (!userId) {
            return sendError(res, 'User ID not found in token', 401);
        }

        const { name, phone, currentPassword, newPassword } = req.body;
        let photoPath = null;

        // Handle password change if requested
        if (currentPassword && newPassword) {
            // Verify current password
            const [users] = await pool.query(
                'SELECT password FROM users WHERE id = ?',
                [userId]
            );

            if (users.length === 0) {
                return sendError(res, 'User not found', 404);
            }

            const isValidPassword = await bcrypt.compare(currentPassword, users[0].password);
            if (!isValidPassword) {
                return sendError(res, 'Current password is incorrect', 401);
            }

            // Validate new password
            if (newPassword.length < 6) {
                return sendError(res, 'New password must be at least 6 characters', 400);
            }
        }

        // Handle photo upload if exists
        if (req.file) {
            photoPath = `/uploads/profiles/${req.file.filename}`;
        }

        // Build update query dynamically
        const updates = [];
        const values = [];

        if (name) {
            updates.push('name = ?');
            values.push(name);
        }

        if (phone !== undefined) {
            updates.push('phone = ?');
            values.push(phone || null);
        }

        if (photoPath) {
            updates.push('photo = ?');
            values.push(photoPath);
        }

        if (newPassword) {
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            updates.push('password = ?');
            values.push(hashedPassword);
        }

        if (updates.length === 0) {
            return sendError(res, 'No fields to update', 400);
        }

        values.push(userId);
        const query = `UPDATE users SET ${updates.join(', ')} WHERE id = ?`;

        console.log('Executing query:', query);
        await pool.query(query, values);

        // Fetch updated user
        const [updatedUsers] = await pool.query(
            'SELECT id, name, email, phone, photo, role, created_at FROM users WHERE id = ?',
            [userId]
        );

        console.log('Updated user:', updatedUsers[0]);

        return sendSuccess(res, {
            user: updatedUsers[0]
        }, 'Profile updated successfully');
    } catch (error) {
        console.error('Error updating profile:', error);
        return sendError(res, 'Profile update failed', 500, error.message);
    }
};

module.exports = {
    login,
    register,
    verifyToken,
    updateProfile
};

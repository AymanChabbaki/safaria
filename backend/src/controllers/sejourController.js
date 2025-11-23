/**
 * ============================================================
 * SAFARIA Platform - Sejours Controller
 * ============================================================
 * Handles all CRUD operations for accommodation/stay experiences
 * ============================================================
 */

const { pool } = require('../config/db');
const { sendSuccess, sendError, sendNotFound } = require('../utils/responseHelper');

/**
 * @route   POST /api/sejours
 * @desc    Create a new sejour experience
 * @access  Public
 */
const createSejour = async (req, res) => {
    try {
        const { name, description, latitude, longitude, price } = req.body;
        
        // Validation
        if (!name || !description || !latitude || !longitude || !price) {
            return sendError(res, 'All fields are required: name, description, latitude, longitude, price', 400);
        }
        
        // Get uploaded image path
        const main_image = req.file ? `/uploads/sejours/${req.file.filename}` : null;
        
        // Insert into database
        const [result] = await pool.query(
            `INSERT INTO sejours (name, description, category, latitude, longitude, price, main_image) 
             VALUES (?, ?, 'sejour', ?, ?, ?, ?)`,
            [name, description, latitude, longitude, price, main_image]
        );
        
        // Fetch created sejour
        const [sejour] = await pool.query('SELECT * FROM sejours WHERE id = ?', [result.insertId]);
        
        return sendSuccess(res, sejour[0], 'Sejour created successfully', 201);
    } catch (error) {
        console.error('Error creating sejour:', error);
        return sendError(res, 'Failed to create sejour', 500, error.message);
    }
};

/**
 * @route   GET /api/sejours
 * @desc    Get all sejour experiences
 * @access  Public
 */
const getAllSejours = async (req, res) => {
    try {
        const [sejours] = await pool.query(
            'SELECT * FROM sejours ORDER BY created_at DESC'
        );
        
        return sendSuccess(res, sejours, 'Sejours retrieved successfully');
    } catch (error) {
        console.error('Error fetching sejours:', error);
        return sendError(res, 'Failed to fetch sejours', 500, error.message);
    }
};

/**
 * @route   GET /api/sejours/:id
 * @desc    Get single sejour by ID
 * @access  Public
 */
const getSejourById = async (req, res) => {
    try {
        const { id } = req.params;
        
        const [sejour] = await pool.query('SELECT * FROM sejours WHERE id = ?', [id]);
        
        if (sejour.length === 0) {
            return sendNotFound(res, 'Sejour');
        }
        
        // Get related 360 images
        const [images] = await pool.query(
            'SELECT * FROM images_360 WHERE itemType = ? AND itemId = ?',
            ['sejour', id]
        );
        
        const result = {
            ...sejour[0],
            images_360: images
        };
        
        return sendSuccess(res, result, 'Sejour retrieved successfully');
    } catch (error) {
        console.error('Error fetching sejour:', error);
        return sendError(res, 'Failed to fetch sejour', 500, error.message);
    }
};

/**
 * @route   PUT /api/sejours/:id
 * @desc    Update sejour by ID
 * @access  Private
 */
const updateSejour = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, latitude, longitude, price } = req.body;
        
        // Check if sejour exists
        const [existing] = await pool.query('SELECT * FROM sejours WHERE id = ?', [id]);
        
        if (existing.length === 0) {
            return sendNotFound(res, 'Sejour');
        }
        
        // Get uploaded image path if new image is provided
        const main_image = req.file 
            ? `/uploads/sejours/${req.file.filename}` 
            : existing[0].main_image;
        
        // Update sejour
        await pool.query(
            `UPDATE sejours 
             SET name = ?, description = ?, latitude = ?, longitude = ?, price = ?, main_image = ?
             WHERE id = ?`,
            [
                name || existing[0].name,
                description || existing[0].description,
                latitude || existing[0].latitude,
                longitude || existing[0].longitude,
                price || existing[0].price,
                main_image,
                id
            ]
        );
        
        // Fetch updated sejour
        const [updated] = await pool.query('SELECT * FROM sejours WHERE id = ?', [id]);
        
        return sendSuccess(res, updated[0], 'Sejour updated successfully');
    } catch (error) {
        console.error('Error updating sejour:', error);
        return sendError(res, 'Failed to update sejour', 500, error.message);
    }
};

/**
 * @route   DELETE /api/sejours/:id
 * @desc    Delete sejour by ID
 * @access  Private
 */
const deleteSejour = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Check if sejour exists
        const [existing] = await pool.query('SELECT * FROM sejours WHERE id = ?', [id]);
        
        if (existing.length === 0) {
            return sendNotFound(res, 'Sejour');
        }
        
        // Delete sejour (triggers will handle related records)
        await pool.query('DELETE FROM sejours WHERE id = ?', [id]);
        
        return sendSuccess(res, null, 'Sejour deleted successfully');
    } catch (error) {
        console.error('Error deleting sejour:', error);
        return sendError(res, 'Failed to delete sejour', 500, error.message);
    }
};

module.exports = {
    createSejour,
    getAllSejours,
    getSejourById,
    updateSejour,
    deleteSejour
};

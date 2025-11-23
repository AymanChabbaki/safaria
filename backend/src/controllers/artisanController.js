/**
 * ============================================================
 * SAFARIA Platform - Artisans Controller
 * ============================================================
 * Handles all CRUD operations for artisan experiences
 * ============================================================
 */

const { pool } = require('../config/db');
const { sendSuccess, sendError, sendNotFound } = require('../utils/responseHelper');

/**
 * @route   POST /api/artisans
 * @desc    Create a new artisan experience
 * @access  Public
 */
const createArtisan = async (req, res) => {
    try {
        const { name, description, latitude, longitude, price } = req.body;
        
        // Validation
        if (!name || !description || !latitude || !longitude || !price) {
            return sendError(res, 'All fields are required: name, description, latitude, longitude, price', 400);
        }
        
        // Get uploaded image path
        const main_image = req.file ? `/uploads/artisans/${req.file.filename}` : null;
        
        // Insert into database
        const [result] = await pool.query(
            `INSERT INTO artisans (name, description, category, latitude, longitude, price, main_image) 
             VALUES (?, ?, 'artisanat', ?, ?, ?, ?)`,
            [name, description, latitude, longitude, price, main_image]
        );
        
        // Fetch created artisan
        const [artisan] = await pool.query('SELECT * FROM artisans WHERE id = ?', [result.insertId]);
        
        return sendSuccess(res, artisan[0], 'Artisan created successfully', 201);
    } catch (error) {
        console.error('Error creating artisan:', error);
        return sendError(res, 'Failed to create artisan', 500, error.message);
    }
};

/**
 * @route   GET /api/artisans
 * @desc    Get all artisan experiences
 * @access  Public
 */
const getAllArtisans = async (req, res) => {
    try {
        const [artisans] = await pool.query(
            'SELECT * FROM artisans ORDER BY created_at DESC'
        );
        
        return sendSuccess(res, artisans, 'Artisans retrieved successfully');
    } catch (error) {
        console.error('Error fetching artisans:', error);
        return sendError(res, 'Failed to fetch artisans', 500, error.message);
    }
};

/**
 * @route   GET /api/artisans/:id
 * @desc    Get single artisan by ID
 * @access  Public
 */
const getArtisanById = async (req, res) => {
    try {
        const { id } = req.params;
        
        const [artisan] = await pool.query('SELECT * FROM artisans WHERE id = ?', [id]);
        
        if (artisan.length === 0) {
            return sendNotFound(res, 'Artisan');
        }
        
        // Get related 360 images
        const [images] = await pool.query(
            'SELECT * FROM images_360 WHERE itemType = ? AND itemId = ?',
            ['artisanat', id]
        );
        
        const result = {
            ...artisan[0],
            images_360: images
        };
        
        return sendSuccess(res, result, 'Artisan retrieved successfully');
    } catch (error) {
        console.error('Error fetching artisan:', error);
        return sendError(res, 'Failed to fetch artisan', 500, error.message);
    }
};

/**
 * @route   PUT /api/artisans/:id
 * @desc    Update artisan by ID
 * @access  Private
 */
const updateArtisan = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, latitude, longitude, price } = req.body;
        
        // Check if artisan exists
        const [existing] = await pool.query('SELECT * FROM artisans WHERE id = ?', [id]);
        
        if (existing.length === 0) {
            return sendNotFound(res, 'Artisan');
        }
        
        // Get uploaded image path if new image is provided
        const main_image = req.file 
            ? `/uploads/artisans/${req.file.filename}` 
            : existing[0].main_image;
        
        // Update artisan
        await pool.query(
            `UPDATE artisans 
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
        
        // Fetch updated artisan
        const [updated] = await pool.query('SELECT * FROM artisans WHERE id = ?', [id]);
        
        return sendSuccess(res, updated[0], 'Artisan updated successfully');
    } catch (error) {
        console.error('Error updating artisan:', error);
        return sendError(res, 'Failed to update artisan', 500, error.message);
    }
};

/**
 * @route   DELETE /api/artisans/:id
 * @desc    Delete artisan by ID
 * @access  Private
 */
const deleteArtisan = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Check if artisan exists
        const [existing] = await pool.query('SELECT * FROM artisans WHERE id = ?', [id]);
        
        if (existing.length === 0) {
            return sendNotFound(res, 'Artisan');
        }
        
        // Delete artisan (triggers will handle related records)
        await pool.query('DELETE FROM artisans WHERE id = ?', [id]);
        
        return sendSuccess(res, null, 'Artisan deleted successfully');
    } catch (error) {
        console.error('Error deleting artisan:', error);
        return sendError(res, 'Failed to delete artisan', 500, error.message);
    }
};

module.exports = {
    createArtisan,
    getAllArtisans,
    getArtisanById,
    updateArtisan,
    deleteArtisan
};

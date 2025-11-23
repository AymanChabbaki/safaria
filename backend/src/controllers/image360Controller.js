/**
 * ============================================================
 * SAFARIA Platform - Images 360 Controller
 * ============================================================
 * Handles 360-degree image uploads and retrieval
 * ============================================================
 */

const { pool } = require('../config/db');
const { sendSuccess, sendError, sendNotFound } = require('../utils/responseHelper');

/**
 * @route   POST /api/360
 * @desc    Upload a 360-degree image
 * @access  Private
 */
const upload360Image = async (req, res) => {
    try {
        const { itemType, itemId } = req.body;
        
        // Validation
        if (!itemType || !itemId) {
            return sendError(res, 'itemType and itemId are required', 400);
        }
        
        // Validate itemType
        const validItemTypes = ['artisanat', 'sejour', 'caravane'];
        if (!validItemTypes.includes(itemType)) {
            return sendError(res, 'Invalid itemType. Must be: artisanat, sejour, or caravane', 400);
        }
        
        // Check if file is uploaded
        if (!req.file) {
            return sendError(res, 'No image file uploaded', 400);
        }
        
        // Verify that the item exists
        let tableName;
        if (itemType === 'artisanat') tableName = 'artisans';
        else if (itemType === 'sejour') tableName = 'sejours';
        else if (itemType === 'caravane') tableName = 'caravanes';
        
        const [item] = await pool.query(`SELECT id FROM ${tableName} WHERE id = ?`, [itemId]);
        
        if (item.length === 0) {
            return sendError(res, `${itemType} with id ${itemId} does not exist`, 404);
        }
        
        // Get uploaded image path
        const imageUrl = `/uploads/360/${req.file.filename}`;
        
        // Insert into database
        const [result] = await pool.query(
            `INSERT INTO images_360 (itemType, itemId, imageUrl) 
             VALUES (?, ?, ?)`,
            [itemType, itemId, imageUrl]
        );
        
        // Fetch created image record
        const [image] = await pool.query('SELECT * FROM images_360 WHERE id = ?', [result.insertId]);
        
        return sendSuccess(res, image[0], '360° image uploaded successfully', 201);
    } catch (error) {
        console.error('Error uploading 360 image:', error);
        return sendError(res, 'Failed to upload 360° image', 500, error.message);
    }
};

/**
 * @route   GET /api/360/:itemType/:itemId
 * @desc    Get all 360 images for a specific item
 * @access  Public
 */
const get360Images = async (req, res) => {
    try {
        const { itemType, itemId } = req.params;
        
        // Validate itemType
        const validItemTypes = ['artisanat', 'sejour', 'caravane'];
        if (!validItemTypes.includes(itemType)) {
            return sendError(res, 'Invalid itemType. Must be: artisanat, sejour, or caravane', 400);
        }
        
        // Get all 360 images for this item
        const [images] = await pool.query(
            'SELECT * FROM images_360 WHERE itemType = ? AND itemId = ? ORDER BY uploaded_at DESC',
            [itemType, itemId]
        );
        
        return sendSuccess(res, images, '360° images retrieved successfully');
    } catch (error) {
        console.error('Error fetching 360 images:', error);
        return sendError(res, 'Failed to fetch 360° images', 500, error.message);
    }
};

/**
 * @route   DELETE /api/360/:id
 * @desc    Delete a 360 image by ID
 * @access  Private
 */
const delete360Image = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Check if image exists
        const [existing] = await pool.query('SELECT * FROM images_360 WHERE id = ?', [id]);
        
        if (existing.length === 0) {
            return sendNotFound(res, '360° image');
        }
        
        // Delete image record
        await pool.query('DELETE FROM images_360 WHERE id = ?', [id]);
        
        return sendSuccess(res, null, '360° image deleted successfully');
    } catch (error) {
        console.error('Error deleting 360 image:', error);
        return sendError(res, 'Failed to delete 360° image', 500, error.message);
    }
};

module.exports = {
    upload360Image,
    get360Images,
    delete360Image
};

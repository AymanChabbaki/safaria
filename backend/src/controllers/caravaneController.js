/**
 * ============================================================
 * SAFARIA Platform - Caravanes Controller
 * ============================================================
 * Handles all CRUD operations for caravan experiences
 * ============================================================
 */

const { pool } = require('../config/db');
const { sendSuccess, sendError, sendNotFound } = require('../utils/responseHelper');

/**
 * @route   POST /api/caravanes
 * @desc    Create a new caravane experience
 * @access  Public
 */
const createCaravane = async (req, res) => {
    try {
        const { name_fr, name_en, name_ar, description_fr, description_en, description_ar, latitude, longitude, price } = req.body;
        
        // Validation
        if (!name_fr || !name_en || !name_ar || !description_fr || !description_en || !description_ar || !latitude || !longitude || !price) {
            return sendError(res, 'All fields are required: name_fr, name_en, name_ar, description_fr, description_en, description_ar, latitude, longitude, price', 400);
        }
        
        // Get uploaded files
        const main_image = req.files && req.files['main_image'] ? `/uploads/caravanes/${req.files['main_image'][0].filename}` : null;
        const images = req.files && req.files['images'] ? JSON.stringify(req.files['images'].map(f => `/uploads/caravanes/${f.filename}`)) : null;
        
        // Insert into database
        const [result] = await pool.query(
            `INSERT INTO caravanes (name_fr, name_en, name_ar, description_fr, description_en, description_ar, category, latitude, longitude, price, main_image, images) 
             VALUES (?, ?, ?, ?, ?, ?, 'caravane', ?, ?, ?, ?, ?)`,
            [name_fr, name_en, name_ar, description_fr, description_en, description_ar, latitude, longitude, price, main_image, images]
        );
        
        // Fetch created caravane
        const [caravane] = await pool.query('SELECT * FROM caravanes WHERE id = ?', [result.insertId]);
        
        return sendSuccess(res, caravane[0], 'Caravane created successfully', 201);
    } catch (error) {
        console.error('Error creating caravane:', error);
        return sendError(res, 'Failed to create caravane', 500, error.message);
    }
};

/**
 * @route   GET /api/caravanes
 * @desc    Get all caravane experiences
 * @access  Public
 */
const getAllCaravanes = async (req, res) => {
    try {
        // Set UTF-8 charset for proper French character handling
        await pool.query('SET NAMES utf8mb4');
        
        const { lang = 'fr' } = req.query; // Default to French
        
        const [caravanes] = await pool.query(
            'SELECT * FROM caravanes ORDER BY created_at DESC'
        );
        
        // Map data to correct language and parse images
        const localizedCaravanes = caravanes.map(caravane => {
            let parsedImages = [];
            try {
                if (caravane.images) {
                    parsedImages = typeof caravane.images === 'string' 
                        ? JSON.parse(caravane.images) 
                        : caravane.images;
                }
            } catch (e) {
                parsedImages = caravane.main_image ? [caravane.main_image] : [];
            }
            
            return {
                ...caravane,
                images: parsedImages,
                name: lang === 'ar' ? (caravane.name_ar || caravane.name) : 
                      lang === 'en' ? (caravane.name_en || caravane.name) : 
                      caravane.name,
                description: lang === 'ar' ? (caravane.description_ar || caravane.description) : 
                             lang === 'en' ? (caravane.description_en || caravane.description) : 
                             caravane.description
            };
        });
        
        return sendSuccess(res, localizedCaravanes, 'Caravanes retrieved successfully');
    } catch (error) {
        console.error('Error fetching caravanes:', error);
        return sendError(res, 'Failed to fetch caravanes', 500, error.message);
    }
};

/**
 * @route   GET /api/caravanes/:id
 * @desc    Get single caravane by ID
 * @access  Public
 */
const getCaravaneById = async (req, res) => {
    try {
        const { id } = req.params;
        const { lang = 'fr' } = req.query; // Default to French
        
        // Set UTF-8 charset for proper French character handling
        await pool.query('SET NAMES utf8mb4');
        
        const [caravane] = await pool.query('SELECT * FROM caravanes WHERE id = ?', [id]);
        
        if (caravane.length === 0) {
            return sendNotFound(res, 'Caravane');
        }
        
        // Get related 360 images
        const [images] = await pool.query(
            'SELECT * FROM images_360 WHERE itemType = ? AND itemId = ?',
            ['caravane', id]
        );
        
        // Parse images JSON array
        let parsedImages = [];
        try {
            if (caravane[0].images) {
                parsedImages = typeof caravane[0].images === 'string' 
                    ? JSON.parse(caravane[0].images) 
                    : caravane[0].images;
            }
        } catch (e) {
            console.warn('Failed to parse images JSON:', e);
            parsedImages = caravane[0].main_image ? [caravane[0].main_image] : [];
        }
        
        // Localize the data
        const localizedCaravane = {
            ...caravane[0],
            name: lang === 'ar' ? (caravane[0].name_ar || caravane[0].name) : 
                  lang === 'en' ? (caravane[0].name_en || caravane[0].name) : 
                  caravane[0].name,
            description: lang === 'ar' ? (caravane[0].description_ar || caravane[0].description) : 
                         lang === 'en' ? (caravane[0].description_en || caravane[0].description) : 
                         caravane[0].description
        };
        
        const result = {
            ...localizedCaravane,
            images: parsedImages,
            images_360: images,
            has360: images.length > 0
        };
        
        return sendSuccess(res, result, 'Caravane retrieved successfully');
    } catch (error) {
        console.error('Error fetching caravane:', error);
        return sendError(res, 'Failed to fetch caravane', 500, error.message);
    }
};

/**
 * @route   PUT /api/caravanes/:id
 * @desc    Update caravane by ID
 * @access  Private
 */
const updateCaravane = async (req, res) => {
    try {
        const { id } = req.params;
        const { name_fr, name_en, name_ar, description_fr, description_en, description_ar, latitude, longitude, price } = req.body;
        
        // Check if caravane exists
        const [existing] = await pool.query('SELECT * FROM caravanes WHERE id = ?', [id]);
        
        if (existing.length === 0) {
            return sendNotFound(res, 'Caravane');
        }
        
        // Get uploaded files if new files are provided
        const main_image = req.files && req.files['main_image'] 
            ? `/uploads/caravanes/${req.files['main_image'][0].filename}` 
            : existing[0].main_image;
        
        // Handle gallery images - replace with existing images (from frontend) + new uploads
        const existingImages = req.body.existing_images ? JSON.parse(req.body.existing_images) : [];
        const newImages = req.files && req.files['images'] 
            ? req.files['images'].map(f => `/uploads/caravanes/${f.filename}`) 
            : [];
        const images = JSON.stringify([...existingImages, ...newImages]);
        
        // Handle 360 images - replace with existing images (from frontend) + new uploads
        const existing360Images = req.body.existing_images360 ? JSON.parse(req.body.existing_images360) : [];
        const new360Images = req.files && req.files['images360'] 
            ? req.files['images360'].map(f => `/uploads/caravanes/${f.filename}`) 
            : [];
        const images360 = JSON.stringify([...existing360Images, ...new360Images]);
        
        // Update caravane
        await pool.query(
            `UPDATE caravanes 
             SET name_fr = ?, name_en = ?, name_ar = ?, description_fr = ?, description_en = ?, description_ar = ?, latitude = ?, longitude = ?, price = ?, main_image = ?, images = ?, images360 = ?
             WHERE id = ?`,
            [
                name_fr || existing[0].name_fr,
                name_en || existing[0].name_en,
                name_ar || existing[0].name_ar,
                description_fr || existing[0].description_fr,
                description_en || existing[0].description_en,
                description_ar || existing[0].description_ar,
                latitude || existing[0].latitude,
                longitude || existing[0].longitude,
                price || existing[0].price,
                main_image,
                images,
                images360,
                id
            ]
        );
        
        // Fetch updated caravane
        const [updated] = await pool.query('SELECT * FROM caravanes WHERE id = ?', [id]);
        
        return sendSuccess(res, updated[0], 'Caravane updated successfully');
    } catch (error) {
        console.error('Error updating caravane:', error);
        return sendError(res, 'Failed to update caravane', 500, error.message);
    }
};

/**
 * @route   DELETE /api/caravanes/:id
 * @desc    Delete caravane by ID
 * @access  Private
 */
const deleteCaravane = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Check if caravane exists
        const [existing] = await pool.query('SELECT * FROM caravanes WHERE id = ?', [id]);
        
        if (existing.length === 0) {
            return sendNotFound(res, 'Caravane');
        }
        
        // Delete caravane (triggers will handle related records)
        await pool.query('DELETE FROM caravanes WHERE id = ?', [id]);
        
        return sendSuccess(res, null, 'Caravane deleted successfully');
    } catch (error) {
        console.error('Error deleting caravane:', error);
        return sendError(res, 'Failed to delete caravane', 500, error.message);
    }
};

module.exports = {
    createCaravane,
    getAllCaravanes,
    getCaravaneById,
    updateCaravane,
    deleteCaravane
};

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
        const { name_fr, name_en, name_ar, description_fr, description_en, description_ar, latitude, longitude, price } = req.body;
        
        // Validation
        if (!name_fr || !name_en || !name_ar || !description_fr || !description_en || !description_ar || !latitude || !longitude || !price) {
            return sendError(res, 'All fields are required: name_fr, name_en, name_ar, description_fr, description_en, description_ar, latitude, longitude, price', 400);
        }
        
        // Get uploaded files from Cloudinary
        const main_image = req.files && req.files['main_image'] ? req.files['main_image'][0].path : null;
        const images = req.files && req.files['images'] ? JSON.stringify(req.files['images'].map(f => f.path)) : null;
        
        // Insert into database
        const [result] = await pool.query(
            `INSERT INTO sejours (name_fr, name_en, name_ar, description_fr, description_en, description_ar, category, latitude, longitude, price, main_image, images) 
             VALUES (?, ?, ?, ?, ?, ?, 'sejour', ?, ?, ?, ?, ?)`,
            [name_fr, name_en, name_ar, description_fr, description_en, description_ar, latitude, longitude, price, main_image, images]
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
        // Set UTF-8 charset for proper French character handling
        await pool.query('SET NAMES utf8mb4');
        
        const { lang = 'fr' } = req.query; // Default to French
        
        const [sejours] = await pool.query(
            'SELECT * FROM sejours ORDER BY created_at DESC'
        );
        
        // Map data to correct language and parse images
        const localizedSejours = sejours.map(sejour => {
            let parsedImages = [];
            try {
                if (sejour.images) {
                    parsedImages = typeof sejour.images === 'string' 
                        ? JSON.parse(sejour.images) 
                        : sejour.images;
                }
            } catch (e) {
                parsedImages = sejour.main_image ? [sejour.main_image] : [];
            }
            
            return {
                ...sejour,
                images: parsedImages,
                name: lang === 'ar' ? (sejour.name_ar || sejour.name_fr || sejour.name_en) : 
                      lang === 'en' ? (sejour.name_en || sejour.name_fr || sejour.name_ar) : 
                      (sejour.name_fr || sejour.name_en || sejour.name_ar),
                description: lang === 'ar' ? (sejour.description_ar || sejour.description_fr || sejour.description_en) : 
                             lang === 'en' ? (sejour.description_en || sejour.description_fr || sejour.description_ar) : 
                             (sejour.description_fr || sejour.description_en || sejour.description_ar)
            };
        });
        
        return sendSuccess(res, localizedSejours, 'Sejours retrieved successfully');
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
        const { lang = 'fr' } = req.query; // Default to French
        
        // Set UTF-8 charset for proper French character handling
        await pool.query('SET NAMES utf8mb4');
        
        const [sejour] = await pool.query('SELECT * FROM sejours WHERE id = ?', [id]);
        
        if (sejour.length === 0) {
            return sendNotFound(res, 'Sejour');
        }
        
        // Get related 360 images
        const [images] = await pool.query(
            'SELECT * FROM images_360 WHERE itemType = ? AND itemId = ?',
            ['sejour', id]
        );
        
        // Parse images JSON array
        let parsedImages = [];
        try {
            if (sejour[0].images) {
                parsedImages = typeof sejour[0].images === 'string' 
                    ? JSON.parse(sejour[0].images) 
                    : sejour[0].images;
            }
        } catch (e) {
            console.warn('Failed to parse images JSON:', e);
            parsedImages = sejour[0].main_image ? [sejour[0].main_image] : [];
        }
        
        // Localize the data
        const localizedSejour = {
            ...sejour[0],
            name: lang === 'ar' ? (sejour[0].name_ar || sejour[0].name_fr || sejour[0].name_en) : 
                  lang === 'en' ? (sejour[0].name_en || sejour[0].name_fr || sejour[0].name_ar) : 
                  (sejour[0].name_fr || sejour[0].name_en || sejour[0].name_ar),
            description: lang === 'ar' ? (sejour[0].description_ar || sejour[0].description_fr || sejour[0].description_en) : 
                         lang === 'en' ? (sejour[0].description_en || sejour[0].description_fr || sejour[0].description_ar) : 
                         (sejour[0].description_fr || sejour[0].description_en || sejour[0].description_ar)
        };
        
        const result = {
            ...localizedSejour,
            images: parsedImages,
            images_360: images,
            has360: images.length > 0
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
        const { name_fr, name_en, name_ar, description_fr, description_en, description_ar, latitude, longitude, price } = req.body;
        
        // Debug logging
        console.log('Update sejour request:', {
            id,
            hasFiles: !!req.files,
            bodyKeys: Object.keys(req.body),
            imagesType: typeof req.body.images,
            images360Type: typeof req.body.images360
        });
        
        // Check if sejour exists
        const [existing] = await pool.query('SELECT * FROM sejours WHERE id = ?', [id]);
        
        if (existing.length === 0) {
            return sendNotFound(res, 'Sejour');
        }
        
        // Get uploaded files from Cloudinary if new files are provided
        const main_image = req.files && req.files['main_image'] 
            ? req.files['main_image'][0].path 
            : existing[0].main_image;
        
        // Handle gallery images
        let images;
        if (Array.isArray(req.body.images)) {
            // JSON array from frontend (already parsed by express.json())
            images = JSON.stringify(req.body.images);
        } else if (req.body.images && typeof req.body.images === 'string') {
            // Already stringified JSON
            images = req.body.images;
        } else if (req.files && req.files['images']) {
            // FormData with new files
            const existingImages = req.body.existing_images ? JSON.parse(req.body.existing_images) : [];
            const newImages = req.files['images'].map(f => f.path);
            images = JSON.stringify([...existingImages, ...newImages]);
        } else if (req.body.existing_images) {
            // FormData with only existing images
            images = req.body.existing_images;
        } else {
            // Keep existing images from database
            images = existing[0].images;
        }
        
        // Handle 360 images
        let images360;
        if (Array.isArray(req.body.images360)) {
            // JSON array from frontend (already parsed by express.json())
            images360 = JSON.stringify(req.body.images360);
        } else if (req.body.images360 && typeof req.body.images360 === 'string') {
            // Already stringified JSON
            images360 = req.body.images360;
        } else if (req.files && req.files['images360']) {
            // FormData with new files
            const existing360Images = req.body.existing_images360 ? JSON.parse(req.body.existing_images360) : [];
            const new360Images = req.files['images360'].map(f => f.path);
            images360 = JSON.stringify([...existing360Images, ...new360Images]);
        } else if (req.body.existing_images360) {
            // FormData with only existing images
            images360 = req.body.existing_images360;
        } else {
            // Keep existing images from database
            images360 = existing[0].images360;
        }
        
        // Update sejour
        await pool.query(
            `UPDATE sejours 
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

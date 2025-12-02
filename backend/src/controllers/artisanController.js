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
        const { name_fr, name_en, name_ar, description_fr, description_en, description_ar, latitude, longitude, price } = req.body;
        
        // Validation
        if (!name_fr || !name_en || !name_ar || !description_fr || !description_en || !description_ar || !latitude || !longitude || !price) {
            return sendError(res, 'All fields are required: name_fr, name_en, name_ar, description_fr, description_en, description_ar, latitude, longitude, price', 400);
        }
        
        // Get uploaded files
        const main_image = req.files && req.files['main_image'] ? `/uploads/artisans/${req.files['main_image'][0].filename}` : null;
        const images = req.files && req.files['images'] ? JSON.stringify(req.files['images'].map(f => `/uploads/artisans/${f.filename}`)) : null;
        
        // Insert into database
        const [result] = await pool.query(
            `INSERT INTO artisans (name_fr, name_en, name_ar, description_fr, description_en, description_ar, category, latitude, longitude, price, main_image, images) 
             VALUES (?, ?, ?, ?, ?, ?, 'artisanat', ?, ?, ?, ?, ?)`,
            [name_fr, name_en, name_ar, description_fr, description_en, description_ar, latitude, longitude, price, main_image, images]
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
        // Set UTF-8 charset for proper French character handling
        await pool.query('SET NAMES utf8mb4');
        
        const { lang = 'fr' } = req.query; // Default to French
        
        const [artisans] = await pool.query(
            'SELECT * FROM artisans ORDER BY created_at DESC'
        );
        
        // Map data to correct language and parse images
        const localizedArtisans = artisans.map(artisan => {
            let parsedImages = [];
            try {
                if (artisan.images) {
                    parsedImages = typeof artisan.images === 'string' 
                        ? JSON.parse(artisan.images) 
                        : artisan.images;
                }
            } catch (e) {
                parsedImages = artisan.main_image ? [artisan.main_image] : [];
            }
            
            return {
                ...artisan,
                images: parsedImages,
                name: lang === 'ar' ? (artisan.name_ar || artisan.name) : 
                      lang === 'en' ? (artisan.name_en || artisan.name) : 
                      artisan.name,
                description: lang === 'ar' ? (artisan.description_ar || artisan.description) : 
                             lang === 'en' ? (artisan.description_en || artisan.description) : 
                             artisan.description
            };
        });
        
        return sendSuccess(res, localizedArtisans, 'Artisans retrieved successfully');
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
        const { lang = 'fr' } = req.query; // Default to French
        
        // Set UTF-8 charset for proper French character handling
        await pool.query('SET NAMES utf8mb4');
        
        const [artisan] = await pool.query('SELECT * FROM artisans WHERE id = ?', [id]);
        
        if (artisan.length === 0) {
            return sendNotFound(res, 'Artisan');
        }
        
        // Get related 360 images
        const [images] = await pool.query(
            'SELECT * FROM images_360 WHERE itemType = ? AND itemId = ?',
            ['artisanat', id]
        );
        
        // Parse images JSON array
        let parsedImages = [];
        try {
            if (artisan[0].images) {
                parsedImages = typeof artisan[0].images === 'string' 
                    ? JSON.parse(artisan[0].images) 
                    : artisan[0].images;
            }
        } catch (e) {
            console.warn('Failed to parse images JSON:', e);
            parsedImages = artisan[0].main_image ? [artisan[0].main_image] : [];
        }
        
        // Localize the data
        const localizedArtisan = {
            ...artisan[0],
            name: lang === 'ar' ? (artisan[0].name_ar || artisan[0].name) : 
                  lang === 'en' ? (artisan[0].name_en || artisan[0].name) : 
                  artisan[0].name,
            description: lang === 'ar' ? (artisan[0].description_ar || artisan[0].description) : 
                         lang === 'en' ? (artisan[0].description_en || artisan[0].description) : 
                         artisan[0].description
        };
        
        const result = {
            ...localizedArtisan,
            images: parsedImages,
            images_360: images,
            has360: images.length > 0
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
        const { name_fr, name_en, name_ar, description_fr, description_en, description_ar, latitude, longitude, price } = req.body;
        
        // Check if artisan exists
        const [existing] = await pool.query('SELECT * FROM artisans WHERE id = ?', [id]);
        
        if (existing.length === 0) {
            return sendNotFound(res, 'Artisan');
        }
        
        // Get uploaded files if new files are provided
        const main_image = req.files && req.files['main_image'] 
            ? `/uploads/artisans/${req.files['main_image'][0].filename}` 
            : existing[0].main_image;
        
        // Handle gallery images - replace with existing images (from frontend) + new uploads
        const existingImages = req.body.existing_images ? JSON.parse(req.body.existing_images) : [];
        const newImages = req.files && req.files['images'] 
            ? req.files['images'].map(f => `/uploads/artisans/${f.filename}`) 
            : [];
        const images = JSON.stringify([...existingImages, ...newImages]);
        
        // Handle 360 images - replace with existing images (from frontend) + new uploads
        const existing360Images = req.body.existing_images360 ? JSON.parse(req.body.existing_images360) : [];
        const new360Images = req.files && req.files['images360'] 
            ? req.files['images360'].map(f => `/uploads/artisans/${f.filename}`) 
            : [];
        const images360 = JSON.stringify([...existing360Images, ...new360Images]);
        
        // Update artisan
        await pool.query(
            `UPDATE artisans 
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

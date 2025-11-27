const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');

/**
 * @route   GET /api/images360
 * @desc    Get 360° images for a specific item
 * @access  Public
 * @query   itemType - Type of item (artisanat/sejour/caravane)
 * @query   itemId - ID of the item
 */
router.get('/', async (req, res) => {
  try {
    const { itemType, itemId } = req.query;
    
    if (!itemType || !itemId) {
      return res.status(400).json({
        success: false,
        message: 'itemType and itemId are required'
      });
    }

    const [images] = await pool.query(
      'SELECT * FROM images_360 WHERE itemType = ? AND itemId = ? ORDER BY uploaded_at DESC',
      [itemType, itemId]
    );
    
    res.json({
      success: true,
      data: images,
      count: images.length
    });
  } catch (error) {
    console.error('Error fetching 360 images:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching 360° images',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/images360/all
 * @desc    Get all 360° images
 * @access  Public
 */
router.get('/all', async (req, res) => {
  try {
    const [images] = await pool.query(
      'SELECT * FROM images_360 ORDER BY uploaded_at DESC'
    );
    
    res.json({
      success: true,
      data: images,
      count: images.length
    });
  } catch (error) {
    console.error('Error fetching all 360 images:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching 360° images'
    });
  }
});

module.exports = router;

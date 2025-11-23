/**
 * ============================================================
 * SAFARIA Platform - Reservations Controller
 * ============================================================
 * Handles all operations for booking management
 * ============================================================
 */

const { pool } = require('../config/db');
const { sendSuccess, sendError, sendNotFound } = require('../utils/responseHelper');

/**
 * @route   POST /api/reservations
 * @desc    Create a new reservation
 * @access  Public
 */
const createReservation = async (req, res) => {
    try {
        const { user_name, user_phone, itemType, itemId, reservation_date } = req.body;
        
        // Validation
        if (!user_name || !user_phone || !itemType || !itemId || !reservation_date) {
            return sendError(res, 'All fields are required: user_name, user_phone, itemType, itemId, reservation_date', 400);
        }
        
        // Validate itemType
        const validItemTypes = ['artisanat', 'sejour', 'caravane'];
        if (!validItemTypes.includes(itemType)) {
            return sendError(res, 'Invalid itemType. Must be: artisanat, sejour, or caravane', 400);
        }
        
        // Verify that the item exists in the corresponding table
        let tableName;
        if (itemType === 'artisanat') tableName = 'artisans';
        else if (itemType === 'sejour') tableName = 'sejours';
        else if (itemType === 'caravane') tableName = 'caravanes';
        
        const [item] = await pool.query(`SELECT id FROM ${tableName} WHERE id = ?`, [itemId]);
        
        if (item.length === 0) {
            return sendError(res, `${itemType} with id ${itemId} does not exist`, 404);
        }
        
        // Insert reservation
        const [result] = await pool.query(
            `INSERT INTO reservations (user_name, user_phone, itemType, itemId, reservation_date, status) 
             VALUES (?, ?, ?, ?, ?, 'pending')`,
            [user_name, user_phone, itemType, itemId, reservation_date]
        );
        
        // Fetch created reservation
        const [reservation] = await pool.query('SELECT * FROM reservations WHERE id = ?', [result.insertId]);
        
        return sendSuccess(res, reservation[0], 'Reservation created successfully', 201);
    } catch (error) {
        console.error('Error creating reservation:', error);
        return sendError(res, 'Failed to create reservation', 500, error.message);
    }
};

/**
 * @route   GET /api/reservations
 * @desc    Get all reservations
 * @access  Private
 */
const getAllReservations = async (req, res) => {
    try {
        // Get query parameters for filtering
        const { status, itemType } = req.query;
        
        let query = 'SELECT * FROM reservations';
        const params = [];
        const conditions = [];
        
        if (status) {
            conditions.push('status = ?');
            params.push(status);
        }
        
        if (itemType) {
            conditions.push('itemType = ?');
            params.push(itemType);
        }
        
        if (conditions.length > 0) {
            query += ' WHERE ' + conditions.join(' AND ');
        }
        
        query += ' ORDER BY created_at DESC';
        
        const [reservations] = await pool.query(query, params);
        
        // Enrich reservations with item details
        const enrichedReservations = await Promise.all(
            reservations.map(async (reservation) => {
                let tableName;
                if (reservation.itemType === 'artisanat') tableName = 'artisans';
                else if (reservation.itemType === 'sejour') tableName = 'sejours';
                else if (reservation.itemType === 'caravane') tableName = 'caravanes';
                
                const [item] = await pool.query(
                    `SELECT id, name, price FROM ${tableName} WHERE id = ?`,
                    [reservation.itemId]
                );
                
                return {
                    ...reservation,
                    item_details: item[0] || null
                };
            })
        );
        
        return sendSuccess(res, enrichedReservations, 'Reservations retrieved successfully');
    } catch (error) {
        console.error('Error fetching reservations:', error);
        return sendError(res, 'Failed to fetch reservations', 500, error.message);
    }
};

/**
 * @route   GET /api/reservations/:id
 * @desc    Get single reservation by ID
 * @access  Private
 */
const getReservationById = async (req, res) => {
    try {
        const { id } = req.params;
        
        const [reservation] = await pool.query('SELECT * FROM reservations WHERE id = ?', [id]);
        
        if (reservation.length === 0) {
            return sendNotFound(res, 'Reservation');
        }
        
        // Get item details
        let tableName;
        if (reservation[0].itemType === 'artisanat') tableName = 'artisans';
        else if (reservation[0].itemType === 'sejour') tableName = 'sejours';
        else if (reservation[0].itemType === 'caravane') tableName = 'caravanes';
        
        const [item] = await pool.query(
            `SELECT * FROM ${tableName} WHERE id = ?`,
            [reservation[0].itemId]
        );
        
        const result = {
            ...reservation[0],
            item_details: item[0] || null
        };
        
        return sendSuccess(res, result, 'Reservation retrieved successfully');
    } catch (error) {
        console.error('Error fetching reservation:', error);
        return sendError(res, 'Failed to fetch reservation', 500, error.message);
    }
};

/**
 * @route   PUT /api/reservations/:id
 * @desc    Update reservation status
 * @access  Private
 */
const updateReservationStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        // Validation
        const validStatuses = ['pending', 'confirmed', 'cancelled'];
        if (!status || !validStatuses.includes(status)) {
            return sendError(res, 'Invalid status. Must be: pending, confirmed, or cancelled', 400);
        }
        
        // Check if reservation exists
        const [existing] = await pool.query('SELECT * FROM reservations WHERE id = ?', [id]);
        
        if (existing.length === 0) {
            return sendNotFound(res, 'Reservation');
        }
        
        // Update status
        await pool.query(
            'UPDATE reservations SET status = ? WHERE id = ?',
            [status, id]
        );
        
        // Fetch updated reservation
        const [updated] = await pool.query('SELECT * FROM reservations WHERE id = ?', [id]);
        
        return sendSuccess(res, updated[0], 'Reservation status updated successfully');
    } catch (error) {
        console.error('Error updating reservation:', error);
        return sendError(res, 'Failed to update reservation', 500, error.message);
    }
};

/**
 * @route   DELETE /api/reservations/:id
 * @desc    Delete reservation by ID
 * @access  Private
 */
const deleteReservation = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Check if reservation exists
        const [existing] = await pool.query('SELECT * FROM reservations WHERE id = ?', [id]);
        
        if (existing.length === 0) {
            return sendNotFound(res, 'Reservation');
        }
        
        // Delete reservation
        await pool.query('DELETE FROM reservations WHERE id = ?', [id]);
        
        return sendSuccess(res, null, 'Reservation deleted successfully');
    } catch (error) {
        console.error('Error deleting reservation:', error);
        return sendError(res, 'Failed to delete reservation', 500, error.message);
    }
};

module.exports = {
    createReservation,
    getAllReservations,
    getReservationById,
    updateReservationStatus,
    deleteReservation
};

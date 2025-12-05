/**
 * ============================================================
 * SAFARIA Platform - Reservations Controller
 * ============================================================
 * Handles all operations for booking management
 * ============================================================
 */

const { pool } = require('../config/db');
const { sendSuccess, sendError, sendNotFound } = require('../utils/responseHelper');
const { generateReceipt, generateReceiptNumber, generateTransactionId } = require('../utils/pdfGenerator');
const path = require('path');
const fs = require('fs').promises;

/**
 * Helper function to normalize itemType values
 * Converts 'artisan' to 'artisanat' to match database ENUM
 */
const normalizeItemType = (itemType) => {
    if (itemType === 'artisan') return 'artisanat';
    return itemType; // sejour, caravane remain unchanged
};

/**
 * Helper function to get table name from itemType
 */
const getTableName = (itemType) => {
    const normalized = normalizeItemType(itemType);
    if (normalized === 'artisanat') return 'artisans';
    if (normalized === 'sejour') return 'sejours';
    if (normalized === 'caravane') return 'caravanes';
    return null;
};

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
        
        // Normalize and validate itemType
        const normalizedItemType = normalizeItemType(itemType);
        const validItemTypes = ['artisanat', 'sejour', 'caravane'];
        if (!validItemTypes.includes(normalizedItemType)) {
            return sendError(res, 'Invalid itemType. Must be: artisanat, sejour, or caravane', 400);
        }
        
        // Verify that the item exists in the corresponding table
        const tableName = getTableName(normalizedItemType);
        if (!tableName) {
            return sendError(res, 'Invalid itemType', 400);
        }
        
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
                const tableName = getTableName(reservation.item_type);
                
                if (!tableName) {
                    console.error('Invalid item_type:', reservation.item_type);
                    return {
                        ...reservation,
                        itemDetails: null
                    };
                }
                
                try {
                    const [item] = await pool.query(
                        `SELECT id, name, price, latitude, longitude FROM ${tableName} WHERE id = ?`,
                        [reservation.item_id]
                    );
                    
                    return {
                        ...reservation,
                        itemDetails: item[0] || null
                    };
                } catch (error) {
                    console.error('Error fetching item details:', error);
                    return {
                        ...reservation,
                        itemDetails: null
                    };
                }
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
        const tableName = getTableName(reservation[0].item_type);
        if (!tableName) {
            return sendError(res, 'Invalid item type in reservation', 400);
        }
        
        const [item] = await pool.query(
            `SELECT * FROM ${tableName} WHERE id = ?`,
            [reservation[0].item_id]
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

/**
 * @route   POST /api/reservations/payment
 * @desc    Process payment and create reservation with receipt
 * @access  Public
 */
const processPayment = async (req, res) => {
    const connection = await pool.getConnection();
    
    try {
        const { reservationData, payment } = req.body;
        
        console.log('=== PAYMENT REQUEST RECEIVED ===');
        console.log('Full request body:', JSON.stringify(req.body, null, 2));
        
        // Validation
        if (!reservationData || !payment) {
            return sendError(res, 'Missing reservation data or payment information', 400);
        }
        
        // Extract data
        const {
            itemId,
            itemType,
            itemName,
            itemPrice,
            checkIn,
            checkOut,
            guests,
            email,
            phone,
            specialRequests,
            days,
            subtotal,
            serviceFee,
            taxes,
            total
        } = reservationData;
        
        // Normalize itemType first
        const normalizedItemType = normalizeItemType(itemType);
        
        // If itemName is null/undefined, set a default based on itemType
        const finalItemName = itemName || `${normalizedItemType} Item`;
        
        console.log('Extracted fields:', {
            itemId, itemType, itemName, itemPrice,
            checkIn, checkOut, guests, email, phone,
            days, subtotal, serviceFee, taxes, total
        });
        
        const {
            cardNumber,
            cardHolder,
            billingAddress
        } = payment;
        
        // Validate required fields
        const missingFields = [];
        if (!itemId) missingFields.push('itemId');
        if (!itemType) missingFields.push('itemType');
        if (!email) missingFields.push('email');
        if (!phone) missingFields.push('phone');
        if (!checkIn) missingFields.push('checkIn');
        if (!checkOut) missingFields.push('checkOut');
        if (!guests) missingFields.push('guests');
        
        if (missingFields.length > 0) {
            console.log('Missing reservation fields:', missingFields);
            console.log('Received reservationData:', reservationData);
            return sendError(res, `Missing required reservation fields: ${missingFields.join(', ')}`, 400);
        }
        
        if (!cardNumber || !cardHolder) {
            console.log('Missing payment fields. cardNumber:', !!cardNumber, 'cardHolder:', !!cardHolder);
            return sendError(res, 'Missing required payment fields', 400);
        }
        
        // Generate transaction details
        const transactionId = generateTransactionId();
        const receiptNumber = generateReceiptNumber();
        const cardLastFour = cardNumber.replace(/\s/g, '').slice(-4);
        
        // Start transaction
        await connection.beginTransaction();
        
        // Fetch actual item name from the appropriate table
        const tableName = getTableName(itemType);
        let actualItemName = finalItemName;
        
        if (tableName) {
            const [items] = await connection.query(
                `SELECT name_en, name_fr, name_ar FROM ${tableName} WHERE id = ?`,
                [itemId]
            );
            if (items.length > 0) {
                // Use English name by default, fallback to French or Arabic
                actualItemName = items[0].name_en || items[0].name_fr || items[0].name_ar || finalItemName;
            }
        }
        
        // Insert reservation (without item_name since that column doesn't exist)
        const [reservationResult] = await connection.query(
            `INSERT INTO reservations (
                user_email, user_phone, item_type, item_id, item_price,
                start_date, end_date, guests, days, special_requests,
                subtotal, service_fee, taxes, total_price, status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'confirmed')`,
            [
                email, phone, normalizedItemType, itemId, itemPrice,
                checkIn, checkOut, guests, days, specialRequests || null,
                subtotal, serviceFee, taxes, total
            ]
        );
        
        const reservationId = reservationResult.insertId;
        
        // Generate PDF receipt (no local directory needed)
        
        const receiptData = {
            receiptNumber,
            transactionId,
            customerEmail: email,
            customerPhone: phone,
            itemName: actualItemName,
            itemType,
            itemPrice,
            checkIn,
            checkOut,
            days,
            guests,
            specialRequests: specialRequests || 'None',
            subtotal,
            serviceFee,
            taxes,
            total,
            paymentStatus: 'Paid'
        };
        
        // Insert payment record (ONLY store last 4 digits, NO full card details)
        // Store receipt number so we can regenerate PDF on demand
        await connection.query(
            `INSERT INTO payments (
                reservation_id, transaction_id, receipt_number, payment_method,
                card_last_four, card_holder_name, billing_address,
                amount, currency, payment_status, receipt_pdf_path
            ) VALUES (?, ?, ?, 'card', ?, ?, ?, ?, 'MAD', 'completed', ?)`,
            [
                reservationId, transactionId, receiptNumber,
                cardLastFour, cardHolder, billingAddress || null,
                total, null  // No need to store path, we'll generate on demand
            ]
        );
        
        // Commit transaction
        await connection.commit();
        
        return sendSuccess(res, {
            reservationId,
            transactionId,
            receiptNumber,
            message: 'Payment processed successfully'
        }, 'Payment completed', 201);
        
    } catch (error) {
        await connection.rollback();
        console.error('Error processing payment:', error);
        return sendError(res, 'Failed to process payment', 500, error.message);
    } finally {
        connection.release();
    }
};

/**
 * @route   GET /api/reservations/:id/receipt
 * @desc    Download PDF receipt for a reservation
 * @access  Public
 */
const getReceipt = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Get reservation and payment details to regenerate receipt
        const [reservation] = await pool.query(
            `SELECT r.*, p.receipt_number, p.transaction_id, p.amount, 
                    u.email, u.phone
             FROM reservations r
             JOIN payments p ON p.reservation_id = r.id
             LEFT JOIN users u ON u.id = r.user_id
             WHERE r.id = ?`,
            [id]
        );
        
        if (reservation.length === 0) {
            return sendNotFound(res, 'Receipt');
        }
        
        const data = reservation[0];
        
        // Fetch item name from the appropriate table
        const tableName = getTableName(data.item_type);
        let itemName = 'Unknown Item';
        
        if (tableName && data.item_id) {
            const [items] = await pool.query(
                `SELECT name_en, name_fr, name_ar FROM ${tableName} WHERE id = ?`,
                [data.item_id]
            );
            if (items.length > 0) {
                itemName = items[0].name_en || items[0].name_fr || items[0].name_ar || 'Unknown Item';
            }
        }
        
        // Prepare receipt data
        const receiptData = {
            receiptNumber: data.receipt_number,
            transactionId: data.transaction_id,
            customerEmail: data.email || data.user_email || '',
            customerPhone: data.phone || data.user_phone || '',
            itemName: itemName,
            itemType: data.item_type,
            itemPrice: data.item_price || 0,
            checkIn: data.start_date, // Database column is start_date
            checkOut: data.end_date,   // Database column is end_date
            days: data.days || 1,
            guests: data.guests || 1,
            specialRequests: data.special_requests || 'None',
            subtotal: data.subtotal || data.amount,
            serviceFee: data.service_fee || Math.round((data.subtotal || data.amount) * 0.1),
            taxes: data.taxes || Math.round((data.subtotal || data.amount) * 0.05),
            total: data.amount || data.total_price,
            paymentStatus: 'Paid'
        };
        
        // Generate PDF buffer
        const pdfBuffer = await generateReceipt(receiptData);
        
        // Send PDF directly
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${data.receipt_number}.pdf"`);
        res.setHeader('Content-Length', pdfBuffer.length);
        
        return res.send(pdfBuffer);
        
    } catch (error) {
        console.error('Error generating receipt:', error);
        return sendError(res, 'Failed to generate receipt', 500, error.message);
    }
};

module.exports = {
    createReservation,
    getAllReservations,
    getReservationById,
    updateReservationStatus,
    deleteReservation,
    processPayment,
    getReceipt
};

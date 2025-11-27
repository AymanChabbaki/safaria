/**
 * ============================================================
 * SAFARIA Platform - Reservations Routes
 * ============================================================
 */

const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const {
    createReservation,
    getAllReservations,
    getReservationById,
    updateReservationStatus,
    deleteReservation,
    processPayment,
    getReceipt
} = require('../controllers/reservationController');

// Public routes
router.post('/', createReservation);
router.post('/payment', processPayment); // Process payment and create reservation
router.get('/:id/receipt', getReceipt); // Download PDF receipt

// Protected routes - require authentication
router.get('/', getAllReservations);
router.get('/:id', getReservationById);
router.put('/:id', updateReservationStatus);
router.delete('/:id', deleteReservation);

module.exports = router;

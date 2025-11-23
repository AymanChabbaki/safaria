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
    deleteReservation
} = require('../controllers/reservationController');

// Public route - anyone can create a reservation
router.post('/', createReservation);

// Protected routes - require authentication
router.get('/', getAllReservations);
router.get('/:id', getReservationById);
router.put('/:id', updateReservationStatus);
router.delete('/:id', deleteReservation);

module.exports = router;

/**
 * ============================================================
 * SAFARIA Platform - Express Application Setup
 * ============================================================
 * Main application configuration and middleware setup
 * ============================================================
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Import routes
const artisanRoutes = require('./routes/artisanRoutes');
const sejourRoutes = require('./routes/sejourRoutes');
const caravaneRoutes = require('./routes/caravaneRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const images360Routes = require('./routes/images360Routes');
const authRoutes = require('./routes/authRoutes');

// Initialize Express app
const app = express();

// ============================================================
// MIDDLEWARE CONFIGURATION
// ============================================================

// CORS configuration - Allow multiple origins
const allowedOrigins = [
    'https://safaria212.vercel.app',
    'http://localhost:5173',
    'http://localhost:5174',
    process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
    origin: function(origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(null, true); // Allow all origins in production for now
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser middleware with increased limit for base64 images
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static files - serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Request logging middleware (development)
if (process.env.NODE_ENV === 'development') {
    app.use((req, res, next) => {
        console.log(`${req.method} ${req.path}`);
        next();
    });
}

// ============================================================
// ROUTES
// ============================================================

// Health check endpoint
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'SAFARIA API is running',
        version: '1.0.0',
        endpoints: {
            artisans: '/api/artisans',
            sejours: '/api/sejours',
            caravanes: '/api/caravanes',
            reservations: '/api/reservations',
            images360: '/api/360',
            auth: '/api/auth'
        }
    });
});

// API Routes
app.use('/api/artisans', artisanRoutes);
app.use('/api/sejours', sejourRoutes);
app.use('/api/caravanes', caravaneRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/images360', images360Routes);
app.use('/api/auth', authRoutes);

// ============================================================
// ERROR HANDLING
// ============================================================

// 404 handler - route not found
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
        path: req.path
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

module.exports = app;

/**
 * ============================================================
 * SAFARIA Platform - Server Entry Point
 * ============================================================
 * Starts the Express server and connects to the database
 * ============================================================
 */

require('dotenv').config();
const app = require('./app');
const { testConnection } = require('./config/db');

// Server configuration
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';

// Start server
const startServer = async () => {
    try {
        // Test database connection
        console.log(' Testing database connection...');
        const isConnected = await testConnection();
        
        if (!isConnected) {
            console.error(' Failed to connect to database. Server not started.');
            process.exit(1);
        }
        
        // Start Express server
        app.listen(PORT, HOST, () => {
            console.log('\n' + '='.repeat(50));
            console.log(' SAFARIA API Server Started');
            console.log('='.repeat(50));
            console.log(` Server: http://localhost:${PORT}`);
            console.log(` Environment: ${process.env.NODE_ENV || 'development'}`);
            console.log(` Started at: ${new Date().toLocaleString()}`);
            console.log('='.repeat(50) + '\n');
            console.log(' API Documentation:');
            console.log(`   Health Check: http://localhost:${PORT}/`);
            console.log(`   Artisans:     http://localhost:${PORT}/api/artisans`);
            console.log(`   Sejours:      http://localhost:${PORT}/api/sejours`);
            console.log(`   Caravanes:    http://localhost:${PORT}/api/caravanes`);
            console.log(`   Reservations: http://localhost:${PORT}/api/reservations`);
            console.log(`   Images 360:   http://localhost:${PORT}/api/360`);
            console.log(`   Auth:         http://localhost:${PORT}/api/auth/login`);
            console.log('\n' + '='.repeat(50) + '\n');
        });
    } catch (error) {
        console.error(' Error starting server:', error);
        process.exit(1);
    }
};

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error(' Uncaught Exception:', error);
    process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error(' Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});

// Start the server
startServer();

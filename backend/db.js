/**
 * ============================================================
 * SAFARIA Platform - Database Connection Module
 * ============================================================
 * This module establishes a connection pool to the MySQL database
 * using mysql2 with promise support for async/await syntax
 * ============================================================
 */

const mysql = require('mysql2');
require('dotenv').config();

// Create connection pool for better performance
// Pool automatically manages connections and reuses them
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'safaria_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
});

// Get promise-based wrapper for async/await support
const promisePool = pool.promise();

// Test database connection
const testConnection = async () => {
    try {
        const connection = await promisePool.getConnection();
        console.log('✅ Database connected successfully!');
        console.log(`📊 Connected to database: ${process.env.DB_NAME}`);
        connection.release();
        return true;
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
        console.error('Please check your .env configuration');
        return false;
    }
};

// Execute test connection on module load
testConnection();

// Export promise pool for use in other modules
module.exports = {
    pool: promisePool,
    testConnection
};

/**
 * ============================================================
 * SAFARIA Platform - Authentication Middleware
 * ============================================================
 * JWT-based authentication middleware
 * Protects routes that require admin authentication
 * ============================================================
 */

const jwt = require('jsonwebtoken');

/**
 * Verify JWT token and protect routes
 */
const authenticateToken = (req, res, next) => {
    try {
        // Get token from Authorization header
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Access denied. No token provided.'
            });
        }
        
        // Verify token
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(403).json({
                    success: false,
                    message: 'Invalid or expired token.'
                });
            }
            
            // Attach user info to request
            req.user = decoded;
            next();
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Authentication error.',
            error: error.message
        });
    }
};

/**
 * Check if user has admin role
 */
const requireAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        return res.status(403).json({
            success: false,
            message: 'Access denied. Admin privileges required.'
        });
    }
};

module.exports = {
    authenticateToken,
    requireAdmin
};

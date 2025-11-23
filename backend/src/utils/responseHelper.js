/**
 * ============================================================
 * SAFARIA Platform - Response Utilities
 * ============================================================
 * Standardized response helpers for consistent API responses
 * ============================================================
 */

/**
 * Send success response
 */
const sendSuccess = (res, data, message = 'Success', statusCode = 200) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data
    });
};

/**
 * Send error response
 */
const sendError = (res, message = 'An error occurred', statusCode = 500, error = null) => {
    const response = {
        success: false,
        message
    };
    
    if (error && process.env.NODE_ENV === 'development') {
        response.error = error;
    }
    
    return res.status(statusCode).json(response);
};

/**
 * Send validation error response
 */
const sendValidationError = (res, errors) => {
    return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
    });
};

/**
 * Send not found response
 */
const sendNotFound = (res, resource = 'Resource') => {
    return res.status(404).json({
        success: false,
        message: `${resource} not found`
    });
};

module.exports = {
    sendSuccess,
    sendError,
    sendValidationError,
    sendNotFound
};

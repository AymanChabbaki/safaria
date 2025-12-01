/**
 * ============================================================
 * SAFARIA Platform - API Service Layer
 * ============================================================
 * Axios utilities for backend communication
 * All API endpoints configured to match Phase 3 backend
 * ============================================================
 */

import axios from 'axios';

// Base API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
});

// Request interceptor - Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('safaria_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('safaria_token');
      localStorage.removeItem('safaria_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ============================================================
// ARTISANS API
// ============================================================

/**
 * Get all artisan experiences
 * @param {string} lang - Language code (fr, ar, en)
 * @returns {Promise} Array of artisans
 */
export const getArtisans = async (lang = 'fr') => {
  try {
    const response = await api.get('/api/artisans', { params: { lang } });
    return response.data;
  } catch (error) {
    console.error('Error fetching artisans:', error);
    throw error;
  }
};

/**
 * Get single artisan by ID
 * @param {number} id - Artisan ID
 * @param {string} lang - Language code (fr, ar, en)
 * @returns {Promise} Artisan details
 */
export const getArtisanById = async (id, lang = 'fr') => {
  try {
    const response = await api.get(`/api/artisans/${id}`, { params: { lang } });
    return response.data;
  } catch (error) {
    console.error(`Error fetching artisan ${id}:`, error);
    throw error;
  }
};

/**
 * Create new artisan (Admin only)
 * @param {FormData} formData - Artisan data with image
 * @returns {Promise} Created artisan
 */
export const createArtisan = async (formData) => {
  try {
    const response = await api.post('/api/artisans', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating artisan:', error);
    throw error;
  }
};

/**
 * Update artisan (Admin only)
 * @param {number} id - Artisan ID
 * @param {FormData} formData - Updated data
 * @returns {Promise} Updated artisan
 */
export const updateArtisan = async (id, formData) => {
  try {
    const response = await api.put(`/api/artisans/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating artisan ${id}:`, error);
    throw error;
  }
};

/**
 * Delete artisan (Admin only)
 * @param {number} id - Artisan ID
 * @returns {Promise} Success message
 */
export const deleteArtisan = async (id) => {
  try {
    const response = await api.delete(`/api/artisans/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting artisan ${id}:`, error);
    throw error;
  }
};

// ============================================================
// SEJOURS API
// ============================================================

/**
 * Get all sejour experiences
 * @param {string} lang - Language code (fr, ar, en)
 * @returns {Promise} Array of sejours
 */
export const getSejours = async (lang = 'fr') => {
  try {
    const response = await api.get('/api/sejours', { params: { lang } });
    return response.data;
  } catch (error) {
    console.error('Error fetching sejours:', error);
    throw error;
  }
};

/**
 * Get single sejour by ID
 * @param {number} id - Sejour ID
 * @param {string} lang - Language code (fr, ar, en)
 * @returns {Promise} Sejour details
 */
export const getSejourById = async (id, lang = 'fr') => {
  try {
    const response = await api.get(`/api/sejours/${id}`, { params: { lang } });
    return response.data;
  } catch (error) {
    console.error(`Error fetching sejour ${id}:`, error);
    throw error;
  }
};

/**
 * Create new sejour (Admin only)
 * @param {FormData} formData - Sejour data with image
 * @returns {Promise} Created sejour
 */
export const createSejour = async (formData) => {
  try {
    const response = await api.post('/api/sejours', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating sejour:', error);
    throw error;
  }
};

/**
 * Update sejour (Admin only)
 * @param {number} id - Sejour ID
 * @param {FormData} formData - Updated data
 * @returns {Promise} Updated sejour
 */
export const updateSejour = async (id, formData) => {
  try {
    const response = await api.put(`/api/sejours/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating sejour ${id}:`, error);
    throw error;
  }
};

/**
 * Delete sejour (Admin only)
 * @param {number} id - Sejour ID
 * @returns {Promise} Success message
 */
export const deleteSejour = async (id) => {
  try {
    const response = await api.delete(`/api/sejours/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting sejour ${id}:`, error);
    throw error;
  }
};

// ============================================================
// CARAVANES API
// ============================================================

/**
 * Get all caravane experiences
 * @param {string} lang - Language code (fr, ar, en)
 * @returns {Promise} Array of caravanes
 */
export const getCaravanes = async (lang = 'fr') => {
  try {
    const response = await api.get('/api/caravanes', { params: { lang } });
    return response.data;
  } catch (error) {
    console.error('Error fetching caravanes:', error);
    throw error;
  }
};

/**
 * Get single caravane by ID
 * @param {number} id - Caravane ID
 * @param {string} lang - Language code (fr, ar, en)
 * @returns {Promise} Caravane details
 */
export const getCaravaneById = async (id, lang = 'fr') => {
  try {
    const response = await api.get(`/api/caravanes/${id}`, { params: { lang } });
    return response.data;
  } catch (error) {
    console.error(`Error fetching caravane ${id}:`, error);
    throw error;
  }
};

/**
 * Create new caravane (Admin only)
 * @param {FormData} formData - Caravane data with image
 * @returns {Promise} Created caravane
 */
export const createCaravane = async (formData) => {
  try {
    const response = await api.post('/api/caravanes', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating caravane:', error);
    throw error;
  }
};

/**
 * Update caravane (Admin only)
 * @param {number} id - Caravane ID
 * @param {FormData} formData - Updated data
 * @returns {Promise} Updated caravane
 */
export const updateCaravane = async (id, formData) => {
  try {
    const response = await api.put(`/api/caravanes/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating caravane ${id}:`, error);
    throw error;
  }
};

/**
 * Delete caravane (Admin only)
 * @param {number} id - Caravane ID
 * @returns {Promise} Success message
 */
export const deleteCaravane = async (id) => {
  try {
    const response = await api.delete(`/api/caravanes/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting caravane ${id}:`, error);
    throw error;
  }
};

// ============================================================
// GENERIC ITEM API (For dynamic type handling)
// ============================================================

/**
 * Get item details by type and ID
 * @param {string} type - Item type (artisanat, sejour, caravane)
 * @param {number} id - Item ID
 * @returns {Promise} Item details
 */
export const getItemDetails = async (type, id) => {
  try {
    let endpoint;
    switch (type) {
      case 'artisanat':
        endpoint = `/api/artisans/${id}`;
        break;
      case 'sejour':
        endpoint = `/api/sejours/${id}`;
        break;
      case 'caravane':
        endpoint = `/api/caravanes/${id}`;
        break;
      default:
        throw new Error(`Invalid item type: ${type}`);
    }
    
    const response = await api.get(endpoint);
    return response.data;
  } catch (error) {
    console.error(`Error fetching ${type} ${id}:`, error);
    throw error;
  }
};

/**
 * Get all items of all types
 * @returns {Promise} Object with all items categorized
 */
export const getAllItems = async () => {
  try {
    const [artisans, sejours, caravanes] = await Promise.all([
      getArtisans(),
      getSejours(),
      getCaravanes(),
    ]);
    
    return {
      artisans: artisans.data || [],
      sejours: sejours.data || [],
      caravanes: caravanes.data || [],
    };
  } catch (error) {
    console.error('Error fetching all items:', error);
    throw error;
  }
};

// ============================================================
// RESERVATIONS API
// ============================================================

/**
 * Create a new reservation
 * @param {Object} data - Reservation data
 * @returns {Promise} Created reservation
 */
export const createReservation = async (data) => {
  try {
    const response = await api.post('/api/reservations', data);
    return response.data;
  } catch (error) {
    console.error('Error creating reservation:', error);
    throw error;
  }
};

/**
 * Get all reservations (Admin only)
 * @param {Object} params - Query parameters (status, itemType)
 * @returns {Promise} Array of reservations
 */
export const getReservations = async (params = {}) => {
  try {
    const response = await api.get('/api/reservations', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching reservations:', error);
    throw error;
  }
};

/**
 * Get single reservation by ID (Admin only)
 * @param {number} id - Reservation ID
 * @returns {Promise} Reservation details
 */
export const getReservationById = async (id) => {
  try {
    const response = await api.get(`/api/reservations/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching reservation ${id}:`, error);
    throw error;
  }
};

/**
 * Update reservation status (Admin only)
 * @param {number} id - Reservation ID
 * @param {string} status - New status (pending, confirmed, cancelled)
 * @returns {Promise} Updated reservation
 */
export const updateReservationStatus = async (id, status) => {
  try {
    const response = await api.put(`/api/reservations/${id}`, { status });
    return response.data;
  } catch (error) {
    console.error(`Error updating reservation ${id}:`, error);
    throw error;
  }
};

/**
 * Delete reservation (Admin only)
 * @param {number} id - Reservation ID
 * @returns {Promise} Success message
 */
export const deleteReservation = async (id) => {
  try {
    const response = await api.delete(`/api/reservations/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting reservation ${id}:`, error);
    throw error;
  }
};

/**
 * Process payment and create reservation
 * @param {Object} data - Reservation and payment data
 * @returns {Promise} Payment result with transaction ID
 */
export const processPayment = async (data) => {
  try {
    console.log('Sending payment data:', data); // Debug log
    const response = await api.post('/api/reservations/payment', data);
    return response.data;
  } catch (error) {
    console.error('Error processing payment:', error);
    console.error('Error response:', error.response?.data); // Log backend error
    console.error('Error status:', error.response?.status); // Log status code
    throw error;
  }
};

/**
 * Download receipt PDF
 * @param {number} reservationId - Reservation ID
 * @returns {Promise} Blob data for PDF
 */
export const downloadReceipt = async (reservationId) => {
  try {
    const response = await api.get(`/api/reservations/${reservationId}/receipt`, {
      responseType: 'blob'
    });
    return response.data;
  } catch (error) {
    console.error(`Error downloading receipt for reservation ${reservationId}:`, error);
    throw error;
  }
};

// ============================================================
// 360° IMAGES API
// ============================================================

/**
 * Upload 360° image (Admin only)
 * @param {FormData} formData - Image data with itemType and itemId
 * @returns {Promise} Uploaded image details
 */
export const upload360Image = async (formData) => {
  try {
    const response = await api.post('/api/360', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  } catch (error) {
    console.error('Error uploading 360 image:', error);
    throw error;
  }
};

/**
 * Get 360° images for an item
 * @param {string} itemType - Item type (artisanat, sejour, caravane)
 * @param {number} itemId - Item ID
 * @returns {Promise} Array of 360 images
 */
export const get360Images = async (itemType, itemId) => {
  try {
    const response = await api.get(`/api/360/${itemType}/${itemId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching 360 images for ${itemType} ${itemId}:`, error);
    throw error;
  }
};

/**
 * Delete 360° image (Admin only)
 * @param {number} id - Image ID
 * @returns {Promise} Success message
 */
export const delete360Image = async (id) => {
  try {
    const response = await api.delete(`/api/360/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting 360 image ${id}:`, error);
    throw error;
  }
};

// ============================================================
// AUTHENTICATION API
// ============================================================

/**
 * Login user
 * @param {Object} data - Login credentials (email, password)
 * @returns {Promise} User data and token
 */
export const login = async (data) => {
  try {
    const response = await api.post('/api/auth/login', data);
    
    // Store token and user data
    if (response.data.success) {
      localStorage.setItem('safaria_token', response.data.data.token);
      localStorage.setItem('safaria_user', JSON.stringify(response.data.data.user));
    }
    
    return response.data;
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
};

/**
 * Register new user
 * @param {Object} data - User registration data (name, email, phone, password)
 * @returns {Promise} User data and token
 */
export const register = async (data) => {
  try {
    const response = await api.post('/api/auth/register', data);
    
    // Store token and user data
    if (response.data.success) {
      localStorage.setItem('safaria_token', response.data.data.token);
      localStorage.setItem('safaria_user', JSON.stringify(response.data.data.user));
    }
    
    return response.data;
  } catch (error) {
    console.error('Error during registration:', error);
    throw error;
  }
};

/**
 * Logout user
 */
export const logout = () => {
  localStorage.removeItem('safaria_token');
  localStorage.removeItem('safaria_user');
  window.location.href = '/login';
};

/**
 * Verify token
 * @returns {Promise} User data if valid
 */
export const verifyToken = async () => {
  try {
    const response = await api.get('/api/auth/verify');
    return response.data;
  } catch (error) {
    console.error('Error verifying token:', error);
    throw error;
  }
};

/**
 * Check if user is authenticated
 * @returns {boolean} Authentication status
 */
export const isAuthenticated = () => {
  const token = localStorage.getItem('safaria_token');
  return !!token;
};

/**
 * Get current user from localStorage
 * @returns {Object|null} User data or null
 */
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('safaria_user');
  return userStr ? JSON.parse(userStr) : null;
};

/**
 * Update user profile
 * @param {FormData} formData - Form data with name, phone, photo
 * @returns {Promise} Updated user data
 */
export const updateProfile = async (formData) => {
  try {
    const response = await api.put('/api/auth/profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    // Update user in localStorage
    if (response.data?.user) {
      localStorage.setItem('safaria_user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
};

// ============================================================
// EXPORTS
// ============================================================
export default {
  // Axios instance
  instance: api,
  
  // Auth
  auth: {
    login,
    register,
    logout,
    verifyToken,
    isAuthenticated,
    getCurrentUser,
    updateProfile
  },
  
  // Artisans
  artisans: {
    getAll: getArtisans,
    getById: getArtisanById,
    create: createArtisan,
    update: updateArtisan,
    delete: deleteArtisan
  },
  
  // Sejours
  sejours: {
    getAll: getSejours,
    getById: getSejourById,
    create: createSejour,
    update: updateSejour,
    delete: deleteSejour
  },
  
  // Caravanes
  caravanes: {
    getAll: getCaravanes,
    getById: getCaravaneById,
    create: createCaravane,
    update: updateCaravane,
    delete: deleteCaravane
  },
  
  // Reservations
  reservations: {
    getAll: getReservations,
    getById: getReservationById,
    create: createReservation,
    updateStatus: updateReservationStatus,
    delete: deleteReservation
  },
  
  // Payments
  payments: {
    process: processPayment,
    downloadReceipt: downloadReceipt
  }
};

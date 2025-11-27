-- ============================================================
-- SAFARIA Platform - Enhanced Reservations & Payments Schema
-- ============================================================

-- Drop existing tables if they exist
DROP TABLE IF EXISTS payments;
DROP TABLE IF EXISTS reservations;

-- ============================================================
-- RESERVATIONS TABLE
-- ============================================================
CREATE TABLE reservations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    
    -- User Information
    user_id INT DEFAULT NULL,
    user_email VARCHAR(255) NOT NULL,
    user_phone VARCHAR(50) NOT NULL,
    
    -- Item Information
    item_type ENUM('artisanat', 'sejour', 'caravane') NOT NULL,
    item_id INT NOT NULL,
    item_name VARCHAR(255) NOT NULL,
    item_price DECIMAL(10, 2) NOT NULL,
    
    -- Booking Details
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    guests INT NOT NULL DEFAULT 1,
    days INT NOT NULL,
    
    -- Special Requests
    special_requests TEXT DEFAULT NULL,
    
    -- Pricing
    subtotal DECIMAL(10, 2) NOT NULL,
    service_fee DECIMAL(10, 2) NOT NULL,
    taxes DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    
    -- Status
    status ENUM('pending', 'confirmed', 'cancelled', 'completed') DEFAULT 'pending',
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_user_email (user_email),
    INDEX idx_item_type_id (item_type, item_id),
    INDEX idx_status (status),
    INDEX idx_dates (start_date, end_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- PAYMENTS TABLE
-- ============================================================
CREATE TABLE payments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    
    -- Reservation Link
    reservation_id INT NOT NULL,
    
    -- Transaction Information
    transaction_id VARCHAR(100) UNIQUE NOT NULL,
    receipt_number VARCHAR(50) UNIQUE NOT NULL,
    
    -- Payment Details (DO NOT store actual card details)
    payment_method VARCHAR(50) DEFAULT 'card',
    card_last_four CHAR(4) NOT NULL,
    card_holder_name VARCHAR(255) NOT NULL,
    
    -- Billing Address
    billing_address TEXT DEFAULT NULL,
    
    -- Amount
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'MAD',
    
    -- Status
    payment_status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'completed',
    
    -- PDF Receipt
    receipt_pdf_path VARCHAR(500) DEFAULT NULL,
    
    -- Timestamps
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (reservation_id) REFERENCES reservations(id) ON DELETE CASCADE,
    INDEX idx_transaction_id (transaction_id),
    INDEX idx_reservation_id (reservation_id),
    INDEX idx_payment_status (payment_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Sample Data (Optional)
-- ============================================================
-- You can add sample reservations and payments here for testing

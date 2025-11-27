-- ============================================================
-- SAFARIA Database - Multilingual Schema Setup
-- Supports: French, Arabic, English
-- ============================================================

SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

-- Drop existing tables to recreate with proper structure
DROP TABLE IF EXISTS images_360;
DROP TABLE IF EXISTS reservations;
DROP TABLE IF EXISTS caravanes;
DROP TABLE IF EXISTS sejours;
DROP TABLE IF EXISTS artisans;
DROP TABLE IF EXISTS users;

-- ============================================================
-- Users Table with multilingual support
-- ============================================================
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role ENUM('user', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Artisans Table (Artisan Experiences) - Multilingual
-- ============================================================
CREATE TABLE artisans (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    name_ar VARCHAR(200),
    name_en VARCHAR(200),
    description TEXT NOT NULL,
    description_ar TEXT,
    description_en TEXT,
    category VARCHAR(50) DEFAULT 'artisanat',
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    main_image VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Sejours Table (Accommodations) - Multilingual
-- ============================================================
CREATE TABLE sejours (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    name_ar VARCHAR(200),
    name_en VARCHAR(200),
    description TEXT NOT NULL,
    description_ar TEXT,
    description_en TEXT,
    category VARCHAR(50) DEFAULT 'sejour',
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    main_image VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Caravanes Table (Desert Experiences) - Multilingual
-- ============================================================
CREATE TABLE caravanes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    name_ar VARCHAR(200),
    name_en VARCHAR(200),
    description TEXT NOT NULL,
    description_ar TEXT,
    description_en TEXT,
    category VARCHAR(50) DEFAULT 'caravane',
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    main_image VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Reservations Table
-- ============================================================
CREATE TABLE reservations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    item_type ENUM('artisanat', 'sejour', 'caravane') NOT NULL,
    item_id INT NOT NULL,
    reservation_date DATE NOT NULL,
    number_of_people INT DEFAULT 1,
    total_price DECIMAL(10, 2) NOT NULL,
    status ENUM('pending', 'confirmed', 'cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- 360° Images Table
-- ============================================================
CREATE TABLE images_360 (
    id INT AUTO_INCREMENT PRIMARY KEY,
    itemType VARCHAR(50) NOT NULL,
    itemId INT NOT NULL,
    imageUrl VARCHAR(500) NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Indexes for better performance
-- ============================================================
CREATE INDEX idx_artisans_category ON artisans(category);
CREATE INDEX idx_sejours_category ON sejours(category);
CREATE INDEX idx_caravanes_category ON caravanes(category);
CREATE INDEX idx_images_360_item ON images_360(itemType, itemId);
CREATE INDEX idx_reservations_user ON reservations(user_id);
CREATE INDEX idx_reservations_item ON reservations(item_type, item_id);

SELECT 'Schema created successfully!' as status;

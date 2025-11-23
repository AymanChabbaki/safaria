-- ============================================================
-- SAFARIA Platform - Database Schema
-- Phase 2: Database Design
-- ============================================================
-- This script creates the complete database structure for SAFARIA
-- Including all tables, constraints, and relationships
-- ============================================================

-- Drop database if exists (use with caution in production)
DROP DATABASE IF EXISTS safaria_db;

-- Create database with UTF8 support for Arabic and French characters
CREATE DATABASE safaria_db 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE safaria_db;

-- ============================================================
-- TABLE: artisans
-- Stores information about artisan experiences/workshops
-- ============================================================
CREATE TABLE artisans (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) DEFAULT 'artisanat',
    latitude DECIMAL(10,7) NOT NULL,
    longitude DECIMAL(10,7) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    main_image VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_category (category),
    INDEX idx_location (latitude, longitude)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLE: sejours
-- Stores information about accommodation/stays
-- ============================================================
CREATE TABLE sejours (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) DEFAULT 'sejour',
    latitude DECIMAL(10,7) NOT NULL,
    longitude DECIMAL(10,7) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    main_image VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_category (category),
    INDEX idx_location (latitude, longitude)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLE: caravanes
-- Stores information about caravan experiences
-- ============================================================
CREATE TABLE caravanes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) DEFAULT 'caravane',
    latitude DECIMAL(10,7) NOT NULL,
    longitude DECIMAL(10,7) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    main_image VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_category (category),
    INDEX idx_location (latitude, longitude)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLE: users
-- Stores admin user information for authentication
-- ============================================================
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- TABLE: images_360
-- Stores 360-degree images for virtual tours
-- Links to artisans, sejours, or caravanes
-- ============================================================
CREATE TABLE images_360 (
    id INT AUTO_INCREMENT PRIMARY KEY,
    itemType ENUM('artisanat', 'sejour', 'caravane') NOT NULL,
    itemId INT NOT NULL,
    imageUrl VARCHAR(255) NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_item (itemType, itemId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add foreign key constraints for images_360
-- Note: MySQL doesn't support conditional foreign keys, so we create indexes
-- The application layer will handle the relationship based on itemType

-- ============================================================
-- TABLE: reservations
-- Stores booking information for all experiences
-- ============================================================
CREATE TABLE reservations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_name VARCHAR(255) NOT NULL,
    user_phone VARCHAR(20) NOT NULL,
    itemType ENUM('artisanat', 'sejour', 'caravane') NOT NULL,
    itemId INT NOT NULL,
    reservation_date DATE NOT NULL,
    status ENUM('pending', 'confirmed', 'cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_item (itemType, itemId),
    INDEX idx_status (status),
    INDEX idx_date (reservation_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- RELATIONSHIPS & CONSTRAINTS
-- ============================================================
-- Note: Since itemType is dynamic (polymorphic relationship),
-- we cannot create direct foreign keys. However, we add indexes
-- for optimal query performance. The application layer will
-- enforce referential integrity based on itemType value.
-- ============================================================

-- Add cascading triggers for cleanup when items are deleted
DELIMITER $$

-- Trigger: Delete related images when artisan is deleted
CREATE TRIGGER trg_artisan_delete 
AFTER DELETE ON artisans
FOR EACH ROW
BEGIN
    DELETE FROM images_360 WHERE itemType = 'artisanat' AND itemId = OLD.id;
    DELETE FROM reservations WHERE itemType = 'artisanat' AND itemId = OLD.id;
END$$

-- Trigger: Delete related images when sejour is deleted
CREATE TRIGGER trg_sejour_delete 
AFTER DELETE ON sejours
FOR EACH ROW
BEGIN
    DELETE FROM images_360 WHERE itemType = 'sejour' AND itemId = OLD.id;
    DELETE FROM reservations WHERE itemType = 'sejour' AND itemId = OLD.id;
END$$

-- Trigger: Delete related images when caravane is deleted
CREATE TRIGGER trg_caravane_delete 
AFTER DELETE ON caravanes
FOR EACH ROW
BEGIN
    DELETE FROM images_360 WHERE itemType = 'caravane' AND itemId = OLD.id;
    DELETE FROM reservations WHERE itemType = 'caravane' AND itemId = OLD.id;
END$$

DELIMITER ;

-- ============================================================
-- DATABASE SCHEMA CREATION COMPLETE
-- ============================================================

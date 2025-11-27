-- ============================================================
-- SAFARIA Platform - Add User Fields Migration
-- ============================================================
-- Adds email, name, and phone fields to users table
-- Run this migration to support user registration
-- ============================================================

-- Add new columns to users table
ALTER TABLE users
ADD COLUMN email VARCHAR(255) UNIQUE AFTER username,
ADD COLUMN name VARCHAR(255) AFTER email,
ADD COLUMN phone VARCHAR(20) AFTER name;

-- Create index for email lookups
CREATE INDEX idx_email ON users(email);

-- Update role to support regular users
ALTER TABLE users 
MODIFY COLUMN role VARCHAR(50) DEFAULT 'user';

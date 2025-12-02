-- ============================================================
-- SAFARIA Database - Make Old Name/Description Columns Nullable
-- Migration: 003
-- Description: Allow NULL for old name/description columns since we're using multilingual versions
-- ============================================================

SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

-- ============================================================
-- Update Artisans Table
-- ============================================================
ALTER TABLE artisans 
MODIFY COLUMN name VARCHAR(200) NULL,
MODIFY COLUMN description TEXT NULL;

-- ============================================================
-- Update Sejours Table
-- ============================================================
ALTER TABLE sejours 
MODIFY COLUMN name VARCHAR(200) NULL,
MODIFY COLUMN description TEXT NULL;

-- ============================================================
-- Update Caravanes Table
-- ============================================================
ALTER TABLE caravanes 
MODIFY COLUMN name VARCHAR(200) NULL,
MODIFY COLUMN description TEXT NULL;

-- ============================================================
-- Verify the changes
-- ============================================================
SELECT 'Migration completed successfully!' AS status;

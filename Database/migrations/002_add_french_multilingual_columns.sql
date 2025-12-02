-- ============================================================
-- SAFARIA Database - Add French Multilingual Columns
-- Migration: 002
-- Description: Add name_fr and description_fr columns to support French as primary language
-- ============================================================

SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

-- ============================================================
-- Update Artisans Table
-- ============================================================
ALTER TABLE artisans 
ADD COLUMN name_fr VARCHAR(200) AFTER name,
ADD COLUMN description_fr TEXT AFTER description;

-- Copy existing data from name/name_en to name_fr (assuming current data is in French)
UPDATE artisans SET name_fr = name WHERE name_fr IS NULL;
UPDATE artisans SET description_fr = description WHERE description_fr IS NULL;

-- ============================================================
-- Update Sejours Table
-- ============================================================
ALTER TABLE sejours 
ADD COLUMN name_fr VARCHAR(200) AFTER name,
ADD COLUMN description_fr TEXT AFTER description;

-- Copy existing data
UPDATE sejours SET name_fr = name WHERE name_fr IS NULL;
UPDATE sejours SET description_fr = description WHERE description_fr IS NULL;

-- ============================================================
-- Update Caravanes Table
-- ============================================================
ALTER TABLE caravanes 
ADD COLUMN name_fr VARCHAR(200) AFTER name,
ADD COLUMN description_fr TEXT AFTER description;

-- Copy existing data
UPDATE caravanes SET name_fr = name WHERE name_fr IS NULL;
UPDATE caravanes SET description_fr = description WHERE description_fr IS NULL;

-- ============================================================
-- Verify the changes
-- ============================================================
SHOW COLUMNS FROM artisans LIKE 'name%';
SHOW COLUMNS FROM artisans LIKE 'description%';

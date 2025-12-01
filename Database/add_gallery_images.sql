-- ============================================================
-- SAFARIA Database - Add Gallery Images Support
-- ============================================================
-- This migration adds support for multiple images per item
-- while maintaining backward compatibility with main_image
-- ============================================================

USE safaria_db;

-- ============================================================
-- Step 1: Add images column to artisans table
-- ============================================================
ALTER TABLE artisans 
ADD COLUMN images JSON DEFAULT NULL COMMENT 'Array of image URLs for gallery' 
AFTER main_image;

-- ============================================================
-- Step 2: Add images column to sejours table
-- ============================================================
ALTER TABLE sejours 
ADD COLUMN images JSON DEFAULT NULL COMMENT 'Array of image URLs for gallery' 
AFTER main_image;

-- ============================================================
-- Step 3: Add images column to caravanes table
-- ============================================================
ALTER TABLE caravanes 
ADD COLUMN images JSON DEFAULT NULL COMMENT 'Array of image URLs for gallery' 
AFTER main_image;

-- ============================================================
-- Step 4: Migrate existing main_image to images array
-- ============================================================

-- Migrate artisans main_image to images array
UPDATE artisans 
SET images = JSON_ARRAY(main_image) 
WHERE main_image IS NOT NULL AND main_image != '';

-- Migrate sejours main_image to images array
UPDATE sejours 
SET images = JSON_ARRAY(main_image) 
WHERE main_image IS NOT NULL AND main_image != '';

-- Migrate caravanes main_image to images array
UPDATE caravanes 
SET images = JSON_ARRAY(main_image) 
WHERE main_image IS NOT NULL AND main_image != '';

-- ============================================================
-- Step 5: Set default empty array for items without images
-- ============================================================

UPDATE artisans 
SET images = JSON_ARRAY() 
WHERE images IS NULL;

UPDATE sejours 
SET images = JSON_ARRAY() 
WHERE images IS NULL;

UPDATE caravanes 
SET images = JSON_ARRAY() 
WHERE images IS NULL;

-- ============================================================
-- Step 6: Add sample additional images for testing
-- ============================================================

-- Add multiple images to first artisan
UPDATE artisans 
SET images = JSON_ARRAY(
    '/images/artisan-1-main.jpg',
    '/images/artisan-1-workshop.jpg',
    '/images/artisan-1-products.jpg',
    '/images/artisan-1-detail.jpg'
)
WHERE id = 1;

-- Add multiple images to first sejour
UPDATE sejours 
SET images = JSON_ARRAY(
    '/images/sejour-1-exterior.jpg',
    '/images/sejour-1-room.jpg',
    '/images/sejour-1-terrace.jpg',
    '/images/sejour-1-dining.jpg',
    '/images/sejour-1-view.jpg'
)
WHERE id = 1;

-- Add multiple images to first caravane
UPDATE caravanes 
SET images = JSON_ARRAY(
    '/images/caravane-1-setup.jpg',
    '/images/caravane-1-camels.jpg',
    '/images/caravane-1-desert.jpg',
    '/images/caravane-1-camp.jpg',
    '/images/caravane-1-sunset.jpg',
    '/images/caravane-1-night.jpg'
)
WHERE id = 1;

-- ============================================================
-- Step 7: Add helper function to check if item has 360 images
-- ============================================================

-- This will be used in the application layer
-- Query to check if any 360 images exist:
-- SELECT EXISTS(SELECT 1 FROM images_360 WHERE itemType = ? AND itemId = ?) as has360

-- ============================================================
-- Verification Queries
-- ============================================================

-- Check artisans with images
SELECT 
    id, 
    name, 
    main_image,
    JSON_LENGTH(images) as image_count,
    images
FROM artisans 
LIMIT 5;

-- Check sejours with images
SELECT 
    id, 
    name, 
    main_image,
    JSON_LENGTH(images) as image_count,
    images
FROM sejours 
LIMIT 5;

-- Check caravanes with images
SELECT 
    id, 
    name, 
    main_image,
    JSON_LENGTH(images) as image_count,
    images
FROM caravanes 
LIMIT 5;

-- Check which items have 360 images
SELECT 
    itemType,
    itemId,
    COUNT(*) as images_360_count
FROM images_360
GROUP BY itemType, itemId;

-- ============================================================
-- Usage Notes
-- ============================================================
-- 
-- 1. Images JSON format: ["url1", "url2", "url3"]
-- 2. Access in MySQL: JSON_EXTRACT(images, '$[0]') for first image
-- 3. Add image: UPDATE table SET images = JSON_ARRAY_APPEND(images, '$', 'new-url') WHERE id = ?
-- 4. Remove image: UPDATE table SET images = JSON_REMOVE(images, '$[index]') WHERE id = ?
-- 5. Check 360: SELECT EXISTS(SELECT 1 FROM images_360 WHERE itemType=? AND itemId=?)
-- 
-- ============================================================

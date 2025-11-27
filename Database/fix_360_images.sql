-- ============================================================
-- Fix 360° Images and Regular Images
-- Update to match actual database IDs (4-7 instead of 1-4)
-- ============================================================

USE safaria_db;

-- Clear existing 360 images
DELETE FROM images_360;

-- Add 360° images with CORRECT IDs
-- Artisan: Poterie Fès (ID 4)
INSERT INTO images_360 (itemType, itemId, imageUrl) VALUES
('artisanat', 4, '/uploads/artisans/poterie-fes-360.jpg');

-- Sejour: Riad Marrakech (ID 4)
INSERT INTO images_360 (itemType, itemId, imageUrl) VALUES
('sejour', 4, '/uploads/sejours/riad-marrakech-360.jpg');

-- Caravanes: Sahara experiences (IDs 4 and 5)
INSERT INTO images_360 (itemType, itemId, imageUrl) VALUES
('caravane', 4, '/uploads/caravanes/sahara-bivouac-360.jpg'),
('caravane', 5, '/uploads/caravanes/merzouga-desert-360.jpg');

-- Update main_image paths to use 360 images as fallback
UPDATE artisans SET main_image = '/uploads/artisans/poterie-fes-360.jpg' WHERE id = 4;
UPDATE sejours SET main_image = '/uploads/sejours/riad-marrakech-360.jpg' WHERE id = 4;
UPDATE caravanes SET main_image = '/uploads/caravanes/sahara-bivouac-360.jpg' WHERE id = 4;
UPDATE caravanes SET main_image = '/uploads/caravanes/merzouga-desert-360.jpg' WHERE id = 5;

-- Verify
SELECT '360° Images:' as info;
SELECT itemType, itemId, imageUrl FROM images_360;

SELECT '\nUpdated items with images:' as info;
SELECT id, name, main_image FROM artisans WHERE main_image IS NOT NULL;
SELECT id, name, main_image FROM sejours WHERE main_image IS NOT NULL;
SELECT id, name, main_image FROM caravanes WHERE main_image IS NOT NULL;

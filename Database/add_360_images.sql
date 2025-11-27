-- ============================================================
-- Add 360° Images to Database
-- Links the uploaded 360° panoramic images to locations
-- ============================================================

USE safaria_db;

-- Clear existing 360 images
DELETE FROM images_360;

-- Add 360° images for locations
-- Note: Match itemId with your actual database IDs

-- Artisan: Poterie Fès (ID 1)
INSERT INTO images_360 (itemType, itemId, imageUrl) VALUES
('artisanat', 1, '/uploads/artisans/poterie-fes-360.jpg');

-- Sejour: Riad Marrakech (ID 1)
INSERT INTO images_360 (itemType, itemId, imageUrl) VALUES
('sejour', 1, '/uploads/sejours/riad-marrakech-360.jpg');

-- Caravane: Sahara experiences (IDs 1 and 2)
INSERT INTO images_360 (itemType, itemId, imageUrl) VALUES
('caravane', 1, '/uploads/caravanes/sahara-bivouac-360.jpg'),
('caravane', 2, '/uploads/caravanes/merzouga-desert-360.jpg');

-- Verify insertions
SELECT '360° Images added:' as info, COUNT(*) as count FROM images_360;

-- Show all 360° images
SELECT 
  itemType as 'Type',
  itemId as 'ID',
  imageUrl as 'Image Path',
  uploaded_at as 'Added'
FROM images_360
ORDER BY itemType, itemId;

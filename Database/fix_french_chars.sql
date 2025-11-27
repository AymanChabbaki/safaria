-- Fix corrupted French characters in database
USE safaria_db;

-- Set connection to UTF-8
SET NAMES utf8mb4;

-- Fix Artisans names
UPDATE artisans SET name = 'Atelier de Poterie Fès' WHERE id = 4;
UPDATE artisans SET name = 'Tissage Berbère Marrakech' WHERE id = 5;
UPDATE artisans SET name = 'Maroquinerie Artisanale Rabat' WHERE id = 7;

-- Fix Sejours names  
UPDATE sejours SET name = 'Kasbah du Désert Merzouga' WHERE id = 6;
UPDATE sejours SET name = 'Dar Océanique Essaouira' WHERE id = 7;

-- Fix Caravanes names
UPDATE caravanes SET name = 'Expédition Sahara 3 Jours' WHERE id = 4;
UPDATE caravanes SET name = 'Nuit Sous les Étoiles' WHERE id = 5;
UPDATE caravanes SET name = 'Trek Vallée du Drâa' WHERE id = 6;
UPDATE caravanes SET name = 'Circuit Atlas et Désert' WHERE id = 7;

-- Verify
SELECT 'Fixed names:' as info;
SELECT id, name FROM artisans;
SELECT id, name FROM sejours;
SELECT id, name FROM caravanes;

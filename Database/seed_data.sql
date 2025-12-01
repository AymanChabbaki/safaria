-- ============================================================
-- SAFARIA Platform - Seed Data
-- Sample data for testing and development
-- ============================================================
-- This script populates the database with sample data
-- including realistic Moroccan locations
-- ============================================================

USE safaria_db;

-- ============================================================
-- SEED DATA: artisans
-- Sample artisan workshops and experiences
-- ============================================================
INSERT INTO artisans (name, description, category, latitude, longitude, price, main_image) VALUES
(
    'Atelier de Poterie Traditionnelle - Fès',
    'Découvrez l''art ancestral de la poterie marocaine dans la médina de Fès. Participez à la création de votre propre tajine ou plat décoratif sous la guidance d''un maître potier. Une expérience authentique au cœur de l''artisanat marocain.',
    'artisanat',
    34.0631438,
    -4.9972857,
    350.00,
    '/uploads/artisans/poterie-fes.jpg'
),
(
    'Tissage de Tapis Berbère - Marrakech',
    'Apprenez les techniques traditionnelles du tissage berbère dans un atelier familial. Découvrez les symboles ancestraux et créez votre propre pièce artisanale. Inclut thé à la menthe et rencontre avec les artisanes locales.',
    'artisanat',
    31.6294723,
    -7.9810845,
    450.00,
    '/uploads/artisans/tissage-marrakech.jpg'
),
(
    'Forge Artisanale - Essaouira',
    'Immersion dans l''univers de la ferronnerie d''art marocaine. Participez à la création d''objets décoratifs en fer forgé avec des artisans expérimentés. Visite de l''atelier et démonstration complète des techniques traditionnelles.',
    'artisanat',
    31.5084926,
    -9.7595041,
    280.00,
    '/uploads/artisans/forge-essaouira.jpg'
);

-- ============================================================
-- SEED DATA: sejours
-- Sample accommodation and stay experiences
-- ============================================================
INSERT INTO sejours (name, description, category, latitude, longitude, price, main_image) VALUES
(
    'Riad Authentique - Médina de Fès',
    'Séjournez dans un riad traditionnel restauré au cœur de la médina historique de Fès. Architecture authentique, patio avec fontaine, terrasse panoramique. Petit-déjeuner marocain inclus. Proximité des souks et monuments historiques.',
    'sejour',
    34.0617003,
    -4.9777514,
    890.00,
    '/uploads/sejours/riad-fes.jpg'
),
(
    'Kasbah du Désert - Merzouga',
    'Hébergement de luxe aux portes du désert du Sahara. Chambres climatisées avec vue sur les dunes, piscine, restaurant gastronomique. Organisation d''excursions en chameau et nuits sous les étoiles dans le désert.',
    'sejour',
    31.0801676,
    -4.0133265,
    1250.00,
    '/uploads/sejours/kasbah-merzouga.jpg'
),
(
    'Maison d''Hôtes Atlas - Imlil',
    'Refuge de montagne authentique dans le Haut Atlas. Vue panoramique sur le Toubkal, randonnées guidées, cuisine berbère traditionnelle. Idéal pour les amoureux de la nature et de l''alpinisme.',
    'sejour',
    31.1395885,
    -7.9194928,
    680.00,
    '/uploads/sejours/maison-imlil.jpg'
);

-- ============================================================
-- SEED DATA: caravanes
-- Sample caravan experiences in the desert
-- ============================================================
INSERT INTO caravanes (name, description, category, latitude, longitude, price, main_image) VALUES
(
    'Caravane Royale - Circuit 3 jours Merzouga',
    'Expédition de 3 jours à dos de chameau dans le désert de l''Erg Chebbi. Nuits en bivouac sous les étoiles, repas traditionnels, musique berbère. Guide expérimenté, équipement complet fourni. Départ de Merzouga.',
    'caravane',
    31.0801676,
    -4.0133265,
    2100.00,
    '/uploads/caravanes/caravane-merzouga.jpg'
),
(
    'Grande Caravane Sahara - 5 jours Zagora',
    'Traversée authentique du désert de Zagora sur 5 jours. Rencontres avec nomades, découverte d''oasis cachées, nuits en tentes nomades traditionnelles. Expérience immersive complète dans la vie du désert.',
    'caravane',
    30.3486735,
    -5.8372038,
    3500.00,
    '/uploads/caravanes/caravane-zagora.jpg'
),
(
    'Caravane Découverte - 2 jours M''Hamid',
    'Initiation à la vie nomade dans le désert de M''Hamid. Circuit de 2 jours adapté aux débutants. Balade à dos de chameau, coucher de soleil sur les dunes, nuit en bivouac. Parfait pour une première expérience.',
    'caravane',
    29.8281125,
    -5.7280135,
    1400.00,
    '/uploads/caravanes/caravane-mhamid.jpg'
);

-- ============================================================
-- SEED DATA: users
-- Admin users for authentication
-- Password: "admin123" (hashed with bcrypt)
-- ============================================================
INSERT INTO users (name, email, password, role) VALUES
(
    'Admin User',
    'admin@safaria.com',
    '$2a$10$XQqy2Y8YqQyM6QZH0KqJF.8wN5VYxrYNvdGLUJ0NL7JHzZqZJ0X8G',
    'admin'
),
(
    'Rajae',
    'rajae@safaria.com',
    '$2a$10$XQqy2Y8YqQyM6QZH0KqJF.8wN5VYxrYNvdGLUJ0NL7JHzZqZJ0X8G',
    'admin'
);

-- Note: In production, use bcrypt to hash passwords:
-- const bcrypt = require('bcryptjs');
-- const hash = await bcrypt.hash('admin123', 10);

-- ============================================================
-- SEED DATA: images_360
-- Sample 360-degree images for virtual tours
-- ============================================================
INSERT INTO images_360 (itemType, itemId, imageUrl) VALUES
-- Images for artisan #1 (Poterie Fès)
('artisanat', 1, '/uploads/360/poterie-fes-atelier-360.jpg'),
('artisanat', 1, '/uploads/360/poterie-fes-showroom-360.jpg'),

-- Image for sejour #1 (Riad Fès)
('sejour', 1, '/uploads/360/riad-fes-patio-360.jpg'),

-- Image for caravane #1 (Merzouga)
('caravane', 1, '/uploads/360/desert-merzouga-bivouac-360.jpg'),

-- Image for artisan #2 (Tissage Marrakech)
('artisanat', 2, '/uploads/360/tissage-marrakech-360.jpg'),

-- Image for sejour #2 (Kasbah Merzouga)
('sejour', 2, '/uploads/360/kasbah-merzouga-terrasse-360.jpg');

-- ============================================================
-- SEED DATA: reservations
-- Sample bookings for testing
-- ============================================================
INSERT INTO reservations (user_name, user_phone, itemType, itemId, reservation_date, status) VALUES
(
    'Ahmed Benali',
    '+212-661-234567',
    'artisanat',
    1,
    '2025-12-15',
    'confirmed'
),
(
    'Fatima Zahra El Amrani',
    '+212-662-987654',
    'sejour',
    2,
    '2025-12-20',
    'pending'
),
(
    'Mohammed Alami',
    '+212-663-456789',
    'caravane',
    1,
    '2026-01-05',
    'confirmed'
);

-- ============================================================
-- SEED DATA INSERTION COMPLETE
-- ============================================================

-- Verify data insertion
SELECT 'Artisans:' AS 'Table', COUNT(*) AS 'Records' FROM artisans
UNION ALL
SELECT 'Sejours:', COUNT(*) FROM sejours
UNION ALL
SELECT 'Caravanes:', COUNT(*) FROM caravanes
UNION ALL
SELECT 'Users:', COUNT(*) FROM users
UNION ALL
SELECT 'Images 360:', COUNT(*) FROM images_360
UNION ALL
SELECT 'Reservations:', COUNT(*) FROM reservations;

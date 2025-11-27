-- ============================================================
-- SAFARIA Platform - Sample Data Population Script
-- ============================================================
-- Populates database with sample Morocco locations
-- Run this if your database is empty
-- ============================================================

-- Insert Sample Artisans
INSERT INTO artisans (name, description, region, phone, email, address, features, availability, price, latitude, longitude, main_image) VALUES
('Atelier de Poterie Fès', 'Découvrez l\'art ancestral de la poterie marocaine dans notre atelier traditionnel. Participez à des ateliers pratiques et créez vos propres pièces en céramique.', 'Fès', '+212 5 35 12 34 56', 'poterie.fes@safaria.ma', 'Médina de Fès, Quartier des Potiers', 'Atelier pratique,Visite guidée,Dégustation de thé,Produits à vendre', 'Tous les jours 9h-18h', 150, 34.0331, -5.0003, '/uploads/artisans/pottery-fes.jpg'),

('Tissage Berbère Marrakech', 'Admirez le savoir-faire séculaire du tissage berbère. Nos artisanes créent des tapis et textiles uniques selon des méthodes traditionnelles transmises de génération en génération.', 'Marrakech', '+212 5 24 38 45 67', 'tissage.marrakech@safaria.ma', 'Souk Semmarine, Médina de Marrakech', 'Démonstration de tissage,Atelier pour débutants,Boutique artisanale,Livraison internationale', 'Lundi-Samedi 10h-19h', 200, 31.6295, -7.9811, '/uploads/artisans/weaving-marrakech.jpg'),

('Ferronnerie d\'Art Essaouira', 'Explorez notre atelier de ferronnerie où sont créées des pièces uniques: portes, lanternes, mobilier et objets décoratifs en fer forgé traditionnel.', 'Essaouira', '+212 5 24 47 56 78', 'ferronnerie.essaouira@safaria.ma', 'Rue de la Skala, Médina d\'Essaouira', 'Démonstration forgeron,Commandes personnalisées,Cours d\'initiation,Exportation possible', 'Mardi-Dimanche 9h-17h', 180, 31.5125, -9.7595, '/uploads/artisans/ironwork-essaouira.jpg'),

('Maroquinerie Artisanale Rabat', 'Découvrez l\'excellence de la maroquinerie marocaine. Sacs, ceintures, babouches et accessoires en cuir de qualité, fabriqués selon les techniques ancestrales.', 'Rabat', '+212 5 37 70 12 34', 'maroquinerie.rabat@safaria.ma', 'Médina de Rabat, Souk des Tanneurs', 'Personnalisation gratuite,Cuir végétal bio,Atelier de couture,Réparation cuir', 'Tous les jours 10h-20h', 120, 34.0209, -6.8416, '/uploads/artisans/leather-rabat.jpg');

-- Insert Sample Sejours
INSERT INTO sejours (title, description, region, phone, email, address, features, availability, price_per_night, max_capacity, latitude, longitude, main_image) VALUES
('Riad Traditionnel Marrakech', 'Séjour authentique dans un magnifique riad du 18ème siècle entièrement restauré. Patio avec fontaine, terrasse panoramique, et décoration traditionnelle raffinée.', 'Marrakech', '+212 5 24 38 12 34', 'riad.marrakech@safaria.ma', 'Derb Lalla Azzouna, Médina de Marrakech', 'Piscine,WiFi gratuit,Petit-déjeuner inclus,Hammam,Terrasse panoramique,Cuisine traditionnelle', 'Toute l\'année', 450, 8, 31.6295, -7.9811, '/uploads/sejours/riad-marrakech.jpg'),

('Maison Bleue Chefchaouen', 'Séjour unique dans une maison traditionnelle au cœur de la ville bleue. Vue imprenable sur les montagnes du Rif et décoration berbère authentique.', 'Chefchaouen', '+212 5 39 98 76 54', 'maison.chefchaouen@safaria.ma', 'Place Outa El Hammam, Médina de Chefchaouen', 'Vue panoramique,WiFi,Petit-déjeuner,Salon marocain,Bibliothèque,Guides locaux', 'Avril-Octobre', 380, 6, 35.1711, -5.2636, '/uploads/sejours/house-chefchaouen.jpg'),

('Kasbah du Désert Merzouga', 'Kasbah authentique aux portes du Sahara, au pied des majestueuses dunes de l\'Erg Chebbi. Point de départ idéal pour vos excursions dans le désert.', 'Merzouga', '+212 5 35 57 89 01', 'kasbah.merzouga@safaria.ma', 'Route de Merzouga, Erg Chebbi', 'Piscine,Restaurant berbère,Excursions désert,Nuits étoilées,Musique traditionnelle,Quad et dromadaire', 'Septembre-Mai', 320, 12, 31.0801, -4.0133, '/uploads/sejours/kasbah-merzouga.jpg'),

('Dar Océanique Essaouira', 'Maison d\'hôtes de charme face à l\'océan Atlantique. Architecture traditionnelle avec terrasse offrant une vue spectaculaire sur la mer et le port.', 'Essaouira', '+212 5 24 47 23 45', 'dar.essaouira@safaria.ma', 'Avenue Mohamed V, Face au Port', 'Vue mer,WiFi,Petit-déjeuner bio,Terrasse,Cours de cuisine,Planche à voile,Kitesurf', 'Toute l\'année', 410, 10, 31.5084, -9.7595, '/uploads/sejours/dar-essaouira.jpg');

-- Insert Sample Caravanes
INSERT INTO caravanes (title, description, region, departure_point, phone, email, duration, features, availability, price_per_person, max_capacity, latitude, longitude, main_image) VALUES
('Expédition Sahara 3 Jours', 'Aventure inoubliable à dos de dromadaire à travers les dunes de l\'Erg Chebbi. Bivouac sous les étoiles, repas berbères traditionnels et découverte de la culture nomade.', 'Sahara', 'Merzouga Centre', '+212 5 35 57 44 55', 'sahara.expedition@safaria.ma', '3 jours / 2 nuits', 'Dromadaires,Guide expérimenté,Bivouac confort,Repas inclus,Musique berbère,Lever de soleil dunes', 'Octobre-Avril', 650, 15, 31.0801, -4.0133, '/uploads/caravanes/sahara-expedition.jpg'),

('Nuit Sous les Étoiles', 'Courte escapade magique dans le désert. Départ en fin d\'après-midi, randonnée à dromadaire au coucher du soleil, dîner traditionnel et nuit en bivouac authentique.', 'Erg Chebbi', 'Merzouga Village', '+212 5 35 57 66 77', 'nuit.etoiles@safaria.ma', '1 jour / 1 nuit', 'Dromadaires,Bivouac traditionnel,Dîner berbère,Musique autour du feu,Observation étoiles,Petit-déjeuner', 'Septembre-Mai', 280, 20, 30.9335, -4.0070, '/uploads/caravanes/night-stars.jpg'),

('Trek Vallée du Drâa', 'Caravane de 5 jours à travers la magnifique vallée du Drâa. Palmeraies luxuriantes, kasbahs anciennes, oasis verdoyantes et villages berbères authentiques.', 'Vallée du Drâa', 'Agdz', '+212 5 24 84 33 22', 'trek.draa@safaria.ma', '5 jours / 4 nuits', 'Dromadaires,Guide multilingue,Bivouac + Gîtes,Tous repas inclus,Visite kasbahs,Rencontre nomades', 'Mars-Juin, Sept-Nov', 520, 12, 30.2841, -6.9085, '/uploads/caravanes/draa-valley.jpg'),

('Circuit Atlas et Désert', 'Circuit complet de 7 jours combinant montagnes de l\'Atlas et désert du Sahara. Randonnées, rencontres berbères, nuits en kasbah et bivouac sous les étoiles.', 'Atlas-Sahara', 'Marrakech', '+212 5 24 38 99 88', 'circuit.atlas@safaria.ma', '7 jours / 6 nuits', 'Transport 4x4,Guide professionnel,Hébergement varié,Tous repas,Dromadaires désert,Visite villages', 'Toute l\'année', 890, 8, 31.2000, -7.0000, '/uploads/caravanes/atlas-desert.jpg');

-- ============================================================
-- Verify Insertions
-- ============================================================
SELECT 'Artisans inserted:' as info, COUNT(*) as count FROM artisans;
SELECT 'Sejours inserted:' as info, COUNT(*) as count FROM sejours;
SELECT 'Caravanes inserted:' as info, COUNT(*) as count FROM caravanes;

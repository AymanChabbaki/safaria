-- ============================================================
-- SAFARIA Platform - Sample Data (Corrected for Current Schema)
-- ============================================================
-- Matches the actual database schema with only:
-- name, description, category, latitude, longitude, price, main_image
-- ============================================================

USE safaria_db;

-- Clear existing data
DELETE FROM images_360;
DELETE FROM reservations;
DELETE FROM artisans;
DELETE FROM sejours;
DELETE FROM caravanes;

-- Insert Artisans (4 locations)
INSERT INTO artisans (name, description, category, latitude, longitude, price, main_image) VALUES
('Atelier de Poterie Fès', 
 'Découvrez l\'art ancestral de la poterie marocaine dans notre atelier traditionnel au cœur de la médina de Fès. Participez à des ateliers pratiques et créez vos propres pièces en céramique sous la guidance de maîtres artisans. Visite guidée de l\'atelier, démonstration des techniques ancestrales, atelier pratique personnalisé, dégustation de thé à la menthe et pâtisseries marocaines. Ouvert tous les jours de 9h à 18h. Contact: +212 5 35 12 34 56 - poterie.fes@safaria.ma', 
 'artisanat',
 34.0331, -5.0003,
 150.00,
 '/uploads/artisans/pottery-fes.jpg'),

('Tissage Berbère Marrakech', 
 'Admirez le savoir-faire séculaire du tissage berbère dans le souk Semmarine de Marrakech. Nos artisanes créent des tapis et textiles uniques selon des méthodes traditionnelles transmises de génération en génération. Démonstration de tissage en direct, atelier d\'initiation pour débutants, explications des symboles berbères, possibilité d\'achat et livraison internationale. Ouvert du lundi au samedi de 10h à 19h. Contact: +212 5 24 38 45 67 - tissage.marrakech@safaria.ma', 
 'artisanat',
 31.6295, -7.9811,
 200.00,
 '/uploads/artisans/weaving-marrakech.jpg'),

('Ferronnerie d\'Art Essaouira', 
 'Explorez notre atelier de ferronnerie d\'art dans la médina d\'Essaouira où sont créées des pièces uniques: portes sculptées, lanternes ornées, mobilier et objets décoratifs en fer forgé traditionnel. Démonstration du travail du forgeron, possibilité de commandes personnalisées, cours d\'initiation à la forge, exportation possible dans le monde entier. Ouvert du mardi au dimanche de 9h à 17h. Contact: +212 5 24 47 56 78 - ferronnerie.essaouira@safaria.ma', 
 'artisanat',
 31.5125, -9.7595,
 180.00,
 '/uploads/artisans/ironwork-essaouira.jpg'),

('Maroquinerie Artisanale Rabat', 
 'Découvrez l\'excellence de la maroquinerie marocaine dans la médina de Rabat. Sacs à main, ceintures, babouches et accessoires en cuir de qualité supérieure, fabriqués selon les techniques ancestrales du travail du cuir. Personnalisation gratuite de vos articles, utilisation de cuir végétal bio, atelier de couture sur mesure, service de réparation. Ouvert tous les jours de 10h à 20h. Contact: +212 5 37 70 12 34 - maroquinerie.rabat@safaria.ma', 
 'artisanat',
 34.0209, -6.8416,
 120.00,
 '/uploads/artisans/leather-rabat.jpg');

-- Insert Sejours (4 locations)
INSERT INTO sejours (name, description, category, latitude, longitude, price, main_image) VALUES
('Riad Traditionnel Marrakech', 
 'Séjour authentique dans un magnifique riad du 18ème siècle entièrement restauré au cœur de la médina de Marrakech. Patio avec fontaine centrale, terrasse panoramique avec vue sur les toits de la ville rouge, décoration traditionnelle raffinée avec zellige et bois sculpté. Piscine sur la terrasse, WiFi gratuit, petit-déjeuner marocain inclus, hammam traditionnel, salon berbère, cuisine traditionnelle sur demande. Capacité maximale: 8 personnes. Prix: 450 DH par nuit. Ouvert toute l\'année. Contact: +212 5 24 38 12 34 - riad.marrakech@safaria.ma', 
 'sejour',
 31.6295, -7.9811,
 450.00,
 '/uploads/sejours/riad-marrakech.jpg'),

('Maison Bleue Chefchaouen', 
 'Séjour unique dans une maison traditionnelle bleue au cœur de la perle bleue du Maroc. Vue imprenable sur les montagnes du Rif et les toits bleus de la médina. Décoration berbère authentique avec tissages et poteries locales. Vue panoramique depuis la terrasse, WiFi gratuit, petit-déjeuner inclus, salon marocain traditionnel, bibliothèque, services de guides locaux pour randonnées. Capacité: 6 personnes. Prix: 380 DH par nuit. Saison: Avril à Octobre. Contact: +212 5 39 98 76 54 - maison.chefchaouen@safaria.ma', 
 'sejour',
 35.1711, -5.2636,
 380.00,
 '/uploads/sejours/house-chefchaouen.jpg'),

('Kasbah du Désert Merzouga', 
 'Kasbah authentique en pisé aux portes du Sahara, au pied des majestueuses dunes oranges de l\'Erg Chebbi. Architecture traditionnelle du sud marocain avec patio central et terrasse panoramique. Point de départ idéal pour vos excursions dans le désert. Piscine avec vue sur les dunes, restaurant berbère authentique, organisation d\'excursions désert en 4x4 ou dromadaire, nuits étoilées en bivouac, soirées de musique traditionnelle gnaoua. Capacité: 12 personnes. Prix: 320 DH par nuit. Saison: Septembre à Mai. Contact: +212 5 35 57 89 01 - kasbah.merzouga@safaria.ma', 
 'sejour',
 31.0801, -4.0133,
 320.00,
 '/uploads/sejours/kasbah-merzouga.jpg'),

('Dar Océanique Essaouira', 
 'Maison d\'hôtes de charme face à l\'océan Atlantique dans la ville des Alizés. Architecture traditionnelle mogadorienne avec moucharabiehs et terrasse offrant une vue spectaculaire sur la mer turquoise et le port historique. Vue mer panoramique, WiFi haut débit, petit-déjeuner bio avec produits locaux, grande terrasse solarium, cours de cuisine marocaine, activités nautiques (planche à voile, kitesurf, surf). Capacité: 10 personnes. Prix: 410 DH par nuit. Ouvert toute l\'année. Contact: +212 5 24 47 23 45 - dar.essaouira@safaria.ma', 
 'sejour',
 31.5084, -9.7595,
 410.00,
 '/uploads/sejours/dar-essaouira.jpg');

-- Insert Caravanes (4 locations)
INSERT INTO caravanes (name, description, category, latitude, longitude, price, main_image) VALUES
('Expédition Sahara 3 Jours', 
 'Aventure inoubliable à dos de dromadaire à travers les dunes dorées de l\'Erg Chebbi, le plus grand erg du Maroc. Bivouac sous un ciel étoilé à couper le souffle, repas berbères traditionnels préparés au feu de bois, découverte de la culture nomade authentique. Méharée avec dromadaires de race, guide expérimenté parlant français et arabe, bivouac tout confort avec tentes berbères, tous les repas inclus (petit-déjeuner, déjeuner, dîner), soirée musicale autour du feu, lever de soleil sur les dunes. Durée: 3 jours / 2 nuits. Groupe: 15 personnes max. Prix: 650 DH par personne. Saison: Octobre à Avril. Départ: Merzouga Centre. Contact: +212 5 35 57 44 55 - sahara.expedition@safaria.ma', 
 'caravane',
 31.0801, -4.0133,
 650.00,
 '/uploads/caravanes/sahara-expedition.jpg'),

('Nuit Sous les Étoiles', 
 'Courte escapade magique dans le désert marocain. Départ en fin d\'après-midi pour une randonnée à dromadaire au coucher du soleil, dîner traditionnel sous la tente nomade, nuit en bivouac authentique dans le silence du désert. Balade à dromadaire (1h30), bivouac traditionnel berbère, dîner complet cuisine du désert, musique gnaoua autour du feu de camp, observation des étoiles avec explications, petit-déjeuner au lever du soleil. Durée: 1 jour / 1 nuit. Groupe: 20 personnes max. Prix: 280 DH par personne. Saison: Septembre à Mai. Départ: Merzouga Village. Contact: +212 5 35 57 66 77 - nuit.etoiles@safaria.ma', 
 'caravane',
 30.9335, -4.0070,
 280.00,
 '/uploads/caravanes/night-stars.jpg'),

('Trek Vallée du Drâa', 
 'Caravane de 5 jours à travers la magnifique vallée du Drâa, la plus longue oasis du Maroc. Palmeraies luxuriantes à perte de vue, kasbahs anciennes millénaires, oasis verdoyantes et villages berbères authentiques préservés du tourisme de masse. Méharée avec dromadaires, guide multilingue spécialiste de la région, hébergement mixte (bivouac confortable + gîtes traditionnels), tous les repas inclus avec spécialités locales, visite de kasbahs historiques, rencontre avec des familles nomades. Durée: 5 jours / 4 nuits. Groupe: 12 personnes max. Prix: 520 DH par personne. Saison: Mars-Juin et Septembre-Novembre. Départ: Agdz. Contact: +212 5 24 84 33 22 - trek.draa@safaria.ma', 
 'caravane',
 30.2841, -6.9085,
 520.00,
 '/uploads/caravanes/draa-valley.jpg'),

('Circuit Atlas et Désert', 
 'Circuit complet de 7 jours combinant les montagnes de l\'Atlas et le désert du Sahara. Randonnées dans les vallées verdoyantes de l\'Atlas, rencontres authentiques avec des familles berbères, nuits en kasbah traditionnelle et bivouac sous les étoiles dans l\'Erg Chebbi. Transport en 4x4 tout confort climatisé, guide professionnel francophone diplômé, hébergement varié (hôtels de charme, kasbahs, bivouac), tous les repas inclus avec menu varié, méharée dans le désert (2 jours), visite de villages berbères de l\'Atlas. Durée: 7 jours / 6 nuits. Groupe: 8 personnes max. Prix: 890 DH par personne. Ouvert toute l\'année. Départ: Marrakech. Contact: +212 5 24 38 99 88 - circuit.atlas@safaria.ma', 
 'caravane',
 31.2000, -7.0000,
 890.00,
 '/uploads/caravanes/atlas-desert.jpg');

-- ============================================================
-- Verify Insertions
-- ============================================================
SELECT 'Artisans inserted:' as info, COUNT(*) as count FROM artisans;
SELECT 'Sejours inserted:' as info, COUNT(*) as count FROM sejours;
SELECT 'Caravanes inserted:' as info, COUNT(*) as count FROM caravanes;

SELECT 'Sample Artisans:' as info;
SELECT id, name, category, price, latitude, longitude FROM artisans LIMIT 2;

SELECT 'Sample Sejours:' as info;
SELECT id, name, category, price, latitude, longitude FROM sejours LIMIT 2;

SELECT 'Sample Caravanes:' as info;
SELECT id, name, category, price, latitude, longitude FROM caravanes LIMIT 2;

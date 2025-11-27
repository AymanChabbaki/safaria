-- ============================================================
-- SAFARIA Database - Multilingual Data (French/Arabic/English)
-- ============================================================

SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

-- Clear existing data
DELETE FROM images_360;
DELETE FROM reservations;
DELETE FROM caravanes;
DELETE FROM sejours;
DELETE FROM artisans;

-- Reset auto increment
ALTER TABLE artisans AUTO_INCREMENT = 1;
ALTER TABLE sejours AUTO_INCREMENT = 1;
ALTER TABLE caravanes AUTO_INCREMENT = 1;

-- ============================================================
-- ARTISANS DATA (Artisan Experiences)
-- ============================================================

INSERT INTO artisans (name, name_ar, name_en, description, description_ar, description_en, latitude, longitude, price, main_image) VALUES
(
    'Atelier de Poterie Fès',
    'ورشة الفخار فاس',
    'Pottery Workshop Fes',
    'Découvrez l''art ancestral de la poterie berbère dans l''ancienne médina de Fès. Participez à un atelier pratique où vous apprendrez les techniques traditionnelles de façonnage et de décoration de la céramique marocaine. Une expérience authentique qui vous plongera dans l''histoire millénaire de l''artisanat marocain.',
    'اكتشف فن الفخار البربري القديم في المدينة القديمة بفاس. شارك في ورشة عملية حيث ستتعلم التقنيات التقليدية لتشكيل وتزيين السيراميك المغربي. تجربة أصيلة تغمرك في تاريخ الحرف المغربية الممتد لآلاف السنين.',
    'Discover the ancestral art of Berber pottery in the ancient medina of Fes. Participate in a hands-on workshop where you will learn traditional techniques for shaping and decorating Moroccan ceramics. An authentic experience that immerses you in the millenary history of Moroccan craftsmanship.',
    34.0615341,
    -4.9998223,
    250.00,
    '/uploads/artisans/poterie-fes-360.jpg'
),
(
    'Tissage Berbère Marrakech',
    'النسيج البربري مراكش',
    'Berber Weaving Marrakech',
    'Immergez-vous dans l''art du tissage berbère à Marrakech. Rencontrez des artisanes qui perpétuent des techniques ancestrales transmises de génération en génération. Apprenez à tisser des motifs traditionnels et créez votre propre tapis miniature à emporter en souvenir.',
    'انغمس في فن النسيج البربري في مراكش. قابل الحرفيات اللواتي يحافظن على التقنيات القديمة المنقولة من جيل إلى جيل. تعلم نسج الأنماط التقليدية وأنشئ سجادتك المصغرة الخاصة لتأخذها كتذكار.',
    'Immerse yourself in the art of Berber weaving in Marrakech. Meet artisans who perpetuate ancestral techniques passed down from generation to generation. Learn to weave traditional patterns and create your own miniature carpet to take home as a souvenir.',
    31.6294723,
    -7.9810845,
    180.00,
    '/uploads/artisans/weaving-marrakech.jpg'
),
(
    'Ferronnerie d''Art Essaouira',
    'الحدادة الفنية الصويرة',
    'Art Ironwork Essaouira',
    'Visitez un atelier de ferronnerie traditionnel à Essaouira. Observez les maîtres forgerons façonner le métal avec une précision remarquable pour créer des lanternes, des portes et des objets décoratifs magnifiques. Une occasion unique de découvrir cet art ancestral.',
    'قم بزيارة ورشة حدادة تقليدية في الصويرة. شاهد الحدادين الماهرين يشكلون المعدن بدقة ملحوظة لإنشاء فوانيس وأبواب وأشياء زخرفية رائعة. فرصة فريدة لاكتشاف هذا الفن القديم.',
    'Visit a traditional ironwork workshop in Essaouira. Watch master blacksmiths shape metal with remarkable precision to create lanterns, doors and beautiful decorative objects. A unique opportunity to discover this ancestral art.',
    31.5084926,
    -9.7595041,
    150.00,
    '/uploads/artisans/ironwork-essaouira.jpg'
),
(
    'Maroquinerie Artisanale Rabat',
    'صناعة الجلود التقليدية الرباط',
    'Traditional Leather Craft Rabat',
    'Découvrez les secrets de la maroquinerie marocaine dans les souks de Rabat. Apprenez les techniques de tannage traditionnel et de couture du cuir. Créez votre propre article en cuir sous la guidance d''un maître artisan.',
    'اكتشف أسرار صناعة الجلود المغربية في أسواق الرباط. تعلم تقنيات الدباغة التقليدية وخياطة الجلود. أنشئ مقالك الجلدي الخاص بإرشاد من حرفي ماهر.',
    'Discover the secrets of Moroccan leather craftsmanship in the souks of Rabat. Learn traditional tanning and leather stitching techniques. Create your own leather item under the guidance of a master craftsman.',
    34.0209453,
    -6.8415752,
    200.00,
    '/uploads/artisans/leather-rabat.jpg'
);

-- ============================================================
-- SEJOURS DATA (Accommodations)
-- ============================================================

INSERT INTO sejours (name, name_ar, name_en, description, description_ar, description_en, latitude, longitude, price, main_image) VALUES
(
    'Riad Traditionnel Marrakech',
    'رياض تقليدي مراكش',
    'Traditional Riad Marrakech',
    'Séjournez dans un riad authentique au cœur de la médina de Marrakech. Découvrez l''architecture traditionnelle marocaine avec ses cours intérieures, fontaines et jardins luxuriants. Profitez d''une hospitalité chaleureuse et d''une cuisine marocaine raffinée préparée avec des produits locaux.',
    'أقم في رياض أصيل في قلب المدينة القديمة بمراكش. اكتشف العمارة المغربية التقليدية مع الأفنية الداخلية والنوافير والحدائق الخضراء. استمتع بالضيافة الدافئة والمأكولات المغربية الراقية المحضرة من المنتجات المحلية.',
    'Stay in an authentic riad in the heart of Marrakech medina. Discover traditional Moroccan architecture with its interior courtyards, fountains and lush gardens. Enjoy warm hospitality and refined Moroccan cuisine prepared with local products.',
    31.6294723,
    -7.9810845,
    850.00,
    '/uploads/sejours/riad-marrakech-360.jpg'
),
(
    'Maison Bleue Chefchaouen',
    'الدار الزرقاء شفشاون',
    'Blue House Chefchaouen',
    'Vivez une expérience unique dans la ville bleue de Chefchaouen. Notre maison d''hôtes offre une vue panoramique sur les montagnes du Rif. Chambres décorées dans le style berbère authentique, terrasse sur le toit et petit-déjeuner marocain traditionnel inclus.',
    'عش تجربة فريدة في المدينة الزرقاء شفشاون. يوفر بيت الضيافة لدينا إطلالة بانورامية على جبال الريف. غرف مزينة بأسلوب بربري أصيل، تراس على السطح وإفطار مغربي تقليدي مشمول.',
    'Live a unique experience in the blue city of Chefchaouen. Our guesthouse offers panoramic views of the Rif mountains. Rooms decorated in authentic Berber style, rooftop terrace and traditional Moroccan breakfast included.',
    35.1688867,
    -5.2636721,
    650.00,
    '/uploads/sejours/chefchaouen-blue.jpg'
),
(
    'Kasbah du Désert Merzouga',
    'قصبة الصحراء مرزوكة',
    'Desert Kasbah Merzouga',
    'Hébergement luxueux aux portes du Sahara. Notre kasbah offre un mélange parfait de confort moderne et de charme traditionnel. Piscine, restaurant gastronomique et excursions dans les dunes d''Erg Chebbi organisées sur demande.',
    'إقامة فاخرة على أبواب الصحراء الكبرى. تقدم قصبتنا مزيجاً مثالياً من الراحة الحديثة والسحر التقليدي. حمام سباحة، مطعم فاخر ورحلات إلى كثبان عرق الشبي تنظم عند الطلب.',
    'Luxury accommodation at the gates of the Sahara. Our kasbah offers a perfect blend of modern comfort and traditional charm. Swimming pool, gourmet restaurant and excursions to the Erg Chebbi dunes organized upon request.',
    31.0801676,
    -4.0133096,
    950.00,
    '/uploads/sejours/kasbah-merzouga.jpg'
),
(
    'Dar Océanique Essaouira',
    'دار المحيط الصويرة',
    'Ocean House Essaouira',
    'Maison d''hôtes face à l''océan Atlantique à Essaouira. Réveillez-vous avec le son des vagues et profitez de couchers de soleil spectaculaires depuis notre terrasse. Décoration bohème-chic, proximité du port et de la médina classée UNESCO.',
    'دار ضيافة مواجه للمحيط الأطلسي في الصويرة. استيقظ على صوت الأمواج واستمتع بغروب الشمس الخلاب من تراسنا. ديكور بوهيمي أنيق، بالقرب من الميناء والمدينة القديمة المصنفة من اليونسكو.',
    'Guesthouse facing the Atlantic Ocean in Essaouira. Wake up to the sound of waves and enjoy spectacular sunsets from our terrace. Bohemian-chic decoration, close to the port and UNESCO-listed medina.',
    31.5084926,
    -9.7595041,
    750.00,
    '/uploads/sejours/essaouira-ocean.jpg'
);

-- ============================================================
-- CARAVANES DATA (Desert Experiences)
-- ============================================================

INSERT INTO caravanes (name, name_ar, name_en, description, description_ar, description_en, latitude, longitude, price, main_image) VALUES
(
    'Expédition Sahara 3 Jours',
    'رحلة الصحراء 3 أيام',
    'Sahara Expedition 3 Days',
    'Aventure inoubliable de 3 jours dans le Sahara marocain. Traversée des dunes dorées à dos de dromadaire, nuits sous les étoiles dans des campements berbères authentiques. Découverte de l''hospitalité nomade, musique traditionnelle et cuisine préparée au feu de bois. Une expérience spirituelle au cœur du désert.',
    'مغامرة لا تنسى لمدة 3 أيام في الصحراء المغربية. عبور الكثبان الذهبية على ظهر الجمال، ليالٍ تحت النجوم في مخيمات بربرية أصيلة. اكتشف ضيافة البدو، الموسيقى التقليدية والطعام المحضر على نار الحطب. تجربة روحية في قلب الصحراء.',
    'Unforgettable 3-day adventure in the Moroccan Sahara. Crossing golden dunes on camelback, nights under the stars in authentic Berber camps. Discover nomadic hospitality, traditional music and food prepared over wood fire. A spiritual experience in the heart of the desert.',
    31.0801676,
    -4.0133096,
    1200.00,
    '/uploads/caravanes/sahara-bivouac-360.jpg'
),
(
    'Nuit Sous les Étoiles',
    'ليلة تحت النجوم',
    'Night Under the Stars',
    'Expérience magique d''une nuit dans le désert de Merzouga. Randonnée au coucher du soleil jusqu''au campement, dîner traditionnel sous les étoiles, musique gnaoua autour du feu. Réveil avec le lever du soleil sur les dunes d''Erg Chebbi. Une nuit que vous n''oublierez jamais.',
    'تجربة سحرية لليلة واحدة في صحراء مرزوكة. رحلة عند غروب الشمس إلى المخيم، عشاء تقليدي تحت النجوم، موسيقى كناوة حول النار. استيقظ مع شروق الشمس على كثبان عرق الشبي. ليلة لن تنساها أبداً.',
    'Magical overnight experience in the Merzouga desert. Sunset hike to the camp, traditional dinner under the stars, Gnawa music around the fire. Wake up to sunrise over the Erg Chebbi dunes. A night you will never forget.',
    31.0801676,
    -4.0133096,
    450.00,
    '/uploads/caravanes/merzouga-desert-360.jpg'
),
(
    'Trek Vallée du Drâa',
    'رحلة وادي درعة',
    'Draa Valley Trek',
    'Randonnée de 4 jours à travers la vallée du Drâa, la plus longue vallée du Maroc. Découvrez des oasis verdoyantes, des kasbahs ancestrales et des villages berbères préservés. Rencontres authentiques avec les populations locales, nuits chez l''habitant et dans le désert.',
    'رحلة 4 أيام عبر وادي درعة، أطول وادٍ في المغرب. اكتشف الواحات الخضراء، القصبات القديمة والقرى البربرية المحفوظة. لقاءات أصيلة مع السكان المحليين، ليالٍ في البيوت التقليدية وفي الصحراء.',
    '4-day trek through the Draa Valley, the longest valley in Morocco. Discover verdant oases, ancestral kasbahs and preserved Berber villages. Authentic encounters with local populations, nights in local homes and in the desert.',
    30.3314926,
    -6.2626721,
    1500.00,
    '/uploads/caravanes/draa-valley.jpg'
),
(
    'Circuit Atlas et Désert',
    'جولة الأطلس والصحراء',
    'Atlas and Desert Circuit',
    'Circuit complet de 7 jours combinant les montagnes de l''Atlas et le désert du Sahara. Traversée du Haut Atlas, visite de villages berbères, gorges du Todra et Dadès, puis immersion dans les dunes du Sahara. Transport 4x4, hébergements confortables et guide expert inclus.',
    'جولة كاملة لمدة 7 أيام تجمع بين جبال الأطلس وصحراء الصحراء. عبور الأطلس الكبير، زيارة القرى البربرية، مضائق تودغة وداديس، ثم الانغماس في كثبان الصحراء. نقل بسيارة دفع رباعي، إقامة مريحة ومرشد خبير مشمول.',
    'Complete 7-day circuit combining the Atlas Mountains and the Sahara desert. Crossing the High Atlas, visiting Berber villages, Todra and Dades gorges, then immersion in the Sahara dunes. 4x4 transport, comfortable accommodation and expert guide included.',
    31.5084926,
    -7.0815041,
    2800.00,
    '/uploads/caravanes/atlas-desert.jpg'
);

-- ============================================================
-- 360° IMAGES DATA
-- ============================================================

INSERT INTO images_360 (itemType, itemId, imageUrl) VALUES
('artisanat', 1, '/uploads/artisans/poterie-fes-360.jpg'),
('sejour', 1, '/uploads/sejours/riad-marrakech-360.jpg'),
('caravane', 1, '/uploads/caravanes/sahara-bivouac-360.jpg'),
('caravane', 2, '/uploads/caravanes/merzouga-desert-360.jpg');

-- ============================================================
-- Verification
-- ============================================================

SELECT 'Data inserted successfully!' as status;
SELECT COUNT(*) as total_artisans FROM artisans;
SELECT COUNT(*) as total_sejours FROM sejours;
SELECT COUNT(*) as total_caravanes FROM caravanes;
SELECT COUNT(*) as total_360_images FROM images_360;

SELECT '=== Items with 360° images ===' as info;
SELECT a.id, a.name, a.name_ar, a.name_en, 'artisanat' as type 
FROM artisans a 
JOIN images_360 i ON i.itemType = 'artisanat' AND i.itemId = a.id
UNION
SELECT s.id, s.name, s.name_ar, s.name_en, 'sejour' as type 
FROM sejours s 
JOIN images_360 i ON i.itemType = 'sejour' AND i.itemId = s.id
UNION
SELECT c.id, c.name, c.name_ar, c.name_en, 'caravane' as type 
FROM caravanes c 
JOIN images_360 i ON i.itemType = 'caravane' AND i.itemId = c.id;

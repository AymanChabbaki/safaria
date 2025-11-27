-- Fix UTF-8 encoding for all data
SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

-- Update Artisans
UPDATE artisans SET 
    name='Atelier de Poterie Fès',
    name_ar='ورشة الفخار فاس',
    name_en='Pottery Workshop Fes',
    description='Découvrez l''art ancestral de la poterie berbère dans l''ancienne médina de Fès. Participez à un atelier pratique où vous apprendrez les techniques traditionnelles de façonnage et de décoration de la céramique marocaine.',
    description_ar='اكتشف فن الفخار البربري القديم في المدينة القديمة بفاس. شارك في ورشة عملية حيث ستتعلم التقنيات التقليدية لتشكيل وتزيين السيراميك المغربي.',
    description_en='Discover the ancestral art of Berber pottery in the ancient medina of Fes. Participate in a hands-on workshop where you will learn traditional techniques for shaping and decorating Moroccan ceramics.'
WHERE id=1;

UPDATE artisans SET 
    name='Tissage Berbère Marrakech',
    name_ar='النسيج البربري مراكش',
    name_en='Berber Weaving Marrakech',
    description='Immergez-vous dans l''art du tissage berbère à Marrakech. Rencontrez des artisanes qui perpétuent des techniques ancestrales transmises de génération en génération.',
    description_ar='انغمس في فن النسيج البربري في مراكش. قابل الحرفيات اللواتي يحافظن على التقنيات القديمة المنقولة من جيل إلى جيل.',
    description_en='Immerse yourself in the art of Berber weaving in Marrakech. Meet artisans who perpetuate ancestral techniques passed down from generation to generation.'
WHERE id=2;

UPDATE artisans SET 
    name='Ferronnerie d''Art Essaouira',
    name_ar='الحدادة الفنية الصويرة',
    name_en='Art Ironwork Essaouira',
    description='Visitez un atelier de ferronnerie traditionnel à Essaouira. Observez les maîtres forgerons façonner le métal avec une précision remarquable.',
    description_ar='قم بزيارة ورشة حدادة تقليدية في الصويرة. شاهد الحدادين الماهرين يشكلون المعدن بدقة ملحوظة.',
    description_en='Visit a traditional ironwork workshop in Essaouira. Watch master blacksmiths shape metal with remarkable precision.'
WHERE id=3;

UPDATE artisans SET 
    name='Maroquinerie Artisanale Rabat',
    name_ar='صناعة الجلود التقليدية الرباط',
    name_en='Traditional Leather Craft Rabat',
    description='Découvrez les secrets de la maroquinerie marocaine dans les souks de Rabat. Apprenez les techniques de tannage traditionnel et de couture du cuir.',
    description_ar='اكتشف أسرار صناعة الجلود المغربية في أسواق الرباط. تعلم تقنيات الدباغة التقليدية وخياطة الجلود.',
    description_en='Discover the secrets of Moroccan leather craftsmanship in the souks of Rabat. Learn traditional tanning and leather stitching techniques.'
WHERE id=4;

-- Update Sejours
UPDATE sejours SET 
    name='Riad Traditionnel Marrakech',
    name_ar='رياض تقليدي مراكش',
    name_en='Traditional Riad Marrakech',
    description='Séjournez dans un riad authentique au cœur de la médina de Marrakech. Découvrez l''architecture traditionnelle marocaine avec ses cours intérieures, fontaines et jardins luxuriants.',
    description_ar='أقم في رياض أصيل في قلب المدينة القديمة بمراكش. اكتشف العمارة المغربية التقليدية مع الأفنية الداخلية والنوافير والحدائق الخضراء.',
    description_en='Stay in an authentic riad in the heart of Marrakech medina. Discover traditional Moroccan architecture with its interior courtyards, fountains and lush gardens.'
WHERE id=1;

UPDATE sejours SET 
    name='Maison Bleue Chefchaouen',
    name_ar='الدار الزرقاء شفشاون',
    name_en='Blue House Chefchaouen',
    description='Vivez une expérience unique dans la ville bleue de Chefchaouen. Notre maison d''hôtes offre une vue panoramique sur les montagnes du Rif.',
    description_ar='عش تجربة فريدة في المدينة الزرقاء شفشاون. يوفر بيت الضيافة لدينا إطلالة بانورامية على جبال الريف.',
    description_en='Live a unique experience in the blue city of Chefchaouen. Our guesthouse offers panoramic views of the Rif mountains.'
WHERE id=2;

UPDATE sejours SET 
    name='Kasbah du Désert Merzouga',
    name_ar='قصبة الصحراء مرزوكة',
    name_en='Desert Kasbah Merzouga',
    description='Hébergement luxueux aux portes du Sahara. Notre kasbah offre un mélange parfait de confort moderne et de charme traditionnel.',
    description_ar='إقامة فاخرة على أبواب الصحراء الكبرى. تقدم قصبتنا مزيجاً مثالياً من الراحة الحديثة والسحر التقليدي.',
    description_en='Luxury accommodation at the gates of the Sahara. Our kasbah offers a perfect blend of modern comfort and traditional charm.'
WHERE id=3;

UPDATE sejours SET 
    name='Dar Océanique Essaouira',
    name_ar='دار المحيط الصويرة',
    name_en='Ocean House Essaouira',
    description='Maison d''hôtes face à l''océan Atlantique à Essaouira. Réveillez-vous avec le son des vagues et profitez de couchers de soleil spectaculaires.',
    description_ar='دار ضيافة مواجه للمحيط الأطلسي في الصويرة. استيقظ على صوت الأمواج واستمتع بغروب الشمس الخلاب.',
    description_en='Guesthouse facing the Atlantic Ocean in Essaouira. Wake up to the sound of waves and enjoy spectacular sunsets.'
WHERE id=4;

-- Update Caravanes
UPDATE caravanes SET 
    name='Expédition Sahara 3 Jours',
    name_ar='رحلة الصحراء 3 أيام',
    name_en='Sahara Expedition 3 Days',
    description='Aventure inoubliable de 3 jours dans le Sahara marocain. Traversée des dunes dorées à dos de dromadaire, nuits sous les étoiles dans des campements berbères authentiques.',
    description_ar='مغامرة لا تنسى لمدة 3 أيام في الصحراء المغربية. عبور الكثبان الذهبية على ظهر الجمال، ليالٍ تحت النجوم في مخيمات بربرية أصيلة.',
    description_en='Unforgettable 3-day adventure in the Moroccan Sahara. Crossing golden dunes on camelback, nights under the stars in authentic Berber camps.'
WHERE id=1;

UPDATE caravanes SET 
    name='Nuit Sous les Étoiles',
    name_ar='ليلة تحت النجوم',
    name_en='Night Under the Stars',
    description='Expérience magique d''une nuit dans le désert de Merzouga. Randonnée au coucher du soleil jusqu''au campement, dîner traditionnel sous les étoiles.',
    description_ar='تجربة سحرية لليلة واحدة في صحراء مرزوكة. رحلة عند غروب الشمس إلى المخيم، عشاء تقليدي تحت النجوم.',
    description_en='Magical overnight experience in the Merzouga desert. Sunset hike to the camp, traditional dinner under the stars.'
WHERE id=2;

UPDATE caravanes SET 
    name='Trek Vallée du Drâa',
    name_ar='رحلة وادي درعة',
    name_en='Draa Valley Trek',
    description='Randonnée de 4 jours à travers la vallée du Drâa, la plus longue vallée du Maroc. Découvrez des oasis verdoyantes et des kasbahs ancestrales.',
    description_ar='رحلة 4 أيام عبر وادي درعة، أطول وادٍ في المغرب. اكتشف الواحات الخضراء والقصبات القديمة.',
    description_en='4-day trek through the Draa Valley, the longest valley in Morocco. Discover verdant oases and ancestral kasbahs.'
WHERE id=3;

UPDATE caravanes SET 
    name='Circuit Atlas et Désert',
    name_ar='جولة الأطلس والصحراء',
    name_en='Atlas and Desert Circuit',
    description='Circuit complet de 7 jours combinant les montagnes de l''Atlas et le désert du Sahara. Traversée du Haut Atlas, visite de villages berbères.',
    description_ar='جولة كاملة لمدة 7 أيام تجمع بين جبال الأطلس وصحراء الصحراء. عبور الأطلس الكبير، زيارة القرى البربرية.',
    description_en='Complete 7-day circuit combining the Atlas Mountains and the Sahara desert. Crossing the High Atlas, visiting Berber villages.'
WHERE id=4;

SELECT 'UTF-8 data updated successfully!' as status;
SELECT id, name, name_ar, name_en FROM artisans LIMIT 2;
SELECT id, name, name_ar, name_en FROM sejours LIMIT 2;
SELECT id, name, name_ar, name_en FROM caravanes LIMIT 2;

-- ============================================================
-- Fix Character Encoding for French Characters
-- Convert database and tables to UTF-8
-- ============================================================

-- Set database to use UTF-8
ALTER DATABASE safaria_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE safaria_db;

-- Convert all tables to UTF-8
ALTER TABLE artisans CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE sejours CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE caravanes CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE users CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE images_360 CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE reservations CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Verify encoding
SELECT 
  TABLE_NAME, 
  TABLE_COLLATION 
FROM information_schema.TABLES 
WHERE TABLE_SCHEMA = 'safaria_db';

SELECT 'Encoding fixed! You may need to re-import your data.' as message;

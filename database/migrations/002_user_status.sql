-- =====================================
-- CityFix Migration 002
-- Adds status column to users for account management.
-- =====================================

USE cityfix;

SET @exist := (
  SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = 'cityfix' AND TABLE_NAME = 'users' AND COLUMN_NAME = 'status'
);

SET @sql := IF(@exist = 0,
  'ALTER TABLE users ADD COLUMN status VARCHAR(20) NOT NULL DEFAULT ''Active''',
  'SELECT 1');

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- =====================================
-- End of Migration 002
-- =====================================
-- =====================================
-- CityFix Migration 003
-- Adds citizen feedback columns to issues so the Completed -> Citizen Feedback
-- workflow persists the rating and review comment.
-- =====================================

USE cityfix;

SET @exist_rating := (
  SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = 'cityfix' AND TABLE_NAME = 'issues' AND COLUMN_NAME = 'feedback_rating'
);

SET @sql_rating := IF(@exist_rating = 0,
  'ALTER TABLE issues ADD COLUMN feedback_rating TINYINT NULL',
  'SELECT 1');

PREPARE stmt_rating FROM @sql_rating;
EXECUTE stmt_rating;
DEALLOCATE PREPARE stmt_rating;

SET @exist_comment := (
  SELECT COUNT(*) FROM information_schema.COLUMNS
  WHERE TABLE_SCHEMA = 'cityfix' AND TABLE_NAME = 'issues' AND COLUMN_NAME = 'feedback_comment'
);

SET @sql_comment := IF(@exist_comment = 0,
  'ALTER TABLE issues ADD COLUMN feedback_comment TEXT NULL',
  'SELECT 1');

PREPARE stmt_comment FROM @sql_comment;
EXECUTE stmt_comment;
DEALLOCATE PREPARE stmt_comment;

-- =====================================
-- End of Migration 003
-- =====================================
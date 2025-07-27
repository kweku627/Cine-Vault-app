-- Fix watch_later table schema
-- Remove profile_id column if it exists
ALTER TABLE watch_later DROP COLUMN IF EXISTS profile_id;

-- Ensure user_id column exists and is properly configured
ALTER TABLE watch_later MODIFY COLUMN user_id BIGINT NOT NULL;

-- Add any missing columns that might be needed
ALTER TABLE watch_later ADD COLUMN IF NOT EXISTS content_id VARCHAR(255) NOT NULL;
ALTER TABLE watch_later ADD COLUMN IF NOT EXISTS title VARCHAR(255) NOT NULL;
ALTER TABLE watch_later ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE watch_later ADD COLUMN IF NOT EXISTS poster VARCHAR(500);
ALTER TABLE watch_later ADD COLUMN IF NOT EXISTS backdrop VARCHAR(500);
ALTER TABLE watch_later ADD COLUMN IF NOT EXISTS year VARCHAR(10);
ALTER TABLE watch_later ADD COLUMN IF NOT EXISTS genre VARCHAR(100);
ALTER TABLE watch_later ADD COLUMN IF NOT EXISTS type VARCHAR(50);
ALTER TABLE watch_later ADD COLUMN IF NOT EXISTS duration VARCHAR(50);
ALTER TABLE watch_later ADD COLUMN IF NOT EXISTS rating VARCHAR(10);
ALTER TABLE watch_later ADD COLUMN IF NOT EXISTS added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Add foreign key constraint for user_id if it doesn't exist
ALTER TABLE watch_later ADD CONSTRAINT IF NOT EXISTS fk_watch_later_user 
FOREIGN KEY (user_id) REFERENCES users(id); 
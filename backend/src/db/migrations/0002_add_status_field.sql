-- Add status field to coins table
-- (already manually added, this migration just tracks it)

-- Ensure all indexes exist
CREATE INDEX IF NOT EXISTS idx_coins_purchase_date ON coins(user_id, purchase_date);

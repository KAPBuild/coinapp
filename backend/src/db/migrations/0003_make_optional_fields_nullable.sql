-- SQLite doesn't support ALTER COLUMN to change NOT NULL constraint
-- We need to recreate the table with the correct schema

-- Step 1: Create new table with correct schema
CREATE TABLE IF NOT EXISTS `coins_new` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`name` text,
	`description` text,
	`quantity` real NOT NULL,
	`purchase_price` real NOT NULL,
	`current_price` real,
	`bullion_value` real,
	`melt_value` real,
	`grading` text,
	`notes` text,
	`purchase_date` text,
	`year` integer,
	`mint` text,
	`denomination` text,
	`variation` text,
	`important_variations` text,
	`series` text,
	`is_graded` text,
	`grading_company` text,
	`actual_grade` text,
	`estimated_grade` text,
	`place_purchased` text,
	`seller` text,
	`order_number` text,
	`ebay_title` text,
	`taxed` text,
	`card_number` text,
	`status` text DEFAULT 'Private Collection',
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);

-- Step 2: Copy data from old table to new table
INSERT INTO coins_new
SELECT
	id, user_id, name, description, quantity, purchase_price, current_price,
	bullion_value, melt_value, grading, notes, purchase_date,
	year, mint, denomination, variation, important_variations, series,
	is_graded, grading_company, actual_grade, estimated_grade,
	place_purchased, seller, order_number, ebay_title, taxed, card_number,
	status, created_at, updated_at
FROM coins;

-- Step 3: Drop old table
DROP TABLE coins;

-- Step 4: Rename new table to old table name
ALTER TABLE coins_new RENAME TO coins;

-- Step 5: Recreate indexes
CREATE INDEX IF NOT EXISTS idx_coins_user_year_mint ON coins(user_id, year, mint);
CREATE INDEX IF NOT EXISTS idx_coins_user_series ON coins(user_id, series);
CREATE INDEX IF NOT EXISTS idx_coins_user_graded ON coins(user_id, is_graded);
CREATE INDEX IF NOT EXISTS idx_coins_purchase_date ON coins(user_id, purchase_date);

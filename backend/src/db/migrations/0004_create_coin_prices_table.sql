-- Create table for storing coin price data from PCGS/NGC
CREATE TABLE IF NOT EXISTS `coin_prices` (
	`id` text PRIMARY KEY NOT NULL,
	`series` text NOT NULL,
	`year` integer NOT NULL,
	`mint_mark` text,
	`grade` text NOT NULL,
	`variety` text,
	`price_source` text NOT NULL,
	`price` real NOT NULL,
	`last_updated` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_prices_series_year ON coin_prices(series, year, mint_mark);
CREATE INDEX IF NOT EXISTS idx_prices_grade ON coin_prices(grade);
CREATE INDEX IF NOT EXISTS idx_prices_source ON coin_prices(price_source);
CREATE INDEX IF NOT EXISTS idx_prices_lookup ON coin_prices(series, year, mint_mark, grade, price_source);

-- Create table for tracking scraping runs
CREATE TABLE IF NOT EXISTS `price_scrape_log` (
	`id` text PRIMARY KEY NOT NULL,
	`price_source` text NOT NULL,
	`scrape_date` text NOT NULL,
	`status` text NOT NULL,
	`coins_updated` integer DEFAULT 0,
	`error_message` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_scrape_log_date ON price_scrape_log(scrape_date);

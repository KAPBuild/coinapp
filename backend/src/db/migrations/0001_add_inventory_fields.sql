-- Migration: Add inventory fields to coins table
-- Adds 16 new columns to support full Google Sheets template with 21 fields
-- These columns were already manually added to the schema, this migration just tracks them

-- Create indexes for search/filter performance (created by drizzle ORM)
CREATE INDEX IF NOT EXISTS idx_coins_user_year_mint ON coins(user_id, year, mint);
CREATE INDEX IF NOT EXISTS idx_coins_user_series ON coins(user_id, series);
CREATE INDEX IF NOT EXISTS idx_coins_user_graded ON coins(user_id, is_graded);

-- Coin Catalog table - stores Numista coin specifications
CREATE TABLE IF NOT EXISTS coin_catalog (
  id TEXT PRIMARY KEY,
  numista_id INTEGER UNIQUE,

  -- Basic identification
  title TEXT NOT NULL,
  country TEXT NOT NULL,
  issuer TEXT,

  -- Type categorization
  coin_type TEXT,
  series TEXT,

  -- Date range
  year_start INTEGER,
  year_end INTEGER,

  -- Denomination
  denomination TEXT,
  denomination_value REAL,
  currency TEXT,

  -- Physical specifications
  composition TEXT,
  weight REAL,
  diameter REAL,
  thickness REAL,

  -- Metal content
  fineness REAL,
  metal_type TEXT,
  actual_silver_weight REAL,
  actual_gold_weight REAL,

  -- Images
  obverse_image_url TEXT,
  reverse_image_url TEXT,

  -- Metadata
  last_synced_at TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Coin Varieties table - stores individual year/mint combinations
CREATE TABLE IF NOT EXISTS coin_varieties (
  id TEXT PRIMARY KEY,
  catalog_id TEXT NOT NULL REFERENCES coin_catalog(id) ON DELETE CASCADE,

  -- Variety identification
  year INTEGER NOT NULL,
  mint_mark TEXT,
  variety TEXT,

  -- Mintage data
  mintage INTEGER,
  survival_estimate INTEGER,

  -- Key date status
  is_key_date INTEGER DEFAULT 0,

  -- Population data
  pcgs_pop INTEGER,
  ngc_pop INTEGER,
  pop_last_updated TEXT,

  -- Metadata
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for coin_catalog
CREATE INDEX IF NOT EXISTS idx_catalog_country ON coin_catalog(country);
CREATE INDEX IF NOT EXISTS idx_catalog_series ON coin_catalog(series);
CREATE INDEX IF NOT EXISTS idx_catalog_years ON coin_catalog(year_start, year_end);
CREATE INDEX IF NOT EXISTS idx_catalog_metal ON coin_catalog(metal_type);

-- Indexes for coin_varieties
CREATE INDEX IF NOT EXISTS idx_varieties_catalog ON coin_varieties(catalog_id);
CREATE INDEX IF NOT EXISTS idx_varieties_year_mint ON coin_varieties(year, mint_mark);
CREATE INDEX IF NOT EXISTS idx_varieties_key_date ON coin_varieties(is_key_date);

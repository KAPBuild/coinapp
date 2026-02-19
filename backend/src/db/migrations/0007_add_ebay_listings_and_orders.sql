-- eBay listings table (synced from Browse API)
CREATE TABLE ebay_listings (
  id text PRIMARY KEY,
  ebay_item_id text NOT NULL UNIQUE,
  title text NOT NULL,
  price real,
  currency text DEFAULT 'USD',
  image_url text,
  image_urls text,
  ebay_url text NOT NULL,
  affiliate_url text,
  condition text,
  category_name text,
  quantity_available integer DEFAULT 1,
  listing_status text DEFAULT 'active',
  synced_at text NOT NULL,
  created_at text NOT NULL DEFAULT (datetime('now')),
  updated_at text NOT NULL DEFAULT (datetime('now'))
);

CREATE UNIQUE INDEX idx_ebay_item_id ON ebay_listings(ebay_item_id);
CREATE INDEX idx_ebay_listing_status ON ebay_listings(listing_status);

-- Orders table (for Stripe purchases)
CREATE TABLE orders (
  id text PRIMARY KEY,
  ebay_listing_id text REFERENCES ebay_listings(id),
  stripe_payment_intent_id text UNIQUE,
  stripe_checkout_status text DEFAULT 'pending',
  customer_email text NOT NULL,
  customer_name text,
  shipping_address text,
  amount integer NOT NULL,
  currency text DEFAULT 'usd',
  item_title text NOT NULL,
  status text DEFAULT 'pending',
  created_at text NOT NULL DEFAULT (datetime('now')),
  updated_at text NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_stripe_pi ON orders(stripe_payment_intent_id);

-- eBay sync log
CREATE TABLE ebay_sync_log (
  id integer PRIMARY KEY AUTOINCREMENT,
  status text NOT NULL,
  listings_synced integer DEFAULT 0,
  error_message text,
  started_at text NOT NULL DEFAULT (datetime('now')),
  completed_at text
);

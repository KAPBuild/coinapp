import { sql } from 'drizzle-orm'
import { sqliteTable, text, real, integer, primaryKey, index } from 'drizzle-orm/sqlite-core'

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email').unique().notNull(),
  password: text('password').notNull(),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
})

export const coins = sqliteTable('coins', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),

  // Core fields
  name: text('name'),
  description: text('description'),
  quantity: real('quantity').notNull(),
  purchasePrice: real('purchase_price').notNull(),
  currentPrice: real('current_price'),
  purchaseDate: text('purchase_date'),

  // Value tracking
  bullionValue: real('bullion_value'),
  meltValue: real('melt_value'),
  notes: text('notes'),

  // New coin identification fields
  year: integer('year'),
  mint: text('mint'),
  denomination: text('denomination'),
  variation: text('variation'),
  importantVariations: text('important_variations'),
  series: text('series'),

  // New grading fields
  isGraded: text('is_graded'),
  gradingCompany: text('grading_company'),
  actualGrade: text('actual_grade'),
  estimatedGrade: text('estimated_grade'),

  // New purchase tracking fields
  placePurchased: text('place_purchased'),
  seller: text('seller'),
  orderNumber: text('order_number'),
  ebayTitle: text('ebay_title'),
  taxed: text('taxed'),
  cardNumber: text('card_number'),

  // Inventory status
  status: text('status').default('Private Collection'),

  // Legacy field (kept for backward compatibility, being migrated)
  grading: text('grading'),

  // Metadata
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
  index('idx_coins_user_year_mint').on(table.userId, table.year, table.mint),
  index('idx_coins_user_series').on(table.userId, table.series),
  index('idx_coins_user_graded').on(table.userId, table.isGraded),
])

export const sessions = sqliteTable(
  'sessions',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    token: text('token').unique().notNull(),
    createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
    expiresAt: text('expires_at').notNull(),
  },
  (table) => [
    index('token_idx').on(table.token),
  ]
)

// Price tracking tables
export const coinPrices = sqliteTable('coin_prices', {
  id: text('id').primaryKey(),
  series: text('series').notNull(),
  year: integer('year').notNull(),
  mintMark: text('mint_mark'),
  grade: text('grade').notNull(),
  variety: text('variety'),
  priceSource: text('price_source').notNull(), // 'PCGS' or 'NGC'
  price: real('price').notNull(),
  lastUpdated: text('last_updated').notNull(),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
  index('idx_prices_series_year').on(table.series, table.year, table.mintMark),
  index('idx_prices_grade').on(table.grade),
  index('idx_prices_source').on(table.priceSource),
  index('idx_prices_lookup').on(table.series, table.year, table.mintMark, table.grade, table.priceSource),
])

export const priceScrapeLog = sqliteTable('price_scrape_log', {
  id: text('id').primaryKey(),
  priceSource: text('price_source').notNull(),
  scrapeDate: text('scrape_date').notNull(),
  status: text('status').notNull(), // 'success', 'failed', 'running'
  coinsUpdated: integer('coins_updated').default(0),
  errorMessage: text('error_message'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
  index('idx_scrape_log_date').on(table.scrapeDate),
])

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type Coin = typeof coins.$inferSelect
export type NewCoin = typeof coins.$inferInsert
export type Session = typeof sessions.$inferSelect
export type NewSession = typeof sessions.$inferInsert
export type CoinPrice = typeof coinPrices.$inferSelect
export type NewCoinPrice = typeof coinPrices.$inferInsert
export type PriceScrapeLog = typeof priceScrapeLog.$inferSelect
export type NewPriceScrapeLog = typeof priceScrapeLog.$inferInsert

// Coin Catalog - stores Numista coin specifications (static reference data)
export const coinCatalog = sqliteTable('coin_catalog', {
  id: text('id').primaryKey(),
  numistaId: integer('numista_id').unique(),

  // Basic identification
  title: text('title').notNull(),
  country: text('country').notNull(),
  issuer: text('issuer'),

  // Type categorization
  coinType: text('coin_type'), // 'Standard circulation coin', 'Commemorative', etc.
  series: text('series'), // 'Morgan Dollar', 'Peace Dollar', etc.

  // Date range
  yearStart: integer('year_start'),
  yearEnd: integer('year_end'),

  // Denomination
  denomination: text('denomination'),
  denominationValue: real('denomination_value'),
  currency: text('currency'),

  // Physical specifications
  composition: text('composition'), // 'Silver (.900)', 'Gold (.900)', etc.
  weight: real('weight'), // in grams
  diameter: real('diameter'), // in mm
  thickness: real('thickness'), // in mm

  // Metal content
  fineness: real('fineness'), // 0.900 for 90% silver
  metalType: text('metal_type'), // 'silver', 'gold', 'copper', etc.
  actualSilverWeight: real('actual_silver_weight'), // troy oz
  actualGoldWeight: real('actual_gold_weight'), // troy oz

  // Images
  obverseImageUrl: text('obverse_image_url'),
  reverseImageUrl: text('reverse_image_url'),

  // Metadata
  lastSyncedAt: text('last_synced_at'),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
  index('idx_catalog_country').on(table.country),
  index('idx_catalog_series').on(table.series),
  index('idx_catalog_years').on(table.yearStart, table.yearEnd),
  index('idx_catalog_metal').on(table.metalType),
])

// Coin Varieties - stores individual year/mint combinations with mintage
export const coinVarieties = sqliteTable('coin_varieties', {
  id: text('id').primaryKey(),
  catalogId: text('catalog_id').notNull().references(() => coinCatalog.id, { onDelete: 'cascade' }),

  // Variety identification
  year: integer('year').notNull(),
  mintMark: text('mint_mark'), // 'P', 'S', 'O', 'CC', 'D', etc.
  variety: text('variety'), // 'VAM-1', '7 Tail Feathers', etc.

  // Mintage data
  mintage: integer('mintage'),
  survivalEstimate: integer('survival_estimate'),

  // Key date status
  isKeyDate: integer('is_key_date').default(0), // 0 = false, 1 = true

  // Population data (from PCGS/NGC)
  pcgsPop: integer('pcgs_pop'),
  ngcPop: integer('ngc_pop'),
  popLastUpdated: text('pop_last_updated'),

  // Metadata
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
}, (table) => [
  index('idx_varieties_catalog').on(table.catalogId),
  index('idx_varieties_year_mint').on(table.year, table.mintMark),
  index('idx_varieties_key_date').on(table.isKeyDate),
])

export type CoinCatalog = typeof coinCatalog.$inferSelect
export type NewCoinCatalog = typeof coinCatalog.$inferInsert
export type CoinVariety = typeof coinVarieties.$inferSelect
export type NewCoinVariety = typeof coinVarieties.$inferInsert

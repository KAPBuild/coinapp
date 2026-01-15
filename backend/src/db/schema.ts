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

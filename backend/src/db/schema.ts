import { sql } from 'drizzle-orm'
import { sqliteTable, text, real, integer, primaryKey } from 'drizzle-orm/sqlite-core'

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email').unique().notNull(),
  password: text('password').notNull(),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
})

export const coins = sqliteTable('coins', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  description: text('description'),
  quantity: real('quantity').notNull(),
  purchasePrice: real('purchase_price').notNull(),
  currentPrice: real('current_price'),
  bullionValue: real('bullion_value'),
  meltValue: real('melt_value'),
  grading: text('grading'),
  notes: text('notes'),
  purchaseDate: text('purchase_date').notNull(),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
})

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type Coin = typeof coins.$inferSelect
export type NewCoin = typeof coins.$inferInsert

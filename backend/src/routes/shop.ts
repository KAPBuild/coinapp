import { Hono } from 'hono'
import { eq, and } from 'drizzle-orm'
import { createDb, schema } from '../db'

const app = new Hono()

// GET /api/shop - Public endpoint: returns admin's "For Sale" coins
app.get('/', async (c) => {
  try {
    const db = createDb(c.env.DB as D1Database)

    // Find admin user(s)
    const admins = await db
      .select({ id: schema.users.id })
      .from(schema.users)
      .where(eq(schema.users.isAdmin, 1))

    if (admins.length === 0) {
      return c.json([])
    }

    const adminIds = admins.map(a => a.id)

    // Get all "For Sale" coins from admin users
    // Only select fields safe for public display
    const allCoins = []
    for (const adminId of adminIds) {
      const coins = await db
        .select({
          id: schema.coins.id,
          year: schema.coins.year,
          mint: schema.coins.mint,
          denomination: schema.coins.denomination,
          series: schema.coins.series,
          variation: schema.coins.variation,
          importantVariations: schema.coins.importantVariations,
          currentPrice: schema.coins.currentPrice,
          quantity: schema.coins.quantity,
          isGraded: schema.coins.isGraded,
          gradingCompany: schema.coins.gradingCompany,
          actualGrade: schema.coins.actualGrade,
          estimatedGrade: schema.coins.estimatedGrade,
          ebayTitle: schema.coins.ebayTitle,
          notes: schema.coins.notes,
          metalType: schema.coins.metalType,
          silverContent: schema.coins.silverContent,
          goldContent: schema.coins.goldContent,
          weight: schema.coins.weight,
          status: schema.coins.status,
        })
        .from(schema.coins)
        .where(
          and(
            eq(schema.coins.userId, adminId),
            eq(schema.coins.status, 'For Sale')
          )
        )
      allCoins.push(...coins)
    }

    return c.json(allCoins)
  } catch (error) {
    console.error('Shop fetch error:', error)
    return c.json({ error: 'Failed to fetch shop coins' }, 500)
  }
})

export default app

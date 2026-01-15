import { Hono } from 'hono'
import { eq, and } from 'drizzle-orm'
import { z } from 'zod'
import { createDb, schema } from '../db'
import { authMiddleware } from '../middleware/auth'
import { createCoinSchema, type CreateCoinInput } from '../utils/coinValidation'

const app = new Hono()

// Apply auth middleware to all routes
app.use('*', authMiddleware)

// GET /api/coins - Get all coins for authenticated user
app.get('/', async (c) => {
  try {
    const db = createDb(c.env.DB as D1Database)
    const userId = c.get('userId')

    const userCoins = await db
      .select()
      .from(schema.coins)
      .where(eq(schema.coins.userId, userId))

    return c.json(userCoins)
  } catch (error) {
    console.error('Get coins error:', error)
    return c.json({ error: 'Failed to fetch coins' }, 500)
  }
})

// POST /api/coins - Add a new coin
app.post('/', async (c) => {
  try {
    const db = createDb(c.env.DB as D1Database)
    const userId = c.get('userId')
    const body = await c.req.json()

    // Validate with Zod schema
    let validated: CreateCoinInput
    try {
      validated = createCoinSchema.parse(body)
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        return c.json(
          { error: 'Validation failed', details: validationError.errors },
          400
        )
      }
      throw validationError
    }

    const newCoin = {
      id: crypto.randomUUID(),
      userId,
      ...validated,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    await db.insert(schema.coins).values(newCoin)

    return c.json(newCoin, 201)
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error('Add coin error:', errorMessage)
    return c.json({ error: 'Failed to add coin', details: errorMessage }, 500)
  }
})

// PUT /api/coins/:id - Update a coin
app.put('/:id', async (c) => {
  try {
    const db = createDb(c.env.DB as D1Database)
    const userId = c.get('userId')
    const coinId = c.req.param('id')
    const body = await c.req.json()

    // Verify ownership
    const [coin] = await db
      .select()
      .from(schema.coins)
      .where(and(eq(schema.coins.id, coinId), eq(schema.coins.userId, userId)))
      .limit(1)

    if (!coin) {
      return c.json({ error: 'Coin not found' }, 404)
    }

    // Validate with Zod schema (partial validation for updates)
    let validated: Partial<CreateCoinInput>
    try {
      validated = createCoinSchema.partial().parse(body)
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        return c.json(
          { error: 'Validation failed', details: validationError.errors },
          400
        )
      }
      throw validationError
    }

    // Update coin with all provided fields
    const [updated] = await db
      .update(schema.coins)
      .set({
        ...validated,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(schema.coins.id, coinId))
      .returning()

    return c.json(updated)
  } catch (error) {
    console.error('Update coin error:', error)
    return c.json({ error: 'Failed to update coin' }, 500)
  }
})

// DELETE /api/coins/:id - Delete a coin
app.delete('/:id', async (c) => {
  try {
    const db = createDb(c.env.DB as D1Database)
    const userId = c.get('userId')
    const coinId = c.req.param('id')

    // Verify ownership before deleting
    const [coin] = await db
      .select()
      .from(schema.coins)
      .where(and(eq(schema.coins.id, coinId), eq(schema.coins.userId, userId)))
      .limit(1)

    if (!coin) {
      return c.json({ error: 'Coin not found' }, 404)
    }

    await db.delete(schema.coins).where(eq(schema.coins.id, coinId))

    return c.json({ success: true })
  } catch (error) {
    console.error('Delete coin error:', error)
    return c.json({ error: 'Failed to delete coin' }, 500)
  }
})

export default app

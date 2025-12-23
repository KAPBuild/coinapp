import { Hono } from 'hono'
import { db } from '../db'

// Web Crypto API implementation for UUID
function generateId(): string {
  return crypto.getRandomValues(new Uint8Array(16))
    .reduce((s, b) => s + ('0' + b.toString(16)).slice(-2), '')
}

const app = new Hono()

// Get all coins for a user
app.get('/', async (c) => {
  try {
    const userId = c.req.header('x-user-id')
    if (!userId) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const userCoins = db.getAllCoins(userId)
    return c.json(userCoins)
  } catch (error) {
    return c.json({ error: 'Failed to fetch coins' }, 500)
  }
})

// Add a new coin
app.post('/', async (c) => {
  try {
    const userId = c.req.header('x-user-id')
    if (!userId) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const body = await c.req.json()
    const now = new Date().toISOString()
    const newCoin = {
      id: generateId(),
      userId,
      name: body.name,
      description: body.description,
      quantity: body.quantity,
      purchasePrice: body.purchasePrice,
      currentPrice: body.currentPrice,
      bullionValue: body.bullionValue,
      meltValue: body.meltValue,
      grading: body.grading,
      notes: body.notes,
      purchaseDate: body.purchaseDate,
      createdAt: now,
      updatedAt: now,
    }

    const result = db.addCoin(newCoin)
    return c.json(result, 201)
  } catch (error) {
    return c.json({ error: 'Failed to add coin' }, 500)
  }
})

// Update a coin
app.put('/:id', async (c) => {
  try {
    const userId = c.req.header('x-user-id')
    if (!userId) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const coinId = c.req.param('id')
    const body = await c.req.json()

    const updated = db.updateCoin(coinId, {
      name: body.name,
      description: body.description,
      quantity: body.quantity,
      purchasePrice: body.purchasePrice,
      currentPrice: body.currentPrice,
      bullionValue: body.bullionValue,
      meltValue: body.meltValue,
      grading: body.grading,
      notes: body.notes,
      purchaseDate: body.purchaseDate,
      updatedAt: new Date().toISOString(),
    })

    if (!updated) {
      return c.json({ error: 'Coin not found' }, 404)
    }

    return c.json(updated)
  } catch (error) {
    return c.json({ error: 'Failed to update coin' }, 500)
  }
})

// Delete a coin
app.delete('/:id', async (c) => {
  try {
    const userId = c.req.header('x-user-id')
    if (!userId) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const coinId = c.req.param('id')
    db.deleteCoin(coinId)

    return c.json({ success: true })
  } catch (error) {
    return c.json({ error: 'Failed to delete coin' }, 500)
  }
})

export default app

import { Hono } from 'hono'
import { getCoinPrice } from '../scrapers/priceScrapers'

const app = new Hono()

// GET /api/prices?coin=morgan-dollar&grade=MS-70
app.get('/', async (c) => {
  try {
    const coinName = c.req.query('coin')
    const grade = c.req.query('grade')

    if (!coinName || !grade) {
      return c.json({ error: 'Missing coin or grade parameter' }, 400)
    }

    const priceData = await getCoinPrice(coinName, grade)

    if (!priceData) {
      return c.json({ error: 'Price data not found' }, 404)
    }

    return c.json(priceData)
  } catch (error) {
    console.error('Price API error:', error)
    return c.json({ error: 'Failed to fetch prices' }, 500)
  }
})

export default app

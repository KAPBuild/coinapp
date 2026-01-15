import { Hono } from 'hono'
import { US_SILVER_COINS, US_GOLD_COINS, getAllCoins, getCoinById, calculateMeltValue, CoinMetalContent } from '../data/coinMetalContent'

const app = new Hono()

interface MeltValueResponse {
  coin: CoinMetalContent
  meltValue: number
  spotPrice: number
  metalWeight: number
}

// GET /api/melt - Get all coins with melt values
// Query params: ?gold=2050&silver=24.50&platinum=950
app.get('/', async (c) => {
  try {
    const goldSpot = parseFloat(c.req.query('gold') || '0')
    const silverSpot = parseFloat(c.req.query('silver') || '0')
    const platinumSpot = parseFloat(c.req.query('platinum') || '0')

    // If no spot prices provided, fetch them
    let spotPrices = { gold: goldSpot, silver: silverSpot, platinum: platinumSpot }

    if (goldSpot === 0 && silverSpot === 0) {
      // Try to fetch live spot prices
      try {
        const response = await fetch('https://api.metals.live/v1/spot/metals?currencies=usd')
        const data = await response.json() as { metals?: { gold?: number; silver?: number; platinum?: number } }
        spotPrices = {
          gold: data.metals?.gold || 2050,
          silver: data.metals?.silver || 24.50,
          platinum: data.metals?.platinum || 950,
        }
      } catch {
        // Fallback prices
        spotPrices = { gold: 2050, silver: 24.50, platinum: 950 }
      }
    }

    const allCoins = getAllCoins()

    const results = allCoins.map(coin => ({
      ...coin,
      meltValue: calculateMeltValue(coin, spotPrices),
      spotPrice: coin.metalType === 'gold' ? spotPrices.gold :
                 coin.metalType === 'silver' ? spotPrices.silver :
                 spotPrices.platinum,
      metalWeight: coin.metalType === 'gold' ? (coin.agw || 0) : coin.asw,
    }))

    return c.json({
      spotPrices,
      lastUpdated: new Date().toISOString(),
      silverCoins: results.filter(c => c.metalType === 'silver'),
      goldCoins: results.filter(c => c.metalType === 'gold'),
    })
  } catch (error) {
    console.error('Melt values error:', error)
    return c.json({ error: 'Failed to calculate melt values' }, 500)
  }
})

// GET /api/melt/silver - Get just silver coins
app.get('/silver', async (c) => {
  try {
    const silverSpot = parseFloat(c.req.query('silver') || '0')

    let spotPrice = silverSpot
    if (spotPrice === 0) {
      try {
        const response = await fetch('https://api.metals.live/v1/spot/metals?currencies=usd')
        const data = await response.json() as { metals?: { silver?: number } }
        spotPrice = data.metals?.silver || 24.50
      } catch {
        spotPrice = 24.50
      }
    }

    const results = US_SILVER_COINS.map(coin => ({
      ...coin,
      meltValue: coin.asw * spotPrice,
      spotPrice,
    }))

    return c.json({
      spotPrice,
      lastUpdated: new Date().toISOString(),
      coins: results,
    })
  } catch (error) {
    console.error('Silver melt values error:', error)
    return c.json({ error: 'Failed to calculate silver melt values' }, 500)
  }
})

// GET /api/melt/gold - Get just gold coins
app.get('/gold', async (c) => {
  try {
    const goldSpot = parseFloat(c.req.query('gold') || '0')

    let spotPrice = goldSpot
    if (spotPrice === 0) {
      try {
        const response = await fetch('https://api.metals.live/v1/spot/metals?currencies=usd')
        const data = await response.json() as { metals?: { gold?: number } }
        spotPrice = data.metals?.gold || 2050
      } catch {
        spotPrice = 2050
      }
    }

    const results = US_GOLD_COINS.map(coin => ({
      ...coin,
      meltValue: (coin.agw || 0) * spotPrice,
      spotPrice,
    }))

    return c.json({
      spotPrice,
      lastUpdated: new Date().toISOString(),
      coins: results,
    })
  } catch (error) {
    console.error('Gold melt values error:', error)
    return c.json({ error: 'Failed to calculate gold melt values' }, 500)
  }
})

// GET /api/melt/:id - Get melt value for a specific coin
app.get('/:id', async (c) => {
  try {
    const coinId = c.req.param('id')
    const coin = getCoinById(coinId)

    if (!coin) {
      return c.json({ error: 'Coin not found' }, 404)
    }

    // Fetch spot prices
    let spotPrices = { gold: 2050, silver: 24.50, platinum: 950 }
    try {
      const response = await fetch('https://api.metals.live/v1/spot/metals?currencies=usd')
      const data = await response.json() as { metals?: { gold?: number; silver?: number; platinum?: number } }
      spotPrices = {
        gold: data.metals?.gold || 2050,
        silver: data.metals?.silver || 24.50,
        platinum: data.metals?.platinum || 950,
      }
    } catch {
      // Use fallback
    }

    const meltValue = calculateMeltValue(coin, spotPrices)
    const spotPrice = coin.metalType === 'gold' ? spotPrices.gold :
                      coin.metalType === 'silver' ? spotPrices.silver :
                      spotPrices.platinum

    return c.json({
      coin,
      meltValue,
      spotPrice,
      metalWeight: coin.metalType === 'gold' ? (coin.agw || 0) : coin.asw,
      lastUpdated: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Coin melt value error:', error)
    return c.json({ error: 'Failed to calculate melt value' }, 500)
  }
})

// GET /api/melt/calculate - Calculate melt for custom weight
// Query: ?asw=0.77344&silver=24.50 or ?agw=1.0&gold=2050
app.get('/calculate/custom', async (c) => {
  try {
    const asw = parseFloat(c.req.query('asw') || '0')
    const agw = parseFloat(c.req.query('agw') || '0')
    const silverSpot = parseFloat(c.req.query('silver') || '0')
    const goldSpot = parseFloat(c.req.query('gold') || '0')

    // Fetch spot prices if not provided
    let spotPrices = { gold: goldSpot, silver: silverSpot }
    if (goldSpot === 0 || silverSpot === 0) {
      try {
        const response = await fetch('https://api.metals.live/v1/spot/metals?currencies=usd')
        const data = await response.json() as { metals?: { gold?: number; silver?: number } }
        spotPrices = {
          gold: goldSpot || data.metals?.gold || 2050,
          silver: silverSpot || data.metals?.silver || 24.50,
        }
      } catch {
        spotPrices = { gold: goldSpot || 2050, silver: silverSpot || 24.50 }
      }
    }

    const silverMelt = asw * spotPrices.silver
    const goldMelt = agw * spotPrices.gold
    const totalMelt = silverMelt + goldMelt

    return c.json({
      asw,
      agw,
      spotPrices,
      silverMelt,
      goldMelt,
      totalMelt,
      lastUpdated: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Custom melt calculation error:', error)
    return c.json({ error: 'Failed to calculate melt value' }, 500)
  }
})

export default app

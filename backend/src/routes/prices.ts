import { Hono } from 'hono'
import { eq, and, isNull, desc } from 'drizzle-orm'
import { createDb, schema } from '../db'
import { authMiddleware } from '../middleware/auth'
import { scrapePCGSMorganPrices, scrapeNGCMorganPrices, importPrices } from '../scrapers/morganDollarScraper'

const app = new Hono()

// GET /api/prices/lookup - Get price for a specific coin
app.get('/lookup', async (c) => {
  try {
    const db = createDb(c.env.DB as D1Database)

    const series = c.req.query('series')
    const year = c.req.query('year')
    const mintMark = c.req.query('mintMark') || null
    const grade = c.req.query('grade')
    const priceSource = c.req.query('source') || 'PCGS' // Default to PCGS

    if (!series || !year || !grade) {
      return c.json({ error: 'Missing required parameters: series, year, grade' }, 400)
    }

    const yearNum = parseInt(year)
    if (isNaN(yearNum)) {
      return c.json({ error: 'Invalid year' }, 400)
    }

    // Query for the specific price
    const conditions = [
      eq(schema.coinPrices.series, series),
      eq(schema.coinPrices.year, yearNum),
      eq(schema.coinPrices.grade, grade),
      eq(schema.coinPrices.priceSource, priceSource),
    ]

    if (mintMark) {
      conditions.push(eq(schema.coinPrices.mintMark, mintMark))
    } else {
      conditions.push(isNull(schema.coinPrices.mintMark))
    }

    const prices = await db
      .select()
      .from(schema.coinPrices)
      .where(and(...conditions))
      .limit(1)

    if (prices.length === 0) {
      return c.json({ error: 'Price not found' }, 404)
    }

    return c.json(prices[0])
  } catch (error) {
    console.error('Price lookup error:', error)
    return c.json({ error: 'Failed to fetch price' }, 500)
  }
})

// GET /api/prices/coin/:id - Get all available prices for a user's coin with average
app.get('/coin/:id', authMiddleware, async (c) => {
  try {
    const db = createDb(c.env.DB as D1Database)
    const userId = c.get('userId')
    const coinId = c.req.param('id')

    // Get the coin details
    const coins = await db
      .select()
      .from(schema.coins)
      .where(and(eq(schema.coins.id, coinId), eq(schema.coins.userId, userId)))
      .limit(1)

    if (coins.length === 0) {
      return c.json({ error: 'Coin not found' }, 404)
    }

    const coin = coins[0]

    // If coin doesn't have required data, return empty
    if (!coin.series || !coin.year) {
      return c.json({
        coin,
        pricing: null,
        message: 'Coin missing series or year data'
      })
    }

    // Find prices for this coin's specific grade
    const gradeConditions = [
      eq(schema.coinPrices.series, coin.series),
      eq(schema.coinPrices.year, coin.year),
    ]

    if (coin.mint) {
      gradeConditions.push(eq(schema.coinPrices.mintMark, coin.mint))
    } else {
      gradeConditions.push(isNull(schema.coinPrices.mintMark))
    }

    // If coin has a grade, filter by it
    if (coin.actualGrade || coin.estimatedGrade) {
      const grade = coin.actualGrade || coin.estimatedGrade
      if (grade) {
        gradeConditions.push(eq(schema.coinPrices.grade, grade))
      }
    }

    const prices = await db
      .select()
      .from(schema.coinPrices)
      .where(and(...gradeConditions))

    // Calculate average price
    const pcgsPrice = prices.find(p => p.priceSource === 'PCGS')?.price || null
    const ngcPrice = prices.find(p => p.priceSource === 'NGC')?.price || null

    let averagePrice = null
    if (pcgsPrice && ngcPrice) {
      averagePrice = (pcgsPrice + ngcPrice) / 2
    } else if (pcgsPrice) {
      averagePrice = pcgsPrice
    } else if (ngcPrice) {
      averagePrice = ngcPrice
    }

    const lastUpdated = prices.length > 0 ? prices[0].lastUpdated : null

    return c.json({
      coin,
      pricing: {
        averagePrice,
        pcgsPrice,
        ngcPrice,
        grade: coin.actualGrade || coin.estimatedGrade || null,
        lastUpdated,
      },
      allGrades: prices.length === 0 ? [] : await getAllGradePrices(db, coin)
    })
  } catch (error) {
    console.error('Coin prices error:', error)
    return c.json({ error: 'Failed to fetch coin prices' }, 500)
  }
})

// Helper function to get all grade prices for a coin
async function getAllGradePrices(db: ReturnType<typeof createDb>, coin: any) {
  const conditions = [
    eq(schema.coinPrices.series, coin.series),
    eq(schema.coinPrices.year, coin.year),
  ]

  if (coin.mint) {
    conditions.push(eq(schema.coinPrices.mintMark, coin.mint))
  } else {
    conditions.push(isNull(schema.coinPrices.mintMark))
  }

  const allPrices = await db
    .select()
    .from(schema.coinPrices)
    .where(and(...conditions))

  // Group by grade
  const gradeMap = new Map()

  for (const price of allPrices) {
    if (!gradeMap.has(price.grade)) {
      gradeMap.set(price.grade, { grade: price.grade, pcgs: null, ngc: null })
    }

    const gradeData = gradeMap.get(price.grade)
    if (price.priceSource === 'PCGS') {
      gradeData.pcgs = price.price
    } else if (price.priceSource === 'NGC') {
      gradeData.ngc = price.price
    }
  }

  // Calculate averages
  return Array.from(gradeMap.values()).map(g => ({
    ...g,
    average: g.pcgs && g.ngc ? (g.pcgs + g.ngc) / 2 : g.pcgs || g.ngc || null
  }))
}

// POST /api/prices/scrape-morgan - Scrape Morgan Dollar prices
app.post('/scrape-morgan', authMiddleware, async (c) => {
  try {
    const db = createDb(c.env.DB as D1Database)

    // TODO: Add admin check here
    // For now, any authenticated user can trigger scraping

    const scrapeId = crypto.randomUUID()
    const scrapeDate = new Date().toISOString()

    // Create scrape log entry
    await db.insert(schema.priceScrapeLog).values({
      id: scrapeId,
      priceSource: 'PCGS & NGC',
      scrapeDate,
      status: 'running',
    })

    try {
      console.log('Starting Morgan Dollar price scrape...')

      // Scrape both PCGS and NGC
      const pcgsPrices = await scrapePCGSMorganPrices()
      const ngcPrices = await scrapeNGCMorganPrices()

      console.log(`Scraped ${pcgsPrices.length} PCGS prices, ${ngcPrices.length} NGC prices`)

      // Import into database
      const imported = await importPrices(db, pcgsPrices, ngcPrices, 'both')

      // Update scrape log as successful
      await db.update(schema.priceScrapeLog)
        .set({
          status: 'success',
          coinsUpdated: imported,
        })
        .where(eq(schema.priceScrapeLog.id, scrapeId))

      return c.json({
        success: true,
        message: 'Morgan Dollar prices updated successfully',
        pcgsCount: pcgsPrices.length,
        ngcCount: ngcPrices.length,
        totalImported: imported,
        scrapeId,
      })

    } catch (scrapeError) {
      const errorMessage = scrapeError instanceof Error ? scrapeError.message : 'Unknown error'

      // Update scrape log as failed
      await db.update(schema.priceScrapeLog)
        .set({
          status: 'failed',
          errorMessage,
        })
        .where(eq(schema.priceScrapeLog.id, scrapeId))

      throw scrapeError
    }

  } catch (error) {
    console.error('Scraping error:', error)
    return c.json({
      success: false,
      error: 'Failed to scrape prices',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, 500)
  }
})

// GET /api/prices/stats - Get price database statistics
app.get('/stats', async (c) => {
  try {
    const db = createDb(c.env.DB as D1Database)

    // Count total prices
    const allPrices = await db.select().from(schema.coinPrices)
    const totalPrices = allPrices.length

    // Count by source
    const pcgsPrices = allPrices.filter(p => p.priceSource === 'PCGS').length
    const ngcPrices = allPrices.filter(p => p.priceSource === 'NGC').length

    // Get last update time
    const sortedPrices = allPrices.sort((a, b) =>
      new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
    )
    const lastUpdated = sortedPrices.length > 0 ? sortedPrices[0].lastUpdated : null

    // Count unique coins (year/mint combinations)
    const uniqueCoins = new Set(
      allPrices.map(p => `${p.year}-${p.mintMark || 'P'}`)
    ).size

    return c.json({
      totalPrices,
      pcgsPrices,
      ngcPrices,
      uniqueCoins,
      lastUpdated,
    })
  } catch (error) {
    console.error('Stats error:', error)
    return c.json({ error: 'Failed to fetch stats' }, 500)
  }
})

// GET /api/prices/scrape-log - Get recent scraping history
app.get('/scrape-log', authMiddleware, async (c) => {
  try {
    const db = createDb(c.env.DB as D1Database)

    const logs = await db
      .select()
      .from(schema.priceScrapeLog)
      .orderBy(desc(schema.priceScrapeLog.scrapeDate))
      .limit(50)

    return c.json(logs)
  } catch (error) {
    console.error('Scrape log error:', error)
    return c.json({ error: 'Failed to fetch scrape log' }, 500)
  }
})

export default app

import { Hono } from 'hono'
import { eq, and, gte, lte, like } from 'drizzle-orm'
import { coinCatalog, coinVarieties, type NewCoinCatalog, type NewCoinVariety } from '../db/schema'
import { NumistaApiClient, transformNumistaCoin } from '../services/numistaApi'

type Bindings = {
  DB: D1Database
  NUMISTA_API_KEY?: string
}

const catalogRoutes = new Hono<{ Bindings: Bindings }>()

// GET /api/catalog - List all catalog entries
catalogRoutes.get('/', async (c) => {
  const db = c.env.DB
  const { series, country, metal, yearStart, yearEnd, limit = '50', offset = '0' } = c.req.query()

  try {
    // Build query with Drizzle
    let query = `SELECT * FROM coin_catalog WHERE 1=1`
    const params: (string | number)[] = []

    if (series) {
      query += ` AND series LIKE ?`
      params.push(`%${series}%`)
    }
    if (country) {
      query += ` AND country = ?`
      params.push(country)
    }
    if (metal) {
      query += ` AND metal_type = ?`
      params.push(metal)
    }
    if (yearStart) {
      query += ` AND year_end >= ?`
      params.push(parseInt(yearStart))
    }
    if (yearEnd) {
      query += ` AND year_start <= ?`
      params.push(parseInt(yearEnd))
    }

    query += ` ORDER BY series, year_start LIMIT ? OFFSET ?`
    params.push(parseInt(limit as string), parseInt(offset as string))

    const result = await db.prepare(query).bind(...params).all()

    return c.json({
      coins: result.results,
      total: result.results?.length || 0,
    })
  } catch (error) {
    console.error('Error fetching catalog:', error)
    return c.json({ error: 'Failed to fetch catalog' }, 500)
  }
})

// GET /api/catalog/:id - Get single catalog entry with varieties
catalogRoutes.get('/:id', async (c) => {
  const db = c.env.DB
  const id = c.req.param('id')

  try {
    const coin = await db.prepare('SELECT * FROM coin_catalog WHERE id = ?').bind(id).first()

    if (!coin) {
      return c.json({ error: 'Coin not found' }, 404)
    }

    // Get varieties for this coin
    const varieties = await db.prepare(
      'SELECT * FROM coin_varieties WHERE catalog_id = ? ORDER BY year, mint_mark'
    ).bind(id).all()

    return c.json({
      ...coin,
      varieties: varieties.results || [],
    })
  } catch (error) {
    console.error('Error fetching coin:', error)
    return c.json({ error: 'Failed to fetch coin' }, 500)
  }
})

// GET /api/catalog/series/:seriesName - Get all coins in a series
catalogRoutes.get('/series/:seriesName', async (c) => {
  const db = c.env.DB
  const seriesName = c.req.param('seriesName')

  try {
    const coins = await db.prepare(
      'SELECT * FROM coin_catalog WHERE series LIKE ? ORDER BY year_start'
    ).bind(`%${seriesName}%`).all()

    return c.json({
      series: seriesName,
      coins: coins.results || [],
    })
  } catch (error) {
    console.error('Error fetching series:', error)
    return c.json({ error: 'Failed to fetch series' }, 500)
  }
})

// GET /api/catalog/:id/varieties - Get varieties for a catalog entry
catalogRoutes.get('/:id/varieties', async (c) => {
  const db = c.env.DB
  const id = c.req.param('id')
  const { keyDatesOnly } = c.req.query()

  try {
    let query = 'SELECT * FROM coin_varieties WHERE catalog_id = ?'
    const params: (string | number)[] = [id]

    if (keyDatesOnly === 'true') {
      query += ' AND is_key_date = 1'
    }

    query += ' ORDER BY year, mint_mark'

    const varieties = await db.prepare(query).bind(...params).all()

    return c.json({
      catalogId: id,
      varieties: varieties.results || [],
    })
  } catch (error) {
    console.error('Error fetching varieties:', error)
    return c.json({ error: 'Failed to fetch varieties' }, 500)
  }
})

// POST /api/catalog/sync/numista - Sync coin data from Numista
catalogRoutes.post('/sync/numista', async (c) => {
  const db = c.env.DB
  const apiKey = c.env.NUMISTA_API_KEY

  if (!apiKey) {
    return c.json({ error: 'Numista API key not configured' }, 500)
  }

  const { query, coinId } = await c.req.json<{ query?: string; coinId?: number }>()

  try {
    const client = new NumistaApiClient(apiKey)
    let coinsToSync: any[] = []

    if (coinId) {
      // Fetch single coin by ID
      const coin = await client.getCoinDetails(coinId)
      coinsToSync = [coin]
    } else if (query) {
      // Search for coins
      const result = await client.searchCoins(query)
      coinsToSync = result.coins
    } else {
      return c.json({ error: 'Provide either query or coinId' }, 400)
    }

    let synced = 0
    for (const coin of coinsToSync) {
      // Get full details for each coin
      const details = await client.getCoinDetails(coin.id)
      const transformed = transformNumistaCoin(details)

      // Upsert into catalog
      const id = `numista-${transformed.numistaId}`
      await db.prepare(`
        INSERT INTO coin_catalog (
          id, numista_id, title, country, issuer, coin_type, year_start, year_end,
          denomination, denomination_value, currency, composition, weight, diameter,
          thickness, fineness, metal_type, actual_silver_weight, actual_gold_weight,
          obverse_image_url, reverse_image_url, last_synced_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(numista_id) DO UPDATE SET
          title = excluded.title,
          composition = excluded.composition,
          weight = excluded.weight,
          diameter = excluded.diameter,
          thickness = excluded.thickness,
          fineness = excluded.fineness,
          actual_silver_weight = excluded.actual_silver_weight,
          actual_gold_weight = excluded.actual_gold_weight,
          obverse_image_url = excluded.obverse_image_url,
          reverse_image_url = excluded.reverse_image_url,
          last_synced_at = excluded.last_synced_at,
          updated_at = CURRENT_TIMESTAMP
      `).bind(
        id,
        transformed.numistaId,
        transformed.title,
        transformed.country,
        transformed.issuer,
        transformed.coinType,
        transformed.yearStart,
        transformed.yearEnd,
        transformed.denomination,
        transformed.denominationValue,
        transformed.currency,
        transformed.composition,
        transformed.weight,
        transformed.diameter,
        transformed.thickness,
        transformed.fineness,
        transformed.metalType,
        transformed.actualSilverWeight,
        transformed.actualGoldWeight,
        transformed.obverseImageUrl,
        transformed.reverseImageUrl,
        new Date().toISOString()
      ).run()

      // If coin has mintage data, sync varieties
      if (details.mintages && details.mintages.length > 0) {
        for (const mintage of details.mintages) {
          const varietyId = `${id}-${mintage.year}-${mintage.mint?.mark || 'P'}`
          await db.prepare(`
            INSERT INTO coin_varieties (
              id, catalog_id, year, mint_mark, mintage
            ) VALUES (?, ?, ?, ?, ?)
            ON CONFLICT(id) DO UPDATE SET
              mintage = excluded.mintage,
              updated_at = CURRENT_TIMESTAMP
          `).bind(
            varietyId,
            id,
            mintage.year,
            mintage.mint?.mark || null,
            mintage.mintage || null
          ).run()
        }
      }

      synced++
    }

    return c.json({
      success: true,
      synced,
      message: `Synced ${synced} coins from Numista`,
    })
  } catch (error) {
    console.error('Numista sync error:', error)
    return c.json({ error: 'Failed to sync from Numista', details: String(error) }, 500)
  }
})

// POST /api/catalog/sync/morgan - Sync Morgan Dollar data (preset)
catalogRoutes.post('/sync/morgan', async (c) => {
  const db = c.env.DB
  const apiKey = c.env.NUMISTA_API_KEY

  if (!apiKey) {
    return c.json({ error: 'Numista API key not configured' }, 500)
  }

  try {
    const client = new NumistaApiClient(apiKey)

    // Search for Morgan Dollars
    const result = await client.searchMorganDollars()

    // Find the main Morgan Dollar entry
    const morganCoin = result.coins.find(
      (c) => c.title.includes('Morgan') && c.title.includes('Dollar')
    )

    if (!morganCoin) {
      return c.json({ error: 'Morgan Dollar not found in Numista' }, 404)
    }

    // Get full details
    const details = await client.getCoinDetails(morganCoin.id)
    const transformed = transformNumistaCoin(details)

    // Add series name
    const id = `numista-${transformed.numistaId}`

    await db.prepare(`
      INSERT INTO coin_catalog (
        id, numista_id, title, country, issuer, coin_type, series, year_start, year_end,
        denomination, denomination_value, currency, composition, weight, diameter,
        thickness, fineness, metal_type, actual_silver_weight, actual_gold_weight,
        obverse_image_url, reverse_image_url, last_synced_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(numista_id) DO UPDATE SET
        title = excluded.title,
        series = excluded.series,
        composition = excluded.composition,
        weight = excluded.weight,
        last_synced_at = excluded.last_synced_at,
        updated_at = CURRENT_TIMESTAMP
    `).bind(
      id,
      transformed.numistaId,
      transformed.title,
      transformed.country,
      transformed.issuer,
      transformed.coinType,
      'Morgan Dollar',
      transformed.yearStart || 1878,
      transformed.yearEnd || 1921,
      transformed.denomination,
      transformed.denominationValue,
      transformed.currency,
      transformed.composition,
      transformed.weight,
      transformed.diameter,
      transformed.thickness,
      transformed.fineness,
      transformed.metalType,
      transformed.actualSilverWeight,
      transformed.actualGoldWeight,
      transformed.obverseImageUrl,
      transformed.reverseImageUrl,
      new Date().toISOString()
    ).run()

    return c.json({
      success: true,
      message: 'Morgan Dollar synced from Numista',
      coin: {
        id,
        title: transformed.title,
        numistaId: transformed.numistaId,
        weight: transformed.weight,
        fineness: transformed.fineness,
        asw: transformed.actualSilverWeight,
      },
    })
  } catch (error) {
    console.error('Morgan sync error:', error)
    return c.json({ error: 'Failed to sync Morgan Dollar', details: String(error) }, 500)
  }
})

// GET /api/catalog/stats - Get catalog statistics
catalogRoutes.get('/stats/summary', async (c) => {
  const db = c.env.DB

  try {
    const totalCoins = await db.prepare('SELECT COUNT(*) as count FROM coin_catalog').first()
    const totalVarieties = await db.prepare('SELECT COUNT(*) as count FROM coin_varieties').first()
    const byMetal = await db.prepare(
      'SELECT metal_type, COUNT(*) as count FROM coin_catalog GROUP BY metal_type'
    ).all()
    const bySeries = await db.prepare(
      'SELECT series, COUNT(*) as count FROM coin_catalog WHERE series IS NOT NULL GROUP BY series'
    ).all()

    return c.json({
      totalCoins: totalCoins?.count || 0,
      totalVarieties: totalVarieties?.count || 0,
      byMetal: byMetal.results || [],
      bySeries: bySeries.results || [],
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return c.json({ error: 'Failed to fetch stats' }, 500)
  }
})

export { catalogRoutes }

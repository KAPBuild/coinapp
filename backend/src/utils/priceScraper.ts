import { createDb, schema } from '../db'

interface CoinPriceData {
  series: string
  year: number
  mintMark: string | null
  grade: string
  variety: string | null
  price: number
}

// Morgan Dollar years and mint marks
const MORGAN_YEARS = [
  // Philadelphia (no mint mark)
  { year: 1878, mints: ['', 'CC', 'S'] },
  { year: 1879, mints: ['', 'CC', 'O', 'S'] },
  { year: 1880, mints: ['', 'CC', 'O', 'S'] },
  { year: 1881, mints: ['', 'CC', 'O', 'S'] },
  { year: 1882, mints: ['', 'CC', 'O', 'S'] },
  { year: 1883, mints: ['', 'CC', 'O', 'S'] },
  { year: 1884, mints: ['', 'CC', 'O', 'S'] },
  { year: 1885, mints: ['', 'CC', 'O', 'S'] },
  { year: 1886, mints: ['', 'O', 'S'] },
  { year: 1887, mints: ['', 'O', 'S'] },
  { year: 1888, mints: ['', 'O', 'S'] },
  { year: 1889, mints: ['', 'CC', 'O', 'S'] },
  { year: 1890, mints: ['', 'CC', 'O', 'S'] },
  { year: 1891, mints: ['', 'CC', 'O', 'S'] },
  { year: 1892, mints: ['', 'CC', 'O', 'S'] },
  { year: 1893, mints: ['', 'CC', 'O', 'S'] },
  { year: 1894, mints: ['', 'O', 'S'] },
  { year: 1895, mints: ['', 'O', 'S'] },
  { year: 1896, mints: ['', 'O', 'S'] },
  { year: 1897, mints: ['', 'O', 'S'] },
  { year: 1898, mints: ['', 'O', 'S'] },
  { year: 1899, mints: ['', 'O', 'S'] },
  { year: 1900, mints: ['', 'O', 'S'] },
  { year: 1901, mints: ['', 'O', 'S'] },
  { year: 1902, mints: ['', 'O', 'S'] },
  { year: 1903, mints: ['', 'O', 'S'] },
  { year: 1904, mints: ['', 'O', 'S'] },
  { year: 1921, mints: ['', 'D', 'S'] },
]

const GRADES = [
  'G-4', 'G-6', 'VG-8', 'VG-10', 'F-12', 'F-15', 'VF-20', 'VF-25', 'VF-30', 'VF-35',
  'EF-40', 'EF-45', 'AU-50', 'AU-53', 'AU-55', 'AU-58',
  'MS-60', 'MS-61', 'MS-62', 'MS-63', 'MS-64', 'MS-65', 'MS-66', 'MS-67', 'MS-68', 'MS-69', 'MS-70'
]

/**
 * Scrape PCGS prices for Morgan Dollars
 * Note: This is a placeholder - actual implementation would need to:
 * 1. Fetch from PCGS website or API
 * 2. Parse the HTML/JSON response
 * 3. Extract price data
 *
 * IMPORTANT: Check PCGS Terms of Service before scraping!
 * Consider using their official API if available.
 */
export async function scrapePCGSPrices(db: ReturnType<typeof createDb>): Promise<number> {
  console.log('Starting PCGS price scrape...')

  const scrapeId = crypto.randomUUID()
  const scrapeDate = new Date().toISOString()

  // Create scrape log entry
  await db.insert(schema.priceScrapeLog).values({
    id: scrapeId,
    priceSource: 'PCGS',
    scrapeDate,
    status: 'running',
  })

  try {
    let coinsUpdated = 0

    // TODO: Implement actual PCGS scraping
    // For now, this is a placeholder that would need to be implemented

    // Example of what the scraping logic would look like:
    for (const yearData of MORGAN_YEARS) {
      for (const mint of yearData.mints) {
        for (const grade of GRADES) {
          // Here you would:
          // 1. Construct the PCGS URL for this specific coin
          // 2. Fetch the page
          // 3. Parse the price
          // 4. Insert/update the price in the database

          // Example placeholder:
          // const price = await fetchPCGSPrice('Morgan Dollar', yearData.year, mint, grade)
          // if (price) {
          //   await upsertCoinPrice(db, {
          //     series: 'Morgan Dollar',
          //     year: yearData.year,
          //     mintMark: mint || null,
          //     grade,
          //     variety: null,
          //     price,
          //     priceSource: 'PCGS',
          //   })
          //   coinsUpdated++
          // }
        }
      }
    }

    // Update scrape log as successful
    await db.update(schema.priceScrapeLog)
      .set({
        status: 'success',
        coinsUpdated,
      })
      .where(eq(schema.priceScrapeLog.id, scrapeId))

    console.log(`PCGS scrape completed. Updated ${coinsUpdated} prices.`)
    return coinsUpdated

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'

    // Update scrape log as failed
    await db.update(schema.priceScrapeLog)
      .set({
        status: 'failed',
        errorMessage,
      })
      .where(eq(schema.priceScrapeLog.id, scrapeId))

    console.error('PCGS scrape failed:', errorMessage)
    throw error
  }
}

/**
 * Scrape NGC prices for Morgan Dollars
 * Similar structure to PCGS scraper
 */
export async function scrapeNGCPrices(db: ReturnType<typeof createDb>): Promise<number> {
  console.log('Starting NGC price scrape...')

  const scrapeId = crypto.randomUUID()
  const scrapeDate = new Date().toISOString()

  await db.insert(schema.priceScrapeLog).values({
    id: scrapeId,
    priceSource: 'NGC',
    scrapeDate,
    status: 'running',
  })

  try {
    let coinsUpdated = 0

    // TODO: Implement actual NGC scraping

    await db.update(schema.priceScrapeLog)
      .set({
        status: 'success',
        coinsUpdated,
      })
      .where(eq(schema.priceScrapeLog.id, scrapeId))

    console.log(`NGC scrape completed. Updated ${coinsUpdated} prices.`)
    return coinsUpdated

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'

    await db.update(schema.priceScrapeLog)
      .set({
        status: 'failed',
        errorMessage,
      })
      .where(eq(schema.priceScrapeLog.id, scrapeId))

    console.error('NGC scrape failed:', errorMessage)
    throw error
  }
}

/**
 * Insert or update a coin price
 */
async function upsertCoinPrice(
  db: ReturnType<typeof createDb>,
  data: CoinPriceData & { priceSource: 'PCGS' | 'NGC' }
) {
  const { series, year, mintMark, grade, variety, price, priceSource } = data

  // Check if price already exists
  const existing = await db
    .select()
    .from(schema.coinPrices)
    .where(
      and(
        eq(schema.coinPrices.series, series),
        eq(schema.coinPrices.year, year),
        mintMark ? eq(schema.coinPrices.mintMark, mintMark) : isNull(schema.coinPrices.mintMark),
        eq(schema.coinPrices.grade, grade),
        eq(schema.coinPrices.priceSource, priceSource),
        variety ? eq(schema.coinPrices.variety, variety) : isNull(schema.coinPrices.variety)
      )
    )
    .limit(1)

  const now = new Date().toISOString()

  if (existing.length > 0) {
    // Update existing price
    await db
      .update(schema.coinPrices)
      .set({
        price,
        lastUpdated: now,
      })
      .where(eq(schema.coinPrices.id, existing[0].id))
  } else {
    // Insert new price
    await db.insert(schema.coinPrices).values({
      id: crypto.randomUUID(),
      series,
      year,
      mintMark,
      grade,
      variety,
      priceSource,
      price,
      lastUpdated: now,
    })
  }
}

// Need to import these from drizzle-orm
import { eq, and, isNull } from 'drizzle-orm'

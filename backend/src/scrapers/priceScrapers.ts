import * as cheerio from 'cheerio'

interface CoinPrice {
  coin: string
  source: 'PCGS' | 'NGC'
  prices: {
    grade: string
    price: number
  }[]
  lastUpdated: string
}

// Cache prices for 1 hour
const priceCache: { [key: string]: { data: CoinPrice; timestamp: number } } = {}
const CACHE_DURATION = 60 * 60 * 1000 // 1 hour

export async function scrapePCGSPrices(coinName: string): Promise<CoinPrice | null> {
  const cacheKey = `pcgs_${coinName.toLowerCase()}`

  // Check cache
  if (priceCache[cacheKey] && Date.now() - priceCache[cacheKey].timestamp < CACHE_DURATION) {
    return priceCache[cacheKey].data
  }

  try {
    // PCGS Morgan Dollar URL as example
    const url = 'https://www.pcgs.com/prices/detail/morgan-dollar/744/most-active'

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    })

    if (!response.ok) {
      console.error(`PCGS scraping failed: ${response.statusText}`)
      return null
    }

    const html = await response.text()
    const $ = cheerio.load(html)

    const prices: { grade: string; price: number }[] = []

    // PCGS price table structure (adjust selectors based on actual page)
    $('table tbody tr').each((_, element) => {
      const row = $(element)
      const grade = row.find('td').eq(0).text().trim()
      const priceText = row.find('td').eq(1).text().trim()
      const price = parseFloat(priceText.replace(/[$,]/g, ''))

      if (grade && !isNaN(price)) {
        prices.push({ grade, price })
      }
    })

    const result: CoinPrice = {
      coin: coinName,
      source: 'PCGS',
      prices,
      lastUpdated: new Date().toISOString(),
    }

    // Cache the result
    priceCache[cacheKey] = { data: result, timestamp: Date.now() }
    return result
  } catch (error) {
    console.error('Error scraping PCGS:', error)
    return null
  }
}

export async function scrapeNGCPrices(coinName: string): Promise<CoinPrice | null> {
  const cacheKey = `ngc_${coinName.toLowerCase()}`

  // Check cache
  if (priceCache[cacheKey] && Date.now() - priceCache[cacheKey].timestamp < CACHE_DURATION) {
    return priceCache[cacheKey].data
  }

  try {
    // NGC Dollars URL as example
    const url = 'https://www.ngccoin.com/price-guide/united-states/dollars/49/'

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    })

    if (!response.ok) {
      console.error(`NGC scraping failed: ${response.statusText}`)
      return null
    }

    const html = await response.text()
    const $ = cheerio.load(html)

    const prices: { grade: string; price: number }[] = []

    // NGC price table structure (adjust selectors based on actual page)
    $('table tbody tr').each((_, element) => {
      const row = $(element)
      const grade = row.find('td').eq(0).text().trim()
      const priceText = row.find('td').eq(1).text().trim()
      const price = parseFloat(priceText.replace(/[$,]/g, ''))

      if (grade && !isNaN(price)) {
        prices.push({ grade, price })
      }
    })

    const result: CoinPrice = {
      coin: coinName,
      source: 'NGC',
      prices,
      lastUpdated: new Date().toISOString(),
    }

    // Cache the result
    priceCache[cacheKey] = { data: result, timestamp: Date.now() }
    return result
  } catch (error) {
    console.error('Error scraping NGC:', error)
    return null
  }
}

// Get average price for a given grade from both sources
export async function getCoinPrice(coinName: string, grade: string) {
  const [pcgsData, ngcData] = await Promise.all([
    scrapePCGSPrices(coinName),
    scrapeNGCPrices(coinName),
  ])

  const prices: number[] = []

  if (pcgsData) {
    const priceEntry = pcgsData.prices.find(p => p.grade.toLowerCase() === grade.toLowerCase())
    if (priceEntry) prices.push(priceEntry.price)
  }

  if (ngcData) {
    const priceEntry = ngcData.prices.find(p => p.grade.toLowerCase() === grade.toLowerCase())
    if (priceEntry) prices.push(priceEntry.price)
  }

  if (prices.length === 0) return null

  const average = prices.reduce((a, b) => a + b, 0) / prices.length
  return {
    average,
    pcgsPrice: pcgsData?.prices.find(p => p.grade.toLowerCase() === grade.toLowerCase())?.price,
    ngcPrice: ngcData?.prices.find(p => p.grade.toLowerCase() === grade.toLowerCase())?.price,
    sources: [pcgsData, ngcData].filter(Boolean),
  }
}

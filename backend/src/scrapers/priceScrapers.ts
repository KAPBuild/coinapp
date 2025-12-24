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

interface MorganPriceData {
  date: string
  year: string
  mintMark: string
  pcgs?: {
    price: number
    grades: { grade: string; price: number }[]
  }
  ngc?: {
    price: number
    grades: { grade: string; price: number }[]
  }
}

// Cache prices for 30 days
const priceCache: { [key: string]: { data: any; timestamp: number } } = {}
const CACHE_DURATION = 30 * 24 * 60 * 60 * 1000 // 30 days

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

// Scrape all Morgan dollar prices from PCGS
export async function getAllMorganPricesPCGS(): Promise<MorganPriceData[] | null> {
  const cacheKey = 'pcgs_all_morgans'

  // Check cache
  if (priceCache[cacheKey] && Date.now() - priceCache[cacheKey].timestamp < CACHE_DURATION) {
    return priceCache[cacheKey].data
  }

  try {
    const url = 'https://www.pcgs.com/prices/detail/morgan-dollar/744/most-active'

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    })

    if (!response.ok) return null

    const html = await response.text()
    const $ = cheerio.load(html)

    const morgans: MorganPriceData[] = []

    // Parse PCGS Morgan dollar prices table
    $('table tbody tr').each((_, element) => {
      const row = $(element)
      const cells = row.find('td')

      if (cells.length >= 3) {
        const dateText = cells.eq(0).text().trim()
        const priceText = cells.eq(1).text().trim()
        const price = parseFloat(priceText.replace(/[$,]/g, ''))

        // Extract year and mint mark from date column (e.g., "1921", "1921-S", "1921-O")
        const yearMatch = dateText.match(/\d{4}(-[A-Z])?/)
        if (yearMatch && !isNaN(price)) {
          const [year, mintMark = ''] = yearMatch[0].split('-')
          morgans.push({
            date: dateText,
            year,
            mintMark: mintMark || 'P',
            pcgs: {
              price,
              grades: [], // Could be expanded to show different grades
            },
          })
        }
      }
    })

    const result = morgans.slice(0, 50) // Limit to top 50 most active

    // Cache the result
    priceCache[cacheKey] = { data: result, timestamp: Date.now() }
    return result
  } catch (error) {
    console.error('Error scraping all PCGS Morgans:', error)
    return null
  }
}

// Scrape all Morgan dollar prices from NGC
export async function getAllMorganPricesNGC(): Promise<MorganPriceData[] | null> {
  const cacheKey = 'ngc_all_morgans'

  // Check cache
  if (priceCache[cacheKey] && Date.now() - priceCache[cacheKey].timestamp < CACHE_DURATION) {
    return priceCache[cacheKey].data
  }

  try {
    const url = 'https://www.ngccoin.com/price-guide/united-states/dollars/49/'

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    })

    if (!response.ok) return null

    const html = await response.text()
    const $ = cheerio.load(html)

    const morgans: MorganPriceData[] = []

    // Parse NGC Morgan dollar prices table
    $('table tbody tr').each((_, element) => {
      const row = $(element)
      const cells = row.find('td')

      if (cells.length >= 3) {
        const dateText = cells.eq(0).text().trim()
        const priceText = cells.eq(1).text().trim()
        const price = parseFloat(priceText.replace(/[$,]/g, ''))

        // Extract year and mint mark
        const yearMatch = dateText.match(/\d{4}(-[A-Z])?/)
        if (yearMatch && !isNaN(price)) {
          const [year, mintMark = ''] = yearMatch[0].split('-')
          morgans.push({
            date: dateText,
            year,
            mintMark: mintMark || 'P',
            ngc: {
              price,
              grades: [],
            },
          })
        }
      }
    })

    const result = morgans.slice(0, 50)

    // Cache the result
    priceCache[cacheKey] = { data: result, timestamp: Date.now() }
    return result
  } catch (error) {
    console.error('Error scraping all NGC Morgans:', error)
    return null
  }
}

// Get combined Morgan prices from both sources
export async function getAllMorganPrices(forceRefresh = false) {
  if (forceRefresh) {
    delete priceCache['pcgs_all_morgans']
    delete priceCache['ngc_all_morgans']
  }

  const [pcgsData, ngcData] = await Promise.all([
    getAllMorganPricesPCGS(),
    getAllMorganPricesNGC(),
  ])

  // Merge results, preferring PCGS data as primary
  const morganMap = new Map<string, MorganPriceData>()

  pcgsData?.forEach(morgan => {
    morganMap.set(`${morgan.year}-${morgan.mintMark}`, morgan)
  })

  ngcData?.forEach(morgan => {
    const key = `${morgan.year}-${morgan.mintMark}`
    if (morganMap.has(key)) {
      const existing = morganMap.get(key)!
      existing.ngc = morgan.ngc
    } else {
      morganMap.set(key, morgan)
    }
  })

  return Array.from(morganMap.values()).sort((a, b) => {
    const yearDiff = parseInt(b.year) - parseInt(a.year)
    if (yearDiff !== 0) return yearDiff
    return a.mintMark.localeCompare(b.mintMark)
  })
}

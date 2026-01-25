/**
 * Numista API Integration
 * Documentation: https://en.numista.com/api/doc/index.php
 *
 * Numista provides a comprehensive coin database with:
 * - Coin specifications (weight, diameter, composition)
 * - Mintage figures
 * - Images
 * - Metal content
 */

const NUMISTA_API_BASE = 'https://api.numista.com/api/v3'

export interface NumistaCoin {
  id: number
  title: string
  issuer: {
    code: string
    name: string
  }
  min_year?: number
  max_year?: number
  type?: string
  value?: {
    text: string
    numeric_value?: number
    currency?: {
      id: number
      name: string
    }
  }
  shape?: string
  composition?: {
    text: string
  }
  weight?: number
  size?: number
  thickness?: number
  obverse?: {
    thumbnail?: string
    picture?: string
    description?: string
  }
  reverse?: {
    thumbnail?: string
    picture?: string
    description?: string
  }
}

export interface NumistaSearchResult {
  count: number
  coins: NumistaCoin[]
}

export interface NumistaCoinDetails extends NumistaCoin {
  ruler?: {
    name: string
  }
  mints?: Array<{
    id: number
    name: string
    mark?: string
  }>
  mintages?: Array<{
    year: number
    mint?: {
      id: number
      name: string
      mark?: string
    }
    mintage?: number
    comment?: string
  }>
}

export class NumistaApiClient {
  private apiKey: string

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  private async request<T>(endpoint: string, params: Record<string, string | number> = {}): Promise<T> {
    const url = new URL(`${NUMISTA_API_BASE}${endpoint}`)
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, String(value))
    })

    const response = await fetch(url.toString(), {
      headers: {
        'Numista-API-Key': this.apiKey,
        'Accept': 'application/json',
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Numista API error (${response.status}): ${errorText}`)
    }

    return response.json()
  }

  /**
   * Search for coins by query
   */
  async searchCoins(query: string, page = 1, count = 50): Promise<NumistaSearchResult> {
    return this.request<NumistaSearchResult>('/coins', {
      q: query,
      page,
      count,
      lang: 'en',
    })
  }

  /**
   * Search for coins by issuer (country)
   */
  async searchByIssuer(issuerCode: string, page = 1, count = 50): Promise<NumistaSearchResult> {
    return this.request<NumistaSearchResult>('/coins', {
      issuer: issuerCode,
      page,
      count,
      lang: 'en',
    })
  }

  /**
   * Get detailed coin information by Numista ID
   */
  async getCoinDetails(coinId: number): Promise<NumistaCoinDetails> {
    return this.request<NumistaCoinDetails>(`/coins/${coinId}`, {
      lang: 'en',
    })
  }

  /**
   * Search for US Morgan Dollars specifically
   */
  async searchMorganDollars(): Promise<NumistaSearchResult> {
    return this.searchCoins('Morgan Dollar United States', 1, 100)
  }

  /**
   * Search for US Peace Dollars
   */
  async searchPeaceDollars(): Promise<NumistaSearchResult> {
    return this.searchCoins('Peace Dollar United States', 1, 100)
  }

  /**
   * Search for Walking Liberty Half Dollars
   */
  async searchWalkingLibertyHalves(): Promise<NumistaSearchResult> {
    return this.searchCoins('Walking Liberty Half Dollar', 1, 100)
  }
}

/**
 * Parse composition string to extract fineness
 * e.g., "Silver (.900)" -> 0.900
 */
export function parseFineness(composition?: string): number | null {
  if (!composition) return null

  // Look for patterns like (.900), (90%), .900, 90%
  const match = composition.match(/\.?(\d{2,3})%?|\(\.?(\d{2,3})%?\)/)
  if (match) {
    const value = match[1] || match[2]
    const num = parseInt(value, 10)
    // If it's like 900, convert to 0.900
    return num > 1 ? num / 1000 : num / 100
  }
  return null
}

/**
 * Determine metal type from composition
 */
export function parseMetalType(composition?: string): string | null {
  if (!composition) return null

  const comp = composition.toLowerCase()
  if (comp.includes('gold')) return 'gold'
  if (comp.includes('silver')) return 'silver'
  if (comp.includes('platinum')) return 'platinum'
  if (comp.includes('copper')) return 'copper'
  if (comp.includes('nickel')) return 'nickel'
  if (comp.includes('clad')) return 'clad'
  return null
}

/**
 * Calculate actual silver/gold weight in troy oz
 */
export function calculateMetalWeight(
  weightGrams: number | undefined,
  fineness: number | null,
  metalType: string | null
): { asw: number | null; agw: number | null } {
  if (!weightGrams || !fineness) {
    return { asw: null, agw: null }
  }

  const GRAMS_PER_TROY_OZ = 31.1035

  const metalWeight = (weightGrams * fineness) / GRAMS_PER_TROY_OZ

  if (metalType === 'silver') {
    return { asw: Math.round(metalWeight * 100000) / 100000, agw: null }
  }
  if (metalType === 'gold') {
    return { asw: null, agw: Math.round(metalWeight * 100000) / 100000 }
  }

  return { asw: null, agw: null }
}

/**
 * Transform Numista coin data to our catalog format
 */
export function transformNumistaCoin(coin: NumistaCoinDetails): {
  numistaId: number
  title: string
  country: string
  issuer: string | null
  coinType: string | null
  yearStart: number | null
  yearEnd: number | null
  denomination: string | null
  denominationValue: number | null
  currency: string | null
  composition: string | null
  weight: number | null
  diameter: number | null
  thickness: number | null
  fineness: number | null
  metalType: string | null
  actualSilverWeight: number | null
  actualGoldWeight: number | null
  obverseImageUrl: string | null
  reverseImageUrl: string | null
} {
  const composition = coin.composition?.text || null
  const fineness = parseFineness(composition)
  const metalType = parseMetalType(composition)
  const { asw, agw } = calculateMetalWeight(coin.weight, fineness, metalType)

  return {
    numistaId: coin.id,
    title: coin.title,
    country: coin.issuer?.name || 'Unknown',
    issuer: coin.issuer?.code || null,
    coinType: coin.type || null,
    yearStart: coin.min_year || null,
    yearEnd: coin.max_year || null,
    denomination: coin.value?.text || null,
    denominationValue: coin.value?.numeric_value || null,
    currency: coin.value?.currency?.name || null,
    composition,
    weight: coin.weight || null,
    diameter: coin.size || null,
    thickness: coin.thickness || null,
    fineness,
    metalType,
    actualSilverWeight: asw,
    actualGoldWeight: agw,
    obverseImageUrl: coin.obverse?.picture || coin.obverse?.thumbnail || null,
    reverseImageUrl: coin.reverse?.picture || coin.reverse?.thumbnail || null,
  }
}

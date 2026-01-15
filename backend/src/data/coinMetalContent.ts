/**
 * Coin Metal Content Data
 * ASW = Actual Silver Weight (troy oz)
 * AGW = Actual Gold Weight (troy oz)
 *
 * Sources: NGC, PCGS, US Mint specifications
 */

export interface CoinMetalContent {
  id: string
  name: string
  series: string
  years: string
  denomination: string
  composition: string
  weightGrams: number
  diameter: number // mm
  fineness: number // 0.900 = 90% silver
  asw: number // Actual Silver Weight (troy oz)
  agw?: number // Actual Gold Weight (troy oz) - for gold coins
  metalType: 'silver' | 'gold' | 'platinum' | 'copper-nickel'
  notes?: string
}

// US Silver Coins - from NGC melt values page
export const US_SILVER_COINS: CoinMetalContent[] = [
  // Nickels
  {
    id: 'jefferson-wartime',
    name: 'Jefferson Nickel (Wartime)',
    series: 'Jefferson Nickel',
    years: '1942-1945',
    denomination: '$0.05',
    composition: '56% Copper, 35% Silver, 9% Manganese',
    weightGrams: 5.0,
    diameter: 21.2,
    fineness: 0.35,
    asw: 0.05626,
    metalType: 'silver',
    notes: 'Large mint mark above Monticello'
  },

  // Dimes
  {
    id: 'barber-dime',
    name: 'Barber Dime',
    series: 'Barber Dime',
    years: '1892-1916',
    denomination: '$0.10',
    composition: '90% Silver, 10% Copper',
    weightGrams: 2.5,
    diameter: 17.9,
    fineness: 0.9,
    asw: 0.07234,
    metalType: 'silver'
  },
  {
    id: 'mercury-dime',
    name: 'Mercury Dime',
    series: 'Mercury Dime',
    years: '1916-1945',
    denomination: '$0.10',
    composition: '90% Silver, 10% Copper',
    weightGrams: 2.5,
    diameter: 17.9,
    fineness: 0.9,
    asw: 0.07234,
    metalType: 'silver'
  },
  {
    id: 'roosevelt-dime-silver',
    name: 'Roosevelt Dime (Silver)',
    series: 'Roosevelt Dime',
    years: '1946-1964',
    denomination: '$0.10',
    composition: '90% Silver, 10% Copper',
    weightGrams: 2.5,
    diameter: 17.9,
    fineness: 0.9,
    asw: 0.07234,
    metalType: 'silver'
  },

  // Quarters
  {
    id: 'barber-quarter',
    name: 'Barber Quarter',
    series: 'Barber Quarter',
    years: '1892-1916',
    denomination: '$0.25',
    composition: '90% Silver, 10% Copper',
    weightGrams: 6.25,
    diameter: 24.3,
    fineness: 0.9,
    asw: 0.18084,
    metalType: 'silver'
  },
  {
    id: 'standing-liberty-quarter',
    name: 'Standing Liberty Quarter',
    series: 'Standing Liberty Quarter',
    years: '1916-1930',
    denomination: '$0.25',
    composition: '90% Silver, 10% Copper',
    weightGrams: 6.25,
    diameter: 24.3,
    fineness: 0.9,
    asw: 0.18084,
    metalType: 'silver'
  },
  {
    id: 'washington-quarter-silver',
    name: 'Washington Quarter (Silver)',
    series: 'Washington Quarter',
    years: '1932-1964',
    denomination: '$0.25',
    composition: '90% Silver, 10% Copper',
    weightGrams: 6.25,
    diameter: 24.3,
    fineness: 0.9,
    asw: 0.18084,
    metalType: 'silver'
  },

  // Half Dollars
  {
    id: 'barber-half',
    name: 'Barber Half Dollar',
    series: 'Barber Half Dollar',
    years: '1892-1915',
    denomination: '$0.50',
    composition: '90% Silver, 10% Copper',
    weightGrams: 12.5,
    diameter: 30.6,
    fineness: 0.9,
    asw: 0.36169,
    metalType: 'silver'
  },
  {
    id: 'walking-liberty-half',
    name: 'Walking Liberty Half Dollar',
    series: 'Walking Liberty Half Dollar',
    years: '1916-1947',
    denomination: '$0.50',
    composition: '90% Silver, 10% Copper',
    weightGrams: 12.5,
    diameter: 30.6,
    fineness: 0.9,
    asw: 0.36169,
    metalType: 'silver'
  },
  {
    id: 'franklin-half',
    name: 'Franklin Half Dollar',
    series: 'Franklin Half Dollar',
    years: '1948-1963',
    denomination: '$0.50',
    composition: '90% Silver, 10% Copper',
    weightGrams: 12.5,
    diameter: 30.6,
    fineness: 0.9,
    asw: 0.36169,
    metalType: 'silver'
  },
  {
    id: 'kennedy-half-1964',
    name: 'Kennedy Half Dollar (1964)',
    series: 'Kennedy Half Dollar',
    years: '1964',
    denomination: '$0.50',
    composition: '90% Silver, 10% Copper',
    weightGrams: 12.5,
    diameter: 30.6,
    fineness: 0.9,
    asw: 0.36169,
    metalType: 'silver'
  },
  {
    id: 'kennedy-half-40',
    name: 'Kennedy Half Dollar (40% Silver)',
    series: 'Kennedy Half Dollar',
    years: '1965-1970',
    denomination: '$0.50',
    composition: '40% Silver, 60% Copper',
    weightGrams: 11.5,
    diameter: 30.6,
    fineness: 0.4,
    asw: 0.1479,
    metalType: 'silver'
  },

  // Dollars
  {
    id: 'morgan-dollar',
    name: 'Morgan Dollar',
    series: 'Morgan Dollar',
    years: '1878-1921',
    denomination: '$1.00',
    composition: '90% Silver, 10% Copper',
    weightGrams: 26.73,
    diameter: 38.1,
    fineness: 0.9,
    asw: 0.77344,
    metalType: 'silver'
  },
  {
    id: 'peace-dollar',
    name: 'Peace Dollar',
    series: 'Peace Dollar',
    years: '1921-1935',
    denomination: '$1.00',
    composition: '90% Silver, 10% Copper',
    weightGrams: 26.73,
    diameter: 38.1,
    fineness: 0.9,
    asw: 0.77344,
    metalType: 'silver'
  },
  {
    id: 'eisenhower-silver',
    name: 'Eisenhower Dollar (Silver)',
    series: 'Eisenhower Dollar',
    years: '1971-1976',
    denomination: '$1.00',
    composition: '40% Silver, 60% Copper',
    weightGrams: 24.59,
    diameter: 38.1,
    fineness: 0.4,
    asw: 0.3161,
    metalType: 'silver',
    notes: 'Collector versions only'
  },

  // Bullion
  {
    id: 'american-silver-eagle',
    name: 'American Silver Eagle',
    series: 'American Silver Eagle',
    years: '1986-Present',
    denomination: '$1.00',
    composition: '99.9% Silver',
    weightGrams: 31.103,
    diameter: 40.6,
    fineness: 0.999,
    asw: 1.0,
    metalType: 'silver'
  },
  {
    id: 'atb-5oz',
    name: 'America the Beautiful 5 oz',
    series: 'America the Beautiful',
    years: '2010-2021',
    denomination: '$0.25',
    composition: '99.9% Silver',
    weightGrams: 155.517,
    diameter: 76.2,
    fineness: 0.999,
    asw: 5.0,
    metalType: 'silver'
  },
]

// US Gold Coins
export const US_GOLD_COINS: CoinMetalContent[] = [
  {
    id: 'gold-eagle-1oz',
    name: 'American Gold Eagle (1 oz)',
    series: 'American Gold Eagle',
    years: '1986-Present',
    denomination: '$50',
    composition: '91.67% Gold, 3% Silver, 5.33% Copper',
    weightGrams: 33.931,
    diameter: 32.7,
    fineness: 0.9167,
    asw: 0,
    agw: 1.0,
    metalType: 'gold'
  },
  {
    id: 'gold-eagle-half',
    name: 'American Gold Eagle (1/2 oz)',
    series: 'American Gold Eagle',
    years: '1986-Present',
    denomination: '$25',
    composition: '91.67% Gold, 3% Silver, 5.33% Copper',
    weightGrams: 16.966,
    diameter: 27.0,
    fineness: 0.9167,
    asw: 0,
    agw: 0.5,
    metalType: 'gold'
  },
  {
    id: 'gold-eagle-quarter',
    name: 'American Gold Eagle (1/4 oz)',
    series: 'American Gold Eagle',
    years: '1986-Present',
    denomination: '$10',
    composition: '91.67% Gold, 3% Silver, 5.33% Copper',
    weightGrams: 8.483,
    diameter: 22.0,
    fineness: 0.9167,
    asw: 0,
    agw: 0.25,
    metalType: 'gold'
  },
  {
    id: 'gold-eagle-tenth',
    name: 'American Gold Eagle (1/10 oz)',
    series: 'American Gold Eagle',
    years: '1986-Present',
    denomination: '$5',
    composition: '91.67% Gold, 3% Silver, 5.33% Copper',
    weightGrams: 3.393,
    diameter: 16.5,
    fineness: 0.9167,
    asw: 0,
    agw: 0.1,
    metalType: 'gold'
  },
  {
    id: 'buffalo-gold',
    name: 'American Buffalo (1 oz)',
    series: 'American Buffalo',
    years: '2006-Present',
    denomination: '$50',
    composition: '99.99% Gold',
    weightGrams: 31.108,
    diameter: 32.7,
    fineness: 0.9999,
    asw: 0,
    agw: 1.0,
    metalType: 'gold'
  },
]

// Helper to get all coins
export function getAllCoins(): CoinMetalContent[] {
  return [...US_SILVER_COINS, ...US_GOLD_COINS]
}

// Helper to get coin by ID
export function getCoinById(id: string): CoinMetalContent | undefined {
  return getAllCoins().find(coin => coin.id === id)
}

// Helper to calculate melt value
export function calculateMeltValue(
  coin: CoinMetalContent,
  spotPrices: { gold: number; silver: number; platinum: number }
): number {
  if (coin.metalType === 'silver') {
    return coin.asw * spotPrices.silver
  } else if (coin.metalType === 'gold' && coin.agw) {
    return coin.agw * spotPrices.gold
  } else if (coin.metalType === 'platinum') {
    // Add platinum coins later if needed
    return 0
  }
  return 0
}

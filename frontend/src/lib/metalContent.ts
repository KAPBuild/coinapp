// Precious metal reference data for common coins
// Helps auto-populate weight, purity, and precious metal content

export interface MetalSpec {
  weight: number // in grams
  purityPercent: number // 0-100
  metalType: string // 'Silver', 'Gold', 'Mixed', etc.
  silverContent?: number // in troy ounces
  goldContent?: number // in troy ounces
}

// Key for lookup: "year-denomination-series" or just "series" as fallback
export const metalDatabase: Record<string, MetalSpec> = {
  // Morgan Dollars (1878-1921)
  'Morgan Dollar': {
    weight: 26.73,
    purityPercent: 90,
    metalType: 'Silver',
    silverContent: 0.7736, // troy ounces of pure silver
  },

  // Peace Dollars (1921-1923, 1925-1926, 1928-1932, 1934-1935)
  'Peace Dollar': {
    weight: 26.73,
    purityPercent: 90,
    metalType: 'Silver',
    silverContent: 0.7736,
  },

  // Walking Liberty Half Dollar (1916-1947)
  'Walking Liberty': {
    weight: 12.5,
    purityPercent: 90,
    metalType: 'Silver',
    silverContent: 0.3617,
  },

  // Standing Liberty Quarter (1916-1930)
  'Standing Liberty Quarter': {
    weight: 6.25,
    purityPercent: 90,
    metalType: 'Silver',
    silverContent: 0.18084,
  },

  // Barber Quarter (1892-1916)
  'Barber Quarter': {
    weight: 6.25,
    purityPercent: 90,
    metalType: 'Silver',
    silverContent: 0.18084,
  },

  // Seated Liberty Quarter (1838-1891)
  'Seated Liberty Quarter': {
    weight: 6.25,
    purityPercent: 90,
    metalType: 'Silver',
    silverContent: 0.18084,
  },

  // Barber Half Dollar (1892-1915)
  'Barber Half': {
    weight: 12.5,
    purityPercent: 90,
    metalType: 'Silver',
    silverContent: 0.3617,
  },

  // Seated Liberty Half Dollar (1839-1891)
  'Seated Liberty Half': {
    weight: 12.5,
    purityPercent: 90,
    metalType: 'Silver',
    silverContent: 0.3617,
  },

  // Mercury Dime (1916-1945)
  'Mercury Dime': {
    weight: 2.5,
    purityPercent: 90,
    metalType: 'Silver',
    silverContent: 0.07234,
  },

  // Barber Dime (1892-1916)
  'Barber Dime': {
    weight: 2.5,
    purityPercent: 90,
    metalType: 'Silver',
    silverContent: 0.07234,
  },

  // Seated Liberty Dime (1837-1891)
  'Seated Liberty Dime': {
    weight: 2.5,
    purityPercent: 90,
    metalType: 'Silver',
    silverContent: 0.07234,
  },

  // Buffalo Nickel (1913-1938)
  'Buffalo Nickel': {
    weight: 5.0,
    purityPercent: 75, // 75% copper, 25% nickel
    metalType: 'Copper/Nickel',
  },

  // V Nickel (1883-1913)
  'V Nickel': {
    weight: 5.0,
    purityPercent: 75,
    metalType: 'Copper/Nickel',
  },

  // Lincoln Cent Wheat (1909-1958)
  'Lincoln Wheat Cent': {
    weight: 3.11,
    purityPercent: 95, // 95% copper, 5% zinc
    metalType: 'Copper',
  },

  // Indian Head Cent (1859-1909)
  'Indian Head Cent': {
    weight: 3.11,
    purityPercent: 95,
    metalType: 'Copper',
  },

  // Lincoln Memorial Cent (1959-1982) - 95% copper
  'Lincoln Memorial Cent': {
    weight: 3.11,
    purityPercent: 95,
    metalType: 'Copper',
  },

  // Capped Bust Dime (1809-1837)
  'Capped Bust Dime': {
    weight: 2.5,
    purityPercent: 90,
    metalType: 'Silver',
    silverContent: 0.07234,
  },

  // Capped Bust Half Dime (1809-1837)
  'Capped Bust Half Dime': {
    weight: 1.35,
    purityPercent: 90,
    metalType: 'Silver',
    silverContent: 0.039,
  },

  // Seated Liberty Half Dime (1837-1873)
  'Seated Liberty Half Dime': {
    weight: 1.24,
    purityPercent: 90,
    metalType: 'Silver',
    silverContent: 0.036,
  },

  // American Silver Eagle (1986-present)
  'American Silver Eagle': {
    weight: 31.1,
    purityPercent: 99.9,
    metalType: 'Silver',
    silverContent: 1.0, // 1 troy ounce
  },

  // Franklin Half Dollar (1948-1963)
  'Franklin Half Dollar': {
    weight: 12.5,
    purityPercent: 90,
    metalType: 'Silver',
    silverContent: 0.3617,
  },

  // Washington Quarter (1932-present, 90% silver 1932-1964)
  'Washington Quarter': {
    weight: 6.25,
    purityPercent: 90,
    metalType: 'Silver',
    silverContent: 0.18084,
  },

  // Three Cent Piece (1851-1889) - silver
  'Three Cent Piece': {
    weight: 0.8,
    purityPercent: 75,
    metalType: 'Silver',
  },

  // Two Cent Piece (1864-1873)
  'Two Cent Piece': {
    weight: 6.22,
    purityPercent: 95,
    metalType: 'Copper',
  },

  // Shield Nickel (1866-1889)
  'Shield Nickel': {
    weight: 5.0,
    purityPercent: 75,
    metalType: 'Copper/Nickel',
  },

  // Flying Eagle Cent (1856-1858)
  'Flying Eagle Cent': {
    weight: 4.67,
    purityPercent: 88,
    metalType: 'Copper',
  },

  // Braided Hair Cent (1839-1857)
  'Braided Hair Cent': {
    weight: 4.67,
    purityPercent: 95,
    metalType: 'Copper',
  },

  // Mexican Peso (various silver dollars)
  'Mexican Peso': {
    weight: 27.07,
    purityPercent: 90,
    metalType: 'Silver',
    silverContent: 0.7859,
  },

  // Mexican Libertad (1oz Silver)
  'Mexican Libertad': {
    weight: 31.1,
    purityPercent: 99.9,
    metalType: 'Silver',
    silverContent: 1.0,
  },

  // Mexican Onza (1oz Silver)
  'Mexican Onza': {
    weight: 31.1,
    purityPercent: 99.9,
    metalType: 'Silver',
    silverContent: 1.0,
  },

  // Canadian Large Cent
  'Canadian Large Cent': {
    weight: 5.67,
    purityPercent: 95,
    metalType: 'Copper',
  },

  // Sacagawea Dollar
  'Sacagawea': {
    weight: 8.1,
    purityPercent: 88.5,
    metalType: 'Copper/Manganese/Nickel/Zinc',
  },

  // Jefferson Nickel (1938-present)
  'Jefferson Nickel': {
    weight: 5.0,
    purityPercent: 75,
    metalType: 'Copper/Nickel',
  },

  // Three Cent (90% silver)
  'Three Pence': {
    weight: 1.41,
    purityPercent: 92.5,
    metalType: 'Silver',
  },

  // Generic fallbacks
  '$1.00': {
    weight: 26.73,
    purityPercent: 90,
    metalType: 'Silver',
    silverContent: 0.7736,
  },

  '$0.50': {
    weight: 12.5,
    purityPercent: 90,
    metalType: 'Silver',
    silverContent: 0.3617,
  },

  '$0.25': {
    weight: 6.25,
    purityPercent: 90,
    metalType: 'Silver',
    silverContent: 0.18084,
  },

  '$0.10': {
    weight: 2.5,
    purityPercent: 90,
    metalType: 'Silver',
    silverContent: 0.07234,
  },

  '$0.05': {
    weight: 5.0,
    purityPercent: 75,
    metalType: 'Copper/Nickel',
  },

  '$0.01': {
    weight: 3.11,
    purityPercent: 95,
    metalType: 'Copper',
  },
}

// Function to lookup metal specs by series name
export function getMetalSpec(series?: string | null): MetalSpec | null {
  if (!series) return null
  return metalDatabase[series] || null
}

// Function to calculate troy ounces of silver from grams
export function gramsToTroyOz(grams: number): number {
  return grams / 31.1035
}

// Function to calculate fine weight (pure metal weight)
export function calculateFineWeight(weight: number, purityPercent: number): number {
  return weight * (purityPercent / 100)
}

// Function to calculate silver content in troy ounces
export function calculateSilverContent(weight: number, purityPercent: number): number {
  const fineWeight = calculateFineWeight(weight, purityPercent)
  return gramsToTroyOz(fineWeight)
}

// Function to calculate melt value based on spot price
export function calculateMeltValue(silverContent: number, spotPrice: number): number {
  return silverContent * spotPrice
}

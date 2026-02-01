// Coin type inference based on year and denomination
// Suggests likely series based on historical minting data

export interface CoinTypeSuggestion {
  series: string
  probability: 'high' | 'medium' | 'low'
  years: string
}

interface SeriesDateRange {
  series: string
  startYear: number
  endYear: number
  denomination: string
}

// Historical series data with date ranges
const SERIES_DATE_RANGES: SeriesDateRange[] = [
  // Dollars
  { series: 'Morgan Dollar', startYear: 1878, endYear: 1921, denomination: '$1.00' },
  { series: 'Peace Dollar', startYear: 1921, endYear: 1935, denomination: '$1.00' },
  { series: 'Trade Dollar', startYear: 1873, endYear: 1885, denomination: '$1.00' },
  { series: 'Seated Liberty Dollar', startYear: 1840, endYear: 1873, denomination: '$1.00' },
  { series: 'Eisenhower Dollar', startYear: 1971, endYear: 1978, denomination: '$1.00' },
  { series: 'Susan B Anthony Dollar', startYear: 1979, endYear: 1999, denomination: '$1.00' },
  { series: 'Sacagawea', startYear: 2000, endYear: 2008, denomination: '$1.00' },
  { series: 'American Silver Eagle', startYear: 1986, endYear: 2099, denomination: '$1.00' },

  // Half Dollars
  { series: 'Walking Liberty', startYear: 1916, endYear: 1947, denomination: '$0.50' },
  { series: 'Franklin Half Dollar', startYear: 1948, endYear: 1963, denomination: '$0.50' },
  { series: 'Kennedy Half Dollar', startYear: 1964, endYear: 2099, denomination: '$0.50' },
  { series: 'Barber Half', startYear: 1892, endYear: 1915, denomination: '$0.50' },
  { series: 'Seated Liberty Half', startYear: 1839, endYear: 1891, denomination: '$0.50' },
  { series: 'Capped Bust Half', startYear: 1807, endYear: 1839, denomination: '$0.50' },

  // Quarters
  { series: 'Washington Quarter', startYear: 1932, endYear: 2099, denomination: '$0.25' },
  { series: 'Standing Liberty Quarter', startYear: 1916, endYear: 1930, denomination: '$0.25' },
  { series: 'Barber Quarter', startYear: 1892, endYear: 1916, denomination: '$0.25' },
  { series: 'Seated Liberty Quarter', startYear: 1838, endYear: 1891, denomination: '$0.25' },

  // Dimes
  { series: 'Roosevelt Dime', startYear: 1946, endYear: 2099, denomination: '$0.10' },
  { series: 'Mercury Dime', startYear: 1916, endYear: 1945, denomination: '$0.10' },
  { series: 'Barber Dime', startYear: 1892, endYear: 1916, denomination: '$0.10' },
  { series: 'Seated Liberty Dime', startYear: 1837, endYear: 1891, denomination: '$0.10' },
  { series: 'Capped Bust Dime', startYear: 1809, endYear: 1837, denomination: '$0.10' },

  // Nickels
  { series: 'Jefferson Nickel', startYear: 1938, endYear: 2099, denomination: '$0.05' },
  { series: 'Buffalo Nickel', startYear: 1913, endYear: 1938, denomination: '$0.05' },
  { series: 'V Nickel', startYear: 1883, endYear: 1913, denomination: '$0.05' },
  { series: 'Shield Nickel', startYear: 1866, endYear: 1883, denomination: '$0.05' },

  // Cents
  { series: 'Lincoln Memorial Cent', startYear: 1959, endYear: 2008, denomination: '$0.01' },
  { series: 'Lincoln Wheat Cent', startYear: 1909, endYear: 1958, denomination: '$0.01' },
  { series: 'Indian Head Cent', startYear: 1859, endYear: 1909, denomination: '$0.01' },
  { series: 'Flying Eagle Cent', startYear: 1856, endYear: 1858, denomination: '$0.01' },
  { series: 'Braided Hair Cent', startYear: 1839, endYear: 1857, denomination: '$0.01' },

  // Half Dimes
  { series: 'Seated Liberty Half Dime', startYear: 1837, endYear: 1873, denomination: '$0.05' },
  { series: 'Capped Bust Half Dime', startYear: 1829, endYear: 1837, denomination: '$0.05' },

  // Two Cent / Three Cent
  { series: 'Two Cent Piece', startYear: 1864, endYear: 1873, denomination: '$0.02' },
  { series: 'Three Cent Piece', startYear: 1851, endYear: 1889, denomination: '$0.03' },
]

// Get suggested series based on year and denomination
export function getSuggestedSeries(
  year?: number | null,
  denomination?: string | null
): CoinTypeSuggestion[] {
  if (!year) return []

  const suggestions: CoinTypeSuggestion[] = []

  for (const range of SERIES_DATE_RANGES) {
    // Check if year falls within the series date range
    if (year >= range.startYear && year <= range.endYear) {
      // If denomination matches, high probability
      // If no denomination specified, medium probability
      // If denomination doesn't match, skip
      if (denomination && denomination !== range.denomination) {
        continue
      }

      const probability = denomination ? 'high' : 'medium'

      suggestions.push({
        series: range.series,
        probability,
        years: `${range.startYear}-${range.endYear === 2099 ? 'Present' : range.endYear}`
      })
    }
  }

  // Sort by probability (high first)
  suggestions.sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 }
    return order[a.probability] - order[b.probability]
  })

  return suggestions
}

// Get the most likely series for a given year and denomination
export function getMostLikelySeries(
  year?: number | null,
  denomination?: string | null
): string | null {
  const suggestions = getSuggestedSeries(year, denomination)
  return suggestions.length > 0 ? suggestions[0].series : null
}

// Check if a year is valid for a given series
export function isYearValidForSeries(year: number, series: string): boolean {
  const range = SERIES_DATE_RANGES.find(r => r.series === series)
  if (!range) return true // Unknown series, allow any year
  return year >= range.startYear && year <= range.endYear
}

// Comprehensive Morgan Dollar dataset (1878-1904, 1921)
// Includes all mint marks: P (Philadelphia), O (New Orleans), S (San Francisco), CC (Carson City)

export interface MorganDollarData {
  year: number
  mintMark: 'P' | 'O' | 'S' | 'CC'
  date: string
  basePrice: number // Base price in USD (varies by rarity and availability)
}

export const morganDollars: MorganDollarData[] = [
  // 1878 - First year of issue
  { year: 1878, mintMark: 'P', date: '1878', basePrice: 55 },
  { year: 1878, mintMark: 'O', date: '1878-O', basePrice: 65 },
  { year: 1878, mintMark: 'S', date: '1878-S', basePrice: 75 },
  { year: 1878, mintMark: 'CC', date: '1878-CC', basePrice: 250 }, // Carson City - rare

  // 1879
  { year: 1879, mintMark: 'P', date: '1879', basePrice: 45 },
  { year: 1879, mintMark: 'O', date: '1879-O', basePrice: 48 },
  { year: 1879, mintMark: 'S', date: '1879-S', basePrice: 50 },
  { year: 1879, mintMark: 'CC', date: '1879-CC', basePrice: 180 },

  // 1880
  { year: 1880, mintMark: 'P', date: '1880', basePrice: 42 },
  { year: 1880, mintMark: 'O', date: '1880-O', basePrice: 45 },
  { year: 1880, mintMark: 'S', date: '1880-S', basePrice: 48 },
  { year: 1880, mintMark: 'CC', date: '1880-CC', basePrice: 160 },

  // 1881
  { year: 1881, mintMark: 'P', date: '1881', basePrice: 43 },
  { year: 1881, mintMark: 'O', date: '1881-O', basePrice: 46 },
  { year: 1881, mintMark: 'S', date: '1881-S', basePrice: 49 },
  { year: 1881, mintMark: 'CC', date: '1881-CC', basePrice: 175 },

  // 1882
  { year: 1882, mintMark: 'P', date: '1882', basePrice: 42 },
  { year: 1882, mintMark: 'O', date: '1882-O', basePrice: 44 },
  { year: 1882, mintMark: 'S', date: '1882-S', basePrice: 47 },
  { year: 1882, mintMark: 'CC', date: '1882-CC', basePrice: 155 },

  // 1883
  { year: 1883, mintMark: 'P', date: '1883', basePrice: 41 },
  { year: 1883, mintMark: 'O', date: '1883-O', basePrice: 43 },
  { year: 1883, mintMark: 'S', date: '1883-S', basePrice: 46 },
  { year: 1883, mintMark: 'CC', date: '1883-CC', basePrice: 350 }, // Scarce

  // 1884
  { year: 1884, mintMark: 'P', date: '1884', basePrice: 42 },
  { year: 1884, mintMark: 'O', date: '1884-O', basePrice: 44 },
  { year: 1884, mintMark: 'S', date: '1884-S', basePrice: 48 },
  { year: 1884, mintMark: 'CC', date: '1884-CC', basePrice: 280 },

  // 1885
  { year: 1885, mintMark: 'P', date: '1885', basePrice: 41 },
  { year: 1885, mintMark: 'O', date: '1885-O', basePrice: 43 },
  { year: 1885, mintMark: 'S', date: '1885-S', basePrice: 47 },
  { year: 1885, mintMark: 'CC', date: '1885-CC', basePrice: 320 },

  // 1886
  { year: 1886, mintMark: 'P', date: '1886', basePrice: 42 },
  { year: 1886, mintMark: 'O', date: '1886-O', basePrice: 45 },
  { year: 1886, mintMark: 'S', date: '1886-S', basePrice: 49 },
  { year: 1886, mintMark: 'CC', date: '1886-CC', basePrice: 400 }, // Very scarce

  // 1887
  { year: 1887, mintMark: 'P', date: '1887', basePrice: 43 },
  { year: 1887, mintMark: 'O', date: '1887-O', basePrice: 46 },
  { year: 1887, mintMark: 'S', date: '1887-S', basePrice: 50 },
  { year: 1887, mintMark: 'CC', date: '1887-CC', basePrice: 500 }, // Very scarce

  // 1888
  { year: 1888, mintMark: 'P', date: '1888', basePrice: 45 },
  { year: 1888, mintMark: 'O', date: '1888-O', basePrice: 48 },
  { year: 1888, mintMark: 'S', date: '1888-S', basePrice: 52 },
  { year: 1888, mintMark: 'CC', date: '1888-CC', basePrice: 600 }, // Extremely scarce

  // 1889
  { year: 1889, mintMark: 'P', date: '1889', basePrice: 48 },
  { year: 1889, mintMark: 'O', date: '1889-O', basePrice: 51 },
  { year: 1889, mintMark: 'S', date: '1889-S', basePrice: 55 },
  { year: 1889, mintMark: 'CC', date: '1889-CC', basePrice: 550 },

  // 1890
  { year: 1890, mintMark: 'P', date: '1890', basePrice: 48 },
  { year: 1890, mintMark: 'O', date: '1890-O', basePrice: 50 },
  { year: 1890, mintMark: 'S', date: '1890-S', basePrice: 53 },
  { year: 1890, mintMark: 'CC', date: '1890-CC', basePrice: 480 },

  // 1891
  { year: 1891, mintMark: 'P', date: '1891', basePrice: 52 },
  { year: 1891, mintMark: 'O', date: '1891-O', basePrice: 55 },
  { year: 1891, mintMark: 'S', date: '1891-S', basePrice: 58 },
  { year: 1891, mintMark: 'CC', date: '1891-CC', basePrice: 425 },

  // 1892
  { year: 1892, mintMark: 'P', date: '1892', basePrice: 56 },
  { year: 1892, mintMark: 'O', date: '1892-O', basePrice: 60 },
  { year: 1892, mintMark: 'S', date: '1892-S', basePrice: 65 },
  { year: 1892, mintMark: 'CC', date: '1892-CC', basePrice: 380 },

  // 1893 - Last Carson City coin
  { year: 1893, mintMark: 'P', date: '1893', basePrice: 85 },
  { year: 1893, mintMark: 'O', date: '1893-O', basePrice: 95 },
  { year: 1893, mintMark: 'S', date: '1893-S', basePrice: 110 },
  { year: 1893, mintMark: 'CC', date: '1893-CC', basePrice: 950 }, // Last of Carson City

  // 1894
  { year: 1894, mintMark: 'P', date: '1894', basePrice: 120 },
  { year: 1894, mintMark: 'O', date: '1894-O', basePrice: 130 },
  { year: 1894, mintMark: 'S', date: '1894-S', basePrice: 145 },

  // 1895
  { year: 1895, mintMark: 'P', date: '1895', basePrice: 140 },
  { year: 1895, mintMark: 'O', date: '1895-O', basePrice: 155 },
  { year: 1895, mintMark: 'S', date: '1895-S', basePrice: 170 },

  // 1896
  { year: 1896, mintMark: 'P', date: '1896', basePrice: 50 },
  { year: 1896, mintMark: 'O', date: '1896-O', basePrice: 53 },
  { year: 1896, mintMark: 'S', date: '1896-S', basePrice: 57 },

  // 1897
  { year: 1897, mintMark: 'P', date: '1897', basePrice: 45 },
  { year: 1897, mintMark: 'O', date: '1897-O', basePrice: 48 },
  { year: 1897, mintMark: 'S', date: '1897-S', basePrice: 52 },

  // 1898
  { year: 1898, mintMark: 'P', date: '1898', basePrice: 42 },
  { year: 1898, mintMark: 'O', date: '1898-O', basePrice: 45 },
  { year: 1898, mintMark: 'S', date: '1898-S', basePrice: 49 },

  // 1899
  { year: 1899, mintMark: 'P', date: '1899', basePrice: 44 },
  { year: 1899, mintMark: 'O', date: '1899-O', basePrice: 47 },
  { year: 1899, mintMark: 'S', date: '1899-S', basePrice: 51 },

  // 1900
  { year: 1900, mintMark: 'P', date: '1900', basePrice: 42 },
  { year: 1900, mintMark: 'O', date: '1900-O', basePrice: 45 },
  { year: 1900, mintMark: 'S', date: '1900-S', basePrice: 49 },

  // 1901
  { year: 1901, mintMark: 'P', date: '1901', basePrice: 50 },
  { year: 1901, mintMark: 'O', date: '1901-O', basePrice: 53 },
  { year: 1901, mintMark: 'S', date: '1901-S', basePrice: 58 },

  // 1902
  { year: 1902, mintMark: 'P', date: '1902', basePrice: 44 },
  { year: 1902, mintMark: 'O', date: '1902-O', basePrice: 47 },
  { year: 1902, mintMark: 'S', date: '1902-S', basePrice: 51 },

  // 1903
  { year: 1903, mintMark: 'P', date: '1903', basePrice: 48 },
  { year: 1903, mintMark: 'O', date: '1903-O', basePrice: 51 },
  { year: 1903, mintMark: 'S', date: '1903-S', basePrice: 55 },

  // 1904
  { year: 1904, mintMark: 'P', date: '1904', basePrice: 46 },
  { year: 1904, mintMark: 'O', date: '1904-O', basePrice: 49 },
  { year: 1904, mintMark: 'S', date: '1904-S', basePrice: 53 },

  // 1921 - Resumed production (P only, O and S also)
  { year: 1921, mintMark: 'P', date: '1921', basePrice: 38 },
  { year: 1921, mintMark: 'O', date: '1921-O', basePrice: 40 },
  { year: 1921, mintMark: 'S', date: '1921-S', basePrice: 42 },
]

// Function to convert base price to estimated PCGS/NGC prices at various grades
export function generateMorganPricesByGrade(basePrice: number) {
  return {
    'MS-70': basePrice * 8,
    'MS-65': basePrice * 4,
    'MS-60': basePrice * 2,
    'AU-58': basePrice * 1.5,
    'AU-50': basePrice,
    'XF-45': basePrice * 0.8,
    'VF-35': basePrice * 0.6,
    'VF-20': basePrice * 0.4,
    'F-12': basePrice * 0.25,
  }
}

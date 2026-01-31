/**
 * US Coin Categories with Wikimedia Commons images
 */

export interface CoinCategory {
  id: string
  name: string
  slug: string
  years: string
  description: string
  imageUrl: string
  subcategories?: CoinSubcategory[]
}

export interface CoinSubcategory {
  id: string
  name: string
  years: string
  imageUrl: string
}

export const COIN_CATEGORIES: CoinCategory[] = [
  // Half Cents
  {
    id: 'half-cents',
    name: 'Half Cents',
    slug: 'half-cents',
    years: '1793-1857',
    description: 'The smallest denomination ever minted by the US',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/1804_half_cent_obv.jpg/220px-1804_half_cent_obv.jpg',
    subcategories: [
      { id: 'liberty-cap-half', name: 'Liberty Cap', years: '1793-1797', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/1793_half_cent_obv.jpg/220px-1793_half_cent_obv.jpg' },
      { id: 'draped-bust-half', name: 'Draped Bust', years: '1800-1808', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/1804_half_cent_obv.jpg/220px-1804_half_cent_obv.jpg' },
      { id: 'classic-head-half', name: 'Classic Head', years: '1809-1836', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/1828_half_cent_obv.jpg/220px-1828_half_cent_obv.jpg' },
      { id: 'braided-hair-half', name: 'Braided Hair', years: '1840-1857', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/1851_half_cent_obv.jpg/220px-1851_half_cent_obv.jpg' },
    ]
  },

  // Large Cents
  {
    id: 'large-cents',
    name: 'Large Cents',
    slug: 'large-cents',
    years: '1793-1857',
    description: 'Early American copper cents, roughly the size of a half dollar',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/1856_Large_Cent.jpg/220px-1856_Large_Cent.jpg',
    subcategories: [
      { id: 'flowing-hair-cent', name: 'Flowing Hair', years: '1793', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/1793_cent_obv.jpg/220px-1793_cent_obv.jpg' },
      { id: 'liberty-cap-cent', name: 'Liberty Cap', years: '1793-1796', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/1794_cent_obv.jpg/220px-1794_cent_obv.jpg' },
      { id: 'draped-bust-cent', name: 'Draped Bust', years: '1796-1807', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/1798_cent_obv.jpg/220px-1798_cent_obv.jpg' },
      { id: 'classic-head-cent', name: 'Classic Head', years: '1808-1814', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/1812_cent_obv.jpg/220px-1812_cent_obv.jpg' },
      { id: 'coronet-cent', name: 'Coronet', years: '1816-1839', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/48/1820_cent_obv.jpg/220px-1820_cent_obv.jpg' },
      { id: 'braided-hair-cent', name: 'Braided Hair', years: '1839-1857', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/1856_Large_Cent.jpg/220px-1856_Large_Cent.jpg' },
    ]
  },

  // Small Cents
  {
    id: 'small-cents',
    name: 'Small Cents',
    slug: 'small-cents',
    years: '1856-Present',
    description: 'Modern-sized US pennies from Flying Eagle to Lincoln',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/US_One_Cent_Obv.png/220px-US_One_Cent_Obv.png',
    subcategories: [
      { id: 'flying-eagle', name: 'Flying Eagle', years: '1856-1858', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/1857_Flying_Eagle_Cent.jpg/220px-1857_Flying_Eagle_Cent.jpg' },
      { id: 'indian-head', name: 'Indian Head', years: '1859-1909', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/1859_Indian_Head_Cent.jpg/220px-1859_Indian_Head_Cent.jpg' },
      { id: 'lincoln-wheat', name: 'Lincoln Wheat', years: '1909-1958', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/1909-S_VDB_Lincoln_Cent_Obverse.png/220px-1909-S_VDB_Lincoln_Cent_Obverse.png' },
      { id: 'lincoln-memorial', name: 'Lincoln Memorial', years: '1959-2008', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/US_One_Cent_Obv.png/220px-US_One_Cent_Obv.png' },
      { id: 'lincoln-shield', name: 'Lincoln Shield', years: '2010-Present', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/US_One_Cent_Obv.png/220px-US_One_Cent_Obv.png' },
    ]
  },

  // Nickels
  {
    id: 'nickels',
    name: 'Nickels',
    slug: 'nickels',
    years: '1866-Present',
    description: 'Five-cent pieces from Shield to Jefferson',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/1936_Buffalo_Nickel.jpg/220px-1936_Buffalo_Nickel.jpg',
    subcategories: [
      { id: 'shield-nickel', name: 'Shield', years: '1866-1883', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/1866_Rays_Shield_Nickel.jpg/220px-1866_Rays_Shield_Nickel.jpg' },
      { id: 'liberty-v-nickel', name: 'Liberty (V)', years: '1883-1913', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/1883_Liberty_Head_Nickel.jpg/220px-1883_Liberty_Head_Nickel.jpg' },
      { id: 'buffalo-nickel', name: 'Buffalo', years: '1913-1938', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/1936_Buffalo_Nickel.jpg/220px-1936_Buffalo_Nickel.jpg' },
      { id: 'jefferson-nickel', name: 'Jefferson', years: '1938-Present', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/2006_Nickel_Proof_Obv.png/220px-2006_Nickel_Proof_Obv.png' },
    ]
  },

  // Dimes
  {
    id: 'dimes',
    name: 'Dimes',
    slug: 'dimes',
    years: '1796-Present',
    description: 'Ten-cent pieces from Draped Bust to Roosevelt',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/1943D_Mercury_Dime_obverse.jpg/220px-1943D_Mercury_Dime_obverse.jpg',
    subcategories: [
      { id: 'draped-bust-dime', name: 'Draped Bust', years: '1796-1807', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/1796_dime_obv.jpg/220px-1796_dime_obv.jpg' },
      { id: 'capped-bust-dime', name: 'Capped Bust', years: '1809-1837', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/1820_dime_obv.jpg/220px-1820_dime_obv.jpg' },
      { id: 'seated-liberty-dime', name: 'Seated Liberty', years: '1837-1891', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/1876_dime_obv.jpg/220px-1876_dime_obv.jpg' },
      { id: 'barber-dime', name: 'Barber', years: '1892-1916', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/1906_dime_obv.jpg/220px-1906_dime_obv.jpg' },
      { id: 'mercury-dime', name: 'Mercury', years: '1916-1945', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/1943D_Mercury_Dime_obverse.jpg/220px-1943D_Mercury_Dime_obverse.jpg' },
      { id: 'roosevelt-dime', name: 'Roosevelt', years: '1946-Present', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/2015_Dime_Obv.png/220px-2015_Dime_Obv.png' },
    ]
  },

  // Quarters
  {
    id: 'quarters',
    name: 'Quarters',
    slug: 'quarters',
    years: '1796-Present',
    description: 'Twenty-five cent pieces from Draped Bust to America the Beautiful',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/1917_Standing_Liberty_quarter_obverse_type_1.jpg/220px-1917_Standing_Liberty_quarter_obverse_type_1.jpg',
    subcategories: [
      { id: 'draped-bust-quarter', name: 'Draped Bust', years: '1796-1807', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/1806_quarter_obv.jpg/220px-1806_quarter_obv.jpg' },
      { id: 'capped-bust-quarter', name: 'Capped Bust', years: '1815-1838', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/1832_quarter_obv.jpg/220px-1832_quarter_obv.jpg' },
      { id: 'seated-liberty-quarter', name: 'Seated Liberty', years: '1838-1891', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/1877_quarter_obv.jpg/220px-1877_quarter_obv.jpg' },
      { id: 'barber-quarter', name: 'Barber', years: '1892-1916', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/1901_quarter_obv.jpg/220px-1901_quarter_obv.jpg' },
      { id: 'standing-liberty-quarter', name: 'Standing Liberty', years: '1916-1930', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/1917_Standing_Liberty_quarter_obverse_type_1.jpg/220px-1917_Standing_Liberty_quarter_obverse_type_1.jpg' },
      { id: 'washington-quarter', name: 'Washington', years: '1932-Present', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/1999_Washington_quarter_obverse.png/220px-1999_Washington_quarter_obverse.png' },
    ]
  },

  // Half Dollars
  {
    id: 'half-dollars',
    name: 'Half Dollars',
    slug: 'half-dollars',
    years: '1794-Present',
    description: 'Fifty-cent pieces from Flowing Hair to Kennedy',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Walking_Liberty_Half_Dollar_1945D_Obverse.png/220px-Walking_Liberty_Half_Dollar_1945D_Obverse.png',
    subcategories: [
      { id: 'flowing-hair-half', name: 'Flowing Hair', years: '1794-1795', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bf/1795_half_dollar_obv.jpg/220px-1795_half_dollar_obv.jpg' },
      { id: 'draped-bust-half', name: 'Draped Bust', years: '1796-1807', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/1805_half_obv.jpg/220px-1805_half_obv.jpg' },
      { id: 'capped-bust-half', name: 'Capped Bust', years: '1807-1839', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/1812_half_obv.jpg/220px-1812_half_obv.jpg' },
      { id: 'seated-liberty-half', name: 'Seated Liberty', years: '1839-1891', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/1861_half_obv.jpg/220px-1861_half_obv.jpg' },
      { id: 'barber-half', name: 'Barber', years: '1892-1915', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/1909_half_obv.jpg/220px-1909_half_obv.jpg' },
      { id: 'walking-liberty-half', name: 'Walking Liberty', years: '1916-1947', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Walking_Liberty_Half_Dollar_1945D_Obverse.png/220px-Walking_Liberty_Half_Dollar_1945D_Obverse.png' },
      { id: 'franklin-half', name: 'Franklin', years: '1948-1963', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/1963_Franklin_Half_Dollar.jpg/220px-1963_Franklin_Half_Dollar.jpg' },
      { id: 'kennedy-half', name: 'Kennedy', years: '1964-Present', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/2015_Half_Dollar_Obv.png/220px-2015_Half_Dollar_Obv.png' },
    ]
  },

  // Dollars
  {
    id: 'dollars',
    name: 'Dollars',
    slug: 'dollars',
    years: '1794-Present',
    description: 'Silver and clad dollar coins from Flowing Hair to modern',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/1878S_Morgan_Dollar_NGC_MS64plus_Obverse.png/220px-1878S_Morgan_Dollar_NGC_MS64plus_Obverse.png',
    subcategories: [
      { id: 'flowing-hair-dollar', name: 'Flowing Hair', years: '1794-1795', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/1795_Flowing_hair_dollar.jpg/220px-1795_Flowing_hair_dollar.jpg' },
      { id: 'draped-bust-dollar', name: 'Draped Bust', years: '1795-1804', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Draped_Bust_dollar.jpg/220px-Draped_Bust_dollar.jpg' },
      { id: 'seated-liberty-dollar', name: 'Seated Liberty', years: '1840-1873', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/1871_Seated_Liberty_Dollar.jpg/220px-1871_Seated_Liberty_Dollar.jpg' },
      { id: 'trade-dollar', name: 'Trade Dollar', years: '1873-1885', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/1873_Trade_Dollar.jpg/220px-1873_Trade_Dollar.jpg' },
      { id: 'morgan-dollar', name: 'Morgan Dollar', years: '1878-1921', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/1878S_Morgan_Dollar_NGC_MS64plus_Obverse.png/220px-1878S_Morgan_Dollar_NGC_MS64plus_Obverse.png' },
      { id: 'peace-dollar', name: 'Peace Dollar', years: '1921-1935', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Peace_dollar.jpg/220px-Peace_dollar.jpg' },
      { id: 'eisenhower-dollar', name: 'Eisenhower', years: '1971-1978', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/1972_Eisenhower_Dollar.jpg/220px-1972_Eisenhower_Dollar.jpg' },
      { id: 'susan-b-anthony', name: 'Susan B. Anthony', years: '1979-1999', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/1979_SBA_obverse.png/220px-1979_SBA_obverse.png' },
      { id: 'sacagawea-dollar', name: 'Sacagawea', years: '2000-Present', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Sacagawea_dollar_obverse.png/220px-Sacagawea_dollar_obverse.png' },
    ]
  },

  // Gold Coins
  {
    id: 'gold',
    name: 'Gold Coins',
    slug: 'gold',
    years: '1795-1933',
    description: 'Pre-1933 US gold coinage from $1 to $20 denominations',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/1924_Saint-Gaudens_double_eagle_obverse.jpg/220px-1924_Saint-Gaudens_double_eagle_obverse.jpg',
    subcategories: [
      { id: 'gold-dollar', name: 'Gold Dollar', years: '1849-1889', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/1862_gold_dollar_obv.jpg/220px-1862_gold_dollar_obv.jpg' },
      { id: 'quarter-eagle', name: 'Quarter Eagle ($2.50)', years: '1796-1929', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/1926_quarter_eagle_obv.jpg/220px-1926_quarter_eagle_obv.jpg' },
      { id: 'three-dollar', name: 'Three Dollar', years: '1854-1889', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/1878_three_dollar_obv.jpg/220px-1878_three_dollar_obv.jpg' },
      { id: 'half-eagle', name: 'Half Eagle ($5)', years: '1795-1929', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/1911_Indian_Head_half_eagle_obverse.jpg/220px-1911_Indian_Head_half_eagle_obverse.jpg' },
      { id: 'eagle', name: 'Eagle ($10)', years: '1795-1933', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/1926_eagle_obv.jpg/220px-1926_eagle_obv.jpg' },
      { id: 'double-eagle', name: 'Double Eagle ($20)', years: '1849-1933', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/1924_Saint-Gaudens_double_eagle_obverse.jpg/220px-1924_Saint-Gaudens_double_eagle_obverse.jpg' },
    ]
  },

  // Modern Bullion
  {
    id: 'bullion',
    name: 'Modern Bullion',
    slug: 'bullion',
    years: '1986-Present',
    description: 'American Eagles, Buffalos, and other modern precious metal coins',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/American_Silver_Eagle%2C_obverse%2C_2004.jpg/220px-American_Silver_Eagle%2C_obverse%2C_2004.jpg',
    subcategories: [
      { id: 'silver-eagle', name: 'Silver Eagle', years: '1986-Present', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/American_Silver_Eagle%2C_obverse%2C_2004.jpg/220px-American_Silver_Eagle%2C_obverse%2C_2004.jpg' },
      { id: 'gold-eagle', name: 'Gold Eagle', years: '1986-Present', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/2006_AEGold_Proof_Obv.png/220px-2006_AEGold_Proof_Obv.png' },
      { id: 'gold-buffalo', name: 'Gold Buffalo', years: '2006-Present', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/2006_AuBuf_Proof_Obv.png/220px-2006_AuBuf_Proof_Obv.png' },
      { id: 'platinum-eagle', name: 'Platinum Eagle', years: '1997-Present', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/2014_Platinum_Eagle_Obv.png/220px-2014_Platinum_Eagle_Obv.png' },
      { id: 'palladium-eagle', name: 'Palladium Eagle', years: '2017-Present', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/2017_Palladium_Eagle_Obv.png/220px-2017_Palladium_Eagle_Obv.png' },
    ]
  },

  // Commemoratives
  {
    id: 'commemoratives',
    name: 'Commemoratives',
    slug: 'commemoratives',
    years: '1892-Present',
    description: 'Special issue coins celebrating events, people, and places',
    imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/1926_Sesquicentennial_half_dollar_obverse.jpg/220px-1926_Sesquicentennial_half_dollar_obverse.jpg',
    subcategories: [
      { id: 'classic-commems', name: 'Classic (1892-1954)', years: '1892-1954', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/1926_Sesquicentennial_half_dollar_obverse.jpg/220px-1926_Sesquicentennial_half_dollar_obverse.jpg' },
      { id: 'modern-commems', name: 'Modern (1982-Present)', years: '1982-Present', imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/1986_Statue_of_Liberty_dollar_obverse.jpg/220px-1986_Statue_of_Liberty_dollar_obverse.jpg' },
    ]
  },
]

// Flatten all coins for search
export function getAllSearchableCoins(): Array<{ id: string; name: string; years: string; imageUrl: string; category: string }> {
  const results: Array<{ id: string; name: string; years: string; imageUrl: string; category: string }> = []

  COIN_CATEGORIES.forEach(category => {
    // Add main category
    results.push({
      id: category.id,
      name: category.name,
      years: category.years,
      imageUrl: category.imageUrl,
      category: 'Category'
    })

    // Add subcategories
    if (category.subcategories) {
      category.subcategories.forEach(sub => {
        results.push({
          id: sub.id,
          name: sub.name,
          years: sub.years,
          imageUrl: sub.imageUrl,
          category: category.name
        })
      })
    }
  })

  return results
}

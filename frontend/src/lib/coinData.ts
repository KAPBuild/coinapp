// Standardized coin series to maintain data consistency
export const COIN_SERIES = [
  // U.S. Silver Dollars
  'Morgan Dollar',
  'Peace Dollar',
  'Eisenhower Dollar',
  'American Silver Eagle',
  'Flowing Hair Dollar',
  'Draped Bust Dollar',
  'Seated Liberty Dollar',
  'Trade Dollar',

  // U.S. Half Dollars
  'Barber Half Dollar',
  'Walking Liberty Half Dollar',
  'Franklin Half Dollar',
  'Kennedy Half Dollar',
  'Seated Liberty Half Dollar',
  'Draped Bust Half Dollar',
  'Capped Bust Half Dollar',

  // U.S. Quarters
  'Barber Quarter',
  'Standing Liberty Quarter',
  'Washington Quarter',
  'Seated Liberty Quarter',
  'Draped Bust Quarter',
  'Capped Bust Quarter',
  'State Quarter',
  'America the Beautiful Quarter',

  // U.S. Dimes
  'Barber Dime',
  'Mercury Dime',
  'Roosevelt Dime',
  'Seated Liberty Dime',
  'Draped Bust Dime',
  'Capped Bust Dime',

  // U.S. Nickels
  'Shield Nickel',
  'Liberty Head Nickel',
  'Buffalo Nickel',
  'Jefferson Nickel',

  // U.S. Cents
  'Flying Eagle Cent',
  'Indian Head Cent',
  'Lincoln Wheat Cent',
  'Lincoln Memorial Cent',
  'Lincoln Shield Cent',

  // U.S. Gold Coins
  'Gold Eagle ($10)',
  'Gold Double Eagle ($20)',
  'Gold Half Eagle ($5)',
  'Gold Quarter Eagle ($2.50)',
  'Gold Dollar',
  'American Gold Eagle',
  'American Gold Buffalo',

  // Commemorative & Special
  'Commemorative Half Dollar',
  'Commemorative Silver Dollar',
  'Proof Set',
  'Mint Set',

  // Foreign Coins
  'Canadian Silver Dollar',
  'Canadian Maple Leaf',
  'Mexican Libertad',
  'British Sovereign',
  'Australian Kangaroo',
  'Chinese Panda',
  'South African Krugerrand',

  // Other
  'Other',
].sort()

// Standardized mint marks
export const MINT_MARKS = [
  '',
  'P', // Philadelphia
  'D', // Denver
  'S', // San Francisco
  'O', // New Orleans
  'CC', // Carson City
  'W', // West Point
  'C', // Charlotte
  'D', // Dahlonega
].sort()

// Standardized denominations
export const DENOMINATIONS = [
  '',
  '1¢',
  '5¢',
  '10¢',
  '25¢',
  '50¢',
  '$1.00',
  '$2.50',
  '$5.00',
  '$10.00',
  '$20.00',
  '$50.00',
  '$100.00',
].sort()

// Standardized grading companies
export const GRADING_COMPANIES = [
  '',
  'PCGS',
  'NGC',
  'ANACS',
  'ICG',
  'PCI',
  'SEGS',
  'Other',
].sort()

// Standardized grades
export const COIN_GRADES = [
  '',
  // Poor to Fair
  'P-1', 'FR-2',
  // About Good
  'AG-3',
  // Good
  'G-4', 'G-6',
  // Very Good
  'VG-8', 'VG-10',
  // Fine
  'F-12', 'F-15',
  // Very Fine
  'VF-20', 'VF-25', 'VF-30', 'VF-35',
  // Extremely Fine / About Uncirculated
  'EF-40', 'EF-45', 'AU-50', 'AU-53', 'AU-55', 'AU-58',
  // Mint State
  'MS-60', 'MS-61', 'MS-62', 'MS-63', 'MS-64', 'MS-65',
  'MS-66', 'MS-67', 'MS-68', 'MS-69', 'MS-70',
  // Proof
  'PR-60', 'PR-61', 'PR-62', 'PR-63', 'PR-64', 'PR-65',
  'PR-66', 'PR-67', 'PR-68', 'PR-69', 'PR-70',
]

// Standardized place purchased options
export const PURCHASE_LOCATIONS = [
  '',
  'eBay',
  'Local Coin Shop',
  'Coin Show',
  'Online Dealer',
  'Auction House',
  'Private Sale',
  'Estate Sale',
  'Pawn Shop',
  'Flea Market',
  'Inherited',
  'Gift',
  'Other',
].sort()

// Standardized listing platforms
export const LISTING_PLATFORMS = [
  '',
  'eBay',
  'Mercari',
  'Facebook Marketplace',
  'Craigslist',
  'Local Coin Shop',
  'Coin Show',
  'Private Sale',
  'Auction House',
  'Other',
].sort()

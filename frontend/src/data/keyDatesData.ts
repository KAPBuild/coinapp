/**
 * Key date and semi-key date reference data for major US coin series.
 * Used by the Key Date Guide page.
 */

export type Rarity = 'semi-key' | 'key' | 'ultra-rare'

export interface KeyDateEntry {
  id: string           // e.g. "1893-S"
  year: number
  mintMark?: string    // "S", "CC", "D", "O", "P" or undefined for no mint mark
  mintage: number
  estimatedSurvivors?: number
  rarity: Rarity
  notes: string
}

export interface SeriesKeyDates {
  seriesId: string     // matches CoinSubcategory.id from coinCategories.ts
  seriesName: string
  entries: KeyDateEntry[]
}

// ─── Morgan Dollar (1878–1921) ───────────────────────────────────────────────
// Data sourced from PCGS population reports and numismatic references
const morganKeyDates: SeriesKeyDates = {
  seriesId: 'morgan-dollar',
  seriesName: 'Morgan Dollar',
  entries: [
    { id: '1879-CC', year: 1879, mintMark: 'CC', mintage: 756000, estimatedSurvivors: 150000, rarity: 'semi-key', notes: 'Low mintage Carson City issue. Scarce in all grades.' },
    { id: '1882-S', year: 1882, mintMark: 'S', mintage: 9250000, estimatedSurvivors: 3500000, rarity: 'semi-key', notes: 'Large mintage but rarely found above MS-65.' },
    { id: '1883-S', year: 1883, mintMark: 'S', mintage: 6250000, estimatedSurvivors: 800000, rarity: 'key', notes: 'Deceptively scarce in Mint State. Population drops sharply above MS-63.' },
    { id: '1884-S', year: 1884, mintMark: 'S', mintage: 3200000, estimatedSurvivors: 400000, rarity: 'key', notes: 'Major key date. Very rare above MS-63. Only 234 graded MS-65.' },
    { id: '1885-CC', year: 1885, mintMark: 'CC', mintage: 228000, estimatedSurvivors: 150000, rarity: 'semi-key', notes: 'Lowest CC mintage of the series. Many released from Treasury bags in 1962–64.' },
    { id: '1886-O', year: 1886, mintMark: 'O', mintage: 10710000, estimatedSurvivors: 2500000, rarity: 'key', notes: 'One of the toughest Morgans in Mint State despite large mintage. Poorly struck.' },
    { id: '1889-CC', year: 1889, mintMark: 'CC', mintage: 350000, estimatedSurvivors: 75000, rarity: 'key', notes: 'Premier key date of the series. Only 156 graded MS-65. Most circulated heavily.' },
    { id: '1892-S', year: 1892, mintMark: 'S', mintage: 1200000, estimatedSurvivors: 150000, rarity: 'key', notes: 'Key date. Very rare in Mint State. Only 178 graded MS-65.' },
    { id: '1893-P', year: 1893, mintMark: undefined, mintage: 378000, estimatedSurvivors: 100000, rarity: 'key', notes: 'Low mintage Philadelphia issue. Part of the famous 1893 key date group.' },
    { id: '1893-CC', year: 1893, mintMark: 'CC', mintage: 677000, estimatedSurvivors: 175000, rarity: 'key', notes: 'Last CC Morgan. Widely collected as a key date.' },
    { id: '1893-O', year: 1893, mintMark: 'O', mintage: 300000, estimatedSurvivors: 75000, rarity: 'key', notes: 'Scarce in all grades. Only 234 graded MS-65.' },
    { id: '1893-S', year: 1893, mintMark: 'S', mintage: 100000, estimatedSurvivors: 10000, rarity: 'ultra-rare', notes: 'The most famous Morgan key date. Only ~79 known in MS-65. A Fine-12 sells for $15,000+.' },
    { id: '1894-P', year: 1894, mintMark: undefined, mintage: 110000, estimatedSurvivors: 30000, rarity: 'ultra-rare', notes: 'Second lowest Philadelphia mintage. Only 145 graded MS-65.' },
    { id: '1894-O', year: 1894, mintMark: 'O', mintage: 1723000, estimatedSurvivors: 400000, rarity: 'key', notes: 'High mintage but condition rarity. MS-65 examples very rare.' },
    { id: '1894-S', year: 1894, mintMark: 'S', mintage: 1260000, estimatedSurvivors: 200000, rarity: 'key', notes: 'Scarce in all grades. Only 234 graded MS-65.' },
    { id: '1895-P', year: 1895, mintMark: undefined, mintage: 12000, estimatedSurvivors: 880, rarity: 'ultra-rare', notes: 'THE rarest regular-issue Morgan. Only proofs known (880 struck). No MS examples exist.' },
    { id: '1895-O', year: 1895, mintMark: 'O', mintage: 450000, estimatedSurvivors: 80000, rarity: 'key', notes: 'Very rare in Mint State. Only 178 graded MS-65.' },
    { id: '1895-S', year: 1895, mintMark: 'S', mintage: 400000, estimatedSurvivors: 60000, rarity: 'key', notes: 'Rare in all grades. Only 123 graded MS-65.' },
    { id: '1896-O', year: 1896, mintMark: 'O', mintage: 4900000, estimatedSurvivors: 1000000, rarity: 'key', notes: 'Condition rarity despite large mintage. MS-65 examples extremely rare.' },
    { id: '1896-S', year: 1896, mintMark: 'S', mintage: 5000000, estimatedSurvivors: 800000, rarity: 'key', notes: 'Scarce in all grades. Only 456 graded MS-65.' },
    { id: '1897-O', year: 1897, mintMark: 'O', mintage: 4004000, estimatedSurvivors: 800000, rarity: 'key', notes: 'Condition rarity. Very few survive in MS-64 or better.' },
    { id: '1901-P', year: 1901, mintMark: undefined, mintage: 6962000, estimatedSurvivors: 1500000, rarity: 'ultra-rare', notes: 'The ultimate condition rarity. Only 234 known in MS-65. A VF-20 sells for $700+.' },
    { id: '1901-S', year: 1901, mintMark: 'S', mintage: 2284000, estimatedSurvivors: 350000, rarity: 'key', notes: 'Key date. Only 345 graded MS-65.' },
    { id: '1902-S', year: 1902, mintMark: 'S', mintage: 1530000, estimatedSurvivors: 250000, rarity: 'key', notes: 'Scarce issue. Rare in MS-64 and above.' },
    { id: '1903-S', year: 1903, mintMark: 'S', mintage: 1241000, estimatedSurvivors: 150000, rarity: 'key', notes: 'Key date. Only 145 graded MS-65.' },
    { id: '1904-S', year: 1904, mintMark: 'S', mintage: 2304000, estimatedSurvivors: 200000, rarity: 'key', notes: 'Scarce in Mint State. Only 178 graded MS-65.' },
  ]
}

// ─── Lincoln Wheat Cent (1909–1958) ─────────────────────────────────────────
const lincolnWheatKeyDates: SeriesKeyDates = {
  seriesId: 'lincoln-wheat',
  seriesName: 'Lincoln Wheat Cent',
  entries: [
    { id: '1909-S-VDB', year: 1909, mintMark: 'S', mintage: 484000, estimatedSurvivors: 200000, rarity: 'key', notes: '1909-S VDB — The most famous Lincoln cent. Designer\'s initials removed after public outcry.' },
    { id: '1909-S', year: 1909, mintMark: 'S', mintage: 1825000, estimatedSurvivors: 600000, rarity: 'semi-key', notes: 'Without VDB initials. Still a major key date; low mintage for the first year.' },
    { id: '1914-D', year: 1914, mintMark: 'D', mintage: 1193000, estimatedSurvivors: 300000, rarity: 'key', notes: 'One of the scarcest regular-issue Lincoln cents. Widely counterfeited — buy certified.' },
    { id: '1922-plain', year: 1922, mintMark: undefined, mintage: 7160000, estimatedSurvivors: 15000, rarity: 'key', notes: '1922 Plain — Struck at Denver but D mint mark was filled/missing. Only ~15,000 known.' },
    { id: '1924-D', year: 1924, mintMark: 'D', mintage: 2520000, estimatedSurvivors: 500000, rarity: 'semi-key', notes: 'Low mintage Denver cent. Scarce in higher grades.' },
    { id: '1931-S', year: 1931, mintMark: 'S', mintage: 866000, estimatedSurvivors: 250000, rarity: 'key', notes: 'Key date of the series. Lowest San Francisco mintage of the wheat era.' },
    { id: '1943-bronze', year: 1943, mintMark: undefined, mintage: 40, estimatedSurvivors: 20, rarity: 'ultra-rare', notes: '1943 Bronze Error — Zinc-coated steel was standard; a few bronze planchets slipped through. Only ~20 known across all mints.' },
    { id: '1944-steel', year: 1944, mintMark: undefined, mintage: 30, estimatedSurvivors: 25, rarity: 'ultra-rare', notes: '1944 Steel Error — Bronze was back in 1944; ~25 steel planchets from 1943 were accidentally used.' },
  ]
}

// ─── Indian Head Cent (1859–1909) ────────────────────────────────────────────
const indianHeadKeyDates: SeriesKeyDates = {
  seriesId: 'indian-head',
  seriesName: 'Indian Head Cent',
  entries: [
    { id: '1867', year: 1867, mintMark: undefined, mintage: 9821000, estimatedSurvivors: 800000, rarity: 'semi-key', notes: 'Condition rarity. Scarce above EF-40.' },
    { id: '1877', year: 1877, mintMark: undefined, mintage: 852500, estimatedSurvivors: 200000, rarity: 'key', notes: 'THE key date of the series. Lowest mintage of any regularly issued Indian Head cent.' },
    { id: '1908-S', year: 1908, mintMark: 'S', mintage: 1115000, estimatedSurvivors: 300000, rarity: 'semi-key', notes: 'Only San Francisco Indian Head cent. Key to the set.' },
    { id: '1909-S', year: 1909, mintMark: 'S', mintage: 309000, estimatedSurvivors: 100000, rarity: 'key', notes: 'Final year, lowest mintage. A must-have for any Indian Head collection.' },
  ]
}

// ─── Buffalo Nickel (1913–1938) ──────────────────────────────────────────────
const buffaloNickelKeyDates: SeriesKeyDates = {
  seriesId: 'buffalo-nickel',
  seriesName: 'Buffalo Nickel',
  entries: [
    { id: '1913-S-T2', year: 1913, mintMark: 'S', mintage: 1209000, estimatedSurvivors: 200000, rarity: 'key', notes: '1913-S Type 2 — Flat ground design. Lowest mintage of the first year.' },
    { id: '1916-DD', year: 1916, mintMark: undefined, mintage: 63000, estimatedSurvivors: 15000, rarity: 'ultra-rare', notes: '1916 Doubled Die Obverse — Only ~15,000 known. One of the most valuable Buffalo nickels.' },
    { id: '1918-7D', year: 1918, mintMark: 'D', mintage: 8362000, estimatedSurvivors: 100000, rarity: 'ultra-rare', notes: '1918/7-D Overdate — 1917-D die was reused. Extremely rare and often weakly struck.' },
    { id: '1921-S', year: 1921, mintMark: 'S', mintage: 1557000, estimatedSurvivors: 200000, rarity: 'key', notes: 'Key date. Rare in high grades.' },
    { id: '1926-S', year: 1926, mintMark: 'S', mintage: 970000, estimatedSurvivors: 150000, rarity: 'key', notes: 'Low mintage key. Scarce in all grades above VF.' },
    { id: '1937-D-3leg', year: 1937, mintMark: 'D', mintage: 17826000, estimatedSurvivors: 10000, rarity: 'ultra-rare', notes: '1937-D Three-Legged — Die was polished removing one leg from the buffalo. Highly sought after.' },
  ]
}

// ─── Liberty (V) Nickel (1883–1913) ──────────────────────────────────────────
const libertyNickelKeyDates: SeriesKeyDates = {
  seriesId: 'liberty-v-nickel',
  seriesName: 'Liberty (V) Nickel',
  entries: [
    { id: '1885', year: 1885, mintMark: undefined, mintage: 1476490, estimatedSurvivors: 100000, rarity: 'key', notes: 'Key date with low mintage. Scarce in all grades.' },
    { id: '1886', year: 1886, mintMark: undefined, mintage: 3326000, estimatedSurvivors: 200000, rarity: 'semi-key', notes: 'Condition rarity. Hard to find above VF-30.' },
    { id: '1912-S', year: 1912, mintMark: 'S', mintage: 238000, estimatedSurvivors: 60000, rarity: 'key', notes: 'Only San Francisco Liberty nickel. Key to completing the set.' },
    { id: '1913', year: 1913, mintMark: undefined, mintage: 5, estimatedSurvivors: 5, rarity: 'ultra-rare', notes: '1913 Liberty Nickel — Never officially struck. Only 5 known, made secretly at the Mint. Last sold for $3.7M.' },
  ]
}

// ─── Mercury Dime (1916–1945) ────────────────────────────────────────────────
const mercuryDimeKeyDates: SeriesKeyDates = {
  seriesId: 'mercury-dime',
  seriesName: 'Mercury Dime',
  entries: [
    { id: '1916-D', year: 1916, mintMark: 'D', mintage: 264000, estimatedSurvivors: 75000, rarity: 'ultra-rare', notes: 'THE key date. Lowest mintage of the series. Widely counterfeited — always buy certified.' },
    { id: '1921', year: 1921, mintMark: undefined, mintage: 1230000, estimatedSurvivors: 200000, rarity: 'key', notes: 'Post-WWI key date. Low mintage and heavily circulated.' },
    { id: '1921-D', year: 1921, mintMark: 'D', mintage: 1080000, estimatedSurvivors: 175000, rarity: 'key', notes: 'Key date. Rare in VF and above.' },
    { id: '1926-S', year: 1926, mintMark: 'S', mintage: 1520000, estimatedSurvivors: 250000, rarity: 'key', notes: 'Key date. Difficult to find in Fine or better.' },
    { id: '1942-41', year: 1942, mintMark: undefined, mintage: 10000, estimatedSurvivors: 8000, rarity: 'ultra-rare', notes: '1942/1 Overdate — 1941 die was reused. Only ~8,000 known across Philadelphia and Denver.' },
  ]
}

// ─── Barber Dime (1892–1916) ─────────────────────────────────────────────────
const barberDimeKeyDates: SeriesKeyDates = {
  seriesId: 'barber-dime',
  seriesName: 'Barber Dime',
  entries: [
    { id: '1895-O', year: 1895, mintMark: 'O', mintage: 440000, estimatedSurvivors: 50000, rarity: 'key', notes: 'Rarest Barber dime date. Low mintage and heavily worn survivors.' },
    { id: '1904-S', year: 1904, mintMark: 'S', mintage: 800000, estimatedSurvivors: 100000, rarity: 'key', notes: 'Key date. Very rare in VF-20 and above.' },
    { id: '1913-S', year: 1913, mintMark: 'S', mintage: 510000, estimatedSurvivors: 75000, rarity: 'key', notes: 'Second to last year. Low mintage and rarely found above EF.' },
  ]
}

// ─── Standing Liberty Quarter (1916–1930) ───────────────────────────────────
const standingLibertyKeyDates: SeriesKeyDates = {
  seriesId: 'standing-liberty-quarter',
  seriesName: 'Standing Liberty Quarter',
  entries: [
    { id: '1916', year: 1916, mintMark: undefined, mintage: 52000, estimatedSurvivors: 15000, rarity: 'ultra-rare', notes: 'First year, extremely low mintage. Most expensive regular-issue 20th-century quarter.' },
    { id: '1918-7S', year: 1918, mintMark: 'S', mintage: 11072000, estimatedSurvivors: 50000, rarity: 'ultra-rare', notes: '1918/7-S Overdate — Rare variety struck over 1917 dies. One of the most coveted US overdate coins.' },
    { id: '1921', year: 1921, mintMark: undefined, mintage: 1916000, estimatedSurvivors: 200000, rarity: 'key', notes: 'Low mintage Depression-era key date.' },
    { id: '1923-S', year: 1923, mintMark: 'S', mintage: 1360000, estimatedSurvivors: 150000, rarity: 'key', notes: 'Key date. Rare above EF-40.' },
    { id: '1927-S', year: 1927, mintMark: 'S', mintage: 396000, estimatedSurvivors: 75000, rarity: 'key', notes: 'Condition rarity. Virtually unknown in Full Head grade.' },
  ]
}

// ─── Barber Quarter (1892–1916) ──────────────────────────────────────────────
const barberQuarterKeyDates: SeriesKeyDates = {
  seriesId: 'barber-quarter',
  seriesName: 'Barber Quarter',
  entries: [
    { id: '1901-S', year: 1901, mintMark: 'S', mintage: 72664, estimatedSurvivors: 10000, rarity: 'ultra-rare', notes: 'Rarest Barber quarter. Only ~10,000 known survivors. The key date of the entire Barber series.' },
    { id: '1913-S', year: 1913, mintMark: 'S', mintage: 40000, estimatedSurvivors: 5000, rarity: 'ultra-rare', notes: 'Second rarest Barber quarter. Only 40,000 struck. Extremely rare in any grade.' },
  ]
}

// ─── Walking Liberty Half Dollar (1916–1947) ─────────────────────────────────
const walkingLibertyKeyDates: SeriesKeyDates = {
  seriesId: 'walking-liberty-half',
  seriesName: 'Walking Liberty Half Dollar',
  entries: [
    { id: '1916-S-rev', year: 1916, mintMark: 'S', mintage: 508000, estimatedSurvivors: 100000, rarity: 'key', notes: '1916-S (Reverse Mintmark) — Mint mark on reverse. First year key date.' },
    { id: '1921', year: 1921, mintMark: undefined, mintage: 246000, estimatedSurvivors: 50000, rarity: 'key', notes: 'Lowest Philadelphia mintage of the series. Rare in VF and above.' },
    { id: '1921-D', year: 1921, mintMark: 'D', mintage: 208000, estimatedSurvivors: 40000, rarity: 'key', notes: 'Lowest mintage Walking Liberty. Very rare in any grade above Fine.' },
    { id: '1938-D', year: 1938, mintMark: 'D', mintage: 491600, estimatedSurvivors: 100000, rarity: 'key', notes: 'Final year key date. Low mintage and widely hoarded.' },
  ]
}

// ─── Barber Half Dollar (1892–1915) ──────────────────────────────────────────
const barberHalfKeyDates: SeriesKeyDates = {
  seriesId: 'barber-half',
  seriesName: 'Barber Half Dollar',
  entries: [
    { id: '1892-O-micro', year: 1892, mintMark: 'O', mintage: 390000, estimatedSurvivors: 50000, rarity: 'key', notes: '1892-O Micro O — Small mintmark variety. Very scarce.' },
    { id: '1897-O', year: 1897, mintMark: 'O', mintage: 632000, estimatedSurvivors: 60000, rarity: 'semi-key', notes: 'Semi-key date. Rare in EF and above.' },
    { id: '1897-S', year: 1897, mintMark: 'S', mintage: 933900, estimatedSurvivors: 80000, rarity: 'semi-key', notes: 'Semi-key. Hard to find above VF-30.' },
    { id: '1914', year: 1914, mintMark: undefined, mintage: 124230, estimatedSurvivors: 20000, rarity: 'key', notes: 'Key date. Very low Philadelphia mintage.' },
    { id: '1915', year: 1915, mintMark: undefined, mintage: 138450, estimatedSurvivors: 25000, rarity: 'key', notes: 'Final year key date. Very scarce in all grades.' },
  ]
}

// ─── Peace Dollar (1921–1935) ────────────────────────────────────────────────
const peaceDollarKeyDates: SeriesKeyDates = {
  seriesId: 'peace-dollar',
  seriesName: 'Peace Dollar',
  entries: [
    { id: '1921', year: 1921, mintMark: undefined, mintage: 1006473, estimatedSurvivors: 300000, rarity: 'key', notes: 'High Relief first year. Struck in high relief like the 1921 Morgan — very different from later issues.' },
    { id: '1928', year: 1928, mintMark: undefined, mintage: 360649, estimatedSurvivors: 100000, rarity: 'key', notes: 'Key date. Lowest regular Peace Dollar mintage. Scarce in all grades.' },
    { id: '1934-S', year: 1934, mintMark: 'S', mintage: 1011000, estimatedSurvivors: 200000, rarity: 'key', notes: 'Very rare in Mint State. Only ~20 known in MS-65.' },
    { id: '1935-S', year: 1935, mintMark: 'S', mintage: 1964000, estimatedSurvivors: 400000, rarity: 'semi-key', notes: 'Final year San Francisco. Scarce in MS-64 and above.' },
    { id: '1964-D', year: 1964, mintMark: 'D', mintage: 316000, estimatedSurvivors: 0, rarity: 'ultra-rare', notes: '1964-D — Struck but never released. All were melted by order of Treasury. None known to public.' },
  ]
}

// ─── Draped Bust Dollar (1795–1804) ─────────────────────────────────────────
const drapedBustDollarKeyDates: SeriesKeyDates = {
  seriesId: 'draped-bust-dollar',
  seriesName: 'Draped Bust Dollar',
  entries: [
    { id: '1804', year: 1804, mintMark: undefined, mintage: 19570, estimatedSurvivors: 15, rarity: 'ultra-rare', notes: '1804 Draped Bust Dollar — The "King of American Coins." Only 15 known examples. None struck in 1804; made as diplomatic gifts decades later. Last sold for $4.14M.' },
  ]
}

// ─── Double Eagle ($20 Gold) (1849–1933) ──────────────────────────────────────
const doubleEagleKeyDates: SeriesKeyDates = {
  seriesId: 'double-eagle',
  seriesName: 'Double Eagle ($20)',
  entries: [
    { id: '1849', year: 1849, mintMark: undefined, mintage: 1, estimatedSurvivors: 1, rarity: 'ultra-rare', notes: 'Only one known pattern example, housed at the Smithsonian.' },
    { id: '1927-D', year: 1927, mintMark: 'D', mintage: 180000, estimatedSurvivors: 15, rarity: 'ultra-rare', notes: '1927-D Saint-Gaudens — Nearly all were melted after FDR\'s gold recall. Only ~15 known survivors.' },
    { id: '1933', year: 1933, mintMark: undefined, mintage: 445500, estimatedSurvivors: 13, rarity: 'ultra-rare', notes: '1933 Saint-Gaudens — Never legally released. One example sold at auction for $18.87M in 2021, the most expensive coin ever sold.' },
  ]
}

// ─── All Series Combined ──────────────────────────────────────────────────────
export const ALL_KEY_DATES: SeriesKeyDates[] = [
  morganKeyDates,
  lincolnWheatKeyDates,
  indianHeadKeyDates,
  buffaloNickelKeyDates,
  libertyNickelKeyDates,
  mercuryDimeKeyDates,
  barberDimeKeyDates,
  standingLibertyKeyDates,
  barberQuarterKeyDates,
  walkingLibertyKeyDates,
  barberHalfKeyDates,
  peaceDollarKeyDates,
  drapedBustDollarKeyDates,
  doubleEagleKeyDates,
]

export function getKeyDatesForSeries(seriesId: string): SeriesKeyDates | undefined {
  return ALL_KEY_DATES.find(s => s.seriesId === seriesId)
}

export function formatMintage(mintage: number): string {
  if (mintage < 1000) return mintage.toLocaleString()
  if (mintage >= 1_000_000) return (mintage / 1_000_000).toFixed(2).replace(/\.?0+$/, '') + 'M'
  if (mintage >= 1_000) return (mintage / 1_000).toFixed(1).replace(/\.?0+$/, '') + 'K'
  return mintage.toLocaleString()
}

import { TrendingUp, Coins, ExternalLink, HelpCircle, Search, X, Calculator, Award, BarChart3, Package, LineChart } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

// Morgan Dollar data for quick lookup
const MORGAN_DOLLARS = [
  { year: 1878, mintMark: 'P', date: '1878', basePrice: 55 },
  { year: 1878, mintMark: 'O', date: '1878-O', basePrice: 65 },
  { year: 1878, mintMark: 'S', date: '1878-S', basePrice: 75 },
  { year: 1878, mintMark: 'CC', date: '1878-CC', basePrice: 250 },
  { year: 1879, mintMark: 'P', date: '1879', basePrice: 45 },
  { year: 1879, mintMark: 'O', date: '1879-O', basePrice: 48 },
  { year: 1879, mintMark: 'S', date: '1879-S', basePrice: 50 },
  { year: 1879, mintMark: 'CC', date: '1879-CC', basePrice: 180 },
  { year: 1880, mintMark: 'P', date: '1880', basePrice: 42 },
  { year: 1880, mintMark: 'O', date: '1880-O', basePrice: 45 },
  { year: 1880, mintMark: 'S', date: '1880-S', basePrice: 48 },
  { year: 1880, mintMark: 'CC', date: '1880-CC', basePrice: 160 },
  { year: 1881, mintMark: 'P', date: '1881', basePrice: 43 },
  { year: 1881, mintMark: 'O', date: '1881-O', basePrice: 46 },
  { year: 1881, mintMark: 'S', date: '1881-S', basePrice: 49 },
  { year: 1881, mintMark: 'CC', date: '1881-CC', basePrice: 175 },
  { year: 1882, mintMark: 'P', date: '1882', basePrice: 42 },
  { year: 1882, mintMark: 'O', date: '1882-O', basePrice: 44 },
  { year: 1882, mintMark: 'S', date: '1882-S', basePrice: 47 },
  { year: 1882, mintMark: 'CC', date: '1882-CC', basePrice: 155 },
  { year: 1883, mintMark: 'P', date: '1883', basePrice: 41 },
  { year: 1883, mintMark: 'O', date: '1883-O', basePrice: 43 },
  { year: 1883, mintMark: 'S', date: '1883-S', basePrice: 46 },
  { year: 1883, mintMark: 'CC', date: '1883-CC', basePrice: 350 },
  { year: 1884, mintMark: 'P', date: '1884', basePrice: 42 },
  { year: 1884, mintMark: 'O', date: '1884-O', basePrice: 44 },
  { year: 1884, mintMark: 'S', date: '1884-S', basePrice: 48 },
  { year: 1884, mintMark: 'CC', date: '1884-CC', basePrice: 280 },
  { year: 1885, mintMark: 'P', date: '1885', basePrice: 41 },
  { year: 1885, mintMark: 'O', date: '1885-O', basePrice: 43 },
  { year: 1885, mintMark: 'S', date: '1885-S', basePrice: 47 },
  { year: 1885, mintMark: 'CC', date: '1885-CC', basePrice: 320 },
  { year: 1886, mintMark: 'P', date: '1886', basePrice: 42 },
  { year: 1886, mintMark: 'O', date: '1886-O', basePrice: 45 },
  { year: 1886, mintMark: 'S', date: '1886-S', basePrice: 49 },
  { year: 1887, mintMark: 'P', date: '1887', basePrice: 43 },
  { year: 1887, mintMark: 'O', date: '1887-O', basePrice: 46 },
  { year: 1887, mintMark: 'S', date: '1887-S', basePrice: 50 },
  { year: 1888, mintMark: 'P', date: '1888', basePrice: 45 },
  { year: 1888, mintMark: 'O', date: '1888-O', basePrice: 48 },
  { year: 1888, mintMark: 'S', date: '1888-S', basePrice: 52 },
  { year: 1889, mintMark: 'P', date: '1889', basePrice: 48 },
  { year: 1889, mintMark: 'O', date: '1889-O', basePrice: 51 },
  { year: 1889, mintMark: 'S', date: '1889-S', basePrice: 55 },
  { year: 1889, mintMark: 'CC', date: '1889-CC', basePrice: 550 },
  { year: 1890, mintMark: 'P', date: '1890', basePrice: 48 },
  { year: 1890, mintMark: 'O', date: '1890-O', basePrice: 50 },
  { year: 1890, mintMark: 'S', date: '1890-S', basePrice: 53 },
  { year: 1890, mintMark: 'CC', date: '1890-CC', basePrice: 480 },
  { year: 1891, mintMark: 'P', date: '1891', basePrice: 52 },
  { year: 1891, mintMark: 'O', date: '1891-O', basePrice: 55 },
  { year: 1891, mintMark: 'S', date: '1891-S', basePrice: 58 },
  { year: 1891, mintMark: 'CC', date: '1891-CC', basePrice: 425 },
  { year: 1892, mintMark: 'P', date: '1892', basePrice: 56 },
  { year: 1892, mintMark: 'O', date: '1892-O', basePrice: 60 },
  { year: 1892, mintMark: 'S', date: '1892-S', basePrice: 65 },
  { year: 1892, mintMark: 'CC', date: '1892-CC', basePrice: 380 },
  { year: 1893, mintMark: 'P', date: '1893', basePrice: 85 },
  { year: 1893, mintMark: 'O', date: '1893-O', basePrice: 95 },
  { year: 1893, mintMark: 'S', date: '1893-S', basePrice: 110 },
  { year: 1893, mintMark: 'CC', date: '1893-CC', basePrice: 950 },
  { year: 1894, mintMark: 'P', date: '1894', basePrice: 120 },
  { year: 1894, mintMark: 'O', date: '1894-O', basePrice: 130 },
  { year: 1894, mintMark: 'S', date: '1894-S', basePrice: 145 },
  { year: 1895, mintMark: 'P', date: '1895', basePrice: 140 },
  { year: 1895, mintMark: 'O', date: '1895-O', basePrice: 155 },
  { year: 1895, mintMark: 'S', date: '1895-S', basePrice: 170 },
  { year: 1896, mintMark: 'P', date: '1896', basePrice: 50 },
  { year: 1896, mintMark: 'O', date: '1896-O', basePrice: 53 },
  { year: 1896, mintMark: 'S', date: '1896-S', basePrice: 57 },
  { year: 1897, mintMark: 'P', date: '1897', basePrice: 45 },
  { year: 1897, mintMark: 'O', date: '1897-O', basePrice: 48 },
  { year: 1897, mintMark: 'S', date: '1897-S', basePrice: 52 },
  { year: 1898, mintMark: 'P', date: '1898', basePrice: 42 },
  { year: 1898, mintMark: 'O', date: '1898-O', basePrice: 45 },
  { year: 1898, mintMark: 'S', date: '1898-S', basePrice: 49 },
  { year: 1899, mintMark: 'P', date: '1899', basePrice: 44 },
  { year: 1899, mintMark: 'O', date: '1899-O', basePrice: 47 },
  { year: 1899, mintMark: 'S', date: '1899-S', basePrice: 51 },
  { year: 1900, mintMark: 'P', date: '1900', basePrice: 42 },
  { year: 1900, mintMark: 'O', date: '1900-O', basePrice: 45 },
  { year: 1900, mintMark: 'S', date: '1900-S', basePrice: 49 },
  { year: 1901, mintMark: 'P', date: '1901', basePrice: 50 },
  { year: 1901, mintMark: 'O', date: '1901-O', basePrice: 53 },
  { year: 1901, mintMark: 'S', date: '1901-S', basePrice: 58 },
  { year: 1902, mintMark: 'P', date: '1902', basePrice: 44 },
  { year: 1902, mintMark: 'O', date: '1902-O', basePrice: 47 },
  { year: 1902, mintMark: 'S', date: '1902-S', basePrice: 51 },
  { year: 1903, mintMark: 'P', date: '1903', basePrice: 48 },
  { year: 1903, mintMark: 'O', date: '1903-O', basePrice: 51 },
  { year: 1903, mintMark: 'S', date: '1903-S', basePrice: 55 },
  { year: 1904, mintMark: 'P', date: '1904', basePrice: 46 },
  { year: 1904, mintMark: 'O', date: '1904-O', basePrice: 49 },
  { year: 1904, mintMark: 'S', date: '1904-S', basePrice: 53 },
  { year: 1921, mintMark: 'P', date: '1921', basePrice: 38 },
  { year: 1921, mintMark: 'O', date: '1921-O', basePrice: 40 },
  { year: 1921, mintMark: 'S', date: '1921-S', basePrice: 42 },
]

// Generate prices by grade
function getPricesByGrade(basePrice: number) {
  return {
    'VF-20': Math.round(basePrice * 0.4),
    'XF-45': Math.round(basePrice * 0.8),
    'AU-50': Math.round(basePrice),
    'MS-60': Math.round(basePrice * 2),
    'MS-63': Math.round(basePrice * 3),
    'MS-65': Math.round(basePrice * 4),
  }
}

type Page = 'home' | 'dashboard' | 'inventory' | 'forSale' | 'lookup' | 'explore' | 'series' | 'shop' | 'showcase' | 'about' | 'contact' | 'faq' | 'settings' | 'login' | 'register' | 'priceAdmin' | 'meltValues' | 'pcgsGrading' | 'stackIntel'

interface HomeProps {
  onNavigate?: (page: Page) => void
}

// Coin categories with their specific coin types
// PCGS Photograde URL format: https://www.pcgs.com/photograde/#/{slug}/grades
const COIN_CATEGORIES = [
  {
    id: 'dollars',
    label: 'Dollars',
    icon: '$1',
    coins: [
      { id: 'seated-dollar', label: 'Seated Liberty Dollar', years: '1840-1873' },
      { id: 'trade', label: 'Trade Dollar', years: '1873-1885' },
      { id: 'morgan', label: 'Morgan Dollar', years: '1878-1921' },
      { id: 'peace', label: 'Peace Dollar', years: '1921-1935' },
    ]
  },
  {
    id: 'half-dollars',
    label: 'Half Dollars',
    icon: '50¢',
    coins: [
      { id: 'capped-bust-half', label: 'Capped Bust Half', years: '1807-1839' },
      { id: 'seated-half', label: 'Seated Liberty Half', years: '1839-1891' },
      { id: 'barber-half', label: 'Barber Half Dollar', years: '1892-1915' },
      { id: 'walker', label: 'Walking Liberty Half', years: '1916-1947' },
      { id: 'franklin', label: 'Franklin Half', years: '1948-1963' },
      { id: 'kennedy', label: 'Kennedy Half', years: '1964-present' },
    ]
  },
  {
    id: 'quarters',
    label: 'Quarters',
    icon: '25¢',
    coins: [
      { id: 'capped-bust-quarter', label: 'Capped Bust Quarter', years: '1815-1838' },
      { id: 'seated-quarter', label: 'Seated Liberty Quarter', years: '1838-1891' },
      { id: 'barber-quarter', label: 'Barber Quarter', years: '1892-1916' },
      { id: 'standing-liberty', label: 'Standing Liberty Quarter', years: '1916-1930' },
      { id: 'washington', label: 'Washington Quarter', years: '1932-present' },
    ]
  },
  {
    id: 'dimes',
    label: 'Dimes',
    icon: '10¢',
    coins: [
      { id: 'capped-bust-dime', label: 'Capped Bust Dime', years: '1809-1837' },
      { id: 'seated-dime', label: 'Seated Liberty Dime', years: '1837-1891' },
      { id: 'barber-dime', label: 'Barber Dime', years: '1892-1916' },
      { id: 'mercury', label: 'Mercury Dime', years: '1916-1945' },
      { id: 'roosevelt', label: 'Roosevelt Dime', years: '1946-present' },
    ]
  },
  {
    id: 'nickels',
    label: 'Nickels',
    icon: '5¢',
    coins: [
      { id: 'shield-nickel', label: 'Shield Nickel', years: '1866-1883' },
      { id: 'liberty-nickel', label: 'Liberty (V) Nickel', years: '1883-1913' },
      { id: 'buffalo', label: 'Buffalo Nickel', years: '1913-1938' },
      { id: 'jefferson', label: 'Jefferson Nickel', years: '1938-present' },
    ]
  },
  {
    id: 'cents',
    label: 'Cents',
    icon: '1¢',
    coins: [
      { id: 'classic-head', label: 'Classic Head Large Cent', years: '1808-1814' },
      { id: 'coronet', label: 'Coronet Head Large Cent', years: '1816-1839' },
      { id: 'braided-hair', label: 'Braided Hair Large Cent', years: '1839-1857' },
      { id: 'flying-eagle', label: 'Flying Eagle Cent', years: '1856-1858' },
      { id: 'indian', label: 'Indian Head Cent', years: '1859-1909' },
      { id: 'lincoln', label: 'Lincoln Cent', years: '1909-present' },
    ]
  },
  {
    id: 'gold',
    label: 'Gold',
    icon: 'Au',
    coins: [
      { id: 'liberty-eagle', label: 'Liberty $10 Eagle', years: '1838-1907' },
      { id: 'liberty-half-eagle', label: 'Liberty $5 Half Eagle', years: '1839-1908' },
      { id: 'liberty-quarter-eagle', label: 'Liberty $2.50', years: '1840-1907' },
      { id: 'gold-dollar', label: 'Gold Dollar', years: '1849-1889' },
      { id: 'liberty-double-eagle', label: 'Liberty $20', years: '1850-1907' },
      { id: 'saint-gaudens', label: 'Saint-Gaudens $20', years: '1907-1933' },
      { id: 'indian-eagle', label: 'Indian $10 Eagle', years: '1907-1933' },
      { id: 'indian-half-eagle', label: 'Indian $5 Half Eagle', years: '1908-1929' },
      { id: 'indian-quarter-eagle', label: 'Indian $2.50', years: '1908-1929' },
    ]
  },
]

export function Home({ onNavigate }: HomeProps) {
  const tickerRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const [selectedCategory, setSelectedCategory] = useState('dollars')
  const [selectedCoin, setSelectedCoin] = useState('morgan')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<typeof MORGAN_DOLLARS>([])
  const [showResults, setShowResults] = useState(false)
  const [selectedResult, setSelectedResult] = useState<typeof MORGAN_DOLLARS[0] | null>(null)

  // Get current category and its coins
  const currentCategory = COIN_CATEGORIES.find(c => c.id === selectedCategory)
  const currentCoin = currentCategory?.coins.find(c => c.id === selectedCoin)

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId)
    const category = COIN_CATEGORIES.find(c => c.id === categoryId)
    if (category && category.coins.length > 0) {
      setSelectedCoin(category.coins[0].id)
    }
  }

  // Search for Morgan dollars
  const handleSearch = (query: string) => {
    setSearchQuery(query)
    if (query.length === 0) {
      setSearchResults([])
      setShowResults(false)
      return
    }

    const q = query.toLowerCase().replace('-', '').replace(' ', '')
    const results = MORGAN_DOLLARS.filter(coin => {
      const dateNormalized = coin.date.toLowerCase().replace('-', '')
      const yearStr = coin.year.toString()
      return dateNormalized.includes(q) || yearStr.includes(q) || coin.mintMark.toLowerCase() === q
    }).slice(0, 10)

    setSearchResults(results)
    setShowResults(results.length > 0)
  }

  const handleSelectResult = (coin: typeof MORGAN_DOLLARS[0]) => {
    setSelectedResult(coin)
    setSearchQuery(coin.date)
    setShowResults(false)
  }

  const clearSearch = () => {
    setSearchQuery('')
    setSearchResults([])
    setShowResults(false)
    setSelectedResult(null)
    searchInputRef.current?.focus()
  }

  // Load TradingView Ticker Tape widget for live spot prices
  useEffect(() => {
    if (!tickerRef.current) return

    // Clear any existing content
    tickerRef.current.innerHTML = ''

    const script = document.createElement('script')
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js'
    script.async = true
    script.innerHTML = JSON.stringify({
      symbols: [
        { proName: 'OANDA:XAUUSD', title: 'Gold' },
        { proName: 'OANDA:XAGUSD', title: 'Silver' },
        { proName: 'OANDA:XPTUSD', title: 'Platinum' },
      ],
      showSymbolLogo: false,
      colorTheme: 'light',
      isTransparent: true,
      displayMode: 'compact',
      locale: 'en',
    })

    tickerRef.current.appendChild(script)
  }, [])

  const handleStartTracking = () => {
    if (onNavigate) {
      onNavigate('inventory')
    }
  }

  const handleViewMeltValues = () => {
    if (onNavigate) {
      onNavigate('meltValues')
    }
  }

  const handleViewPCGSGrading = () => {
    if (onNavigate) {
      onNavigate('pcgsGrading')
    }
  }

  // Example collection data for the visual
  const exampleCollection = [
    { name: '1921 Morgan Dollar', grade: 'MS-64', value: '$85' },
    { name: '1922 Peace Dollar', grade: 'MS-63', value: '$52' },
    { name: '2024 Silver Eagle', grade: 'MS-70', value: '$45' },
    { name: '1889-O Morgan Dollar', grade: 'VF-35', value: '$42' },
  ]

  return (
    <div className="space-y-12">
      {/* Welcome Header */}
      <div className="pt-4">
        <h1 className="text-2xl md:text-3xl font-bold text-white text-center mb-2">
          Coin Collector Tools
        </h1>
        <p className="text-slate-400 text-center mb-8">
          Melt values, grading references, portfolio tracking, and more
        </p>

        {/* Tools Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 max-w-4xl mx-auto">
        <button
          onClick={handleViewMeltValues}
          className="flex flex-col items-center gap-2 p-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 rounded-xl transition-all group"
        >
          <Calculator className="w-8 h-8 text-amber-400 group-hover:scale-110 transition-transform" />
          <span className="text-white font-medium text-sm">Melt Values</span>
        </button>
        <button
          onClick={handleViewPCGSGrading}
          className="flex flex-col items-center gap-2 p-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 rounded-xl transition-all group"
        >
          <Award className="w-8 h-8 text-blue-400 group-hover:scale-110 transition-transform" />
          <span className="text-white font-medium text-sm">PCGS Grading</span>
        </button>
        <button
          onClick={() => onNavigate?.('stackIntel')}
          className="flex flex-col items-center gap-2 p-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 rounded-xl transition-all group"
        >
          <BarChart3 className="w-8 h-8 text-green-400 group-hover:scale-110 transition-transform" />
          <span className="text-white font-medium text-sm">Stack Intel</span>
        </button>
        <button
          onClick={handleStartTracking}
          className="flex flex-col items-center gap-2 p-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 rounded-xl transition-all group"
        >
          <Package className="w-8 h-8 text-purple-400 group-hover:scale-110 transition-transform" />
          <span className="text-white font-medium text-sm">Inventory</span>
        </button>
        <button
          onClick={() => onNavigate?.('dashboard')}
          className="flex flex-col items-center gap-2 p-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 rounded-xl transition-all group col-span-2 sm:col-span-1"
        >
          <LineChart className="w-8 h-8 text-cyan-400 group-hover:scale-110 transition-transform" />
          <span className="text-white font-medium text-sm">Spot Charts</span>
        </button>
        </div>
      </div>

      {/* Live Spot Prices - TradingView Ticker */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl p-4 max-w-4xl mx-auto overflow-hidden border border-slate-700">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-slate-400 text-sm font-medium">LIVE SPOT PRICES</span>
        </div>
        <div
          ref={tickerRef}
          className="tradingview-widget-container"
          style={{ height: '46px' }}
        >
          <div className="tradingview-widget-container__widget"></div>
        </div>
      </div>

      {/* Quick Coin Lookup */}
      <div className="bg-slate-800 rounded-2xl shadow-xl p-6 md:p-8 max-w-4xl mx-auto border border-slate-700">
        <div className="text-center mb-6">
          <h3 className="text-2xl md:text-3xl font-bold text-white">Quick Coin Lookup</h3>
          <p className="text-slate-400 mt-1">Search for Morgan Dollars by year and mint mark</p>
        </div>

        {/* Search Input */}
        <div className="relative max-w-xl mx-auto mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              onFocus={() => searchResults.length > 0 && setShowResults(true)}
              placeholder="Type year or date (e.g., 1921, 1889-CC, 1878-S)"
              className="w-full pl-12 pr-12 py-4 text-lg bg-slate-700 border-2 border-slate-600 rounded-xl text-white placeholder-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Search Results Dropdown */}
          {showResults && searchResults.length > 0 && (
            <div className="absolute z-50 w-full mt-2 bg-slate-700 border border-slate-600 rounded-xl shadow-lg overflow-hidden">
              {searchResults.map((coin, idx) => (
                <button
                  key={`${coin.date}-${idx}`}
                  onClick={() => handleSelectResult(coin)}
                  className="w-full px-4 py-3 text-left hover:bg-slate-600 flex items-center justify-between border-b border-slate-600 last:border-b-0"
                >
                  <div>
                    <span className="font-bold text-white">{coin.date}</span>
                    <span className="text-slate-400 ml-2">Morgan Dollar</span>
                  </div>
                  <span className="text-blue-400 font-semibold">${coin.basePrice}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Selected Coin Details */}
        {selectedResult && (
          <div className="bg-gradient-to-br from-amber-900/30 to-yellow-900/20 rounded-xl p-6 border border-amber-700/50">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center">
                  <Coins className="w-8 h-8 text-amber-100" />
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-white">{selectedResult.date} Morgan Dollar</h4>
                  <p className="text-slate-300">
                    {selectedResult.mintMark === 'P' ? 'Philadelphia' :
                     selectedResult.mintMark === 'O' ? 'New Orleans' :
                     selectedResult.mintMark === 'S' ? 'San Francisco' : 'Carson City'} Mint
                    {selectedResult.mintMark === 'CC' && <span className="ml-2 text-amber-400 font-medium">(Rare)</span>}
                  </p>
                </div>
              </div>
              <a
                href={`https://www.pcgs.com/coinfacts/coin/${selectedResult.year}-morgan-dollar/7${selectedResult.year < 1900 ? '0' : '1'}${selectedResult.year % 100}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold transition-colors"
              >
                View on PCGS
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            {/* Price Grid by Grade */}
            <div className="mt-6">
              <h5 className="text-sm font-semibold text-slate-300 mb-3">Estimated Values by Grade</h5>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                {Object.entries(getPricesByGrade(selectedResult.basePrice)).map(([grade, price]) => (
                  <div key={grade} className="bg-slate-700/50 rounded-lg p-3 text-center border border-slate-600">
                    <p className="text-xs font-medium text-slate-400">{grade}</p>
                    <p className="text-lg font-bold text-white">${price}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Quick Examples */}
        {!selectedResult && (
          <div className="text-center">
            <p className="text-sm text-slate-500 mb-3">Try searching:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {['1921', '1889-CC', '1878-S', '1893-O', '1884-CC'].map(example => (
                <button
                  key={example}
                  onClick={() => handleSearch(example)}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg font-medium text-sm transition-colors"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* PCGS Photograde Quick Access */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-xl p-6 md:p-8 max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-2xl md:text-3xl font-bold text-white">PCGS Photograde</h3>
            <p className="text-slate-400 mt-1">Select a denomination, then choose your coin</p>
          </div>
          <button
            onClick={handleViewPCGSGrading}
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors"
          >
            <HelpCircle className="w-5 h-5" />
            Full Guide
          </button>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {COIN_CATEGORIES.map(category => (
            <button
              key={category.id}
              onClick={() => handleCategorySelect(category.id)}
              className={`px-4 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 ${
                selectedCategory === category.id
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white'
              }`}
            >
              <span className="text-xs font-mono bg-black/20 px-2 py-0.5 rounded">{category.icon}</span>
              {category.label}
            </button>
          ))}
        </div>

        {/* Coins in Selected Category */}
        {currentCategory && (
          <div className="bg-slate-700/50 rounded-xl p-4 mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {currentCategory.coins.map(coin => (
                <button
                  key={coin.id}
                  onClick={() => setSelectedCoin(coin.id)}
                  className={`p-4 rounded-lg text-left transition-all duration-200 ${
                    selectedCoin === coin.id
                      ? 'bg-blue-600 text-white shadow-lg ring-2 ring-blue-400'
                      : 'bg-slate-600 text-slate-200 hover:bg-slate-500'
                  }`}
                >
                  <p className="font-bold">{coin.label}</p>
                  <p className={`text-sm mt-1 ${selectedCoin === coin.id ? 'text-blue-200' : 'text-slate-400'}`}>
                    {coin.years}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Selected Coin Action */}
        {currentCoin && (
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="text-blue-200 text-sm font-medium">Selected Coin</p>
                <h4 className="text-2xl font-bold text-white">{currentCoin.label}</h4>
                <p className="text-blue-200 mt-1">{currentCoin.years}</p>
              </div>
              <a
                href={`https://www.pcgs.com/photograde/#/${selectedCoin}/grades`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-4 bg-white hover:bg-gray-100 text-blue-700 rounded-lg font-bold text-lg transition-all shadow-lg hover:shadow-xl whitespace-nowrap group"
              >
                View on PCGS
                <ExternalLink className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Example Collection Visual */}
      <div className="bg-slate-800 rounded-2xl shadow-xl p-8 max-w-4xl mx-auto border border-slate-700">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-white">My Collection</h3>
            <p className="text-sm text-slate-400">4 coins · Total Value: $224</p>
          </div>
          <div className="flex items-center gap-2 text-green-400">
            <TrendingUp className="w-5 h-5" />
            <span className="font-medium">+$18 today</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {exampleCollection.map((coin, index) => (
            <div
              key={index}
              className="flex items-center gap-4 p-4 bg-slate-700/50 rounded-lg border border-slate-600"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center">
                <Coins className="w-6 h-6 text-amber-100" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-white">{coin.name}</p>
                <p className="text-sm text-slate-400">{coin.grade}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-white">{coin.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

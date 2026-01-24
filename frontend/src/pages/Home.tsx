import { TrendingUp, Coins, ChevronRight, ExternalLink, HelpCircle } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

type Page = 'home' | 'dashboard' | 'inventory' | 'forSale' | 'lookup' | 'explore' | 'series' | 'shop' | 'showcase' | 'about' | 'contact' | 'faq' | 'settings' | 'login' | 'register' | 'priceAdmin' | 'meltValues' | 'pcgsGrading'

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
      { id: 'morgan', label: 'Morgan Dollar', years: '1878-1921' },
      { id: 'peace', label: 'Peace Dollar', years: '1921-1935' },
      { id: 'seated-dollar', label: 'Seated Liberty Dollar', years: '1840-1873' },
      { id: 'trade', label: 'Trade Dollar', years: '1873-1885' },
    ]
  },
  {
    id: 'half-dollars',
    label: 'Half Dollars',
    icon: '50¢',
    coins: [
      { id: 'walker', label: 'Walking Liberty Half', years: '1916-1947' },
      { id: 'franklin', label: 'Franklin Half', years: '1948-1963' },
      { id: 'kennedy', label: 'Kennedy Half', years: '1964-present' },
      { id: 'barber-half', label: 'Barber Half Dollar', years: '1892-1915' },
      { id: 'seated-half', label: 'Seated Liberty Half', years: '1839-1891' },
      { id: 'capped-bust-half', label: 'Capped Bust Half', years: '1807-1839' },
    ]
  },
  {
    id: 'quarters',
    label: 'Quarters',
    icon: '25¢',
    coins: [
      { id: 'standing-liberty', label: 'Standing Liberty Quarter', years: '1916-1930' },
      { id: 'washington', label: 'Washington Quarter', years: '1932-present' },
      { id: 'barber-quarter', label: 'Barber Quarter', years: '1892-1916' },
      { id: 'seated-quarter', label: 'Seated Liberty Quarter', years: '1838-1891' },
      { id: 'capped-bust-quarter', label: 'Capped Bust Quarter', years: '1815-1838' },
    ]
  },
  {
    id: 'dimes',
    label: 'Dimes',
    icon: '10¢',
    coins: [
      { id: 'mercury', label: 'Mercury Dime', years: '1916-1945' },
      { id: 'roosevelt', label: 'Roosevelt Dime', years: '1946-present' },
      { id: 'barber-dime', label: 'Barber Dime', years: '1892-1916' },
      { id: 'seated-dime', label: 'Seated Liberty Dime', years: '1837-1891' },
      { id: 'capped-bust-dime', label: 'Capped Bust Dime', years: '1809-1837' },
    ]
  },
  {
    id: 'nickels',
    label: 'Nickels',
    icon: '5¢',
    coins: [
      { id: 'buffalo', label: 'Buffalo Nickel', years: '1913-1938' },
      { id: 'jefferson', label: 'Jefferson Nickel', years: '1938-present' },
      { id: 'liberty-nickel', label: 'Liberty (V) Nickel', years: '1883-1913' },
      { id: 'shield-nickel', label: 'Shield Nickel', years: '1866-1883' },
    ]
  },
  {
    id: 'cents',
    label: 'Cents',
    icon: '1¢',
    coins: [
      { id: 'lincoln', label: 'Lincoln Cent', years: '1909-present' },
      { id: 'indian', label: 'Indian Head Cent', years: '1859-1909' },
      { id: 'flying-eagle', label: 'Flying Eagle Cent', years: '1856-1858' },
      { id: 'braided-hair', label: 'Braided Hair Large Cent', years: '1839-1857' },
      { id: 'coronet', label: 'Coronet Head Large Cent', years: '1816-1839' },
      { id: 'classic-head', label: 'Classic Head Large Cent', years: '1808-1814' },
    ]
  },
  {
    id: 'gold',
    label: 'Gold',
    icon: 'Au',
    coins: [
      { id: 'saint-gaudens', label: 'Saint-Gaudens $20', years: '1907-1933' },
      { id: 'liberty-double-eagle', label: 'Liberty $20', years: '1850-1907' },
      { id: 'liberty-eagle', label: 'Liberty $10 Eagle', years: '1838-1907' },
      { id: 'indian-eagle', label: 'Indian $10 Eagle', years: '1907-1933' },
      { id: 'liberty-half-eagle', label: 'Liberty $5 Half Eagle', years: '1839-1908' },
      { id: 'indian-half-eagle', label: 'Indian $5 Half Eagle', years: '1908-1929' },
      { id: 'liberty-quarter-eagle', label: 'Liberty $2.50', years: '1840-1907' },
      { id: 'indian-quarter-eagle', label: 'Indian $2.50', years: '1908-1929' },
      { id: 'gold-dollar', label: 'Gold Dollar', years: '1849-1889' },
    ]
  },
]

export function Home({ onNavigate }: HomeProps) {
  const tickerRef = useRef<HTMLDivElement>(null)
  const [selectedCategory, setSelectedCategory] = useState('dollars')
  const [selectedCoin, setSelectedCoin] = useState('morgan')

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
      {/* Hero Section */}
      <div className="text-center space-y-6 py-8">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900">
          Track Your Coin Collection
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto">
          Free inventory tool with live pricing.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <button
            onClick={handleStartTracking}
            className="px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            Start Tracking
            <ChevronRight className="w-5 h-5" />
          </button>
          <button
            onClick={handleViewMeltValues}
            className="px-8 py-4 bg-white text-gray-700 text-lg font-semibold rounded-lg border-2 border-gray-300 hover:border-gray-400 transition-colors flex items-center justify-center gap-2"
          >
            Melt Values
          </button>
        </div>
      </div>

      {/* Live Spot Prices - TradingView Ticker */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-4 max-w-4xl mx-auto overflow-hidden">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-gray-400 text-sm font-medium">LIVE SPOT PRICES</span>
        </div>
        <div
          ref={tickerRef}
          className="tradingview-widget-container"
          style={{ height: '46px' }}
        >
          <div className="tradingview-widget-container__widget"></div>
        </div>
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
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">My Collection</h3>
            <p className="text-sm text-gray-500">4 coins · Total Value: $224</p>
          </div>
          <div className="flex items-center gap-2 text-green-600">
            <TrendingUp className="w-5 h-5" />
            <span className="font-medium">+$18 today</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {exampleCollection.map((coin, index) => (
            <div
              key={index}
              className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-amber-200 to-amber-400 rounded-full flex items-center justify-center">
                <Coins className="w-6 h-6 text-amber-700" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{coin.name}</p>
                <p className="text-sm text-gray-500">{coin.grade}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">{coin.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

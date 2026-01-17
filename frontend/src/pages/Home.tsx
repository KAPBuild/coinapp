import { TrendingUp, Coins, ChevronRight } from 'lucide-react'
import { useEffect, useRef } from 'react'

type Page = 'home' | 'dashboard' | 'inventory' | 'forSale' | 'lookup' | 'explore' | 'series' | 'shop' | 'showcase' | 'about' | 'contact' | 'faq' | 'settings' | 'login' | 'register' | 'priceAdmin' | 'meltValues'

interface HomeProps {
  onNavigate?: (page: Page) => void
}

export function Home({ onNavigate }: HomeProps) {
  const tickerRef = useRef<HTMLDivElement>(null)

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

  const handleViewLookup = () => {
    if (onNavigate) {
      onNavigate('lookup')
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
            onClick={handleViewLookup}
            className="px-8 py-4 bg-white text-gray-700 text-lg font-semibold rounded-lg border-2 border-gray-300 hover:border-gray-400 transition-colors flex items-center justify-center gap-2"
          >
            Browse Coin Prices
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

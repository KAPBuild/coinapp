import { TrendingUp, Coins, BarChart3, Users, Shield, Zap, ChevronRight, Star } from 'lucide-react'
import { useState, useEffect } from 'react'

type Page = 'home' | 'dashboard' | 'inventory' | 'forSale' | 'lookup' | 'explore' | 'series' | 'shop' | 'showcase' | 'about' | 'contact' | 'faq' | 'settings' | 'login' | 'register' | 'priceAdmin' | 'meltValues'

interface HomeProps {
  onNavigate?: (page: Page) => void
}

export function Home({ onNavigate }: HomeProps) {
  const [prices, setPrices] = useState<{ gold: number | null; silver: number | null; platinum: number | null }>({
    gold: null,
    silver: null,
    platinum: null,
  })

  // Fetch spot prices from free API
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await fetch('https://api.metals.live/v1/spot/metals?currencies=usd')
        const data = await response.json()
        setPrices({
          gold: data.metals?.gold || null,
          silver: data.metals?.silver || null,
          platinum: data.metals?.platinum || null,
        })
      } catch (error) {
        console.error('Failed to fetch spot prices:', error)
        setPrices({
          gold: 2650,
          silver: 31.50,
          platinum: 980,
        })
      }
    }

    fetchPrices()
    const interval = setInterval(fetchPrices, 5 * 60 * 1000)
    return () => clearInterval(interval)
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
    <div className="space-y-16">
      {/* Hero Section */}
      <div className="text-center space-y-6 py-12">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900">
          Track Your Coin Collection
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto">
          Free inventory tool with live pricing. Know exactly what you own and what it's worth.
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
        <p className="text-sm text-gray-500">No credit card required. Free forever.</p>
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
        <div className="mt-6 pt-6 border-t border-gray-100 text-center">
          <p className="text-sm text-gray-500">
            This is an example. Your collection will look just like this!
          </p>
        </div>
      </div>

      {/* Live Spot Prices Bar */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-gray-400 text-sm font-medium">LIVE SPOT PRICES</span>
          </div>
          <div className="flex flex-wrap gap-6 md:gap-12">
            <div className="text-center">
              <p className="text-gray-400 text-xs uppercase">Gold</p>
              <p className="text-white text-xl font-bold">
                ${prices.gold?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '---'}
              </p>
            </div>
            <div className="text-center">
              <p className="text-gray-400 text-xs uppercase">Silver</p>
              <p className="text-white text-xl font-bold">
                ${prices.silver?.toFixed(2) || '---'}
              </p>
            </div>
            <div className="text-center">
              <p className="text-gray-400 text-xs uppercase">Platinum</p>
              <p className="text-white text-xl font-bold">
                ${prices.platinum?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '---'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Value Propositions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto">
            <Zap className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Auto-Pricing</h3>
          <p className="text-gray-600">
            Add a coin and we'll automatically look up its current market value. No manual research needed.
          </p>
        </div>

        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto">
            <BarChart3 className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Track Your Stack</h3>
          <p className="text-gray-600">
            See your total portfolio value, track gains, and watch your collection grow over time.
          </p>
        </div>

        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto">
            <Shield className="w-8 h-8 text-purple-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">PCGS Grading Guide</h3>
          <p className="text-gray-600">
            Estimate your coin grades using our built-in PCGS grading scale reference with visual examples.
          </p>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-gray-50 rounded-2xl p-8 md:p-12 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="relative">
            <div className="absolute -left-4 top-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
              1
            </div>
            <div className="pl-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Add Your Coins</h4>
              <p className="text-gray-600">
                Enter coin type, year, mint mark, and grade. We support Morgan Dollars, Peace Dollars, Silver Eagles, and more.
              </p>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -left-4 top-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
              2
            </div>
            <div className="pl-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Get Live Values</h4>
              <p className="text-gray-600">
                We automatically look up current prices from PCGS, NGC, and market data so you know what each coin is worth.
              </p>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -left-4 top-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
              3
            </div>
            <div className="pl-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Track Your Portfolio</h4>
              <p className="text-gray-600">
                Watch your collection value grow, see set completion progress, and track your investment performance.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Collector Types */}
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">Built For Collectors & Stackers</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-4">
              <Coins className="w-8 h-8 text-amber-600" />
              <h3 className="text-xl font-bold text-gray-900">For Stackers</h3>
            </div>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-2">
                <Star className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <span>Track your silver and gold bullion investments</span>
              </li>
              <li className="flex items-start gap-2">
                <Star className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <span>See melt values vs numismatic premiums</span>
              </li>
              <li className="flex items-start gap-2">
                <Star className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <span>Monitor portfolio gains in real-time</span>
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-8 h-8 text-blue-600" />
              <h3 className="text-xl font-bold text-gray-900">For Collectors</h3>
            </div>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-2">
                <Star className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <span>Track set completion (e.g., Morgan Dollars 47/96)</span>
              </li>
              <li className="flex items-start gap-2">
                <Star className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <span>See which dates and mint marks you're missing</span>
              </li>
              <li className="flex items-start gap-2">
                <Star className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <span>Access rarity data and mintage numbers</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-12 text-center text-white max-w-4xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Track Your Collection?</h2>
        <p className="text-lg text-blue-100 mb-8 max-w-xl mx-auto">
          Join collectors and stackers who use CoinApp to manage their portfolios. Free forever, no credit card required.
        </p>
        <button
          onClick={handleStartTracking}
          className="px-10 py-4 bg-white text-blue-600 text-lg font-semibold rounded-lg hover:bg-blue-50 transition-colors shadow-lg inline-flex items-center gap-2"
        >
          Start Tracking Now
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}

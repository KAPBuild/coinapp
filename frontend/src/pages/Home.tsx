import { TrendingUp, Zap, Award } from 'lucide-react'
import { useState } from 'react'

export function Home() {
  const [activeTab, setActiveTab] = useState<'gold' | 'silver' | 'platinum'>('gold')

  const tabs = [
    { id: 'gold', label: 'Gold (XAU/USD)', symbol: 'OANDA:XAUUSD' },
    { id: 'silver', label: 'Silver (XAG/USD)', symbol: 'OANDA:XAGUSD' },
    { id: 'platinum', label: 'Platinum (XPT/USD)', symbol: 'OANDA:XPTUSD' },
  ]

  const getSymbol = () => {
    const tab = tabs.find(t => t.id === activeTab)
    return tab?.symbol || 'OANDA:XAUUSD'
  }

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-4 py-6">
        <h1 className="text-5xl font-bold text-gray-900">CoinApp</h1>
        <p className="text-2xl text-gray-600">Your Premier Coin Investment Portfolio Tracker</p>
      </div>

      {/* Interactive Spot Price Chart */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Live Spot Prices</h2>
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-gray-200 bg-gray-50">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-4 font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Chart Container */}
          <div className="p-4">
            <iframe
              key={activeTab}
              src={`https://www.tradingview.com/embed-widget/advanced-chart/?symbol=${getSymbol()}&interval=D&timezone=Etc%2FUTC&theme=light&style=1&locale=en&allow_symbol_change=false&details=true&hotlist=false&calendar=false&show_popup_button=true&popup_width=400&popup_height=600&utm_source=&utm_medium=widget_new&utm_campaign=advanced-chart`}
              style={{ width: '100%', height: '600px', border: 'none' }}
              title="Advanced Chart"
              allowFullScreen
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; gyroscope; picture-in-picture"
            />
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <Award className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Manage Portfolio</h3>
          </div>
          <p className="text-gray-700">
            Track your entire coin collection with detailed valuations, purchase dates, and grading information.
          </p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Live Pricing</h3>
          </div>
          <p className="text-gray-700">
            Access real-time spot prices for gold, silver, and platinum directly from TradingView.
          </p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Quick Lookup</h3>
          </div>
          <p className="text-gray-700">
            Search Morgan dollars and other coins by year and mint mark with current PCGS/NGC valuations.
          </p>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-12 text-center text-white space-y-4">
        <h2 className="text-3xl font-bold">Ready to Track Your Collection?</h2>
        <p className="text-lg text-blue-100">Start building your portfolio dashboard today with real-time coin valuations.</p>
        <button className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
          Get Started
        </button>
      </div>
    </div>
  )
}

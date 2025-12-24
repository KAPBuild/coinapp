import { TrendingUp, Zap, Award } from 'lucide-react'

export function Home() {

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-4 py-12">
        <h1 className="text-5xl font-bold text-gray-900">CoinApp</h1>
        <p className="text-2xl text-gray-600">Your Premier Coin Investment Portfolio Tracker</p>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto">
          Track your numismatic investments, monitor spot prices, and manage your coin collection with professional-grade tools.
        </p>
      </div>

      {/* Spot Price Widgets */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-6">Live Spot Prices</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Gold */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Gold (XAU/USD)</h3>
            <iframe
              src="https://www.tradingview.com/embed-widget/mini-symbol-overview/?symbol=OANDA:XAUUSD&utm_source=&utm_medium=widget_new&utm_campaign=mini-symbol-overview&utm_content=en"
              width="100%"
              height="220"
              style={{ border: 'none', borderRadius: '8px' }}
              title="Gold Price Widget"
              allowFullScreen
            />
          </div>

          {/* Silver */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Silver (XAG/USD)</h3>
            <iframe
              src="https://www.tradingview.com/embed-widget/mini-symbol-overview/?symbol=OANDA:XAGUSD&utm_source=&utm_medium=widget_new&utm_campaign=mini-symbol-overview&utm_content=en"
              width="100%"
              height="220"
              style={{ border: 'none', borderRadius: '8px' }}
              title="Silver Price Widget"
              allowFullScreen
            />
          </div>

          {/* Platinum */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Platinum (XPT/USD)</h3>
            <iframe
              src="https://www.tradingview.com/embed-widget/mini-symbol-overview/?symbol=OANDA:XPTUSD&utm_source=&utm_medium=widget_new&utm_campaign=mini-symbol-overview&utm_content=en"
              width="100%"
              height="220"
              style={{ border: 'none', borderRadius: '8px' }}
              title="Platinum Price Widget"
              allowFullScreen
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

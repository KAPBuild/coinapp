import { useState, useEffect } from 'react'
import { RefreshCw, TrendingUp, Coins, DollarSign } from 'lucide-react'

interface CoinMeltData {
  id: string
  name: string
  series: string
  years: string
  denomination: string
  composition: string
  weightGrams: number
  asw: number
  agw?: number
  metalType: 'silver' | 'gold' | 'platinum' | 'copper-nickel'
  meltValue: number
  spotPrice: number
}

interface MeltResponse {
  spotPrices: { gold: number; silver: number; platinum: number }
  lastUpdated: string
  silverCoins: CoinMeltData[]
  goldCoins: CoinMeltData[]
}

export function MeltValues() {
  const [data, setData] = useState<MeltResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState<'silver' | 'gold'>('silver')
  const [refreshing, setRefreshing] = useState(false)

  const fetchMeltValues = async () => {
    try {
      setRefreshing(true)

      // Try to fetch from backend API
      const response = await fetch('/api/melt')

      if (response.ok) {
        const result = await response.json()
        setData(result)
        setError('')
      } else {
        // Fallback: calculate locally with live spot prices
        await fetchLocalMeltValues()
      }
    } catch (err) {
      // Fallback: calculate locally
      await fetchLocalMeltValues()
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const fetchLocalMeltValues = async () => {
    try {
      // Fetch spot prices
      let spotPrices = { gold: 2050, silver: 24.50, platinum: 950 }
      try {
        const priceResponse = await fetch('https://api.metals.live/v1/spot/metals?currencies=usd')
        const priceData = await priceResponse.json()
        spotPrices = {
          gold: priceData.metals?.gold || 2050,
          silver: priceData.metals?.silver || 24.50,
          platinum: priceData.metals?.platinum || 950,
        }
      } catch {
        // Use fallback prices
      }

      // Hardcoded coin data (matches backend)
      const silverCoins: CoinMeltData[] = [
        { id: 'jefferson-wartime', name: 'Jefferson Nickel (Wartime)', series: 'Jefferson Nickel', years: '1942-1945', denomination: '$0.05', composition: '35% Silver', weightGrams: 5.0, asw: 0.05626, metalType: 'silver', meltValue: 0.05626 * spotPrices.silver, spotPrice: spotPrices.silver },
        { id: 'barber-dime', name: 'Barber Dime', series: 'Barber Dime', years: '1892-1916', denomination: '$0.10', composition: '90% Silver', weightGrams: 2.5, asw: 0.07234, metalType: 'silver', meltValue: 0.07234 * spotPrices.silver, spotPrice: spotPrices.silver },
        { id: 'mercury-dime', name: 'Mercury Dime', series: 'Mercury Dime', years: '1916-1945', denomination: '$0.10', composition: '90% Silver', weightGrams: 2.5, asw: 0.07234, metalType: 'silver', meltValue: 0.07234 * spotPrices.silver, spotPrice: spotPrices.silver },
        { id: 'roosevelt-dime-silver', name: 'Roosevelt Dime (Silver)', series: 'Roosevelt Dime', years: '1946-1964', denomination: '$0.10', composition: '90% Silver', weightGrams: 2.5, asw: 0.07234, metalType: 'silver', meltValue: 0.07234 * spotPrices.silver, spotPrice: spotPrices.silver },
        { id: 'barber-quarter', name: 'Barber Quarter', series: 'Barber Quarter', years: '1892-1916', denomination: '$0.25', composition: '90% Silver', weightGrams: 6.25, asw: 0.18084, metalType: 'silver', meltValue: 0.18084 * spotPrices.silver, spotPrice: spotPrices.silver },
        { id: 'standing-liberty-quarter', name: 'Standing Liberty Quarter', series: 'Standing Liberty Quarter', years: '1916-1930', denomination: '$0.25', composition: '90% Silver', weightGrams: 6.25, asw: 0.18084, metalType: 'silver', meltValue: 0.18084 * spotPrices.silver, spotPrice: spotPrices.silver },
        { id: 'washington-quarter-silver', name: 'Washington Quarter (Silver)', series: 'Washington Quarter', years: '1932-1964', denomination: '$0.25', composition: '90% Silver', weightGrams: 6.25, asw: 0.18084, metalType: 'silver', meltValue: 0.18084 * spotPrices.silver, spotPrice: spotPrices.silver },
        { id: 'barber-half', name: 'Barber Half Dollar', series: 'Barber Half Dollar', years: '1892-1915', denomination: '$0.50', composition: '90% Silver', weightGrams: 12.5, asw: 0.36169, metalType: 'silver', meltValue: 0.36169 * spotPrices.silver, spotPrice: spotPrices.silver },
        { id: 'walking-liberty-half', name: 'Walking Liberty Half Dollar', series: 'Walking Liberty Half Dollar', years: '1916-1947', denomination: '$0.50', composition: '90% Silver', weightGrams: 12.5, asw: 0.36169, metalType: 'silver', meltValue: 0.36169 * spotPrices.silver, spotPrice: spotPrices.silver },
        { id: 'franklin-half', name: 'Franklin Half Dollar', series: 'Franklin Half Dollar', years: '1948-1963', denomination: '$0.50', composition: '90% Silver', weightGrams: 12.5, asw: 0.36169, metalType: 'silver', meltValue: 0.36169 * spotPrices.silver, spotPrice: spotPrices.silver },
        { id: 'kennedy-half-1964', name: 'Kennedy Half Dollar (1964)', series: 'Kennedy Half Dollar', years: '1964', denomination: '$0.50', composition: '90% Silver', weightGrams: 12.5, asw: 0.36169, metalType: 'silver', meltValue: 0.36169 * spotPrices.silver, spotPrice: spotPrices.silver },
        { id: 'kennedy-half-40', name: 'Kennedy Half Dollar (40%)', series: 'Kennedy Half Dollar', years: '1965-1970', denomination: '$0.50', composition: '40% Silver', weightGrams: 11.5, asw: 0.1479, metalType: 'silver', meltValue: 0.1479 * spotPrices.silver, spotPrice: spotPrices.silver },
        { id: 'morgan-dollar', name: 'Morgan Dollar', series: 'Morgan Dollar', years: '1878-1921', denomination: '$1.00', composition: '90% Silver', weightGrams: 26.73, asw: 0.77344, metalType: 'silver', meltValue: 0.77344 * spotPrices.silver, spotPrice: spotPrices.silver },
        { id: 'peace-dollar', name: 'Peace Dollar', series: 'Peace Dollar', years: '1921-1935', denomination: '$1.00', composition: '90% Silver', weightGrams: 26.73, asw: 0.77344, metalType: 'silver', meltValue: 0.77344 * spotPrices.silver, spotPrice: spotPrices.silver },
        { id: 'eisenhower-silver', name: 'Eisenhower Dollar (Silver)', series: 'Eisenhower Dollar', years: '1971-1976', denomination: '$1.00', composition: '40% Silver', weightGrams: 24.59, asw: 0.3161, metalType: 'silver', meltValue: 0.3161 * spotPrices.silver, spotPrice: spotPrices.silver },
        { id: 'american-silver-eagle', name: 'American Silver Eagle', series: 'American Silver Eagle', years: '1986-Present', denomination: '$1.00', composition: '99.9% Silver', weightGrams: 31.103, asw: 1.0, metalType: 'silver', meltValue: 1.0 * spotPrices.silver, spotPrice: spotPrices.silver },
        { id: 'atb-5oz', name: 'America the Beautiful 5 oz', series: 'America the Beautiful', years: '2010-2021', denomination: '$0.25', composition: '99.9% Silver', weightGrams: 155.517, asw: 5.0, metalType: 'silver', meltValue: 5.0 * spotPrices.silver, spotPrice: spotPrices.silver },
      ]

      const goldCoins: CoinMeltData[] = [
        { id: 'gold-eagle-1oz', name: 'American Gold Eagle (1 oz)', series: 'American Gold Eagle', years: '1986-Present', denomination: '$50', composition: '91.67% Gold', weightGrams: 33.931, asw: 0, agw: 1.0, metalType: 'gold', meltValue: 1.0 * spotPrices.gold, spotPrice: spotPrices.gold },
        { id: 'gold-eagle-half', name: 'American Gold Eagle (1/2 oz)', series: 'American Gold Eagle', years: '1986-Present', denomination: '$25', composition: '91.67% Gold', weightGrams: 16.966, asw: 0, agw: 0.5, metalType: 'gold', meltValue: 0.5 * spotPrices.gold, spotPrice: spotPrices.gold },
        { id: 'gold-eagle-quarter', name: 'American Gold Eagle (1/4 oz)', series: 'American Gold Eagle', years: '1986-Present', denomination: '$10', composition: '91.67% Gold', weightGrams: 8.483, asw: 0, agw: 0.25, metalType: 'gold', meltValue: 0.25 * spotPrices.gold, spotPrice: spotPrices.gold },
        { id: 'gold-eagle-tenth', name: 'American Gold Eagle (1/10 oz)', series: 'American Gold Eagle', years: '1986-Present', denomination: '$5', composition: '91.67% Gold', weightGrams: 3.393, asw: 0, agw: 0.1, metalType: 'gold', meltValue: 0.1 * spotPrices.gold, spotPrice: spotPrices.gold },
        { id: 'buffalo-gold', name: 'American Buffalo (1 oz)', series: 'American Buffalo', years: '2006-Present', denomination: '$50', composition: '99.99% Gold', weightGrams: 31.108, asw: 0, agw: 1.0, metalType: 'gold', meltValue: 1.0 * spotPrices.gold, spotPrice: spotPrices.gold },
      ]

      setData({
        spotPrices,
        lastUpdated: new Date().toISOString(),
        silverCoins,
        goldCoins,
      })
      setError('')
    } catch (err) {
      setError('Failed to load melt values')
    }
  }

  useEffect(() => {
    fetchMeltValues()

    // Refresh every 5 minutes
    const interval = setInterval(fetchMeltValues, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const coins = activeTab === 'silver' ? data?.silverCoins : data?.goldCoins
  const spotPrice = activeTab === 'silver' ? data?.spotPrices.silver : data?.spotPrices.gold

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Melt Values</h2>
          <p className="text-gray-600">Calculate coin melt values from live spot prices</p>
        </div>
        <button
          onClick={fetchMeltValues}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Spot Price Cards */}
      {data && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center">
                <Coins className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm text-gray-600">Silver Spot</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">${data.spotPrices.silver.toFixed(2)}</p>
            <p className="text-xs text-gray-500 mt-1">per troy oz</p>
          </div>

          <div className="bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                <Coins className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm text-yellow-700">Gold Spot</span>
            </div>
            <p className="text-3xl font-bold text-yellow-900">${data.spotPrices.gold.toFixed(2)}</p>
            <p className="text-xs text-yellow-600 mt-1">per troy oz</p>
          </div>

          <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <span className="text-sm text-blue-700">Last Updated</span>
            </div>
            <p className="text-lg font-semibold text-blue-900">
              {new Date(data.lastUpdated).toLocaleTimeString()}
            </p>
            <p className="text-xs text-blue-600 mt-1">Auto-refreshes every 5 min</p>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('silver')}
          className={`px-6 py-3 font-medium transition-colors ${
            activeTab === 'silver'
              ? 'text-gray-700 border-b-2 border-gray-500 bg-gray-50'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Silver Coins ({data?.silverCoins.length || 0})
        </button>
        <button
          onClick={() => setActiveTab('gold')}
          className={`px-6 py-3 font-medium transition-colors ${
            activeTab === 'gold'
              ? 'text-yellow-700 border-b-2 border-yellow-500 bg-yellow-50'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Gold Coins ({data?.goldCoins.length || 0})
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading melt values...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
          {error}
        </div>
      )}

      {/* Table */}
      {!loading && coins && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className={`${activeTab === 'silver' ? 'bg-gray-50' : 'bg-yellow-50'} border-b border-gray-200`}>
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Coin</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Years</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Composition</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">
                  {activeTab === 'silver' ? 'ASW (oz)' : 'AGW (oz)'}
                </th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">Melt Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {coins.map((coin) => (
                <tr key={coin.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-gray-900">{coin.name}</p>
                      <p className="text-xs text-gray-500">{coin.denomination}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{coin.years}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{coin.composition}</td>
                  <td className="px-4 py-3 text-sm text-right font-mono text-gray-700">
                    {(activeTab === 'silver' ? coin.asw : coin.agw || 0).toFixed(5)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className={`text-lg font-bold ${activeTab === 'silver' ? 'text-gray-900' : 'text-yellow-700'}`}>
                      ${coin.meltValue.toFixed(2)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Info Box */}
      <div className="bg-blue-50 rounded-lg p-4 text-sm text-blue-800">
        <p className="font-semibold mb-1">How Melt Values Work</p>
        <p>
          Melt value = Actual {activeTab === 'silver' ? 'Silver' : 'Gold'} Weight (oz) x Spot Price.
          These values represent the raw metal content only - collectible/numismatic value is typically higher.
        </p>
      </div>
    </div>
  )
}

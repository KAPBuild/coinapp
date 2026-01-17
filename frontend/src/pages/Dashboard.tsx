import { useState, useEffect, useMemo } from 'react'
import {
  TrendingUp, Coins, TrendingDown,
  Award, Target, BarChart3, PieChart,
  CircleDollarSign, Gem, Scale, CheckCircle2
} from 'lucide-react'
import { useCoins } from '../hooks/useCoins'
import { Coin } from '../types/coin'

// Metal content data for melt calculations
const COIN_METAL_DATA: Record<string, { asw: number; agw: number }> = {
  'Morgan Dollar': { asw: 0.77344, agw: 0 },
  'Peace Dollar': { asw: 0.77344, agw: 0 },
  'American Silver Eagle': { asw: 1.0, agw: 0 },
  'Walking Liberty Half Dollar': { asw: 0.36169, agw: 0 },
  'Franklin Half Dollar': { asw: 0.36169, agw: 0 },
  'Kennedy Half Dollar': { asw: 0.36169, agw: 0 },
  'Washington Quarter': { asw: 0.18084, agw: 0 },
  'Standing Liberty Quarter': { asw: 0.18084, agw: 0 },
  'Mercury Dime': { asw: 0.07234, agw: 0 },
  'Roosevelt Dime': { asw: 0.07234, agw: 0 },
  'Barber Dime': { asw: 0.07234, agw: 0 },
  'American Gold Eagle': { asw: 0, agw: 1.0 },
  'American Buffalo': { asw: 0, agw: 1.0 },
}

// Set completion data (total coins in each series)
const SERIES_TOTALS: Record<string, number> = {
  'Morgan Dollar': 96, // All year/mint combinations
  'Peace Dollar': 24,
  'American Silver Eagle': 40, // 1986-2025
  'Walking Liberty Half Dollar': 65,
  'Franklin Half Dollar': 35,
  'Kennedy Half Dollar': 120,
  'Washington Quarter': 150,
  'Mercury Dime': 77,
  'Roosevelt Dime': 80,
}

// Sample data for demo when not logged in
const SAMPLE_COINS: Coin[] = [
  { id: '1', userId: 'demo', quantity: 5, purchasePrice: 35, purchaseDate: '2024-01-15', currentPrice: 42, year: 1921, mint: 'S', series: 'Morgan Dollar', denomination: '$1.00', isGraded: 'N', estimatedGrade: 'VF-30' },
  { id: '2', userId: 'demo', quantity: 3, purchasePrice: 38, purchaseDate: '2024-02-20', currentPrice: 45, year: 1921, mint: 'D', series: 'Morgan Dollar', denomination: '$1.00', isGraded: 'Y', gradingCompany: 'PCGS', actualGrade: 'MS-63' },
  { id: '3', userId: 'demo', quantity: 1, purchasePrice: 450, purchaseDate: '2023-11-10', currentPrice: 520, year: 1878, mint: 'CC', series: 'Morgan Dollar', denomination: '$1.00', isGraded: 'Y', gradingCompany: 'NGC', actualGrade: 'AU-55' },
  { id: '4', userId: 'demo', quantity: 10, purchasePrice: 32, purchaseDate: '2024-03-05', currentPrice: 35, year: 2023, series: 'American Silver Eagle', denomination: '$1.00', isGraded: 'N' },
  { id: '5', userId: 'demo', quantity: 2, purchasePrice: 28, purchaseDate: '2024-01-22', currentPrice: 32, year: 1923, series: 'Peace Dollar', denomination: '$1.00', isGraded: 'N', estimatedGrade: 'AU-50' },
  { id: '6', userId: 'demo', quantity: 8, purchasePrice: 15, purchaseDate: '2024-04-12', currentPrice: 18, year: 1964, series: 'Kennedy Half Dollar', denomination: '$0.50', isGraded: 'N' },
  { id: '7', userId: 'demo', quantity: 1, purchasePrice: 2100, purchaseDate: '2024-05-01', currentPrice: 2250, year: 2024, series: 'American Gold Eagle', denomination: '$50', isGraded: 'N' },
  { id: '8', userId: 'demo', quantity: 4, purchasePrice: 22, purchaseDate: '2024-02-28', currentPrice: 25, year: 1943, series: 'Walking Liberty Half Dollar', denomination: '$0.50', isGraded: 'N' },
  { id: '9', userId: 'demo', quantity: 15, purchasePrice: 3, purchaseDate: '2024-03-18', currentPrice: 3.50, year: 1944, series: 'Mercury Dime', denomination: '$0.10', isGraded: 'N' },
]

export function Dashboard() {
  const { data: apiCoins = [], isLoading, error } = useCoins()
  const [spotPrices, setSpotPrices] = useState({ gold: 2050, silver: 24.50 })

  // Use sample data if error or empty
  const coins = error || apiCoins.length === 0 ? SAMPLE_COINS : apiCoins

  // Fetch spot prices
  useEffect(() => {
    const fetchSpot = async () => {
      try {
        const response = await fetch('https://api.metals.live/v1/spot/metals?currencies=usd')
        const data = await response.json()
        setSpotPrices({
          gold: data.metals?.gold || 2050,
          silver: data.metals?.silver || 24.50,
        })
      } catch {
        // Use defaults
      }
    }
    fetchSpot()
    const interval = setInterval(fetchSpot, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  // Calculate all stats
  const stats = useMemo(() => {
    let totalCoins = 0
    let totalInvested = 0
    let totalValue = 0
    let totalSilverOz = 0
    let totalGoldOz = 0
    const seriesBreakdown: Record<string, { count: number; value: number; uniqueCoins: Set<string> }> = {}
    const metalBreakdown = { silver: 0, gold: 0, other: 0 }

    coins.forEach(coin => {
      const qty = coin.quantity || 1
      const purchaseValue = (coin.purchasePrice || 0) * qty
      const currentValue = (coin.currentPrice || coin.purchasePrice || 0) * qty

      totalCoins += qty
      totalInvested += purchaseValue
      totalValue += currentValue

      // Series breakdown
      const series = coin.series || 'Other'
      if (!seriesBreakdown[series]) {
        seriesBreakdown[series] = { count: 0, value: 0, uniqueCoins: new Set() }
      }
      seriesBreakdown[series].count += qty
      seriesBreakdown[series].value += currentValue
      // Track unique year/mint combinations for set completion
      if (coin.year) {
        seriesBreakdown[series].uniqueCoins.add(`${coin.year}-${coin.mint || 'P'}`)
      }

      // Metal calculations
      const metalData = COIN_METAL_DATA[series]
      if (metalData) {
        totalSilverOz += metalData.asw * qty
        totalGoldOz += metalData.agw * qty
        if (metalData.asw > 0) metalBreakdown.silver += currentValue
        else if (metalData.agw > 0) metalBreakdown.gold += currentValue
        else metalBreakdown.other += currentValue
      } else {
        metalBreakdown.other += currentValue
      }
    })

    const gainLoss = totalValue - totalInvested
    const gainLossPercent = totalInvested > 0 ? (gainLoss / totalInvested) * 100 : 0
    const meltValue = (totalSilverOz * spotPrices.silver) + (totalGoldOz * spotPrices.gold)
    const numismaticPremium = totalValue - meltValue

    return {
      totalCoins,
      totalInvested,
      totalValue,
      gainLoss,
      gainLossPercent,
      totalSilverOz,
      totalGoldOz,
      meltValue,
      numismaticPremium,
      seriesBreakdown,
      metalBreakdown,
    }
  }, [coins, spotPrices])

  // Sort series by value
  const sortedSeries = useMemo(() => {
    return Object.entries(stats.seriesBreakdown)
      .sort((a, b) => b[1].value - a[1].value)
  }, [stats.seriesBreakdown])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your stack...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-1">Stack Dashboard</h2>
          <p className="text-gray-600">Your complete coin collection overview</p>
        </div>
        {(error || apiCoins.length === 0) && (
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
            Sample Data
          </span>
        )}
      </div>

      {/* Main Value Card */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-2xl shadow-xl p-8 text-white">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <p className="text-blue-200 text-sm font-medium mb-1">Total Stack Value</p>
            <p className="text-5xl font-bold mb-2">
              ${stats.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
              stats.gainLoss >= 0 ? 'bg-green-500/20 text-green-200' : 'bg-red-500/20 text-red-200'
            }`}>
              {stats.gainLoss >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              {stats.gainLoss >= 0 ? '+' : ''}{stats.gainLossPercent.toFixed(1)}%
              ({stats.gainLoss >= 0 ? '+' : ''}${stats.gainLoss.toFixed(2)})
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white/10 rounded-xl p-4">
              <p className="text-blue-200 text-xs mb-1">Total Coins</p>
              <p className="text-2xl font-bold">{stats.totalCoins}</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <p className="text-blue-200 text-xs mb-1">Invested</p>
              <p className="text-2xl font-bold">${(stats.totalInvested / 1000).toFixed(1)}k</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <p className="text-blue-200 text-xs mb-1">Silver</p>
              <p className="text-2xl font-bold">{stats.totalSilverOz.toFixed(1)} oz</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <p className="text-blue-200 text-xs mb-1">Gold</p>
              <p className="text-2xl font-bold">{stats.totalGoldOz.toFixed(2)} oz</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-gray-400">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Scale className="w-5 h-5 text-gray-600" />
            </div>
            <span className="text-sm text-gray-600">Melt Value</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            ${stats.meltValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Silver: ${(stats.totalSilverOz * spotPrices.silver).toFixed(2)} | Gold: ${(stats.totalGoldOz * spotPrices.gold).toFixed(2)}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-400">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Gem className="w-5 h-5 text-purple-600" />
            </div>
            <span className="text-sm text-gray-600">Numismatic Premium</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            ${stats.numismaticPremium.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {stats.meltValue > 0 ? ((stats.numismaticPremium / stats.meltValue) * 100).toFixed(0) : 0}% over melt
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-400">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <CircleDollarSign className="w-5 h-5 text-yellow-600" />
            </div>
            <span className="text-sm text-gray-600">Gold Spot</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">${spotPrices.gold.toFixed(2)}</p>
          <p className="text-xs text-gray-500 mt-1">per troy oz</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-gray-300">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Coins className="w-5 h-5 text-gray-500" />
            </div>
            <span className="text-sm text-gray-600">Silver Spot</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">${spotPrices.silver.toFixed(2)}</p>
          <p className="text-xs text-gray-500 mt-1">per troy oz</p>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stack Breakdown by Series */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-100 rounded-lg">
              <PieChart className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Stack Breakdown</h3>
          </div>

          <div className="space-y-4">
            {sortedSeries.slice(0, 6).map(([series, data]) => {
              const percentage = stats.totalValue > 0 ? (data.value / stats.totalValue) * 100 : 0
              const colors = [
                'bg-blue-500', 'bg-green-500', 'bg-yellow-500',
                'bg-purple-500', 'bg-pink-500', 'bg-indigo-500'
              ]
              const colorIndex = sortedSeries.findIndex(s => s[0] === series)
              const barColor = colors[colorIndex % colors.length]

              return (
                <div key={series}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{series}</span>
                    <span className="text-sm text-gray-500">{data.count} coins</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${barColor} rounded-full transition-all`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-gray-900 w-20 text-right">
                      ${data.value.toFixed(0)}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>

          {sortedSeries.length > 6 && (
            <p className="text-sm text-gray-500 mt-4 text-center">
              +{sortedSeries.length - 6} more series
            </p>
          )}
        </div>

        {/* Set Completion Progress */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-green-100 rounded-lg">
              <Target className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Set Completion</h3>
          </div>

          <div className="space-y-4">
            {sortedSeries
              .filter(([series]) => SERIES_TOTALS[series])
              .slice(0, 5)
              .map(([series, data]) => {
                const total = SERIES_TOTALS[series] || 100
                const owned = data.uniqueCoins.size
                const percentage = Math.min((owned / total) * 100, 100)
                const isComplete = owned >= total

                return (
                  <div key={series}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">{series}</span>
                      <span className={`text-sm font-semibold ${isComplete ? 'text-green-600' : 'text-gray-600'}`}>
                        {owned}/{total}
                        {isComplete && <CheckCircle2 className="w-4 h-4 inline ml-1" />}
                      </span>
                    </div>
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          isComplete ? 'bg-green-500' :
                          percentage > 50 ? 'bg-blue-500' : 'bg-gray-400'
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {percentage.toFixed(0)}% complete
                    </p>
                  </div>
                )
              })}
          </div>

          {sortedSeries.filter(([s]) => SERIES_TOTALS[s]).length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Target className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>Add coins with series info to track set completion</p>
            </div>
          )}
        </div>
      </div>

      {/* Metal Allocation */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-yellow-100 rounded-lg">
            <BarChart3 className="w-5 h-5 text-yellow-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">Metal Allocation</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Silver */}
          <div className="text-center">
            <div className="relative inline-flex items-center justify-center w-32 h-32 mb-4">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle
                  cx="64" cy="64" r="56"
                  stroke="#e5e7eb" strokeWidth="12" fill="none"
                />
                <circle
                  cx="64" cy="64" r="56"
                  stroke="#9ca3af" strokeWidth="12" fill="none"
                  strokeDasharray={`${(stats.metalBreakdown.silver / stats.totalValue) * 352} 352`}
                  className="transition-all duration-500"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-gray-700">
                  {stats.totalValue > 0 ? ((stats.metalBreakdown.silver / stats.totalValue) * 100).toFixed(0) : 0}%
                </span>
              </div>
            </div>
            <p className="font-semibold text-gray-900">Silver</p>
            <p className="text-sm text-gray-500">${stats.metalBreakdown.silver.toFixed(2)}</p>
            <p className="text-xs text-gray-400">{stats.totalSilverOz.toFixed(2)} oz</p>
          </div>

          {/* Gold */}
          <div className="text-center">
            <div className="relative inline-flex items-center justify-center w-32 h-32 mb-4">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle
                  cx="64" cy="64" r="56"
                  stroke="#e5e7eb" strokeWidth="12" fill="none"
                />
                <circle
                  cx="64" cy="64" r="56"
                  stroke="#eab308" strokeWidth="12" fill="none"
                  strokeDasharray={`${(stats.metalBreakdown.gold / stats.totalValue) * 352} 352`}
                  className="transition-all duration-500"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-yellow-600">
                  {stats.totalValue > 0 ? ((stats.metalBreakdown.gold / stats.totalValue) * 100).toFixed(0) : 0}%
                </span>
              </div>
            </div>
            <p className="font-semibold text-gray-900">Gold</p>
            <p className="text-sm text-gray-500">${stats.metalBreakdown.gold.toFixed(2)}</p>
            <p className="text-xs text-gray-400">{stats.totalGoldOz.toFixed(4)} oz</p>
          </div>

          {/* Other/Numismatic */}
          <div className="text-center">
            <div className="relative inline-flex items-center justify-center w-32 h-32 mb-4">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle
                  cx="64" cy="64" r="56"
                  stroke="#e5e7eb" strokeWidth="12" fill="none"
                />
                <circle
                  cx="64" cy="64" r="56"
                  stroke="#8b5cf6" strokeWidth="12" fill="none"
                  strokeDasharray={`${(stats.metalBreakdown.other / stats.totalValue) * 352} 352`}
                  className="transition-all duration-500"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-purple-600">
                  {stats.totalValue > 0 ? ((stats.metalBreakdown.other / stats.totalValue) * 100).toFixed(0) : 0}%
                </span>
              </div>
            </div>
            <p className="font-semibold text-gray-900">Other</p>
            <p className="text-sm text-gray-500">${stats.metalBreakdown.other.toFixed(2)}</p>
            <p className="text-xs text-gray-400">Copper, Clad, etc.</p>
          </div>
        </div>
      </div>

      {/* Recent Additions / Top Holdings */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <Award className="w-5 h-5 text-indigo-600" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">Top Holdings</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-500 border-b border-gray-200">
                <th className="pb-3 font-medium">Coin</th>
                <th className="pb-3 font-medium text-center">Qty</th>
                <th className="pb-3 font-medium text-right">Value</th>
                <th className="pb-3 font-medium text-right">Gain/Loss</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {coins
                .sort((a, b) => {
                  const aValue = (a.currentPrice || a.purchasePrice) * a.quantity
                  const bValue = (b.currentPrice || b.purchasePrice) * b.quantity
                  return bValue - aValue
                })
                .slice(0, 5)
                .map((coin) => {
                  const value = (coin.currentPrice || coin.purchasePrice) * coin.quantity
                  const cost = coin.purchasePrice * coin.quantity
                  const gain = value - cost
                  const gainPercent = cost > 0 ? (gain / cost) * 100 : 0

                  return (
                    <tr key={coin.id} className="hover:bg-gray-50">
                      <td className="py-3">
                        <p className="font-medium text-gray-900">
                          {coin.year} {coin.mint && coin.mint !== 'P' ? `-${coin.mint}` : ''} {coin.series || 'Unknown'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {coin.actualGrade || coin.estimatedGrade || 'Ungraded'}
                          {coin.gradingCompany && ` (${coin.gradingCompany})`}
                        </p>
                      </td>
                      <td className="py-3 text-center text-gray-600">{coin.quantity}</td>
                      <td className="py-3 text-right font-semibold text-gray-900">
                        ${value.toFixed(2)}
                      </td>
                      <td className={`py-3 text-right font-medium ${gain >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {gain >= 0 ? '+' : ''}{gainPercent.toFixed(1)}%
                      </td>
                    </tr>
                  )
                })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Stats Footer */}
      <div className="bg-gradient-to-r from-gray-100 to-gray-200 rounded-xl p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-gray-900">{Object.keys(stats.seriesBreakdown).length}</p>
            <p className="text-sm text-gray-600">Series Collected</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">
              ${(stats.totalValue / stats.totalCoins).toFixed(2)}
            </p>
            <p className="text-sm text-gray-600">Avg. Coin Value</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">
              {coins.filter(c => c.isGraded === 'Y').length}
            </p>
            <p className="text-sm text-gray-600">Graded Coins</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">
              {stats.totalSilverOz > 0 ? (stats.metalBreakdown.silver / stats.totalSilverOz / spotPrices.silver * 100).toFixed(0) : 0}%
            </p>
            <p className="text-sm text-gray-600">Premium Over Spot</p>
          </div>
        </div>
      </div>
    </div>
  )
}

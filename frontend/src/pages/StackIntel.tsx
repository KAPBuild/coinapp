import { useState, useMemo } from 'react'
import { TrendingUp, Search, BarChart2, Database, Clock, Star, ChevronRight, Lock, Layers } from 'lucide-react'
import { ScatterPlot3DThree as ScatterPlot3D } from '../components/stackintel/ScatterPlot3DThree'
import { AxisControls } from '../components/stackintel/AxisControls'
import { ViewModeToggle } from '../components/stackintel/ViewModeToggle'
import { FilterControls } from '../components/stackintel/FilterControls'
import { MORGAN_DATA_WITH_COMPUTED } from '../data/morganScatterData'
import { AxisConfig, FilterConfig, InvertConfig } from '../types/morganScatterData'

// Morgan Dollar series data (placeholder - will be expanded)
const SERIES_DATA = [
  { id: 'morgan', name: 'Morgan Dollars', years: '1878-1921', count: 96, status: 'active' },
  { id: 'peace', name: 'Peace Dollars', years: '1921-1935', count: 24, status: 'coming' },
  { id: 'walker', name: 'Walking Liberty Half', years: '1916-1947', count: 65, status: 'coming' },
  { id: 'franklin', name: 'Franklin Half', years: '1948-1963', count: 35, status: 'coming' },
  { id: 'barber', name: 'Barber Coinage', years: '1892-1916', count: 74, status: 'coming' },
]

// Sample Morgan Dollar data for preview
const SAMPLE_MORGANS = [
  { id: '1893-S', year: 1893, mint: 'S', mintage: 100000, survival: 10000, keyDate: true, pop65: 79, value65: 45000 },
  { id: '1889-CC', year: 1889, mint: 'CC', mintage: 350000, survival: 75000, keyDate: true, pop65: 156, value65: 28000 },
  { id: '1895', year: 1895, mint: 'P', mintage: 12000, survival: 880, keyDate: true, pop65: 0, value65: 150000 },
  { id: '1878-CC', year: 1878, mint: 'CC', mintage: 2212000, survival: 500000, keyDate: false, pop65: 1247, value65: 850 },
  { id: '1881-S', year: 1881, mint: 'S', mintage: 12760000, survival: 5000000, keyDate: false, pop65: 48521, value65: 185 },
]

export function StackIntel() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSeries, setSelectedSeries] = useState('morgan')

  // Scatter plot state
  const [axisConfig, setAxisConfig] = useState<AxisConfig>({
    x: 'pop65',
    y: 'survival',
    z: 'value65'
  })
  const [filters, setFilters] = useState<FilterConfig>({
    keyDatesOnly: false,
    mints: ['P', 'S', 'O', 'CC'],
    yearRange: [1878, 1921]
  })
  const [invertConfig, setInvertConfig] = useState<InvertConfig>({
    x: true,   // Default invert so low pop = peak (rare coins stand out)
    y: true,   // Default invert so low survival = peak
    z: false   // value65 default — high value is already desirable
  })
  const [showTrendPlane, setShowTrendPlane] = useState(false)

  const is3D = axisConfig.z !== null

  const handleViewModeChange = (newIs3D: boolean) => {
    setAxisConfig(prev => ({
      ...prev,
      z: newIs3D ? 'pop65' : null
    }))
  }

  // Filter data based on current filters
  const filteredData = useMemo(() => {
    return MORGAN_DATA_WITH_COMPUTED.filter(coin => {
      if (filters.keyDatesOnly && !coin.keyDate) return false
      if (!filters.mints.includes(coin.mint)) return false
      if (coin.year < filters.yearRange[0] || coin.year > filters.yearRange[1]) return false
      return true
    })
  }, [filters])

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center">
            <TrendingUp className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Stack Intel</h1>
            <p className="text-sm text-blue-600 font-medium">Numismatic Investment Research</p>
          </div>
        </div>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Population data, survival estimates, price trends, and grade distribution analytics for serious collectors and investors.
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-2xl mx-auto">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by year, mint mark, or variety (e.g., 1893-S, 1889-CC)..."
            className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
          />
        </div>
      </div>

      {/* Series Selection */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {SERIES_DATA.map((series) => (
          <button
            key={series.id}
            onClick={() => series.status === 'active' && setSelectedSeries(series.id)}
            disabled={series.status === 'coming'}
            className={`relative p-4 rounded-xl border-2 text-left transition-all ${
              series.status === 'coming'
                ? 'border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed'
                : selectedSeries === series.id
                  ? 'border-blue-500 bg-blue-50 shadow-md'
                  : 'border-gray-200 bg-white hover:border-blue-300 hover:shadow-sm'
            }`}
          >
            {series.status === 'coming' && (
              <div className="absolute top-2 right-2">
                <Lock className="w-4 h-4 text-gray-400" />
              </div>
            )}
            <p className="font-bold text-gray-900">{series.name}</p>
            <p className="text-sm text-gray-500">{series.years}</p>
            <p className="text-xs text-blue-600 mt-1 font-medium">
              {series.status === 'coming' ? 'Coming Soon' : `${series.count} varieties`}
            </p>
          </button>
        ))}
      </div>

      {/* 3D Scatter Plot Section */}
      <div className="bg-slate-900 rounded-2xl shadow-2xl border border-slate-700 overflow-hidden">
        <div className="bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 px-4 sm:px-6 py-4 sm:py-5 border-b border-slate-700">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Layers className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">3D Outlier Explorer</h2>
                <p className="text-slate-400 text-xs sm:text-sm">Rotate, zoom, and discover undervalued coins</p>
              </div>
            </div>
            <ViewModeToggle is3D={is3D} onChange={handleViewModeChange} />
          </div>
        </div>

        {/* Controls */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 bg-slate-800/50 border-b border-slate-700 space-y-3 sm:space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <AxisControls axisConfig={axisConfig} onChange={setAxisConfig} />
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <label className="flex items-center gap-2 text-sm text-slate-300 bg-slate-800/50 px-3 py-2.5 rounded-lg border border-slate-700 cursor-pointer hover:bg-slate-700 transition-colors">
                <input
                  type="checkbox"
                  checked={showTrendPlane}
                  onChange={(e) => setShowTrendPlane(e.target.checked)}
                  disabled={!is3D}
                  className="w-4 h-4 text-cyan-500 rounded border-slate-500 bg-slate-700 focus:ring-cyan-500 disabled:opacity-50"
                />
                Trend Plane
              </label>
              {/* Invert Axis Toggles */}
              <div className="flex items-center gap-1 bg-slate-800/50 px-3 py-2 rounded-lg border border-slate-700">
                <span className="text-xs text-slate-400 mr-1">Invert:</span>
                <button
                  onClick={() => setInvertConfig(prev => ({ ...prev, x: !prev.x }))}
                  className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
                    invertConfig.x
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                  }`}
                  title={`X-Axis: ${invertConfig.x ? 'Inverted (low values = high position)' : 'Normal (low values = low position)'}`}
                >
                  X
                </button>
                <button
                  onClick={() => setInvertConfig(prev => ({ ...prev, y: !prev.y }))}
                  className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
                    invertConfig.y
                      ? 'bg-green-600 text-white'
                      : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                  }`}
                  title={`Y-Axis: ${invertConfig.y ? 'Inverted (low values = high position)' : 'Normal (low values = low position)'}`}
                >
                  Y
                </button>
                {is3D && (
                  <button
                    onClick={() => setInvertConfig(prev => ({ ...prev, z: !prev.z }))}
                    className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
                      invertConfig.z
                        ? 'bg-amber-600 text-white'
                        : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                    }`}
                    title={`Z-Axis: ${invertConfig.z ? 'Inverted (low values = high position)' : 'Normal (low values = low position)'}`}
                  >
                    Z
                  </button>
                )}
              </div>
            </div>
          </div>
          <FilterControls filters={filters} onChange={setFilters} />
        </div>

        {/* Scatter Plot */}
        <div className="p-3 sm:p-4 bg-slate-900">
          <ScatterPlot3D
            data={filteredData}
            axisConfig={axisConfig}
            invertConfig={invertConfig}
            showTrendPlane={showTrendPlane}
          />
          <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 text-sm">
            <span className="text-slate-400 font-medium text-center sm:text-left">{filteredData.length} coins displayed</span>
            <div className="flex items-center justify-center sm:justify-end gap-3 sm:gap-5 flex-wrap">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-blue-500 shadow-sm shadow-blue-500/50"></span>
                <span className="text-slate-400 text-xs sm:text-sm">Normal</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-amber-500 shadow-sm shadow-amber-500/50"></span>
                <span className="text-slate-400 text-xs sm:text-sm">Moderate</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-500 shadow-sm shadow-red-500/50"></span>
                <span className="text-slate-400 text-xs sm:text-sm">Outlier</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Preview Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
            <Database className="w-5 h-5 text-white" />
          </div>
          <h3 className="font-bold text-gray-900 mb-2">Population Data</h3>
          <p className="text-sm text-gray-600">
            PCGS and NGC certified population reports. See exactly how many coins exist at each grade level.
          </p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
          <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center mb-4">
            <BarChart2 className="w-5 h-5 text-white" />
          </div>
          <h3 className="font-bold text-gray-900 mb-2">Survival Analysis</h3>
          <p className="text-sm text-gray-600">
            Compare original mintage to estimated survivors. Understand true rarity beyond population numbers.
          </p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
          <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <h3 className="font-bold text-gray-900 mb-2">Price Trends</h3>
          <p className="text-sm text-gray-600">
            Historical pricing data and trends. Track value changes over 1, 5, and 10+ year periods.
          </p>
        </div>
      </div>

      {/* Morgan Dollar Preview Section */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">Morgan Dollar Research</h2>
              <p className="text-gray-400 text-sm">1878-1921 | 96 Date/Mint Varieties</p>
            </div>
            <div className="flex items-center gap-2 text-yellow-400">
              <Star className="w-5 h-5 fill-current" />
              <span className="text-sm font-medium">Most Popular Series</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex flex-wrap gap-4">
          <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500">
            <option>All Years</option>
            <option>1878-1885</option>
            <option>1886-1895</option>
            <option>1896-1904</option>
            <option>1921</option>
          </select>
          <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500">
            <option>All Mints</option>
            <option>Philadelphia (P)</option>
            <option>San Francisco (S)</option>
            <option>New Orleans (O)</option>
            <option>Carson City (CC)</option>
            <option>Denver (D)</option>
          </select>
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input type="checkbox" className="rounded text-blue-600" />
            Key Dates Only
          </label>
        </div>

        {/* Sample Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date/Mint</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Mintage</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Est. Survival</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Survival %</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Pop MS-65</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Value MS-65</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {SAMPLE_MORGANS.map((coin) => {
                const survivalRate = ((coin.survival / coin.mintage) * 100).toFixed(1)
                return (
                  <tr key={coin.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900">
                          {coin.year}-{coin.mint === 'P' ? '' : coin.mint}
                        </span>
                        {coin.keyDate && (
                          <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                            Key Date
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right text-gray-600">
                      {coin.mintage.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right text-gray-600">
                      ~{coin.survival.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={`font-medium ${
                        parseFloat(survivalRate) < 10 ? 'text-red-600' :
                        parseFloat(survivalRate) < 30 ? 'text-orange-600' : 'text-green-600'
                      }`}>
                        {survivalRate}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-mono text-gray-600">
                      {coin.pop65 === 0 ? '-' : coin.pop65.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-gray-900">
                      ${coin.value65.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Coming Soon Overlay Message */}
        <div className="px-6 py-4 bg-blue-50 border-t border-blue-200">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-blue-600" />
            <p className="text-sm text-blue-800">
              <strong>More data coming soon!</strong> Full population reports, historical pricing charts, and ratio analysis tools are in development.
            </p>
          </div>
        </div>
      </div>

      {/* Upcoming Features */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 text-white">
        <h3 className="text-2xl font-bold mb-6">Coming Soon to Stack Intel</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <BarChart2 className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-semibold mb-1">Grade Distribution Charts</h4>
              <p className="text-gray-400 text-sm">Visual breakdown of population across all grades from AG-3 to MS-68</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-semibold mb-1">Price Trend Charts</h4>
              <p className="text-gray-400 text-sm">Track value changes over 1, 5, and 10+ year periods by grade</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-semibold mb-1">Ratio Calculator</h4>
              <p className="text-gray-400 text-sm">Create custom ratios: Population/Survival, Price/Pop, and more</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <Star className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-semibold mb-1">Watchlist & Alerts</h4>
              <p className="text-gray-400 text-sm">Track specific coins and get notified of population or price changes</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

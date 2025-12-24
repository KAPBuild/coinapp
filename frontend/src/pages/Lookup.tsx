import { useState, useEffect } from 'react'
import { Search, RotateCw, AlertCircle } from 'lucide-react'

interface Morgan {
  date: string
  year: string
  mintMark: string
  pcgs?: {
    price: number
    grades: { grade: string; price: number }[]
  }
  ngc?: {
    price: number
    grades: { grade: string; price: number }[]
  }
}

export function Lookup() {
  const [morgans, setMorgans] = useState<Morgan[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    loadMorganPrices()
  }, [])

  const loadMorganPrices = async (refresh = false) => {
    try {
      setLoading(true)
      setError('')

      const url = `/api/prices/morgans${refresh ? '?refresh=true' : ''}`
      const response = await fetch(url)

      if (!response.ok) {
        setError('Failed to load Morgan dollar prices')
        return
      }

      const data = await response.json()
      setMorgans(data.data || [])
    } catch (err) {
      setError('Error loading prices. Using test data.')
      // Fallback test data
      setMorgans([
        {
          date: '1921',
          year: '1921',
          mintMark: 'P',
          pcgs: { price: 45, grades: [] },
          ngc: { price: 42, grades: [] },
        },
        {
          date: '1921-S',
          year: '1921',
          mintMark: 'S',
          pcgs: { price: 48, grades: [] },
          ngc: { price: 45, grades: [] },
        },
        {
          date: '1921-O',
          year: '1921',
          mintMark: 'O',
          pcgs: { price: 50, grades: [] },
          ngc: { price: 47, grades: [] },
        },
      ])
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await loadMorganPrices(true)
  }

  const filtered = morgans.filter(m =>
    `${m.year}${m.mintMark}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.date.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Coin Lookup</h2>
        <p className="text-gray-600">Search and compare Morgan dollar prices from PCGS & NGC</p>
      </div>

      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by year (e.g., 1921, 1921-S)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing || loading}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
        >
          <RotateCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Updating...' : 'Refresh'}
        </button>
      </div>

      {error && (
        <div className="flex gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Note</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading Morgan dollar prices...</p>
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <p className="text-gray-600 text-lg">No Morgan dollars found matching "{searchTerm}"</p>
          <p className="text-gray-500 mt-2">Try searching by year (e.g., 1921)</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Year</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Mint</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Designation</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">PCGS Price</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">NGC Price</th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">Average</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filtered.map((morgan, idx) => {
                const pcgsPrice = morgan.pcgs?.price
                const ngcPrice = morgan.ngc?.price
                const average =
                  pcgsPrice && ngcPrice
                    ? ((pcgsPrice + ngcPrice) / 2).toFixed(2)
                    : (pcgsPrice || ngcPrice)?.toFixed(2) || '-'

                return (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-6 py-3 text-sm font-semibold text-gray-900">{morgan.year}</td>
                    <td className="px-6 py-3 text-sm text-gray-600">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                        {morgan.mintMark === 'P' ? 'Philadelphia' : morgan.mintMark}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-600">{morgan.date}</td>
                    <td className="px-6 py-3 text-sm text-right">
                      {pcgsPrice ? (
                        <span className="font-semibold text-gray-900">${pcgsPrice.toFixed(2)}</span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-3 text-sm text-right">
                      {ngcPrice ? (
                        <span className="font-semibold text-gray-900">${ngcPrice.toFixed(2)}</span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-3 text-sm text-right font-bold text-green-600">
                      ${average}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      <div className="bg-blue-50 rounded-lg p-4 text-sm text-blue-800">
        <p className="font-semibold mb-1">Prices Update Monthly</p>
        <p>Click the "Refresh" button to manually update prices from PCGS and NGC price guides.</p>
      </div>
    </div>
  )
}

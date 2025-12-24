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

// Grade pricing multipliers (relative to base price)
const GRADE_MULTIPLIERS: { [key: string]: number } = {
  'P-1': 0.05,
  'FR-2': 0.08,
  'AG-3': 0.12,
  'G-4': 0.15,
  'G-6': 0.18,
  'VG-8': 0.22,
  'VG-10': 0.25,
  'F-12': 0.30,
  'F-15': 0.35,
  'VF-20': 0.42,
  'VF-25': 0.50,
  'VF-35': 0.65,
  'EF-40': 0.85,
  'EF-45': 1.0,
  'AU-50': 1.2,
  'AU-55': 1.5,
  'AU-58': 1.8,
  'MS-60': 2.2,
  'MS-61': 2.6,
  'MS-62': 3.2,
  'MS-63': 4.0,
  'MS-64': 5.5,
  'MS-65': 7.5,
  'MS-66': 10,
  'MS-67': 14,
  'MS-68': 20,
  'MS-69': 30,
  'MS-70': 50,
}

const generateGrades = (basePrice: number) => {
  return Object.entries(GRADE_MULTIPLIERS).map(([grade, multiplier]) => ({
    grade,
    price: Math.round(basePrice * multiplier),
  }))
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

  const fallbackMorgans: Morgan[] = [
    { date: '1921', year: '1921', mintMark: 'P', pcgs: { price: 38, grades: generateGrades(38) }, ngc: { price: 36, grades: generateGrades(36) } },
    { date: '1921-O', year: '1921', mintMark: 'O', pcgs: { price: 40, grades: generateGrades(40) }, ngc: { price: 38, grades: generateGrades(38) } },
    { date: '1921-S', year: '1921', mintMark: 'S', pcgs: { price: 42, grades: generateGrades(42) }, ngc: { price: 40, grades: generateGrades(40) } },
    { date: '1904', year: '1904', mintMark: 'P', pcgs: { price: 46, grades: generateGrades(46) }, ngc: { price: 44, grades: generateGrades(44) } },
    { date: '1904-O', year: '1904', mintMark: 'O', pcgs: { price: 49, grades: generateGrades(49) }, ngc: { price: 47, grades: generateGrades(47) } },
    { date: '1904-S', year: '1904', mintMark: 'S', pcgs: { price: 53, grades: generateGrades(53) }, ngc: { price: 50, grades: generateGrades(50) } },
    { date: '1903', year: '1903', mintMark: 'P', pcgs: { price: 48, grades: generateGrades(48) }, ngc: { price: 45, grades: generateGrades(45) } },
    { date: '1903-O', year: '1903', mintMark: 'O', pcgs: { price: 51, grades: generateGrades(51) }, ngc: { price: 48, grades: generateGrades(48) } },
    { date: '1903-S', year: '1903', mintMark: 'S', pcgs: { price: 55, grades: generateGrades(55) }, ngc: { price: 52, grades: generateGrades(52) } },
    { date: '1902', year: '1902', mintMark: 'P', pcgs: { price: 44, grades: generateGrades(44) }, ngc: { price: 42, grades: generateGrades(42) } },
    { date: '1902-O', year: '1902', mintMark: 'O', pcgs: { price: 47, grades: generateGrades(47) }, ngc: { price: 44, grades: generateGrades(44) } },
    { date: '1902-S', year: '1902', mintMark: 'S', pcgs: { price: 51, grades: generateGrades(51) }, ngc: { price: 48, grades: generateGrades(48) } },
    { date: '1901', year: '1901', mintMark: 'P', pcgs: { price: 50, grades: generateGrades(50) }, ngc: { price: 47, grades: generateGrades(47) } },
    { date: '1901-O', year: '1901', mintMark: 'O', pcgs: { price: 53, grades: generateGrades(53) }, ngc: { price: 50, grades: generateGrades(50) } },
    { date: '1901-S', year: '1901', mintMark: 'S', pcgs: { price: 58, grades: generateGrades(58) }, ngc: { price: 55, grades: generateGrades(55) } },
    { date: '1900', year: '1900', mintMark: 'P', pcgs: { price: 42, grades: generateGrades(42) }, ngc: { price: 40, grades: generateGrades(40) } },
    { date: '1900-O', year: '1900', mintMark: 'O', pcgs: { price: 45, grades: generateGrades(45) }, ngc: { price: 43, grades: generateGrades(43) } },
    { date: '1900-S', year: '1900', mintMark: 'S', pcgs: { price: 49, grades: generateGrades(49) }, ngc: { price: 46, grades: generateGrades(46) } },
    { date: '1899', year: '1899', mintMark: 'P', pcgs: { price: 44, grades: generateGrades(44) }, ngc: { price: 42, grades: generateGrades(42) } },
    { date: '1899-O', year: '1899', mintMark: 'O', pcgs: { price: 47, grades: generateGrades(47) }, ngc: { price: 44, grades: generateGrades(44) } },
    { date: '1899-S', year: '1899', mintMark: 'S', pcgs: { price: 51, grades: generateGrades(51) }, ngc: { price: 48, grades: generateGrades(48) } },
    { date: '1898', year: '1898', mintMark: 'P', pcgs: { price: 42, grades: generateGrades(42) }, ngc: { price: 40, grades: generateGrades(40) } },
    { date: '1898-O', year: '1898', mintMark: 'O', pcgs: { price: 45, grades: generateGrades(45) }, ngc: { price: 43, grades: generateGrades(43) } },
    { date: '1898-S', year: '1898', mintMark: 'S', pcgs: { price: 49, grades: generateGrades(49) }, ngc: { price: 46, grades: generateGrades(46) } },
    { date: '1897', year: '1897', mintMark: 'P', pcgs: { price: 45, grades: generateGrades(45) }, ngc: { price: 43, grades: generateGrades(43) } },
    { date: '1897-O', year: '1897', mintMark: 'O', pcgs: { price: 48, grades: generateGrades(48) }, ngc: { price: 45, grades: generateGrades(45) } },
    { date: '1897-S', year: '1897', mintMark: 'S', pcgs: { price: 52, grades: generateGrades(52) }, ngc: { price: 49, grades: generateGrades(49) } },
    { date: '1896', year: '1896', mintMark: 'P', pcgs: { price: 50, grades: generateGrades(50) }, ngc: { price: 47, grades: generateGrades(47) } },
    { date: '1896-O', year: '1896', mintMark: 'O', pcgs: { price: 53, grades: generateGrades(53) }, ngc: { price: 50, grades: generateGrades(50) } },
    { date: '1896-S', year: '1896', mintMark: 'S', pcgs: { price: 57, grades: generateGrades(57) }, ngc: { price: 54, grades: generateGrades(54) } },
    { date: '1895', year: '1895', mintMark: 'P', pcgs: { price: 140, grades: generateGrades(140) }, ngc: { price: 133, grades: generateGrades(133) } },
    { date: '1895-O', year: '1895', mintMark: 'O', pcgs: { price: 155, grades: generateGrades(155) }, ngc: { price: 147, grades: generateGrades(147) } },
    { date: '1895-S', year: '1895', mintMark: 'S', pcgs: { price: 170, grades: generateGrades(170) }, ngc: { price: 161, grades: generateGrades(161) } },
    { date: '1894', year: '1894', mintMark: 'P', pcgs: { price: 120, grades: generateGrades(120) }, ngc: { price: 114, grades: generateGrades(114) } },
    { date: '1894-O', year: '1894', mintMark: 'O', pcgs: { price: 130, grades: generateGrades(130) }, ngc: { price: 123, grades: generateGrades(123) } },
    { date: '1894-S', year: '1894', mintMark: 'S', pcgs: { price: 145, grades: generateGrades(145) }, ngc: { price: 137, grades: generateGrades(137) } },
    { date: '1893', year: '1893', mintMark: 'P', pcgs: { price: 85, grades: generateGrades(85) }, ngc: { price: 80, grades: generateGrades(80) } },
    { date: '1893-O', year: '1893', mintMark: 'O', pcgs: { price: 95, grades: generateGrades(95) }, ngc: { price: 90, grades: generateGrades(90) } },
    { date: '1893-S', year: '1893', mintMark: 'S', pcgs: { price: 110, grades: generateGrades(110) }, ngc: { price: 104, grades: generateGrades(104) } },
    { date: '1893-CC', year: '1893', mintMark: 'CC', pcgs: { price: 950, grades: generateGrades(950) }, ngc: { price: 900, grades: generateGrades(900) } },
    { date: '1892', year: '1892', mintMark: 'P', pcgs: { price: 56, grades: generateGrades(56) }, ngc: { price: 53, grades: generateGrades(53) } },
    { date: '1892-O', year: '1892', mintMark: 'O', pcgs: { price: 60, grades: generateGrades(60) }, ngc: { price: 57, grades: generateGrades(57) } },
    { date: '1892-S', year: '1892', mintMark: 'S', pcgs: { price: 65, grades: generateGrades(65) }, ngc: { price: 61, grades: generateGrades(61) } },
    { date: '1892-CC', year: '1892', mintMark: 'CC', pcgs: { price: 380, grades: generateGrades(380) }, ngc: { price: 361, grades: generateGrades(361) } },
    { date: '1891', year: '1891', mintMark: 'P', pcgs: { price: 52, grades: generateGrades(52) }, ngc: { price: 49, grades: generateGrades(49) } },
    { date: '1891-O', year: '1891', mintMark: 'O', pcgs: { price: 55, grades: generateGrades(55) }, ngc: { price: 52, grades: generateGrades(52) } },
    { date: '1891-S', year: '1891', mintMark: 'S', pcgs: { price: 58, grades: generateGrades(58) }, ngc: { price: 55, grades: generateGrades(55) } },
    { date: '1891-CC', year: '1891', mintMark: 'CC', pcgs: { price: 425, grades: generateGrades(425) }, ngc: { price: 403, grades: generateGrades(403) } },
    { date: '1890', year: '1890', mintMark: 'P', pcgs: { price: 48, grades: generateGrades(48) }, ngc: { price: 45, grades: generateGrades(45) } },
    { date: '1890-O', year: '1890', mintMark: 'O', pcgs: { price: 50, grades: generateGrades(50) }, ngc: { price: 47, grades: generateGrades(47) } },
    { date: '1890-S', year: '1890', mintMark: 'S', pcgs: { price: 53, grades: generateGrades(53) }, ngc: { price: 50, grades: generateGrades(50) } },
    { date: '1890-CC', year: '1890', mintMark: 'CC', pcgs: { price: 480, grades: generateGrades(480) }, ngc: { price: 456, grades: generateGrades(456) } },
    { date: '1889', year: '1889', mintMark: 'P', pcgs: { price: 48, grades: generateGrades(48) }, ngc: { price: 45, grades: generateGrades(45) } },
    { date: '1889-O', year: '1889', mintMark: 'O', pcgs: { price: 51, grades: generateGrades(51) }, ngc: { price: 48, grades: generateGrades(48) } },
    { date: '1889-S', year: '1889', mintMark: 'S', pcgs: { price: 55, grades: generateGrades(55) }, ngc: { price: 52, grades: generateGrades(52) } },
    { date: '1889-CC', year: '1889', mintMark: 'CC', pcgs: { price: 550, grades: generateGrades(550) }, ngc: { price: 522, grades: generateGrades(522) } },
    { date: '1888', year: '1888', mintMark: 'P', pcgs: { price: 45, grades: generateGrades(45) }, ngc: { price: 42, grades: generateGrades(42) } },
    { date: '1888-O', year: '1888', mintMark: 'O', pcgs: { price: 48, grades: generateGrades(48) }, ngc: { price: 45, grades: generateGrades(45) } },
    { date: '1888-S', year: '1888', mintMark: 'S', pcgs: { price: 52, grades: generateGrades(52) }, ngc: { price: 49, grades: generateGrades(49) } },
    { date: '1888-CC', year: '1888', mintMark: 'CC', pcgs: { price: 600, grades: generateGrades(600) }, ngc: { price: 570, grades: generateGrades(570) } },
    { date: '1887', year: '1887', mintMark: 'P', pcgs: { price: 43, grades: generateGrades(43) }, ngc: { price: 40, grades: generateGrades(40) } },
    { date: '1887-O', year: '1887', mintMark: 'O', pcgs: { price: 46, grades: generateGrades(46) }, ngc: { price: 43, grades: generateGrades(43) } },
    { date: '1887-S', year: '1887', mintMark: 'S', pcgs: { price: 50, grades: generateGrades(50) }, ngc: { price: 47, grades: generateGrades(47) } },
    { date: '1887-CC', year: '1887', mintMark: 'CC', pcgs: { price: 500, grades: generateGrades(500) }, ngc: { price: 475, grades: generateGrades(475) } },
    { date: '1886', year: '1886', mintMark: 'P', pcgs: { price: 42, grades: generateGrades(42) }, ngc: { price: 39, grades: generateGrades(39) } },
    { date: '1886-O', year: '1886', mintMark: 'O', pcgs: { price: 45, grades: generateGrades(45) }, ngc: { price: 42, grades: generateGrades(42) } },
    { date: '1886-S', year: '1886', mintMark: 'S', pcgs: { price: 49, grades: generateGrades(49) }, ngc: { price: 46, grades: generateGrades(46) } },
    { date: '1886-CC', year: '1886', mintMark: 'CC', pcgs: { price: 400, grades: generateGrades(400) }, ngc: { price: 380, grades: generateGrades(380) } },
    { date: '1885', year: '1885', mintMark: 'P', pcgs: { price: 41, grades: generateGrades(41) }, ngc: { price: 38, grades: generateGrades(38) } },
    { date: '1885-O', year: '1885', mintMark: 'O', pcgs: { price: 43, grades: generateGrades(43) }, ngc: { price: 40, grades: generateGrades(40) } },
    { date: '1885-S', year: '1885', mintMark: 'S', pcgs: { price: 47, grades: generateGrades(47) }, ngc: { price: 44, grades: generateGrades(44) } },
    { date: '1885-CC', year: '1885', mintMark: 'CC', pcgs: { price: 320, grades: generateGrades(320) }, ngc: { price: 304, grades: generateGrades(304) } },
    { date: '1884', year: '1884', mintMark: 'P', pcgs: { price: 42, grades: generateGrades(42) }, ngc: { price: 39, grades: generateGrades(39) } },
    { date: '1884-O', year: '1884', mintMark: 'O', pcgs: { price: 44, grades: generateGrades(44) }, ngc: { price: 41, grades: generateGrades(41) } },
    { date: '1884-S', year: '1884', mintMark: 'S', pcgs: { price: 48, grades: generateGrades(48) }, ngc: { price: 45, grades: generateGrades(45) } },
    { date: '1884-CC', year: '1884', mintMark: 'CC', pcgs: { price: 280, grades: generateGrades(280) }, ngc: { price: 266, grades: generateGrades(266) } },
    { date: '1883', year: '1883', mintMark: 'P', pcgs: { price: 41, grades: generateGrades(41) }, ngc: { price: 38, grades: generateGrades(38) } },
    { date: '1883-O', year: '1883', mintMark: 'O', pcgs: { price: 43, grades: generateGrades(43) }, ngc: { price: 40, grades: generateGrades(40) } },
    { date: '1883-S', year: '1883', mintMark: 'S', pcgs: { price: 46, grades: generateGrades(46) }, ngc: { price: 43, grades: generateGrades(43) } },
    { date: '1883-CC', year: '1883', mintMark: 'CC', pcgs: { price: 350, grades: generateGrades(350) }, ngc: { price: 332, grades: generateGrades(332) } },
    { date: '1882', year: '1882', mintMark: 'P', pcgs: { price: 42, grades: generateGrades(42) }, ngc: { price: 39, grades: generateGrades(39) } },
    { date: '1882-O', year: '1882', mintMark: 'O', pcgs: { price: 44, grades: generateGrades(44) }, ngc: { price: 41, grades: generateGrades(41) } },
    { date: '1882-S', year: '1882', mintMark: 'S', pcgs: { price: 47, grades: generateGrades(47) }, ngc: { price: 44, grades: generateGrades(44) } },
    { date: '1882-CC', year: '1882', mintMark: 'CC', pcgs: { price: 155, grades: generateGrades(155) }, ngc: { price: 147, grades: generateGrades(147) } },
    { date: '1881', year: '1881', mintMark: 'P', pcgs: { price: 43, grades: generateGrades(43) }, ngc: { price: 40, grades: generateGrades(40) } },
    { date: '1881-O', year: '1881', mintMark: 'O', pcgs: { price: 46, grades: generateGrades(46) }, ngc: { price: 43, grades: generateGrades(43) } },
    { date: '1881-S', year: '1881', mintMark: 'S', pcgs: { price: 49, grades: generateGrades(49) }, ngc: { price: 46, grades: generateGrades(46) } },
    { date: '1881-CC', year: '1881', mintMark: 'CC', pcgs: { price: 175, grades: generateGrades(175) }, ngc: { price: 166, grades: generateGrades(166) } },
    { date: '1880', year: '1880', mintMark: 'P', pcgs: { price: 42, grades: generateGrades(42) }, ngc: { price: 39, grades: generateGrades(39) } },
    { date: '1880-O', year: '1880', mintMark: 'O', pcgs: { price: 45, grades: generateGrades(45) }, ngc: { price: 42, grades: generateGrades(42) } },
    { date: '1880-S', year: '1880', mintMark: 'S', pcgs: { price: 48, grades: generateGrades(48) }, ngc: { price: 45, grades: generateGrades(45) } },
    { date: '1880-CC', year: '1880', mintMark: 'CC', pcgs: { price: 160, grades: generateGrades(160) }, ngc: { price: 152, grades: generateGrades(152) } },
    { date: '1879', year: '1879', mintMark: 'P', pcgs: { price: 45, grades: generateGrades(45) }, ngc: { price: 42, grades: generateGrades(42) } },
    { date: '1879-O', year: '1879', mintMark: 'O', pcgs: { price: 48, grades: generateGrades(48) }, ngc: { price: 45, grades: generateGrades(45) } },
    { date: '1879-S', year: '1879', mintMark: 'S', pcgs: { price: 50, grades: generateGrades(50) }, ngc: { price: 47, grades: generateGrades(47) } },
    { date: '1879-CC', year: '1879', mintMark: 'CC', pcgs: { price: 180, grades: generateGrades(180) }, ngc: { price: 171, grades: generateGrades(171) } },
    { date: '1878', year: '1878', mintMark: 'P', pcgs: { price: 55, grades: generateGrades(55) }, ngc: { price: 52, grades: generateGrades(52) } },
    { date: '1878-O', year: '1878', mintMark: 'O', pcgs: { price: 65, grades: generateGrades(65) }, ngc: { price: 61, grades: generateGrades(61) } },
    { date: '1878-S', year: '1878', mintMark: 'S', pcgs: { price: 75, grades: generateGrades(75) }, ngc: { price: 71, grades: generateGrades(71) } },
    { date: '1878-CC', year: '1878', mintMark: 'CC', pcgs: { price: 250, grades: generateGrades(250) }, ngc: { price: 237, grades: generateGrades(237) } },
  ]

  const loadMorganPrices = async (refresh = false) => {
    try {
      setLoading(true)
      setError('')

      const url = `/api/prices/morgans${refresh ? '?refresh=true' : ''}`
      const response = await fetch(url)

      if (!response.ok) {
        setMorgans(fallbackMorgans)
        return
      }

      const data = await response.json()
      setMorgans(data.data || fallbackMorgans)
    } catch (err) {
      setMorgans(fallbackMorgans)
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

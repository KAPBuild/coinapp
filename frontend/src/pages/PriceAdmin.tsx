import { useState, useEffect } from 'react'
import { RefreshCw, DollarSign, TrendingUp, Clock, CheckCircle, XCircle, Loader } from 'lucide-react'
import { apiRequest } from '../lib/api'

interface PriceStats {
  totalPrices: number
  pcgsPrices: number
  ngcPrices: number
  uniqueCoins: number
  lastUpdated: string | null
}

interface ScrapeLog {
  id: string
  priceSource: string
  scrapeDate: string
  status: string
  coinsUpdated: number
  errorMessage: string | null
}

export function PriceAdmin() {
  const [stats, setStats] = useState<PriceStats | null>(null)
  const [logs, setLogs] = useState<ScrapeLog[]>([])
  const [loading, setLoading] = useState(true)
  const [scraping, setScraping] = useState(false)
  const [scrapeResult, setScrapeResult] = useState<any>(null)

  useEffect(() => {
    loadStats()
    loadLogs()
  }, [])

  const loadStats = async () => {
    try {
      const data = await apiRequest<PriceStats>('/api/prices/stats')
      setStats(data)
    } catch (error) {
      console.error('Failed to load stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadLogs = async () => {
    try {
      const data = await apiRequest<ScrapeLog[]>('/api/prices/scrape-log')
      setLogs(data.slice(0, 10)) // Show last 10
    } catch (error) {
      console.error('Failed to load logs:', error)
    }
  }

  const handleScrape = async () => {
    setScraping(true)
    setScrapeResult(null)

    try {
      const result = await apiRequest<any>('/api/prices/scrape-morgan', {
        method: 'POST',
      })

      setScrapeResult(result)

      // Reload stats and logs
      await loadStats()
      await loadLogs()

    } catch (error) {
      setScrapeResult({
        success: false,
        error: error instanceof Error ? error.message : 'Scraping failed'
      })
    } finally {
      setScraping(false)
    }
  }

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'Never'
    const date = new Date(dateStr)
    const now = new Date()
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    return `${Math.floor(diffDays / 30)} months ago`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Morgan Dollar Price Updates</h1>
        <p className="text-gray-600">Manage pricing data from PCGS and NGC</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Total Prices</span>
            <DollarSign className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats?.totalPrices || 0}</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">PCGS Prices</span>
            <TrendingUp className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats?.pcgsPrices || 0}</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">NGC Prices</span>
            <TrendingUp className="w-5 h-5 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats?.ngcPrices || 0}</div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">Last Updated</span>
            <Clock className="w-5 h-5 text-gray-600" />
          </div>
          <div className="text-sm font-medium text-gray-900">{formatDate(stats?.lastUpdated || null)}</div>
        </div>
      </div>

      {/* Scrape Button */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg shadow-md p-8 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Update Morgan Dollar Prices</h2>
        <p className="text-gray-600 mb-6">
          Click the button below to scrape current prices from PCGS and NGC websites.
          This will take 2-5 minutes to complete.
        </p>

        <button
          onClick={handleScrape}
          disabled={scraping}
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors"
        >
          {scraping ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              Scraping Prices...
            </>
          ) : (
            <>
              <RefreshCw className="w-5 h-5" />
              Update All Prices Now
            </>
          )}
        </button>

        {/* Scrape Result */}
        {scrapeResult && (
          <div className={`mt-6 p-4 rounded-lg ${scrapeResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            <div className="flex items-start gap-3">
              {scrapeResult.success ? (
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              )}
              <div>
                <p className={`font-medium ${scrapeResult.success ? 'text-green-800' : 'text-red-800'}`}>
                  {scrapeResult.success ? 'Success!' : 'Error'}
                </p>
                <p className={`text-sm mt-1 ${scrapeResult.success ? 'text-green-700' : 'text-red-700'}`}>
                  {scrapeResult.success ? (
                    <>
                      Imported {scrapeResult.totalImported} prices
                      ({scrapeResult.pcgsCount} from PCGS, {scrapeResult.ngcCount} from NGC)
                    </>
                  ) : (
                    scrapeResult.error || scrapeResult.details
                  )}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* How It Works */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-lg font-bold text-gray-900 mb-4">How It Works</h2>
        <div className="space-y-3 text-gray-600">
          <div className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">1</span>
            <p>Scraper fetches PCGS website for all Morgan Dollar prices</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">2</span>
            <p>Scraper fetches NGC website for all Morgan Dollar prices</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">3</span>
            <p>Prices are saved to Cloudflare D1 database</p>
          </div>
          <div className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">4</span>
            <p>Users see average of PCGS + NGC prices when viewing their coins</p>
          </div>
        </div>
      </div>

      {/* Scrape History */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Updates</h2>
        {logs.length === 0 ? (
          <p className="text-gray-600 text-center py-8">No update history yet</p>
        ) : (
          <div className="space-y-2">
            {logs.map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  {log.status === 'success' ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : log.status === 'failed' ? (
                    <XCircle className="w-5 h-5 text-red-600" />
                  ) : (
                    <Loader className="w-5 h-5 text-blue-600 animate-spin" />
                  )}
                  <div>
                    <p className="font-medium text-gray-900">
                      {log.priceSource}
                      {log.status === 'success' && ` - ${log.coinsUpdated} prices`}
                    </p>
                    <p className="text-sm text-gray-600">
                      {formatDate(log.scrapeDate)}
                      {log.errorMessage && ` - ${log.errorMessage}`}
                    </p>
                  </div>
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded ${
                  log.status === 'success' ? 'bg-green-100 text-green-800' :
                  log.status === 'failed' ? 'bg-red-100 text-red-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {log.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

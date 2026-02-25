import { useState } from 'react'
import { Star, Filter, TrendingUp, AlertTriangle, Gem } from 'lucide-react'
import { ALL_KEY_DATES, SeriesKeyDates, Rarity, formatMintage } from '../data/keyDatesData'

type RarityFilter = 'all' | Rarity

const RARITY_CONFIG: Record<Rarity, {
  label: string
  badgeClass: string
  rowClass: string
  icon: React.ReactNode
}> = {
  'semi-key': {
    label: 'Semi-Key',
    badgeClass: 'bg-yellow-100 text-yellow-800 border border-yellow-300',
    rowClass: 'border-l-4 border-yellow-400',
    icon: <TrendingUp className="w-3.5 h-3.5" />,
  },
  'key': {
    label: 'Key Date',
    badgeClass: 'bg-orange-100 text-orange-800 border border-orange-300',
    rowClass: 'border-l-4 border-orange-400',
    icon: <Star className="w-3.5 h-3.5" />,
  },
  'ultra-rare': {
    label: 'Ultra-Rare',
    badgeClass: 'bg-red-100 text-red-800 border border-red-300',
    rowClass: 'border-l-4 border-red-500',
    icon: <Gem className="w-3.5 h-3.5" />,
  },
}

const FILTER_BUTTONS: { value: RarityFilter; label: string; activeClass: string }[] = [
  { value: 'all', label: 'All Dates', activeClass: 'bg-slate-700 text-white' },
  { value: 'semi-key', label: 'Semi-Key', activeClass: 'bg-yellow-500 text-white' },
  { value: 'key', label: 'Key Date', activeClass: 'bg-orange-500 text-white' },
  { value: 'ultra-rare', label: 'Ultra-Rare', activeClass: 'bg-red-600 text-white' },
]

export function KeyDateGuide() {
  const [selectedSeriesId, setSelectedSeriesId] = useState<string>(ALL_KEY_DATES[0].seriesId)
  const [rarityFilter, setRarityFilter] = useState<RarityFilter>('all')

  const selectedSeries: SeriesKeyDates | undefined = ALL_KEY_DATES.find(s => s.seriesId === selectedSeriesId)

  const filteredEntries = selectedSeries
    ? selectedSeries.entries.filter(e => rarityFilter === 'all' || e.rarity === rarityFilter)
    : []

  const totalKeyDates = ALL_KEY_DATES.reduce((sum, s) => sum + s.entries.filter(e => e.rarity === 'key' || e.rarity === 'ultra-rare').length, 0)
  const totalUltraRare = ALL_KEY_DATES.reduce((sum, s) => sum + s.entries.filter(e => e.rarity === 'ultra-rare').length, 0)

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 text-white">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
            <Star className="w-6 h-6 text-white fill-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold">Key Date Guide</h1>
            <p className="text-slate-300 mt-1">
              US coin key dates, semi-keys, and ultra-rare varieties — an investment reference for serious collectors.
            </p>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-5 border-t border-slate-700">
          <div className="text-center">
            <p className="text-2xl font-bold text-amber-400">{ALL_KEY_DATES.length}</p>
            <p className="text-xs text-slate-400">Series Covered</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-orange-400">{totalKeyDates}</p>
            <p className="text-xs text-slate-400">Key Dates</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-red-400">{totalUltraRare}</p>
            <p className="text-xs text-slate-400">Ultra-Rare</p>
          </div>
        </div>
      </div>

      {/* Rarity Legend */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-sm text-gray-500">
            <Filter className="w-4 h-4" />
            <span className="font-medium">Rarity:</span>
          </div>
          {FILTER_BUTTONS.map(btn => (
            <button
              key={btn.value}
              onClick={() => setRarityFilter(btn.value)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                rarityFilter === btn.value
                  ? btn.activeClass
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>

        {/* Legend explanation */}
        <div className="flex flex-wrap gap-4 mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500">
          <div className="flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5 text-yellow-600" />
            <span><strong className="text-yellow-700">Semi-Key</strong> — Scarce in high grades; moderate premium</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Star className="w-3.5 h-3.5 text-orange-600" />
            <span><strong className="text-orange-700">Key Date</strong> — Low mintage or condition rarity; significant premium</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Gem className="w-3.5 h-3.5 text-red-600" />
            <span><strong className="text-red-700">Ultra-Rare</strong> — Fewer than a handful known; museum-class rarity</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Series Selector (sidebar on desktop, horizontal scroll on mobile) */}
        <div className="lg:w-56 flex-shrink-0">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100">
              <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wide">Series</h2>
            </div>
            {/* Mobile: horizontal scroll */}
            <div className="flex lg:hidden gap-2 overflow-x-auto p-3">
              {ALL_KEY_DATES.map(series => (
                <button
                  key={series.seriesId}
                  onClick={() => setSelectedSeriesId(series.seriesId)}
                  className={`flex-shrink-0 px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                    selectedSeriesId === series.seriesId
                      ? 'bg-amber-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {series.seriesName}
                </button>
              ))}
            </div>
            {/* Desktop: vertical list */}
            <div className="hidden lg:block divide-y divide-gray-50">
              {ALL_KEY_DATES.map(series => {
                const keyCount = series.entries.filter(e => e.rarity !== 'semi-key').length
                const ultraCount = series.entries.filter(e => e.rarity === 'ultra-rare').length
                return (
                  <button
                    key={series.seriesId}
                    onClick={() => setSelectedSeriesId(series.seriesId)}
                    className={`w-full text-left px-4 py-3 transition-colors ${
                      selectedSeriesId === series.seriesId
                        ? 'bg-amber-50 border-r-2 border-amber-500'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <p className={`text-sm font-medium ${selectedSeriesId === series.seriesId ? 'text-amber-700' : 'text-gray-800'}`}>
                      {series.seriesName}
                    </p>
                    <div className="flex gap-2 mt-0.5">
                      {keyCount > 0 && (
                        <span className="text-xs text-orange-600">{keyCount} key</span>
                      )}
                      {ultraCount > 0 && (
                        <span className="text-xs text-red-600">{ultraCount} ultra-rare</span>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Key Dates Table */}
        <div className="flex-1 min-w-0">
          {selectedSeries ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedSeries.seriesName}</h2>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {filteredEntries.length} of {selectedSeries.entries.length} dates shown
                  </p>
                </div>
                {rarityFilter !== 'all' && (
                  <button
                    onClick={() => setRarityFilter('all')}
                    className="text-xs text-gray-400 hover:text-gray-600 underline"
                  >
                    Clear filter
                  </button>
                )}
              </div>

              {filteredEntries.length === 0 ? (
                <div className="px-6 py-12 text-center">
                  <AlertTriangle className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">No {rarityFilter} dates in this series.</p>
                  <button
                    onClick={() => setRarityFilter('all')}
                    className="mt-2 text-sm text-amber-600 hover:underline"
                  >
                    Show all
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {filteredEntries.map(entry => {
                    const config = RARITY_CONFIG[entry.rarity]
                    const displayId = entry.mintMark
                      ? `${entry.year}-${entry.mintMark}`
                      : `${entry.year}`

                    return (
                      <div
                        key={entry.id}
                        className={`px-6 py-4 ${config.rowClass} hover:bg-gray-50/50 transition-colors`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                          {/* Date + Badge */}
                          <div className="flex items-center gap-3 sm:w-52 flex-shrink-0">
                            <span className="text-xl font-black text-gray-900 tabular-nums">
                              {displayId}
                            </span>
                            <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full ${config.badgeClass}`}>
                              {config.icon}
                              {config.label}
                            </span>
                          </div>

                          {/* Details */}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-700 leading-relaxed">{entry.notes}</p>
                            <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-xs">
                              <div>
                                <span className="text-gray-400">Mintage </span>
                                <span className="font-semibold text-gray-700">{formatMintage(entry.mintage)}</span>
                              </div>
                              {entry.estimatedSurvivors !== undefined && entry.estimatedSurvivors > 0 && (
                                <div>
                                  <span className="text-gray-400">Est. Survivors </span>
                                  <span className="font-semibold text-gray-700">{formatMintage(entry.estimatedSurvivors)}</span>
                                </div>
                              )}
                              {entry.estimatedSurvivors !== undefined && entry.estimatedSurvivors > 0 && entry.mintage > 0 && (
                                <div>
                                  <span className="text-gray-400">Survival Rate </span>
                                  <span className="font-semibold text-gray-700">
                                    {((entry.estimatedSurvivors / entry.mintage) * 100).toFixed(1)}%
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

              <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
                <p className="text-xs text-gray-400 text-center">
                  Data sourced from PCGS population reports and standard numismatic references. Values and populations change — always verify before purchase.
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
              <p className="text-gray-400">Select a series to view key dates.</p>
            </div>
          )}
        </div>
      </div>

      {/* Collecting Tips */}
      <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-amber-900 mb-3">Collector Tips</h3>
        <ul className="space-y-2 text-sm text-amber-800">
          <li className="flex gap-2">
            <span className="font-bold flex-shrink-0">→</span>
            <span>Always buy key dates in <strong>PCGS or NGC slabs</strong>. Many famous key dates (1916-D Mercury dime, 1914-D Lincoln, 1901-S Barber quarter) are heavily counterfeited.</span>
          </li>
          <li className="flex gap-2">
            <span className="font-bold flex-shrink-0">→</span>
            <span>A <strong>semi-key in high grade</strong> can be a better investment than a key date in low grade. Population reports tell you what grades are truly scarce.</span>
          </li>
          <li className="flex gap-2">
            <span className="font-bold flex-shrink-0">→</span>
            <span><strong>Survival rate</strong> matters more than mintage. The 1886-O Morgan had 10M+ mintage but most circulated heavily — it's rarer in MS-65 than the 1895-P proof.</span>
          </li>
          <li className="flex gap-2">
            <span className="font-bold flex-shrink-0">→</span>
            <span>Use the <strong>Stack Intel</strong> page for deep 3D analysis of Morgan Dollar investment potential across the full series.</span>
          </li>
        </ul>
      </div>
    </div>
  )
}

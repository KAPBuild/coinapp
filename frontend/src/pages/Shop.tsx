import { useState } from 'react'
import { Filter, ChevronDown, ExternalLink, Mail, Loader, ShoppingBag, Award, Coins } from 'lucide-react'
import { useShopCoins } from '../hooks/useShop'
import type { ShopCoin } from '../types/shopTypes'

function formatTitle(coin: ShopCoin): string {
  const year = coin.year ? String(coin.year) : ''
  const mint = coin.mint ? `-${coin.mint}` : ''
  const series = coin.series || coin.denomination || ''
  return `${year}${mint} ${series}`.trim() || 'Coin'
}

function gradeDisplay(coin: ShopCoin): string | null {
  if (coin.isGraded === 'Y' && coin.actualGrade) {
    return coin.actualGrade
  }
  if (coin.estimatedGrade) {
    return `~${coin.estimatedGrade}`
  }
  return null
}

function metalColor(type: string | null | undefined): string {
  switch (type?.toLowerCase()) {
    case 'gold': return 'bg-amber-500/20 text-amber-400 border-amber-500/30'
    case 'silver': return 'bg-slate-400/20 text-slate-300 border-slate-400/30'
    case 'platinum': return 'bg-blue-400/20 text-blue-300 border-blue-400/30'
    case 'copper': return 'bg-orange-500/20 text-orange-400 border-orange-500/30'
    default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30'
  }
}

interface InquiryModalProps {
  coin: ShopCoin
  onClose: () => void
}

function InquiryModal({ coin, onClose }: InquiryModalProps) {
  const title = formatTitle(coin)
  const grade = gradeDisplay(coin)
  const subject = `Inquiry about: ${title}${grade ? ` (${grade})` : ''}`
  const body = `Hi,\n\nI'm interested in the following coin:\n\n${title}${grade ? `\nGrade: ${grade}` : ''}${coin.currentPrice ? `\nListed Price: $${coin.currentPrice.toLocaleString()}` : ''}\n\nPlease let me know if it's still available.\n\nThank you!`
  const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-slate-800 border border-slate-700 rounded-xl w-full max-w-md p-6 space-y-4" onClick={e => e.stopPropagation()}>
        <h3 className="text-lg font-bold text-white">Interested in this coin?</h3>
        <div className="bg-slate-700/50 rounded-lg p-4">
          <p className="text-white font-medium">{title}</p>
          {grade && <p className="text-slate-400 text-sm">Grade: {grade}</p>}
          {coin.currentPrice && (
            <p className="text-green-400 font-semibold mt-1">${coin.currentPrice.toLocaleString()}</p>
          )}
        </div>
        <p className="text-slate-400 text-sm">
          Send us an email and we'll get back to you with availability and details.
        </p>
        <div className="flex gap-3">
          <a
            href={mailtoLink}
            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors"
          >
            <Mail className="w-4 h-4" />
            Send Email
          </a>
          <button
            onClick={onClose}
            className="px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export function Shop() {
  const { data: coins, isLoading, error } = useShopCoins()
  const [sortBy, setSortBy] = useState('newest')
  const [filterMetal, setFilterMetal] = useState('all')
  const [inquiryCoin, setInquiryCoin] = useState<ShopCoin | null>(null)

  const filtered = (coins || []).filter(coin =>
    filterMetal === 'all' || (coin.metalType?.toLowerCase() === filterMetal.toLowerCase())
  )

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'price-low') return (a.currentPrice || 0) - (b.currentPrice || 0)
    if (sortBy === 'price-high') return (b.currentPrice || 0) - (a.currentPrice || 0)
    if (sortBy === 'year-new') return (b.year || 0) - (a.year || 0)
    if (sortBy === 'year-old') return (a.year || 0) - (b.year || 0)
    return 0
  })

  // Get unique metal types for the filter
  const metalTypes = [...new Set((coins || []).map(c => c.metalType).filter(Boolean))]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <ShoppingBag className="w-8 h-8 text-amber-400" />
          <h2 className="text-3xl font-bold text-white">Shop</h2>
        </div>
        <p className="text-slate-400">Browse our coins available for sale</p>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader className="w-10 h-10 text-blue-400 animate-spin mb-4" />
          <p className="text-slate-400">Loading shop...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-900/20 border border-red-800/50 rounded-lg p-6 text-center">
          <p className="text-red-400">Failed to load shop. Please try again later.</p>
        </div>
      )}

      {/* Content */}
      {!isLoading && !error && (
        <>
          {/* Filters */}
          {(coins?.length || 0) > 0 && (
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-500" />
                <select
                  value={filterMetal}
                  onChange={(e) => setFilterMetal(e.target.value)}
                  className="px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Metals</option>
                  {metalTypes.map(metal => (
                    <option key={metal} value={metal!}>{metal}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <ChevronDown className="w-4 h-4 text-slate-500" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="year-new">Year: Newest</option>
                  <option value="year-old">Year: Oldest</option>
                </select>
              </div>

              <div className="text-slate-500 text-sm flex items-center ml-auto">
                {sorted.length} coin{sorted.length !== 1 ? 's' : ''}
              </div>
            </div>
          )}

          {/* Coin Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sorted.map(coin => {
              const title = formatTitle(coin)
              const grade = gradeDisplay(coin)
              const hasEbay = !!coin.ebayTitle

              return (
                <div key={coin.id} className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden hover:border-slate-600 transition-colors">
                  {/* Card Header */}
                  <div className="relative h-32 bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
                    <Coins className="w-16 h-16 text-slate-600" />

                    {/* Metal type badge */}
                    {coin.metalType && (
                      <span className={`absolute top-3 left-3 text-xs font-medium px-2 py-1 rounded-full border ${metalColor(coin.metalType)}`}>
                        {coin.metalType}
                      </span>
                    )}

                    {/* Grade badge */}
                    {grade && (
                      <span className="absolute top-3 right-3 flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                        <Award className="w-3 h-3" />
                        {coin.isGraded === 'Y' && coin.gradingCompany ? `${coin.gradingCompany} ` : ''}{grade}
                      </span>
                    )}
                  </div>

                  {/* Card Body */}
                  <div className="p-4 space-y-3">
                    <div>
                      <h3 className="font-semibold text-white text-lg leading-tight">{title}</h3>
                      {coin.variation && (
                        <p className="text-slate-400 text-sm mt-0.5">{coin.variation}</p>
                      )}
                      {coin.denomination && coin.series && (
                        <p className="text-slate-500 text-sm">{coin.denomination}</p>
                      )}
                    </div>

                    {coin.notes && (
                      <p className="text-slate-400 text-sm line-clamp-2">{coin.notes}</p>
                    )}

                    {/* Price */}
                    <div className="pt-2 border-t border-slate-700">
                      {coin.currentPrice ? (
                        <span className="text-2xl font-bold text-green-400">
                          ${coin.currentPrice.toLocaleString()}
                        </span>
                      ) : (
                        <span className="text-lg text-slate-400">Contact for price</span>
                      )}
                      {coin.quantity > 1 && (
                        <span className="text-slate-500 text-sm ml-2">({coin.quantity} available)</span>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-1">
                      {hasEbay && (
                        <a
                          href={`https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(coin.ebayTitle!)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium transition-colors text-sm"
                        >
                          <ExternalLink className="w-4 h-4" />
                          View on eBay
                        </a>
                      )}
                      <button
                        onClick={() => setInquiryCoin(coin)}
                        className={`flex items-center justify-center gap-2 ${hasEbay ? 'flex-1' : 'w-full'} bg-slate-700 hover:bg-slate-600 text-white py-2.5 rounded-lg font-medium transition-colors text-sm`}
                      >
                        <Mail className="w-4 h-4" />
                        Inquire
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Empty State */}
          {sorted.length === 0 && (coins?.length || 0) > 0 && (
            <div className="text-center py-12">
              <p className="text-slate-400 text-lg">No coins match this filter.</p>
            </div>
          )}

          {(coins?.length || 0) === 0 && (
            <div className="text-center py-20">
              <ShoppingBag className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No coins currently for sale</h3>
              <p className="text-slate-400">Check back soon - new coins are added regularly.</p>
            </div>
          )}
        </>
      )}

      {/* Inquiry Modal */}
      {inquiryCoin && (
        <InquiryModal coin={inquiryCoin} onClose={() => setInquiryCoin(null)} />
      )}
    </div>
  )
}

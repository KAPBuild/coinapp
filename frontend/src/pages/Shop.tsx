import { useState } from 'react'
import { ChevronDown, ExternalLink, Mail, Loader, ShoppingBag, Award, Coins, CreditCard, Tag } from 'lucide-react'
import { useShop } from '../hooks/useShop'
import { CheckoutModal } from '../components/shop/CheckoutModal'
import type { ShopCoin, EbayShopItem } from '../types/shopTypes'

// --- Helpers for direct (inventory) listings ---

function formatTitle(coin: ShopCoin): string {
  const year = coin.year ? String(coin.year) : ''
  const mint = coin.mint ? `-${coin.mint}` : ''
  const series = coin.series || coin.denomination || ''
  return `${year}${mint} ${series}`.trim() || 'Coin'
}

function gradeDisplay(coin: ShopCoin): string | null {
  if (coin.isGraded === 'Y' && coin.actualGrade) return coin.actualGrade
  if (coin.estimatedGrade) return `~${coin.estimatedGrade}`
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

// --- Inquiry Modal (for direct listings) ---

function InquiryModal({ coin, onClose }: { coin: ShopCoin; onClose: () => void }) {
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
          {coin.currentPrice && <p className="text-green-400 font-semibold mt-1">${coin.currentPrice.toLocaleString()}</p>}
        </div>
        <p className="text-slate-400 text-sm">Send us an email and we'll get back to you with availability and details.</p>
        <div className="flex gap-3">
          <a href={mailtoLink} className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-medium transition-colors">
            <Mail className="w-4 h-4" /> Send Email
          </a>
          <button onClick={onClose} className="px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors">Close</button>
        </div>
      </div>
    </div>
  )
}

// --- eBay Listing Card ---

function EbayCard({ item, onBuyDirect }: { item: EbayShopItem; onBuyDirect: (item: EbayShopItem) => void }) {
  const linkUrl = item.affiliateUrl || item.ebayUrl

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden hover:border-slate-600 transition-colors flex flex-col">
      {/* Image */}
      <div className="relative h-48 bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center overflow-hidden">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.title}
            className="w-full h-full object-contain p-2"
            loading="lazy"
          />
        ) : (
          <Coins className="w-16 h-16 text-slate-600" />
        )}

        {/* eBay badge */}
        <span className="absolute top-3 left-3 text-xs font-medium px-2 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
          eBay
        </span>

        {/* Condition badge */}
        {item.condition && (
          <span className="absolute top-3 right-3 text-xs font-medium px-2 py-1 rounded-full bg-slate-500/20 text-slate-300 border border-slate-500/30">
            {item.condition}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-4 space-y-3 flex-1 flex flex-col">
        <div className="flex-1">
          <h3 className="font-semibold text-white text-sm leading-tight line-clamp-2">{item.title}</h3>
          {item.categoryName && (
            <p className="text-slate-500 text-xs mt-1 flex items-center gap-1">
              <Tag className="w-3 h-3" />
              {item.categoryName}
            </p>
          )}
        </div>

        {/* Price */}
        <div className="pt-2 border-t border-slate-700">
          {item.price ? (
            <span className="text-2xl font-bold text-green-400">${item.price.toFixed(2)}</span>
          ) : (
            <span className="text-lg text-slate-400">Contact for price</span>
          )}
          {item.quantityAvailable > 1 && (
            <span className="text-slate-500 text-sm ml-2">({item.quantityAvailable} available)</span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-1">
          {item.price && (
            <button
              onClick={() => onBuyDirect(item)}
              className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-lg font-medium transition-colors text-sm"
            >
              <CreditCard className="w-4 h-4" />
              Buy Direct
            </button>
          )}
          <a
            href={linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center justify-center gap-2 ${item.price ? 'flex-1' : 'w-full'} bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium transition-colors text-sm`}
          >
            <ExternalLink className="w-4 h-4" />
            View on eBay
          </a>
        </div>
      </div>
    </div>
  )
}

// --- Direct Listing Card (from admin inventory) ---

function DirectCard({ coin, onInquire }: { coin: ShopCoin; onInquire: (coin: ShopCoin) => void }) {
  const title = formatTitle(coin)
  const grade = gradeDisplay(coin)
  const hasEbay = !!coin.ebayTitle

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden hover:border-slate-600 transition-colors flex flex-col">
      {/* Header */}
      <div className="relative h-32 bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
        <Coins className="w-16 h-16 text-slate-600" />
        {coin.metalType && (
          <span className={`absolute top-3 left-3 text-xs font-medium px-2 py-1 rounded-full border ${metalColor(coin.metalType)}`}>
            {coin.metalType}
          </span>
        )}
        {grade && (
          <span className="absolute top-3 right-3 flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
            <Award className="w-3 h-3" />
            {coin.isGraded === 'Y' && coin.gradingCompany ? `${coin.gradingCompany} ` : ''}{grade}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-4 space-y-3 flex-1 flex flex-col">
        <div className="flex-1">
          <h3 className="font-semibold text-white text-lg leading-tight">{title}</h3>
          {coin.variation && <p className="text-slate-400 text-sm mt-0.5">{coin.variation}</p>}
          {coin.denomination && coin.series && <p className="text-slate-500 text-sm">{coin.denomination}</p>}
          {coin.notes && <p className="text-slate-400 text-sm line-clamp-2 mt-1">{coin.notes}</p>}
        </div>

        {/* Price */}
        <div className="pt-2 border-t border-slate-700">
          {coin.currentPrice ? (
            <span className="text-2xl font-bold text-green-400">${coin.currentPrice.toLocaleString()}</span>
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
            onClick={() => onInquire(coin)}
            className={`flex items-center justify-center gap-2 ${hasEbay ? 'flex-1' : 'w-full'} bg-slate-700 hover:bg-slate-600 text-white py-2.5 rounded-lg font-medium transition-colors text-sm`}
          >
            <Mail className="w-4 h-4" />
            Inquire
          </button>
        </div>
      </div>
    </div>
  )
}

// --- Main Shop Page ---

export function Shop() {
  const { data, isLoading, error } = useShop()
  const [sortBy, setSortBy] = useState('newest')
  const [inquiryCoin, setInquiryCoin] = useState<ShopCoin | null>(null)
  const [checkoutItem, setCheckoutItem] = useState<EbayShopItem | null>(null)

  const ebayListings = data?.ebayListings || []
  const directListings = data?.directListings || []
  const totalItems = ebayListings.length + directListings.length

  // Sort eBay listings
  const sortedEbay = [...ebayListings].sort((a, b) => {
    if (sortBy === 'price-low') return (a.price || 0) - (b.price || 0)
    if (sortBy === 'price-high') return (b.price || 0) - (a.price || 0)
    return 0
  })

  // Sort direct listings
  const sortedDirect = [...directListings].sort((a, b) => {
    if (sortBy === 'price-low') return (a.currentPrice || 0) - (b.currentPrice || 0)
    if (sortBy === 'price-high') return (b.currentPrice || 0) - (a.currentPrice || 0)
    if (sortBy === 'year-new') return (b.year || 0) - (a.year || 0)
    if (sortBy === 'year-old') return (a.year || 0) - (b.year || 0)
    return 0
  })

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <ShoppingBag className="w-8 h-8 text-amber-400" />
          <h2 className="text-3xl font-bold text-white">Shop</h2>
        </div>
        <p className="text-slate-400">Browse our coins available for sale — buy direct or view on eBay</p>
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
          {/* Sort Control */}
          {totalItems > 0 && (
            <div className="flex flex-col sm:flex-row gap-3">
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
                </select>
              </div>

              <div className="text-slate-500 text-sm flex items-center ml-auto">
                {totalItems} item{totalItems !== 1 ? 's' : ''}
              </div>
            </div>
          )}

          {/* eBay Listings Section */}
          {sortedEbay.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                  <ExternalLink className="w-3.5 h-3.5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white">From Our eBay Store</h3>
                <span className="text-slate-500 text-sm">({sortedEbay.length})</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {sortedEbay.map(item => (
                  <EbayCard
                    key={item.id}
                    item={item}
                    onBuyDirect={setCheckoutItem}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Direct Listings Section */}
          {sortedDirect.length > 0 && (
            <div className="space-y-4">
              {sortedEbay.length > 0 && (
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-amber-600 rounded flex items-center justify-center">
                    <Coins className="w-3.5 h-3.5 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">Additional Inventory</h3>
                  <span className="text-slate-500 text-sm">({sortedDirect.length})</span>
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {sortedDirect.map(coin => (
                  <DirectCard
                    key={coin.id}
                    coin={coin}
                    onInquire={setInquiryCoin}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {totalItems === 0 && (
            <div className="text-center py-20">
              <ShoppingBag className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No coins currently for sale</h3>
              <p className="text-slate-400">Check back soon — new coins are added regularly.</p>
            </div>
          )}
        </>
      )}

      {/* Inquiry Modal (for direct listings) */}
      {inquiryCoin && (
        <InquiryModal coin={inquiryCoin} onClose={() => setInquiryCoin(null)} />
      )}

      {/* Checkout Modal (for eBay listings - Buy Direct) */}
      {checkoutItem && (
        <CheckoutModal item={checkoutItem} onClose={() => setCheckoutItem(null)} />
      )}
    </div>
  )
}

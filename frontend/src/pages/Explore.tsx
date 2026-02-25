import { useState } from 'react'
import { Search, ArrowLeft, Coins, Star } from 'lucide-react'
import { CoinSearchAutocomplete } from '../components/CoinSearchAutocomplete'
import { CoinCategoryCard, CoinSubcategoryCard } from '../components/CoinCategoryCard'
import { COIN_CATEGORIES, CoinCategory, CoinSubcategory } from '../data/coinCategories'
import { getKeyDatesForSeries, formatMintage, Rarity } from '../data/keyDatesData'

const RARITY_STYLES: Record<Rarity, { badge: string; label: string }> = {
  'semi-key': { badge: 'bg-yellow-100 text-yellow-800 border-yellow-300', label: 'Semi-Key' },
  'key':      { badge: 'bg-orange-100 text-orange-800 border-orange-300', label: 'Key Date' },
  'ultra-rare': { badge: 'bg-red-100 text-red-800 border-red-300', label: 'Ultra-Rare' },
}

export function Explore() {
  const [selectedCategory, setSelectedCategory] = useState<CoinCategory | null>(null)
  const [selectedSubcategory, setSelectedSubcategory] = useState<CoinSubcategory | null>(null)

  const handleSearchSelect = (result: { id: string; name: string; category: string }) => {
    const category = COIN_CATEGORIES.find(c => c.id === result.id)
    if (category) {
      setSelectedCategory(category)
      setSelectedSubcategory(null)
      return
    }

    for (const cat of COIN_CATEGORIES) {
      const sub = cat.subcategories?.find(s => s.id === result.id)
      if (sub) {
        setSelectedCategory(cat)
        setSelectedSubcategory(sub)
        return
      }
    }
  }

  const handleCategoryClick = (category: CoinCategory) => {
    setSelectedCategory(category)
    setSelectedSubcategory(null)
  }

  const handleSubcategoryClick = (subcategory: CoinSubcategory) => {
    setSelectedSubcategory(subcategory)
  }

  const handleBack = () => {
    if (selectedSubcategory) {
      setSelectedSubcategory(null)
    } else {
      setSelectedCategory(null)
    }
  }

  // ── Main categories view ─────────────────────────────────────────────────
  if (!selectedCategory) {
    return (
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg">
              <Search className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Coin Search</h1>
              <p className="text-sm text-amber-600 font-medium">US Coin Reference Guide</p>
            </div>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore US coins by type, denomination, and era. Browse categories and dive into key dates.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto">
          <CoinSearchAutocomplete onSelect={handleSearchSelect} />
        </div>

        {/* Category Grid */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Browse by Category</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {COIN_CATEGORIES.map(category => (
              <CoinCategoryCard
                key={category.id}
                id={category.id}
                name={category.name}
                years={category.years}
                imageUrl={category.imageUrl}
                description={category.description}
                onClick={() => handleCategoryClick(category)}
              />
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-6 text-white">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-3xl font-bold text-amber-400">11</p>
              <p className="text-sm text-slate-300">Categories</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-amber-400">60+</p>
              <p className="text-sm text-slate-300">Coin Types</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-amber-400">230+</p>
              <p className="text-sm text-slate-300">Years of History</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-amber-400">1793</p>
              <p className="text-sm text-slate-300">First US Coins</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── Category detail view ─────────────────────────────────────────────────
  if (!selectedSubcategory) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Categories</span>
        </button>

        {/* Category Header */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="relative h-48 sm:h-64">
            <img
              src={selectedCategory.imageUrl}
              alt={selectedCategory.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h1 className="text-3xl sm:text-4xl font-bold text-white">{selectedCategory.name}</h1>
              <p className="text-lg text-gray-200">{selectedCategory.years}</p>
            </div>
          </div>
          <div className="p-6">
            <p className="text-gray-600">{selectedCategory.description}</p>
          </div>
        </div>

        {/* Subcategories */}
        {selectedCategory.subcategories && selectedCategory.subcategories.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {selectedCategory.name} Types
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {selectedCategory.subcategories.map(sub => (
                <div key={sub.id} className="relative">
                  {sub.hasKeyDates && (
                    <div className="absolute top-2 right-2 z-10 flex items-center gap-1 bg-amber-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow">
                      <Star className="w-3 h-3 fill-white" />
                      Key Dates
                    </div>
                  )}
                  <CoinSubcategoryCard
                    name={sub.name}
                    years={sub.years}
                    imageUrl={sub.imageUrl}
                    onClick={() => handleSubcategoryClick(sub)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  // ── Subcategory detail view ──────────────────────────────────────────────
  const keyDateData = getKeyDatesForSeries(selectedSubcategory.id)

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <button
        onClick={handleBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back to {selectedCategory.name}</span>
      </button>

      {/* Subcategory Header */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="flex flex-col sm:flex-row">
          <div className="sm:w-64 h-48 sm:h-auto flex-shrink-0 bg-gradient-to-br from-amber-50 to-yellow-50 flex items-center justify-center p-8">
            <img
              src={selectedSubcategory.imageUrl}
              alt={selectedSubcategory.name}
              className="max-w-full max-h-full object-contain drop-shadow-lg"
            />
          </div>
          <div className="p-6 flex-1">
            <div className="flex items-center gap-2 text-sm text-amber-600 mb-2">
              <Coins className="w-4 h-4" />
              <span>{selectedCategory.name}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
              {selectedSubcategory.name}
            </h1>
            <p className="text-lg text-gray-500 mb-3">{selectedSubcategory.years}</p>
            {selectedSubcategory.hasKeyDates && (
              <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-800 text-sm font-semibold px-3 py-1 rounded-full">
                <Star className="w-4 h-4 fill-amber-600 text-amber-600" />
                This series has notable key dates
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Key Dates Section */}
      {keyDateData && keyDateData.entries.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-2 mb-5">
            <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
            <h2 className="text-xl font-bold text-gray-900">Key Dates & Varieties</h2>
          </div>

          <div className="space-y-3">
            {keyDateData.entries.map(entry => {
              const style = RARITY_STYLES[entry.rarity]
              const displayId = entry.mintMark
                ? `${entry.year}-${entry.mintMark}`
                : `${entry.year}`
              return (
                <div
                  key={entry.id}
                  className="flex flex-col sm:flex-row sm:items-start gap-3 p-4 rounded-xl border border-gray-100 bg-gray-50 hover:bg-amber-50/30 transition-colors"
                >
                  <div className="flex items-center gap-3 sm:w-48 flex-shrink-0">
                    <span className="text-lg font-bold text-gray-900 w-20">{displayId}</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${style.badge}`}>
                      {style.label}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-600">{entry.notes}</p>
                    <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-400">
                      <span>Mintage: <strong className="text-gray-700">{formatMintage(entry.mintage)}</strong></span>
                      {entry.estimatedSurvivors !== undefined && entry.estimatedSurvivors > 0 && (
                        <span>Est. Survivors: <strong className="text-gray-700">{formatMintage(entry.estimatedSurvivors)}</strong></span>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <p className="mt-4 text-xs text-gray-400 text-center">
            Mintage and survival data sourced from PCGS population reports and standard numismatic references.
            For investment analysis see the Key Date Guide.
          </p>
        </div>
      )}

      {/* No key date data available - show simple info without placeholders */}
      {!keyDateData && (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3">About This Series</h2>
          <p className="text-gray-600">
            Browse the <span className="font-semibold">{selectedSubcategory.name}</span> series ({selectedSubcategory.years}).
            Select another series to view key dates, or use the Key Date Guide from the main navigation for a full investment-focused reference.
          </p>
        </div>
      )}
    </div>
  )
}

import { useState } from 'react'
import { Search, ArrowLeft, Coins } from 'lucide-react'
import { CoinSearchAutocomplete } from '../components/CoinSearchAutocomplete'
import { CoinCategoryCard, CoinSubcategoryCard } from '../components/CoinCategoryCard'
import { COIN_CATEGORIES, CoinCategory, CoinSubcategory } from '../data/coinCategories'

export function Explore() {
  const [selectedCategory, setSelectedCategory] = useState<CoinCategory | null>(null)
  const [selectedSubcategory, setSelectedSubcategory] = useState<CoinSubcategory | null>(null)

  const handleSearchSelect = (result: { id: string; name: string; category: string }) => {
    // Find the category or subcategory
    const category = COIN_CATEGORIES.find(c => c.id === result.id)
    if (category) {
      setSelectedCategory(category)
      setSelectedSubcategory(null)
      return
    }

    // Check subcategories
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

  // Main categories view
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
              <p className="text-sm text-amber-600 font-medium">US Coin Price Guide</p>
            </div>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore US coins by type, denomination, and era. Find pricing, population data, and historical information.
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

  // Category detail view
  if (!selectedSubcategory) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Back Button */}
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
                <CoinSubcategoryCard
                  key={sub.id}
                  name={sub.name}
                  years={sub.years}
                  imageUrl={sub.imageUrl}
                  onClick={() => handleSubcategoryClick(sub)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  // Subcategory detail view (placeholder for now)
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Back Button */}
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
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              {selectedSubcategory.name}
            </h1>
            <p className="text-lg text-gray-600 mb-4">{selectedSubcategory.years}</p>

            {/* Placeholder content */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800 text-sm">
                Detailed pricing and population data coming soon. This page will show:
              </p>
              <ul className="mt-2 text-sm text-blue-700 list-disc list-inside space-y-1">
                <li>Price guide by grade (G-4 through MS-70)</li>
                <li>PCGS & NGC population data</li>
                <li>Historical price trends</li>
                <li>Key dates and varieties</li>
                <li>Coin specifications</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Placeholder for grade pricing table */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Price Guide</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-600">Grade</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-600">Price</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-600">Pop</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {['G-4', 'VG-8', 'F-12', 'VF-20', 'EF-40', 'AU-50', 'MS-60', 'MS-63', 'MS-65'].map(grade => (
                <tr key={grade} className="hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-gray-900">{grade}</td>
                  <td className="py-3 px-4 text-right text-gray-600">--</td>
                  <td className="py-3 px-4 text-right text-gray-600">--</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm text-gray-500 text-center">
          Price data integration coming soon
        </p>
      </div>
    </div>
  )
}

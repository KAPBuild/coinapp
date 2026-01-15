import { Search, Filter, X } from 'lucide-react'
import { useState } from 'react'

interface CoinData {
  id: number
  name: string
  type: string
  year: number
  price: number
  image: string
  mintage: number
  series: string
  denomination: string
  survivingPopulation: number
  rarity: string
  mintMark?: string
}

const exploreCatalog: CoinData[] = [
  {
    id: 1,
    name: 'American Eagle Gold Coin',
    type: 'Gold',
    year: 2023,
    price: 1650,
    image: '🪙',
    mintage: 500000,
    series: 'American Eagle',
    denomination: '1 oz',
    survivingPopulation: 450000,
    rarity: 'MS-65',
    mintMark: 'Philadelphia'
  },
  {
    id: 2,
    name: 'British Sovereign',
    type: 'Gold',
    year: 2022,
    price: 380,
    image: '🪙',
    mintage: 1200000,
    series: 'Royal Mint',
    denomination: '1 Pound',
    survivingPopulation: 1100000,
    rarity: 'MS-63',
    mintMark: 'London'
  },
  {
    id: 3,
    name: 'Canadian Maple Leaf',
    type: 'Silver',
    year: 2024,
    price: 1300,
    image: '🪙',
    mintage: 2500000,
    series: 'Maple Leaf',
    denomination: '1 oz',
    survivingPopulation: 2400000,
    rarity: 'MS-69',
    mintMark: 'Ottawa'
  },
  {
    id: 4,
    name: 'US Morgan Dollar',
    type: 'Silver',
    year: 1921,
    price: 450,
    image: '🪙',
    mintage: 44690570,
    series: 'Morgan Dollar',
    denomination: '1 Dollar',
    survivingPopulation: 3500000,
    rarity: 'VF-30',
    mintMark: 'Philadelphia'
  },
  {
    id: 5,
    name: 'Swiss Gold Francs',
    type: 'Gold',
    year: 1947,
    price: 280,
    image: '🪙',
    mintage: 5000000,
    series: 'Swiss Francs',
    denomination: '20 Francs',
    survivingPopulation: 2000000,
    rarity: 'XF-45',
    mintMark: 'Bern'
  },
  {
    id: 6,
    name: 'Austrian Philharmonic',
    type: 'Gold',
    year: 2023,
    price: 1750,
    image: '🪙',
    mintage: 800000,
    series: 'Philharmonic',
    denomination: '1 oz',
    survivingPopulation: 750000,
    rarity: 'MS-66',
    mintMark: 'Vienna'
  },
  {
    id: 7,
    name: 'Chinese Panda',
    type: 'Silver',
    year: 2023,
    price: 320,
    image: '🪙',
    mintage: 10000000,
    series: 'Panda',
    denomination: '30 grams',
    survivingPopulation: 9500000,
    rarity: 'MS-68',
    mintMark: 'Shanghai'
  },
  {
    id: 8,
    name: 'South African Krugerrand',
    type: 'Gold',
    year: 2022,
    price: 1600,
    image: '🪙',
    mintage: 3000000,
    series: 'Krugerrand',
    denomination: '1 oz',
    survivingPopulation: 2800000,
    rarity: 'MS-67',
    mintMark: 'Pretoria'
  },
]

export function Explore() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({
    series: 'all',
    denomination: 'all',
    rarity: 'all',
    mintageMin: 0,
    mintageMax: 50000000,
    populationMin: 0,
    populationMax: 10000000,
  })

  const filteredCoins = exploreCatalog.filter(coin => {
    const matchesSearch = coin.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSeries = filters.series === 'all' || coin.series === filters.series
    const matchesDenom = filters.denomination === 'all' || coin.denomination === filters.denomination
    const matchesRarity = filters.rarity === 'all' || coin.rarity === filters.rarity
    const matchesMintage = coin.mintage >= filters.mintageMin && coin.mintage <= filters.mintageMax
    const matchesPopulation = coin.survivingPopulation >= filters.populationMin && coin.survivingPopulation <= filters.populationMax

    return matchesSearch && matchesSeries && matchesDenom && matchesRarity && matchesMintage && matchesPopulation
  })

  const uniqueSeries = ['all', ...new Set(exploreCatalog.map(c => c.series))]
  const uniqueDenominations = ['all', ...new Set(exploreCatalog.map(c => c.denomination))]
  const uniqueRarities = ['all', ...new Set(exploreCatalog.map(c => c.rarity))]

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const resetFilters = () => {
    setFilters({
      series: 'all',
      denomination: 'all',
      rarity: 'all',
      mintageMin: 0,
      mintageMax: 50000000,
      populationMin: 0,
      populationMax: 10000000,
    })
  }

  const isFiltered = JSON.stringify(filters) !== JSON.stringify({
    series: 'all',
    denomination: 'all',
    rarity: 'all',
    mintageMin: 0,
    mintageMax: 50000000,
    populationMin: 0,
    populationMax: 10000000,
  })

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Explore Coins</h2>
        <p className="text-gray-600">Discover and filter coins by rarity, mintage, and specifications</p>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search coins by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
          </div>
          {isFiltered && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-2 px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
              Reset
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Series Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Series</label>
            <select
              value={filters.series}
              onChange={(e) => handleFilterChange('series', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {uniqueSeries.map(series => (
                <option key={series} value={series}>
                  {series === 'all' ? 'All Series' : series}
                </option>
              ))}
            </select>
          </div>

          {/* Denomination Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Denomination</label>
            <select
              value={filters.denomination}
              onChange={(e) => handleFilterChange('denomination', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {uniqueDenominations.map(denom => (
                <option key={denom} value={denom}>
                  {denom === 'all' ? 'All Denominations' : denom}
                </option>
              ))}
            </select>
          </div>

          {/* Rarity (R Number) Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Rarity</label>
            <select
              value={filters.rarity}
              onChange={(e) => handleFilterChange('rarity', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {uniqueRarities.map(rarity => (
                <option key={rarity} value={rarity}>
                  {rarity === 'all' ? 'All Rarities' : rarity}
                </option>
              ))}
            </select>
          </div>

          {/* Mintage Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mintage: {filters.mintageMin.toLocaleString()} - {filters.mintageMax.toLocaleString()}
            </label>
            <div className="space-y-2">
              <input
                type="range"
                min="0"
                max="50000000"
                value={filters.mintageMin}
                onChange={(e) => handleFilterChange('mintageMin', parseInt(e.target.value))}
                className="w-full"
              />
              <input
                type="range"
                min="0"
                max="50000000"
                value={filters.mintageMax}
                onChange={(e) => handleFilterChange('mintageMax', parseInt(e.target.value))}
                className="w-full"
              />
            </div>
          </div>

          {/* Estimated Surviving Population */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Est. Surviving: {filters.populationMin.toLocaleString()} - {filters.populationMax.toLocaleString()}
            </label>
            <div className="space-y-2">
              <input
                type="range"
                min="0"
                max="10000000"
                value={filters.populationMin}
                onChange={(e) => handleFilterChange('populationMin', parseInt(e.target.value))}
                className="w-full"
              />
              <input
                type="range"
                min="0"
                max="10000000"
                value={filters.populationMax}
                onChange={(e) => handleFilterChange('populationMax', parseInt(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <div>
        <p className="text-sm text-gray-600 mb-4">
          Showing {filteredCoins.length} of {exploreCatalog.length} coins
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCoins.map(coin => (
            <div key={coin.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-40 bg-gradient-to-br from-amber-50 to-yellow-50 flex items-center justify-center text-5xl">
                {coin.image}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-3 line-clamp-2">{coin.name}</h3>
                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Series:</span>
                    <span className="font-medium text-gray-900">{coin.series}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Denomination:</span>
                    <span className="font-medium text-gray-900">{coin.denomination}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Rarity:</span>
                    <span className="font-medium text-gray-900">{coin.rarity}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Mintage:</span>
                    <span className="font-medium text-gray-900">{coin.mintage.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Est. Surviving:</span>
                    <span className="font-medium text-gray-900">{coin.survivingPopulation.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-200">
                    <span className="text-gray-600">Est. Value:</span>
                    <span className="text-lg font-bold text-blue-600">${coin.price}</span>
                  </div>
                </div>
                <button className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {filteredCoins.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No coins found matching your filters.</p>
        </div>
      )}
    </div>
  )
}

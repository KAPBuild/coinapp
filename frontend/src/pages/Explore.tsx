import { Search, Filter } from 'lucide-react'
import { useState } from 'react'

const exploreCatalog = [
  { id: 1, name: 'American Eagle Gold Coin', type: 'Gold', year: 2023, price: 1650, image: '🪙' },
  { id: 2, name: 'British Sovereign', type: 'Gold', year: 2022, price: 380, image: '🪙' },
  { id: 3, name: 'Canadian Maple Leaf', type: 'Silver', year: 2024, price: 1300, image: '🪙' },
  { id: 4, name: 'US Morgan Dollar', type: 'Silver', year: 1921, price: 450, image: '🪙' },
  { id: 5, name: 'Swiss Gold Francs', type: 'Gold', year: 1947, price: 280, image: '🪙' },
  { id: 6, name: 'Austrian Philharmonic', type: 'Gold', year: 2023, price: 1750, image: '🪙' },
  { id: 7, name: 'Chinese Panda', type: 'Silver', year: 2023, price: 320, image: '🪙' },
  { id: 8, name: 'South African Krugerrand', type: 'Gold', year: 2022, price: 1600, image: '🪙' },
]

export function Explore() {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState('all')

  const filtered = exploreCatalog.filter(coin => {
    const matchesSearch = coin.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === 'all' || coin.type === filterType
    return matchesSearch && matchesType
  })

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Explore Coins</h2>
        <p className="text-gray-600">Discover coins from around the world</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search coins..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex gap-2">
          <Filter className="w-5 h-5 text-gray-400 self-center" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="Gold">Gold</option>
            <option value="Silver">Silver</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filtered.map(coin => (
          <div key={coin.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="h-40 bg-gradient-to-br from-amber-50 to-yellow-50 flex items-center justify-center text-5xl">
              {coin.image}
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{coin.name}</h3>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Type:</span>
                  <span className="font-medium">{coin.type}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Year:</span>
                  <span className="font-medium">{coin.year}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-gray-200">
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

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No coins found matching your search.</p>
        </div>
      )}
    </div>
  )
}

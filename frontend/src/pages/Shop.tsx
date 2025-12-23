import { ShoppingCart, Heart, Filter, ChevronDown } from 'lucide-react'
import { useState } from 'react'

interface ShopCoin {
  id: string
  name: string
  seller: string
  price: number
  originalPrice: number
  condition: string
  year: number
  metalType: string
  quantity: number
  rating: number
  reviews: number
  image: string
  inStock: boolean
}

const shopCoins: ShopCoin[] = [
  {
    id: '1',
    name: 'American Eagle Gold Coin 2023',
    seller: 'GoldTraders Inc',
    price: 1650,
    originalPrice: 1800,
    condition: 'MS-70',
    year: 2023,
    metalType: 'Gold',
    quantity: 5,
    rating: 4.8,
    reviews: 124,
    image: '🪙',
    inStock: true,
  },
  {
    id: '2',
    name: 'British Sovereign 1980',
    seller: 'Heritage Coins',
    price: 380,
    originalPrice: 420,
    condition: 'MS-65',
    year: 1980,
    metalType: 'Gold',
    quantity: 3,
    rating: 4.9,
    reviews: 89,
    image: '🪙',
    inStock: true,
  },
  {
    id: '3',
    name: 'Canadian Maple Leaf 2024',
    seller: 'BullionDirect',
    price: 1300,
    originalPrice: 1400,
    condition: 'MS-69',
    year: 2024,
    metalType: 'Silver',
    quantity: 10,
    rating: 4.7,
    reviews: 156,
    image: '🪙',
    inStock: true,
  },
  {
    id: '4',
    name: 'US Morgan Dollar 1921',
    seller: 'Vintage Coins LLC',
    price: 450,
    originalPrice: 500,
    condition: 'AU-58',
    year: 1921,
    metalType: 'Silver',
    quantity: 2,
    rating: 4.6,
    reviews: 67,
    image: '🪙',
    inStock: true,
  },
  {
    id: '5',
    name: 'Swiss Gold Francs 1947',
    seller: 'European Rare Coins',
    price: 280,
    originalPrice: 320,
    condition: 'MS-68',
    year: 1947,
    metalType: 'Gold',
    quantity: 1,
    rating: 4.9,
    reviews: 45,
    image: '🪙',
    inStock: true,
  },
  {
    id: '6',
    name: 'Austrian Philharmonic 2023',
    seller: 'BullionVault',
    price: 1750,
    originalPrice: 1900,
    condition: 'MS-70',
    year: 2023,
    metalType: 'Gold',
    quantity: 8,
    rating: 4.8,
    reviews: 203,
    image: '🪙',
    inStock: true,
  },
  {
    id: '7',
    name: 'Chinese Panda 2023',
    seller: 'Asian Numismatics',
    price: 320,
    originalPrice: 380,
    condition: 'MS-69',
    year: 2023,
    metalType: 'Silver',
    quantity: 6,
    rating: 4.7,
    reviews: 128,
    image: '🪙',
    inStock: true,
  },
  {
    id: '8',
    name: 'South African Krugerrand 2022',
    seller: 'Global Coins',
    price: 1600,
    originalPrice: 1700,
    condition: 'MS-67',
    year: 2022,
    metalType: 'Gold',
    quantity: 4,
    rating: 4.6,
    reviews: 91,
    image: '🪙',
    inStock: true,
  },
]

export function Shop() {
  const [cart, setCart] = useState<string[]>([])
  const [wishlist, setWishlist] = useState<string[]>([])
  const [sortBy, setSortBy] = useState('relevance')
  const [filterMetal, setFilterMetal] = useState('all')

  const filtered = shopCoins.filter(coin => filterMetal === 'all' || coin.metalType === filterMetal)

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price
    if (sortBy === 'price-high') return b.price - a.price
    if (sortBy === 'rating') return b.rating - a.rating
    return 0
  })

  const toggleWishlist = (id: string) => {
    setWishlist(wishlist.includes(id) ? wishlist.filter(w => w !== id) : [...wishlist, id])
  }

  const addToCart = (id: string) => {
    setCart([...cart, id])
  }

  const discount = (original: number, current: number) => {
    return Math.round(((original - current) / original) * 100)
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Shop Coins</h2>
          <p className="text-gray-600">Browse coins from verified sellers</p>
        </div>
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow">
          <ShoppingCart className="w-5 h-5 text-blue-600" />
          <span className="font-semibold text-gray-900">{cart.length}</span>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-400" />
          <select
            value={filterMetal}
            onChange={(e) => setFilterMetal(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Metals</option>
            <option value="Gold">Gold</option>
            <option value="Silver">Silver</option>
            <option value="Platinum">Platinum</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <ChevronDown className="w-5 h-5 text-gray-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="relevance">Most Relevant</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {sorted.map(coin => (
          <div key={coin.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative h-40 bg-gradient-to-br from-amber-50 to-yellow-50 flex items-center justify-center text-5xl">
              {coin.image}
              {coin.originalPrice > coin.price && (
                <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-semibold">
                  -{discount(coin.originalPrice, coin.price)}%
                </div>
              )}
              <button
                onClick={() => toggleWishlist(coin.id)}
                className={`absolute top-2 left-2 p-2 rounded-full transition-colors ${
                  wishlist.includes(coin.id)
                    ? 'bg-red-500 text-white'
                    : 'bg-white text-gray-400 hover:text-red-500'
                }`}
              >
                <Heart className="w-5 h-5" fill={wishlist.includes(coin.id) ? 'currentColor' : 'none'} />
              </button>
            </div>

            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 h-14">{coin.name}</h3>
              <p className="text-sm text-gray-600 mb-2">{coin.seller}</p>

              <div className="flex items-center gap-1 mb-3">
                <div className="flex text-yellow-400">
                  {'★'.repeat(Math.floor(coin.rating))}
                </div>
                <span className="text-sm text-gray-600">({coin.reviews})</span>
              </div>

              <div className="space-y-2 mb-4 py-3 border-y border-gray-200">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-gray-900">${coin.price.toLocaleString()}</span>
                  {coin.originalPrice > coin.price && (
                    <span className="text-sm text-gray-500 line-through">${coin.originalPrice}</span>
                  )}
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{coin.condition}</span>
                  <span>{coin.year}</span>
                </div>
              </div>

              <button
                onClick={() => addToCart(coin.id)}
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-4 h-4" />
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>

      {sorted.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No coins found in this category.</p>
        </div>
      )}
    </div>
  )
}

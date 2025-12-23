import { Star, Share2, Eye, Heart } from 'lucide-react'
import { useState } from 'react'

interface Showcase {
  id: string
  title: string
  owner: string
  description: string
  coins: number
  views: number
  likes: number
  featured: boolean
  image: string
  tags: string[]
}

const showcases: Showcase[] = [
  {
    id: '1',
    title: 'My Gold Collection - 20+ Years',
    owner: 'John Collector',
    description: 'Rare and valuable gold coins collected over two decades. Includes American Eagles, Sovereigns, and historic pieces.',
    coins: 47,
    views: 2340,
    likes: 156,
    featured: true,
    image: '🏆',
    tags: ['Gold', 'Rare', 'Historic'],
  },
  {
    id: '2',
    title: 'Modern Bullion Stack',
    owner: 'Sarah Investment',
    description: 'Focus on modern bullion coins as investment strategy. Includes silver and gold bullion from major mints.',
    coins: 23,
    views: 1890,
    likes: 124,
    featured: true,
    image: '💰',
    tags: ['Bullion', 'Investment', 'Modern'],
  },
  {
    id: '3',
    title: 'Panda Series Complete Set',
    owner: 'Mike Chen',
    description: 'Nearly complete collection of Chinese Panda coins. Spanning from 1982 to 2024 with rare early years.',
    coins: 35,
    views: 1567,
    likes: 98,
    featured: false,
    image: '🐼',
    tags: ['Panda', 'Series', 'Complete'],
  },
  {
    id: '4',
    title: 'Historical Sovereigns',
    owner: 'Emma Heritage',
    description: 'British Sovereigns from different eras. Featuring coins from monarchs spanning over a century.',
    coins: 28,
    views: 2100,
    likes: 189,
    featured: true,
    image: '👑',
    tags: ['Sovereign', 'British', 'Historic'],
  },
  {
    id: '5',
    title: 'Silver Dollar Collection',
    owner: 'Robert Numismatic',
    description: 'Historic US and international silver dollars. Includes Morgan dollars, Peace dollars, and trade dollars.',
    coins: 52,
    views: 1445,
    likes: 112,
    featured: false,
    image: '🪙',
    tags: ['Silver', 'Historic', 'Dollars'],
  },
  {
    id: '6',
    title: 'European Mint Rarities',
    owner: 'Alexandra Rare',
    description: 'Rare coins from European mints. Featuring Swiss, Austrian, and German numismatic treasures.',
    coins: 18,
    views: 987,
    likes: 76,
    featured: false,
    image: '🇪🇺',
    tags: ['European', 'Rare', 'Mint'],
  },
]

export function Showcase() {
  const [liked, setLiked] = useState<string[]>([])
  const [sortBy, setSortBy] = useState('featured')

  const sorted = [...showcases].sort((a, b) => {
    if (sortBy === 'featured') return (b.featured ? 1 : 0) - (a.featured ? 1 : 0)
    if (sortBy === 'views') return b.views - a.views
    if (sortBy === 'likes') return b.likes - a.likes
    return 0
  })

  const toggleLike = (id: string) => {
    setLiked(liked.includes(id) ? liked.filter(l => l !== id) : [...liked, id])
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Coin Showcase</h2>
          <p className="text-gray-600">Explore collections from the community</p>
        </div>
        <button className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors">
          Create Your Showcase
        </button>
      </div>

      <div className="flex gap-4 items-center">
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        >
          <option value="featured">Featured First</option>
          <option value="views">Most Viewed</option>
          <option value="likes">Most Liked</option>
        </select>
      </div>

      {/* Featured Showcase */}
      {sorted[0] && sorted[0].featured && (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg shadow-md overflow-hidden border-2 border-purple-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-8">
            <div className="flex items-center justify-center text-9xl">{sorted[0].image}</div>
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                <span className="text-sm font-semibold text-purple-700">Featured Showcase</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{sorted[0].title}</h3>
              <p className="text-gray-700">{sorted[0].description}</p>
              <div className="flex flex-wrap gap-2">
                {sorted[0].tags.map(tag => (
                  <span key={tag} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-8 pt-4 border-t border-purple-200">
                <div>
                  <p className="text-sm text-gray-600">By {sorted[0].owner}</p>
                </div>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <Coins className="w-5 h-5 text-gray-600" />
                    <span className="font-semibold">{sorted[0].coins} coins</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="w-5 h-5 text-gray-600" />
                    <span className="font-semibold">{sorted[0].views.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* All Showcases Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sorted.map(showcase => (
          <div key={showcase.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative h-48 bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center text-7xl">
              {showcase.image}
              {showcase.featured && (
                <div className="absolute top-2 right-2 bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                  <Star className="w-4 h-4 fill-current" />
                  Featured
                </div>
              )}
            </div>

            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{showcase.title}</h3>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{showcase.description}</p>

              <div className="flex flex-wrap gap-1 mb-4">
                {showcase.tags.slice(0, 2).map(tag => (
                  <span key={tag} className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-medium">
                    {tag}
                  </span>
                ))}
                {showcase.tags.length > 2 && (
                  <span className="px-2 py-1 text-xs text-gray-600">+{showcase.tags.length - 2}</span>
                )}
              </div>

              <div className="space-y-3 py-3 border-y border-gray-200 mb-4">
                <p className="text-sm text-gray-600">By <span className="font-semibold text-gray-900">{showcase.owner}</span></p>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div className="text-center">
                    <p className="font-semibold text-gray-900">{showcase.coins}</p>
                    <p className="text-gray-600 text-xs">Coins</p>
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-gray-900 flex items-center justify-center gap-1">
                      <Eye className="w-4 h-4" /> {(showcase.views / 1000).toFixed(1)}k
                    </p>
                    <p className="text-gray-600 text-xs">Views</p>
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-gray-900">{showcase.likes}</p>
                    <p className="text-gray-600 text-xs">Likes</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors">
                  View
                </button>
                <button
                  onClick={() => toggleLike(showcase.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    liked.includes(showcase.id)
                      ? 'bg-red-100 text-red-600 hover:bg-red-200'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Heart className="w-5 h-5" fill={liked.includes(showcase.id) ? 'currentColor' : 'none'} />
                </button>
                <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg transition-colors">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Add Coins icon import
const Coins = ({ className }: { className: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
  </svg>
)

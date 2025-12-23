import { BookOpen, ArrowRight } from 'lucide-react'
import { useState } from 'react'

interface CoinSeries {
  id: string
  name: string
  country: string
  description: string
  coinsInSeries: number
  startYear: number
  endYear: number
  metalType: string
  image: string
}

const coinSeries: CoinSeries[] = [
  {
    id: '1',
    name: 'American Eagle',
    country: 'United States',
    description: 'One of the most popular bullion coin series. Minted since 1986 in gold, silver, and platinum.',
    coinsInSeries: 50,
    startYear: 1986,
    endYear: 2024,
    metalType: 'Gold, Silver, Platinum',
    image: '🦅',
  },
  {
    id: '2',
    name: 'Canadian Maple Leaf',
    country: 'Canada',
    description: 'The flagship bullion coin of Canada. Known for its purity and distinctive maple leaf design.',
    coinsInSeries: 35,
    startYear: 1979,
    endYear: 2024,
    metalType: 'Gold, Silver, Platinum',
    image: '🍁',
  },
  {
    id: '3',
    name: 'British Sovereign',
    country: 'United Kingdom',
    description: 'Historic gold coin with over 400 years of history. One of the most recognizable coins worldwide.',
    coinsInSeries: 45,
    startYear: 1817,
    endYear: 2024,
    metalType: 'Gold',
    image: '👑',
  },
  {
    id: '4',
    name: 'Austrian Philharmonic',
    country: 'Austria',
    description: 'Features instruments of the Vienna Philharmonic. Premium bullion coin with high recognition.',
    coinsInSeries: 25,
    startYear: 1989,
    endYear: 2024,
    metalType: 'Gold, Silver, Platinum',
    image: '🎼',
  },
  {
    id: '5',
    name: 'Chinese Panda',
    country: 'China',
    description: 'Annual design changes make these coins highly collectible. Reverse features the Great Wall.',
    coinsInSeries: 35,
    startYear: 1982,
    endYear: 2024,
    metalType: 'Gold, Silver',
    image: '🐼',
  },
  {
    id: '6',
    name: 'Swiss Gold Francs',
    country: 'Switzerland',
    description: 'Historic series of gold coins including Vreneli. Popular with collectors and investors.',
    coinsInSeries: 20,
    startYear: 1897,
    endYear: 2024,
    metalType: 'Gold',
    image: '🇨🇭',
  },
]

export function Series() {
  const [selectedSeries, setSelectedSeries] = useState<string | null>(null)

  const featured = coinSeries.find(s => s.id === selectedSeries) || coinSeries[0]

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Coin Series</h2>
        <p className="text-gray-600">Explore popular coin series from around the world</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Featured Series */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">{featured.name}</h3>
                <p className="text-lg text-gray-600">{featured.country}</p>
              </div>
              <div className="text-6xl">{featured.image}</div>
            </div>

            <p className="text-gray-700 text-lg mb-6">{featured.description}</p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 py-6 border-t border-b border-gray-200 mb-6">
              <div>
                <p className="text-sm text-gray-600 mb-1">Coins in Series</p>
                <p className="text-2xl font-bold text-gray-900">{featured.coinsInSeries}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Years Minted</p>
                <p className="text-2xl font-bold text-gray-900">{featured.startYear}-{featured.endYear}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Metal Type</p>
                <p className="text-lg font-bold text-gray-900">{featured.metalType}</p>
              </div>
            </div>

            <button className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2">
              View Complete Series
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Series List */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-blue-600" />
            <h4 className="font-semibold text-gray-900">All Series</h4>
          </div>
          <div className="space-y-2">
            {coinSeries.map(series => (
              <button
                key={series.id}
                onClick={() => setSelectedSeries(series.id)}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                  selectedSeries === series.id || (selectedSeries === null && series.id === '1')
                    ? 'bg-blue-100 text-blue-900 border-2 border-blue-600'
                    : 'bg-gray-50 text-gray-900 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{series.name}</p>
                    <p className="text-sm text-gray-600">{series.country}</p>
                  </div>
                  <span className="text-2xl">{series.image}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid View of All Series */}
      <div className="border-t border-gray-200 pt-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Browse All Series</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {coinSeries.map(series => (
            <div
              key={series.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setSelectedSeries(series.id)}
            >
              <div className="text-5xl mb-4">{series.image}</div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">{series.name}</h4>
              <p className="text-sm text-gray-600 mb-4">{series.country}</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Coins:</span>
                  <span className="font-medium">{series.coinsInSeries}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Since:</span>
                  <span className="font-medium">{series.startYear}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

import { ChevronRight } from 'lucide-react'

interface CoinCategoryCardProps {
  id: string
  name: string
  years: string
  imageUrl: string
  description?: string
  onClick: () => void
}

export function CoinCategoryCard({ name, years, imageUrl, description, onClick }: CoinCategoryCardProps) {
  return (
    <button
      onClick={onClick}
      className="group relative w-full aspect-[4/3] rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            // Fallback to placeholder on error
            (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Ccircle cx="50" cy="50" r="45" fill="%23d4af37" stroke="%23b8860b" stroke-width="3"/%3E%3Ctext x="50" y="55" text-anchor="middle" font-size="20" fill="%23fff"%3E$%3C/text%3E%3C/svg%3E'
          }}
        />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-4">
        <h3 className="text-lg sm:text-xl font-bold text-white drop-shadow-lg">
          {name}
        </h3>
        <p className="text-sm text-gray-200 drop-shadow">
          {years}
        </p>
        {description && (
          <p className="text-xs text-gray-300 mt-1 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity">
            {description}
          </p>
        )}
      </div>

      {/* Hover Arrow */}
      <div className="absolute top-3 right-3 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <ChevronRight className="w-5 h-5 text-white" />
      </div>

      {/* Shine Effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent" />
      </div>
    </button>
  )
}

// Smaller variant for subcategories
interface CoinSubcategoryCardProps {
  name: string
  years: string
  imageUrl: string
  onClick: () => void
}

export function CoinSubcategoryCard({ name, years, imageUrl, onClick }: CoinSubcategoryCardProps) {
  return (
    <button
      onClick={onClick}
      className="group flex items-center gap-3 p-3 rounded-lg bg-white hover:bg-gray-50 border border-gray-200 hover:border-blue-300 shadow-sm hover:shadow transition-all w-full text-left"
    >
      {/* Coin Image */}
      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden flex-shrink-0 bg-gradient-to-br from-amber-100 to-yellow-50 shadow-inner">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Ccircle cx="50" cy="50" r="45" fill="%23d4af37" stroke="%23b8860b" stroke-width="3"/%3E%3Ctext x="50" y="55" text-anchor="middle" font-size="20" fill="%23fff"%3E$%3C/text%3E%3C/svg%3E'
          }}
        />
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
          {name}
        </h4>
        <p className="text-sm text-gray-500">{years}</p>
      </div>

      {/* Arrow */}
      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors flex-shrink-0" />
    </button>
  )
}

import { BarChart3, Package, DollarSign, Search, BookOpen, ShoppingBag, Star } from 'lucide-react'

type Page = 'home' | 'dashboard' | 'inventory' | 'forSale' | 'lookup' | 'series' | 'shop' | 'showcase'

interface NavigationProps {
  currentPage: Page
  setCurrentPage: (page: Page) => void
}

const navItems: { id: Page; label: string; icon: any }[] = [
  { id: 'dashboard', label: 'Portfolio', icon: BarChart3 },
  { id: 'inventory', label: 'Inventory', icon: Package },
  { id: 'forSale', label: 'For Sale', icon: DollarSign },
  { id: 'lookup', label: 'Lookup', icon: Search },
  { id: 'series', label: 'Series', icon: BookOpen },
  { id: 'shop', label: 'Shop', icon: ShoppingBag },
  { id: 'showcase', label: 'Showcase', icon: Star },
]

export function Navigation({ currentPage, setCurrentPage }: NavigationProps) {
  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <button
            onClick={() => setCurrentPage('home')}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <Package className="w-6 h-6 text-blue-600" />
            <h1 className="text-xl font-bold text-gray-900">CoinApp</h1>
          </button>
          <div className="flex gap-1 overflow-x-auto">
            {navItems.map(item => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentPage(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                    currentPage === item.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}

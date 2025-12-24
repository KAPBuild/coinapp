import { BarChart3, Package, DollarSign, Search, BookOpen, ShoppingBag, Star, Menu, X } from 'lucide-react'
import { useState } from 'react'

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleNavClick = (page: Page) => {
    setCurrentPage(page)
    setMobileMenuOpen(false)
  }
  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity flex-shrink-0"
          >
            <Package className="w-6 h-6 text-blue-600" />
            <h1 className="text-xl font-bold text-gray-900 hidden sm:block">CoinApp</h1>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-1">
            {navItems.map(item => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
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

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-2 space-y-1">
            {navItems.map(item => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
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
        )}
      </div>
    </nav>
  )
}

import { useState, useEffect } from 'react'
import { Coins, Search, ShoppingBag, BarChart3, Menu, X, LogIn, Info, Package, DollarSign, Gamepad2, LogOut, Filter, User, TrendingUp, HelpCircle } from 'lucide-react'
import { DarkModeToggle } from './DarkModeToggle'
import { CurrencySelector } from './CurrencySelector'
import { SearchModal } from './SearchModal'
import { CoinFlipGame } from './CoinFlipGame'
import { GradingChartModal } from './GradingChartModal'
import { QuickPhotogradeModal } from './QuickPhotogradeModal'
import { useAuth } from '../contexts/AuthContext'

type Page = 'home' | 'dashboard' | 'inventory' | 'forSale' | 'lookup' | 'explore' | 'series' | 'shop' | 'showcase' | 'about' | 'contact' | 'faq' | 'settings' | 'login' | 'register' | 'priceAdmin' | 'meltValues' | 'pcgsGrading'

interface NavigationProps {
  currentPage: Page
  setCurrentPage: (page: Page) => void
}

interface NavItem {
  id: Page
  label: string
  icon: any
}

// Primary navigation items (visible on desktop center)
const primaryNavItems: NavItem[] = [
  { id: 'inventory', label: 'Inventory', icon: Package },
  { id: 'dashboard', label: 'Portfolio', icon: BarChart3 },
  { id: 'meltValues', label: 'Melt Values', icon: TrendingUp },
  { id: 'explore', label: 'Explore', icon: Filter },
  { id: 'shop', label: 'Shop', icon: ShoppingBag },
]

// Utility navigation items (in hamburger menu)
const utilityNavItems: NavItem[] = [
  { id: 'about', label: 'About Us', icon: Info },
]

// Additional items (in hamburger menu)
const additionalNavItems: NavItem[] = [
  { id: 'forSale', label: 'For Sale', icon: DollarSign },
]

export function Navigation({ currentPage, setCurrentPage }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [gameOpen, setGameOpen] = useState(false)
  const [gradingChartOpen, setGradingChartOpen] = useState(false)
  const [quickPhotogradeOpen, setQuickPhotogradeOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [currency, setCurrency] = useState('USD')
  const { isAuthenticated, user, logout } = useAuth()

  // Load preferences from localStorage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true'
    const savedCurrency = localStorage.getItem('currency') || 'USD'
    setDarkMode(savedDarkMode)
    setCurrency(savedCurrency)

    // Update document class for dark mode
    if (savedDarkMode) {
      document.documentElement.classList.add('dark')
    }
  }, [])

  const handleNavClick = (page: Page) => {
    setCurrentPage(page)
    setMobileMenuOpen(false)
  }

  const handleDarkModeToggle = () => {
    const newDarkMode = !darkMode
    setDarkMode(newDarkMode)
    localStorage.setItem('darkMode', String(newDarkMode))

    if (newDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  const handleCurrencyChange = (newCurrency: string) => {
    setCurrency(newCurrency)
    localStorage.setItem('currency', newCurrency)
  }

  return (
    <>
      <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Left Section: Logo */}
            <button
              onClick={() => handleNavClick('home')}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity flex-shrink-0"
              aria-label="Go to home"
            >
              <Coins className="w-6 h-6 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900 hidden sm:block">CoinApp</h1>
            </button>

            {/* Center Section: Primary Navigation (Desktop Only) */}
            <div className="hidden md:flex gap-1 flex-1 justify-center">
              {primaryNavItems.map(item => {
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

            {/* Right Section: Utility Controls */}
            <div className="flex items-center gap-2">
              {/* Search Button */}
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Open search"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Quick Photograde Button */}
              <button
                onClick={() => setQuickPhotogradeOpen(true)}
                className="p-2 text-gray-600 hover:bg-blue-100 hover:text-blue-600 rounded-lg transition-colors"
                aria-label="Quick PCGS Photograde access"
                title="Quick PCGS Photograde"
              >
                <HelpCircle className="w-5 h-5" />
              </button>

              {/* Dark Mode Toggle */}
              <DarkModeToggle isDark={darkMode} onToggle={handleDarkModeToggle} />

              {/* Currency Selector */}
              <CurrencySelector selectedCurrency={currency} onCurrencyChange={handleCurrencyChange} />

              {/* Auth Section */}
              {isAuthenticated ? (
                <div className="hidden sm:flex items-center gap-2">
                  <span className="text-sm text-gray-600">{user?.email}</span>
                  <button
                    onClick={() => logout().then(() => setCurrentPage('home'))}
                    className="p-2 text-gray-600 hover:bg-red-100 hover:text-red-600 rounded-lg transition-colors"
                    aria-label="Logout"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="hidden sm:flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage('login')}
                    className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors"
                  >
                    <LogIn className="w-5 h-5" />
                    <span>Login</span>
                  </button>
                  <button
                    onClick={() => setCurrentPage('register')}
                    className="hidden sm:flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors text-sm"
                  >
                    Sign Up
                  </button>
                </div>
              )}

              {/* Hamburger Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation Menu (Below Header) */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-2 space-y-1">
              {/* Mobile Auth Section - At the Top */}
              {isAuthenticated ? (
                <div className="bg-blue-50 border border-blue-200 rounded-lg mx-2 p-4 mb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Account</p>
                        <p className="text-xs text-gray-600">{user?.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        logout().then(() => {
                          setCurrentPage('home')
                          setMobileMenuOpen(false)
                        })
                      }}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                      aria-label="Logout"
                    >
                      <LogOut className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-1 mb-3">
                  <button
                    onClick={() => handleNavClick('login')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                      currentPage === 'login'
                        ? 'bg-blue-600 text-white'
                        : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                    }`}
                  >
                    <LogIn className="w-5 h-5" />
                    Login
                  </button>
                  <button
                    onClick={() => handleNavClick('register')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                      currentPage === 'register'
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <User className="w-5 h-5" />
                    Sign Up
                  </button>
                </div>
              )}

              {/* Divider */}
              <div className="border-t border-gray-200 my-2" />

              {/* Mobile Primary Nav Items */}
              {primaryNavItems.map(item => {
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

              {/* Divider */}
              <div className="border-t border-gray-200 my-2" />

              {/* Additional Items */}
              {additionalNavItems.map(item => {
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

              {/* PCGS Grading Guide Page Button */}
              <button
                onClick={() => handleNavClick('pcgsGrading')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                  currentPage === 'pcgsGrading'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <HelpCircle className="w-5 h-5" />
                PCGS Grading Guide
              </button>

              {/* Coin Flip Game Button */}
              <button
                onClick={() => {
                  setGameOpen(true)
                  setMobileMenuOpen(false)
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <Gamepad2 className="w-5 h-5" />
                Play Coin Flip Game
              </button>

              {/* Admin Links (Only for authenticated users) */}
              {isAuthenticated && (
                <>
                  <div className="border-t border-gray-200 my-2" />
                  <button
                    onClick={() => handleNavClick('priceAdmin')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                      currentPage === 'priceAdmin'
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <TrendingUp className="w-5 h-5" />
                    Price Admin
                  </button>
                </>
              )}

              {/* Utility Items */}
              {utilityNavItems.map(item => {
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

      {/* Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Coin Flip Game Modal */}
      <CoinFlipGame isOpen={gameOpen} onClose={() => setGameOpen(false)} />

      {/* Grading Chart Modal */}
      <GradingChartModal isOpen={gradingChartOpen} onClose={() => setGradingChartOpen(false)} />

      {/* Quick Photograde Modal */}
      <QuickPhotogradeModal isOpen={quickPhotogradeOpen} onClose={() => setQuickPhotogradeOpen(false)} />
    </>
  )
}

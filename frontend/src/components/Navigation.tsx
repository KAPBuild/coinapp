import { useState, useEffect } from 'react'
import { Search, ShoppingBag, BarChart3, Menu, X, LogIn, Info, Package, DollarSign, Target, LogOut, Filter, User, TrendingUp, Award, Database } from 'lucide-react'
import { DarkModeToggle } from './DarkModeToggle'
import { SearchModal } from './SearchModal'
import { GradeGuessingGame } from './GradeGuessingGame'
import { GradingChartModal } from './GradingChartModal'
import { QuickPhotogradeModal } from './QuickPhotogradeModal'
import { LogoDark } from './Logo'
import { useAuth } from '../contexts/AuthContext'

type Page = 'home' | 'dashboard' | 'inventory' | 'forSale' | 'lookup' | 'explore' | 'series' | 'shop' | 'showcase' | 'about' | 'contact' | 'faq' | 'settings' | 'login' | 'register' | 'priceAdmin' | 'meltValues' | 'pcgsGrading' | 'stackIntel'

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
  { id: 'stackIntel', label: 'Stack Intel', icon: Database },
  { id: 'explore', label: 'Coin Search', icon: Search },
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
  const { isAuthenticated, user, logout } = useAuth()

  // Load preferences from localStorage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true'
    setDarkMode(savedDarkMode)

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

  return (
    <>
      <nav className="bg-slate-800 border-b border-slate-700 shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Left Section: Logo */}
            <button
              onClick={() => handleNavClick('home')}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity flex-shrink-0"
              aria-label="Go to home"
            >
              <LogoDark size={32} />
              <h1 className="text-xl font-bold text-white hidden sm:block">CoinApp</h1>
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
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-300 hover:bg-slate-700 hover:text-white'
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
                className="p-2 text-slate-300 hover:bg-slate-700 hover:text-white rounded-lg transition-colors"
                aria-label="Open search"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* PCGS Grading Guide Button */}
              <button
                onClick={() => handleNavClick('pcgsGrading')}
                className={`rounded-lg transition-colors ${
                  currentPage === 'pcgsGrading'
                    ? 'bg-blue-600'
                    : 'hover:bg-slate-700'
                }`}
                aria-label="PCGS Grading Guide"
                title="PCGS Grading Guide"
              >
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xs">A+</span>
                </div>
              </button>

              {/* Auth Section */}
              {isAuthenticated ? (
                <div className="hidden sm:flex items-center gap-2">
                  <span className="text-sm text-slate-400">{user?.email}</span>
                  <button
                    onClick={() => logout().then(() => setCurrentPage('home'))}
                    className="p-2 text-slate-300 hover:bg-red-900/50 hover:text-red-400 rounded-lg transition-colors"
                    aria-label="Logout"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="hidden sm:flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage('login')}
                    className="flex items-center gap-2 px-4 py-2 text-slate-300 hover:bg-slate-700 hover:text-white rounded-lg font-medium transition-colors"
                  >
                    <LogIn className="w-5 h-5" />
                    <span>Login</span>
                  </button>
                  <button
                    onClick={() => setCurrentPage('register')}
                    className="hidden sm:flex items-center gap-2 px-4 py-2 text-slate-300 hover:bg-slate-700 hover:text-white rounded-lg font-medium transition-colors text-sm"
                  >
                    Sign Up
                  </button>
                </div>
              )}

              {/* Hamburger Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-slate-300 hover:bg-slate-700 hover:text-white rounded-lg transition-colors"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation Menu (Below Header) */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-slate-700 py-2 space-y-1 bg-slate-800">
              {/* Mobile Auth Section - At the Top */}
              {isAuthenticated ? (
                <div className="bg-slate-700 border border-slate-600 rounded-lg mx-2 p-4 mb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">Account</p>
                        <p className="text-xs text-slate-400">{user?.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        logout().then(() => {
                          setCurrentPage('home')
                          setMobileMenuOpen(false)
                        })
                      }}
                      className="p-2 text-red-400 hover:bg-red-900/50 rounded-lg transition-colors"
                      aria-label="Logout"
                    >
                      <LogOut className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-1 mb-3 px-2">
                  <button
                    onClick={() => handleNavClick('login')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                      currentPage === 'login'
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-700 text-blue-400 hover:bg-slate-600'
                    }`}
                  >
                    <LogIn className="w-5 h-5" />
                    Login
                  </button>
                  <button
                    onClick={() => handleNavClick('register')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                      currentPage === 'register'
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    <User className="w-5 h-5" />
                    Sign Up
                  </button>
                </div>
              )}

              {/* Divider */}
              <div className="border-t border-slate-700 my-2" />

              {/* Mobile Primary Nav Items */}
              {primaryNavItems.map(item => {
                const Icon = item.icon
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                      currentPage === item.id
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </button>
                )
              })}

              {/* Divider */}
              <div className="border-t border-slate-700 my-2" />

              {/* Additional Items */}
              {additionalNavItems.map(item => {
                const Icon = item.icon
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                      currentPage === item.id
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-300 hover:bg-slate-700 hover:text-white'
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
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <Award className="w-5 h-5" />
                PCGS Grading Guide
              </button>

              {/* Grade Guessing Game Button */}
              <button
                onClick={() => {
                  setGameOpen(true)
                  setMobileMenuOpen(false)
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
              >
                <Target className="w-5 h-5" />
                Guess the Grade Game
              </button>

              {/* Admin Links (Only for authenticated users) */}
              {isAuthenticated && (
                <>
                  <div className="border-t border-slate-700 my-2" />
                  <button
                    onClick={() => handleNavClick('priceAdmin')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${
                      currentPage === 'priceAdmin'
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-300 hover:bg-slate-700 hover:text-white'
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
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </button>
                )
              })}

              {/* Divider */}
              <div className="border-t border-slate-700 my-2" />

              {/* Dark Mode Toggle */}
              <div className="px-4 py-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-300">Dark Mode</span>
                  <DarkModeToggle isDark={darkMode} onToggle={handleDarkModeToggle} />
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Grade Guessing Game Modal */}
      <GradeGuessingGame isOpen={gameOpen} onClose={() => setGameOpen(false)} />

      {/* Grading Chart Modal */}
      <GradingChartModal isOpen={gradingChartOpen} onClose={() => setGradingChartOpen(false)} />

      {/* Quick Photograde Modal */}
      <QuickPhotogradeModal isOpen={quickPhotogradeOpen} onClose={() => setQuickPhotogradeOpen(false)} />
    </>
  )
}

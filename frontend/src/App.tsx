import { useState } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { queryClient } from './lib/queryClient'
import { Home } from './pages/Home'
import { Dashboard } from './pages/Dashboard'
import { Inventory } from './pages/Inventory'
import { ForSale } from './pages/ForSale'
import { Lookup } from './pages/Lookup'
import { Explore } from './pages/Explore'
import { Series } from './pages/Series'
import { Shop } from './pages/Shop'
import { Showcase } from './pages/Showcase'
import { About } from './pages/About'
import { Contact } from './pages/Contact'
import { FAQ } from './pages/FAQ'
import { Settings } from './pages/Settings'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { PriceAdmin } from './pages/PriceAdmin'
import { MeltValues } from './pages/MeltValues'
import { PCGSGrading } from './pages/PCGSGrading'
import { StackIntel } from './pages/StackIntel'
import { Navigation } from './components/Navigation'

type Page = 'home' | 'dashboard' | 'inventory' | 'forSale' | 'lookup' | 'explore' | 'series' | 'shop' | 'showcase' | 'about' | 'contact' | 'faq' | 'settings' | 'login' | 'register' | 'priceAdmin' | 'meltValues' | 'pcgsGrading' | 'stackIntel'

function AppContent() {
  const [currentPage, setCurrentPage] = useState<Page>('home')
  const { isAuthenticated, isLoading } = useAuth()

  // Redirect to login if trying to access protected pages while not authenticated
  const handlePageChange = (page: Page) => {
    const protectedPages: Page[] = ['dashboard', 'forSale', 'priceAdmin']

    if (protectedPages.includes(page) && !isAuthenticated) {
      setCurrentPage('login')
    } else {
      setCurrentPage(page)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation currentPage={currentPage} setCurrentPage={handlePageChange} />
      <main className="container mx-auto px-4 py-8">
        {currentPage === 'home' && <Home onNavigate={handlePageChange} />}
        {currentPage === 'login' && <Login onNavigate={handlePageChange} />}
        {currentPage === 'register' && <Register onNavigate={handlePageChange} />}
        {currentPage === 'dashboard' && <Dashboard />}
        {currentPage === 'inventory' && <Inventory />}
        {currentPage === 'forSale' && <ForSale />}
        {currentPage === 'lookup' && <Lookup />}
        {currentPage === 'explore' && <Explore />}
        {currentPage === 'series' && <Series />}
        {currentPage === 'shop' && <Shop />}
        {currentPage === 'showcase' && <Showcase />}
        {currentPage === 'about' && <About />}
        {currentPage === 'contact' && <Contact />}
        {currentPage === 'faq' && <FAQ />}
        {currentPage === 'settings' && <Settings />}
        {currentPage === 'priceAdmin' && <PriceAdmin />}
        {currentPage === 'meltValues' && <MeltValues />}
        {currentPage === 'pcgsGrading' && <PCGSGrading />}
        {currentPage === 'stackIntel' && <StackIntel />}
      </main>
    </div>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </QueryClientProvider>
  )
}

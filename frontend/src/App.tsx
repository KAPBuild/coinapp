import { useState } from 'react'
import { Dashboard } from './pages/Dashboard'
import { Inventory } from './pages/Inventory'
import { ForSale } from './pages/ForSale'
import { Lookup } from './pages/Lookup'
import { Series } from './pages/Series'
import { Shop } from './pages/Shop'
import { Showcase } from './pages/Showcase'
import { Navigation } from './components/Navigation'

type Page = 'dashboard' | 'inventory' | 'forSale' | 'lookup' | 'series' | 'shop' | 'showcase'

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard')

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <main className="container mx-auto px-4 py-8">
        {currentPage === 'dashboard' && <Dashboard />}
        {currentPage === 'inventory' && <Inventory />}
        {currentPage === 'forSale' && <ForSale />}
        {currentPage === 'lookup' && <Lookup />}
        {currentPage === 'series' && <Series />}
        {currentPage === 'shop' && <Shop />}
        {currentPage === 'showcase' && <Showcase />}
      </main>
    </div>
  )
}

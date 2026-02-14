import { Plus, Trash2, Edit, Download, Upload, AlertCircle, Loader, Eye, EyeOff, Search, SlidersHorizontal, ChevronDown } from 'lucide-react'
import { useState, useMemo } from 'react'
import { useCoins, useDeleteCoin } from '../hooks/useCoins'
import { AddEditCoinModal } from '../components/inventory/AddEditCoinModal'
import { ImportCSVModal } from '../components/inventory/ImportCSVModal'
import { exportToCSV } from '../lib/exportUtils'
import { Coin } from '../types/coin'

// Keep for backward compatibility with ForSale page
export const initialCoins: Coin[] = []

// Sample data for demo/development
const SAMPLE_COINS: Coin[] = [
  {
    id: '1',
    userId: 'demo',
    quantity: 1,
    purchasePrice: 1500,
    currentPrice: 1650,
    purchaseDate: '2023-01-15',
    year: 1921,
    mint: 'S',
    denomination: '$1.00',
    series: 'Morgan Dollar',
    isGraded: 'Y',
    gradingCompany: 'PCGS',
    actualGrade: 'MS-65',
    placePurchased: 'eBay',
    seller: 'roundtable-auctions',
    orderNumber: '16-13371-25107',
    ebayTitle: '1921-S Morgan Dollar MS-65',
    notes: 'Beautiful strike, good eye appeal',
  },
  {
    id: '2',
    userId: 'demo',
    quantity: 2,
    purchasePrice: 850,
    currentPrice: 920,
    purchaseDate: '2023-06-20',
    year: 1896,
    mint: 'O',
    denomination: '$1.00',
    series: 'Morgan Dollar',
    variation: 'Conserved',
    isGraded: 'N',
    estimatedGrade: 'AU-50',
    placePurchased: 'eBay',
    seller: 'gold_standard_guy',
    orderNumber: '02-13582-78447',
    notes: 'Pair of coins from estate sale',
  },
  {
    id: '3',
    userId: 'demo',
    quantity: 1,
    purchasePrice: 45,
    currentPrice: 55,
    purchaseDate: '2024-03-10',
    year: 1938,
    denomination: '$0.10',
    series: 'Mercury Dime',
    isGraded: 'Y',
    gradingCompany: 'NGC',
    actualGrade: 'MS68',
    placePurchased: 'Mercari',
    seller: 'Chair Cabana',
    notes: 'Full bands, nice luster',
  },
]

type SortKey = keyof Coin | null
type SortOrder = 'asc' | 'desc'

interface ColumnVisibility {
  qty: boolean
  year: boolean
  mint: boolean
  denom: boolean
  series: boolean
  variation: boolean
  grade: boolean
  metalType: boolean
  silverContent: boolean
  purchasePrice: boolean
  estValue: boolean
  totalValue: boolean
  seller: boolean
  orderNumber: boolean
  soldPrice: boolean
  profit: boolean
}

// Preset column configurations
const COLUMN_PRESETS = {
  basic: {
    label: 'Basic',
    description: 'Year, mint, series, grade',
    columns: {
      qty: true, year: true, mint: true, denom: false, series: true,
      variation: false, grade: true, metalType: false, silverContent: false,
      purchasePrice: false, estValue: false, totalValue: false,
      seller: false, orderNumber: false, soldPrice: false, profit: false,
    }
  },
  financial: {
    label: 'Financial',
    description: 'Prices, values, profit/loss',
    columns: {
      qty: true, year: true, mint: true, denom: false, series: true,
      variation: false, grade: true, metalType: false, silverContent: false,
      purchasePrice: true, estValue: true, totalValue: true,
      seller: false, orderNumber: false, soldPrice: true, profit: true,
    }
  },
  purchase: {
    label: 'Purchase Info',
    description: 'Seller, order details',
    columns: {
      qty: true, year: true, mint: true, denom: false, series: true,
      variation: false, grade: false, metalType: false, silverContent: false,
      purchasePrice: true, estValue: false, totalValue: false,
      seller: true, orderNumber: true, soldPrice: false, profit: false,
    }
  },
  full: {
    label: 'All Columns',
    description: 'Show everything',
    columns: {
      qty: true, year: true, mint: true, denom: true, series: true,
      variation: true, grade: true, metalType: true, silverContent: true,
      purchasePrice: true, estValue: true, totalValue: true,
      seller: true, orderNumber: true, soldPrice: true, profit: true,
    }
  },
} as const

export function Inventory() {
  const [showModal, setShowModal] = useState(false)
  const [showImportModal, setShowImportModal] = useState(false)
  const [editingCoin, setEditingCoin] = useState<Coin | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>(null)
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc')
  const [showColumnMenu, setShowColumnMenu] = useState(false)
  const [activePreset, setActivePreset] = useState<string>('financial')
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility>({
    qty: true,
    year: true,
    mint: true,
    denom: false,
    series: true,
    variation: false,
    grade: true,
    metalType: false,
    silverContent: false,
    purchasePrice: true,
    estValue: true,
    totalValue: true,
    seller: false,
    orderNumber: false,
    soldPrice: true,
    profit: true,
  })

  const applyPreset = (presetKey: keyof typeof COLUMN_PRESETS) => {
    setColumnVisibility(COLUMN_PRESETS[presetKey].columns as ColumnVisibility)
    setActivePreset(presetKey)
    setShowColumnMenu(false)
  }

  const { data: apiCoins = [], isLoading, error } = useCoins()
  const deleteMutation = useDeleteCoin()

  // Use sample data if there's an error or if not authenticated (for demo purposes)
  const coins = error ? SAMPLE_COINS : apiCoins

  const handleAddClick = () => {
    console.log('Add Coin clicked, opening modal...')
    setEditingCoin(null)
    setShowModal(true)
    console.log('Modal state set to true')
  }

  const handleEdit = (coin: Coin) => {
    setEditingCoin(coin)
    setShowModal(true)
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this coin?')) {
      deleteMutation.mutate(id)
    }
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingCoin(null)
  }

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortOrder('asc')
    }
  }

  const toggleColumnVisibility = (column: keyof ColumnVisibility) => {
    setColumnVisibility({
      ...columnVisibility,
      [column]: !columnVisibility[column],
    })
  }

  // Filter and sort coins
  const filteredAndSortedCoins = useMemo(() => {
    let result = [...coins]

    // Apply search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase()
      result = result.filter((coin) => {
        const searchFields = [
          coin.year?.toString(),
          coin.series,
          coin.seller,
          coin.ebayTitle,
          coin.notes,
          coin.denomination,
          coin.mint,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
        return searchFields.includes(search)
      })
    }

    // Apply sorting
    if (sortKey) {
      result.sort((a, b) => {
        const aValue = a[sortKey]
        const bValue = b[sortKey]

        if (aValue === null || aValue === undefined) return 1
        if (bValue === null || bValue === undefined) return -1

        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortOrder === 'asc' ? aValue - bValue : bValue - aValue
        }

        const aStr = String(aValue).toLowerCase()
        const bStr = String(bValue).toLowerCase()
        return sortOrder === 'asc' ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr)
      })
    }

    return result
  }, [coins, searchTerm, sortKey, sortOrder])

  // Calculate totals for filtered results
  const totalValue = filteredAndSortedCoins.reduce((sum, coin) => {
    const value = (coin.currentPrice || coin.purchasePrice) * coin.quantity
    return sum + value
  }, 0)

  const totalInvested = filteredAndSortedCoins.reduce((sum, coin) => {
    return sum + (coin.purchasePrice * coin.quantity)
  }, 0)

  const totalSilverOz = filteredAndSortedCoins.reduce((sum, coin) => {
    if (coin.silverContent && coin.quantity) {
      return sum + (coin.silverContent * coin.quantity)
    }
    return sum
  }, 0)

  const totalGoldOz = filteredAndSortedCoins.reduce((sum, coin) => {
    if (coin.goldContent && coin.quantity) {
      return sum + (coin.goldContent * coin.quantity)
    }
    return sum
  }, 0)

  const totalCoins = filteredAndSortedCoins.reduce((sum, coin) => sum + coin.quantity, 0)
  const privateCollectionCoins = filteredAndSortedCoins.filter((coin) => coin.status === 'Private Collection')
  const forSaleCoins = filteredAndSortedCoins.filter((coin) => coin.status === 'For Sale')
  const soldCoins = filteredAndSortedCoins.filter((coin) => coin.status === 'Sold')

  // Calculate sold totals
  const totalProfit = soldCoins.reduce((sum, coin) => {
    const proceeds = coin.afterFees || coin.soldPrice || 0
    const cost = coin.purchasePrice * coin.quantity
    return sum + (proceeds - cost)
  }, 0)

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Coin Inventory</h2>
            <p className="text-slate-400">Manage your coin collection</p>
          </div>
          <button disabled className="flex items-center gap-2 bg-slate-600 text-white px-6 py-2 rounded-lg font-medium transition-colors">
            <Plus className="w-5 h-5" />
            Add Coin
          </button>
        </div>
        <div className="bg-slate-800 rounded-lg shadow-md p-12 text-center flex flex-col items-center gap-4 border border-slate-700">
          <Loader className="w-8 h-8 text-blue-400 animate-spin" />
          <p className="text-slate-400 text-lg">Loading your inventory...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Sample Data Banner */}
      {error && (
        <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-3 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="text-blue-200 font-medium">Showing sample data</p>
            <p className="text-blue-300">Log in to manage your real coins. Add/Edit/Delete features work with sample data below.</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Coin Inventory</h2>
            <p className="text-slate-400">{coins.length} coins total, {filteredAndSortedCoins.length} displayed</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowImportModal(true)}
              className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              title="Import coins from CSV"
            >
              <Upload className="w-5 h-5" />
              Import
            </button>
            {filteredAndSortedCoins.length > 0 && (
              <button
                onClick={() => exportToCSV(filteredAndSortedCoins, 'coin-inventory')}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                title="Download inventory as CSV"
              >
                <Download className="w-5 h-5" />
                Export
              </button>
            )}
            <button
              onClick={handleAddClick}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Coin
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {coins.length > 0 && (
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
            <input
              type="text"
              placeholder="Search coins by year, series, seller, denomination, mint..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <AddEditCoinModal coin={editingCoin} onClose={handleCloseModal} />
      )}
      {showImportModal && (
        <ImportCSVModal onClose={() => setShowImportModal(false)} />
      )}

      {/* Empty State */}
      {coins.length === 0 ? (
        <div className="bg-slate-800 rounded-lg shadow-md p-12 text-center border border-slate-700">
          <p className="text-slate-300 text-lg mb-2">No coins in your inventory yet.</p>
          <p className="text-slate-500 mb-6">Click "Add Coin" to get started!</p>
          <button
            onClick={handleAddClick}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add Your First Coin
          </button>
        </div>
      ) : (
        <>
          {/* Compact Dashboard Summary */}
          <div className="bg-slate-800 rounded-lg shadow-md p-6 border border-slate-700">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              {/* Total Value */}
              <div className="col-span-2 md:col-span-1 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg p-4 text-white">
                <p className="text-blue-100 text-xs mb-1">Total Value</p>
                <p className="text-2xl font-bold">${totalValue.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</p>
              </div>

              {/* Invested */}
              <div className="bg-slate-700/50 rounded-lg p-4">
                <p className="text-slate-500 text-xs mb-1">Invested</p>
                <p className="text-xl font-bold text-white">${totalInvested.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</p>
              </div>

              {/* Gain/Loss */}
              <div className={`rounded-lg p-4 ${(totalValue - totalInvested) >= 0 ? 'bg-green-900/30' : 'bg-red-900/30'}`}>
                <p className={`text-xs mb-1 ${(totalValue - totalInvested) >= 0 ? 'text-green-400' : 'text-red-400'}`}>Gain/Loss</p>
                <p className={`text-xl font-bold ${(totalValue - totalInvested) >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                  {(totalValue - totalInvested) >= 0 ? '+' : ''}${Math.abs(totalValue - totalInvested).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                </p>
              </div>

              {/* Total Coins */}
              <div className="bg-slate-700/50 rounded-lg p-4">
                <p className="text-slate-500 text-xs mb-1">Total Coins</p>
                <p className="text-xl font-bold text-white">{totalCoins}</p>
              </div>

              {/* Status Breakdown */}
              <div className="bg-slate-700/50 rounded-lg p-4">
                <p className="text-slate-500 text-xs mb-1">Collection</p>
                <p className="text-xl font-bold text-slate-300">{privateCollectionCoins.reduce((sum, coin) => sum + coin.quantity, 0)}</p>
              </div>

              <div className="bg-orange-900/30 rounded-lg p-4">
                <p className="text-orange-400 text-xs mb-1">For Sale</p>
                <p className="text-xl font-bold text-orange-300">{forSaleCoins.reduce((sum, coin) => sum + coin.quantity, 0)}</p>
              </div>

              <div className="bg-green-900/30 rounded-lg p-4">
                <p className="text-green-400 text-xs mb-1">Sold</p>
                <p className="text-xl font-bold text-green-300">{soldCoins.reduce((sum, coin) => sum + coin.quantity, 0)}</p>
                {totalProfit !== 0 && (
                  <p className={`text-xs mt-1 ${totalProfit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {totalProfit >= 0 ? '+' : ''}${totalProfit.toFixed(0)} profit
                  </p>
                )}
              </div>
            </div>

            {/* Metal Content (if any) */}
            {(totalSilverOz > 0 || totalGoldOz > 0) && (
              <div className="flex gap-4 mt-4 pt-4 border-t border-slate-700 text-sm text-slate-400">
                {totalSilverOz > 0 && <span>{totalSilverOz.toFixed(2)} oz silver</span>}
                {totalGoldOz > 0 && <span>{totalGoldOz.toFixed(4)} oz gold</span>}
              </div>
            )}
          </div>

          {/* View Selector - Preset Buttons */}
          <div className="bg-slate-800 rounded-lg shadow-sm border border-slate-700 p-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4" />
                View:
              </span>

              {/* Preset Buttons */}
              <div className="flex flex-wrap gap-2">
                {Object.entries(COLUMN_PRESETS).map(([key, preset]) => (
                  <button
                    key={key}
                    onClick={() => applyPreset(key as keyof typeof COLUMN_PRESETS)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      activePreset === key
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                    title={preset.description}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              {/* Custom Columns Dropdown */}
              <div className="relative ml-auto">
                <button
                  onClick={() => setShowColumnMenu(!showColumnMenu)}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg text-sm font-medium transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  Custom
                  <ChevronDown className={`w-4 h-4 transition-transform ${showColumnMenu ? 'rotate-180' : ''}`} />
                </button>

                {showColumnMenu && (
                  <div className="absolute top-full right-0 mt-2 bg-slate-800 border border-slate-600 rounded-lg shadow-xl z-20 p-4 w-72">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold text-white text-sm">Customize Columns</h4>
                      <button
                        onClick={() => setShowColumnMenu(false)}
                        className="text-slate-500 hover:text-slate-300"
                      >
                        <EyeOff className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { key: 'qty', label: 'QTY' },
                        { key: 'year', label: 'Year' },
                        { key: 'mint', label: 'Mint' },
                        { key: 'denom', label: 'Denomination' },
                        { key: 'series', label: 'Series' },
                        { key: 'variation', label: 'Variation' },
                        { key: 'grade', label: 'Grade' },
                        { key: 'metalType', label: 'Metal Type' },
                        { key: 'silverContent', label: 'Silver (oz)' },
                        { key: 'purchasePrice', label: 'Purchase $' },
                        { key: 'estValue', label: 'Est. Value' },
                        { key: 'totalValue', label: 'Total Value' },
                        { key: 'seller', label: 'Seller' },
                        { key: 'orderNumber', label: 'Order #' },
                        { key: 'soldPrice', label: 'Sold Price' },
                        { key: 'profit', label: 'Profit/Loss' },
                      ].map((col) => (
                        <label
                          key={col.key}
                          className={`flex items-center gap-2 cursor-pointer p-2 rounded-lg transition-colors ${
                            columnVisibility[col.key as keyof ColumnVisibility]
                              ? 'bg-blue-900/40 border border-blue-600'
                              : 'bg-slate-700 border border-transparent hover:bg-slate-600'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={columnVisibility[col.key as keyof ColumnVisibility]}
                            onChange={() => {
                              toggleColumnVisibility(col.key as keyof ColumnVisibility)
                              setActivePreset('custom')
                            }}
                            className="rounded text-blue-600 focus:ring-blue-500 bg-slate-600 border-slate-500"
                          />
                          <span className="text-xs text-slate-300">{col.label}</span>
                        </label>
                      ))}
                    </div>

                    <div className="mt-3 pt-3 border-t border-slate-700">
                      <p className="text-xs text-slate-500">
                        {Object.values(columnVisibility).filter(Boolean).length} columns visible
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-slate-800 rounded-lg shadow-md overflow-x-auto border border-slate-700">
            <table className="w-full">
              <thead className="bg-slate-700 border-b border-slate-600">
                <tr>
                  {columnVisibility.qty && (
                    <th
                      onClick={() => handleSort('quantity')}
                      className="px-4 py-3 text-left text-xs font-semibold text-slate-200 whitespace-nowrap cursor-pointer hover:bg-slate-600"
                    >
                      QTY {sortKey === 'quantity' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </th>
                  )}
                  {columnVisibility.year && (
                    <th
                      onClick={() => handleSort('year')}
                      className="px-4 py-3 text-left text-xs font-semibold text-slate-200 whitespace-nowrap cursor-pointer hover:bg-slate-600"
                    >
                      Year {sortKey === 'year' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </th>
                  )}
                  {columnVisibility.mint && (
                    <th
                      onClick={() => handleSort('mint')}
                      className="px-4 py-3 text-left text-xs font-semibold text-slate-200 whitespace-nowrap cursor-pointer hover:bg-slate-600"
                    >
                      Mint {sortKey === 'mint' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </th>
                  )}
                  {columnVisibility.denom && (
                    <th
                      onClick={() => handleSort('denomination')}
                      className="px-4 py-3 text-left text-xs font-semibold text-slate-200 whitespace-nowrap cursor-pointer hover:bg-slate-600"
                    >
                      Denom {sortKey === 'denomination' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </th>
                  )}
                  {columnVisibility.series && (
                    <th
                      onClick={() => handleSort('series')}
                      className="px-4 py-3 text-left text-xs font-semibold text-slate-200 whitespace-nowrap cursor-pointer hover:bg-slate-600"
                    >
                      Series {sortKey === 'series' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </th>
                  )}
                  {columnVisibility.variation && (
                    <th
                      onClick={() => handleSort('variation')}
                      className="px-4 py-3 text-left text-xs font-semibold text-slate-200 whitespace-nowrap cursor-pointer hover:bg-slate-600"
                    >
                      Variation {sortKey === 'variation' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </th>
                  )}
                  {columnVisibility.grade && (
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-200 whitespace-nowrap">Grade</th>
                  )}
                  {columnVisibility.metalType && (
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-200 whitespace-nowrap">Metal</th>
                  )}
                  {columnVisibility.silverContent && (
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-200 whitespace-nowrap">Silver (oz)</th>
                  )}
                  {columnVisibility.purchasePrice && (
                    <th
                      onClick={() => handleSort('purchasePrice')}
                      className="px-4 py-3 text-left text-xs font-semibold text-slate-200 whitespace-nowrap cursor-pointer hover:bg-slate-600"
                    >
                      Purchase Price {sortKey === 'purchasePrice' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </th>
                  )}
                  {columnVisibility.estValue && (
                    <th
                      onClick={() => handleSort('currentPrice')}
                      className="px-4 py-3 text-left text-xs font-semibold text-slate-200 whitespace-nowrap cursor-pointer hover:bg-slate-600"
                    >
                      Est. Value {sortKey === 'currentPrice' && (sortOrder === 'asc' ? '↑' : '↓')}
                    </th>
                  )}
                  {columnVisibility.totalValue && (
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-200 whitespace-nowrap">Total Value</th>
                  )}
                  {columnVisibility.seller && (
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-200 whitespace-nowrap">Seller</th>
                  )}
                  {columnVisibility.orderNumber && (
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-200 whitespace-nowrap">Order #</th>
                  )}
                  {columnVisibility.soldPrice && (
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-200 whitespace-nowrap">Sold Price</th>
                  )}
                  {columnVisibility.profit && (
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-200 whitespace-nowrap">Profit/Loss</th>
                  )}
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-200 whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {filteredAndSortedCoins.map((coin) => {
                  const estValue = coin.currentPrice || coin.purchasePrice
                  const totalCoinValue = estValue * coin.quantity
                  const grade = coin.actualGrade || coin.estimatedGrade || '-'
                  const profit = coin.soldPrice ? (coin.afterFees || coin.soldPrice) - (coin.purchasePrice * coin.quantity) : null

                  return (
                    <tr key={coin.id} className="hover:bg-slate-700/50">
                      {columnVisibility.qty && <td className="px-4 py-3 text-sm text-white font-medium">{coin.quantity}</td>}
                      {columnVisibility.year && <td className="px-4 py-3 text-sm text-slate-400">{coin.year || '-'}</td>}
                      {columnVisibility.mint && <td className="px-4 py-3 text-sm text-slate-400">{coin.mint || '-'}</td>}
                      {columnVisibility.denom && <td className="px-4 py-3 text-sm text-slate-400">{coin.denomination || '-'}</td>}
                      {columnVisibility.series && <td className="px-4 py-3 text-sm text-slate-400">{coin.series || '-'}</td>}
                      {columnVisibility.variation && <td className="px-4 py-3 text-sm text-slate-400">{coin.variation || '-'}</td>}
                      {columnVisibility.grade && <td className="px-4 py-3 text-sm text-slate-400">{grade}</td>}
                      {columnVisibility.metalType && <td className="px-4 py-3 text-sm text-slate-400">{coin.metalType || '-'}</td>}
                      {columnVisibility.silverContent && <td className="px-4 py-3 text-sm text-slate-400">{coin.silverContent ? coin.silverContent.toFixed(4) : '-'}</td>}
                      {columnVisibility.purchasePrice && <td className="px-4 py-3 text-sm text-slate-400">${coin.purchasePrice.toFixed(2)}</td>}
                      {columnVisibility.estValue && <td className="px-4 py-3 text-sm text-slate-400">${estValue.toFixed(2)}</td>}
                      {columnVisibility.totalValue && <td className="px-4 py-3 text-sm font-semibold text-white">${totalCoinValue.toFixed(2)}</td>}
                      {columnVisibility.seller && <td className="px-4 py-3 text-sm text-slate-400">{coin.seller || '-'}</td>}
                      {columnVisibility.orderNumber && <td className="px-4 py-3 text-sm text-slate-400">{coin.orderNumber || '-'}</td>}
                      {columnVisibility.soldPrice && <td className="px-4 py-3 text-sm text-slate-400">{coin.soldPrice ? `$${coin.soldPrice.toFixed(2)}` : '-'}</td>}
                      {columnVisibility.profit && (
                        <td className={`px-4 py-3 text-sm font-medium ${profit === null ? 'text-slate-500' : profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {profit === null ? '-' : `${profit >= 0 ? '+' : ''}$${profit.toFixed(2)}`}
                        </td>
                      )}
                      <td className="px-4 py-3 text-sm flex gap-2">
                        <button
                          onClick={() => handleEdit(coin)}
                          className="p-1.5 text-blue-400 hover:bg-blue-900/50 rounded transition-colors"
                          title="Edit coin"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(coin.id)}
                          disabled={deleteMutation.isPending}
                          className="p-1.5 text-red-400 hover:bg-red-900/50 disabled:opacity-50 rounded transition-colors"
                          title="Delete coin"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}

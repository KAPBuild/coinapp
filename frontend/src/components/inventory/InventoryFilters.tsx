import { Search, X } from 'lucide-react'
import { Coin } from '../../types/coin'

interface FilterState {
  searchTerm: string
  series: string
  mint: string
  isGraded: string
  gradingCompany: string
}

interface Props {
  coins: Coin[]
  onFilterChange: (filters: FilterState) => void
  filters: FilterState
}

export function InventoryFilters({ coins, onFilterChange, filters }: Props) {
  // Extract unique values for dropdowns
  const uniqueSeries = Array.from(new Set(coins.map(c => c.series).filter(Boolean)))
    .sort() as string[]
  const uniqueMints = Array.from(new Set(coins.map(c => c.mint).filter(Boolean)))
    .sort() as string[]
  const uniqueCompanies = Array.from(new Set(coins.map(c => c.gradingCompany).filter(Boolean)))
    .sort() as string[]

  const handleSearchChange = (value: string) => {
    onFilterChange({ ...filters, searchTerm: value })
  }

  const handleSeriesChange = (value: string) => {
    onFilterChange({ ...filters, series: value })
  }

  const handleMintChange = (value: string) => {
    onFilterChange({ ...filters, mint: value })
  }

  const handleGradedChange = (value: string) => {
    onFilterChange({ ...filters, isGraded: value })
  }

  const handleCompanyChange = (value: string) => {
    onFilterChange({ ...filters, gradingCompany: value })
  }

  const handleClearFilters = () => {
    onFilterChange({
      searchTerm: '',
      series: '',
      mint: '',
      isGraded: '',
      gradingCompany: '',
    })
  }

  const activeFilters = [
    filters.searchTerm,
    filters.series,
    filters.mint,
    filters.isGraded,
    filters.gradingCompany,
  ].filter(Boolean).length

  return (
    <div className="bg-white rounded-lg shadow-md p-4 space-y-4">
      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by year, series, seller, eBay title, notes..."
            value={filters.searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        {activeFilters > 0 && (
          <button
            onClick={handleClearFilters}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            Clear
          </button>
        )}
      </div>

      {/* Filter Dropdowns */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Series</label>
          <select
            value={filters.series}
            onChange={(e) => handleSeriesChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Series</option>
            {uniqueSeries.map((series) => (
              <option key={series} value={series}>
                {series}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Mint</label>
          <select
            value={filters.mint}
            onChange={(e) => handleMintChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Mints</option>
            {uniqueMints.map((mint) => (
              <option key={mint} value={mint}>
                {mint}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Graded</label>
          <select
            value={filters.isGraded}
            onChange={(e) => handleGradedChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All</option>
            <option value="Y">Yes</option>
            <option value="N">No</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Grading Co.</label>
          <select
            value={filters.gradingCompany}
            onChange={(e) => handleCompanyChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Companies</option>
            {uniqueCompanies.map((company) => (
              <option key={company} value={company}>
                {company}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-end">
          {activeFilters > 0 && (
            <div className="text-xs font-medium text-blue-600 px-3 py-2 bg-blue-50 rounded-lg w-full text-center">
              {activeFilters} filter{activeFilters !== 1 ? 's' : ''} active
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

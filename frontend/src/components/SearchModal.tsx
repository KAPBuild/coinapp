import { Search, X } from 'lucide-react'
import { useState } from 'react'

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState('')

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-20">
        <div className="w-full max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-xl">
            {/* Search Input */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200">
              <Search className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search coins, dates, grades..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 outline-none text-gray-900 placeholder-gray-500"
                autoFocus
              />
              <button
                onClick={onClose}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close search"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search Results / Placeholder */}
            <div className="p-6 text-center">
              {searchQuery ? (
                <div>
                  <p className="text-gray-600">Searching for "{searchQuery}"...</p>
                  <p className="text-sm text-gray-500 mt-2">Advanced search coming soon</p>
                </div>
              ) : (
                <div>
                  <p className="text-gray-500">Start typing to search your collection</p>
                  <p className="text-sm text-gray-400 mt-2">Search by coin name, year, mint mark, or grade</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

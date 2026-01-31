import { useState, useEffect, useRef, useCallback } from 'react'
import { Search, X } from 'lucide-react'
import { getAllSearchableCoins } from '../data/coinCategories'

interface SearchResult {
  id: string
  name: string
  years: string
  imageUrl: string
  category: string
}

interface CoinSearchAutocompleteProps {
  onSelect: (result: SearchResult) => void
  placeholder?: string
}

export function CoinSearchAutocomplete({ onSelect, placeholder = 'Search coins by name, type, or year...' }: CoinSearchAutocompleteProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const allCoins = getAllSearchableCoins()

  // Debounced search
  useEffect(() => {
    if (query.length < 2) {
      setResults([])
      setIsOpen(false)
      return
    }

    const timer = setTimeout(() => {
      const searchLower = query.toLowerCase()
      const filtered = allCoins.filter(coin =>
        coin.name.toLowerCase().includes(searchLower) ||
        coin.years.includes(query) ||
        coin.category.toLowerCase().includes(searchLower)
      ).slice(0, 8)

      setResults(filtered)
      setIsOpen(filtered.length > 0)
      setHighlightedIndex(-1)
    }, 150)

    return () => clearTimeout(timer)
  }, [query])

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
          inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!isOpen) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setHighlightedIndex(prev => (prev < results.length - 1 ? prev + 1 : 0))
        break
      case 'ArrowUp':
        e.preventDefault()
        setHighlightedIndex(prev => (prev > 0 ? prev - 1 : results.length - 1))
        break
      case 'Enter':
        e.preventDefault()
        if (highlightedIndex >= 0 && results[highlightedIndex]) {
          handleSelect(results[highlightedIndex])
        }
        break
      case 'Escape':
        setIsOpen(false)
        setHighlightedIndex(-1)
        break
    }
  }, [isOpen, highlightedIndex, results])

  const handleSelect = (result: SearchResult) => {
    onSelect(result)
    setQuery('')
    setIsOpen(false)
    setHighlightedIndex(-1)
  }

  const clearSearch = () => {
    setQuery('')
    setResults([])
    setIsOpen(false)
    inputRef.current?.focus()
  }

  return (
    <div className="relative w-full">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query.length >= 2 && results.length > 0 && setIsOpen(true)}
          placeholder={placeholder}
          className="w-full pl-12 pr-12 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all bg-white shadow-sm"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Dropdown Results */}
      {isOpen && results.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden"
        >
          <div className="max-h-[400px] overflow-y-auto">
            {results.map((result, index) => (
              <button
                key={result.id}
                onClick={() => handleSelect(result)}
                onMouseEnter={() => setHighlightedIndex(index)}
                className={`w-full flex items-center gap-4 p-3 text-left transition-colors ${
                  index === highlightedIndex
                    ? 'bg-blue-50'
                    : 'hover:bg-gray-50'
                }`}
              >
                {/* Coin Image */}
                <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-gradient-to-br from-amber-100 to-yellow-50 shadow-sm">
                  <img
                    src={result.imageUrl}
                    alt={result.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Ccircle cx="50" cy="50" r="45" fill="%23d4af37" stroke="%23b8860b" stroke-width="3"/%3E%3Ctext x="50" y="55" text-anchor="middle" font-size="20" fill="%23fff"%3E$%3C/text%3E%3C/svg%3E'
                    }}
                  />
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">{result.name}</p>
                  <p className="text-sm text-gray-500">{result.years} &middot; {result.category}</p>
                </div>
              </button>
            ))}
          </div>

          {/* Footer hint */}
          <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 text-xs text-gray-500">
            Press <kbd className="px-1.5 py-0.5 bg-gray-200 rounded text-gray-700">↑</kbd> <kbd className="px-1.5 py-0.5 bg-gray-200 rounded text-gray-700">↓</kbd> to navigate, <kbd className="px-1.5 py-0.5 bg-gray-200 rounded text-gray-700">Enter</kbd> to select
          </div>
        </div>
      )}

      {/* No results message */}
      {isOpen && query.length >= 2 && results.length === 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl p-6 text-center">
          <p className="text-gray-500">No coins found for "{query}"</p>
          <p className="text-sm text-gray-400 mt-1">Try searching for a coin type or year</p>
        </div>
      )}
    </div>
  )
}

import { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'

interface CurrencySelectorProps {
  selectedCurrency: string
  onCurrencyChange: (currency: string) => void
}

const currencies = [
  { code: 'USD', label: 'USD', symbol: '$' },
  { code: 'EUR', label: 'EUR', symbol: '€' },
  { code: 'GBP', label: 'GBP', symbol: '£' },
  { code: 'CAD', label: 'CAD', symbol: 'C$' },
  { code: 'AUD', label: 'AUD', symbol: 'A$' },
]

export function CurrencySelector({ selectedCurrency, onCurrencyChange }: CurrencySelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const currentCurrency = currencies.find(c => c.code === selectedCurrency)

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
        aria-label="Select currency"
      >
        <span className="text-sm font-medium">{currentCurrency?.code || 'USD'}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-[120px]">
          {currencies.map(currency => (
            <button
              key={currency.code}
              onClick={() => {
                onCurrencyChange(currency.code)
                setIsOpen(false)
              }}
              className={`w-full text-left px-4 py-2 transition-colors ${
                selectedCurrency === currency.code
                  ? 'bg-blue-50 text-blue-600 font-medium'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span className="font-medium">{currency.code}</span>
              <span className="text-gray-500 ml-2">{currency.symbol}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

import { X, ExternalLink } from 'lucide-react'
import { useState } from 'react'

interface Props {
  isOpen: boolean
  onClose: () => void
}

const COIN_TYPES = [
  { id: 'morgan', label: 'Morgan Dollar' },
  { id: 'peace', label: 'Peace Dollar' },
  { id: 'walker', label: 'Walking Liberty Half' },
  { id: 'franklin', label: 'Franklin Half' },
  { id: 'kennedy', label: 'Kennedy Half' },
  { id: 'standing-liberty', label: 'Standing Liberty Quarter' },
  { id: 'washington', label: 'Washington Quarter' },
  { id: 'mercury', label: 'Mercury Dime' },
  { id: 'roosevelt', label: 'Roosevelt Dime' },
  { id: 'buffalo', label: 'Buffalo Nickel' },
  { id: 'lincoln', label: 'Lincoln Cent' },
  { id: 'indian', label: 'Indian Head Cent' },
  { id: 'saint-gaudens', label: 'Saint-Gaudens $20' },
  { id: 'liberty-eagle', label: 'Liberty Head Eagle' },
]

export function QuickPhotogradeModal({ isOpen, onClose }: Props) {
  const [selectedId, setSelectedId] = useState('morgan')

  if (!isOpen) return null

  const selectedCoin = COIN_TYPES.find(c => c.id === selectedId)
  const photogradeUrl = `https://www.pcgs.com/photograde/#/${selectedId}/grades`

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
            <h3 className="text-lg font-bold text-gray-900">PCGS Photograde</h3>
            <button
              onClick={onClose}
              className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden flex flex-col">
            {/* Coin Type Tabs */}
            <div className="overflow-x-auto border-b border-gray-200">
              <div className="flex gap-2 px-4 py-3 min-w-min">
                {COIN_TYPES.map(coin => (
                  <button
                    key={coin.id}
                    onClick={() => setSelectedId(coin.id)}
                    className={`px-3 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${
                      selectedId === coin.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {coin.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Coin Info + Link */}
            <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 space-y-6">
              <div className="text-center">
                <h4 className="text-2xl font-bold text-gray-900 mb-2">
                  {selectedCoin?.label}
                </h4>
                <p className="text-gray-600">Click below to view grades on PCGS Photograde</p>
              </div>

              <a
                href={photogradeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors shadow-lg"
              >
                Open PCGS Photograde
                <ExternalLink className="w-5 h-5" />
              </a>

              <p className="text-xs text-gray-500 max-w-md text-center">
                Opens in a new tab. You can compare different grades to estimate your coin's grade.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

import { useState } from 'react'
import { X } from 'lucide-react'

interface CoinFlipGameProps {
  isOpen: boolean
  onClose: () => void
}

type CoinSide = 'heads' | 'tails' | null

export function CoinFlipGame({ isOpen, onClose }: CoinFlipGameProps) {
  const [playerBet, setPlayerBet] = useState<CoinSide>(null)
  const [isFlipping, setIsFlipping] = useState(false)
  const [result, setResult] = useState<CoinSide>(null)
  const [wins, setWins] = useState(0)
  const [losses, setLosses] = useState(0)

  const handleBet = async (bet: CoinSide) => {
    if (isFlipping) return

    setPlayerBet(bet)
    setIsFlipping(true)

    // Simulate coin flip animation (3 seconds)
    await new Promise(resolve => setTimeout(resolve, 3000))

    // Random result
    const flipResult: CoinSide = Math.random() > 0.5 ? 'heads' : 'tails'
    setResult(flipResult)

    // Update wins/losses
    if (bet === flipResult) {
      setWins(wins + 1)
    } else {
      setLosses(losses + 1)
    }

    setIsFlipping(false)
  }

  const handlePlayAgain = () => {
    setPlayerBet(null)
    setResult(null)
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">Coin Flip Game</h2>
            <button
              onClick={onClose}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close game"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Game Content */}
          <div className="p-8">
            {/* Stats */}
            <div className="flex justify-between mb-8 text-center">
              <div>
                <div className="text-2xl font-bold text-green-600">{wins}</div>
                <p className="text-sm text-gray-600">Wins</p>
              </div>
              <div className="border-l border-gray-200"></div>
              <div>
                <div className="text-2xl font-bold text-red-600">{losses}</div>
                <p className="text-sm text-gray-600">Losses</p>
              </div>
            </div>

            {/* Coin Animation */}
            <div className="mb-8 h-32 flex items-center justify-center">
              {isFlipping ? (
                <div
                  className="w-24 h-24 bg-gradient-to-br from-yellow-300 to-yellow-600 rounded-full shadow-lg flex items-center justify-center text-white font-bold text-2xl animate-spin"
                  style={{
                    animation: 'spin 0.1s linear infinite',
                  }}
                >
                  $
                </div>
              ) : (
                <div
                  className={`w-24 h-24 rounded-full shadow-lg flex items-center justify-center text-white font-bold text-2xl transition-all ${
                    result === 'heads'
                      ? 'bg-gradient-to-br from-blue-400 to-blue-600'
                      : result === 'tails'
                        ? 'bg-gradient-to-br from-purple-400 to-purple-600'
                        : 'bg-gradient-to-br from-gray-300 to-gray-500'
                  }`}
                >
                  {result === 'heads' ? 'H' : result === 'tails' ? 'T' : '?'}
                </div>
              )}
            </div>

            {/* Result Message */}
            {result && !isFlipping && (
              <div className="text-center mb-6">
                {result === playerBet ? (
                  <div>
                    <p className="text-xl font-bold text-green-600 mb-2">🎉 You Won!</p>
                    <p className="text-gray-600">
                      The coin landed on <span className="font-semibold capitalize">{result}</span>!
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-xl font-bold text-red-600 mb-2">😅 You Lost</p>
                    <p className="text-gray-600">
                      The coin landed on <span className="font-semibold capitalize">{result}</span>, not {playerBet}.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            {!isFlipping && result === null ? (
              <div className="space-y-3">
                <p className="text-center text-gray-600 font-medium mb-4">Choose Heads or Tails</p>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleBet('heads')}
                    className="py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
                  >
                    Heads
                  </button>
                  <button
                    onClick={() => handleBet('tails')}
                    className="py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-colors"
                  >
                    Tails
                  </button>
                </div>
              </div>
            ) : isFlipping ? (
              <div className="text-center text-gray-600">
                <p>Flipping...</p>
              </div>
            ) : (
              <button
                onClick={handlePlayAgain}
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
              >
                Play Again
              </button>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 text-center text-sm text-gray-600">
            A fun distraction from coin collecting 🪙
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from {
            transform: rotateY(0deg);
          }
          to {
            transform: rotateY(360deg);
          }
        }
      `}</style>
    </>
  )
}

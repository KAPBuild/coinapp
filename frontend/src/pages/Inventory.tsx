import { Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { AddCoinForm } from '../components/AddCoinForm'

// Test data
export const initialCoins = [
  {
    id: '1',
    name: 'American Eagle Gold Coin',
    description: '2023 issue',
    quantity: 5,
    purchasePrice: 1500,
    currentPrice: 1650,
    grading: 'MS-70',
    purchaseDate: '2023-01-15',
    notes: 'First purchase'
  },
  {
    id: '2',
    name: 'British Sovereign',
    description: '2022 issue',
    quantity: 10,
    purchasePrice: 350,
    currentPrice: 380,
    grading: 'MS-65',
    purchaseDate: '2022-06-20',
    notes: ''
  },
  {
    id: '3',
    name: 'Canadian Maple Leaf',
    description: '2024 issue',
    quantity: 3,
    purchasePrice: 1200,
    currentPrice: 1300,
    grading: 'MS-69',
    purchaseDate: '2024-03-10',
    notes: 'Recent acquisition'
  },
]

export function Inventory() {
  const [showForm, setShowForm] = useState(false)
  const [coins, setCoins] = useState<any[]>(initialCoins)

  const handleAddCoin = (newCoin: any) => {
    const coinWithId = {
      ...newCoin,
      id: Date.now().toString(),
      currentPrice: newCoin.purchasePrice,
    }
    setCoins([...coins, coinWithId])
    setShowForm(false)
  }

  const handleDeleteCoin = (id: string) => {
    setCoins(coins.filter(coin => coin.id !== id))
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Coin Inventory</h2>
          <p className="text-gray-600">Manage your coin collection</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Coin
        </button>
      </div>

      {showForm && <AddCoinForm onAdd={handleAddCoin} onCancel={() => setShowForm(false)} />}

      {coins.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <p className="text-gray-600 text-lg">No coins in your inventory yet.</p>
          <p className="text-gray-500">Click "Add Coin" to get started!</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Qty</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Purchase Price</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Current Price</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Total Value</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Grading</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {coins.map((coin) => (
                <tr key={coin.id} className="hover:bg-gray-50">
                  <td className="px-6 py-3 text-sm text-gray-900">
                    <div>
                      <p className="font-medium">{coin.name}</p>
                      {coin.description && <p className="text-xs text-gray-500">{coin.description}</p>}
                    </div>
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-600">{coin.quantity}</td>
                  <td className="px-6 py-3 text-sm text-gray-600">${coin.purchasePrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  <td className="px-6 py-3 text-sm text-gray-600">${(coin.currentPrice || coin.purchasePrice).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  <td className="px-6 py-3 text-sm font-semibold text-gray-900">${(coin.quantity * (coin.currentPrice || coin.purchasePrice)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  <td className="px-6 py-3 text-sm text-gray-600">{coin.grading || '-'}</td>
                  <td className="px-6 py-3 text-sm">
                    <button
                      onClick={() => handleDeleteCoin(coin.id)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Delete coin"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

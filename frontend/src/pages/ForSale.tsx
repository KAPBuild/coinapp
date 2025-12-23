import { useState } from 'react'
import { Plus, Camera, DollarSign, Trash2 } from 'lucide-react'
import { initialCoins } from './Inventory'

interface ListedCoin {
  id: string
  coinId: string
  name: string
  quantity: number
  price: number
  photos: string[]
  description: string
  condition: string
  listedDate: string
}

export function ForSale() {
  const [showForm, setShowForm] = useState(false)
  const [listedCoins, setListedCoins] = useState<ListedCoin[]>([
    {
      id: '1',
      coinId: '1',
      name: 'American Eagle Gold Coin - MS-70',
      quantity: 2,
      price: 1700,
      photos: [],
      description: 'Pristine condition, certified by PCGS',
      condition: 'MS-70',
      listedDate: '2024-12-20',
    },
  ])
  const [formData, setFormData] = useState({
    coinId: '',
    quantity: 1,
    price: '',
    description: '',
    condition: '',
  })
  const [photos, setPhotos] = useState<File[]>([])

  const handleAddListing = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.coinId || !formData.price) return

    const selectedCoin = initialCoins.find(c => c.id === formData.coinId)
    if (!selectedCoin) return

    const newListing: ListedCoin = {
      id: Date.now().toString(),
      coinId: formData.coinId,
      name: `${selectedCoin.name} - ${formData.condition}`,
      quantity: formData.quantity,
      price: parseFloat(formData.price),
      photos: photos.map(p => URL.createObjectURL(p)),
      description: formData.description,
      condition: formData.condition,
      listedDate: new Date().toISOString().split('T')[0],
    }

    setListedCoins([...listedCoins, newListing])
    setFormData({ coinId: '', quantity: 1, price: '', description: '', condition: '' })
    setPhotos([])
    setShowForm(false)
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPhotos([...photos, ...Array.from(e.target.files)])
    }
  }

  const handleRemovePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index))
  }

  const handleDeleteListing = (id: string) => {
    setListedCoins(listedCoins.filter(coin => coin.id !== id))
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">For Sale</h2>
          <p className="text-gray-600">List coins from your collection for sale</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
        >
          <Plus className="w-5 h-5" />
          Create Listing
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAddListing} className="bg-white rounded-lg shadow-md p-6 space-y-6">
          <h3 className="text-lg font-bold text-gray-900">Create New Listing</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Coin *</label>
              <select
                value={formData.coinId}
                onChange={(e) => setFormData({ ...formData, coinId: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Choose a coin...</option>
                {initialCoins.map(coin => (
                  <option key={coin.id} value={coin.id}>
                    {coin.name} (Qty: {coin.quantity})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Quantity for Sale *</label>
              <input
                type="number"
                min="1"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ask Price *</label>
              <input
                type="number"
                step="0.01"
                placeholder="1500.00"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Condition</label>
              <input
                type="text"
                placeholder="e.g., MS-70, AU-58"
                value={formData.condition}
                onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                placeholder="Describe the coin, any certifications, condition notes, etc..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Upload Photos</label>
              <div className="flex flex-col gap-4">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                />
                {photos.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {photos.map((photo, idx) => (
                      <div key={idx} className="relative">
                        <img
                          src={URL.createObjectURL(photo)}
                          alt={`Preview ${idx}`}
                          className="w-full h-24 object-cover rounded-lg border border-gray-300"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemovePhoto(idx)}
                          className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 hover:bg-red-700"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
            >
              Create Listing
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {listedCoins.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <DollarSign className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">No coins listed for sale yet.</p>
          <p className="text-gray-500">Click "Create Listing" to start selling!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listedCoins.map(coin => (
            <div key={coin.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              {coin.photos.length > 0 ? (
                <img
                  src={coin.photos[0]}
                  alt={coin.name}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                  <Camera className="w-8 h-8 text-gray-400" />
                </div>
              )}

              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{coin.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{coin.description}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Quantity:</span>
                    <span className="font-semibold">{coin.quantity}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Condition:</span>
                    <span className="font-semibold">{coin.condition || '-'}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                    <span className="text-gray-600">Ask Price:</span>
                    <span className="text-lg font-bold text-green-600">${coin.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                </div>

                {coin.photos.length > 1 && (
                  <p className="text-xs text-gray-500 mb-4">{coin.photos.length} photos</p>
                )}

                <button
                  onClick={() => handleDeleteListing(coin.id)}
                  className="w-full py-2 text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Remove Listing
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

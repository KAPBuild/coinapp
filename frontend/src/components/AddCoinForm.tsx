import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const coinSchema = z.object({
  name: z.string().min(1, 'Coin name is required'),
  description: z.string().optional(),
  quantity: z.coerce.number().positive('Quantity must be positive'),
  purchasePrice: z.coerce.number().positive('Purchase price must be positive'),
  purchaseDate: z.string(),
  grading: z.string().optional(),
  notes: z.string().optional(),
})

type CoinFormData = z.infer<typeof coinSchema>

interface AddCoinFormProps {
  onAdd: (coin: CoinFormData) => void
  onCancel: () => void
}

export function AddCoinForm({ onAdd, onCancel }: AddCoinFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CoinFormData>({
    resolver: zodResolver(coinSchema),
  })

  return (
    <form onSubmit={handleSubmit(onAdd)} className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Add New Coin</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Coin Name *</label>
          <input
            {...register('name')}
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., American Eagle Gold Coin"
          />
          {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Quantity *</label>
          <input
            {...register('quantity')}
            type="number"
            step="0.01"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., 5"
          />
          {errors.quantity && <p className="text-red-600 text-sm mt-1">{errors.quantity.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Price *</label>
          <input
            {...register('purchasePrice')}
            type="number"
            step="0.01"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., 1500.00"
          />
          {errors.purchasePrice && <p className="text-red-600 text-sm mt-1">{errors.purchasePrice.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Date *</label>
          <input
            {...register('purchaseDate')}
            type="date"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {errors.purchaseDate && <p className="text-red-600 text-sm mt-1">{errors.purchaseDate.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Grading</label>
          <input
            {...register('grading')}
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., MS-70"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <input
            {...register('description')}
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., 2023 issue"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
          <textarea
            {...register('notes')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
            placeholder="Additional notes about the coin..."
          />
        </div>
      </div>

      <div className="flex gap-4 mt-6">
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
        >
          Add Coin
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded-lg font-medium transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

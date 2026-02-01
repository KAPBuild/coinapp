import { useState, useEffect } from 'react'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { X, Loader, HelpCircle, ChevronDown, ChevronUp, Sparkles } from 'lucide-react'
import { useCreateCoin, useUpdateCoin } from '../../hooks/useCoins'
import { Coin } from '../../types/coin'
import { getMetalSpec } from '../../lib/metalContent'
import { getSuggestedSeries } from '../../lib/coinTypeInference'
import { GradingChartModal } from '../GradingChartModal'
import {
  COIN_SERIES,
  MINT_MARKS,
  DENOMINATIONS,
  GRADING_COMPANIES,
  COIN_GRADES,
  PURCHASE_LOCATIONS,
  LISTING_PLATFORMS
} from '../../lib/coinData'

const coinSchema = z.object({
  // Required fields
  quantity: z.coerce.number().positive('Quantity must be positive'),
  purchasePrice: z.coerce.number().nonnegative('Purchase price must be non-negative'),
  purchaseDate: z.string().optional().nullable(),

  // Core identification fields
  year: z.coerce.number().int().min(1700).max(2100).optional().or(z.literal('')).nullable(),
  mint: z.string().optional().nullable(),
  denomination: z.string().optional().nullable(),
  variation: z.string().optional().nullable(),
  importantVariations: z.string().optional().nullable(),
  series: z.string().optional().nullable(),

  // Inventory status
  status: z.enum(['Private Collection', 'For Sale', 'Sold']).optional().nullable(),

  // Grading fields
  isGraded: z.enum(['Y', 'N', '']).optional().nullable(),
  gradingCompany: z.string().optional().nullable(),
  actualGrade: z.string().optional().nullable(),
  estimatedGrade: z.string().optional().nullable(),

  // Purchase tracking fields
  placePurchased: z.string().optional().nullable(),
  seller: z.string().optional().nullable(),
  orderNumber: z.string().optional().nullable(),
  ebayTitle: z.string().optional().nullable(),
  taxed: z.enum(['Y', 'N', '']).optional().nullable(),
  cardNumber: z.string().optional().nullable(),

  // Value fields
  currentPrice: z.coerce.number().nonnegative().optional().or(z.literal('')).nullable(),
  bullionValue: z.coerce.number().nonnegative().optional().or(z.literal('')).nullable(),
  meltValue: z.coerce.number().nonnegative().optional().or(z.literal('')).nullable(),

  // Precious metal content fields
  weight: z.coerce.number().nonnegative().optional().or(z.literal('')).nullable(),
  metalType: z.string().optional().nullable(),
  purityPercent: z.coerce.number().min(0).max(100).optional().or(z.literal('')).nullable(),
  fineWeight: z.coerce.number().nonnegative().optional().or(z.literal('')).nullable(),
  silverContent: z.coerce.number().nonnegative().optional().or(z.literal('')).nullable(),
  goldContent: z.coerce.number().nonnegative().optional().or(z.literal('')).nullable(),

  // Sales tracking fields
  listedWhere: z.string().optional().nullable(),
  soldOrderNumber: z.string().optional().nullable(),
  soldPrice: z.coerce.number().nonnegative().optional().or(z.literal('')).nullable(),
  afterFees: z.coerce.number().nonnegative().optional().or(z.literal('')).nullable(),
  soldDate: z.string().optional().nullable(),

  // Notes
  notes: z.string().optional().nullable(),

  // Legacy fields
  name: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
})

type FormData = z.infer<typeof coinSchema>

interface Props {
  coin?: Coin | null
  onClose: () => void
}

// Collapsible Section Component
function CollapsibleSection({
  title,
  children,
  defaultOpen = false,
  badge
}: {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
  badge?: string
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-900">{title}</span>
          {badge && (
            <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">{badge}</span>
          )}
        </div>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        )}
      </button>
      {isOpen && (
        <div className="p-4 bg-white">
          {children}
        </div>
      )}
    </div>
  )
}

export function AddEditCoinModal({ coin, onClose }: Props) {
  const createMutation = useCreateCoin()
  const updateMutation = useUpdateCoin()
  const isSubmitting = createMutation.isPending || updateMutation.isPending
  const [showGradingChart, setShowGradingChart] = useState(false)
  const [gradeFieldTarget, setGradeFieldTarget] = useState<'actual' | 'estimated'>('estimated')
  const [seriesSuggestions, setSeriesSuggestions] = useState<{ series: string; years: string }[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    control,
  } = useForm<FormData>({
    resolver: zodResolver(coinSchema),
    defaultValues: coin ? { ...coin, year: coin.year || undefined } : { quantity: 1 },
  })

  // Watch year and denomination for auto-suggestions
  const watchedYear = useWatch({ control, name: 'year' })
  const watchedDenomination = useWatch({ control, name: 'denomination' })
  const watchedSeries = useWatch({ control, name: 'series' })

  // Update suggestions when year or denomination changes
  useEffect(() => {
    const year = typeof watchedYear === 'number' ? watchedYear : parseInt(String(watchedYear))
    if (!isNaN(year) && year > 1700) {
      const suggestions = getSuggestedSeries(year, watchedDenomination as string)
      setSeriesSuggestions(suggestions)
      setShowSuggestions(suggestions.length > 0 && !watchedSeries)
    } else {
      setSeriesSuggestions([])
      setShowSuggestions(false)
    }
  }, [watchedYear, watchedDenomination, watchedSeries])

  // Handle grade selection from grading chart modal
  const handleGradeSelect = (grade: string) => {
    if (gradeFieldTarget === 'actual') {
      setValue('actualGrade', grade)
    } else {
      setValue('estimatedGrade', grade)
    }
  }

  // Open grading chart for a specific field
  const openGradingChart = (field: 'actual' | 'estimated') => {
    setGradeFieldTarget(field)
    setShowGradingChart(true)
  }

  // Apply a series suggestion
  const applySuggestion = (series: string) => {
    setValue('series', series)
    setShowSuggestions(false)

    // Auto-populate metal content
    const metalSpec = getMetalSpec(series)
    if (metalSpec) {
      setValue('weight', metalSpec.weight)
      setValue('metalType', metalSpec.metalType)
      setValue('purityPercent', metalSpec.purityPercent)
      if (metalSpec.silverContent) {
        setValue('silverContent', metalSpec.silverContent)
      }
      if (metalSpec.goldContent) {
        setValue('goldContent', metalSpec.goldContent)
      }
    }
  }

  // Handle series change manually
  const handleSeriesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const seriesValue = e.target.value
    const metalSpec = getMetalSpec(seriesValue)

    if (metalSpec) {
      setValue('weight', metalSpec.weight)
      setValue('metalType', metalSpec.metalType)
      setValue('purityPercent', metalSpec.purityPercent)
      if (metalSpec.silverContent) {
        setValue('silverContent', metalSpec.silverContent)
      }
      if (metalSpec.goldContent) {
        setValue('goldContent', metalSpec.goldContent)
      }
    }
  }

  const onSubmit = async (data: FormData) => {
    // Filter out empty strings and convert to null
    const cleanData = Object.entries(data).reduce((acc, [key, value]) => {
      if (value === '' || value === undefined) {
        acc[key as keyof FormData] = null
      } else {
        acc[key as keyof FormData] = value
      }
      return acc
    }, {} as Record<string, any>) as any

    if (coin) {
      updateMutation.mutate(
        { id: coin.id, coin: cleanData },
        {
          onSuccess: onClose,
          onError: (error) => {
            console.error('Update error:', error)
            alert(`Failed to update coin: ${error instanceof Error ? error.message : 'Unknown error'}`)
          }
        }
      )
    } else {
      createMutation.mutate(cleanData, {
        onSuccess: onClose,
        onError: (error) => {
          console.error('Create error:', error)
          alert(`Failed to add coin: ${error instanceof Error ? error.message : 'Unknown error'}`)
        }
      })
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center z-10">
          <h3 className="text-xl font-bold text-gray-900">
            {coin ? 'Edit Coin' : 'Add New Coin'}
          </h3>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
          {/* Essential Coin Information - Always Visible */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
            <h4 className="font-bold text-gray-900 mb-4 text-lg flex items-center gap-2">
              Coin Identification
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                <input
                  {...register('year')}
                  type="number"
                  min="1700"
                  max="2100"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="1921"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mint</label>
                <select
                  {...register('mint')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select...</option>
                  {MINT_MARKS.map(mint => (
                    <option key={mint || 'none'} value={mint}>{mint || 'No Mint Mark'}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Denomination</label>
                <select
                  {...register('denomination')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select...</option>
                  {DENOMINATIONS.map(denom => (
                    <option key={denom || 'none'} value={denom}>{denom}</option>
                  ))}
                </select>
              </div>
              <div className="col-span-2 md:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Series / Type</label>
                <select
                  {...register('series')}
                  onChange={(e) => {
                    register('series').onChange(e)
                    handleSeriesChange(e)
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select or use suggestion below...</option>
                  {COIN_SERIES.map(series => (
                    <option key={series} value={series}>{series}</option>
                  ))}
                </select>

                {/* Auto-suggestions */}
                {showSuggestions && seriesSuggestions.length > 0 && (
                  <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-xs text-amber-700 mb-2 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      Suggested based on year {watchedYear}:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {seriesSuggestions.slice(0, 3).map(suggestion => (
                        <button
                          key={suggestion.series}
                          type="button"
                          onClick={() => applySuggestion(suggestion.series)}
                          className="px-3 py-1.5 bg-white border border-amber-300 rounded-lg text-sm font-medium text-amber-800 hover:bg-amber-100 transition-colors"
                        >
                          {suggestion.series}
                          <span className="text-xs text-amber-600 ml-1">({suggestion.years})</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Entry - Quantity & Price */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">QTY *</label>
              <input
                {...register('quantity')}
                type="number"
                step="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="1"
              />
              {errors.quantity && <p className="text-red-600 text-xs mt-1">{errors.quantity.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Price *</label>
              <input
                {...register('purchasePrice')}
                type="number"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
              />
              {errors.purchasePrice && <p className="text-red-600 text-xs mt-1">{errors.purchasePrice.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Est. Value</label>
              <input
                {...register('currentPrice')}
                type="number"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                {...register('status')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select...</option>
                <option value="Private Collection">Private Collection</option>
                <option value="For Sale">For Sale</option>
                <option value="Sold">Sold</option>
              </select>
            </div>
          </div>

          {/* Collapsible Sections */}
          <div className="space-y-3">
            {/* Grading Section */}
            <CollapsibleSection title="Grading Information" badge="Optional">
              <div className="flex justify-end mb-3">
                <button
                  type="button"
                  onClick={() => openGradingChart('estimated')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <HelpCircle className="w-4 h-4" />
                  Grading Guide
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Graded?</label>
                  <select
                    {...register('isGraded')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select...</option>
                    <option value="Y">Yes</option>
                    <option value="N">No</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                  <select
                    {...register('gradingCompany')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select...</option>
                    {GRADING_COMPANIES.map(company => (
                      <option key={company || 'none'} value={company}>{company || 'None'}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Actual Grade</label>
                  <select
                    {...register('actualGrade')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select...</option>
                    {COIN_GRADES.map(grade => (
                      <option key={grade || 'none'} value={grade}>{grade}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Est. Grade</label>
                  <select
                    {...register('estimatedGrade')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select...</option>
                    {COIN_GRADES.map(grade => (
                      <option key={grade || 'none2'} value={grade}>{grade}</option>
                    ))}
                  </select>
                </div>
              </div>
            </CollapsibleSection>

            {/* Purchase Details */}
            <CollapsibleSection title="Purchase Details" badge="Optional">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Date</label>
                  <input
                    {...register('purchaseDate')}
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Place Purchased</label>
                  <select
                    {...register('placePurchased')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select...</option>
                    {PURCHASE_LOCATIONS.map(location => (
                      <option key={location || 'none'} value={location}>{location}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Seller</label>
                  <input
                    {...register('seller')}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Seller name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Order #</label>
                  <input
                    {...register('orderNumber')}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Taxed?</label>
                  <select
                    {...register('taxed')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select...</option>
                    <option value="Y">Yes</option>
                    <option value="N">No</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Card #</label>
                  <input
                    {...register('cardNumber')}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Last 4"
                  />
                </div>
                <div className="col-span-2 md:col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">eBay Title</label>
                  <input
                    {...register('ebayTitle')}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Full listing title..."
                  />
                </div>
              </div>
            </CollapsibleSection>

            {/* Variations */}
            <CollapsibleSection title="Variations & Errors" badge="Optional">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Variation</label>
                  <input
                    {...register('variation')}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Reverse of 78, Micro O..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Important Variations</label>
                  <input
                    {...register('importantVariations')}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Notable varieties or errors..."
                  />
                </div>
              </div>
            </CollapsibleSection>

            {/* Metal Content */}
            <CollapsibleSection title="Precious Metal Content" badge="Auto-filled">
              <p className="text-sm text-gray-500 mb-3">Auto-populated when you select a series</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Metal Type</label>
                  <input
                    {...register('metalType')}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Weight (g)</label>
                  <input
                    {...register('weight')}
                    type="number"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Purity %</label>
                  <input
                    {...register('purityPercent')}
                    type="number"
                    step="0.1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Silver (oz)</label>
                  <input
                    {...register('silverContent')}
                    type="number"
                    step="0.0001"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gold (oz)</label>
                  <input
                    {...register('goldContent')}
                    type="number"
                    step="0.0001"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                    readOnly
                  />
                </div>
              </div>
            </CollapsibleSection>

            {/* Sales Information */}
            <CollapsibleSection title="Sales Information" badge="For Sold Items">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Listed Where</label>
                  <select
                    {...register('listedWhere')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select...</option>
                    {LISTING_PLATFORMS.map(platform => (
                      <option key={platform || 'none'} value={platform}>{platform}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sold Date</label>
                  <input
                    {...register('soldDate')}
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sold Order #</label>
                  <input
                    {...register('soldOrderNumber')}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sold Price</label>
                  <input
                    {...register('soldPrice')}
                    type="number"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">After Fees</label>
                  <input
                    {...register('afterFees')}
                    type="number"
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>
              </div>
            </CollapsibleSection>

            {/* Notes */}
            <CollapsibleSection title="Notes" badge="Optional">
              <textarea
                {...register('notes')}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Any additional notes about this coin..."
              />
            </CollapsibleSection>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4 border-t border-gray-200">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors"
            >
              {isSubmitting && <Loader className="w-4 h-4 animate-spin" />}
              {coin ? 'Update Coin' : 'Add Coin'}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 text-gray-900 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      {/* Grading Chart Modal */}
      <GradingChartModal
        isOpen={showGradingChart}
        onClose={() => setShowGradingChart(false)}
        onSelectGrade={handleGradeSelect}
      />
    </div>
  )
}

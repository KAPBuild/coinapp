export interface Coin {
  id: string
  userId: string
  quantity: number
  purchasePrice: number
  purchaseDate: string

  // Core identification fields
  year?: number | null
  mint?: string | null
  denomination?: string | null
  variation?: string | null
  importantVariations?: string | null
  series?: string | null

  // Grading fields
  isGraded?: 'Y' | 'N' | '' | null
  gradingCompany?: string | null
  actualGrade?: string | null
  estimatedGrade?: string | null

  // Purchase tracking fields
  placePurchased?: string | null
  seller?: string | null
  orderNumber?: string | null
  ebayTitle?: string | null
  taxed?: 'Y' | 'N' | '' | null
  cardNumber?: string | null

  // Value fields
  currentPrice?: number | null
  bullionValue?: number | null
  meltValue?: number | null

  // Precious metal content fields
  weight?: number | null // in grams
  metalType?: string | null // 'Silver', 'Gold', 'Copper', 'Mixed', etc.
  purityPercent?: number | null // 0-100
  fineWeight?: number | null // weight of pure metal in grams
  silverContent?: number | null // in troy ounces
  goldContent?: number | null // in troy ounces

  // Sales tracking fields
  listedWhere?: string | null // 'eBay', 'Mercari', etc.
  soldOrderNumber?: string | null
  soldPrice?: number | null
  afterFees?: number | null
  soldDate?: string | null

  // Inventory status
  status?: 'Private Collection' | 'For Sale' | 'Sold' | null

  // Notes
  notes?: string | null

  // Legacy fields
  name?: string | null
  description?: string | null
  grading?: string | null

  // Metadata
  createdAt?: string
  updatedAt?: string
}

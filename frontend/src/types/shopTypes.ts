export interface ShopCoin {
  id: string
  year?: number | null
  mint?: string | null
  denomination?: string | null
  series?: string | null
  variation?: string | null
  importantVariations?: string | null
  currentPrice?: number | null
  quantity: number
  isGraded?: 'Y' | 'N' | '' | null
  gradingCompany?: string | null
  actualGrade?: string | null
  estimatedGrade?: string | null
  ebayTitle?: string | null
  notes?: string | null
  metalType?: string | null
  silverContent?: number | null
  goldContent?: number | null
  weight?: number | null
  status?: string | null
}

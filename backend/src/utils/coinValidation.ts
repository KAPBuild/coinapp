import { z } from 'zod'

export const createCoinSchema = z.object({
  // Required fields
  quantity: z.number().positive('Quantity must be positive'),
  purchasePrice: z.number().nonnegative('Purchase price must be non-negative'),
  purchaseDate: z.string().optional().nullable(),

  // Core identification fields (optional)
  year: z.number().int().min(1700).max(2100).optional().nullable(),
  mint: z.string().max(10).optional().nullable(),
  denomination: z.string().max(50).optional().nullable(),
  variation: z.string().max(200).optional().nullable(),
  importantVariations: z.string().max(500).optional().nullable(),
  series: z.string().max(100).optional().nullable(),

  // Grading fields (optional)
  isGraded: z.enum(['Y', 'N', '']).optional().nullable(),
  gradingCompany: z.string().max(50).optional().nullable(),
  actualGrade: z.string().max(20).optional().nullable(),
  estimatedGrade: z.string().max(20).optional().nullable(),

  // Purchase tracking fields (optional)
  placePurchased: z.string().max(200).optional().nullable(),
  seller: z.string().max(200).optional().nullable(),
  orderNumber: z.string().max(100).optional().nullable(),
  ebayTitle: z.string().max(500).optional().nullable(),
  taxed: z.enum(['Y', 'N', '']).optional().nullable(),
  cardNumber: z.string().max(50).optional().nullable(),

  // Inventory status (optional)
  status: z.enum(['Private Collection', 'For Sale', 'Sold']).optional().nullable(),

  // Value and notes fields (optional)
  currentPrice: z.number().nonnegative().optional().nullable(),
  bullionValue: z.number().nonnegative().optional().nullable(),
  meltValue: z.number().nonnegative().optional().nullable(),
  notes: z.string().max(2000).optional().nullable(),

  // Legacy fields (optional)
  name: z.string().max(200).optional().nullable(),
  description: z.string().max(500).optional().nullable(),
})

export type CreateCoinInput = z.infer<typeof createCoinSchema>
export type UpdateCoinInput = Partial<CreateCoinInput>

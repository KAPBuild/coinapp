import { z } from 'zod'

export const batchCreateSchema = z.object({
  coins: z.array(z.unknown()).min(1).max(500),
})

export interface BatchRowResult {
  row: number
  success: boolean
  error?: string
  coinId?: string
}

export interface BatchCreateResponse {
  totalRows: number
  successCount: number
  failureCount: number
  results: BatchRowResult[]
}

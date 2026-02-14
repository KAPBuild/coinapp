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

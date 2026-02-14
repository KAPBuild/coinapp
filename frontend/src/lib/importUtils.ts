import Papa from 'papaparse'

// Reverse mapping of exportUtils.ts CSV headers to Coin field names
const CSV_HEADER_TO_FIELD: Record<string, string> = {
  'QTY': 'quantity',
  'Year': 'year',
  'Mint': 'mint',
  'Denomination': 'denomination',
  'Variation': 'variation',
  'Important Variations': 'importantVariations',
  'Series': 'series',
  'Graded': 'isGraded',
  'Grading Company': 'gradingCompany',
  'Actual Grade': 'actualGrade',
  'Estimated Grade': 'estimatedGrade',
  'Date Purchased': 'purchaseDate',
  'Place Purchased': 'placePurchased',
  'Seller': 'seller',
  'Order #': 'orderNumber',
  'eBay Title': 'ebayTitle',
  'Total Price': 'purchasePrice',
  'Taxed': 'taxed',
  'Card Number': 'cardNumber',
  'Current Value': 'currentPrice',
  'Total Value': '__IGNORE__',
  'Notes': 'notes',
}

export interface ParsedImportResult {
  validRows: Record<string, any>[]
  errors: { row: number; error: string }[]
  totalRows: number
}

export function parseCSVFile(file: File): Promise<ParsedImportResult> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const headers = results.meta.fields || []
        const recognizedHeaders = headers.filter(h => h in CSV_HEADER_TO_FIELD)

        if (recognizedHeaders.length === 0) {
          reject(new Error('No recognized CSV headers found. Expected headers like: QTY, Year, Mint, Total Price, Series, etc.'))
          return
        }

        const validRows: Record<string, any>[] = []
        const errors: { row: number; error: string }[] = []

        ;(results.data as Record<string, string>[]).forEach((rawRow, index) => {
          const rowNum = index + 2 // +2: 1-based + header row
          try {
            const coin = mapAndCoerceRow(rawRow)

            if (coin.quantity <= 0) {
              errors.push({ row: rowNum, error: 'Quantity must be positive' })
              return
            }
            if (coin.purchasePrice < 0) {
              errors.push({ row: rowNum, error: 'Purchase price must be non-negative' })
              return
            }
            if (coin.year !== null && coin.year !== undefined) {
              if (coin.year < 1700 || coin.year > 2100) {
                errors.push({ row: rowNum, error: `Year ${coin.year} out of range (1700-2100)` })
                return
              }
            }

            validRows.push(coin)
          } catch (err) {
            errors.push({
              row: rowNum,
              error: err instanceof Error ? err.message : 'Failed to parse row',
            })
          }
        })

        resolve({ validRows, errors, totalRows: results.data.length })
      },
      error: (error) => {
        reject(new Error(`CSV parse error: ${error.message}`))
      },
    })
  })
}

function mapAndCoerceRow(rawRow: Record<string, string>): Record<string, any> {
  const mapped: Record<string, any> = {}

  for (const [csvHeader, fieldName] of Object.entries(CSV_HEADER_TO_FIELD)) {
    if (fieldName === '__IGNORE__') continue
    const rawValue = (rawRow[csvHeader] ?? '').trim()
    mapped[fieldName] = rawValue
  }

  // Numeric coercions
  const parsedQty = parseFloat(mapped.quantity)
  mapped.quantity = isNaN(parsedQty) ? 1 : parsedQty

  const parsedPrice = parseFloat(mapped.purchasePrice)
  mapped.purchasePrice = isNaN(parsedPrice) ? 0 : parsedPrice

  if (mapped.year) {
    const parsedYear = parseInt(mapped.year, 10)
    mapped.year = isNaN(parsedYear) ? null : parsedYear
  } else {
    mapped.year = null
  }

  if (mapped.currentPrice) {
    const parsedCurrent = parseFloat(mapped.currentPrice)
    mapped.currentPrice = isNaN(parsedCurrent) ? null : parsedCurrent
  } else {
    mapped.currentPrice = null
  }

  // Enum coercions
  const upperGraded = (mapped.isGraded || '').toUpperCase()
  mapped.isGraded = ['Y', 'N'].includes(upperGraded) ? upperGraded : null

  const upperTaxed = (mapped.taxed || '').toUpperCase()
  mapped.taxed = ['Y', 'N'].includes(upperTaxed) ? upperTaxed : null

  // String fields: empty to null
  const stringFields = [
    'mint', 'denomination', 'variation', 'importantVariations', 'series',
    'gradingCompany', 'actualGrade', 'estimatedGrade', 'purchaseDate',
    'placePurchased', 'seller', 'orderNumber', 'ebayTitle', 'cardNumber', 'notes',
  ]
  for (const field of stringFields) {
    mapped[field] = mapped[field] || null
  }

  return mapped
}

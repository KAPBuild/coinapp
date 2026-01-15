import Papa from 'papaparse'
import { Coin } from '../types/coin'

export function exportToCSV(coins: Coin[], filename: string = 'coins-export') {
  // Format coins data for CSV
  const data = coins.map((coin) => ({
    'QTY': coin.quantity,
    'Year': coin.year || '',
    'Mint': coin.mint || '',
    'Denomination': coin.denomination || '',
    'Variation': coin.variation || '',
    'Important Variations': coin.importantVariations || '',
    'Series': coin.series || '',
    'Graded': coin.isGraded || '',
    'Grading Company': coin.gradingCompany || '',
    'Actual Grade': coin.actualGrade || '',
    'Estimated Grade': coin.estimatedGrade || '',
    'Date Purchased': coin.purchaseDate || '',
    'Place Purchased': coin.placePurchased || '',
    'Seller': coin.seller || '',
    'Order #': coin.orderNumber || '',
    'eBay Title': coin.ebayTitle || '',
    'Total Price': coin.purchasePrice,
    'Taxed': coin.taxed || '',
    'Card Number': coin.cardNumber || '',
    'Current Value': coin.currentPrice || coin.purchasePrice,
    'Total Value': (coin.currentPrice || coin.purchasePrice) * coin.quantity,
    'Notes': coin.notes || '',
  }))

  const csv = Papa.unparse(data)
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)

  link.setAttribute('href', url)
  link.setAttribute('download', `${filename}-${new Date().toISOString().split('T')[0]}.csv`)
  link.style.visibility = 'hidden'

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

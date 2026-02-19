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

export interface EbayShopItem {
  id: string
  ebayItemId: string
  title: string
  price: number | null
  currency: string
  imageUrl: string | null
  imageUrls: string[]
  ebayUrl: string
  affiliateUrl: string | null
  condition: string | null
  categoryName: string | null
  quantityAvailable: number
}

export interface ShopResponse {
  ebayListings: EbayShopItem[]
  directListings: ShopCoin[]
}

export interface CreatePaymentIntentRequest {
  listingId: string
  customerEmail: string
  customerName?: string
  shippingAddress?: {
    line1: string
    line2?: string
    city: string
    state: string
    postalCode: string
    country: string
  }
}

export interface CreatePaymentIntentResponse {
  clientSecret: string
  orderId: string
}

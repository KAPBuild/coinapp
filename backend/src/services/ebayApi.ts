// eBay Browse API client for Cloudflare Workers
// Uses client_credentials OAuth flow + Browse API search by seller

interface EbayTokenResponse {
  access_token: string
  expires_in: number
  token_type: string
}

export interface EbayItemSummary {
  itemId: string
  title: string
  price?: { value: string; currency: string }
  image?: { imageUrl: string }
  additionalImages?: { imageUrl: string }[]
  itemWebUrl: string
  itemAffiliateWebUrl?: string
  condition?: string
  categories?: { categoryId: string; categoryName: string }[]
  estimatedAvailabilities?: { estimatedAvailableQuantity: number }[]
}

interface EbaySearchResponse {
  total: number
  href: string
  next?: string
  offset: number
  limit: number
  itemSummaries?: EbayItemSummary[]
}

export interface ParsedEbayListing {
  ebayItemId: string
  title: string
  price: number | null
  currency: string
  imageUrl: string | null
  imageUrls: string[] // all images
  ebayUrl: string
  affiliateUrl: string | null
  condition: string | null
  categoryName: string | null
  quantityAvailable: number
}

// In-memory token cache (per Worker instance)
let cachedToken: { token: string; expiresAt: number } | null = null

export async function getEbayAccessToken(
  clientId: string,
  clientSecret: string
): Promise<string> {
  // Return cached token if still valid (with 5-min buffer)
  if (cachedToken && Date.now() < cachedToken.expiresAt - 300_000) {
    return cachedToken.token
  }

  const credentials = btoa(`${clientId}:${clientSecret}`)

  const response = await fetch('https://api.ebay.com/identity/v1/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${credentials}`,
    },
    body: 'grant_type=client_credentials&scope=https%3A%2F%2Fapi.ebay.com%2Foauth%2Fapi_scope',
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`eBay OAuth failed (${response.status}): ${text}`)
  }

  const data = await response.json() as EbayTokenResponse
  cachedToken = {
    token: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000,
  }

  return data.access_token
}

export async function getSellerListings(
  accessToken: string,
  sellerUsername: string,
  affiliateCampaignId?: string
): Promise<ParsedEbayListing[]> {
  const allItems: EbayItemSummary[] = []
  let offset = 0
  const limit = 200

  // Paginate through all results
  while (true) {
    const url = new URL('https://api.ebay.com/buy/browse/v1/item_summary/search')
    url.searchParams.set('q', '')
    url.searchParams.set('filter', `sellers:{${sellerUsername}}`)
    url.searchParams.set('limit', String(limit))
    url.searchParams.set('offset', String(offset))

    const headers: Record<string, string> = {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    }

    // Add affiliate tracking if campaign ID provided
    if (affiliateCampaignId) {
      headers['X-EBAY-C-ENDUSERCTX'] = `affiliateCampaignId=${affiliateCampaignId}`
    }

    const response = await fetch(url.toString(), { headers })

    if (!response.ok) {
      const text = await response.text()
      throw new Error(`eBay Browse API failed (${response.status}): ${text}`)
    }

    const data = await response.json() as EbaySearchResponse
    const items = data.itemSummaries || []
    allItems.push(...items)

    // Check if there are more pages
    if (!data.next || items.length < limit) {
      break
    }
    offset += limit
  }

  // Parse into our format
  return allItems.map(item => {
    const images: string[] = []
    if (item.image?.imageUrl) images.push(item.image.imageUrl)
    if (item.additionalImages) {
      images.push(...item.additionalImages.map(img => img.imageUrl))
    }

    return {
      ebayItemId: item.itemId,
      title: item.title,
      price: item.price ? parseFloat(item.price.value) : null,
      currency: item.price?.currency || 'USD',
      imageUrl: item.image?.imageUrl || null,
      imageUrls: images,
      ebayUrl: item.itemWebUrl,
      affiliateUrl: item.itemAffiliateWebUrl || null,
      condition: item.condition || null,
      categoryName: item.categories?.[0]?.categoryName || null,
      quantityAvailable: item.estimatedAvailabilities?.[0]?.estimatedAvailableQuantity || 1,
    }
  })
}

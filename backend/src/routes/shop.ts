import { Hono } from 'hono'
import { eq, and } from 'drizzle-orm'
import { createDb, schema } from '../db'

const app = new Hono()

// GET /api/shop - Public endpoint: returns eBay listings + admin's "For Sale" coins
app.get('/', async (c) => {
  try {
    const db = createDb(c.env.DB as D1Database)

    // Fetch active eBay listings
    const ebayListings = await db
      .select({
        id: schema.ebayListings.id,
        ebayItemId: schema.ebayListings.ebayItemId,
        title: schema.ebayListings.title,
        price: schema.ebayListings.price,
        currency: schema.ebayListings.currency,
        imageUrl: schema.ebayListings.imageUrl,
        imageUrls: schema.ebayListings.imageUrls,
        ebayUrl: schema.ebayListings.ebayUrl,
        affiliateUrl: schema.ebayListings.affiliateUrl,
        condition: schema.ebayListings.condition,
        categoryName: schema.ebayListings.categoryName,
        quantityAvailable: schema.ebayListings.quantityAvailable,
      })
      .from(schema.ebayListings)
      .where(eq(schema.ebayListings.listingStatus, 'active'))

    // Parse imageUrls from JSON string
    const parsedEbayListings = ebayListings.map(listing => ({
      ...listing,
      imageUrls: listing.imageUrls ? JSON.parse(listing.imageUrls) : [],
    }))

    // Also fetch admin's direct "For Sale" coins (existing functionality)
    const admins = await db
      .select({ id: schema.users.id })
      .from(schema.users)
      .where(eq(schema.users.isAdmin, 1))

    const directListings = []
    for (const admin of admins) {
      const coins = await db
        .select({
          id: schema.coins.id,
          year: schema.coins.year,
          mint: schema.coins.mint,
          denomination: schema.coins.denomination,
          series: schema.coins.series,
          variation: schema.coins.variation,
          importantVariations: schema.coins.importantVariations,
          currentPrice: schema.coins.currentPrice,
          quantity: schema.coins.quantity,
          isGraded: schema.coins.isGraded,
          gradingCompany: schema.coins.gradingCompany,
          actualGrade: schema.coins.actualGrade,
          estimatedGrade: schema.coins.estimatedGrade,
          ebayTitle: schema.coins.ebayTitle,
          notes: schema.coins.notes,
          status: schema.coins.status,
        })
        .from(schema.coins)
        .where(
          and(
            eq(schema.coins.userId, admin.id),
            eq(schema.coins.status, 'For Sale')
          )
        )
      directListings.push(...coins)
    }

    return c.json({
      ebayListings: parsedEbayListings,
      directListings,
    })
  } catch (error) {
    console.error('Shop fetch error:', error)
    return c.json({ error: 'Failed to fetch shop' }, 500)
  }
})

export default app

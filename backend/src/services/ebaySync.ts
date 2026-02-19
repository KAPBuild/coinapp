// eBay sync service - pulls listings from eBay store into local DB
import { eq, notInArray } from 'drizzle-orm'
import { getEbayAccessToken, getSellerListings } from './ebayApi'
import type { ParsedEbayListing } from './ebayApi'

const SELLER_USERNAME = 'neighborlynook'

interface SyncEnv {
  EBAY_CLIENT_ID: string
  EBAY_CLIENT_SECRET: string
  EBAY_AFFILIATE_CAMPAIGN_ID?: string
}

export async function syncEbayListings(
  db: ReturnType<typeof import('../db').createDb>,
  schema: typeof import('../db').schema,
  env: SyncEnv
): Promise<{ synced: number; error?: string }> {
  // Log sync start
  await db.insert(schema.ebaySyncLog).values({
    status: 'running',
    startedAt: new Date().toISOString(),
  })

  try {
    // Get OAuth token
    const token = await getEbayAccessToken(env.EBAY_CLIENT_ID, env.EBAY_CLIENT_SECRET)

    // Fetch all active listings from the eBay store
    const listings = await getSellerListings(
      token,
      SELLER_USERNAME,
      env.EBAY_AFFILIATE_CAMPAIGN_ID
    )

    const now = new Date().toISOString()
    const syncedItemIds: string[] = []

    // Upsert each listing
    for (const listing of listings) {
      const id = `ebay_${listing.ebayItemId}`
      syncedItemIds.push(listing.ebayItemId)

      const existing = await db
        .select({ id: schema.ebayListings.id })
        .from(schema.ebayListings)
        .where(eq(schema.ebayListings.ebayItemId, listing.ebayItemId))
        .limit(1)

      if (existing.length > 0) {
        // Update existing listing
        await db
          .update(schema.ebayListings)
          .set({
            title: listing.title,
            price: listing.price,
            currency: listing.currency,
            imageUrl: listing.imageUrl,
            imageUrls: JSON.stringify(listing.imageUrls),
            ebayUrl: listing.ebayUrl,
            affiliateUrl: listing.affiliateUrl,
            condition: listing.condition,
            categoryName: listing.categoryName,
            quantityAvailable: listing.quantityAvailable,
            listingStatus: 'active',
            syncedAt: now,
            updatedAt: now,
          })
          .where(eq(schema.ebayListings.ebayItemId, listing.ebayItemId))
      } else {
        // Insert new listing
        await db.insert(schema.ebayListings).values({
          id,
          ebayItemId: listing.ebayItemId,
          title: listing.title,
          price: listing.price,
          currency: listing.currency,
          imageUrl: listing.imageUrl,
          imageUrls: JSON.stringify(listing.imageUrls),
          ebayUrl: listing.ebayUrl,
          affiliateUrl: listing.affiliateUrl,
          condition: listing.condition,
          categoryName: listing.categoryName,
          quantityAvailable: listing.quantityAvailable,
          listingStatus: 'active',
          syncedAt: now,
          createdAt: now,
          updatedAt: now,
        })
      }
    }

    // Mark listings no longer on eBay as ended
    if (syncedItemIds.length > 0) {
      // D1 doesn't support notInArray well with large lists, so do it in batches
      const allActive = await db
        .select({ id: schema.ebayListings.id, ebayItemId: schema.ebayListings.ebayItemId })
        .from(schema.ebayListings)
        .where(eq(schema.ebayListings.listingStatus, 'active'))

      for (const row of allActive) {
        if (!syncedItemIds.includes(row.ebayItemId)) {
          await db
            .update(schema.ebayListings)
            .set({ listingStatus: 'ended', updatedAt: now })
            .where(eq(schema.ebayListings.id, row.id))
        }
      }
    } else {
      // No listings found — mark all as ended
      await db
        .update(schema.ebayListings)
        .set({ listingStatus: 'ended', updatedAt: now })
        .where(eq(schema.ebayListings.listingStatus, 'active'))
    }

    // Log success
    await db.insert(schema.ebaySyncLog).values({
      status: 'success',
      listingsSynced: listings.length,
      startedAt: now,
      completedAt: new Date().toISOString(),
    })

    return { synced: listings.length }
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error'

    // Log failure
    await db.insert(schema.ebaySyncLog).values({
      status: 'failed',
      errorMessage: errorMsg,
      startedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
    })

    return { synced: 0, error: errorMsg }
  }
}

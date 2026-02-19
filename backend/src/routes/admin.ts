import { Hono } from 'hono'
import { eq, desc } from 'drizzle-orm'
import { createDb, schema } from '../db'
import { authMiddleware } from '../middleware/auth'
import { syncEbayListings } from '../services/ebaySync'

type Bindings = {
  DB: D1Database
  EBAY_CLIENT_ID: string
  EBAY_CLIENT_SECRET: string
  EBAY_AFFILIATE_CAMPAIGN_ID?: string
}

const app = new Hono<{ Bindings: Bindings }>()

// All admin routes require authentication + admin role
app.use('*', authMiddleware)
app.use('*', async (c, next) => {
  const isAdmin = c.get('isAdmin')
  if (!isAdmin) {
    return c.json({ error: 'Admin access required' }, 403)
  }
  await next()
})

// POST /api/admin/ebay-sync - Manual trigger for eBay sync
app.post('/ebay-sync', async (c) => {
  try {
    const db = createDb(c.env.DB)
    const result = await syncEbayListings(db, schema, {
      EBAY_CLIENT_ID: c.env.EBAY_CLIENT_ID,
      EBAY_CLIENT_SECRET: c.env.EBAY_CLIENT_SECRET,
      EBAY_AFFILIATE_CAMPAIGN_ID: c.env.EBAY_AFFILIATE_CAMPAIGN_ID,
    })

    if (result.error) {
      return c.json({ success: false, error: result.error }, 500)
    }

    return c.json({ success: true, listingsSynced: result.synced })
  } catch (error) {
    console.error('Manual eBay sync error:', error)
    return c.json({ error: 'Sync failed' }, 500)
  }
})

// GET /api/admin/ebay-sync/status - Get recent sync logs
app.get('/ebay-sync/status', async (c) => {
  try {
    const db = createDb(c.env.DB)
    const logs = await db
      .select()
      .from(schema.ebaySyncLog)
      .orderBy(desc(schema.ebaySyncLog.startedAt))
      .limit(10)

    return c.json(logs)
  } catch (error) {
    console.error('Sync status error:', error)
    return c.json({ error: 'Failed to fetch sync status' }, 500)
  }
})

// GET /api/admin/orders - View all orders
app.get('/orders', async (c) => {
  try {
    const db = createDb(c.env.DB)
    const allOrders = await db
      .select()
      .from(schema.orders)
      .orderBy(desc(schema.orders.createdAt))

    return c.json(allOrders)
  } catch (error) {
    console.error('Orders fetch error:', error)
    return c.json({ error: 'Failed to fetch orders' }, 500)
  }
})

// PATCH /api/admin/orders/:id - Update order status
app.patch('/orders/:id', async (c) => {
  try {
    const orderId = c.req.param('id')
    const body = await c.req.json()
    const { status } = body

    const validStatuses = ['pending', 'paid', 'shipped', 'completed', 'cancelled']
    if (!status || !validStatuses.includes(status)) {
      return c.json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` }, 400)
    }

    const db = createDb(c.env.DB)
    const now = new Date().toISOString()

    await db
      .update(schema.orders)
      .set({ status, updatedAt: now })
      .where(eq(schema.orders.id, orderId))

    return c.json({ success: true })
  } catch (error) {
    console.error('Order update error:', error)
    return c.json({ error: 'Failed to update order' }, 500)
  }
})

export default app

import { Hono } from 'hono'
import { eq } from 'drizzle-orm'
import { createDb, schema } from '../db'
import { createPaymentIntent, verifyWebhookSignature } from '../services/stripeApi'

type Bindings = {
  DB: D1Database
  STRIPE_SECRET_KEY: string
  STRIPE_WEBHOOK_SECRET: string
}

const app = new Hono<{ Bindings: Bindings }>()

// POST /api/checkout/create-intent - Create a Stripe PaymentIntent
app.post('/create-intent', async (c) => {
  try {
    const body = await c.req.json()
    const { listingId, customerEmail, customerName, shippingAddress } = body

    if (!listingId || !customerEmail) {
      return c.json({ error: 'listingId and customerEmail are required' }, 400)
    }

    const db = createDb(c.env.DB)

    // Find the listing
    const [listing] = await db
      .select()
      .from(schema.ebayListings)
      .where(eq(schema.ebayListings.id, listingId))
      .limit(1)

    if (!listing) {
      return c.json({ error: 'Listing not found' }, 404)
    }

    if (listing.listingStatus !== 'active') {
      return c.json({ error: 'Listing is no longer available' }, 400)
    }

    if (!listing.price) {
      return c.json({ error: 'Listing has no price set' }, 400)
    }

    const amountInCents = Math.round(listing.price * 100)

    // Create Stripe PaymentIntent
    const { id: piId, clientSecret } = await createPaymentIntent(
      c.env.STRIPE_SECRET_KEY,
      amountInCents,
      'usd',
      {
        listingId: listing.id,
        ebayItemId: listing.ebayItemId,
        customerEmail,
      }
    )

    // Create order record
    const orderId = `order_${crypto.randomUUID()}`
    await db.insert(schema.orders).values({
      id: orderId,
      ebayListingId: listing.id,
      stripePaymentIntentId: piId,
      stripeCheckoutStatus: 'pending',
      customerEmail,
      customerName: customerName || null,
      shippingAddress: shippingAddress ? JSON.stringify(shippingAddress) : null,
      amount: amountInCents,
      currency: 'usd',
      itemTitle: listing.title,
      status: 'pending',
    })

    return c.json({ clientSecret, orderId })
  } catch (error) {
    console.error('Create intent error:', error)
    return c.json({ error: 'Failed to create payment' }, 500)
  }
})

// POST /api/checkout/webhook - Stripe webhook handler
app.post('/webhook', async (c) => {
  try {
    const signature = c.req.header('stripe-signature')
    if (!signature) {
      return c.json({ error: 'Missing signature' }, 400)
    }

    const payload = await c.req.text()
    const event = await verifyWebhookSignature(
      payload,
      signature,
      c.env.STRIPE_WEBHOOK_SECRET
    )

    const db = createDb(c.env.DB)
    const now = new Date().toISOString()

    switch (event.type) {
      case 'payment_intent.succeeded': {
        const pi = event.data.object
        await db
          .update(schema.orders)
          .set({
            status: 'paid',
            stripeCheckoutStatus: 'succeeded',
            updatedAt: now,
          })
          .where(eq(schema.orders.stripePaymentIntentId, pi.id))
        break
      }

      case 'payment_intent.payment_failed': {
        const pi = event.data.object
        await db
          .update(schema.orders)
          .set({
            status: 'failed',
            stripeCheckoutStatus: 'failed',
            updatedAt: now,
          })
          .where(eq(schema.orders.stripePaymentIntentId, pi.id))
        break
      }
    }

    return c.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return c.json({ error: 'Webhook processing failed' }, 400)
  }
})

// GET /api/checkout/order/:id - Get order status
app.get('/order/:id', async (c) => {
  try {
    const orderId = c.req.param('id')
    const db = createDb(c.env.DB)

    const [order] = await db
      .select({
        id: schema.orders.id,
        status: schema.orders.status,
        itemTitle: schema.orders.itemTitle,
        amount: schema.orders.amount,
        currency: schema.orders.currency,
        createdAt: schema.orders.createdAt,
      })
      .from(schema.orders)
      .where(eq(schema.orders.id, orderId))
      .limit(1)

    if (!order) {
      return c.json({ error: 'Order not found' }, 404)
    }

    return c.json(order)
  } catch (error) {
    console.error('Order fetch error:', error)
    return c.json({ error: 'Failed to fetch order' }, 500)
  }
})

export default app

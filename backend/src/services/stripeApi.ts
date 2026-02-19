// Stripe API client using raw fetch (Cloudflare Workers compatible)
// The official Stripe SDK uses Node.js APIs not available in Workers

const STRIPE_API_BASE = 'https://api.stripe.com/v1'

interface StripePaymentIntent {
  id: string
  client_secret: string
  amount: number
  currency: string
  status: string
  metadata: Record<string, string>
}

interface StripeEvent {
  id: string
  type: string
  data: {
    object: StripePaymentIntent
  }
}

async function stripeRequest<T>(
  secretKey: string,
  endpoint: string,
  method: string = 'GET',
  body?: Record<string, string>
): Promise<T> {
  const headers: Record<string, string> = {
    'Authorization': `Bearer ${secretKey}`,
    'Content-Type': 'application/x-www-form-urlencoded',
  }

  const options: RequestInit = { method, headers }
  if (body) {
    options.body = new URLSearchParams(body).toString()
  }

  const response = await fetch(`${STRIPE_API_BASE}${endpoint}`, options)

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: { message: 'Stripe request failed' } })) as { error?: { message?: string } }
    throw new Error(`Stripe API error (${response.status}): ${error.error?.message || 'Unknown error'}`)
  }

  return response.json() as Promise<T>
}

export async function createPaymentIntent(
  secretKey: string,
  amount: number, // in cents
  currency: string,
  metadata: Record<string, string>
): Promise<{ id: string; clientSecret: string }> {
  const body: Record<string, string> = {
    amount: String(amount),
    currency,
    'automatic_payment_methods[enabled]': 'true',
  }

  // Add metadata
  for (const [key, value] of Object.entries(metadata)) {
    body[`metadata[${key}]`] = value
  }

  const pi = await stripeRequest<StripePaymentIntent>(
    secretKey,
    '/payment_intents',
    'POST',
    body
  )

  return {
    id: pi.id,
    clientSecret: pi.client_secret,
  }
}

// Verify Stripe webhook signature
// Uses the raw crypto API available in Cloudflare Workers
export async function verifyWebhookSignature(
  payload: string,
  signatureHeader: string,
  webhookSecret: string
): Promise<StripeEvent> {
  const parts = signatureHeader.split(',')
  const timestampPart = parts.find(p => p.startsWith('t='))
  const sigPart = parts.find(p => p.startsWith('v1='))

  if (!timestampPart || !sigPart) {
    throw new Error('Invalid Stripe webhook signature format')
  }

  const timestamp = timestampPart.slice(2)
  const signature = sigPart.slice(3)

  // Check timestamp tolerance (5 minutes)
  const age = Math.abs(Date.now() / 1000 - parseInt(timestamp))
  if (age > 300) {
    throw new Error('Webhook timestamp too old')
  }

  // Compute expected signature
  const signedPayload = `${timestamp}.${payload}`
  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(webhookSecret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const mac = await crypto.subtle.sign('HMAC', key, encoder.encode(signedPayload))
  const expectedSig = Array.from(new Uint8Array(mac))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')

  if (expectedSig !== signature) {
    throw new Error('Invalid webhook signature')
  }

  return JSON.parse(payload) as StripeEvent
}

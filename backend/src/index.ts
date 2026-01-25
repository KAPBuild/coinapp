import { Hono } from 'hono'
import { cors } from 'hono/cors'
import authRouter from './routes/auth'
import coinsRouter from './routes/coins'
import pricesRouter from './routes/prices'
import meltRouter from './routes/melt'
import { catalogRoutes } from './routes/catalog'
import { apiRateLimit } from './middleware/rateLimit'
import { createDb } from './db'
import { cleanExpiredSessions } from './utils/sessions'

type Bindings = {
  DB: D1Database
  ENVIRONMENT?: string  // 'production' | 'development'
  ALLOWED_ORIGINS?: string  // Comma-separated list of allowed origins
  NUMISTA_API_KEY?: string  // Numista API key for coin data sync
}

const app = new Hono<{ Bindings: Bindings }>()

// Middleware - CORS with environment-aware configuration
app.use('*', async (c, next) => {
  const env = c.env.ENVIRONMENT || 'development'

  // Parse allowed origins from environment or use defaults
  let allowedOrigins: string[] | string = '*'

  if (env === 'production') {
    // In production, restrict to specific origins
    const originsEnv = c.env.ALLOWED_ORIGINS
    if (originsEnv) {
      allowedOrigins = originsEnv.split(',').map(o => o.trim())
    } else {
      // Default production origins - update these with your actual domains
      allowedOrigins = [
        'https://coinapp.pages.dev',
        'https://www.coinapp.com',
        'https://coinapp.com',
      ]
    }
  }

  const corsMiddleware = cors({
    origin: allowedOrigins,
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    maxAge: 86400, // 24 hours
  })

  return corsMiddleware(c, next)
})

// Apply general rate limiting to all API routes
app.use('/api/*', apiRateLimit)

// Health check
app.get('/health', (c) => {
  return c.json({ status: 'ok' })
})

// API Routes
app.route('/api/auth', authRouter)
app.route('/api/coins', coinsRouter)
app.route('/api/prices', pricesRouter)
app.route('/api/melt', meltRouter)
app.route('/api/catalog', catalogRoutes)

// 404 handler
app.notFound((c) => {
  return c.json({ error: 'Not found' }, 404)
})

// Error handler
app.onError((err, c) => {
  console.error(err)
  return c.json({ error: 'Internal server error' }, 500)
})

// Export with scheduled handler for cron jobs
export default {
  // HTTP request handler
  fetch: app.fetch,

  // Scheduled event handler (cron jobs)
  async scheduled(
    event: ScheduledEvent,
    env: Bindings,
    ctx: ExecutionContext
  ) {
    const db = createDb(env.DB)

    // Determine which cron job triggered
    switch (event.cron) {
      case '0 0 * * *':
        // Daily at midnight - cleanup expired sessions
        console.log('Running scheduled session cleanup...')
        try {
          await cleanExpiredSessions(db)
          console.log('Session cleanup completed successfully')
        } catch (error) {
          console.error('Session cleanup failed:', error)
        }
        break

      case '0 */6 * * *':
        // Every 6 hours - price refresh (placeholder for future implementation)
        console.log('Price refresh cron triggered (not yet implemented)')
        // TODO: Implement price scraping here
        break

      default:
        console.log(`Unknown cron schedule: ${event.cron}`)
    }
  },
}

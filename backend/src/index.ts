import { Hono } from 'hono'
import { cors } from 'hono/cors'
import coinsRouter from './routes/coins'

const app = new Hono()

// Middleware
app.use('*', cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'x-user-id'],
}))

// Health check
app.get('/health', (c) => {
  return c.json({ status: 'ok' })
})

// API Routes
app.route('/api/coins', coinsRouter)

// 404 handler
app.notFound((c) => {
  return c.json({ error: 'Not found' }, 404)
})

// Error handler
app.onError((err, c) => {
  console.error(err)
  return c.json({ error: 'Internal server error' }, 500)
})

export default app

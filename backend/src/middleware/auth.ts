import { Context } from 'hono'
import { createDb } from '../db'
import { validateSession } from '../utils/sessions'

export async function authMiddleware(c: Context, next: () => Promise<void>) {
  const db = createDb(c.env.DB as D1Database)
  const authHeader = c.req.header('Authorization')

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized' }, 401)
  }

  const token = authHeader.substring(7)
  const session = await validateSession(db, token)

  if (!session) {
    return c.json({ error: 'Invalid or expired session' }, 401)
  }

  // Attach userId to context for use in route handlers
  c.set('userId', session.userId)

  await next()
}
